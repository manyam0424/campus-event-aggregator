import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid credentials");
        return;
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      alert("Login Successful! 🎉");

      // Navigate based on role
      if (data.user.role === "student") {
        navigate("/student");
      } else if (data.user.role === "admin") {
        navigate("/coordinator");
      } else if (data.user.role === "faculty") {
        navigate("/faculty");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-container">
      <div className="premium-card">

        <h2>🔐 Welcome Back</h2>

        {/* EMAIL */}
        <div className="input-box">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>

        {/* PASSWORD */}
        <div className="input-box password-box">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Password</label>

          <span
            className="toggle-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          className="premium-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login 🚀"}
        </button>

        <p
          className="link"
          onClick={() => navigate("/signup")}
        >
          Don’t have an account? Signup
        </p>

      </div>
    </div>
  );
}

export default Login;