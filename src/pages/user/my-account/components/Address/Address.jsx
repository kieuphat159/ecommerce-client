import './Address.css';

export default function Address() {
    return (
        <div className="address">
            <h2 className="address__title">Address</h2>
            <div className="address__list">
                <div className="address__card">
                    <div className="address__card-header">
                        <h3 className="address__card-title">Billing Address</h3>
                        <button className="address__edit">✎ Edit</button>
                    </div>
                    <div className="address__card-body">
                        <p className="address__text">Sofia Havertz</p>
                        <p className="address__text">(+1) 234 567 890</p>
                        <p className="address__text">
                            345 Long Island, NewYork, United States
                        </p>
                    </div>
                </div>

                <div className="address__card">
                    <div className="address__card-header">
                        <h3 className="address__card-title">Shipping Address</h3>
                        <button className="address__edit">✎ Edit</button>
                    </div>
                    <div className="address__card-body">
                        <p className="address__text">Sofia Havertz</p>
                        <p className="address__text">(+1) 234 567 890</p>
                        <p className="address__text">
                            345 Long Island, NewYork, United States
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
