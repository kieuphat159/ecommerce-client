import { useState } from "react";
import "../Page.css";

export default function SignUpForm() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {  "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to sign up. Please try again.");
        return;
      }
      alert("Sign up successful!");
    } catch (error) {
      console.error("Error during sign up:", error);
      alert("Failed to sign up. Please try again.");
    }
  };

  return (
    <form className="SignUpForm" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <div>Already have an account? <a href="#">Sign in</a></div>
      <div>
        <label>
          Your name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Email address:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <button className="submitButton" type="submit">Sign Up</button>
      </div>
    </form>
  );
}