import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Products.css'

export default function Products() {
    const [openCategory, setOpenCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [realProducts, setRealProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('All');
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);  
    const [totalPages, setTotalPages] = useState(1);
    const [openSize, setOpenSize] = useState(false)
    const [size, setSize] = useState('All');
    const navigate = useNavigate();

    const sizes = [
        {name: 'S'}, {name: 'M'}, {name: 'L'}
    ];

    const getCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); 
            // console.log("ok cate", data);
            if (data.success) {
                setCategories(data.data);
            }
        } catch (err) {
            // console.log('Fail to fetch categories: ', err);
        } finally {
           setLoading(false);
        }
    };

    const getProducts = async (page = 1, limit = 8, categoryName = category, sizeName = size) => {
        try {
            setLoading(true);

            let url = `${import.meta.env.VITE_API_URL}/api/products?limit=${limit}&page=${page}`;

            if (categoryName && categoryName !== 'All') {
                url += `&category=${encodeURIComponent(categoryName)}`;
            }
            if (sizeName && sizeName !== 'All') {
                url += `&size=${encodeURIComponent(sizeName)}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            if (data.success) {
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
        getProducts(1, 8, categoryName, size);
    };

    const handleSizeChange = (sizeName) => {
        setSize(sizeName);
        setOpenSize(false);
        getProducts(1, 8, category, sizeName);
    };



    const handlePageChange = (page) => {
        getProducts(page, 8, category);
    };


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryFromUrl = params.get('category') || 'All';
        setCategory(categoryFromUrl);
        getProducts(1, 8, categoryFromUrl);
    }, [location.search]);

    useEffect(() => {
        getCategories();
    }, []);

    return (  
        <div className='products'>
            {loading && (
                <div className="order-spinner">
                    <div className="spinner"></div>
                </div>
            )}
            <div className='products__header'>
                <div className='products__header-left'>
                    <div>
                        <label>Category</label>
                        <div className='dropdown'>
                            <button 
                                className='dropdown__button' 
                                onClick={() => setOpenCategory(!openCategory)}
                                disabled={loading}
                            >
                                {category}
                            </button>
                            {openCategory && (
                                <div className="dropdown__menu">
                                    <a
                                        href="#"
                                        className="dropdown__option"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCategoryChange('All');
                                        }}
                                    >
                                        All
                                    </a>
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <a
                                                key={cat.id}
                                                href="#"
                                                className="dropdown__option"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategoryChange(cat.name);
                                                }}
                                            >
                                                {cat.name}
                                            </a>
                                        ))
                                    ) : (
                                        <span className="dropdown__option">No categories</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label>Size</label>
                        <div className='dropdown'>
                            <button 
                                className='dropdown__button' 
                                onClick={() => setOpenSize(!openSize)}
                                disabled={loading}
                            >
                                {category}
                            </button>
                            {openSize && (
                                <div className="dropdown__menu">
                                    <a
                                        href="#"
                                        className="dropdown__option"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleSizeChange('All');
                                        }}
                                    >
                                        All
                                    </a>
                                    {sizes.length > 0 ? (
                                        sizes.map((size) => (
                                            <a
                                                key={size.name}
                                                href="#"
                                                className="dropdown__option"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleSizeChange(size.name);
                                                }}
                                            >
                                                {size.name}
                                            </a>
                                        ))
                                    ) : (
                                        <span className="dropdown__option">No categories</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {error && <div className="error">{error}</div>}

            <div className='products__grid'>
            {realProducts.map((product, index) => (
                <div 
                    className='product-card' 
                    key={product.id || index} 
                    onClick={() => navigate(`/product/${product.id}`)}
                >
                    <div className='product-card__image-wrapper'>
                        <img src={product.image} alt={product.name} className='product-card__image' />
                        {product.quantity < 1 && (
                            <div className='product-card__out-of-stock'>
                                <span>OUT OF STOCK</span>
                            </div>
                        )}
                    </div>
                    <div className='product-card__info'>
                        <div className='product-card__rating'>★★★★★</div>
                        <div className='product-card__name'>{product.name}</div>
                        <div className='product-card__price'>
                            <span className='product-card__current-price'>{product.price}</span>
                        </div>
                        <button 
                            className='product-card__add-to-cart'
                            disabled={product.quantity < 1}
                        >
                            {product.quantity < 1 ? 'Out of Stock' : 'Add to cart'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
            {category === 'All' && totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`pagination__button ${currentPage === i + 1 ? 'active' : ''}`}
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