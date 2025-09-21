import "./Detail.css"
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

export default function Detail() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [options, setOptions] = useState([]);
    const [optionValues, setOptionValues] = useState({});
    const [currentQuantity, setCurrentQuantity] = useState(0);
    const [product, setProduct] = useState({});
    const [selectedVariants, setSelectedVariants] = useState({});
    const { id } = useParams();
    const [numberOfProduct, setNumberOfProduct] = useState(1);
    const [image, setImage] = useState('');
    const [wishlistBtn, setWishlistBtn] = useState('detail__wishlist');
    const [pricePerUnit, setPricePerUnit] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [variantId, setVariantId] = useState(0);

    const specialVal = ['id', 'name', 'image', 'seller', 'seller_id', 'seller_name'];
    const specialAttr = ['price', 'description', 'categories'];

    const fetchCurrentQuantity = async () => {
        if (options.length === 0) {
            setCurrentQuantity(0);
            return;
        }

        if (Object.keys(selectedVariants).length === 0) {
            setCurrentQuantity(0);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/product-variant-id`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : undefined
                },
                body: JSON.stringify({ product_id: id, options: selectedVariants })
            });
            const data = await res.json();
            
            if (data.success && data.variantId) {
                setVariantId(data.variantId);
                const stockRes = await fetch(`${import.meta.env.VITE_API_URL}/api/stock/${data.variantId}`, {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : undefined
                    }
                });
                const stockData = await stockRes.json();
                if (stockData.success && stockData.data.length > 0) {
                    const totalQuantity = stockData.data.reduce((sum, stock) => sum + (stock.quantity || 0), 0);
                    setCurrentQuantity(totalQuantity);
                } else {
                    setCurrentQuantity(0);
                }
            } else {
                setCurrentQuantity(0);
            }
        } catch (err) {
            console.error('Error fetching current quantity:', err);
            setCurrentQuantity(0);
            setError('Failed to fetch stock quantity');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedVariants(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const fetchOptions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product-options/${id}`, {
                method: "GET",
                headers: {
                    'Authorization': token ? `Bearer ${token}` : undefined
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setOptions(data.data);
                    data.data.forEach(option => fetchOptionValues(option.id));
                }
            } else {
                console.log('Failed to fetch options');
            }
        } catch (err) {
            console.log('Error fetching options: ', err);
            setError('Failed to fetch product options');
        }
    };

    const fetchOptionValues = async (option_id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product-option-values/${option_id}`, {
                method: "GET",
                headers: {
                    'Authorization': token ? `Bearer ${token}` : undefined
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setOptionValues(prev => ({
                        ...prev,
                        [option_id]: data.data
                    }));
                }
            } else {
                console.log(`Failed to fetch option values for option ${option_id}`);
            }
        } catch (err) {
            console.log(`Error fetching option values for option ${option_id}: `, err);
            setError('Failed to fetch option values');
        }
    };

    useEffect(() => {
        setTotalPrice((pricePerUnit * numberOfProduct).toFixed(2));
    }, [pricePerUnit, numberOfProduct]);

    useEffect(() => {
        fetchCurrentQuantity();
    }, [selectedVariants, options]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const json = await response.json();
                const data = json.data;
                setProduct(data);
                setImage(data.image);
                const numericPrice = parseFloat(data.price.replace(/[^0-9.-]+/g, ""));
                setPricePerUnit(numericPrice);
            } catch (err) {
                console.log('Error: ', err);
                setError('Failed to load product');
            }
        };
        if (id) {
            fetchProduct();
            fetchOptions();
        }
    }, [id]);

    const renderAttribute = (key, value) => {
        return (
            <div key={key} id="detail__attr-content" className={`detail__${key.toLowerCase()}`}>
                {!specialVal.includes(key) && (
                    <>
                        {!specialAttr.includes(key) && (
                            <div className="detail__attribute">{key}</div>
                        )}
                        <span>{value}</span>
                        {!specialAttr.includes(key) && <hr />}
                    </>
                )}
            </div>
        );
    };

    const increase = () => {
        setNumberOfProduct(prev => Math.min(prev + 1, currentQuantity));
    };

    const decrease = () => {
        setNumberOfProduct(prev => Math.max(1, prev - 1));
    };

    const addToWishlist = () => {
        setWishlistBtn(wishlistBtn === 'detail__wishlist' ? 'detail__wishlist--clicked' : 'detail__wishlist');
    };

    const addToCart = async () => {
        if (!variantId) {
            alert('Please select all product variants before adding to cart!');
            return;
        }

        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            alert('Please login to Add to cart!');
            return;
        }

        const data = {
            variantId: variantId,
            quantity: numberOfProduct,
            unit_price: pricePerUnit,
            total_price: totalPrice
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/add-to-cart/${userId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (res.ok && result.success) {
                alert('Added to cart successfully!');
            } else {
                alert(result.message || 'Failed to add to cart');
            }
        } catch (err) {
            console.log('Err: ', err);
            alert('Something went wrong while adding to cart!');
        }
    };

    return (
        <div className="detail">
            <div className="detail__image-section">
                <img src={image || "https://placehold.co/600x400"} alt="Product image" />
            </div>
            <div className="detail__info-section">
                <div className="detail__product-name">
                    {product.name}
                </div>
                {Object.entries(product).map(([key, value]) =>
                    renderAttribute(key, value)
                )}
                    
                {options.length > 0 && (
                    <div className="product__info__field">
                        <>
                            <h3 className="product__variants-title">Product Options</h3>
                            {options.map(option => (
                                <div key={option.id} className="product__info__field">
                                    <label className="product__info__label">{option.name}</label>
                                    <select
                                        name={`option_${option.id}`}
                                        onChange={handleChange}
                                        value={selectedVariants[`option_${option.id}`] || ''}
                                        disabled={loading}
                                        className="product__info__select"
                                    >
                                        <option value="">Select {option.name}</option>
                                        {optionValues[option.id]?.map(value => (
                                            <option key={value.id} value={value.id}>
                                                {value.value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                            
                        </>
                    </div>
                )}
                <p className="product__quantity">
                    Available Quantity: {loading ? 'Loading...' : currentQuantity}
                </p>
                <div className="product__price">Total price: ${totalPrice}</div>
                <div className="detail__button-section">
                    <div className="detail__button-top">
                        <div className="number-input">
                            <button className="number-input__button number-input__button--decrease" onClick={decrease}>-</button>
                            <span className="number-input__value">{numberOfProduct}</span>
                            <button className="number-input__button number-input__button--increase" onClick={increase}>+</button>
                        </div>
                        <button onClick={addToWishlist} className={wishlistBtn}>♡ Wishlist</button>
                    </div>
                    <button onClick={addToCart} className="detail__add" disabled={loading || currentQuantity === 0}>
                        Add to Cart
                    </button>
                </div>
                {error && (
                    <div className="error">
                        <strong>Error: {error}</strong>
                    </div>
                )}
            </div>
        </div>
    );
}