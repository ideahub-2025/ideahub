import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { Camera, FileCheck, Building, Briefcase, DollarSign, Phone, Linkedin, Twitter } from "lucide-react";
import Select from "react-select";
import axios from "axios"; // Don't forget to install axios if you don't have it
import "../App.css";

export default function InvestorForm() {
  const { state } = useLocation(); // Get the passed state
  const { username, fullName, email } = state || {}; // Destructure the state

  const [formData, setFormData] = useState({
    role: "",
    location: "",
    bio: "",
    phone: "",
    linkedin: "",
    twitter: "",
    firmName: "",
    investmentStage: "",
    portfolioSize: "",
    website: "",
    minInvestment: "",
    maxInvestment: "",
    sectors: "",
  });

  const [charCount, setCharCount] = useState(0);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [idDocumentPreview, setIdDocumentPreview] = useState(null);
  const fileInputRef = useRef(null);
  const idDocumentRef = useRef(null);
  
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

  const handleIdDocumentUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setIdDocumentPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSectorChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      sectors: selectedOption ? selectedOption.map((option) => option.value).join(", ") : "",
    }));
  };

  const sectorsOptions = [
    { value: "AI", label: "AI" },
    { value: "FinTech", label: "FinTech" },
    { value: "SaaS", label: "SaaS" },
    { value: "Climate Tech", label: "Climate Tech" },
    { value: "Biotech", label: "Biotech" },
    { value: "HealthTech", label: "HealthTech" },
    { value: "Blockchain", label: "Blockchain" },
    { value: "E-Commerce", label: "E-Commerce" },
    { value: "EdTech", label: "EdTech" },
    { value: "Cybersecurity", label: "Cybersecurity" },
    { value: "Other", label: "Other" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that ID document is provided
    if (!idDocumentPreview) {
      alert("Proof of identity document is required!");
      return;
    }

    // Prepare form data for submission
    const dataToSubmit = {
      ...formData,
      username,
      full_name:fullName,
      email,
      profile_picture: photoPreview, // Send base64 image or file URL
      id_document: idDocumentPreview, // Send base64 document
    };

    try {
      // Make the API call to submit the form
      const response = await axios.post("http://localhost:8000/api/investors/", dataToSubmit, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Profile successfully created! Redirecting...");
        setErrorMessage(null);

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/"); // Adjust the URL as needed
        }, 3000);
      } else {
        throw new Error("An error occurred while submitting the form.");
      }
    } catch (error) {
      setErrorMessage("There was an issue with the submission. Please try again later.");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="userform-container">
      <div className="userform-header">
        <h1>👋 Welcome! Let's Validate Your Investor Profile</h1>
        <p>Complete your details to get started connecting with promising startups</p>
      </div>

      <form className="userform" onSubmit={handleSubmit}>
        {/* About You Section */}
        <div className="form-section">
          <div className="section-header">
            <h2>🎯 About You</h2>
            <p>Tell us about your investment focus and background</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="required-field">What's your role?</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="e.g., Angel Investor, VC Partner"
                required
              />
            </div>

            <div className="form-group">
              <label className="required-field">Where are you based?</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., New York, USA"
                required
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
              <label className="required-field">Upload Proof of Identity</label>
              <div 
                className={`upload-zone ${!idDocumentPreview ? 'upload-required' : ''}`} 
                onClick={() => idDocumentRef.current?.click()}
              >
                {idDocumentPreview ? (
                  <div style={{ textAlign: "center" }}>
                    <FileCheck className="upload-icon" style={{ color: "#4CAF50" }} />
                    <span>Document uploaded successfully</span>
                    <div className="document-name">Click to change</div>
                  </div>
                ) : (
                  <>
                    <FileCheck className="upload-icon" />
                    <span>Upload ID/Passport/Driver's License (Required)</span>
                    <div className="document-name">Your information is kept secure</div>
                  </>
                )}
                <input
                  ref={idDocumentRef}
                  type="file"
                  accept="image/*, application/pdf"
                  className="file-input"
                  onChange={handleIdDocumentUpload}
                  required
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
              placeholder="Share your investment philosophy, experience, and what type of founders you like to support..."
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

        {/* Investment Firm Section */}
        <div className="form-section">
          <div className="section-header">
            <h2>💼 Your Investment Firm</h2>
            <p>Tell us about your investment strategy and focus</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="required-field">Firm Name</label>
              <input
                type="text"
                name="firmName"
                value={formData.firmName}
                onChange={handleInputChange}
                placeholder="e.g., Sequoia Capital, or Independent Angel"
                required
              />
            </div>

            <div className="form-group">
              <label className="required-field">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="e.g., https://yourfirm.com"
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Investment Stage Focus</label>
              <select 
                name="investmentStage"
                value={formData.investmentStage}
                onChange={handleInputChange}
              >
                <option value="">Select investment stage...</option>
                <option value="pre-seed">Pre-seed</option>
                <option value="seed">Seed</option>
                <option value="series-a">Series A</option>
                <option value="series-b">Series B</option>
                <option value="growth">Growth</option>
                <option value="all">All Stages</option>
              </select>
            </div>

            <div className="form-group">
              <label>Number of Investments</label>
              <input
                type="number"
                name="portfolioSize"
                value={formData.portfolioSize}
                onChange={handleInputChange}
                placeholder="e.g., 15"
                min="0"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Min Investment Amount</label>
              <input
                type="text"
                name="minInvestment"
                value={formData.minInvestment}
                onChange={handleInputChange}
                placeholder="e.g., $25,000"
              />
            </div>

            <div className="form-group">
              <label>Max Investment Amount</label>
              <input
                type="text"
                name="maxInvestment"
                value={formData.maxInvestment}
                onChange={handleInputChange}
                placeholder="e.g., $250,000"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Investment Sectors</label>
            <Select
              isMulti
              options={sectorsOptions}
              onChange={handleSectorChange}
              value={formData.sectors.split(", ").map((sector) => ({ value: sector, label: sector }))}
              placeholder="Select sectors"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Verify & Complete Profile
          </button>
        </div>
      </form>
    </div>
  )
}
