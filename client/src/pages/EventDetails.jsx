"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getEventById, attendEvent, unattendEvent, updateEventAttendees } from "../store/eventSlice"
import socketService from "../utils/socketService"
import toast from 'react-hot-toast'

function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentEvent: event, status, error } = useSelector((state) => state.events)
  const user = useSelector((state) => state.auth.user)
  const [viewerCount, setViewerCount] = useState(0)
  const [isAttending, setIsAttending] = useState(false)

  const handleAttendEvent = async () => {
    try {
      await dispatch(attendEvent(id)).unwrap()
      toast.success('Successfully joined the event!')
      setIsAttending(true)
      // Emit socket event to notify other users
      socketService.socket?.emit('eventAttended', { 
        eventId: id, 
        userId: user._id,
        type: 'join'
      })
    } catch (error) {
      console.error('Failed to attend event:', error)
      toast.error(error.message || 'Failed to join event')
    }
  }

  const handleUnattendEvent = async () => {
    try {
      await dispatch(unattendEvent(id)).unwrap()
      toast.success('Successfully left the event')
      setIsAttending(false)
      // Emit socket event to notify other users
      socketService.socket?.emit('eventAttended', { 
        eventId: id, 
        userId: user._id,
        type: 'leave'
      })
    } catch (error) {
      console.error('Failed to leave event:', error)
      toast.error(error.message || 'Failed to leave event')
    }
  }

  useEffect(() => {
    dispatch(getEventById(id))

    // Connect to socket and join event room
    const socket = socketService.connect()
    socketService.joinEventRoom(id)

    // Socket event listeners
    socket.on('viewerCount', ({ count }) => {
      setViewerCount(count)
    })

    socket.on('eventUpdated', (data) => {
      if (data.eventId === id) {
        if (data.type === 'newAttendee') {
          // Update attendees list in real-time
          dispatch(updateEventAttendees({
            eventId: data.eventId,
            attendees: data.attendees
          }));
          toast.success(data.message);
        } else {
          // Refresh full event data for other updates
          dispatch(getEventById(id));
        }
      }
    })

    socket.on('eventCancelled', (data) => {
      if (data.eventId === id) {
        toast.error(data.message)
        navigate('/events')
      }
    })

    // Cleanup
    return () => {
      socketService.leaveEventRoom(id)
      socket.off('viewerCount')
      socket.off('eventUpdated')
      socket.off('eventCancelled')
    }
  }, [dispatch, id, navigate])

  // Check if user is attending when event data changes
  useEffect(() => {
    if (event && user) {
      setIsAttending(event.attendees.includes(user._id))
    }
  }, [event, user])

  // Add this function to format join date
  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (status === "loading") return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!event) return <div>Event not found</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link 
          to="/events" 
          className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to Events
        </Link>
      </div>
      <h2 className="text-3xl font-bold mb-4">{event.name}</h2>
      <div className="text-sm text-gray-500 mb-4">
        Current Viewers: {viewerCount}
      </div>
      <img
        src={event.image || "/placeholder.svg"}
        alt={event.name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <p className="text-gray-700 mb-4">{event.description}</p>
      <p className="text-gray-600 mb-2">Date: {new Date(event.date).toLocaleString()}</p>
      <p className="text-gray-600 mb-2">Category: {event.category}</p>
      
      {/* Updated Attendees section */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          Attendees ({event.attendees.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {event.attendees.map((attendee) => (
            <div 
              key={attendee._id}
              className="group relative"
            >
              <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                <span>{attendee.name}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-blue-600 cursor-pointer hover:text-blue-800"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  <div className="font-semibold">{attendee.name}</div>
                  <div>Email: {attendee.email}</div>
                  <div>Joined: {formatJoinDate(attendee.createdAt)}</div>
                  {/* Arrow */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="border-solid border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      {user && (
        <div className="space-y-4">
          {!isAttending ? (
            <button 
              onClick={handleAttendEvent}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              disabled={status === 'loading'}
            >
              <span>I will attend</span>
              {status === 'loading' && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-2">
                You're attending this event
              </div>
              <button 
                onClick={handleUnattendEvent}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                disabled={status === 'loading'}
              >
                <span>I will not attend</span>
                {status === 'loading' && (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EventDetails

