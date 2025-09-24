import './Navigation.css'
import AuthService from "/src/services/authService";
import { useState, useEffect } from 'react'

export default function AccountNavigation({ userId, activeTab, setActiveTab }) {
    const [name, setName] = useState('Guest');

    const fetchUser = async () => {
        const user = await AuthService.apiCall(`/user/${userId}`, { method: "GET" })
        if (user.success) {
            setName(user.data.name);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [userId])

    const menuItems = ['Account', 'Address', 'Orders', 'Wishlist', 'Log Out'];

    return (
        <nav className='account__navigation'>
            <div className='account__navigation__me'>
                <img src="/public/assets/profile.png" alt="" />
                <div>{name}</div>
            </div>

            <div className='account__navigation__button'>
                {menuItems.map(item => (
                    <button 
                        key={item} 
                        onClick={() => setActiveTab(item)}
                    >
                        <div className={activeTab === item ? 'button-active' : ''}>
                            {item}
                        </div>
                    </button>
                ))}
            </div>
        </nav>
    );
}
