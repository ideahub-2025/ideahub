import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import axios from "axios";
import { Camera, Phone, Linkedin, Twitter } from "lucide-react";
import "../App.css";

export default function UserForm() {
  const { state } = useLocation(); // Get the passed state
  const { username, fullName, role, email } = state || {}; // Destructure the state

  // Use this data as needed
  console.log(username, fullName, role, email);

  const [formData, setFormData] = useState({
    job_role: "",
    location: "",
    bio: "",
    phone: "",
    linkedin: "",
    twitter: "",
    startupName: "",
    startDate: "",
    teamSize: "",
    website: "",
  });

  const [charCount, setCharCount] = useState(0);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate(); // Hook for navigation

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "bio") {
      setCharCount(value.length);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data for submission
    const dataToSubmit = {
      ...formData,
      username,
      fullName,
      email,
      photo: photoPreview, // You might want to send the base64 image or a file URL
    };

    try {
      // Make the API call to register the user
      const response = await axios.post("http://localhost:8000/api/create_entrepreneur_profile/", dataToSubmit,{
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Profile successfully created! Redirecting to homepage...");
        setErrorMessage(null);

        // Redirect to homepage after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        throw new Error("An error occurred during registration.");
      }
    } catch (error) {
      setErrorMessage("There was an issue with the registration. Please try again later.");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="userform-container">
      <div className="userform-header">
        <h1>👋 Welcome! Let's Build Your Profile</h1>
        <p>Help investors get to know you and your startup better</p>
      </div>

      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      <form className="userform" onSubmit={handleSubmit}>
        {/* About You Section */}
        <div className="form-section">
          <div className="section-header">
            <h2>🎯 About You</h2>
            <p>Tell us about the amazing person behind the startup</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>What's your role?</label>
              <input
                type="text"
                name="role"
                value={formData.job_role}
                onChange={handleInputChange}
                placeholder="e.g., CEO & Co-Founder"
              />
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
          </div>

          <div className="form-group full-width">
            <label>Your Bio</label>
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
                Startup name
              </label>
              <input
                type="text"
                name="startupName"
                value={formData.startupName}
                onChange={handleInputChange}
                placeholder="e.g., TechFlow AI"
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
          <button type="submit" className="btn-primary">
            Complete Profile
          </button>
        </div>
      </form>
    </div>
  );
}
