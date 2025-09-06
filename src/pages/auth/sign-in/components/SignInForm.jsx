import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const Navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {  "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to sign in. Please try again.");
        return;
      }
      alert("Sign in successful!");
      if (data.redirectTo) {
        Navigate(data.redirectTo);
      } else {
        Navigate("/");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <form className="SignInForm" onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <div>Don't have any account yet? <a href="/signup">Sign up</a></div>
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
        <button className="submitButton" type="submit">Sign In</button>
      </div>
    </form>
  );
}