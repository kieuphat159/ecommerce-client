import { Heart } from 'lucide-react';
import './Products.css';

export default function Products() {
  const categories = [
    {
      name: "Living Room",
      image: "./images/product1.jpg",
      link: "Shop Now"
    },
    {
      name: "Bedroom", 
      image: "./images/product3.jpg",
      link: "Shop Now"
    },
    {
      name: "Kitchen",
      image: "./images/product2.jpg", 
      link: "Shop Now"
    }
  ];

  const newArrivals = [
    {
      id: 1,
      name: "Loveseat Sofa",
      price: "$199.00",
      image: "./images/loveseat_sofa.jpg"
    },
    {
      id: 2,
      name: "Table Lamp", 
      price: "$24.00",
      image: "./images/table_lamp.jpg"
    },
    {
      id: 3,
      name: "Begie Table Lamp",
      price: "$24.00", 
      image: "./images/begie_table_lamp.jpg"
    },
    {
      id: 4,
      name: "Bamboo Basket",
      price: "$24.00",
      image: "./images/bamboo_basket.jpg"
    }
  ];

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
            <button className="more-products-btn">
              More Products →
            </button>
          </div>

          <div className="products-grid">
            {newArrivals.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-actions">
                    <button className="wishlist-btn">
                      <Heart className="heart-icon" />
                    </button>
                  </div>
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

