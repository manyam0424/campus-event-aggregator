import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function Signup() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    role: "",
    email: "",
    department: "",
    regId: "",
    semester: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (
      !user.name ||
      !user.role ||
      !user.email ||
      !user.department ||
      !user.regId ||
      !user.password
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (user.role === "student" && !user.semester) {
      alert("Please select your semester");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: user.name,
            role: user.role,
            email: user.email,
            department: user.department,
            regId: user.regId,
            semester:
              user.role === "student"
                ? Number(user.semester)
                : undefined,
            password: user.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration Successful! 🎉");

      navigate("/");

    } catch (error) {
      console.error("Signup error:", error);
      alert("Unable to connect to the server");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-container">

      <div className="premium-card">

        <h2>✨ Create Account</h2>

        {/* NAME */}
        <div className="input-box">
          <input
            type="text"
            required
            value={user.name}
            onChange={(e) =>
              setUser({
                ...user,
                name: e.target.value
              })
            }
          />
          <label>Name</label>
        </div>


        {/* ROLE */}
        <div className="input-box">
          <select
            required
            value={user.role}
            onChange={(e) =>
              setUser({
                ...user,
                role: e.target.value,
                semester: ""
              })
            }
          >
            <option value="" disabled hidden>
              Select Role
            </option>

            <option value="student">
              🎓 Student
            </option>

            <option value="faculty">
              👩‍🏫 Faculty
            </option>

            <option value="admin">
              📋 Admin
            </option>
          </select>

          <label>Select Role *</label>
        </div>


        {/* EMAIL */}
        <div className="input-box">
          <input
            type="email"
            required
            value={user.email}
            onChange={(e) =>
              setUser({
                ...user,
                email: e.target.value
              })
            }
          />
          <label>Email</label>
        </div>


        {/* DEPARTMENT */}
        <div className="input-box">
          <input
            type="text"
            required
            value={user.department}
            onChange={(e) =>
              setUser({
                ...user,
                department: e.target.value
              })
            }
          />
          <label>Department</label>
        </div>


        {/* REGISTRATION ID */}
        <div className="input-box">
          <input
            type="text"
            required
            value={user.regId}
            onChange={(e) =>
              setUser({
                ...user,
                regId: e.target.value
              })
            }
          />
          <label>Registration ID</label>
        </div>


        {/* SEMESTER */}
        {user.role === "student" && (
          <div className="input-box semester-box">

            <select
              required
              value={user.semester}
              onChange={(e) =>
                setUser({
                  ...user,
                  semester: e.target.value
                })
              }
            >

              <option value="" disabled>
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

            <label>Semester *</label>

          </div>
        )}


        {/* PASSWORD */}
        <div className="input-box password-box">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            required
            value={user.password}
            onChange={(e) =>
              setUser({
                ...user,
                password: e.target.value
              })
            }
          />

          <label>Password</label>

          <span
            className="toggle-eye"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? "🙈" : "👁️"}
          </span>

        </div>


        {/* SIGNUP BUTTON */}
        <button
          className="premium-btn"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Signup 🚀"}
        </button>


        {/* LOGIN LINK */}
        <p
          className="link"
          onClick={() => navigate("/")}
        >
          Already have an account? Login
        </p>

      </div>

    </div>
  );
}

export default Signup;