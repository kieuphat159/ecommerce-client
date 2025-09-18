import { useState } from "react";
import "./CartContainer.css";
import ContentProduct from "../content-product/ContentProduct";
import ContentDetail from "../content-detail/ContentDetail";

export default function CartContainer() {
  const mockProducts = [
        {
            name: "Tray Table",
            price: "$19.19",
            quantity: 2,
            img: "https://res.cloudinary.com/dvwdjkjrb/image/upload/v1758166539/a40cc85f069a0857fe7da4976ba73bf5db64a055_1_xktm2a.jpg",
            options: [{
                "Color": "Black"
            }]
        },
        {
            name: "Tray Table",
            price: "$19.19",
            quantity: 1,
            img: "https://res.cloudinary.com/dvwdjkjrb/image/upload/v1758166539/a40cc85f069a0857fe7da4976ba73bf5db64a055_1_xktm2a.jpg",
            options: [{
                "Color": "Red"
            }]
        },
        {
            name: "Table Lamp",
            price: "$39.00",
            quantity: 2,
            img: "https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757638297/uploads/cxpa1kmwq0nwswoidzai.jpg",
            options: [{
                "Color": "Gold"
            }]
        }
    ]


  const [active, setActive] = useState(1);
  const [headerTitle, setHeaderTile] = useState('Cart')

  return (
    <div className="cart-container">
      <div className="cart-container__header">
        <div className="cart-container__header__title">{headerTitle}</div>
        <nav className="cart-container__header__navigation">
          <button
            className={active === 1 ? "active" : ""}
            onClick={() => {setHeaderTile('Cart'); setActive(1);}}
          >
            <div className="circle">1</div>
          </button>

          <button
            className={active === 2 ? "active" : ""}
            onClick={() => {setHeaderTile('Check Out'); setActive(2);}}
          >
            <div className="circle">2</div>
          </button>

          <button
            className={active === 3 ? "active" : ""}
            onClick={() => {setHeaderTile('Complete!'); setActive(3);}}
          >
            <div className="circle">3</div>
          </button>
        </nav>
      </div>

      <div className="content">
        {active === 1 && (
          <ContentProduct mockProducts={mockProducts}/>
        )}
        {active === 2 && (
          <ContentDetail mockProducts={mockProducts}/>
        )}
      </div>
    </div>
  );
}

