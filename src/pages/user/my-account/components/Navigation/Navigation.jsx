import './Navigation.css'
import AuthService from "/src/services/authService";
import { useState, useEffect } from 'react'
import useAuth from '/src/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AccountNavigation({ userId, activeTab, setActiveTab }) {
    const [name, setName] = useState('Guest');
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const signOut = () => {
        logout();
        navigate("/signin");
    };

    const fetchUser = async () => {
        const user = await AuthService.apiCall(`/user/${userId}`, { method: "GET" })
        if (user.success) {
            setName(user.data.name);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [userId])

    const menuItems = ['Account', 'Address', 'Orders'];

    const handleDropdownChange = (e) => {
        const value = e.target.value;
        if (value === 'Log Out') {
            setShowModal(true);
        } else {
            navigate(`/profile/${userId}?tab=${value}`);
            setActiveTab(value);
        }
    };

    return (
        <nav className='account__navigation'>
            <div className='account__navigation__me'>
                <img src="/public/assets/profile.png" alt="" />
                <div>{name}</div>
            </div>

            <div className='account__navigation__button desktop-only'>
                {menuItems.map(item => (
                    <button 
                        key={item} 
                        onClick={() => navigate(`/profile/${userId}?tab=${item}`)}
                    >
                        <div className={activeTab === item ? 'button-active' : 'button-inactive'}>
                            {item}
                        </div>
                    </button>
                ))}
                <button onClick={() => setShowModal(true)}>Log Out</button>
            </div>

            <div className='account__navigation__dropdown mobile-only'>
                <select value={activeTab} onChange={handleDropdownChange}>
                    {menuItems.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                    <option value='Log Out'>Log Out</option>
                </select>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 className="confirm">Confirm signing out</h3>
                        <p className="sure">Are you sure you want to sign out ?</p>
                        <div className="modal-actions">
                            <button className="btn btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-confirm" onClick={signOut}>Sign out</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}