import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';
import AuthService from '/src/services/authService'

export default function Products({ sellerId }) {
    const [loading, setLoading] = useState(false);
    const [realProducts, setRealProducts] = useState([]);
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [revenue, setRevenue] = useState(0);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [totalItem, setTotalItem] = useState(0);
    
  const fetchRevenue = async () => {
    try{
      const response = await AuthService.apiCall(`/seller/revenue`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (response.success) {
        setRevenue(response.data);
      }
    } catch (err) {
      // console.log(err);
    }
  }

  const StatsHeader = () => {
    const stats = [
      { label: 'Revenue', value: `$${revenue}`, change: '+ 22%', type: 'positive' },
      { label: 'Orders', value: totalItem, change: '+ 5.7%', type: 'positive' },
      { label: 'Visitors', value: '7,283', change: '18%', type: 'negative' },
      { label: 'Conversion', value: '28%', change: '+ 12%', type: 'positive' }
    ];

    return (
      <div className="stat-header">
        <div className="stats-header__title">
          <h2>Products</h2>
        </div>

        {/* <div className="stats-header__date-picker">
          <span>Jan 01 - Jan 28</span>
          <i className="fas fa-ellipsis-h"></i>
        </div> */}
        <button className='stats-header__btn' onClick={() => navigate("/seller/create")}>
                New product
            </button>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card__info">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
              <div className={`stat-card__change ${stat.type}`}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

 
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 4; 

    const navigate = useNavigate();

    const getProducts = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/seller/products/${sellerId}?page=${page}&limit=${pageSize}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.success) {
                setRealProducts(data.data);
                setTotalPages(data.totalPages || 1);
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

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            setDeleteLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/seller/product/${productToDelete.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setRealProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
                setShowConfirmModal(false);
                setProductToDelete(null);
                alert('Product deleted successfully!');
            } else {
                throw new Error(data.message || 'Failed to delete product');
            }
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Failed to delete product. Please try again.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setProductToDelete(null);
    };

    useEffect(() => {
        getProducts(currentPage);
        fetchRevenue();
    }, [sellerId, currentPage]);

    const renderPagination = () => {
        if (totalPages <= 0) return null;

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`page-btn ${i === currentPage ? 'page--active' : ''}`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className='page-btn'
                >
                    Prev
                </button>
                {pages}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className='page-btn'
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="products-section">
            <StatsHeader />
            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="order-spinner">
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    <div className="product__grid">
                        {realProducts.map((product, index) => (
                            <div className="product__card" key={index} onClick={() => navigate(`products/${product.id}`)}>
                                {product.discount && (
                                    <span className="discount-tag">{product.discount}</span>
                                )}
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <div className="product-info">
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-price">
                                        {product.oldPrice && (
                                            <span className="old-price">{product.oldPrice}</span>
                                        )}
                                        <span className="current-price">{product.price}</span>
                                    </div>
                                    <button
                                        className="update"
                                        onClick={() => navigate(`products/${product.id}`)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {renderPagination()}
                </>
            )}

            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <div className="modal-header">
                            <h3>Confirm Delete</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this product?</p>
                            <div className="product-preview">
                                <img
                                    src={productToDelete?.image}
                                    alt={productToDelete?.name}
                                    className="preview-image"
                                />
                                <div className="preview-info">
                                    <h4>{productToDelete?.name}</h4>
                                    <p>{productToDelete?.price}</p>
                                </div>
                            </div>
                            <p className="warning-text">This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={cancelDelete}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-delete"
                                onClick={handleDeleteProduct}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
