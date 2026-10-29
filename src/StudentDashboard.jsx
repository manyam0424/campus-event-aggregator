import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

function StudentDashboard() {

  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  const [timetable, setTimetable] = useState([]);

  const [loadingEvents, setLoadingEvents] = useState(true);

  const [loadingTimetable, setLoadingTimetable] =
    useState(true);

  const [currentUser, setCurrentUser] = useState(null);


  // ==========================================
  // LOAD STUDENT DATA
  // ==========================================

  useEffect(() => {

    const storedUser =
      JSON.parse(
        localStorage.getItem("currentUser")
      );

    setCurrentUser(storedUser);

    fetchEvents();

    if (storedUser) {
      fetchTimetable(storedUser);
    } else {
      setLoadingTimetable(false);
    }

  }, []);


  // ==========================================
  // GET EVENTS
  // ==========================================

  const fetchEvents = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/events",
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setEvents(data);
      }

    } catch (error) {

      console.error(
        "Error fetching events:",
        error
      );

    } finally {

      setLoadingEvents(false);

    }
  };


  // ==========================================
  // GET TIMETABLE
  // ==========================================

  const fetchTimetable = async (user) => {

    try {

      setLoadingTimetable(true);

      const token =
        localStorage.getItem("token");


      const department =
        user.department;

      const semester =
        user.semester;


      if (!department || !semester) {

        setTimetable([]);

        return;
      }


      const response = await fetch(
        `http://localhost:5000/api/timetable?department=${encodeURIComponent(
          department
        )}&semester=${semester}`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          data.message ||
          "Unable to fetch timetable"
        );

        return;
      }


      setTimetable(data);

    } catch (error) {

      console.error(
        "Error fetching timetable:",
        error
      );

    } finally {

      setLoadingTimetable(false);
    }
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem(
      "currentUser"
    );

    navigate("/");
  };


  return (

    <div className="main-container">


      {/* ======================================
          SIDEBAR
      ====================================== */}

      <div className="sidebar">

        <h2>
          🎓 Student
        </h2>


        <ul>

          <li>
            🏠 Dashboard
          </li>


          <li>
            📅 Events
          </li>


          <li
            onClick={() =>
              document
                .getElementById(
                  "timetable-section"
                )
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            📘 Timetable
          </li>


          <li>
            🔔 Notifications
          </li>


          <li>
            ⚙ Settings
          </li>

        </ul>


        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <div className="content">


        <h2>
          Welcome Student 👋
        </h2>


        {/* ==================================
            STUDENT INFORMATION
        ================================== */}

        {currentUser && (

          <div
            className="graph-box"
            style={{
              marginBottom: "25px"
            }}
          >

            <h3>
              🎓 My Academic Details
            </h3>

            <p>
              <strong>
                Department:
              </strong>{" "}
              {currentUser.department}
            </p>

            <p>
              <strong>
                Semester:
              </strong>{" "}
              {currentUser.semester}
            </p>

          </div>

        )}


        {/* ==================================
            TOP CARDS
        ================================== */}

        <div className="top-cards">

          <div className="card-box">

            <h3>
              {events.length}
            </h3>

            <p>
              Events
            </p>

          </div>


          <div
            className="card-box"
            onClick={() =>
              document
                .getElementById(
                  "timetable-section"
                )
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >

            <h3>
              📘
            </h3>

            <p>
              Timetable
            </p>

          </div>


          <div className="card-box">

            <h3>
              🔔
            </h3>

            <p>
              Notifications
            </p>

          </div>


          <div className="card-box">

            <h3>
              📊
            </h3>

            <p>
              Progress
            </p>

          </div>

        </div>


        {/* ==================================
            TIMETABLE
        ================================== */}

        <div
          className="event-section"
          id="timetable-section"
          style={{
            marginTop: "30px"
          }}
        >

          <h3>
            📅 My Timetable
          </h3>


          {currentUser && (

            <p>
              Timetable for{" "}
              <strong>
                {currentUser.department}
              </strong>
              {" - "}
              <strong>
                Semester {currentUser.semester}
              </strong>
            </p>

          )}


          {loadingTimetable ? (

            <p>
              Loading timetable...
            </p>

          ) : timetable.length === 0 ? (

            <p>
              No timetable available for
              your semester yet.
            </p>

          ) : (

            <div
              style={{
                overflowX: "auto"
              }}
            >

              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                  color: "white"
                }}
              >

                <thead>

                  <tr>

                    <th
                      style={{
                        padding: "14px",
                        textAlign: "left",
                        background:
                          "#293953"
                      }}
                    >
                      Day
                    </th>


                    <th
                      style={{
                        padding: "14px",
                        textAlign: "left",
                        background:
                          "#293953"
                      }}
                    >
                      Time
                    </th>


                    <th
                      style={{
                        padding: "14px",
                        textAlign: "left",
                        background:
                          "#293953"
                      }}
                    >
                      Subject
                    </th>


                    <th
                      style={{
                        padding: "14px",
                        textAlign: "left",
                        background:
                          "#293953"
                      }}
                    >
                      Room
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {timetable.map(
                    (item) => (

                      <tr
                        key={item._id}
                      >

                        <td
                          style={{
                            padding: "14px",
                            borderBottom:
                              "1px solid #334155"
                          }}
                        >
                          📅 {item.day}
                        </td>


                        <td
                          style={{
                            padding: "14px",
                            borderBottom:
                              "1px solid #334155"
                          }}
                        >
                          ⏰{" "}
                          {item.startTime}
                          {" - "}
                          {item.endTime}
                        </td>


                        <td
                          style={{
                            padding: "14px",
                            borderBottom:
                              "1px solid #334155"
                          }}
                        >
                          <strong>
                            {item.subject}
                          </strong>
                        </td>


                        <td
                          style={{
                            padding: "14px",
                            borderBottom:
                              "1px solid #334155"
                          }}
                        >
                          📍 {item.room}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* ==================================
            UPCOMING EVENTS
        ================================== */}

        <div className="event-section">

          <h3>
            📅 Upcoming Events
          </h3>


          {loadingEvents ? (

            <p>
              Loading events...
            </p>

          ) : events.length === 0 ? (

            <p>
              No events available
            </p>

          ) : (

            events.map((event) => (

              <div
                key={event._id}
                className="event-item"
              >

                <h4>
                  {event.title}
                </h4>


                <p>
                  {event.description}
                </p>


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


                <button
                  onClick={() =>
                    navigate(
                      `/events/${event._id}`
                    )
                  }
                >
                  View Event
                </button>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;