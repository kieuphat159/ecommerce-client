import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import DashboardNav from './components/navigation/DashboardNav';
import Products from '../products/components/Products/Products';
import Orders from './components/orders/Orders';
import OrderDetail from './components/order-detail/OrderDetail';

export default function Dashboard({ sellerId }) {
  const [orderDetail, setOrderDetail] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentTab = searchParams.get("tab") || "home";

  const handleTabChange = (tab) => {
    setOrderDetail(0);
    setSearchParams({ tab });
  };

  return (
    <div className="dashboard">
      <nav className="dashboard--left">
        <DashboardNav
          activeButton={currentTab}
          setActiveButton={handleTabChange}
          setOrderDetail={setOrderDetail}
        />
      </nav>

      <div className="dashboard--right">
        {currentTab === "home" && <h2>Home</h2>}
        {currentTab === "products" && <Products sellerId={sellerId} />}
        {currentTab === "orders" && orderDetail === 0 && <Orders />}
        {currentTab === "orders" && orderDetail !== 0 && (
          <OrderDetail
            orderId={orderDetail}
            setOrderDetail={setOrderDetail}
          />
        )}
        {currentTab === "settings" && <h2>more</h2>}
      </div>
    </div>
  );
}
