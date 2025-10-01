import React, { useState, useEffect } from 'react';
import "./CreateProduct.css";
import { useNavigate } from 'react-router-dom';

const UploadProduct = ({sellerId}) => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    status: '1',
    sellerId: sellerId,
    size: '',
    color: ''
  });

  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken")

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined
        }
      })
      const data = await response.json();
      setCategories(data.data)
      // // console.log('Categories data:', data);
      // // console.log('ookk: ', response);
    } catch (err) {
      console.error('Failed to fetch categories:', err.message);
    }
  } 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
    
    if (selectedFiles.length > 0) {
      // Create preview URLs for all selected files
      const previewUrls = Array.from(selectedFiles).map(file => URL.createObjectURL(file));
      setPreviewImages(previewUrls);
    } else {
      setPreviewImages([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [])

  // Upload image function similar to SellerPage
  const uploadImage = async () => {
    if (files.length === 0) {
      return null;
    }

    const formData = new FormData();

    try {
      let response;
      if (files.length === 1) {
        formData.append("image", files[0]);
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
          method: "POST",
          body: formData
        });
      } else {
        Array.from(files).forEach((file) => {
          formData.append("image", file);
        });
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
          method: "POST",
          body: formData
        });
      }
      
      const data = await response.json();
      setUploadResult(data);
      return data;
    } catch (err) {
      // // console.log("Error uploading image: ", err);
      throw new Error("Failed to upload image");
    }
  };

  const createProduct = async (productData) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    return await response.json();
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setResult(null);
  setUploadResult(null);
  
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

    let imageUploadData = null;
    let imageUrl = null;
    
    // Upload images first if any files are selected
    if (files.length > 0) {
      imageUploadData = await uploadImage();

      imageUrl = imageUploadData?.url?.[0] || null;
    }

    const productData = {
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      status: product.status,
      sellerId: product.sellerId,
      image: imageUrl
    };


    // Create product
    const createResult = await createProduct(productData);
    
    if (createResult.success) {
      setResult(createResult);
      
      // Reset form after successful creation
      setProduct({
        name: '',
        price: '',
        description: '',
        category: '',
        status: '1',
        sellerId: {sellerId},
      });
      setFiles([]);
      setPreviewImages([]);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // // console.log('Product created successfully:', createResult.data);
      
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
  React.useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  return (
    <>
    <div className="header">
            <h2 className="header__title">Create Product</h2>
            <div>
              <button
                className="header__button"
                onClick={() => navigate('/seller')}
                disabled={loading}
              >
                Back
              </button>
            </div>
      </div>
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
          <label>Product Images</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            multiple
            disabled={loading}
            className='form__input'
          />
          {previewImages.length > 0 && (
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {previewImages.map((previewUrl, index) => (
                <img 
                  key={index}
                  src={previewUrl} 
                  alt={`Preview ${index + 1}`} 
                  style={{ 
                    maxWidth: '150px', 
                    maxHeight: '150px',
                    objectFit: 'cover',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    display: 'block'
                  }} 
                />
              ))}
            </div>
          )}
          {files.length > 0 && (
            <p style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
              Selected {files.length} image{files.length !== 1 ? 's' : ''}
            </p>
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
            {categories.map(category => (
              <option value={category.name}> {category.name}</option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          className='form__button'
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
      
      {/* Display upload result if available */}
      {uploadResult && (
        <div className="upload-result-section" style={{ marginTop: '20px' }}>
          <h4>Image Upload Result:</h4>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(uploadResult, null, 2)}
          </pre>
        </div>
      )}
      
      {result && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Product Created Successfully!</h3>
            {result.data && (
              <div>
                <p><strong>Product ID:</strong> {result.data.id}</p>
                <p><strong>SKU:</strong> {result.data.sku}</p>
                <p><strong>Name:</strong> {result.data.name}</p>
                <p><strong>Price:</strong> {result.data.price}</p>
                {result.data.category && <p><strong>Category:</strong> {result.data.category}</p>}
                <p><strong>Status:</strong> {result.data.status === 1 ? 'Active' : 'Inactive'}</p>
              </div>
            )}
            <details >
              <summary >
                View Raw Response
              </summary>
              <pre >
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
            <button
              className="btn update-btn--confirm"
              onClick={() => setResult(null)}
              style={{marginTop: '16px'}}
            >
              Close
            </button>
          </div>
        </div>
      )}
      { /* result && navigate('/products') */}
    </div>
    </>
  );
};

export default UploadProduct;