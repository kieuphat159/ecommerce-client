import { useState } from 'react';
import './Dashboard.css';
import DashboardNav from './components/navigation/DashboardNav';
import Products from '../products/components/Products/Products';
import Orders from './components/orders/Orders';
import OrderDetail from './components/order-detail/OrderDetail';

export default function Dashboard({sellerId}) {
    const [activeButton, setActiveButton] = useState('home');
    const [orderDetail, setOrderDetail] = useState(0);

    return (
        <div className='dashboard'>
            <nav className='dashboard--left'>
                <DashboardNav 
                    activeButton={activeButton} 
                    setActiveButton={setActiveButton}
                    setOrderDetail={setOrderDetail}
                />
            </nav>
            <div className='dashboard--right'>
                {activeButton === 'home' && <h2>Home</h2>}
                {activeButton === 'products' && <Products sellerId={sellerId} />}
                {activeButton === 'orders' && orderDetail === 0 && <Orders setOrderDetail={setOrderDetail} />}
                {activeButton === 'orders' && orderDetail !== 0 && <OrderDetail orderId={orderDetail} setOrderDetail={setOrderDetail}/>}
                {activeButton === 'settings' && <h2>more</h2>}
            </div>
        </div>
    );
}