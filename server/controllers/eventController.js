const Event = require('../models/Event');
const cloudinary = require('../utils/cloudinary');
const { getIO } = require('../utils/socketManager');
const fs = require('fs');

exports.getEvents = async (req, res) => {
  try {
    const { category, date } = req.query;
    let query = {};
    if (category) query.category = category;
    if (date) query.date = { $gte: new Date(date) };
    const events = await Event.find(query).populate('creator', 'name');
    res.json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('creator', 'name');
    if (!event) throw new Error('Event not found');
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { name, description, date, category } = req.body;
    
    // Validate required fields
    if (!name || !description || !date || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { name, description, date, category }
      });
    }

    // Validate category
    const validCategories = [
      "Social Events",
      "Corporate Events",
      "Cultural Events",
      "Sporting Events",
      "Educational Events",
      "Political Events",
      "Charity Events",
      "Religious Events",
      "Trade and Commercial Events",
      "Entertainment Events",
      "Environmental Events",
      "Technological Events",
      "Government Events"
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: 'Invalid category',
        received: category,
        validCategories
      });
    }

    // Validate date
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        error: 'Invalid date format',
        received: date
      });
    }

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(400).json({
          error: 'Failed to upload image',
          details: uploadError.message
        });
      }
    }

    // Create and save the event
    const event = new Event({
      name,
      description,
      date: dateObj,
      category,
      image: imageUrl,
      creator: req.user._id,
      attendees: [] // Initialize empty attendees array
    });

    await event.save();
    
    // Populate creator details before sending response
    await event.populate('creator', 'name');
    
    // Emit socket event
    getIO().emit('newEvent', {
      event,
      message: `New event "${event.name}" has been created!`
    });
    
    // Send success response
    res.status(201).json(event);

  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to create event',
      details: error.errors // Include mongoose validation errors if any
    });
  }
};

exports.attendEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new Error('Event not found');
    
    if (event.attendees.includes(req.user._id)) {
      throw new Error('You are already attending this event');
    }
    
    event.attendees.push(req.user._id);
    await event.save();
    
    // Emit to event room
    getIO().to(`event:${event._id}`).emit('eventUpdated', {
      eventId: event._id,
      attendeesCount: event.attendees.length,
      message: `${req.user.name} is now attending this event!`
    });
    
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add new method to handle event cancellation
exports.cancelEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      creator: req.user._id 
    });
    
    if (!event) {
      throw new Error('Event not found or unauthorized');
    }

    await Event.deleteOne({ _id: event._id });
    
    // Notify all users in the event room
    getIO().to(`event:${event._id}`).emit('eventCancelled', {
      eventId: event._id,
      message: `Event "${event.name}" has been cancelled`
    });
    
    res.json({ message: 'Event cancelled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add this function to handle event updates
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date, category } = req.body;
    
    // Find event and check ownership
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if the current user is the creator
    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        name,
        description,
        date,
        category
      },
      { new: true }
    )
    .populate('creator', 'name')
    .populate('attendees', 'name email createdAt');

    // Emit socket event for real-time updates
    getIO().emit('eventUpdated', {
      type: 'eventModified',
      eventId: updatedEvent._id,
      event: updatedEvent,
      message: `Event "${updatedEvent.name}" has been updated`
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};
