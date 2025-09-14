import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Products() {
    const [openCategory, setOpenCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [realProducts, setRealProducts] = useState([]);
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState('All');
    const [error, setError] = useState('');
    const navigate = useNavigate()

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
            console.log("ok cate", data);
            if (data.success) {
                setCategories(data.data);
            }
        } catch (err) {
            console.log('Fail to fetch categories: ', err);
        } finally {
            setLoading(false);
        }
    }

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

  const getProductsByCategory = async (categoryName) => {
    try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${categoryName}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("ok products by category", data);

        if (data.success) {
            setRealProducts(data.data);
        setError(null);
        } else {
            setError(data.message || 'Failed to load products by category');
        }
    } catch (err) {
        console.error('Error fetching products by category:', err);
        setError('Failed to load products by category. Please try again.');
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
      getCategories();
      getProducts();
    }, []);

    return (
        <div className='products-section'>
            <div className='product-section__header'>
                <div className='product-section__header--left'>
                    <div>
                        <label>Category</label>
                        <div className='drop-down'>
                            <button onClick={() => setOpenCategory(!openCategory)}>{category}</button>
                            {openCategory && (
                                <div className="dropdown-menu">
                                    <a
                                        href="#"
                                        className="drop-down__option"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCategory('All');
                                            setOpenCategory(false);
                                            getProducts();
                                        }}
                                        >
                                        All
                                        </a>
                                    {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <a
                                        key={cat.id}
                                        href="#"
                                        className="drop-down__option"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            console.log("Selected category:", cat.name);
                                            setCategory(cat.name);                                            setOpenCategory(false);
                                            getProductsByCategory(cat.name);
                                        }}
                                        >
                                        {cat.name}
                                        </a>
                                    ))
                                    ) : (
                                    <span className="drop-down__option">No categories</span>
                                    )}
                                </div>
                                )}

                        </div>
                    </div>
                </div>
            </div>
            <div className='product-grid'>
                {realProducts.map((product, index) => (
                    <div className='product-card' key={index} onClick={() => navigate(`/product/${product.id}`)}>
                        {product.isNew && <span className='new-tag'>NEW</span>}
                        {product.discount && <span className='discount-tag'>{product.discount}</span>}
                        <img src={product.image} alt={product.name} className='product-image' />
                        <div className='product-info'>
                            <div className='rating'>★★★★★</div>
                            <div className='product-name'>{product.name}</div>
                            <div className='product-price'>
                                {product.oldPrice && <span className='old-price'>{product.oldPrice}</span>}
                                <span className='current-price'>{product.price}</span>
                            </div>
                            <button className='add-to-cart'>Add to cart</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className='show-more'>Show more</button>
        </div>
    );
}