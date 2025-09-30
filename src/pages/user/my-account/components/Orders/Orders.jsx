import './Order.css'
import { useState } from 'react'
import OrderComplete from '../../../cart/components/order-complete/OrderComplete';
import AuthService from '/src/services/authService'
import { useNavigate } from 'react-router-dom';

export default function Orders({ orders, page, totalPages, onPageChange, userId }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [quantities, setQuantities] = useState([]);
  const navigate = useNavigate()

  const fetchOrder = async (order) => {
    try {
      const data = await AuthService.apiCall(`/user/order-item/${order.id}`, { method: "GET" });
      if (data.success) {
        const mapped = data.data.map(item => ({
          name: item.name,
          price: `$${item.unit_price}`,
          quantity: item.quantity,
          stock_quantity: item.stock_quantity,
          img: item.image_path,
          cart_item_id: item.cart_item_id,
          variant_id: item.variant_id,
          options: item.variant_attributes
            ? item.variant_attributes.split(", ").map(opt => {
                const [k, v] = opt.split(": ");
                return { [k]: v };
              })
            : []
        }));

        setSelectedOrder({
          ...order,     
          products: mapped,
        });

        if (quantities.length === 0) {
          setQuantities(mapped.map(p => p.quantity));
        }
      }
    } catch (err) {
      console.error("Error fetching :", err);
    }
  };

  if (selectedOrder) {
    return (
      <OrderComplete
        orderId={selectedOrder.id}
        firstTime={false}
        userId={userId}
        mockProducts={selectedOrder.products}
      />
    );
  }

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className='orders__container'>
      <div className='orders__title'>Orders History</div>

      <table className='orders__table'>
        <thead>
          <tr>
            <th>Number ID</th>
            <th>Dates</th>
            <th>Status</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map(order => (
              <tr 
                key={order.id} 
                onClick={() => navigate(`/profile/${userId}?tab=Orders&orderId=${order.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{capitalize(order.status)}</td> 
                <td>${order.price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="orders__pagination">
          <button 
            disabled={page === 1} 
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                className={page === pageNum ? "active" : ""}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button 
            disabled={page === totalPages} 
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
