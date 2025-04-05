"use client"

import type React from "react"

import { useState } from "react"
import logo from '../assets/logo.png'

export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Backend connection will be added later
    console.log("Signup", { email, password, name, phone })
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div className="card shadow border-0 mx-auto" style={{ maxWidth: "450px" }}>
        <div className="card-header bg-white border-0 text-center">
          <div className="d-flex justify-content-center mb-4">
            <img src={logo} alt="Serviify Logo" style={{ height: "60px" }} />
          </div>

          <h2 className="card-title fs-3 fw-bold">Create an account</h2>

          <p className="text-muted">
            Fill in your details to get started
          </p>
        </div>

        <div className="card-body pt-3">
          <form onSubmit={handleSubmit} className="mb-3">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control py-2"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control py-2"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control py-2"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control py-2"
              />
            </div>

            <button type="submit" className="btn btn-dark w-100 py-2 mb-3">
              Create account
            </button>
          </form>

          <div className="text-center text-muted" style={{ fontSize: "0.75rem" }}>
            By continuing, you agree to our{" "}
            <a href="/terms-of-service" className="text-primary text-decoration-none">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="text-primary text-decoration-none">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

