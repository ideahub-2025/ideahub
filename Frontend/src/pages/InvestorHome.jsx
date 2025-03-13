import { useState } from 'react'
import { Bell, MessageSquare, Search, Lightbulb, Filter, ChevronRight, Star, ThumbsUp, User, TrendingUp, DollarSign, Users } from 'lucide-react'
import '../App.css'
import Entreprenuer from "../assets/ENT.jpg"
import pp from "../assets/defaultpp.jpg"

export default function InvestorHome() {
  const [activeTab, setActiveTab] = useState("trending")
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [trendingStartups, setTrendingStartups] = useState([
    {
      id: 1,
      name: "EcoPackage",
      tagline: "Biodegradable packaging made from agricultural waste that decomposes within 30 days.",
      founder: "Jane Cooper",
      avatar: "/placeholder.svg?height=40&width=40",
      industry: "Sustainability",
      stage: "Seed",
      fundingGoal: "$500K",
      raised: "$320K",
      likes: 128,
      comments: 32,
      views: 432
    },
    {
      id: 2,
      name: "FinanceAI",
      tagline: "AI-powered financial advisory platform providing customized investment advice based on spending habits.",
      founder: "Robert Fox",
      avatar: "/placeholder.svg?height=40&width=40",
      industry: "Fintech",
      stage: "Pre-seed",
      fundingGoal: "$250K",
      raised: "$120K",
      likes: 95,
      comments: 32,
      views: 310
    },
    {
      id: 3,
      name: "MediConnect",
      tagline: "Telemedicine platform connecting patients with specialists worldwide using AR technology.",
      founder: "Wade Warren",
      avatar: "/placeholder.svg?height=40&width=40",
      industry: "Healthcare",
      stage: "Series A",
      fundingGoal: "$2M",
      raised: "$1.2M",
      likes: 87,
      comments: 32,
      views: 275
    },
  ])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

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
                      <img src={pp} alt="Profile" />
                    </div>
                    <h3 className="userName">Michael Thompson</h3>
                    <p className="userRole">Angel Investor</p>
                  </div>
                  <div className="statsSection">
                    <div className="statRow">
                      <span className="statName">Investments Made</span>
                      <span className="statValue">8</span>
                    </div>
                    <div className="statRow">
                      <span className="statName">Startups Following</span>
                      <span className="statValue">24</span>
                    </div>
                    <div className="statRow">
                      <span className="statName">Profile Completion</span>
                      <span className="statValue">90%</span>
                    </div>
                  </div>
                  <button className="secondaryButton">Edit Profile</button>
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
                          <h3 className="ideaTitle">{startup.name}</h3>
                          <div className="authorInfo">
                            <div className="authorPicture">
                              <img src={pp} alt={startup.founder} />
                            </div>
                            <span className="authorName">Founded by {startup.founder}</span>
                          </div>
                        </div>
                        <div className="startupTags">
                          <span className="categoryTag">{startup.industry}</span>
                          <span className="categoryTag">{startup.stage}</span>
                        </div>
                      </div>
                      <div className="ideaCardContent">
                        <p className="ideaDescription">{startup.tagline}</p>
                        <div className="fundingProgress">
                          <div className="fundingDetails">
                            <span className="fundingRaised">{startup.raised}</span>
                            <span className="fundingGoal">of {startup.fundingGoal}</span>
                          </div>
                          <div className="progressBar">
                            <div 
                              className="progressFill" 
                              style={{ width: `${(parseInt(startup.raised.replace(/\D/g, '')) / parseInt(startup.fundingGoal.replace(/\D/g, ''))) * 100}%` }}
                            ></div>
                          </div>
                        </div>
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
                        <button className="accentButton">View Details</button>
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
                      <button className="accentButton">
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
            {[1, 2, 3].map((event) => (
              <div key={event} className="eventCard">
                <div className="eventDate">
                  <span className="eventMonth">May</span>
                  <span className="eventDay">{10 + event}</span>
                </div>
                <div className="eventDetails">
                  <h3 className="eventTitle">Startup Pitch Night {event}</h3>
                  <p className="eventLocation">San Francisco, CA</p>
                  <p className="eventDescription">
                    Join us for an evening of innovative pitches from emerging startups in the tech industry.
                  </p>
                  <div className="eventFooter">
                    <span className="eventAttendees">24 startups • 50+ investors</span>
                    <button className="secondaryButton">RSVP</button>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}