import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth"

export default function SignInForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState('');
  const [isloading, setIsLoading] = useState(false);

  const Navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await login(form);
      if (response.role === 'seller') {
        Navigate('/');
      } else {
        Navigate('/user/home');
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