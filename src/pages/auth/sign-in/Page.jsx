import SignInForm from "./components/SignInForm";
import "./Page.css";

function SignInPage() {
  return (
    <div className="sign-in-page">
      <div className="sign-in-page__body">
        <div className="sign-in-page__image-section">
          <div className="sign-in-page__logo">3legant.</div>
          <img src="/images/signup.jpg" alt="Elegant Chair" />
        </div>
        <div className="sign-in-page__form-content">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}

export default SignInPage;