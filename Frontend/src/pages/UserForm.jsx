"use client"

import { useState, useRef } from "react"
import { Camera, Mail, Phone, Linkedin, Twitter } from "lucide-react"
import "../App.css"
export default function UserForm() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    bio: "",
    email: "",
    phone: "",
    linkedin: "",
    twitter: "",
    startupName: "",
    startDate: "",
    teamSize: "",
    website: "",
  })

  const [charCount, setCharCount] = useState(0)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "bio") {
      setCharCount(value.length)
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <div className="userform-container">
      <div className="userform-header">
        <h1>👋 Welcome! Let's Build Your Profile</h1>
        <p>Help investors get to know you and your startup better</p>
      </div>

      <form className="userform" onSubmit={handleSubmit}>
        {/* About You Section */}
        <div className="form-section">
          <div className="section-header">
            <h2>🎯 About You</h2>
            <p>Tell us about the amazing person behind the startup</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>
                What's your name? <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Sarah Johnson"
                required
              />
            </div>

            <div className="form-group">
              <label>What's your role?</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="e.g., CEO & Co-Founder"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Add your photo</label>
              <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                {photoPreview ? (
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      margin: "0 auto",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <Camera className="upload-icon" />
                    <span>Drop your photo here or click to browse</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="file-input"
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Where are you based?</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., San Francisco, USA"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Tell your story</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Share your journey, experience, and what drives you..."
              maxLength={500}
            ></textarea>
            <div className="char-count">{charCount}/500 characters</div>
          </div>

          {/* Social Links Section */}
          <div className="social-links-section">
            <h3>Connect With Me</h3>
            <div className="social-links-grid">
              <div className="form-group">
                <label className="icon-label">
                  <Mail className="input-icon" />
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="icon-label">
                  <Phone className="input-icon" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label className="icon-label">
                  <Linkedin className="input-icon" />
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="linkedin.com/in/yourprofile"
                />
              </div>

              <div className="form-group">
                <label className="icon-label">
                  <Twitter className="input-icon" />
                  Twitter/X
                </label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="twitter.com/yourhandle"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Startup Section */}
        <div className="form-section">
          <div className="section-header">
            <h2>🚀 Your Startup</h2>
            <p>Tell us about the company you're building</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>
                Startup name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="startupName"
                value={formData.startupName}
                onChange={handleInputChange}
                placeholder="e.g., TechFlow AI"
                required
              />
            </div>

            <div className="form-group">
              <label>When did you start?</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Current team size</label>
              <input
                type="number"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Company website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="e.g., https://techflow.ai"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary">
            Save as Draft
          </button>
          <button type="submit" className="btn-primary">
            Complete Profile
          </button>
        </div>
      </form>
    </div>
  )
}

