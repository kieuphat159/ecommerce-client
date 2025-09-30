import './OrderComplete.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '/src/services/authService';

export default function OrderComplete({
    mockProducts,
    orderId,
    firstTime = true,
    userId,
}) {
    const [order, setOrder] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const [isCancelled, setIsCancelled] = useState(false);
    const [status, setStatus] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false)

    console.log('OrderComplete rendered with orderId:', orderId);

    const fetchOrder = async () => {
        console.log('Fetching order with ID:', orderId);
        setLoading(true);
        try {
            const result = await AuthService.apiCall(`/user/order/${orderId}`, { method: 'GET' });
            if (result.success) {
                setOrder(result.data[0]);
                setIsCancelled(result.data[0].status === 'cancelled');
                setStatus(
                    result.data[0].status.charAt(0).toUpperCase() +
                    result.data[0].status.slice(1)
                );
                setPaymentMethod(
                    result.data[0].payment_method.charAt(0).toUpperCase() +
                    result.data[0].payment_method.slice(1)
                );
            }
        } catch (err) {
            console.log('Error fetching order: ', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const result = await AuthService.apiCall(`/user/order/${orderId}`, {
                method: 'DELETE',
            });
            if (result.success) {
                setOrder(null);
                setShowConfirm(false);
                window.location.reload();
                //navigate(`/profile/${userId}?tab=Orders`);
            } else {
                alert('Failed to delete order ❌');
            }
        } catch (err) {
            console.error('Error deleting order: ', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchaseHistory = () => {
        navigate(`/profile/${userId}?tab=Orders`);
    };

useEffect(() => {
    console.log('useEffect called with orderId:', orderId);
    fetchOrder();
}, [orderId]);

    return (
        <div className="order-complete">
            {loading && (
                <div className="order-spinner">
                <div className="spinner"></div>
                </div>
            )}
            <div className="order-complete__content">
                {firstTime && (
                    <h3 className="content__grate">Thank you! 🎉</h3>
                )}
                <div className="order__header">
                    <h2 className="content__noti">Your order has been { isCancelled ? 'cancelled' : 'received'}!</h2>
                    {!isCancelled && (
                    <button
                        className="order__delete"
                        onClick={() => setShowConfirm(true)}
                    >
                        Cancel this order?
                    </button>
                    )}
                </div>

                {showConfirm && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Are you sure you want to delete this order?</h3>
                            <div className="modal-actions">
                                <button
                                    className="btn-cancel"
                                    onClick={() => setShowConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-confirm"
                                    onClick={handleDelete}
                                    
                                >
                                    Yes, cancel it!
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className='products-grid__container'>
                {mockProducts && mockProducts.length > 0 && (
                    <div className="products-grid">
                        {mockProducts.map((product, index) => (
                            <div key={index} className="product-item">
                                <img
                                    src={product.img || product.image}
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

                <div className="oder-complete__final-info">
                    <div className="final-info__key">Order code:</div>
                    <div className="final-info__value">{`#${orderId}`}</div>
                    <hr />
                </div>

                <div className="oder-complete__final-info">
                    <div className="final-info__key">Date:</div>
                    <div className="final-info__value">{order?.created_at}</div>
                    <hr />
                </div>

                <div className="oder-complete__final-info">
                    <div className="final-info__key">Total</div>
                    <div className="final-info__value">${order?.total_amount}</div>
                    <hr />
                </div>

                <div className="oder-complete__final-info">
                    <div className="final-info__key">Payment method</div>
                    <div className="final-info__value">{paymentMethod}</div>
                    <hr />
                </div>

                <div className="oder-complete__final-info">
                    <div className="final-info__key">Status</div>
                    <div className="final-info__value">{status}</div>
                    <hr />
                </div>

                {firstTime && (
                    <button
                        className="order-complete__content__button"
                        onClick={handlePurchaseHistory}
                    >
                        Purchase history
                    </button>
                )}
            </div>
        </div>
    );
}