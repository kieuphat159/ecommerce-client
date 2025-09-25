import { useState, useEffect } from 'react';
import './OrderDetail.css';
import AuthService from '/src/services/authService'

export default function OrderDetail({orderId, setOrderDetail}) {
    const [mockOrder, setOrder] = useState({});
    const [mockProducts, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const response = await AuthService.apiCall(`/seller/order/${orderId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.success) {
                const orderData = Array.isArray(response.data) ? response.data[0] : response.data;
                setOrder(orderData);
                console.log(orderData);
                const itemsResponse = await AuthService.apiCall(`/seller/order-item/${orderId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })
                if (itemsResponse.success) {
                    setProducts(itemsResponse.data);
                    console.log(itemsResponse.data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch order:", error);
        } finally {
            setLoading(false);
        }
    }

    const [showModal, setShowModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(mockOrder.status);
    const [currentStatus, setCurrentStatus] = useState(mockOrder.status);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const handleStatusChange = (e) => {
        setPendingStatus(e.target.value);
        setShowModal(true);
    };

    const handleConfirm = async () => {
        try {
            const response = await AuthService.apiCall(`/seller/order/status/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: pendingStatus })
            });
            if (response.success) {
                setCurrentStatus(pendingStatus);
                setShowModal(false);
            } else {
                alert('Failed to update status!');
            }
        } catch (error) {
            alert('Error updating status!');
            console.error(error);
        }
    };

    const handleCancel = () => {
        setPendingStatus(currentStatus);
        setShowModal(false);
    };

    return (
        <section className="order-detail">
            <div className='order-detail__title'>
                 <h2>Order #{orderId}</h2>
            </div>
            {loading ? (
                <div className="order-spinner">
                    <div className="spinner"></div>
                </div>
            ) : (
            <div className='order-detail__content'>
                <div className='content__header'>
                    <div className='order-detail__items'>
                        {mockProducts && mockProducts.length > 0 && (
                            <div className="products-grid">
                                {mockProducts.map((product, index) => (
                                    <div key={index} className="product-item">
                                        <img
                                            src={product.img || product.image_path}
                                            alt={product.name || `Product ${index + 1}`}
                                        />
                                        <div className="quantity-badge">
                                            {product.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="order-detail__status-dropdown">
                        <button className='back-to-orders' onClick={() => setOrderDetail(0)}>{'< Back to orders'}</button>
                        <label htmlFor="order-status"><strong>Status:</strong></label>
                        <select
                            id="order-status"
                            value={pendingStatus}
                            onChange={handleStatusChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                <div className='order-detail__info'>
                    <div className='detail__element'>
                        <strong>Customer Name:</strong>
                        <div>{`${mockOrder.first_name} ${mockOrder.last_name}`}</div>
                    </div>
                    <div className='detail__element'>
                        <strong>Order Date:</strong>
                        <div>{mockOrder.created_at}</div>
                    </div>
                    <div className='detail__element'>
                        <strong>Phone Number:</strong>
                        <div>{mockOrder.phone_number}</div>
                    </div>
                    <div className='detail__element'>
                        <strong>Email Address:</strong>
                        <div>{mockOrder.email_address}</div>
                    </div>
                    <div className='detail__element'>
                        <strong>Total Amount:</strong>
                        <div>{mockOrder.total_amount}</div>
                    </div>
                    <div className='detail__element'>
                        <strong>Payment Method:</strong>
                        <div>{mockOrder.payment_method}</div>
                    </div>
                </div>
            </div>
            )}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Confirm status change</h3>
                        <p>
                            Are you sure you want to change status from <strong>{currentStatus}</strong> to <strong>{pendingStatus}</strong>?
                        </p>
                        <div className="modal-actions">
                            <button className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
                            <button className="btn btn-confirm" onClick={handleConfirm}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}