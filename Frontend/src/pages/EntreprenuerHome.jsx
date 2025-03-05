"use client"

import { useRef, useState } from "react"
import "../App.css"
import {Camera, Bell, MessageSquare, Search, Lightbulb, PlusCircle, ChevronRight, Star, ThumbsUp } from "lucide-react"
import Entreprenuer from "../assets/ENT.jpg"
import pp from "../assets/defaultpp.jpg"
export default function EntHome() {
  const [activeTab, setActiveTab] = useState("trending")
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)
  
  const [idea, setIdea] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [trendingIdeas, setTrendingIdeas] = useState([
    {
      id: 1,
      title: "Sustainable Packaging Solution",
      description: "Biodegradable packaging made from agricultural waste that decomposes within 30 days.",
      author: "Jane Cooper",
      avatar: "/placeholder.svg?height=40&width=40",
      likes: 128,
      comments: 32,
      category: "Sustainability",
    },
    {
      id: 2,
      title: "AI-Powered Financial Advisor",
      description:
        "Personal finance app that uses AI to provide customized investment advice based on spending habits.",
      author: "Robert Fox",
      avatar: "/placeholder.svg?height=40&width=40",
      likes: 95,
      comments: 18,
      category: "Fintech",
    },
    {
      id: 3,
      title: "Remote Healthcare Platform",
      description: "Telemedicine platform connecting patients with specialists worldwide using AR technology.",
      author: "Wade Warren",
      avatar: "/placeholder.svg?height=40&width=40",
      likes: 87,
      comments: 24,
      category: "Healthcare",
    },
  ])

  const handleIdeaChange = (e) => {
    setIdea(e.target.value)
  }

  const handleSubmitIdea = (e) => {
    e.preventDefault()
    if (idea.trim()) {
      setIsDialogOpen(false)
      // In a real app, you would save the idea to your backend
      alert("Your idea has been posted successfully!")
      setIdea("")
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
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

  return (
    <div>
      {/* Header/Navigation */}
      <header className="headerSection">
        <div className="EntContainer">
          <nav className="navigationBar">
          <a href="/" className="logoContainer">
              <Lightbulb className="logoIcon" />
              <span className="logoText">IdeaHub</span>
            </a>


            <div className="searchWrapper">
              <Search className="searchIconWrapper" />
              <input type="text" className="searchInput" placeholder="Search ideas, investors, entrepreneurs..." />
            </div>

            <div className="userActions">
              <button className="iconButton">
                <Bell />
              </button>
              <button className="iconButton">
                <MessageSquare />
              </button>
              <div className="userAvatar">
                <img src={pp} alt="User" />
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="heroSection">
        <div className="EntContainer">
          <div className="heroWrapper">
            <div className="heroContent">
              <h1 className="heroTitle">Turn Your Ideas Into Reality</h1>
              <p className="heroSubtitle">
                Share your innovative concepts and connect with investors who can help bring them to life.
              </p>
              <button className="primaryButton" onClick={() => setIsDialogOpen(true)}>
                <PlusCircle />
                Post Your Idea
              </button>
            </div>
            <div className="heroImageContainer">
              <img src={Entreprenuer} alt="Entrepreneur Illustration" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="dashboardSection">
        <div className="EntContainer">
          <div className="dashboardLayout">
            {/* Sidebar */}
            <div className="sidebarSection">
              {/* Profile Card */}
              <div className="card">
                <div className="cardHeader">
                  <h2 className="cardTitle">Your Profile</h2>
                </div>
                <div className="cardContent">
                  <div className="profileSection">
                    <div className="profilePicture">
                      <img src={pp} alt="Profile" />
                    </div>
                    <h3 className="userName">Alex Johnson</h3>
                    <p className="userRole">Tech Entrepreneur</p>
                  </div>
                  <div className="statsSection">
                    <div className="statRow">
                      <span className="statName">Ideas Posted</span>
                      <span className="statValue">12</span>
                    </div>
                    <div className="statRow">
                      <span className="statName">Investor Connections</span>
                      <span className="statValue">8</span>
                    </div>
                    <div className="statRow">
                      <span className="statName">Profile Completion</span>
                      <span className="statValue">85%</span>
                    </div>
                  </div>
                  <button className="secondaryButton">Edit Profile</button>
                </div>
              </div>

              {/* Events Card */}
              <div className="card">
                <div className="cardHeader">
                  <h2 className="cardTitle">Upcoming Events</h2>
                </div>
                <div className="cardContent">
                  <div className="eventItem">
                    <h4 className="eventName">Startup Pitch Competition</h4>
                    <p className="eventDetails">May 15, 2023 • Virtual</p>
                  </div>
                  <div className="eventItem">
                    <h4 className="eventName">Investor Networking Mixer</h4>
                    <p className="eventDetails">May 22, 2023 • San Francisco</p>
                  </div>
                  <div className="eventItem">
                    <h4 className="eventName">Tech Innovation Summit</h4>
                    <p className="eventDetails">June 5, 2023 • New York</p>
                  </div>
                  <button className="textLink">
                    View all events
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="mainContent">
              <div className="tabsContainer">
                <div className="tabsList">
                  <button
                    className={`tabButton ${activeTab === "trending" ? "tabButtonActive" : ""}`}
                    onClick={() => handleTabChange("trending")}
                  >
                    Trending Ideas
                  </button>
                  <button
                    className={`tabButton ${activeTab === "your-ideas" ? "tabButtonActive" : ""}`}
                    onClick={() => handleTabChange("your-ideas")}
                  >
                    Your Ideas
                  </button>
                  <button
                    className={`tabButton ${activeTab === "saved" ? "tabButtonActive" : ""}`}
                    onClick={() => handleTabChange("saved")}
                  >
                    Saved
                  </button>
                </div>

                {/* Trending Ideas Tab */}
                <div className={`tabPanel ${activeTab === "trending" ? "tabPanelActive" : ""}`}>
                  {trendingIdeas.map((idea) => (
                    <div key={idea.id} className="ideaCard">
                      <div className="ideaCardHeader">
                        <div className="ideaTitleSection">
                          <h3 className="ideaTitle">{idea.title}</h3>
                          <div className="authorInfo">
                            <div className="authorPicture">
                              <img src={pp} alt={idea.author} />
                            </div>
                            <span className="authorName">{idea.author}</span>
                          </div>
                        </div>
                        <span className="categoryTag">{idea.category}</span>
                      </div>
                      <div className="ideaCardContent">
                        <p className="ideaDescription">{idea.description}</p>
                      </div>
                      <div className="ideaCardFooter">
                        <div className="engagementActions">
                          <button className="engagementButton">
                            <ThumbsUp />
                            {idea.likes}
                          </button>
                          <button className="engagementButton">
                            <MessageSquare />
                            {idea.comments}
                          </button>
                        </div>
                        <button className="saveButton">
                          <Star />
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="loadMoreButton">Load More Ideas</button>
                </div>

                {/* Your Ideas Tab */}
                <div className={`tabPanel ${activeTab === "your-ideas" ? "tabPanelActive" : ""}`}>
                  <div className="card">
                    <div className="cardHeader">
                      <h2 className="cardTitle">Your Ideas</h2>
                      <p className="cardDescription">Manage and track the progress of your submitted ideas.</p>
                    </div>
                    <div className="emptyState">
                      <div className="emptyStateIcon">
                        <Lightbulb />
                      </div>
                      <h3 className="emptyStateTitle">No ideas posted yet</h3>
                      <p className="emptyStateMessage">Share your first idea to connect with potential investors</p>
                      <button className="accentButton" onClick={() => setIsDialogOpen(true)}>
                        Post Your First Idea
                      </button>
                    </div>
                  </div>
                </div>

                {/* Saved Tab */}
                <div className={`tabPanel ${activeTab === "saved" ? "tabPanelActive" : ""}`}>
                  <div className="card">
                    <div className="cardHeader">
                      <h2 className="cardTitle">Saved Ideas</h2>
                      <p className="cardDescription">Ideas you've saved for later reference.</p>
                    </div>
                    <div className="emptyState">
                      <div className="emptyStateIcon">
                        <Star />
                      </div>
                      <h3 className="emptyStateTitle">No saved ideas yet</h3>
                      <p className="emptyStateMessage">Browse trending ideas and save the ones you find interesting</p>
                      <button className="secondaryButton" onClick={() => handleTabChange("trending")}>
                        Explore Trending Ideas
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Investor Spotlight Section */}
      <section className="spotlightSection">
        <div className="EntContainer">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Investor Spotlight</h2>
            <button className="textLink">
              View All
              <ChevronRight />
            </button>
          </div>

          <div className="cardsGrid">
            {[1, 2, 3].map((investor) => (
              <div key={investor} className="investorCard">
                <div className="investorHeader">
                  <div className="investorProfile">
                    <div className="investorPicture">
                      <img src={pp} alt="Investor" />
                    </div>
                    <div className="investorInfo">
                      <h3 className="investorName">Venture Capital Firm {investor}</h3>
                      <p className="investorSpecialty">Technology & Healthcare</p>
                    </div>
                  </div>
                </div>
                <div className="investorContent">
                  <p className="investorBio">
                    Looking for innovative startups in AI, blockchain, and digital health with proven traction.
                  </p>
                  <div className="tagsList">
                    <span className="tag">AI</span>
                    <span className="tag">Blockchain</span>
                    <span className="tag">Healthcare</span>
                  </div>
                </div>
                <div className="investorFooter">
                  <button className="viewProfileButton">View Profile</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footerSection">
        <div className="EntContainer">
          <div className="footerLayout">
            <div className="footerColumn">
              <h3>IdeaHub</h3>
              <p>Connecting innovative entrepreneurs with investors to bring great ideas to life.</p>
            </div>
            <div className="footerColumn">
              <h3>Quick Links</h3>
              <ul className="footerLinks">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Browse Ideas</a>
                </li>
                <li>
                  <a href="#">Find Investors</a>
                </li>
                <li>
                  <a href="#">Events</a>
                </li>
              </ul>
            </div>
            <div className="footerColumn">
              <h3>Resources</h3>
              <ul className="footerLinks">
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Startup Guide</a>
                </li>
                <li>
                  <a href="#">Pitch Templates</a>
                </li>
                <li>
                  <a href="#">Success Stories</a>
                </li>
              </ul>
            </div>
            <div className="footerColumn">
              <h3>Connect</h3>
              <ul className="footerLinks">
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">Support</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footerCopyright">
            <p>© 2023 IdeaHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Idea Submission Dialog */}
      {isDialogOpen && (
        <div className="modalOverlay" onClick={() => setIsDialogOpen(false)}>
        <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
          <div className="modalHeader">
            <h2 className="modalTitle">Share Your Brilliant Idea</h2>
            <p className="modalDescription">
              Describe your idea in detail to attract potential investors and collaborators.
            </p>
          </div>
          <form onSubmit={handleSubmitIdea}>
            <div className="modalContent">
              <div className="formLayout">
                <div className="formGroup">
                  <input type="text" className="formInput" placeholder="Idea Title" required />
                </div>
                <div className="formGroup">
                  <select className="formSelect" required>
                    <option value="">Select Category</option>
                    <option value="tech">Technology</option>
                    <option value="health">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="sustainability">Sustainability</option>
                  </select>
                </div>
                <div className="formGroup">
                  <textarea
                    className="formTextarea"
                    placeholder="Describe your idea in detail..."
                    value={idea}
                    onChange={handleIdeaChange}
                    required
                  />
                </div>
                {/* Add Image Upload Field */}
                <div className="formGroup">
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
            </div>
            <div className="modalFooter">
              <button type="button" className="cancelButton" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="submitButton">
                Post Idea
              </button>
            </div>
          </form>
        </div>
      </div>
      
      )}
    </div>
  )
}

