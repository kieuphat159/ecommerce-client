import './DashboardNav.css'
import { useNavigate } from "react-router-dom";

export default function DashboardNav({ activeButton, setActiveButton }) {
    
    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return(
        <div className='dashboard__nav'>
            <h2 className='nav__title'>Store</h2>
            <div className='nav__button'>
                <button 
                onClick={() => handleButtonClick('home')}
                className={activeButton === 'home' ? 'button--active' : ''}
                >
                <img src="/assets/home.png" alt="home" />
                </button>

                <button 
                onClick={() => handleButtonClick('products')}
                className={activeButton === 'products' ? 'button--active' : ''}
                >
                <img src="/assets/shopping-bag.png" alt="products" />
                </button>

                <button 
                onClick={() => handleButtonClick('orders')}
                className={activeButton === 'orders' ? 'button--active' : ''}
                >
                <img src="/assets/orders.png" alt="orders" />
                </button>

                <button 
                onClick={() => handleButtonClick('settings')}
                className={activeButton === 'settings' ? 'button--active' : ''}
                >
                <img src="/assets/orders.png" alt="settings" />
                </button>
                
            </div>
        </div>
    )
}