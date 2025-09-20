import './ContentDetail.css'
import { useEffect, useState } from "react";

export default function ContentDetail({
    mockProducts, 
    userId, 
    onRemove, 
    shippingMethod,
    quantities,
    setQuantities
    }) {

    const updateCart = async (index, num) => {
        const product = mockProducts[index];
        const unitPrice = parseFloat(product.price.replace('$', ''));
        const totalPrice = unitPrice * num;

        try {
            const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/user/add-to-cart/${userId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                variantId: product.variant_id,
                quantity: num,         
                unit_price: unitPrice,
                total_price: totalPrice 
                })
            }
            );
            const data = await res.json();
            if (!data.success) {
            console.error("Update cart failed:", data.message || data.error);
            }
        } catch (err) {
            console.error("Error updating cart:", err);
        }
    };


    const increase = (index, stock) => {
        setQuantities(prev => {
            const updated = [...prev];
            if (updated[index] < stock) {
                updated[index] += 1;
                updateCart(index, 1); 
            }
            return updated;
        });
    };

        const decrease = (index) => {
        setQuantities(prev => {
            const updated = [...prev];
            if (updated[index] > 1) {
                updated[index] -= 1;
                updateCart(index, -1);
            }
            return updated;
        });
    };


    // Tính toán subtotal và total
    const calculateSubtotal = () => {
        return mockProducts.reduce((total, product, index) => {
            const price = parseFloat(product.price.replace('$', ''));
            return total + (price * quantities[index]);
        }, 0);
    };

    const getShippingCost = () => {
        switch(shippingMethod) {
            case 'Express': return 15.00;
            case 'Pick-up': return 21.00;
            default: return 0.00;
        }
    };

    const subtotal = calculateSubtotal();
    const shippingCost = getShippingCost();
    const total = subtotal + shippingCost;
    return (
        <div className='content-detail'>
            <div className="content-detail__contact Content">
                <h2 className='contact__title title'>Contact Infomation</h2>
                <div className='input__name input-column'>
                    <div className='content-detail__contact__input info-input'>
                            <label>FIRST NAME</label>
                            <input type="text" placeholder='First name' />
                    </div>
                    <div className='content-detail__contact__input info-input'>
                            <label>LAST NAME</label>
                            <input type="text" placeholder='Last name' />
                    </div>
                </div>
                <div className='content-detail__contact__input info-input'>
                    <label>PHONE NUMBER</label>
                    <input type="text" placeholder='Phone number' />
                </div>
                <div className='content-detail__contact__input info-input'>
                    <label>EMAIL ADDRESS</label>
                    <input type="text" placeholder='Your Email' />
                </div>
            </div>

            <div className="content-detail__shipping Content">
                <h2 className='shipping-title title'>Shipping Address</h2>
                <div className='content-detail__shipping__input info-input'>
                        <label>STREET ADDRESS *</label>
                        <input type="text" placeholder='Sreet Address' />
                </div>
                <div className='content-detail__shipping__input info-input'>
                    <label>COUNTRY *</label>
                    <select defaultValue="">
                        <option value="" disabled>Country</option>
                        <option value="usa">United States</option>
                        <option value="vn">Vietnam</option>
                        <option value="uk">United Kingdom</option>
                    </select>
                </div>
                <div className='content-detail__shipping__input info-input'>
                        <label>TOWN / CITY *</label>
                        <input type="text" placeholder='Town / City' />
                </div>
                <div className='input-column'>
                    <div className='content-detail__shipping__input info-input'>
                            <label>STATE</label>
                            <input type="text" placeholder='State' />
                    </div>
                    <div className='content-detail__shipping__input info-input'>
                            <label>ZIP CODE</label>
                            <input type="text" placeholder='Zip code' />
                    </div>
                </div>
                <div className='content-detail__check-box'>
                    <input type="checkbox" />
                    <div className='content-detail__check-box__description'>Use a different billing address (optional)</div>
                </div>
            </div>

            <div className="content-detail__payment Content">
                <h2 className='payment-title title'>Payment method</h2>
                <div className="cart-summary__select payment-select">
                    <label className="cart-summary__select--option payment-option">
                        <input 
                            type="radio" 
                            name="payment" 
                            id="free" 
                            value="free"
                        />
                        <span className='option__info'>Pay by Card Credit</span>
                    </label>

                    <label className="cart-summary__select--option payment-option">
                        <input 
                            type="radio" 
                            name="payment" 
                            id="express" 
                            value="express"
                        />
                        <span className='option__info'>Paypal</span>
                    </label>
                    <hr />
                </div>
                <div className='content-detail__payment__input info-input'>
                        <label>CARD NUMBER</label>
                        <input type="text" placeholder='1234 1234 1234' />
                </div>
                <div className='input-column'>
                    <div className='content-detail__payment__input info-input'>
                            <label>EXPIRATION DATE</label>
                            <input type="text" placeholder='MM/YY' />
                    </div>
                    <div className='content-detail__payment__input info-input'>
                            <label>CVC</label>
                            <input type="text" placeholder='CVC code' />
                    </div>
                </div>
            </div>

            <div className="content-detail__order Content">
                <h2 className='order-title title'>Order summary</h2>
                {mockProducts && mockProducts.map((product, index) => (
                    <div className="products-section__product" key={index}>
                        <div className="products-section__product__img">
                            <img src={product.img} alt={`Image of ${product.name}`} />
                        </div>
                        <div className="products-section__product--detail">
                            <div className="detail__name">{product.name}</div>
                            {product.options.map((option, optIndex) => (
                                <div key={optIndex} className="detail__option">
                                    {Object.entries(option).map(([key, value]) => (
                                    <span key={key}>{key}: {value}</span>
                                    ))}
                                </div>
                            ))}
                            <div className="number-input">
                                <button 
                                    className="number-input__button number-input__button--decrease" 
                                    onClick={() => decrease(index)}
                                    disabled={quantities[index] <= 1}
                                >
                                    -
                                </button>
                                <span className="number-input__value">{quantities[index]}</span>
                                <button 
                                    className="number-input__button number-input__button--increase" 
                                    onClick={() => increase(index, product.stock_quantity)}
                                    disabled={quantities[index] >= product.stock_quantity}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="products-section__product--option">
                            <div className="option__price">
                                ${(parseFloat(product.price.replace('$', '')) * quantities[index]).toFixed(2)}
                            </div>
                            <div className="option__remove"
                            onClick={() => onRemove(product.cart_item_id)}
                            ><img src="/assets/Shape.png"/></div>
                        </div>
                    </div>
                    ))}
                <div className='content-detail__order__coupon'>
                    <input type="text" placeholder='Input'/>
                    <button>Apply</button>
                </div>
                <hr />
                <div className='content-detail__order__inshort'>
                    <span>Shipping</span>
                    <span>{shippingMethod}</span>
                </div>
                <hr />

                <div className='content-detail__order__inshort'>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <hr />

                <div className='content-detail__order__inshort'>
                    <h2>Total</h2>
                    <h2>${total.toFixed(2)}</h2>
                </div>
            </div>

            <button className='content-detail__place-order'>Place Order</button>
        </div>
    );
}