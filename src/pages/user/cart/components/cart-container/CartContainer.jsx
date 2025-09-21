import { useState, useEffect } from "react";
import "./CartContainer.css";
import ContentProduct from "../content-product/ContentProduct";
import ContentDetail from "../content-detail/ContentDetail";
import OrderComplete from "../order-complete/OrderComplete";
import AuthService from "/src/services/authService";

export default function CartContainer({ userId }) {
  const [active, setActive] = useState(1);
  const [headerTitle, setHeaderTile] = useState("Cart");
  const [realProducts, setRealProducts] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("free");
  const [quantities, setQuantities] = useState([]);
  const [cartId, setCartId] = useState(0);
  const [orderId, setOrderId] = useState(0);

  const fetchCart = async () => {
    try {
      const data = await AuthService.apiCall(`/user/cart/${userId}`, { method: "GET" });
      if (data.success) {
        const mapped = data.data.map(item => ({
          cart_id: item.cart_id,
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
        if (mapped.length > 0) {
          setCartId(mapped[0].cart_id);
          console.log("cart_id from API:", mapped[0].cart_id);
        }
        setRealProducts(mapped);
        if (quantities.length === 0) {
          setQuantities(mapped.map(p => p.quantity));
        }
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const handleRemove = async (cartItemId) => {
    try {
      const data = await AuthService.apiCall(
        `/user/delete-cart-item/${cartItemId}`,
        { method: "DELETE" }
      );
      if (data.success) {
        const removedIndex = realProducts.findIndex(p => p.cart_item_id === cartItemId);
        
        setRealProducts(prev => prev.filter(p => p.cart_item_id !== cartItemId));
        
        if (removedIndex !== -1) {
          setQuantities(prev => prev.filter((_, index) => index !== removedIndex));
        }
      } else {
        console.error("Remove failed:", data.message || data.error);
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const updateQuantity = async (productIndex, delta) => {
    const product = realProducts[productIndex];
    const unitPrice = parseFloat(product.price.replace('$', ''));
    const totalPrice = unitPrice * delta;
    
    try {
      const data = await AuthService.apiCall(
        `/user/add-to-cart/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            variantId: product.variant_id,
            quantity: delta,         
            unit_price: unitPrice,
            total_price: totalPrice 
          })
        }
      );

      if (data.success) {
        setQuantities(prev => {
          const updated = [...prev];
          updated[productIndex] += delta;
          return updated;
        });
        
        setRealProducts(prev => {
          const updated = [...prev];
          updated[productIndex] = { ...updated[productIndex], quantity: updated[productIndex].quantity + delta };
          return updated;
        });
      } else {
        console.error("Update quantity failed:", data.message || data.error);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-container__header">
        <div className="cart-container__header__title">{headerTitle}</div>
        <nav className="cart-container__header__navigation">
          <button className={active === 1 ? "active" : ""}>
            <div className="circle">1</div>
          </button>

          <button className={active === 2 ? "active" : ""}>
            <div className="circle">2</div>
          </button>

          <button className={active === 3 ? "active" : ""}>
            <div className="circle">3</div>
          </button>
        </nav>
      </div>

      <div className="content">
        {active === 1 && (
          <ContentProduct
            mockProducts={realProducts}
            userId={userId}
            onRemove={handleRemove}
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
            quantities={quantities}
            setQuantities={setQuantities}
            updateQuantity={updateQuantity}
            setActive={setActive}
            setHeaderTile={setHeaderTile}
          />
        )}
        {active === 2 && (
          <ContentDetail 
            mockProducts={realProducts}
            userId={userId}
            onRemove={handleRemove}
            shippingMethod={shippingMethod}
            quantities={quantities}
            setQuantities={setQuantities}
            updateQuantity={updateQuantity}
            cartId={cartId}
            setActive={setActive}
            setHeaderTile={setHeaderTile}
            setOrderId={setOrderId}
          />
        )}
        {active === 3 && <OrderComplete mockProducts={realProducts} orderId={orderId}/>}
      </div>
    </div>
  );
}