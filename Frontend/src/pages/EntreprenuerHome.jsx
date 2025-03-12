"use client"

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Camera, Bell, MessageSquare, Search, Lightbulb, PlusCircle, ChevronRight, Star, ThumbsUp } from "lucide-react";
import Entreprenuer from "../assets/ENT.jpg";
import pp from "../assets/defaultpp.jpg";

export default function EntHome() {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8000/api";
  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setPhotoPreview(null);
    setImage(null);
  };
  const [yourIdeas, setYourIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const AUTH_TOKEN = localStorage.getItem("accessToken"); // Retrieve token
  const [error, setError] = useState(""); // Error state
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [trendingIdeas, setTrendingIdeas] = useState([]);

  
  const [isIdeaDialogOpen, setIsIdeaDialogOpen] = useState(false);
  const [isSomeOtherDialogOpen, setIsSomeOtherDialogOpen] = useState(false);
  

  const [ideas, setIdeas] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  
  const [events, setEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  

  useEffect(() => {
    if (!username) return;
  
    const fetchTrendingIdeas = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/trending-ideas/?username=${username}`);
        const data = await response.json();
  
        console.log("Trending Ideas API Response:", data); // ✅ Check what `image` contains
  
        if (response.ok && data.status) {
          setTrendingIdeas(data.data);
        } else {
          setError("Failed to load trending ideas.");
        }
      } catch (error) {
        console.error("Error fetching trending ideas:", error);
        setError("Failed to fetch trending ideas. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchTrendingIdeas();
  }, [username]);
  
  
    
  
    useEffect(() => {
      const fetchYourIdeas = async () => {
        try {
          const username = localStorage.getItem("username"); // Get logged-in username
          const response = await fetch(`http://localhost:8000/api/ideas/?username=${username}`);
          const data = await response.json();
          
          if (data.status) {
            console.log("Ideas fetched:", data.data);
            setYourIdeas(data.data); // ✅ Update state correctly
          } else {
            console.error("Error fetching ideas:", data.error);
          }
        } catch (error) {
          console.error("Failed to fetch ideas:", error);
        }
      };
    
      fetchYourIdeas();
    }, []); // ✅ Run only once when component mounts
    
  
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/events/upcoming/`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [BASE_URL]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    console.log("Username:", storedUsername);

    if (!storedUsername) {
      navigate("/");
      return;
    }
    setUsername(storedUsername);

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/entrepreneur/profile/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: storedUsername })
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, BASE_URL]);

  // useEffect(() => {
  //   fetch(`${BASE_URL}/ideas/?username=${localStorage.getItem("username")}`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${AUTH_TOKEN}`,
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then(async (response) => {
  //       if (!response.ok) {
  //         const text = await response.text();
  //         throw new Error(`Error fetching ideas: ${text}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => setIdeas(data))
  //     .catch((error) => console.error("Error fetching ideas:", error));
  // }, [BASE_URL, AUTH_TOKEN]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    
    if (image) {
      formData.append("image", image);  // Append image only if it exists
    }
  
    try {
      const response = await fetch(`${BASE_URL}/ideas_post/`, {
        method: "POST",
        headers: {
          // "Authorization": `Token ${localStorage.getItem("accessToken")}`, // Ensure token is valid
        },
        body: formData, // Do not stringify FormData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Idea submitted successfully!");
        setIsDialogOpen(false);  // ✅ Close modal
        setTitle("");
        setCategory("");
        setDescription("");
        setImage(null);
        setPhotoPreview(null);
      } else {
        
        setError(`Error: ${data.error || response.statusText}`);
        setIsDialogOpen(false);
        
      }
    } catch (error) {
      console.error("Invalid JSON response from server:", error);
      
      setError("Server returned an invalid response.");
      setIsDialogOpen(false);
    }
};







  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };



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
                    <img src={userProfile.profile_picture || pp} alt="Profile" />
                    </div>
                    <h3 className="userName">{userProfile.full_name || "N/A"}</h3>
                    <p className="userRole">{userProfile.job_role || "No Job Role Provided"}</p>
                  </div>
                  <div className="statsSection">
                    <div className="statRow">
                      <span className="statName">Ideas Posted</span>
                      <span className="statValue">{userProfile.ideas_posted}</span>
                    </div>
                    <div className="statRow">
                      <span className="statName">Investor Connections</span>
                      <span className="statValue">{userProfile.investor_connections}</span>
                    </div>
                    <div className="statRow">
                      <span className="statName">Profile Completion</span>
                      <span className="statValue">{userProfile.profile_completion}%</span>
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
                  {events.length > 0 ? (
                    events.map((event) => (
                      <div key={event.id} className="eventItem">
                        <h4 className="eventName">{event.title}</h4>
                        <p className="eventDetails">
                          {new Date(event.date).toLocaleDateString()} • {event.location}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No upcoming events</p>
                  )}

                  {/* Move the button inside cardContent */}
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
    {trendingIdeas && trendingIdeas.length > 0 ? (
      trendingIdeas.map((trend_idea, index) => (
    
      <div key={trend_idea._id || trend_idea.id} className="ideaCard"> {/* Ensure unique key */}
        <div className="ideaCardHeader">
          <div className="ideaTitleSection">
            <h3 className="ideaTitle">{trend_idea.title}</h3>
            <div className="authorInfo">
              <div className="authorPicture">
                        <img

            src={
              trend_idea.image && trend_idea.image.startsWith("/media/") // ✅ Ensure only valid URLs
                ? `http://localhost:8000${trend_idea.image}`
                : pp
            }
            alt={trend_idea.username || "Unknown Author"}
            onError={(e) => (e.target.src = "pp")} // ✅ Prevent broken images
          />
          


              </div>
              <span className="authorName">{trend_idea.username || "Anonymous"}</span>
            </div>
          </div>
          <span className="categoryTag">{trend_idea.category || "Uncategorized"}</span>
        </div>
        <div className="ideaCardContent">
          <p className="ideaDescription">{trend_idea.description || "No description available."}</p>
        </div>
        <div className="ideaCardFooter">
          <div className="engagementActions">
            <button className="engagementButton">
              <ThumbsUp /> {trend_idea.like_count || 0} {/* Ensure like count is displayed */}
            </button>
            <button className="engagementButton">
              <MessageSquare /> {Array.isArray(trend_idea.comments) ? trend_idea.comments.length : 0} {/* Handle comments safely */}
            </button>
          </div>
          <button className="saveButton">
            <Star /> Save
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="emptyStateMessage">No trending ideas available.</p>
  )}
  {trendingIdeas.length > 0 && <button className="loadMoreButton">Load More Ideas</button>}
</div>

  

{/* Your Ideas Tab */}
<div className={`tabPanel ${activeTab === "your-ideas" ? "tabPanelActive" : ""}`}>
  {yourIdeas.length > 0 ? (
    yourIdeas.map((idea) => (
      <div key={idea._id} className="ideaCard">
        <div className="ideaCardHeader">
          <div className="ideaTitleSection">
            <h3 className="ideaTitle">{idea.title}</h3>
            <div className="authorInfo">
              <div className="authorPicture">
              <img
                  src={
                    idea.image && !idea.image.startsWith("data:image") && idea.image.startsWith("/media/") // ✅ Ensure it's a valid URL
                      ? `http://localhost:8000${idea.image}`
                      : pp // ✅ Fallback for missing images
                  }
                  alt={idea.username || "Unknown Author"}
                  onError={(e) => (e.target.src = pp)} // ✅ Prevent broken images
                />
              </div>
              <span className="authorName">{idea.username}</span>
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
              {idea.like_count || 0}  {/* Ensure likes count is displayed */}
            </button>
            <button className="engagementButton">
              <MessageSquare />
              {idea.comments ? idea.comments.length : 0} {/* Show comment count */}
            </button>
          </div>
          <button className="saveButton">
            <Star />
            Save
          </button>
        </div>
      </div>
    ))
  ) : (
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
  )}
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
              <p className="modalDescription">Describe your idea in detail to attract potential investors and collaborators.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modalContent">
                <div className="formLayout">
                  <div className="formGroup">
                    <input type="text" className="formInput" placeholder="Idea Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="formGroup">
                    <select className="formSelect" value={category}onChange={(e) => setCategory(e.target.value)} required>
                      <option value="">Select Category</option>
                      <option value="tech">Technology</option>
                      <option value="health">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="sustainability">Sustainability</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                  <div className="formGroup">
                    <textarea className="formTextarea" placeholder="Describe your idea in detail..." value={description} onChange={(e) => setDescription(e.target.value)} required />
                  </div>

                
              
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
              <button type="button"
                    className="cancelButton"
                    onClick={() => {
                      setIsDialogOpen(false); // Close modal
                      resetForm(); // Reset form data
                    }}
                  >
                    Cancel
                  </button>
                <button type="submit" className="submitButton" >Post Idea</button>
                
              </div>

            </form>
        </div>
      </div>
      
      )}
    </div>
  )
}