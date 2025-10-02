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
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionValue, setNewOptionValue] = useState({});
  const [variantQuantities, setVariantQuantities] = useState({});

  const navigate = useNavigate();
  
  const [options, setOptions] = useState([]);
  const [optionValues, setOptionValues] = useState({});
  const [currentQuantity, setCurrentQuantity] = useState(0);

  const generateCombinations = () => {
    if (options.length === 0) return [];

    const valuesArray = options.map(opt => optionValues[opt.id] || []);
    if (valuesArray.some(arr => arr.length === 0)) return [];

    const cartesian = (arr) =>
      arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);

    return cartesian(valuesArray).map(comb =>
      comb.map((val, idx) => ({
        optionId: options[idx].id,
        optionName: options[idx].name,
        valueId: val.id,
        valueName: val.value
      }))
    );
  };


  const handleQuantityChange = (key, quantity) => {
    setVariantQuantities(prev => ({
      ...prev,
      [key]: quantity
    }));
  };


  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/product-options/${id}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const optionsData = data.data;
          // console.log('Options: ', optionsData);
          setOptions(optionsData);
          optionsData.forEach(option => fetchOptionValues(option.id));
        }
      } else {
        // console.log('Failed to fetch options');
      }
    } catch (err) {
      // console.log('Error fetching options: ', err);
    }
  };

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
          // console.log(`Option values for ${option_id}: `, data.data);
          setOptionValues(prev => ({
            ...prev,
            [option_id]: data.data
          }));
        }
      } else {
        // console.log(`Failed to fetch option values for option ${option_id}`);
      }
    } catch (err) {
      // console.log(`Error fetching option values for option ${option_id}: `, err);
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
          // console.log('Stock: ', stocksData);
          setStocks(stocksData);
        }
      } else {
        // console.log('Failed to fetch stock');
      }
    } catch (err) {
      // console.log('Error fetching stock: ', err);
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
          // console.log('Data:', data);
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
          // console.log('Product data: ', productData);
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
      // console.log("Error uploading image: ", err);
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

      if (!updateResult.success) {
        throw new Error(updateResult.message || 'Failed to update product');
      }

      // 🔥 Xử lý thêm stock theo bảng variantQuantities
      if (openStock && product.stock) {
        const token = localStorage.getItem('token');

        // duyệt từng combination
        for (const [key, qty] of Object.entries(variantQuantities)) {
          if (!qty || qty <= 0) continue; // bỏ qua nếu chưa nhập

          // key là dạng "1-4" (id của option value)
          const optionIds = key.split('-').map(id => parseInt(id, 10));

          // chuyển thành object { optionId: valueId }
          const optionMap = {};
          optionIds.forEach((valId, idx) => {
            const optId = options[idx]?.id;
            if (optId) {
              optionMap[optId] = valId;
            }
          });

          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stock/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              entityId: id,
              stockId: product.stock,
              quantity: parseInt(qty, 10),
              options: optionMap
            })
          });

          const stockResult = await response.json();
          if (!stockResult.success) {
            throw new Error(stockResult.message || 'Failed to update stock');
          }
        }
      }

      setResult(updateResult);
      setCurrentImage(imageUrl);
      setFiles([]);
      setPreviewImages([]);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

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
        navigate('/seller');
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

  const fetchCurrentQuantity = async () => {
    if (!openStock || !product.stock) {
        setCurrentQuantity(0);
        return;
    }
    if (options.length === 0) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product-default-quantity/${id}`);
            const data = await response.json();
            if (data.success && data.data) {
                if (Array.isArray(data.data)) {
                    setCurrentQuantity(data.data[0]?.quantity || 0);
                } else {
                    setCurrentQuantity(data.data.quantity || 0);
                }
            } else {
                setCurrentQuantity(0);
            }
        } catch (err) {
            setCurrentQuantity(0);
        }
        return;
    }
    const selectedOptions = {};
    options.forEach(opt => {
        const val = product[`option_${opt.id}`];
        if (val) selectedOptions[opt.id] = val;
    });

    if (Object.keys(selectedOptions).length === 0) {
        setCurrentQuantity(0);
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/product-variant-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ product_id: id, options: selectedOptions })
        });
        const data = await res.json();
        if (data.success && data.variantId) {
            const stockRes = await fetch(`${import.meta.env.VITE_API_URL}/api/stock/${data.variantId}?stockId=${product.stock}`);
            const stockData = await stockRes.json();
            if (stockData.success) {
                setCurrentQuantity(stockData.data.quantity || 0);
            } else {
                setCurrentQuantity(0);
            }
        } else {
            setCurrentQuantity(0);
        }
    } catch (err) {
        setCurrentQuantity(0);
    }
};

  useEffect(() => {
    fetchCurrentQuantity();
  }, [product, options, openStock]);

  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  return (
    <div>
      {(loading || loadingProduct) && (
        <div className="update-product__spinner">
          <div className="spinner"></div>
        </div>
      )}
      {!(loading || loadingProduct) && (
        <>
          <div className="header">
            <h2 className="header__title">Update Product</h2>
            <div>
              <button
                className="header__button"
                onClick={() => navigate('/seller')}
                disabled={loading}
              >
                Back
              </button>
              <button
                className="header__button header__button--delete"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Delete Product'}
              </button>
            </div>
          </div>

          {originalProduct && (
            <div className="product">
              <div className="product__image">
                <img
                  src={currentImage || 'https://placehold.co/600x400'}
                  alt="Current product"
                />
                {files.length > 0 && (
                  <p>
                    Selected {files.length} new image{files.length !== 1 ? 's' : ''} (will replace current image)
                  </p>
                )}
              </div>
              <div className="product__info">
                <form onSubmit={handleSubmit}>
                  <div className="info__field">
                    <label className="product__info__label">SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={product.sku}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Product SKU"
                      className="product__info__input"
                    />
                  </div>

                  <div className="info__field">
                    <label className="product__info__label">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Enter product name"
                      className="product__info__input"
                    />
                  </div>

                  <div className="info__field">
                    <label className="product__info__label">Price ($) *</label>
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
                      className="product__info__input"
                    />
                  </div>

                  <div className="info__field">
                    <label className="product__info__label">Update Product Images</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      multiple
                      disabled={loading}
                      className="product__info__input"
                    />
                    {previewImages.length > 0 && (
                      <div className="product__info__preview">
                        {previewImages.map((previewUrl, index) => (
                          <div key={index}>
                            <img src={previewUrl} alt={`Preview ${index + 1}`} />
                            <p>New image {index + 1}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="info__field">
                    <label className="product__info__label">Description</label>
                    <textarea
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                      rows="4"
                      disabled={loading}
                      placeholder="Enter product description (optional)"
                      className="product__info__textarea"
                    />
                  </div>

                  <div className="info__field">
                    <label className="product__info__label">Category</label>
                    <select
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      disabled={loading}
                      className="product__info__select"
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

                  <div className="info__field">
                    <button
                      type="button"
                      className="add-to-stock-button"
                      onClick={() => {
                        setOpenStock(!openStock);
                        setOpenVariant(!openVariant);
                        if (!loadedVariant) {
                          fetchOptions();
                          setLoadedVariant(true);
                        }
                        if (!loadedStock) {
                          fetchStock();
                          setLoadedStock(true);
                        }
                      }}
                      disabled={loading}
                    >
                      {openStock ? 'Hide Quantity Options' : 'Add Quantity'}
                    </button>
                  </div>

                  {openStock && (
                    <div className="info__field">
                      <label className="product__info__label">Stock</label>
                      <select
                        name="stock"
                        onChange={handleChange}
                        disabled={loading}
                        className="product__info__select"
                      >
                        <option value="">Select Stock</option>
                        {stocks.map(stock => (
                          <option key={stock.id} value={stock.id}>
                            {stock.name}
                          </option>
                        ))}
                      </select>

                      <div className="info__field">
                        <label className="product__info__label">Add New Option</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={newOptionName}
                            onChange={(e) => setNewOptionName(e.target.value)}
                            placeholder="Enter option name (e.g., Color)"
                            disabled={loading}
                            className="product__info__input"
                          />
                          <button
                            type="button"
                            className="header__button add-option-button"
                            onClick={addOption}
                            disabled={loading}
                          >
                            {loading ? 'Adding...' : 'Add Option'}
                          </button>
                        </div>
                      </div>

                      {openVariant && (
                        <div className="variant-table">
                          <table>
                            <thead>
                              <tr>
                                {options.map(opt => (
                                  <th key={opt.id}>{opt.name}</th>
                                ))}
                                <th>Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {generateCombinations().map((comb, index) => {
                                const key = comb.map(c => c.valueId).join('-');
                                return (
                                  <tr key={index}>
                                    {comb.map(c => (
                                      <td key={c.optionId}>{c.valueName}</td>
                                    ))}
                                    <td>
                                      <input
                                        type="number"
                                        value={variantQuantities[key] || 0}
                                        min="0"
                                        onChange={(e) =>
                                          handleQuantityChange(key, parseInt(e.target.value, 10))
                                        }
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}


                      <div className="info__field">
                        <label className="product__info__label">Quantity *</label>
                        <input
                          type="number"
                          name="quantity"
                          value={product.quantity || '0'}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          placeholder="0"
                          className="product__info__input"
                        />
                        <p>Current quantity in selected stock: {currentQuantity}</p>
                      </div>
                    </div>
                  )}

                  <div className="info__field">
                    <label className="product__info__label">Status</label>
                    <select
                      name="status"
                      value={product.status}
                      onChange={handleChange}
                      disabled={loading}
                      className="product__info__select"
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                  <button type="submit" className="submit__button" disabled={loading}>
                    {loading ? 'Updating Product...' : 'Update Product'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {error && (
            <div className="error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="modal-overlay">
              <div className="modal">
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
        </>
      )}
    </div>
  );
};

export default UpdateProduct;