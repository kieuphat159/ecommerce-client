import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import "./CartContainer.css";
import ContentProduct from "../content-product/ContentProduct";
import ContentDetail from "../content-detail/ContentDetail";
import OrderComplete from "../order-complete/OrderComplete";
import AuthService from "/src/services/authService";
import { debounce } from "../../../../../components/Debounce"; // giữ import của bạn

export default function CartContainer({ userId }) {
  const [active, setActive] = useState(1);
  const [headerTitle, setHeaderTile] = useState("Cart");
  const [realProducts, setRealProducts] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("free");
  const [quantities, setQuantities] = useState([]);
  const [cartId, setCartId] = useState(0);
  const [orderId, setOrderId] = useState(0);

  // refs để luôn truy cập dữ liệu mới trong hàm debounce
  const realProductsRef = useRef([]);
  const userIdRef = useRef(userId);
  const pendingDeltasRef = useRef({}); // { [cart_item_id]: totalDelta }

  useEffect(() => { realProductsRef.current = realProducts; }, [realProducts]);
  useEffect(() => { userIdRef.current = userId; }, [userId]);

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
        // clear any pending delta for that item
        if (pendingDeltasRef.current[cartItemId]) {
          delete pendingDeltasRef.current[cartItemId];
        }
      } else {
        console.error("Remove failed:", data.message || data.error);
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // Hàm gửi delta lên server (gọi API per item)
  const sendDeltaToServer = useCallback(async (cartItemId, delta) => {
    // tìm product hiện tại (cần variant id, unit_price)
    const product = realProductsRef.current.find(p => p.cart_item_id === Number(cartItemId));
    if (!product) {
      console.warn("Product not found for cartItemId", cartItemId);
      return;
    }

    const unitPrice = parseFloat(String(product.price).replace('$', '')) || 0;
    const totalPrice = unitPrice * delta;

    try {
      const data = await AuthService.apiCall(
        `/user/add-to-cart/${userIdRef.current}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            variantId: product.variant_id,
            quantity: delta, // IMPORTANT: API expects delta (add)
            unit_price: unitPrice,
            total_price: totalPrice
          })
        }
      );

      if (!data.success) {
        console.error("Update quantity failed:", data.message || data.error);
        // Optional: nếu muốn retry/rollback, có thể push lại vào pendingDeltasRef.current[cartItemId]
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      // Optional: re-add delta for retry
    }
  }, []);

  // flush tất cả pending deltas (gọi mỗi khi debounce xảy ra)
  const flushPendingDeltas = useCallback(async () => {
    const pending = { ...pendingDeltasRef.current };
    // reset ngay để tránh gửi trùng khi flush đang chạy
    pendingDeltasRef.current = {};

    const entries = Object.entries(pending);
    if (entries.length === 0) return;

    // gửi song song (hoặc tuần tự nếu cần)
    await Promise.all(entries.map(([cartItemId, delta]) => {
      if (!delta || delta === 0) return Promise.resolve();
      return sendDeltaToServer(cartItemId, delta);
    }));
  }, [sendDeltaToServer]);

  // debounce flush (tạo 1 lần)
  const debouncedFlush = useMemo(() => debounce(flushPendingDeltas, 400), [flushPendingDeltas]);

  // Hàm được truyền vào con: cập nhật UI ngay, ghi pending delta, gọi debouncedFlush
  const handleQuantityChange = (productIndex, delta) => {
    // 1) update UI ngay (quantities và realProducts)
    setQuantities(prev => {
      const updated = [...prev];
      // bảo đảm index hợp lệ
      updated[productIndex] = (updated[productIndex] || 0) + delta;
      return updated;
    });

    setRealProducts(prev => {
      const updated = [...prev];
      const prevItem = updated[productIndex] || {};
      updated[productIndex] = { ...prevItem, quantity: (prevItem.quantity || 0) + delta };
      return updated;
    });

    // 2) add to pending deltas keyed by cart_item_id (ổn định hơn dùng index)
    const item = realProductsRef.current[productIndex];
    if (!item) {
      console.warn("handleQuantityChange: productIndex not found", productIndex);
      return;
    }
    const key = String(item.cart_item_id);
    pendingDeltasRef.current[key] = (pendingDeltasRef.current[key] || 0) + delta;

    // 3) debounce flush
    debouncedFlush();
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
            updateQuantity={handleQuantityChange} // truyền delta handler
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
            updateQuantity={handleQuantityChange}
            cartId={cartId}
            setActive={setActive}
            setHeaderTile={setHeaderTile}
            setOrderId={setOrderId}
          />
        )}
        {active === 3 && <OrderComplete mockProducts={realProducts} orderId={orderId} userId={userId} />}
      </div>
    </div>
  );
}
