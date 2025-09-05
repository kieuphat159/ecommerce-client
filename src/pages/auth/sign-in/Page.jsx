import SignInForm from "./components/SignInForm";
import "./Page.css";

function SignInPage() {
  return (
    <div className="SignInPage">
        <div className="body">
            <div className="ImageSection">
                <div className="Logo">3legant.</div>
                <img src="./images/signup.jpg" alt="Sign In" />
            </div>
            <div className="FormContent">
                <SignInForm />
            </div>
        </div>
    </div>
  );
}

export default SignInPage;