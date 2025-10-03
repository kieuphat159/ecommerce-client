import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './OrderDetail.css';
import AuthService from '/src/services/authService';

export default function OrderDetail(setOrderDetail) {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const fromTab = location.state?.fromTab || "overview";

  const [mockOrder, setOrder] = useState({});
  const [mockProducts, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  const [showModalFail, setShowModalFail] = useState(false);

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
    setLoading(true);
    try {
      await AuthService.apiCall(`/seller/order/status/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      setShowModal(false);
      navigate(-1); 
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await AuthService.apiCall(`/seller/order/${orderId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.success) {
        const orderData = Array.isArray(response.data) ? response.data[0] : response.data;
        setOrder(orderData);
        setCurrentStatus(orderData.status?.toLowerCase() || 'pending');
        setPendingStatus(orderData.status?.toLowerCase() || 'pending');

        const itemsResponse = await AuthService.apiCall(`/seller/order-item/${orderId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (itemsResponse.success) {
          setProducts(itemsResponse.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleStatusChange = (e) => {
    setPendingStatus(e.target.value);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await AuthService.apiCall(`/seller/order/status/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
      if (response.success) {
        setCurrentStatus(pendingStatus);
        setShowModal(false);
      } else {
        setShowModalFail(true);
      }
    } catch (error) {
      alert('Error updating status!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPendingStatus(currentStatus);
    setShowModal(false);
  };

  return (
    <section className="order-detail">
      <div className='order-detail__title'>
        <h2>Order #{orderId}</h2>
      </div>
      {loading ? (
        <div className="order-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className='order-detail__content'>
          <div className='content__header'>
            <div className='order-detail__items'>
              {mockProducts && mockProducts.length > 0 && (
                <div className="products-grid">
                  {mockProducts.map((product, index) => (
                    <div className='products-grid__item' key={index}>
                      <div className="product-item">
                        <img
                          src={product.img || product.image_path}
                          alt={product.name || `Product ${index + 1}`}
                        />
                        <div className="quantity-badge">
                          {product.quantity}
                        </div>
                      </div>
                      {product.variant_attributes && (
                        <div className="variant-attributes">
                          <span>{product.variant_attributes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="order-detail__status-dropdown">
              <button 
                    className='back-to-orders' 
                    onClick={() => navigate(-1)}
                >
                    {'< Back to orders'}
                </button>
              <label htmlFor="order-status"><strong>Status:</strong></label>
              <select
                id="order-status"
                value={pendingStatus}
                onChange={handleStatusChange}
                className={`status--${pendingStatus}`}
                disabled={currentStatus !== 'pending'}
              >
                <option className='status--pending' value="pending">Pending</option>
                <option className='status--completed' value="completed">Completed</option>
                <option className='status--cancelled' value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className='order-detail__info'>
            <div className='detail__element'>
              <strong>Customer Name:</strong>
              <div>{`${mockOrder.first_name} ${mockOrder.last_name}`}</div>
            </div>
            <div className='detail__element'>
              <strong>Order Date:</strong>
              <div>{mockOrder.created_at}</div>
            </div>
            <div className='detail__element'>
              <strong>Phone Number:</strong>
              <div>{mockOrder.phone_number}</div>
            </div>
            <div className='detail__element'>
              <strong>Email Address:</strong>
              <div>{mockOrder.email_address}</div>
            </div>
            <div className='detail__element'>
              <strong>Total Amount:</strong>
              <div>${mockOrder.total_amount}</div>
            </div>
            <div className='detail__element'>
              <strong>Payment Method:</strong>
              <div>{mockOrder.payment_method}</div>
            </div>
          </div>
          {currentStatus === 'pending' && (
            <button className='delete-order' onClick={() => setShowDeleteConfirm(true)}>Mark as completed</button>
          )}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm status change</h3>
            <p>
              Are you sure you want to change status from <strong>{currentStatus}</strong> to <strong>{pendingStatus}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
              <button className="btn btn-confirm" onClick={handleConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
      {showModalFail && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Change status failed</h3>
            <div className="modal-actions">
              <button className="btn btn-confirm" onClick={() => setShowModalFail(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm completing order</h3>
            <p>
              Are you sure you want to mark order <strong>{orderId}</strong> as completed?
            </p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-confirm" onClick={handleDeleteConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
