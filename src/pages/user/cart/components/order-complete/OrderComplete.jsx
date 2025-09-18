import './OrderComplete.css'

export default function OrderComplete({mockProducts}) {
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
                    <div className='final-info__value'>#0123_45678</div>
                    <hr />
                </div>

                <div className='oder-complete__final-info'>
                    <div className='final-info__key'>Date:</div>
                    <div className='final-info__value'>October 19, 2023</div>
                    <hr />
                </div>

                <div className='oder-complete__final-info'>
                    <div className='final-info__key'>Total</div>
                    <div className='final-info__value'>$1,345.00</div>
                    <hr />
                </div>

                <div className='oder-complete__final-info'>
                    <div className='final-info__key'>Payment method</div>
                    <div className='final-info__value'>Credit Card</div>
                    <hr />
                </div>

                <button className='order-complete__content__button'>Purchase history</button>

            </div>
        </div>
    );
}