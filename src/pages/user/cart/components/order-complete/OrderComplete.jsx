import './OrderComplete.css'
import { useState, useEffect } from 'react'
import AuthService from "/src/services/authService";

export default function OrderComplete({
    mockProducts,
    orderId
    }) {
    const [order, setOrder] = useState(null);
    const fetchOrder = async () => {
        try {
            const result = await AuthService.apiCall(`/user/order/${orderId}`, {method: "GET"});
            if (result.success) {
                setOrder(result.data[0]);
                console.log(result.data[0]);
            }
        } catch (err) {
            console.log('Error fetching order: ', err);
        }
    }
    useEffect(() => {
        fetchOrder();
    }, [orderId])
    return(
        <div className="order-complete">
            <div className='order-complete__content'>
                <h3 className='content__grate'>Thank you! 🎉</h3>
                <h2 className='content__noti'>Your order has been received</h2>
                
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
                <div className='oder-complete__final-info'>
                    <div className='final-info__key'>Order code:</div>
                    <div className='final-info__value'>{`#${orderId}`}</div>
                    <hr />
                </div>

                <div className='oder-complete__final-info'>
                    <div className='final-info__key'>Date:</div>
                    <div className='final-info__value'>{order ? order.created_at : ""}</div>
                    <hr />
                </div>

                <div className='oder-complete__final-info'>
                    <div className='final-info__key'>Total</div>
                    <div className='final-info__value'>{order ? `$${order.total_amount}` : ""}</div>
                    <hr />
                </div>

                <div className='oder-complete__final-info'>
                    <div className='final-info__key'>Payment method</div>
                    <div className='final-info__value'>{order ? order.payment_method : ""}</div>
                    <hr />
                </div>

                <button className='order-complete__content__button'>Purchase history</button>

            </div>
        </div>
    );
}