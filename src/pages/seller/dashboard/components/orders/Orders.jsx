import './Orders.css'
import { useState, useEffect } from 'react'
import AuthService from '/src/services/authService'
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const navigate = useNavigate();

  const StatsHeader = () => {
    const stats = [
      { label: 'Revenue', value: '$75,620', change: '+ 22%', type: 'positive' },
      { label: 'Orders', value: totalItem, change: '+ 5.7%', type: 'positive' },
      { label: 'Visitors', value: '7,283', change: '18%', type: 'negative' },
      { label: 'Conversion', value: '28%', change: '+ 12%', type: 'positive' }
    ];

    return (
      <div className="stats-header">
        <div className="stats-header__title">
          <h2>Orders</h2>
        </div>

        <div className="stats-header__date-picker">
          <span>Jan 01 - Jan 28</span>
          <i className="fas fa-ellipsis-h"></i>
        </div>

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

  const fetchOrders = async () => {
    try {
      const response = await AuthService.apiCall(`/seller/orders?page=${page}&limit=5`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (response.success) {
        setOrders(response.data.orders || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalItem(response.data.totalItems);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await AuthService.apiCall(`/seller/orders/${orderToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      setOrders((prev) => prev.filter(order => order.order_id !== orderToDelete));
      setShowModal(false);
      setOrderToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
    setOrderToDelete(null);
  };

  return (
    <div className="orders-section">
      <StatsHeader />
      <div className="latest-orders">
        <div className="latest-orders__header">
          <h2>Latest orders</h2>
        </div>
        <div className="order-table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Date</th>
                <th>Total amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>#{order.order_id}</td>
                  <td>{order.first_name} {order.last_name}</td>
                  <td>{order.phone_number}</td>
                  <td>{order.email_address || '-'}</td>
                  <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</td>
                  <td>{order.total_amount ? `$${Number(order.total_amount).toFixed(2)}` : '-'}</td>
                  <td>
                    <span className={`status-badge status--${order.status || 'pending'}`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td>{order.payment_method || '-'}</td>
                  <td className="actions-cell">
                    <div className="actions">
                      <button
                        className="icon-btn"
                        onClick={() => navigate(`/seller/order-detail/${order.order_id}`, { state: { fromTab: "orders" } })}
                      >
                        <img src="/assets/edit-3.png" alt="view detail" />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => handleDeleteClick(order.order_id)}
                      >
                        <img src="/assets/trash-2.png" alt="delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="orders__pagination">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(prev => prev - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={page === i + 1 ? "orders__pagination--active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm deletion</h3>
            <p>Are you sure you want to delete the order #{orderToDelete} ?</p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={handleDeleteCancel}>Cancel</button>
              <button className="btn btn-confirm" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
