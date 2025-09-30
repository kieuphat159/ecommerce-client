import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ShopProducts.css'

import React from 'react';
const ProductCard = React.memo(({ product, onClick }) => {
  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  return (
    <div className='prd-card' onClick={onClick}>
      {product.discount && (
        <div className='prd-card-badge discount'>{product.discount}</div>
      )}
      {!product.discount && product.isNew && (
        <div className='prd-card-badge new'>NEW</div>
      )}
      <div className='prd-card-img-wrapper'>
        <img src={product.image} alt={product.name} className='prd-card-img' />
        {product.quantity < 1 && (
          <div className='prd-card-out-of-stock'>
            <span>OUT OF STOCK</span>
          </div>
        )}
      </div>
      <div className='prd-card-info'>
        <div className='prd-card-rating'>★★★★★</div>
        <div className='prd-card-name'>{product.name}</div>
        <div className='prd-card-price'>
          {hasDiscount && (
            <span className='prd-card-original-price'>{product.originalPrice}</span>
          )}
          <span className='prd-card-current-price'>{product.price}</span>
        </div>
        <div className='prd-card-description'>{product.description}</div>
        <button 
          className='prd-card-add-to-cart'
          disabled={product.quantity < 1}
        >
          {product.quantity < 1 ? 'Out of Stock' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
});


export default function Products() {
    const [openCategory, setOpenCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [realProducts, setRealProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('All');
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);  
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const getCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json(); 
            if (data.success) setCategories(data.data);
        } catch (err) {
            console.log('Fail to fetch categories: ', err);
        } finally {
            setLoading(false);
        }
    };

    const getProducts = async (page = 1, limit = 6, categoryName = category) => {
        try {
            setLoading(true);
            let url = `${import.meta.env.VITE_API_URL}/api/products?limit=${limit}&page=${page}`;
            if (categoryName && categoryName !== 'All') url += `&category=${encodeURIComponent(categoryName)}`;

            const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            if (data.success) {
                console.log('opp: ', data.data);
                setRealProducts(data.data);
                setError(null);
                setTotalPages(data.pagination.totalPages);
                setCurrentPage(data.pagination.page);
            } else {
                setError(data.message || "Failed to load products");
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (categoryName) => {
        setCategory(categoryName);
        setOpenCategory(false);
        getProducts(1, 6, categoryName);
    };

    const handlePageChange = (page) => getProducts(page, 6, category);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryFromUrl = params.get('category') || 'All';
        setCategory(categoryFromUrl);
        getProducts(1, 6, categoryFromUrl);
    }, [location.search]);

    useEffect(() => { getCategories(); }, []);

    return (
        <div className='prd-container'>
            <div className='prd-header'>
                <div className='prd-header-left'>
                    <div>
                        <label>Category</label>
                        <div className='prd-dropdown'>
                            <button 
                                className='prd-dropdown-btn' 
                                onClick={() => setOpenCategory(!openCategory)}
                                disabled={loading}
                            >
                                {category}
                            </button>
                            {openCategory && (
                                <div className="prd-dropdown-menu">
                                    <a
                                        href="#"
                                        className="prd-dropdown-option"
                                        onClick={(e) => { e.preventDefault(); handleCategoryChange('All'); }}
                                    >
                                        All
                                    </a>
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <a
                                                key={cat.id}
                                                href="#"
                                                className="prd-dropdown-option"
                                                onClick={(e) => { e.preventDefault(); handleCategoryChange(cat.name); }}
                                            >
                                                {cat.name}
                                            </a>
                                        ))
                                    ) : (
                                        <span className="prd-dropdown-option">No categories</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {loading && <div className="prd-loading">Loading...</div>}
            {error && <div className="prd-error">{error}</div>}

            <div className='prd-grid'>
            {realProducts.map((product, index) => (
                <ProductCard 
                key={product.id || index} 
                product={product} 
                onClick={() => navigate(`/product/${product.id}`)}
                />
            ))}
            </div>


            {category === 'All' && totalPages > 1 && (
                <div className="prd-pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`prd-pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                            disabled={loading}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}