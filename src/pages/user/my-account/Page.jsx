import './Page.css'
import Navigation from '/src/pages/user/home/components/Navigation/Navigation'
import AccountNavigation from './components/Navigation/Navigation';
import Orders from './components/Orders/Orders';
import { useParams } from "react-router-dom";
import AuthService from "/src/services/authService";
import { useEffect, useState } from 'react';

export default function MyAccountPage() {
    const { userId } = useParams();
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    const fetchOrders = async (pageNum) => {
        try {
            const data = await AuthService.apiCall(
                `/user/my-orders/${userId}?page=${pageNum}&limit=${limit}`,
                { method: "GET" }
            );

            console.log("API response:", data);

            if (data.success && data.data?.orders) {
                const mapped = data.data.orders.map(item => ({
                    id: item.order_id,
                    date: item.created_at,
                    status: item.status,
                    price: item.total_amount
                }));

                setOrders(mapped);
                setTotalPages(data.data.totalPages);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error('Err: ', err);
        }
    };

    useEffect(() => {
        fetchOrders(page);
    }, [userId, page]);

    return (
        <>
            <Navigation userId={userId}/>
            <div className="account__header">
                <h1>My Account</h1>
            </div>
            <div className="account__body">
                <AccountNavigation 
                    userId={userId}
                />
                <div className='account__content'>
                    <Orders 
                        orders={orders} 
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            </div>
        </>
    );
}
