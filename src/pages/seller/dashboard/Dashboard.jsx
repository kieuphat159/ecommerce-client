import { useState } from 'react';
import './Dashboard.css';
import DashboardNav from './components/navigation/DashboardNav';
import Products from '../products/components/Products/Products';
import Orders from './components/orders/Orders';

export default function Dashboard({sellerId}) {
    const [activeButton, setActiveButton] = useState('home');

    return (
        <div className='dashboard'>
            <nav className='dashboard--left'>
                <DashboardNav 
                    activeButton={activeButton} 
                    setActiveButton={setActiveButton}
                />
            </nav>
            <div className='dashboard--right'>
                {activeButton === 'home' && <h2>Home</h2>}
                {activeButton === 'products' && <Products sellerId={sellerId} />}
                {activeButton === 'orders' && <Orders />}
                {activeButton === 'settings' && <h2>more</h2>}
            </div>
        </div>
    );
}