import './Page.css';
import Navigation from '/src/pages/user/home/components/Navigation/Navigation';
import AccountNavigation from './components/Navigation/Navigation';
import Orders from './components/Orders/Orders';
import { useParams, useLocation } from 'react-router-dom'; 
import AuthService from '/src/services/authService';
import { useEffect, useState } from 'react';
import Account from './components/Account/Account'
import OrderComplete from '../cart/components/order-complete/OrderComplete';
import Address from './components/Address/Address';

export default function MyAccountPage() {
    const { userId } = useParams();
    const location = useLocation(); 
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState('Account'); 
    const [loading, setLoading] = useState(false);
    const limit = 5;

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get('tab');
        if (tab && ['Account', 'Address', 'Orders', 'Wishlist'].includes(tab)) {
            setActiveTab(tab); 
        }
    }, [location.search]);

    const fetchOrders = async (pageNum) => {
        setLoading(true);
        try {
            const data = await AuthService.apiCall(
                `/user/my-orders/${userId}?page=${pageNum}&limit=${limit}`,
                { method: 'GET' }
            );

            // console.log('API response:', data);

            if (data.success && data.data?.orders) {
                const mapped = data.data.orders.map((item) => ({
                    id: item.order_id,
                    date: item.created_at,
                    status: item.status,
                    price: item.total_amount,
                }));

                setOrders(mapped);
                setTotalPages(data.data.totalPages);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error('Err: ', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'Orders') {
            fetchOrders(page);
        }
    }, [userId, page, activeTab]);

    return (
        <div className="account">
            {loading && (
                <div className="order-spinner">
                    <div className="spinner"></div>
                </div>
            )}
            <Navigation userId={userId} />
            <div className="account__header">
                <h1>My Account</h1>
            </div>
            <div className="account__body">
                <AccountNavigation
                    userId={userId}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <div className="account__content">
                    {activeTab === 'Account' && <Account />}
                    {activeTab === 'Address' && <Address />}
                    {activeTab === 'Orders' && (() => {
                        const queryParams = new URLSearchParams(location.search);
                        const orderId = queryParams.get("orderId");

                        if (orderId) {
                            return (
                            <OrderComplete
                                orderId={orderId}
                                firstTime={false}
                                userId={userId}
                            />
                            );
                        }

                        return (
                            <Orders
                            orders={orders}
                            page={page}
                            totalPages={totalPages}
                            userId={userId}
                            onPageChange={setPage}
                            />
                        );
                        })()}
                    {activeTab === 'Wishlist' && <div></div>}
                </div>
            </div>
        </div>
    );
}