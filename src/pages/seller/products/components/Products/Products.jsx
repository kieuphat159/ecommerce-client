import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css'

export default function Products({sellerId}) {
    const [openCategory, setOpenCategory] = useState(false);
    const [openPrice, setOpenPrice] = useState(false);
    const [loading, setLoading] = useState(false);
    const [realProducts, setRealProducts] = useState([]);
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const navigate = useNavigate()
    
    const getProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/products/${sellerId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
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

    const confirmDeleteItem = (product, event) => {
        event.stopPropagation();
        setProductToDelete(product);
        setShowConfirmModal(true);
    }

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        
        try {
            setDeleteLoading(true);
            // console.log('id: ', productToDelete.id);
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/product/${productToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                // Remove product from state
                setRealProducts(prev => prev.filter(p => p.id !== productToDelete.id));
                setShowConfirmModal(false);
                setProductToDelete(null);
                // Optional: Show success message
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
    }

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setProductToDelete(null);
    }

    useEffect(() => {
        getProducts();
    }, [sellerId]);

    return (
        <div className='products-section'>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="loading">Loading products...</div>
            ) : (
                <div className='product-grid'>
                    {realProducts.map((product, index) => (
                        <div className='product-card' key={index}>
                            {product.discount && <span className='discount-tag'>{product.discount}</span>}
                            <img src={product.image} alt={product.name} className='product-image' />
                            <div className='product-info'>
                                <div className='rating'>★★★★★</div>
                                <div className='product-name'>{product.name}</div>
                                <div className='product-price'>
                                    {product.oldPrice && <span className='old-price'>{product.oldPrice}</span>}
                                    <span className='current-price'>{product.price}</span>
                                </div>
                                <button 
                                    className='update' 
                                    onClick={() => navigate(`${product.id}`)}>
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button className='show-more'>Show more</button>

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