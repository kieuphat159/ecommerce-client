import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import AuthService from '/src/services/authService'
import './Home.css'

const salesForecast = [
  { title: "Revenue", value: "+24.2%", color: "orange" },
  { title: "Net Profit", value: "-2.5%", color: "red" },
  { title: "Orders", value: "+32.8%", color: "green" },
  { title: "Visitors", value: "+60%", color: "orange" },
];

export default function DashboardHome() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBestsellers = async () => {
    setLoading(true);
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/bestsellers`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const response = await res.json();
        if (response.success) {
            setProducts(response.data);
            // // console.log(response.data);
        }
    } catch (err) {
        // console.log('Err: ', err);
    } finally {
        setLoading(false);
    }
  }

  const fetchRevenue = async () => {
    setLoading(true);
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
    } finally {
        setLoading(false)
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
      <div className="stats-header">
        <div className="stats-header__title">
          <h2>Dashboard</h2>
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
    setLoading(true);
    try {
      const response = await AuthService.apiCall(`/seller/orders?page=${page}&limit=4`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (response.success) {
        setOrders(response.data.orders || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalItem(response.data.totalItems);
        // console.log(response.data.orders)
      }
    } catch (err) {
      // console.log(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchRevenue();
    fetchBestsellers();
  }, [page]);

  const navigate = useNavigate();
  return(
    <>
        {loading && (
            <div className="order-spinner">
            <div className="spinner"></div>
            </div>
        )}
        <StatsHeader />
        <div className="home-container">
        <div className="card bestsellers">
            <div className="card-header">
            <h3>Bestsellers</h3>
            </div>
            <table className="bestsellers-table">
            <thead>
                <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Sold</th>
                <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
                {products.map((item) => (
                <tr key={item.entity_id}>
                    <td className="product-cell">
                    <img src={item.img} alt={item.name} />
                    <span>{item.name}</span>
                    </td>
                    <td>${item.price}</td>
                    <td>{item.sold_quantity}</td>
                    <td>${item.revenue}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        <div className="card forecast">
            <div className="card-header">
            <h3>Sales forecast</h3>
            </div>
            <div className="forecast-grid">
            {salesForecast.map((item, idx) => (
                <div className="forecast-item" key={idx}>
                <span className="forecast-title">{item.title}</span>
                <span className={`forecast-value ${item.color}`}>
                    {item.value}
                </span>
                <div className={`forecast-line ${item.color}`}></div>
                </div>
            ))}
            </div>
        </div>
        </div>
        <div className="home__latest-orders">
        <div className="latest-orders__header">
          <h2>Latest orders</h2>
            <button 
                className="more-btn" 
                onClick={() => navigate("/seller?tab=orders")}
            >
                More →
            </button>
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
    </div>
    </>
  );
}