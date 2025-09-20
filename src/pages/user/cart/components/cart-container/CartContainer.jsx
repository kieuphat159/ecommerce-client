import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // nếu bạn dùng react-router
import "./CartContainer.css";
import ContentProduct from "../content-product/ContentProduct";
import ContentDetail from "../content-detail/ContentDetail";
import OrderComplete from "../order-complete/OrderComplete";

export default function CartContainer({userId}) {
  const [active, setActive] = useState(1);
  const [headerTitle, setHeaderTile] = useState("Cart");
  const [realProducts, setRealProducts] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/${userId}`);
        const data = await res.json();
        if (data.success) {
          const mapped = data.data.map(item => ({
            name: item.name,
            price: `$${item.unit_price}`,
            quantity: item.quantity,
            img: item.image_path,
            options: item.variant_attributes
              ? item.variant_attributes.split(", ").map(opt => {
                  const [k, v] = opt.split(": ");
                  return { [k]: v };
                })
              : []
          }));
          setRealProducts(mapped);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [userId]);

  return (
    <div className="cart-container">
      <div className="cart-container__header">
        <div className="cart-container__header__title">{headerTitle}</div>
        <nav className="cart-container__header__navigation">
          <button
            className={active === 1 ? "active" : ""}
            onClick={() => {
              setHeaderTile("Cart");
              setActive(1);
            }}
          >
            <div className="circle">1</div>
          </button>

          <button
            className={active === 2 ? "active" : ""}
            onClick={() => {
              setHeaderTile("Check Out");
              setActive(2);
            }}
          >
            <div className="circle">2</div>
          </button>

          <button
            className={active === 3 ? "active" : ""}
            onClick={() => {
              setHeaderTile("Complete!");
              setActive(3);
            }}
          >
            <div className="circle">3</div>
          </button>
        </nav>
      </div>

      <div className="content">
        {active === 1 && <ContentProduct mockProducts={realProducts} />}
        {active === 2 && <ContentDetail mockProducts={realProducts} />}
        {active === 3 && <OrderComplete mockProducts={realProducts} />}
      </div>
    </div>
  );
}
