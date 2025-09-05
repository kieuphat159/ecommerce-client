import SignUpForm from "./components/SignUpForm";
import "./Page.css";

export default function SignUpPage() {
  return (
    <div className="SignUpPage">
      <div className="body">
        <div className="ImageSection">
          <div className="Logo">3legant.</div>
          <img src="./images/signup.jpg" alt="Sign Up" />
        </div>
        <div className="FormContent">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}