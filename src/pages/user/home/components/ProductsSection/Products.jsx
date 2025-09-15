import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import './Products.css';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate =  useNavigate();

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
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

  // useEffect để gọi API khi component mount
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <main className="page-main">
      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            <div className="category-large">
              <div className="category-card">
                <img 
                  src={categories[0].image}
                  alt={categories[0].name}
                  className="category-image"
                />
                <div className="category-overlay"></div>
                <div className="category-content">
                  <h3 className="category-title">{categories[0].name}</h3>
                  <button className="category-link">
                    {categories[0].link} →
                  </button>
                </div>
              </div>
            </div>

            <div className="categories-small">
              {categories.slice(1).map((category, index) => (
                <div key={index} className="category-card">
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                  />
                  <div className="category-overlay"></div>
                  <div className="category-content">
                    <h3 className="category-title">{category.name}</h3>
                    <button className="category-link">
                      {category.link} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="arrivals-section">
        <div className="container">
          <div className="arrivals-header">
            <h2 className="section-title">New Arrivals</h2>
            <button className="more-products-btn" onClick={() => navigate("/products")}>
              More Products →
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="loading-container">
              <p>Loading products...</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button onClick={getProducts} className="retry-btn">
                Retry
              </button>
            </div>
          )}

          {/* Products grid */}
          {!loading && !error && products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="product-image-container">
                    <img 
                      src={product.image || product.image_url || "./images/placeholder.jpg"}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = "./images/placeholder.jpg";
                      }}
                    />
                    <div className="product-actions">
                      <button className="wishlist-btn">
                        <Heart className="heart-icon" />
                      </button>
                    </div>
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                  
                  {/* Optional: Show seller info */}
                  {product.seller && (
                    <p className="product-seller">by {product.seller}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* No products state */}
          {!loading && !error && products.length === 0 && (
            <div className="no-products-container">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}