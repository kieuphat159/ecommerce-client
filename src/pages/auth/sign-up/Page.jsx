import SignUpForm from "./components/SignUpForm";
import "./Page.css";

export default function SignUpPage() {
  return (
    <div className="sign-up-page">
      <div className="sign-up-page__body">
        <div className="sign-up-page__image-section">
          <div className="sign-up-page__logo">3legant.</div>
          <img src="./images/signup.jpg" alt="Elegant Furniture" />
        </div>
        <div className="sign-up-page__form-content">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}