"use client"
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useState, useRef } from "react"
import axios from "axios"
import { Camera, Phone, Linkedin, Twitter } from "lucide-react"
import "../App.css"

export default function ProfileEdit() {
  const { state } = useLocation() // Get the passed state
  const { username, fullName, role, email } = state || {
    username: "alexjohnson",
    fullName: "Alex Johnson",
    role: "Tech Entrepreneur",
    email: "alex@example.com",
  } // Destructure the state with defaults

  useEffect(() => {
    console.log("Editing profile for:", username);
  }, [username]);

  const [formData, setFormData] = useState({
    role: role || "",
    location: "",
    bio: "",
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

  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const navigate = useNavigate() // Hook for navigation

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prepare form data for submission
    const dataToSubmit = {
      ...formData,
      username,
      fullName,
      email,
      photo: photoPreview, // You might want to send the base64 image or a file URL
    }

    try {
      // Make the API call to update the user profile
      const response = await axios.put(
        `http://localhost:8000/api/update_entrepreneur_profile/${username}/`,
        dataToSubmit,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (response.status === 200) {
        setSuccessMessage("Profile successfully updated! Redirecting to dashboard...")
        setErrorMessage(null)

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/dashboard")
        }, 2000)
      } else {
        throw new Error("An error occurred during profile update.")
      }
    } catch (error) {
      setErrorMessage("There was an issue updating your profile. Please try again later.")
      setSuccessMessage(null)
    }
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <h1>✏️ Edit Your Profile</h1>
      </div>

      {successMessage && (
        <div className="edit-success-message">
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="edit-error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        {/* About You Section */}
        <div className="edit-form-section">
          <div className="edit-section-header">
            <h2>🎯 About You</h2>
            <p>Tell us about the amazing person behind the startup</p>
          </div>

          <div className="edit-form-grid">
            <div className="edit-form-group">
              <label>Full Name</label>
              <input type="text" value={fullName} disabled className="edit-disabled-input" />
              <span className="edit-input-note">Name cannot be changed</span>
            </div>

            <div className="edit-form-group">
              <label>Email Address</label>
              <input type="email" value={email} disabled className="edit-disabled-input" />
              <span className="edit-input-note">Email cannot be changed</span>
            </div>
          </div>

          <div className="edit-form-grid">
            <div className="edit-form-group">
              <label>What's your role?</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="e.g., CEO & Co-Founder"
              />
            </div>

            <div className="edit-form-group">
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

          <div className="edit-form-grid">
            <div className="edit-form-group">
              <label>Profile Photo</label>
              <div className="edit-upload-zone" onClick={() => fileInputRef.current?.click()}>
                {photoPreview ? (
                  <div className="edit-photo-preview">
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Profile Preview"
                      className="edit-preview-image"
                    />
                  </div>
                ) : (
                  <>
                    <Camera className="edit-upload-icon" />
                    <span>Drop your photo here or click to browse</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="edit-file-input"
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>
          </div>

          <div className="edit-form-group full-width">
            <label>Your Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Share your journey, experience, and what drives you..."
              maxLength={500}
            ></textarea>
            <div className="edit-char-count">{charCount}/500 characters</div>
          </div>

          {/* Social Links Section */}
          <div className="edit-social-links-section">
            <h3>Connect With Me</h3>
            <div className="edit-social-links-grid">
              <div className="edit-form-group">
                <label className="edit-icon-label">
                  <Phone className="edit-input-icon" />
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

              <div className="edit-form-group">
                <label className="edit-icon-label">
                  <Linkedin className="edit-input-icon" />
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

              <div className="edit-form-group">
                <label className="edit-icon-label">
                  <Twitter className="edit-input-icon" />
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
        <div className="edit-form-section">
          <div className="edit-section-header">
            <h2>🚀 Your Startup</h2>
            <p>Tell us about the company you're building</p>
          </div>

          <div className="edit-form-grid">
            <div className="edit-form-group">
              <label>Startup name</label>
              <input
                type="text"
                name="startupName"
                value={formData.startupName}
                onChange={handleInputChange}
                placeholder="e.g., TechFlow AI"
              />
            </div>

            <div className="edit-form-group">
              <label>When did you start?</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
            </div>
          </div>

          <div className="edit-form-grid">
            <div className="edit-form-group">
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

            <div className="edit-form-group">
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

        <div className="edit-form-actions">
          <button type="button" className="edit-btn-secondary" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
          <button type="submit" className="edit-btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

