"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getEvents, updateEventAttendees } from "../store/eventSlice"
import socketService from "../utils/socketService"

const EVENT_CATEGORIES = [
  "Social Events",
  "Corporate Events",
  "Cultural Events",
  "Sporting Events",
  "Educational Events",
  "Political Events",
  "Religious Events",
  "Entertainment Events",
]

function EventDashboard() {
  const [filter, setFilter] = useState({ category: "", date: "" })
  const dispatch = useDispatch()
  const { list: events, status } = useSelector((state) => state.events)
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    const fetchFilteredEvents = async () => {
      try {
        const params = {};
        if (filter.category) params.category = filter.category;
        if (filter.date) params.date = filter.date;
        
        dispatch(getEvents(params));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchFilteredEvents();

    // Connect to socket
    const socket = socketService.connect()

    // Listen for event updates
    socket.on('eventUpdated', (data) => {
      if (data.type === 'newAttendee') {
        // Update the specific event's attendees in the list
        dispatch(updateEventAttendees({
          eventId: data.eventId,
          attendees: data.attendees
        }))
      }
    })

    return () => {
      socket.off('eventUpdated')
    }
  }, [dispatch, filter.category, filter.date])

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Discover Events
          </h1>
          {user && (
            <Link
              to="/events/create"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Event</span>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">All Categories</option>
                {EVENT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={filter.date}
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {status === "loading" ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">
                      {event.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {event.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-gray-600 text-sm">
                        {event.attendees?.length || 0} Attendees
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>By {event.creator?.name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {events.length === 0 && status !== "loading" && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8m-2 12a2 2 0 01-2-2v-1" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or create a new event.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDashboard

