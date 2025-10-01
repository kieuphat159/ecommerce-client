import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import './Products.css';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleShopNow = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const categories = [
    {
      name: "Living Room",
      image: "https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757902233/product1_klhamr.jpg",
      link: "Shop Now"
    },
    {
      name: "Bedroom", 
      image: "https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757902222/product3_nlvfst.jpg",
      link: "Shop Now"
    },
    {
      name: "Kitchen",
      image: "https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757902222/product2_zmrd0e.jpg", 
      link: "Shop Now"
    }
  ];

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=4&page=1`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // console.log("ok", data);
      
      if (data.success) {
        setProducts(data.data);
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
    <main className="page-main">
      <section className="categories">
        <div className="categories__container">
          <div className="categories__grid">
            <div className="categories__card--large">
              <div className="categories__card"  onClick={() => handleShopNow(categories[0].name)}>
                <img 
                  src={categories[0].image}
                  alt={categories[0].name}
                  className="categories__image"
                />
                <div className="categories__overlay"></div>
                <div className="categories__content">
                  <h3 className="categories__title">{categories[0].name}</h3>
                  <button className="categories__link">
                    {categories[0].link} → 
                  </button>
                </div>
              </div>
            </div>

            <div className="categories__small">
              {categories.slice(1).map((category, index) => (
                <div key={index} className="categories__card"  onClick={() => handleShopNow(category.name)}>
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="categories__image"
                  />
                  <div className="categories__overlay"></div>
                  <div className="categories__content">
                    <h3 className="categories__title">{category.name}</h3>
                    <button className="categories__link" onClick={() => handleShopNow(category.name)}>
                      {category.link} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="arrivals">
        <div className="arrivals__container">
          <div className="arrivals__header">
            <h2 className="arrivals__title">New Arrivals</h2>
            <button className="arrivals__more-btn" onClick={() => navigate("/products")}>
              More Products →
            </button>
          </div>

          {loading && (
            <div className="arrivals__loading">
              <p>Loading products...</p>
            </div>
          )}

          {error && !loading && (
            <div className="arrivals__error">
              <p className="arrivals__error-message">{error}</p>
              <button onClick={getProducts} className="arrivals__retry-btn">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="arrivals__grid">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="product-card__image-container">
                    <img 
                      src={product.image || product.image_url || "./images/placeholder.jpg"}
                      alt={product.name}
                      className="arrivals-card__image"
                      onError={(e) => {
                        e.target.src = "./images/placeholder.jpg";
                      }}
                    />
                    <div className="product-card__actions">
                      <button className="product-card__wishlist-btn">
                        <Heart className="product-card__heart-icon" />
                      </button>
                    </div>
                  </div>
                  <h3 className="product-card__name">{product.name}</h3>
                  <p className="product-card__price">{product.price}</p>
                  
                  {product.seller && (
                    <p className="product-card__seller">by {product.seller}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="products__empty">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>
      <div className='features-section'>
                    <div className='feature-item'>
                        <img src="/images/fast delivery.png" alt="shipping" className='feature-icon' />
                        <div className='feature-content'>
                            <h3 className='feature-title'>Free Shipping</h3>
                            <p className='feature-text'>Order above $200</p>
                        </div>
                    </div>
                    <div className='feature-item'>
                        <img src="/images/money.png" alt="money back" className='feature-icon' />
                        <div className='feature-content'>
                            <h3 className='feature-title'>Money-back</h3>
                            <p className='feature-text'>30 days guarantee</p>
                        </div>
                    </div>
                    <div className='feature-item'>
                        <img src="/images/lock 01.png" alt="secure payments" className='feature-icon' />
                        <div className='feature-content'>
                            <h3 className='feature-title'>Secure Payments</h3>
                            <p className='feature-text'>Secured by Stripe</p>
                        </div>
                    </div>
                    <div className='feature-item'>
                        <img src="/images/call.png" alt="support" className='feature-icon' />
                        <div className='feature-content'>
                            <h3 className='feature-title'>24/7 Support</h3>
                            <p className='feature-text'>Phone and Email support</p>
                        </div>
                    </div>
                </div>
    </main>
  );
}