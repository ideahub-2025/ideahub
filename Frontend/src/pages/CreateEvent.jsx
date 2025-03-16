import React, { useState, useEffect } from "react";
import "../App.css";
import logo from "../assets/logo.png";

const CreateEvent = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  // For confirmation and success modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [onConfirmCallback, setOnConfirmCallback] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/events/upcoming/`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [refresh]);

  const triggerRefresh = () => setRefresh((prev) => !prev); // Toggle refresh to reload events

  const openModal = (event = null) => {
    setEditingEvent(event);
    setErrorMessage("");
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setLocation(event.location);
      setDescription(event.description);
      setIsActive(event.isActive);
    } else {
      setTitle("");
      setDate("");
      setLocation("");
      setDescription("");
      setIsActive(true);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setErrorMessage("");
  };

  const handleSave = () => {
    if (!title.trim() || !date.trim() || !location.trim() || !description.trim()) {
      setErrorMessage("All fields are mandatory.");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    if (eventDate < today) {
      setErrorMessage("The event date cannot be before today.");
      return;
    }
    setConfirmModalMessage("Are you sure you want to confirm these changes?");
    setOnConfirmCallback(() => async () => {
      try {
        const url = editingEvent
          ? `http://localhost:8000/api/events/${editingEvent.id}/update/`
          : "http://localhost:8000/api/events/create/";

        const method = editingEvent ? "PATCH" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, date, location, description }),
        });

        const result = await response.json();
        if (!response.ok) {
          setErrorMessage(result.error || "Failed to save event.");
          return;
        }

        setSuccessMessage(editingEvent ? "Event updated successfully!" : "Event created successfully!");
        setShowSuccessModal(true);
        triggerRefresh(); // Refresh events after saving
        closeModal();
      } catch (error) {
        setErrorMessage("An error occurred while saving the event.");
      }
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  // Toggle active status with confirmation (works only when editing an event)
  const toggleActiveStatus = () => {
    const newStatus = !isActive;
    setConfirmModalMessage(
      newStatus
        ? "Are you sure you want to mark this event as active?"
        : "Are you sure you want to mark this event as inactive?"
    );
    setOnConfirmCallback(() => () => {
      setIsActive(newStatus);
      setSuccessMessage(newStatus ? "Event marked as active!" : "Event marked as inactive!");
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    });
    setShowConfirmModal(true);
  };

  // Filter upcoming events: Only active events with date on or after today
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const upcomingEvents = events.filter(ev => ev.isActive && new Date(ev.date) >= todayDate);

  // Sort events by date (soonest first)
  const sortedEvents = events.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  // Take up to 4 of the upcoming events for the carousel
  const urgentEvents = upcomingEvents.slice(0, 4);

  return (
    <div>
      <h2>Events Management</h2>
      <button className="modal-button" onClick={() => openModal()}>
        Create New Event
      </button>
      {events.length === 0 ? (
        <p>No upcoming events</p>
      ) : (
        <>
          <h3>Upcoming Events</h3>
          <div className="carousel">
            {urgentEvents.map(event => (
              <div key={event.id} className="event-card">
                <h4>{event.title}</h4>
                <p>{event.date}</p>
                <p>{event.location}</p>
                <button className="modal-button" onClick={() => openModal(event)}>
                  Edit Event
                </button>
              </div>
            ))}
          </div>
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>{event.location}</td>
                  <td>{event.description}</td>
                  <td>{event.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <button className="modal-button" onClick={() => openModal(event)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Event Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="form-header">
              <img src={logo} alt="Company Logo" className="logo" />
            </div>
            <h3>{editingEvent ? "Edit Event" : "Create Event"}</h3>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
            <input
              type="date"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
            ></textarea>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="modal-button" onClick={handleSave}>
              Save
            </button>
            {editingEvent && (
              <button className="modal-button" onClick={toggleActiveStatus}>
                {isActive ? "Mark as Inactive" : "Mark as Active"}
              </button>
            )}
            <button className="modal-button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{confirmModalMessage}</p>
            <button className="modal-button" onClick={onConfirmCallback}>
              Confirm
            </button>
            <button className="modal-button" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{successMessage}</p>
            <button className="modal-button" onClick={() => setShowSuccessModal(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
