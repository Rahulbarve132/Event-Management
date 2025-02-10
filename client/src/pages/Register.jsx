"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { register } from "../store/authSlice"
import "./auth.css"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(register({ name, email, password })).unwrap()
      navigate("/events")
    } catch (err) {
      console.error("Registration failed:", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1b26] flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-20 text-center text-[#c2fd4c]">Create Account</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <form className="stackedForm flex " onSubmit={handleSubmit}>
          <ul className="wrapper">
            <li style={{ "--i": "4" }}>
              <input
                type="text"
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            </li>
            <li style={{ "--i": "3" }}>
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </li>
            <li style={{ "--i": "2" }}>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </li>
            <button 
              type="submit" 
              style={{ "--i": "1" }}
              disabled={status === "loading"}
            >
              <span>{status === "loading" ? "Creating Account..." : "Register"}</span>
            </button>
          </ul>
        </form>
      </div>
    </div>
  )
}

export default Register

