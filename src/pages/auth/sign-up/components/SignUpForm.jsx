import { useState } from "react";
import "../Page.css";

export default function SignUpForm() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!agreeToTerms) {
      setError('Please agree to the Terms & Conditions to continue.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || "Failed to sign up. Please try again.");
        return;
      }
      
      setSuccess("Sign up successful! You can now sign in to your account.");
      
      // Reset form after successful signup
      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
      });
      setAgreeToTerms(false);
      
    } catch (error) {
      console.error("Error during sign up:", error);
      setError("Failed to sign up. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="sign-up-page__form" onSubmit={handleSubmit}>
      <div className="sign-up-page__form-header">
        <h2>Sign Up</h2>
        <p>
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>

      {error && (
        <div className="sign-up-page__error">
          {error}
        </div>
      )}

      {success && (
        <div className="sign-up-page__success">
          {success}
        </div>
      )}

      <div className="sign-up-page__input-group">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="sign-up-page__input-group">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="sign-up-page__input-group">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="sign-up-page__input-group sign-up-page__password-group">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          className="sign-up-page__password-toggle"
          onClick={togglePasswordVisibility}
          disabled={isLoading}
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>

      <label className="sign-up-page__terms">
        <input
          type="checkbox"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          disabled={isLoading}
        />
        <span>
          I agree with <a href="/privacy-policy">Privacy Policy</a> and{" "}
          <a href="/terms-conditions">Terms of Use</a>
        </span>
      </label>

      <button 
        type="submit" 
        className="sign-up-page__submit-button"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="sign-up-page__spinner"></span>
            Creating Account...
          </>
        ) : (
          'Sign Up'
        )}
      </button>
    </form>
  );
}