import "./Detail.css"
import { useState, useEffect, useMemo } from 'react'
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { debounce } from "/src/components/Debounce"

export default function Detail() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [options, setOptions] = useState([]);
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
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [totalQuantity, setTotalQuantity] = useState(0);

    const navigate = useNavigate();

    const specialVal = ['id', 'name', 'image', 'seller', 'seller_id', 'seller_name'];
    const specialAttr = ['price', 'description', 'categories'];

    const fetchDefaultQuantity = async () => {
        try {
            const [resDefault, resTotal] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/product-default-quantity/${id}`),
                fetch(`${import.meta.env.VITE_API_URL}/api/stock/total-quantity/${id}`)
            ]);

            const data = await resDefault.json();
            const totalData = await resTotal.json();
            // console.log(totalData);

            if (data.success && data.data) {
                let vId = 0;
                let qty = 0;

                if (Array.isArray(data.data)) {
                    qty = data.data[0]?.quantity ?? 0;
                    vId = data.data[0]?.variant_id ?? data.data[0]?.id ?? 0;
                } else {
                    qty = data.data.quantity ?? 0;
                    vId = data.data.variant_id ?? data.data.id ?? 0;
                }

                setCurrentQuantity(qty);
                setVariantId(vId || id);
            } else {
                setCurrentQuantity(0);
                setVariantId(0);
            }

            if (totalData.success) {
                const total = totalData.data?.total_quantity || 0;
                setTotalQuantity(total);
                setCurrentQuantity(total);
            } else {
                setTotalQuantity(0);
            }
        } catch (err) {
            console.error("Error fetching quantity:", err);
            setCurrentQuantity(0);
            setVariantId(0);
            setTotalQuantity(0);
        }
    };


    const calculateCurrentQuantity = () => {
        if (options.length === 0) {
            fetchDefaultQuantity();
            return;
        }

        const selectedOptionIds = Object.keys(selectedVariants);
        if (selectedOptionIds.length !== options.length) {
            setCurrentQuantity(totalQuantity);
            return;
        }

        let minQuantity = Infinity;
        
        for (const optionKey in selectedVariants) {
            const optionId = optionKey.replace('option_', '');
            const valueId = selectedVariants[optionKey];
            
            const option = options.find(opt => opt.id.toString() === optionId);
            if (option) {
                const value = option.values.find(val => val.id.toString() === valueId);
                if (value && value.quantity < minQuantity) {
                    minQuantity = value.quantity;
                }
            }
        }

        setCurrentQuantity(minQuantity === Infinity ? 0 : minQuantity);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedVariants(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const fetchOptions = async () => {
        try {
            setLoading(true);
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
                    data.data.forEach(option => {
                        option.name = option.name.charAt(0).toUpperCase() + option.name.slice(1);
                    });
                    setOptions(data.data);
                }
            } else {
                // console.log('Failed to fetch options');
                setError('Failed to fetch product options');
            }
        } catch (err) {
            // console.log('Error fetching options: ', err);
            setError('Failed to fetch product options');
        } finally {
            setLoading(false);
        }
    };

    const fetchVariantId = async () => {
        if (options.length === 0) {
            return variantId > 0 ? variantId : id;
        }
        if (Object.keys(selectedVariants).length !== options.length) {
            return null;
        }
        try {
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
                return data.variantId;
            }
            return variantId;
        } catch (err) {
            console.error('Error fetching variant ID:', err);
        }
        return null;
    };

    const fetchVariantPrice = async (variantId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product-variant/${variantId}`);
            const data = await response.json();
            if (data.success && data.data) {
                setPricePerUnit(parseFloat(data.data.price));
            }
        } catch (err) {
        }
    };

    useEffect(() => {
        setTotalPrice((pricePerUnit * numberOfProduct).toFixed(2));
    }, [pricePerUnit, numberOfProduct]);

    useEffect(() => {
        calculateCurrentQuantity();
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
                // console.log('Error: ', err);
                setError('Failed to load product');
            }
        };
        if (id) {
            fetchProduct();
            fetchOptions();
        }
    }, [id]);

    useEffect(() => {
        const updatePrice = async () => {
            if (options.length === 0) {
                if (product.price) {
                    setPricePerUnit(parseFloat(product.price.replace(/[^0-9.-]+/g, "")));
                }
            } else if (Object.keys(selectedVariants).length === options.length) {
                // Đã chọn đủ option, lấy giá variant
                const fetchedVariantId = await fetchVariantId();
                if (fetchedVariantId) {
                    setVariantId(fetchedVariantId);
                    await fetchVariantPrice(fetchedVariantId);
                }
            }
        };
        updatePrice();
    }, [selectedVariants, options, product]);
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
        if (currentQuantity === 0) return;
        setNumberOfProduct(prev => Math.min(prev + 1, currentQuantity));
    };

    const decrease = () => {
        if (currentQuantity === 0) return;
        setNumberOfProduct(prev => Math.max(1, prev - 1));
    };

    const addToWishlist = () => {
        setWishlistBtn(wishlistBtn === 'detail__wishlist' ? 'detail__wishlist--clicked' : 'detail__wishlist');
    };

    const addToCart = async () => {
        if (options.length > 0 && Object.keys(selectedVariants).length !== options.length) {
            setShowVariantModal(true);
            return;
        }
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            setShowLoginModal(true);
            return;
        }

        try {
            setLoading(true);
            const fetchedVariantId = await fetchVariantId();

            if (!fetchedVariantId || fetchedVariantId === 0) {
                alert('Invalid product variant selection!');
                return;
            }

            const data = {
                variantId: fetchedVariantId,
                quantity: numberOfProduct,
                unit_price: pricePerUnit,
                total_price: totalPrice
            };

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
                setShowSuccessModal(true);
            } else {
                alert(result.message || 'Failed to add to cart');
            }
        } catch (err) {
            // console.log('Err: ', err);
            alert('Something went wrong while adding to cart!');
        } finally {
            setLoading(false);
        }
    };

    const debounceAddToCart = useMemo(
        () => debounce(addToCart, 400), [numberOfProduct, pricePerUnit, selectedVariants, options]
    )

    const handleAddToCart = () => {
    if (currentQuantity === 0) {
        setShowVariantModal(true);
    } else {
        debounceAddToCart();
    }
};


    return (
        <div className="detail">
        {loading && (
            <div className="order-spinner">
            <div className="spinner"></div>
            </div>
        )}
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
                                    
                                    {option.values?.map(value => {
                                        const isSelected = selectedVariants[`option_${option.id}`] === value.id.toString();
                                        return (
                                            <button
                                                key={value.id}
                                                className={`btn-option-value ${isSelected ? 'selected' : ''}`}
                                                value={value.id}
                                                disabled={value.quantity === 0}
                                                onClick={() => setSelectedVariants(prev => ({
                                                    ...prev,
                                                    [`option_${option.id}`]: value.id.toString()
                                                }))}
                                            >
                                            {value.value} {value.quantity > 0 ? `` : '(Out of stock)'}
                                            </button>
                                        );
                                        })}

                                </div>
                            ))}
                            
                        </>
                    </div>
                )}
                <p className={`product__quantity ${currentQuantity === 0 ? `out-of-stock`: ``}`}>
                    {totalQuantity === 0 ? 'Out of stock' : `Available Quantity: ${currentQuantity}`}
                </p>
                <div className="product__price">Total price: ${totalPrice}</div>
                <div className="detail__button-section">
                    <div className="detail__button-top">
                        <div className="number__input">
                            <button
                                className="number-input__button number-input__button--decrease input__value"
                                onClick={decrease}
                                disabled={currentQuantity === 0 || numberOfProduct <= 1}
                            >-</button>
                            <input
                                type="number"
                                className="number-input__value input__value"
                                value={numberOfProduct}
                                min={1}
                                max={currentQuantity}
                                disabled={currentQuantity === 0}
                                onChange={e => {
                                    let val = parseInt(e.target.value, 10);
                                    if (isNaN(val) || val < 1) val = 1;
                                    if (val > currentQuantity) val = currentQuantity;
                                    setNumberOfProduct(val);
                                }}
                            />
                            <button
                                className="number-input__button number-input__button--increase input__value"
                                onClick={increase}
                                disabled={currentQuantity === 0 || numberOfProduct >= currentQuantity}
                            >+</button>
                        </div>
                        <button onClick={addToWishlist} className={wishlistBtn}>♡ Wishlist</button>
                    </div>
                    <button onClick={handleAddToCart} className="detail__add">
                        {loading ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
                {error && (
                    <div className="error">
                        <strong>Error: {error}</strong>
                    </div>
                )}
            </div>
      
            {showVariantModal && (
            <div className="detail-modal-overlay">
                <div className="detail-modal">
                    <h3>Please select all product variants</h3>
                    <p>You need to choose options before adding this product to cart.</p>
                    <button onClick={() => setShowVariantModal(false)}>OK</button>
                </div>
            </div>
            )}

            {showSuccessModal && (
            <div className="detail-modal-overlay">
                <div className="detail-modal">
                    <h3>Added to cart successfully!</h3>
                    <button onClick={() => {
                        setShowSuccessModal(false);
                        //window.location.reload();
                    }}>
                        OK</button>
                </div>
            </div>
            )}

            {showLoginModal && (
            <div className="detail-modal-overlay">
                <div className="detail-modal">
                    <h3>Please login to Add to cart!</h3>
                    <button onClick={() => {
                        setShowLoginModal(false);
                        navigate('/signin');
                    }}>
                        OK</button>
                </div>
            </div>
            )}
        </div>
    );
}