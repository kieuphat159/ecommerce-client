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
  const [showPassword, setShowPassword] = useState(false);

  const Navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
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
      setError("Failed to sign in. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="sign-in-page__form" onSubmit={handleSubmit}>
      <div className="sign-in-page__form-header">
        <h2>Sign In</h2>
        <p>
          Don't have an account yet? <a href="/signup">Sign Up</a>
        </p>
      </div>

      {error && (
        <div className="sign-in-page__error">
          {error}
        </div>
      )}

      <div className="sign-in-page__input-group">
        <input
          type="text"
          name="username"
          placeholder="Your username or email address"
          value={form.username}
          onChange={handleChange}
          required
          disabled={isloading}
        />
      </div>

      <div className="sign-in-page__input-group sign-in-page__password-group">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          disabled={isloading}
        />
        <button
          type="button"
          className="sign-in-page__password-toggle"
          onClick={togglePasswordVisibility}
          disabled={isloading}
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>

      <div className="sign-in-page__actions">
        <label className="sign-in-page__remember">
          <input type="checkbox" />
          <span>Remember me</span>
        </label>
        <a href="/forgot-password" className="sign-in-page__forgot">
          Forgot password?
        </a>
      </div>

      <button 
        type="submit" 
        className="sign-in-page__submit-button"
        disabled={isloading}
      >
        {isloading ? (
          <>
            <span className="sign-in-page__spinner"></span>
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
}