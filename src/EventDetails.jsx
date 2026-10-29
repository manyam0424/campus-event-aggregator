import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [teamSize, setTeamSize] = useState(1);
  const [teamMembers, setTeamMembers] = useState([]);

  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/events/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load event");
        return;
      }

      setEvent(data);

    } catch (error) {
      console.error("Error loading event:", error);
      alert("Unable to connect to server");

    } finally {
      setLoading(false);
    }
  };

  // Change number of students
  const handleTeamSizeChange = (size) => {
    setTeamSize(size);

    const numberOfMembers = size - 1;

    setTeamMembers((previousMembers) =>
      Array.from(
        { length: numberOfMembers },
        (_, index) => previousMembers[index] || ""
      )
    );
  };

  // Change team member name
  const handleMemberChange = (index, value) => {
    const updatedMembers = [...teamMembers];

    updatedMembers[index] = value;

    setTeamMembers(updatedMembers);
  };

  // Register team
  const registerForEvent = async () => {
    if (!event) return;

    // Check member names
    if (teamMembers.some((member) => !member.trim())) {
      alert("Please enter all team member names");
      return;
    }

    try {
      setRegistering(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/events/${id}/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            teamSize,
            teamMembers
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("🎉 Team registered successfully!");

      navigate("/student");

    } catch (error) {
      console.error("Registration error:", error);
      alert("Unable to connect to server");

    } finally {
      setRegistering(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="event-page">
        <div className="event-card">
          <h2>Loading event...</h2>
        </div>
      </div>
    );
  }

  // Event not found
  if (!event) {
    return (
      <div className="event-page">
        <div className="event-card">
          <h2>Event not found</h2>

          <button
            className="back-btn"
            onClick={() => navigate("/student")}
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || {};

  return (
    <div className="event-page">

      <div className="event-card">

        {/* BACK BUTTON */}
        <button
          className="back-btn"
          onClick={() => navigate("/student")}
        >
          ← Back to Events
        </button>

        {/* EVENT TITLE */}
        <h1>{event.title}</h1>

        {/* DESCRIPTION */}
        <p className="event-description">
          {event.description}
        </p>

        {/* EVENT DETAILS */}
        <div className="event-info">

          <div>
            <strong>📅 Date</strong>
            <span>
              {new Date(event.date).toLocaleDateString()}
            </span>
          </div>

          <div>
            <strong>📍 Venue</strong>
            <span>{event.venue}</span>
          </div>

          <div>
            <strong>🏷️ Category</strong>
            <span>{event.category}</span>
          </div>

          <div>
            <strong>🏫 Department</strong>
            <span>{event.department}</span>
          </div>

          <div>
            <strong>👥 Maximum Team Size</strong>
            <span>
              {event.maxParticipants} students
            </span>
          </div>

        </div>

        {/* REGISTRATION */}
        <div className="registration-box">

          <h2>📝 Team Registration</h2>

          <p>
            Select the number of students in your team.
          </p>

          {/* TEAM SIZE */}
          <label className="form-label">
            Number of Students
          </label>

          <select
            className="team-size-select"
            value={teamSize}
            onChange={(e) =>
              handleTeamSizeChange(
                Number(e.target.value)
              )
            }
          >
            {Array.from(
              {
                length: event.maxParticipants
              },
              (_, index) => index + 1
            ).map((size) => (
              <option
                key={size}
                value={size}
              >
                {size}{" "}
                {size === 1
                  ? "Student"
                  : "Students"}
              </option>
            ))}
          </select>

          {/* TEAM LEADER */}
          <div className="member-section">

            <h3>👤 Team Leader</h3>

            <div className="leader-box">
              {currentUser.name || "Current Student"}
            </div>

          </div>

          {/* TEAM MEMBERS */}
          {teamMembers.length > 0 && (
            <div className="member-section">

              <h3>👥 Team Members</h3>

              {teamMembers.map(
                (member, index) => (
                  <div
                    className="member-input"
                    key={index}
                  >

                    <label>
                      Team Member {index + 1}
                    </label>

                    <input
                      type="text"
                      placeholder={`Enter member ${
                        index + 1
                      } name`}
                      value={member}
                      onChange={(e) =>
                        handleMemberChange(
                          index,
                          e.target.value
                        )
                      }
                    />

                  </div>
                )
              )}

            </div>
          )}

          {/* REGISTER BUTTON */}
          <button
            className="register-btn"
            onClick={registerForEvent}
            disabled={registering}
          >
            {registering
              ? "Registering..."
              : "Register for Event →"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default EventDetails;