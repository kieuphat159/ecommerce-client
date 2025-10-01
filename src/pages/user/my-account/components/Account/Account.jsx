import './Account.css'

export default function Account() {
    return (
        <div className="account">
            <form className="account__form">
                <section className="account__section">
                    <h2 className="account__section-title">Account Details</h2>
                    
                    <div className="account__field">
                        <label className="account__label" htmlFor="firstName">
                            FIRST NAME <span className="account__required">*</span>
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="account__input"
                            placeholder="First name"
                        />
                    </div>

                    <div className="account__field">
                        <label className="account__label" htmlFor="lastName">
                            LAST NAME <span className="account__required">*</span>
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="account__input"
                            placeholder="Last name"
                        />
                    </div>

                    <div className="account__field">
                        <label className="account__label" htmlFor="displayName">
                            DISPLAY NAME <span className="account__required">*</span>
                        </label>
                        <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            className="account__input"
                            placeholder="Display name"
                        />
                        <p className="account__hint">
                            This will be how your name will be displayed in the account section and in reviews
                        </p>
                    </div>

                    <div className="account__field">
                        <label className="account__label" htmlFor="email">
                            EMAIL <span className="account__required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="account__input"
                            placeholder="Email"
                            required
                        />
                    </div>
                </section>

                <section className="account__section">
                    <h2 className="account__section-title">Password</h2>
                    
                    <div className="account__field">
                        <label className="account__label" htmlFor="oldPassword">
                            OLD PASSWORD
                        </label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            className="account__input"
                            placeholder="Old password"
                        />
                    </div>

                    <div className="account__field">
                        <label className="account__label" htmlFor="newPassword">
                            NEW PASSWORD
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            className="account__input"
                            placeholder="New password"
                        />
                    </div>

                    <div className="account__field">
                        <label className="account__label" htmlFor="repeatPassword">
                            REPEAT NEW PASSWORD
                        </label>
                        <input
                            type="password"
                            id="repeatPassword"
                            name="repeatPassword"
                            className="account__input"
                            placeholder="Repeat new password"
                        />
                    </div>
                </section>


                <button 
                    type="submit" 
                    className="account__submit"
                >
                    Save change
                </button>
            </form>
        </div>
    );
}