import './Products.css';
import { useState } from 'react';

export default function Products() {
    const [openCategory, setOpenCategory] = useState(false);
    const [openPrice, setOpenPrice] = useState(false);
    const products = [
        { name: 'Lowseat Sofas', price: '$199.00', oldPrice: '$400.00', discount: '-50%', isNew: true, rating: 5, image: 'https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757299277/uploads/xzgczevw9m1pdbvgquv2.jpg' },
        { name: 'Luxury Sofas', price: '$299.00', oldPrice: '$600.00', discount: '-50%', isNew: true, rating: 5, image: 'https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757299277/uploads/xzgczevw9m1pdbvgquv2.jpg' },
        { name: 'Table Lamp', price: '$19.00', oldPrice: '', discount: '', isNew: true, rating: 5, image: 'https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757299277/uploads/xzgczevw9m1pdbvgquv2.jpg' },
        { name: 'Cozy Sofa', price: '$299.00', oldPrice: '', discount: '-50%', isNew: true, rating: 5, image: 'https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757299277/uploads/xzgczevw9m1pdbvgquv2.jpg' },
        { name: 'White Drawer unit', price: '$89.00', oldPrice: '', discount: '-10%', isNew: true, rating: 5, image: 'https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757299277/uploads/xzgczevw9m1pdbvgquv2.jpg' },
        { name: 'Black Tray Table', price: '$19.00', oldPrice: '', discount: '-50%', isNew: true, rating: 5, image: 'https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757299277/uploads/xzgczevw9m1pdbvgquv2.jpg' },
        { name: 'Table Lamp', price: '$19.00', oldPrice: '', discount: '-50%', isNew: true, rating: 5, image: 'https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757299277/uploads/xzgczevw9m1pdbvgquv2.jpg' },
        { name: 'Black Brow Side table', price: '$19.00', oldPrice: '', discount: '-50%', isNew: true, rating: 5, image: 'https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757299277/uploads/xzgczevw9m1pdbvgquv2.jpg' },
        { name: 'Light Beige Pillow', price: '$29.00', oldPrice: '', discount: '-10%', isNew: true, rating: 5, image: 'https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757299277/uploads/xzgczevw9m1pdbvgquv2.jpg' },
        { name: 'Table Lamp', price: '$39.00', oldPrice: '', discount: '-50%', isNew: true, rating: 5, image: 'https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757299277/uploads/xzgczevw9m1pdbvgquv2.jpg' },
        { name: 'Bamboo Basket', price: '$29.00', oldPrice: '', discount: '-50%', isNew: true, rating: 5, image: 'https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757299277/uploads/xzgczevw9m1pdbvgquv2.jpg' },
        { name: 'Off-white Pillow', price: '$29.00', oldPrice: '', discount: '-50%', isNew: true, rating: 5, image: 'https://res.cloudinary.com/dvwdjkjrb/image/upload/v1757299277/uploads/xzgczevw9m1pdbvgquv2.jpg' },
    ];

    return (
        <div className='products-section'>
            <div className='product-section__header'>
                <div className='product-section__header--left'>
                    <div>
                        <label>Category</label>
                        <div className='drop-down'>
                            <button onClick={() => setOpenCategory(!openCategory)}>Living Room</button>
                            {openCategory && (
                                <div className="dropdown-menu">
                                    <a href="#" className="drop-down__option">Mục 1</a>
                                    <a href="#" className="drop-down__option">Mục 2</a>
                                    <a href="#" className="drop-down__option">Mục 3</a>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label>Price</label>
                        <div className='drop-down'>
                            <button onClick={() => setOpenPrice(!openPrice)}>All Price</button>
                            {openPrice && (
                                <div className="dropdown-menu">
                                    <a href="#" className="drop-down__option">Mục 1</a>
                                    <a href="#" className="drop-down__option">Mục 2</a>
                                    <a href="#" className="drop-down__option">Mục 3</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='product-section__header--right'>
                    Sort by
                </div>
            </div>
            <div className='product-grid'>
                {products.map((product, index) => (
                    <div className='product-card' key={index}>
                        {product.isNew && <span className='new-tag'>NEW</span>}
                        {product.discount && <span className='discount-tag'>{product.discount}</span>}
                        <img src={product.image} alt={product.name} className='product-image' />
                        <div className='rating'>★★★★★</div>
                        <div className='product-name'>{product.name}</div>
                        <div className='product-price'>
                            {product.oldPrice && <span className='old-price'>{product.oldPrice}</span>}
                            <span className='current-price'>{product.price}</span>
                        </div>
                        <button className='add-to-cart'>Add to cart</button>
                    </div>
                ))}
            </div>
            <button className='show-more'>Show more</button>
        </div>
    );
}