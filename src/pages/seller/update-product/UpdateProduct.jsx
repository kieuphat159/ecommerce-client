import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateProduct.css';

const UpdateProduct = ({ sellerId }) => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    status: '1',
    sellerId: sellerId,
    sku: ''
  });

  const [originalProduct, setOriginalProduct] = useState(null);
  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState('');
  const [openStock, setOpenStock] = useState(false);
  const [loadedStock, setLoadedStock] = useState(false);
  const [openVariant, setOpenVariant] = useState(false);
  const [loadedVariant, setLoadedVariant] = useState(false);
  const [newOptionName, setNewOptionName] = useState(''); // State for new option input
  const [newOptionValue, setNewOptionValue] = useState({}); // State for new option value inputs
  const navigate = useNavigate();
  
  const [options, setOptions] = useState([]);
  const [optionValues, setOptionValues] = useState({});

  // Fetch product options
  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product-options/${id}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const optionsData = data.data;
          console.log('Options: ', optionsData);
          setOptions(optionsData);
          optionsData.forEach(option => fetchOptionValues(option.id));
        }
      } else {
        console.log('Failed to fetch options');
      }
    } catch (err) {
      console.log('Error fetching options: ', err);
    }
  };

  // Fetch option values for a specific option_id
  const fetchOptionValues = async (option_id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product-option-values/${option_id}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          console.log(`Option values for ${option_id}: `, data.data);
          setOptionValues(prev => ({
            ...prev,
            [option_id]: data.data
          }));
        }
      } else {
        console.log(`Failed to fetch option values for option ${option_id}`);
      }
    } catch (err) {
      console.log(`Error fetching option values for option ${option_id}: `, err);
    }
  };

  // Add new option
  const addOption = async () => {
    if (!newOptionName.trim()) {
      setError('Option name is required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product-options`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: id, name: newOptionName })
      });
      const data = await response.json();
      if (data.success && data.data) {
        setOptions(prev => [...prev, data.data]);
        setNewOptionName('');
        setError('');
      } else {
        throw new Error(data.message || 'Failed to add option');
      }
    } catch (err) {
      console.error('Error adding option:', err);
      setError(err.message || 'Failed to add option');
    }
  };

  // Add new option value
  const addOptionValue = async (option_id) => {
    const value = newOptionValue[option_id]?.trim();
    if (!value) {
      setError('Option value is required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product-option-values`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ option_id, value })
      });
      const data = await response.json();
      if (data.success && data.data) {
        setOptionValues(prev => ({
          ...prev,
          [option_id]: [...(prev[option_id] || []), data.data]
        }));
        setNewOptionValue(prev => ({ ...prev, [option_id]: '' }));
        setError('');
      } else {
        throw new Error(data.message || 'Failed to add option value');
      }
    } catch (err) {
      console.error('Error adding option value:', err);
      setError(err.message || 'Failed to add option value');
    }
  };

  const [stocks, setStocks] = useState([]);
  const fetchStock = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/stocks`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const stocksData = data.data;
          console.log('Stock: ', stocksData);
          setStocks(stocksData);
        }
      } else {
        console.log('Failed to fetch stock');
      }
    } catch (err) {
      console.log('Error fetching stock: ', err);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/product/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        if (data.success && data.data) {
          const productData = data.data;
          console.log('Data:', data);
          setProduct({
            name: productData.name || '',
            price: productData.price ? String(productData.price).replace(/[^0-9.]/g, '') : '',
            description: productData.description || '',
            category: productData.category || '',
            status: productData.status?.toString() || '1',
            sellerId: productData.seller?.toString() || sellerId,
            sku: productData.sku || ''
          });
          setOriginalProduct(productData);
          console.log('Product data: ', productData);
          setCurrentImage(productData.image);
        } else {
          throw new Error(data.message || 'Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoadingProduct(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, sellerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
    
    if (selectedFiles.length > 0) {
      const previewUrls = Array.from(selectedFiles).map(file => URL.createObjectURL(file));
      setPreviewImages(previewUrls);
    } else {
      setPreviewImages([]);
    }
  };

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
      console.log("Error uploading image: ", err);
      throw new Error("Failed to upload image");
    }
  };

  const updateProduct = async (productData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/product/${id}`, {
      method: "PUT",
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
      let imageUrl = currentImage;
      
      if (files.length > 0) {
        imageUploadData = await uploadImage();
        imageUrl = imageUploadData?.url?.[0] || currentImage;
      }

      const productData = {
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        status: product.status,
        sellerId: product.sellerId,
        sku: product.sku,
        image: imageUrl
      };

      const updateResult = await updateProduct(productData);
      
      if (updateResult.success) {
        setResult(updateResult);
        setCurrentImage(imageUrl);
        setFiles([]);
        setPreviewImages([]);
        
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
                
      } else {
        throw new Error(updateResult.message || 'Failed to update product');
      }
      
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.message || 'An error occurred while updating the product');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/product/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Product deleted successfully');
        navigate('/products');
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message || 'An error occurred while deleting the product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  if (loadingProduct) {
    return <div>Loading product...</div>;
  }

  if (error && !originalProduct) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  return (
    <div>
      <div className='header'>
        <h2>Update Product</h2>
        <button onClick={() => navigate(`/products`)}>Back to Products</button>
        <button className="delete-btn" onClick={handleDelete} disabled={loading}>
          {loading ? 'Processing...' : 'Delete Product'}
        </button>
      </div>

      {originalProduct && (
        <div className='product'>
          <div className='product-image'>
            <img 
              src={`${currentImage}` || 'https://placehold.co/600x400'} 
              alt="Current product" 
              width="200"
            />
          </div>
          <div className='product-info'>
            <form onSubmit={handleSubmit}>
              <div>
                <label>SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={product.sku}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Product SKU"
                />
              </div>

              <div>
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
              
              <div>
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
              
              <div>
                <label>Update Product Images</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  multiple
                  disabled={loading}
                />
                {previewImages.length > 0 && (
                  <div>
                    {previewImages.map((previewUrl, index) => (
                      <div key={index}>
                        <img src={previewUrl} alt={`Preview ${index + 1}`} width="150" />
                        <p>New image {index + 1}</p>
                      </div>
                    ))}
                  </div>
                )}
                {files.length > 0 && (
                  <p>Selected {files.length} new image{files.length !== 1 ? 's' : ''} (will replace current image)</p>
                )}
              </div>
              
              <div>
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
              
              <div>
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

              <div>
                <button type='button' onClick={() => {
                  setOpenStock(!openStock);
                  if (!loadedStock) {
                    fetchStock();
                    setLoadedStock(true);
                  }
                }}>Add to stock?</button>
              </div>
              {openStock && (
                <div>
                  <label>Stock</label>
                  <select 
                    name="stock" 
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Select Stock</option>
                    {stocks.map(stock => (
                      <option key={stock.id} value={stock.id}>{stock.name}</option>
                    ))}
                  </select>
                  <div>
                    <label>Add New Option</label>
                    <input
                      type="text"
                      value={newOptionName}
                      onChange={(e) => setNewOptionName(e.target.value)}
                      placeholder="Enter option name (e.g., Color)"
                      disabled={loading}
                    />
                    <button type="button" onClick={addOption} disabled={loading}>
                      {loading ? 'Adding...' : 'Add Option'}
                    </button>
                  </div>
                  <div>
                    <button type='button' onClick={() => {
                      setOpenVariant(!openVariant);
                      if (!loadedVariant) {
                        fetchOptions();
                        setLoadedVariant(true);
                      }
                    }}>Variant?</button>
                  </div>
                  {openVariant && (
                    <>
                      {options.map(option => (
                        <div key={option.id}>
                          <label>{option.name}</label>
                          <select 
                            name={`option_${option.id}`} 
                            onChange={handleChange}
                            disabled={loading}
                          >
                            <option value="">None</option>
                            {optionValues[option.id]?.map(value => (
                              <option key={value.id} value={value.id}>
                                {value.value}
                              </option>
                            ))}
                          </select>
                          <div>
                            <input
                              type="text"
                              value={newOptionValue[option.id] || ''}
                              onChange={(e) => setNewOptionValue(prev => ({
                                ...prev,
                                [option.id]: e.target.value
                              }))}
                              placeholder={`Enter value for ${option.name} (e.g., Red)`}
                              disabled={loading}
                            />
                            <button 
                              type="button" 
                              onClick={() => addOptionValue(option.id)} 
                              disabled={loading}
                            >
                              {loading ? 'Adding...' : 'Add Value'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  <div>
                    <label>Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={product.quantity || '0'}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
              
              <div>
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
              
              <div>
                <label>Seller ID *</label>
                <input
                  type="number"
                  name="sellerId"
                  value={sellerId}
                  onChange={handleChange}
                  required
                  min="1"
                  disabled={loading}
                  placeholder="Enter seller ID"
                  readOnly
                />
              </div>
              
              <button type="submit" disabled={loading}>
                {loading ? 'Updating Product...' : 'Update Product'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {error && (
        <div>
          <strong>Error:</strong> {error}
        </div>
      )}

      {uploadResult && (
        <div>
          <h4>Image Upload Result:</h4>
          <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
        </div>
      )}
      
      {result && (
        <div>
          <h3>Product Updated Successfully!</h3>
          
          {result.data && (
            <div>
              <p>Product ID: {result.data.id || id}</p>
              <p>SKU: {result.data.sku}</p>
              <p>Name: {result.data.name}</p>
              <p>Price: {result.data.price}</p>
              {result.data.category && <p>Category: {result.data.category}</p>}
              <p>Status: {result.data.status === 1 ? 'Active' : 'Inactive'}</p>
            </div>
          )}
          
          <details>
            <summary>View Raw Response</summary>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default UpdateProduct;