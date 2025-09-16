import "./Detail.css"
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

export default function Detail() {
    const [product, setProduct] = useState({});
    const { id } = useParams();
    const [numberOfProduct, setNumberOfProduct] = useState(1);
    const [image, setImage] = useState('');
    const [wishlistBtn, setWishlistBtn] = useState('detail__wishlist')
    const specialVal = [
        'id',
        'name',
        'image',
        'seller',
        'seller_id',
        'seller_name'
    ]
    const specialAttr = [
        'price',
        'description'
    ]

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product/${id}`);
                if (!response.ok) {
                    throw new Error('Fail to fetch product');
                }
                const json = await response.json();
                const data = json.data;
                console.log('Data: ', data);
                setProduct(data);
                setImage(data.image);
                console.log(image);
            } catch (err) {
                console.log('Error: ', err);
            }
        }
        if (id) {
            fetchProduct();
        }
    }, [id])

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
        setNumberOfProduct(numberOfProduct + 1);
    }
    const decrease = () => {
        setNumberOfProduct(Math.max(1, numberOfProduct - 1));
    }

    const addToWishlist = () => {
        if (wishlistBtn === 'detail__wishlist') {
            setWishlistBtn('detail__wishlist--clicked');
        } else {
            setWishlistBtn('detail__wishlist');
        }
    }

    return (
        <div className="detail">
            <div className="detail__image-section">
                <img src={image || "https://placehold.co/600x400"} alt="Product image"></img>
            </div>
            <div className="detail__info-section">
                <div className="detail__product-name">
                    {product.name}
                </div>
                {Object.entries(product).map(([key, value]) =>
                    renderAttribute(key, value)
                )}
                <div className="detail__button-section">
                    <div className="detail__button-top">
                        <div className="number-input">
                            <button className="number-input__button number-input__button--decrease" onClick={decrease}>-</button>
                            <span className="number-input__value">{numberOfProduct}</span>
                            <button className="number-input__button number-input__button--increase" onClick={increase}>+</button>
                        </div>
                        <button onClick={addToWishlist} className={wishlistBtn}>♡ Wishlist</button>
                    </div>
                    <button className="detail__add">Add to cart</button>
                </div>
            </div>
        </div>
    );
}