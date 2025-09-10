import './Products.css';
import { useState, useEffect } from 'react';

export default function Products() {
    const [openCategory, setOpenCategory] = useState(false);
    const [openPrice, setOpenPrice] = useState(false);
    const [loading, setLoading] = useState(false);
    const [realProducts, setRealProducts] = useState([]);
    const [error, setError] = useState('');
    const getProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("ok", data);
      
      if (data.success) {
        setRealProducts(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      getProducts();
    }, []);

    return (
        <div className='products-section'>
            <div className='product-section__header'>
                <div className='product-section__header--left'>
                    <div>
                        <label>Category</label>
                        <div className='drop-down'>
                            <button onClick={() => setOpenCategory(!openCategory)}>Living Room</button>
                            {openCategory && (
                                <div className="dropdown-menu">
                                    <a href="#" className="drop-down__option">Mục 1</a>
                                    <a href="#" className="drop-down__option">Mục 2</a>
                                    <a href="#" className="drop-down__option">Mục 3</a>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label>Price</label>
                        <div className='drop-down'>
                            <button onClick={() => setOpenPrice(!openPrice)}>All Price</button>
                            {openPrice && (
                                <div className="dropdown-menu">
                                    <a href="#" className="drop-down__option">Mục 1</a>
                                    <a href="#" className="drop-down__option">Mục 2</a>
                                    <a href="#" className="drop-down__option">Mục 3</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='product-section__header--right'>
                    Sort by
                </div>
            </div>
            <div className='product-grid'>
                {realProducts.map((product, index) => (
                    <div className='product-card' key={index}>
                        {product.isNew && <span className='new-tag'>NEW</span>}
                        {product.discount && <span className='discount-tag'>{product.discount}</span>}
                        <img src={product.image} alt={product.name} className='product-image' />
                        <div className='rating'>★★★★★</div>
                        <div className='product-name'>{product.name}</div>
                        <div className='product-price'>
                            {product.oldPrice && <span className='old-price'>{product.oldPrice}</span>}
                            <span className='current-price'>{product.price}</span>
                        </div>
                        <button className='add-to-cart'>Add to cart</button>
                    </div>
                ))}
            </div>
            <button className='show-more'>Show more</button>
        </div>
    );
}