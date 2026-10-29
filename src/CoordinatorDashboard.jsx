import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function CoordinatorDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [event, setEvent] = useState({
    title: "",
    description: "",
    category: "",
    department: "",
    date: "",
    venue: "",
    registrationDeadline: "",
    maxParticipants: "",
    points: ""
  });

  const navigate = useNavigate();

  // Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/events",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to fetch events");
        return;
      }

      setEvents(data);

    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  // Add Event
  const addEvent = async () => {
    if (
      !event.title ||
      !event.description ||
      !event.category ||
      !event.department ||
      !event.date ||
      !event.venue
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/events",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            ...event,

            maxParticipants: event.maxParticipants
              ? Number(event.maxParticipants)
              : undefined,

            points: event.points
              ? Number(event.points)
              : 0
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create event");
        return;
      }

      alert("Event created successfully! 🎉");

      setEvents([...events, data.event]);

      setEvent({
        title: "",
        description: "",
        category: "",
        department: "",
        date: "",
        venue: "",
        registrationDeadline: "",
        maxParticipants: "",
        points: ""
      });

    } catch (error) {
      console.error("Error creating event:", error);
      alert("Unable to connect to backend");
    }
  };

  // Delete Event
  const deleteEvent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/events/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete event");
        return;
      }

      alert("Event deleted successfully");

      setEvents(
        events.filter((event) => event._id !== id)
      );

    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Unable to connect to backend");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="main-container">

      {/* SIDEBAR */}
      <div className="sidebar">

        <h2>📋 Coordinator</h2>

        <ul>
          <li>🏠 Dashboard</li>
          <li>➕ Add Event</li>
          <li>📅 Manage Events</li>
          <li>📢 Announcements</li>
          <li>⚙ Settings</li>
        </ul>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>


      {/* CONTENT */}
      <div className="content">

        <h2>Welcome Coordinator 👋</h2>


        {/* TOP CARDS */}
        <div className="top-cards">

          <div className="card-box">
            <h3>{events.length}</h3>
            <p>Total Events</p>
          </div>

          <div className="card-box">
            ➕ Add Event
          </div>

          <div className="card-box">
            📢 Announcements
          </div>

          <div className="card-box">
            📊 Reports
          </div>

        </div>


        {/* ADD EVENT */}
        <div className="graph-box">

          <h3>Add New Event</h3>

          {/* FORM GRID */}
          <div className="event-form-grid">

            {/* EVENT TITLE */}
            <input
              className="event-input"
              type="text"
              placeholder="Event Title"
              value={event.title}
              onChange={(e) =>
                setEvent({
                  ...event,
                  title: e.target.value
                })
              }
            />


            {/* CATEGORY */}
            <input
              className="event-input"
              type="text"
              placeholder="Category (Workshop, Hackathon, Seminar...)"
              value={event.category}
              onChange={(e) =>
                setEvent({
                  ...event,
                  category: e.target.value
                })
              }
            />


            {/* DEPARTMENT */}
            <input
              className="event-input"
              type="text"
              placeholder="Department"
              value={event.department}
              onChange={(e) =>
                setEvent({
                  ...event,
                  department: e.target.value
                })
              }
            />


            {/* EVENT DATE */}
            <input
              className="event-input"
              type="date"
              value={event.date}
              onChange={(e) =>
                setEvent({
                  ...event,
                  date: e.target.value
                })
              }
            />


            {/* VENUE */}
            <input
              className="event-input"
              type="text"
              placeholder="Venue"
              value={event.venue}
              onChange={(e) =>
                setEvent({
                  ...event,
                  venue: e.target.value
                })
              }
            />


            {/* REGISTRATION DEADLINE */}
            <input
              className="event-input"
              type="date"
              value={event.registrationDeadline}
              onChange={(e) =>
                setEvent({
                  ...event,
                  registrationDeadline: e.target.value
                })
              }
            />


            {/* MAX PARTICIPANTS */}
            <input
              className="event-input"
              type="number"
              placeholder="Maximum Participants"
              value={event.maxParticipants}
              onChange={(e) =>
                setEvent({
                  ...event,
                  maxParticipants: e.target.value
                })
              }
            />


            {/* POINTS */}
            <input
              className="event-input"
              type="number"
              placeholder="Points"
              value={event.points}
              onChange={(e) =>
                setEvent({
                  ...event,
                  points: e.target.value
                })
              }
            />


            {/* DESCRIPTION */}
            <textarea
              className="event-input"
              placeholder="Event Description"
              value={event.description}
              onChange={(e) =>
                setEvent({
                  ...event,
                  description: e.target.value
                })
              }
            />

          </div>


          {/* ADD BUTTON */}
          <button
            className="add-btn"
            onClick={addEvent}
          >
            Add Event ➕
          </button>

        </div>


        {/* MANAGE EVENTS */}
        <div className="event-section">

          <h3>📅 Manage Events</h3>

          {loading ? (
            <p>Loading events...</p>
          ) : events.length === 0 ? (
            <p>No events</p>
          ) : (

            events.map((event) => (

              <div
                key={event._id}
                className="event-item"
              >

                <div>

                  <h4>{event.title}</h4>

                  <p>{event.description}</p>

                  <p>
                    📅{" "}
                    {new Date(
                      event.date
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    📍 {event.venue}
                  </p>

                  <p>
                    🏷️ {event.category}
                  </p>

                </div>

                <button
                  onClick={() =>
                    deleteEvent(event._id)
                  }
                >
                  ❌ Delete
                </button>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default CoordinatorDashboard;