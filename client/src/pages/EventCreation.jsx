"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createEvent } from "../store/eventSlice"

const EVENT_CATEGORIES = [
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
]

function EventCreation() {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    category: "",
    image: null,
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(createEvent(eventData)).unwrap()
      navigate("/events")
    } catch (error) {
      console.error("Failed to create event:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setEventData({
      ...eventData,
      [name]: files ? files[0] : value,
    })
  }

  return (
    <div className="max-w-lg mx-auto pt-10 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <input
            type="text"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm transition duration-150 ease-in-out"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm transition duration-150 ease-in-out"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm transition duration-150 ease-in-out"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={eventData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm transition duration-150 ease-in-out"
          >
            <option value="">Select a category</option>
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm transition duration-150 ease-in-out"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
        >
          Create Event
        </button>
      </form>
    </div>
  )
}

export default EventCreation

