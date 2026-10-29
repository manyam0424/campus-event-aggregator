import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function FacultyDashboard() {

  const navigate = useNavigate();

  // ==========================================
  // STUDENTS
  // ==========================================

  const [semester, setSemester] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);


  // ==========================================
  // TIMETABLE
  // ==========================================

  const [timetable, setTimetable] = useState({
    department: "",
    semester: "",
    day: "",
    subject: "",
    startTime: "",
    endTime: "",
    room: ""
  });

  const [timetableList, setTimetableList] = useState([]);
  const [timetableLoading, setTimetableLoading] = useState(false);


  // ==========================================
  // LOAD TIMETABLE FROM DATABASE
  // ==========================================

  useEffect(() => {
    loadTimetable();
  }, []);


  const loadTimetable = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/timetable",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTimetableList(data);
      }

    } catch (error) {

      console.error(
        "Error loading timetable:",
        error
      );

    }
  };


  // ==========================================
  // GET STUDENTS BY SEMESTER
  // ==========================================

  const getStudents = async () => {

    if (!semester) {

      alert("Please select a semester");

      return;
    }

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/auth/students/semester/${semester}`,
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

        alert(
          data.message ||
          "Unable to fetch students"
        );

        return;
      }

      setStudents(data);

    } catch (error) {

      console.error(
        "Error fetching students:",
        error
      );

      alert(
        "Unable to connect to server"
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // HANDLE TIMETABLE INPUT
  // ==========================================

  const handleTimetableChange = (e) => {

    setTimetable({
      ...timetable,
      [e.target.name]: e.target.value
    });

  };


  // ==========================================
  // ADD TIMETABLE
  // ==========================================

  const addTimetable = async () => {

    const {
      department,
      semester,
      day,
      subject,
      startTime,
      endTime,
      room
    } = timetable;


    if (
      !department ||
      !semester ||
      !day ||
      !subject ||
      !startTime ||
      !endTime ||
      !room
    ) {

      alert(
        "Please fill all timetable fields"
      );

      return;
    }


    try {

      setTimetableLoading(true);

      const token =
        localStorage.getItem("token");


      const response = await fetch(
        "http://localhost:5000/api/timetable",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            department,
            semester: Number(semester),
            day,
            subject,
            startTime,
            endTime,
            room
          })
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        alert(
          data.message ||
          "Unable to add timetable"
        );

        return;
      }


      alert(
        "Timetable added successfully! 🎉"
      );


      // Add the new timetable to screen
      setTimetableList((previous) => [
        ...previous,
        data.timetable
      ]);


      // Clear form
      setTimetable({
        department: "",
        semester: "",
        day: "",
        subject: "",
        startTime: "",
        endTime: "",
        room: ""
      });


    } catch (error) {

      console.error(
        "Error adding timetable:",
        error
      );

      alert(
        "Unable to connect to server"
      );

    } finally {

      setTimetableLoading(false);
    }
  };


  // ==========================================
  // DELETE TIMETABLE
  // ==========================================

  const deleteTimetable = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this timetable?"
      );

    if (!confirmDelete) {
      return;
    }


    try {

      const token =
        localStorage.getItem("token");


      const response = await fetch(
        `http://localhost:5000/api/timetable/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        alert(
          data.message ||
          "Unable to delete timetable"
        );

        return;
      }


      setTimetableList((previous) =>
        previous.filter(
          (item) => item._id !== id
        )
      );


      alert(
        "Timetable deleted successfully"
      );


    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      alert(
        "Unable to connect to server"
      );
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


      {/* =====================================
          SIDEBAR
      ===================================== */}

      <div className="sidebar">

        <h2>
          👩‍🏫 Faculty
        </h2>


        <ul>

          <li>
            🏠 Dashboard
          </li>


          <li
            onClick={() =>
              document
                .getElementById(
                  "students-section"
                )
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            👨‍🎓 Students
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
            📅 Timetable
          </li>


          <li>
            📢 Notices
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


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="content">

        <h2>
          Welcome Faculty 👋
        </h2>


        {/* ===================================
            TOP CARDS
        =================================== */}

        <div className="top-cards">


          <div className="card-box">

            <h3>
              👨‍🎓
            </h3>

            <p>
              Students
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
              📅
            </h3>

            <p>
              Timetable
            </p>

          </div>


          <div className="card-box">

            <h3>
              📢
            </h3>

            <p>
              Notices
            </p>

          </div>


          <div className="card-box">

            <h3>
              📊
            </h3>

            <p>
              Reports
            </p>

          </div>

        </div>


        {/* ===================================
            STUDENTS BY SEMESTER
        =================================== */}

        <div
          className="graph-box"
          id="students-section"
        >

          <h3>
            👨‍🎓 Students by Semester
          </h3>


          <p>
            Select a semester to view all
            students.
          </p>


          <select
            value={semester}
            onChange={(e) =>
              setSemester(e.target.value)
            }
            className="event-input"
          >

            <option value="">
              Select Semester
            </option>

            <option value="1">
              1st Semester
            </option>

            <option value="2">
              2nd Semester
            </option>

            <option value="3">
              3rd Semester
            </option>

            <option value="4">
              4th Semester
            </option>

            <option value="5">
              5th Semester
            </option>

            <option value="6">
              6th Semester
            </option>

            <option value="7">
              7th Semester
            </option>

            <option value="8">
              8th Semester
            </option>

          </select>


          <button
            className="add-btn"
            onClick={getStudents}
          >

            {loading
              ? "Loading..."
              : "View Students 👨‍🎓"}

          </button>

        </div>


        {/* ===================================
            STUDENT LIST
        =================================== */}

        <div className="event-section">

          <h3>
            📋 Student List
          </h3>


          {!semester ? (

            <p>
              Select a semester to view
              students.
            </p>

          ) : loading ? (

            <p>
              Loading students...
            </p>

          ) : students.length === 0 ? (

            <p>
              No students found for this
              semester.
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
                      #
                    </th>


                    <th
                      style={{
                        padding: "14px",
                        textAlign: "left",
                        background:
                          "#293953"
                      }}
                    >
                      Name
                    </th>


                    <th
                      style={{
                        padding: "14px",
                        textAlign: "left",
                        background:
                          "#293953"
                      }}
                    >
                      Registration ID
                    </th>


                    <th
                      style={{
                        padding: "14px",
                        textAlign: "left",
                        background:
                          "#293953"
                      }}
                    >
                      Department
                    </th>


                    <th
                      style={{
                        padding: "14px",
                        textAlign: "left",
                        background:
                          "#293953"
                      }}
                    >
                      Email
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {students.map(
                    (student, index) => (

                      <tr
                        key={
                          student._id
                        }
                      >

                        <td
                          style={{
                            padding: "14px",
                            borderBottom:
                              "1px solid #334155"
                          }}
                        >
                          {index + 1}
                        </td>


                        <td
                          style={{
                            padding: "14px",
                            borderBottom:
                              "1px solid #334155"
                          }}
                        >
                          {student.name}
                        </td>


                        <td
                          style={{
                            padding: "14px",
                            borderBottom:
                              "1px solid #334155"
                          }}
                        >
                          {student.regId}
                        </td>


                        <td
                          style={{
                            padding: "14px",
                            borderBottom:
                              "1px solid #334155"
                          }}
                        >
                          {student.department}
                        </td>


                        <td
                          style={{
                            padding: "14px",
                            borderBottom:
                              "1px solid #334155"
                          }}
                        >
                          {student.email}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* ===================================
            ADD TIMETABLE
        =================================== */}

        <div
          className="graph-box"
          id="timetable-section"
          style={{
            marginTop: "30px"
          }}
        >

          <h3>
            📅 Add Timetable
          </h3>


          <p>
            Create a timetable for a
            department and semester.
          </p>


          {/* DEPARTMENT */}

          <input
            className="event-input"
            type="text"
            name="department"
            placeholder="Department (Example: CSE)"
            value={timetable.department}
            onChange={
              handleTimetableChange
            }
          />


          {/* SEMESTER */}

          <select
            className="event-input"
            name="semester"
            value={timetable.semester}
            onChange={
              handleTimetableChange
            }
          >

            <option value="">
              Select Semester
            </option>

            <option value="1">
              1st Semester
            </option>

            <option value="2">
              2nd Semester
            </option>

            <option value="3">
              3rd Semester
            </option>

            <option value="4">
              4th Semester
            </option>

            <option value="5">
              5th Semester
            </option>

            <option value="6">
              6th Semester
            </option>

            <option value="7">
              7th Semester
            </option>

            <option value="8">
              8th Semester
            </option>

          </select>


          {/* DAY */}

          <select
            className="event-input"
            name="day"
            value={timetable.day}
            onChange={
              handleTimetableChange
            }
          >

            <option value="">
              Select Day
            </option>

            <option value="Monday">
              Monday
            </option>

            <option value="Tuesday">
              Tuesday
            </option>

            <option value="Wednesday">
              Wednesday
            </option>

            <option value="Thursday">
              Thursday
            </option>

            <option value="Friday">
              Friday
            </option>

            <option value="Saturday">
              Saturday
            </option>

          </select>


          {/* SUBJECT */}

          <input
            className="event-input"
            type="text"
            name="subject"
            placeholder="Subject"
            value={timetable.subject}
            onChange={
              handleTimetableChange
            }
          />


          {/* TIME */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "15px"
            }}
          >

            <input
              className="event-input"
              type="time"
              name="startTime"
              value={
                timetable.startTime
              }
              onChange={
                handleTimetableChange
              }
            />


            <input
              className="event-input"
              type="time"
              name="endTime"
              value={
                timetable.endTime
              }
              onChange={
                handleTimetableChange
              }
            />

          </div>


          {/* ROOM */}

          <input
            className="event-input"
            type="text"
            name="room"
            placeholder="Room (Example: Room 204)"
            value={timetable.room}
            onChange={
              handleTimetableChange
            }
          />


          {/* ADD BUTTON */}

          <button
            className="add-btn"
            onClick={addTimetable}
            disabled={
              timetableLoading
            }
          >

            {timetableLoading
              ? "Adding..."
              : "Add Timetable ➕"}

          </button>

        </div>


        {/* ===================================
            TIMETABLE LIST
        =================================== */}

        <div className="event-section">

          <h3>
            📋 Added Timetable
          </h3>


          {timetableList.length === 0 ? (

            <p>
              No timetable entries added
              yet.
            </p>

          ) : (

            timetableList.map(
              (item) => (

                <div
                  key={item._id}
                  className="event-item"
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    gap: "15px"
                  }}
                >

                  <div>

                    <h4>
                      {item.subject}
                    </h4>

                    <p>
                      📚 {item.department}
                      {" • "}
                      Semester{" "}
                      {item.semester}
                    </p>

                    <p>
                      📅 {item.day}
                    </p>

                    <p>
                      ⏰ {item.startTime}
                      {" - "}
                      {item.endTime}
                    </p>

                    <p>
                      📍 {item.room}
                    </p>

                  </div>


                  <button
                    onClick={() =>
                      deleteTimetable(
                        item._id
                      )
                    }
                    style={{
                      background:
                        "#ef4444",
                      color: "white",
                      border: "none",
                      padding:
                        "10px 15px",
                      borderRadius:
                        "8px",
                      cursor: "pointer"
                    }}
                  >
                    ❌ Delete
                  </button>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>
  );
}

export default FacultyDashboard;