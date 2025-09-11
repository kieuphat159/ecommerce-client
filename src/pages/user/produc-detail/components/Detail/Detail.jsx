import "./Detail.css"
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

export default function Detail() {
    const [product, setProduct] = useState({});

    const { id } = useParams();
    const [numberOfProduct, setNumberOfProduct] = useState(1);
    const [image, setImage] = useState('');
    const specialVal = [
        'id',
        'name',
        'image',
        'seller'
    ]
    const specialAttr = [
        'price',
        'description'
    ]

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/${id}`);
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
    <div key={key} id="attrContent" className={key.toLowerCase()}>
      {!specialVal.includes(key) && (
        <>
          {!specialAttr.includes(key) && (
            <div className="attribute">{key}</div>
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
    return (
        <div className="Detail">
            <div className="imageSection">
                <img src={image} alt="Product image"></img>
            </div>
            <div className="infoSection">

                    <div className="productName">
                        {product.name}
                    </div>
                    {Object.entries(product).map(([key, value]) =>
                        renderAttribute(key, value)
                    )}
                <div className="buttonSection">
                    <div className="buttonTop">
                        <div className="numberInput">
                            <button className="decrease" onClick={decrease}>-</button>
                            <span className="value">{ numberOfProduct }</span>
                            <button className="increase" onClick={increase}>+</button>
                        </div>
                        <button className="wishList">♡ Wishlist</button>
                    </div>
                    <button className="add">Add to cart</button>
                </div>
            </div>
        </div>
    );
}