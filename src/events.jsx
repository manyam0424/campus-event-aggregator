import { useState, useEffect } from "react";

function Events() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    category: ""
  });

  // Load events from localStorage
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  // Handle input
  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Add event
  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      alert("Fill all fields");
      return;
    }

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    setNewEvent({ title: "", date: "", category: "" });
  };

  return (
    <div className="page">
      <div className="container">
        <h2>📅 College Events</h2>

        {/* Add Event Form */}
        <input
          name="title"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={newEvent.date}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category (Tech/Cultural)"
          value={newEvent.category}
          onChange={handleChange}
        />

        <button className="btn" onClick={addEvent}>
          ➕ Add Event
        </button>

        {/* Event List */}
        <div style={{ marginTop: "20px" }}>
          {events.length === 0 ? (
            <p>No events yet</p>
          ) : (
            events.map((event, index) => (
              <div key={index} className="event-card">
                <h3>{event.title}</h3>
                <p>{event.date}</p>
                <p>{event.category}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Events;