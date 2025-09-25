import './DashboardNav.css'
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../../hooks/useAuth";
import { useState } from 'react';


export default function DashboardNav({ activeButton, setActiveButton, setOrderDetail }) {
    const { logout } = useAuth();
      const [showModal, setShowModal] = useState(false);
    
    const navigate = useNavigate();

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

     const signOut = () => {
        logout();
        navigate("/signin");
    };

    return(
        <div className='dashboard__nav'>
            <h2 className='nav__title'>Store</h2>
            <div className='nav__button'>
                <button 
                onClick={() => {setOrderDetail(0); handleButtonClick('home')}}
                className={activeButton === 'home' ? 'button--active' : ''}
                >
                <img src="/assets/home.png" alt="home" />
                </button>

                <button 
                onClick={() => {setOrderDetail(0); handleButtonClick('products')}}
                className={activeButton === 'products' ? 'button--active' : ''}
                >
                <img src="/assets/shopping-bag.png" alt="products" />
                </button>

                <button 
                onClick={() => {setOrderDetail(0); handleButtonClick('orders')}}
                className={activeButton === 'orders' ? 'button--active' : ''}
                >
                <img src="/assets/orders.png" alt="orders" />
                </button>

                <button 
                onClick={() => setShowModal(true)}
                className={activeButton === 'settings' ? 'button--active' : ''}
                >
                <img src="/assets/icons8-logout-26.png" alt="signout" />
                </button>
                
            </div>
            {showModal && (
                <div className="modal-overlay">
                <div className="modal">
                    <h3>Confirm signing out</h3>
                    <p>Are you sure you want to sign out ?</p>
                    <div className="modal-actions">
                    <button className="btn btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                    <button className="btn btn-confirm" onClick={signOut}>Sign out</button>
                    </div>
                </div>
                </div>
            )}
        </div>
    )
}