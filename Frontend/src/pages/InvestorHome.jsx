import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Bell, MessageSquare, Search, Lightbulb, Filter, ChevronRight, Star, ThumbsUp, User, TrendingUp, DollarSign, Users } from 'lucide-react'
import '../App.css'
import Entreprenuer from "../assets/ENT.jpg"
import pp from "../assets/defaultpp.jpg"
import MessagesDropdown from './MessagesDropdown';
import ChatPopup from './MessagePopup';


export default function InvestorHome() {
  const [username, setUsername] = useState(null);
  const [activeTab, setActiveTab] = useState("trending")
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [trendingStartups, setTrendingStartups] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }
  const [userProfile, setUserProfile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const [activeChats, setActiveChats] = useState([]);


  const handleLogout = () => {
    console.log("Logging out..."); // Check if this logs when clicked
    // Perform logout logic here
    // Example: Clearing tokens and redirecting
    localStorage.removeItem("token"); // If using JWT
    window.location.href = "/"; // Redirect to login page
  };
  
  useEffect(() => {
    const fetchTrendingIdeas = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/investors-trending-ideas/");
        const data = await response.json();

        console.log("Investors Trending Ideas API Response:", data);

        if (response.ok && data.status) {
          setTrendingStartups(data.data);
        } else {
          setError("Failed to load trending ideas.");
        }
      } catch (error) {
        console.error("Error fetching investors' trending ideas:", error);
        setError("Failed to fetch investors' trending ideas. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingIdeas();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/events/upcoming/`);
        if (!response.ok) throw new Error("Failed to fetch events");
  
        const data = await response.json();
  
        // Filter events to include only those with "Active" status
        const activeEvents = data.filter(event => event.status === "Active");
  
        setEvents(activeEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
  }, []);


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
        const response = await fetch(`http://localhost:8000/api/investors-profile/`, {
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
  }, [navigate]);


    /*For message*/


        // Add a function to handle opening new chats
        const handleChatOpen = (receiver, ideaId) => {
          // Check if chat is already open
          if (!activeChats.some(chat => chat.receiver === receiver && chat.ideaId === ideaId)) {
            setActiveChats([...activeChats, { receiver, ideaId }]);
          }
        };
  
        // Add a function to handle closing chats
        const handleChatClose = (receiver, ideaId) => {
          setActiveChats(activeChats.filter(
            chat => !(chat.receiver === receiver && chat.ideaId === ideaId)
          ));
        };
  
        // Update the message button click handler
        const handleMessageClick = (entrepreneur, ideaId) => {
          handleChatOpen(entrepreneur, ideaId);
        };

  return (
    <div>
      {/* Header/Navigation */}
      <header className="headerSection">
        <div className="Inst-container">
          <nav className="navigationBar">
            <a href="/" className="logoContainer">
              <Lightbulb className="logoIcon" />
              <span className="logoText">IdeaHub</span>
              <span className="investorBadge">Investor</span>
            </a>

            <div className="searchWrapper">
              <Search className="searchIconWrapper" />
              <input type="text" className="searchInput" placeholder="Search startups, industries, founders..." />
            </div>

            <div className="userActions">
              <button className="iconButton">
                <Bell />
              </button>
              <MessagesDropdown 
                username={username} 
                onChatOpen={handleChatOpen} 
              />
              <div className="user-avatar-container" ref={dropdownRef}>
                  <div className="userAvatar" onClick={() => setIsOpen(!isOpen)}>
                  <img src={userProfile?.profile_picture || pp} alt="user" />
                  </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="heroSection">
        <div className="Inst-container">
          <div className="heroWrapper">
            <div className="heroContent">
              <h1 className="heroTitle">Discover Your Next Investment Opportunity</h1>
              <p className="heroSubtitle">
                Connect with innovative startups and entrepreneurs ready to scale their businesses with your support.
              </p>
              <button className="primaryButton" onClick={() => setIsFilterDialogOpen(true)}>
                <Filter />
                Filter Opportunities
              </button>
            </div>
            <div className="heroImageContainer">
              <img src={Entreprenuer} alt="Investment Illustration" />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <main className="dashboardSection">
        <div className="contaiInst-container">
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
                    <img src={userProfile?.profile_picture || pp} alt="Profile" />
                    </div>
                    <h3 className="userName">{userProfile?.full_name || "N/A"}</h3>
                    <p className="userRole">{userProfile?.role || "No Job Role Provided"}</p>
                  </div>
                  <div className="statsSection">

                    <div className="statRow">
                      <span className="statName">Profile Completion</span>
                      <span className="statValue">{userProfile?.profile_completion}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investment Summary */}
              <div className="card">
                <div className="cardHeader">
                  <h2 className="cardTitle">Investment Summary</h2>
                </div>
                <div className="cardContent">
                  <div className="summaryItem">
                    <div className="summaryIcon">
                      <DollarSign />
                    </div>
                    <div className="summaryDetails">
                      <h4 className="summaryTitle">Total Invested</h4>
                      <p className="summaryValue">$1.2M</p>
                    </div>
                  </div>
                  <div className="summaryItem">
                    <div className="summaryIcon">
                      <TrendingUp />
                    </div>
                    <div className="summaryDetails">
                      <h4 className="summaryTitle">Portfolio Growth</h4>
                      <p className="summaryValue">+18.5%</p>
                    </div>
                  </div>
                  <div className="summaryItem">
                    <div className="summaryIcon">
                      <Users />
                    </div>
                    <div className="summaryDetails">
                      <h4 className="summaryTitle">Active Deals</h4>
                      <p className="summaryValue">3</p>
                    </div>
                  </div>
                  <button className="textLink">
                    View portfolio details
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
                    Trending Startups
                  </button>
                  <button
                    className={`tabButton ${activeTab === "recommended" ? "tabButtonActive" : ""}`}
                    onClick={() => handleTabChange("recommended")}
                  >
                    Recommended
                  </button>
                  <button
                    className={`tabButton ${activeTab === "saved" ? "tabButtonActive" : ""}`}
                    onClick={() => handleTabChange("saved")}
                  >
                    Saved
                  </button>
                </div>

                {/* Trending Startups Tab */}
                <div className={`tabPanel ${activeTab === "trending" ? "tabPanelActive" : ""}`}>
                  {trendingStartups.map((startup) => (
                    <div key={startup.id} className="ideaCard">
                      <div className="ideaCardHeader">
                        <div className="ideaTitleSection">
                          <h3 className="ideaTitle">{startup.title}</h3>
                          <div className="authorInfo">
                            <div className="authorPicture">
                              <img src={pp} alt={startup.image} />
                            </div>
                            <span className="authorName">Founded by {startup.username}</span>
                          </div>
                        </div>
                        <div className="startupTags">
                          <span className="categoryTag">{startup.category}</span>
                        </div>
                      </div>
                      <div className="ideaCardContent">
                        <p className="ideaDescription">{startup.description}</p>
                      </div>
                      <div className="ideaCardFooter">
                        <div className="engagementActions">
                          <button className="engagementButton">
                            <ThumbsUp />
                            {startup.likes}
                          </button>
                          <button className="engagementButton"
                            onClick={() => setIsCommentDialogOpen(true)}
                            >

                            <MessageSquare />
                            {startup.comments}
                          </button>
                          <span className="viewCount">
                            <User />
                            {startup.views} views
                          </span>
                        </div>
                        
                        <button 
                          className="messageButton"
                          onClick={() => handleMessageClick(startup.username, startup.id)}
                        >
                          Message
                        </button>

                      </div>
                    </div>
                  ))}
                  <button className="loadMoreButton">Load More Startups</button>
                </div>

                {/* Recommended Tab */}
                <div className={`tabPanel ${activeTab === "recommended" ? "tabPanelActive" : ""}`}>
                  <div className="card">
                    <div className="cardHeader">
                      <h2 className="cardTitle">Recommended Startups</h2>
                      <p className="cardDescription">Startups that match your investment preferences and interests.</p>
                    </div>
                    <div className="emptyState">
                      <div className="emptyStateIcon">
                        <Filter />
                      </div>
                      <h3 className="emptyStateTitle">Set your investment preferences</h3>
                      <p className="emptyStateMessage">Complete your investment profile to get personalized recommendations</p>
                      <button className="accentButton" onClick={() => setIsFilterDialogOpen(true)}>
                        Update Preferences
                      </button>
                    </div>
                  </div>
                </div>

                {/* Saved Tab */}
                <div className={`tabPanel ${activeTab === "saved" ? "tabPanelActive" : ""}`}>
                  <div className="card">
                    <div className="cardHeader">
                      <h2 className="cardTitle">Saved Startups</h2>
                      <p className="cardDescription">Startups you've saved for later review.</p>
                    </div>
                    <div className="emptyState">
                      <div className="emptyStateIcon">
                        <Star />
                      </div>
                      <h3 className="emptyStateTitle">No saved startups yet</h3>
                      <p className="emptyStateMessage">Browse trending startups and save the ones you're interested in</p>
                      <button className="secondaryButton" onClick={() => handleTabChange("trending")}>
                        Explore Trending Startups
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Events Section */}
      <section className="spotlightSection">
      <div className="Inst-container">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Upcoming Pitch Events</h2>
          <button className="textLink">
            View All
            <ChevronRight />
          </button>
        </div>

        <div className="cardsGrid">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="eventCard">
                <div className="eventDate">
                  <span className="eventMonth">{new Date(event.date).toLocaleString("default", { month: "short" })}</span>
                  <span className="eventDay">{new Date(event.date).getDate()}</span>
                </div>
                <div className="eventDetails">
                  <h3 className="eventTitle">{event.title}</h3>
                  <p className="eventLocation">{event.location}</p>
                  <p className="eventDescription">{event.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No upcoming active events.</p>
          )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footerSection">
        <div className="Inst-container">
          <div className="footerLayout">
            <div className="footerColumn">
              <h3>IdeaHub Investor</h3>
              <p>Connecting innovative entrepreneurs with investors to bring great ideas to life.</p>
            </div>
            <div className="footerColumn">
              <h3>Quick Links</h3>
              <ul className="footerLinks">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Browse Startups</a>
                </li>
                <li>
                  <a href="#">Investment Portfolio</a>
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
                  <a href="#">Investment Guide</a>
                </li>
                <li>
                  <a href="#">Due Diligence Checklist</a>
                </li>
                <li>
                  <a href="#">Market Reports</a>
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

      {/* Filter Dialog */}
      {isFilterDialogOpen && (
        <div className="modalOverlay" onClick={() => setIsFilterDialogOpen(false)}>
          <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 className="modalTitle">Filter Investment Opportunities</h2>
              <p className="modalDescription">
                Customize your search to find startups that match your investment criteria.
              </p>
            </div>
            <form>
              <div className="modalContent">
                <div className="formLayout">
                  <div className="formGroup">
                    <label htmlFor="industry">Industry</label>
                    <select id="industry" className="formSelect">
                      <option value="">All Industries</option>
                      <option value="tech">Technology</option>
                      <option value="health">Healthcare</option>
                      <option value="finance">Fintech</option>
                      <option value="education">Education</option>
                      <option value="sustainability">Sustainability</option>
                    </select>
                  </div>
                  <div className="formGroup">
                    <label htmlFor="stage">Funding Stage</label>
                    <select id="stage" className="formSelect">
                      <option value="">All Stages</option>
                      <option value="pre-seed">Pre-seed</option>
                      <option value="seed">Seed</option>
                      <option value="series-a">Series A</option>
                      <option value="series-b">Series B</option>
                      <option value="series-c">Series C+</option>
                    </select>
                  </div>
                  <div className="formGroup">
                    <label htmlFor="amount">Investment Amount</label>
                    <select id="amount" className="formSelect">
                      <option value="">Any Amount</option>
                      <option value="under-100k">Under $100K</option>
                      <option value="100k-500k">$100K - $500K</option>
                      <option value="500k-1m">$500K - $1M</option>
                      <option value="1m-5m">$1M - $5M</option>
                      <option value="over-5m">Over $5M</option>
                    </select>
                  </div>
                  <div className="formGroup">
                    <label htmlFor="location">Location</label>
                    <select id="location" className="formSelect">
                      <option value="">Anywhere</option>
                      <option value="us">United States</option>
                      <option value="europe">Europe</option>
                      <option value="asia">Asia</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modalFooter">
                <button type="button" className="cancelButton" onClick={() => setIsFilterDialogOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submitButton">
                  Apply Filters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comment Dialog */}
      {isCommentDialogOpen && (
        <div className="modalOverlay" onClick={() => setIsCommentDialogOpen(false)}>
          <div className="comment-dialog-container" onClick={(e) => e.stopPropagation()}>
            <div className="comment-dialog-header">
              <h2 className="comment-dialog-title">Add Comment</h2>
              <p className="comment-dialog-description">Share your thoughts about this startup</p>
            </div>

            <div className="comment-dialog-content">
              <div className="comment-dialog-form-group">
                <textarea
                  className="comment-dialog-input"
                  rows="4"
                  placeholder="Write your comment here..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>

            </div>

            <div className="comment-dialog-footer">
              <button
                className="comment-dialog-cancel"
                onClick={() => {
                  setIsCommentDialogOpen(false);
                  setCommentText("");
                }}
              >
                Cancel
              </button>
              <button
                className="comment-dialog-submit"
                disabled={!commentText.trim()}
                onClick={() => {
                  setIsCommentDialogOpen(false);
                  setCommentText("");
                }}
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      )}

{isOpen && (
  <div className="dropdown-menu">
    <ul>
      <li className="logout" onClick={handleLogout}>Logout</li>
    </ul>
  </div>
)}
      <div className="chat-windows">
        {activeChats.map((chat, index) => (
          <ChatPopup
            key={`${chat.receiver}-${chat.ideaId}`}
            receiver={chat.receiver}
            ideaId={chat.ideaId}
            onClose={() => handleChatClose(chat.receiver, chat.ideaId)}
          />
        ))}
      </div>
    </div>




  );
}