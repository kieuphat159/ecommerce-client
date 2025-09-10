import React, { useState } from 'react';
import "./CreateProduct.css";

const UploadProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    status: '1',
    sellerId: '2',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    // Clear previous errors when user starts typing
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    } else {
      setPreviewImage('');
    }
  };

  const createProduct = async (formData) => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    
    const response = await fetch("http://localhost:5000/api", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}` // Thêm authorization header
      },
      body: formData // Gửi FormData, không set Content-Type header
    });
    
    return await response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      // Validation
      if (!product.name.trim()) {
        throw new Error('Product name is required');
      }
      if (!product.price || parseFloat(product.price) <= 0) {
        throw new Error('Valid price is required');
      }
      if (!product.sellerId) {
        throw new Error('Seller ID is required');
      }

      // Tạo FormData để gửi cả file và data
      const formData = new FormData();
      
      // Thêm product data
      formData.append('name', product.name);
      formData.append('price', product.price);
      formData.append('description', product.description);
      formData.append('category', product.category);
      formData.append('status', product.status);
      formData.append('sellerId', product.sellerId);
      
      // Thêm file nếu có
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      // Gọi API tạo sản phẩm
      const createResult = await createProduct(formData);
      
      if (createResult.success) {
        setResult(createResult);
        
        // Reset form sau khi tạo thành công
        setProduct({
          name: '',
          price: '',
          description: '',
          category: '',
          status: '1',
          sellerId: '2',
        });
        setSelectedFile(null);
        setPreviewImage('');
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
        console.log('Product created successfully:', createResult.data);
        
      } else {
        throw new Error(createResult.message || 'Failed to create product');
      }
      
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err.message || 'An error occurred while creating the product');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Clean up preview URL khi component unmount
  React.useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <div className="upload-product-container">
      <h2>Create New Product</h2>
      
      {error && (
        <div className="error-message" style={{ 
          backgroundColor: '#ffe6e6', 
          color: '#d8000c', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #d8000c'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter product name"
          />
        </div>
        
        <div className="form-group">
          <label>Price ($) *</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            required
            disabled={loading}
            placeholder="0.00"
          />
        </div>
        
        <div className="form-group">
          <label>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          {previewImage && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={previewImage} 
                alt="Preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px',
                  objectFit: 'cover',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  display: 'block'
                }} 
              />
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="4"
            disabled={loading}
            placeholder="Enter product description (optional)"
          />
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <select 
            name="category" 
            value={product.category} 
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select Category (Optional)</option>
            <option value="Living Room">Living Room</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Bathroom">Bathroom</option>
            <option value="Office">Office</option>
            <option value="Outdoor">Outdoor</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Seller ID *</label>
          <input
            type="number"
            name="sellerId"
            value={product.sellerId}
            onChange={handleChange}
            required
            min="1"
            disabled={loading}
            placeholder="Enter seller ID"
          />
        </div>
        
        <div className="form-group">
          <label>Status</label>
          <select 
            name="status" 
            value={product.status} 
            onChange={handleChange}
            disabled={loading}
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#000000ff',
            cursor: loading ? 'not-allowed' : 'pointer',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Creating Product...' : 'Create Product'}
        </button>
      </form>
      
      {result && (
        <div className="result-section" style={{ marginTop: '20px' }}>
          <div className="success-message" style={{
            backgroundColor: '#e6ffe6',
            color: '#2d7d2d',
            padding: '15px',
            borderRadius: '4px',
            border: '1px solid #2d7d2d'
          }}>
            <h3>✅ Product Created Successfully!</h3>
            
            {result.data && (
              <div className="product-details" style={{ marginTop: '10px' }}>
                <p><strong>Product ID:</strong> {result.data.id}</p>
                <p><strong>SKU:</strong> {result.data.sku}</p>
                <p><strong>Name:</strong> {result.data.name}</p>
                <p><strong>Price:</strong> {result.data.price}</p>
                {result.data.category && <p><strong>Category:</strong> {result.data.category}</p>}
                <p><strong>Status:</strong> {result.data.status === 1 ? 'Active' : 'Inactive'}</p>
              </div>
            )}
            
            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                View Raw Response
              </summary>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
                marginTop: '5px'
              }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadProduct;