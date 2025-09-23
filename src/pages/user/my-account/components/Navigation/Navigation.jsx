import './Navigation.css'
import AuthService from "/src/services/authService";
import { useState, useEffect } from 'react'

export default function AccountNavigation({userId}) {
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
    return(
        <>
            <nav className='account__navigation'>
                <div className='account__navigation__me'>
                    <img src="/public/assets/profile.png" alt="" />
                    <div>{name}</div>
                </div>
                <div className='account__navigation__button'>
                    <button><div className='button-active'>Account</div></button>
                    <button><div>Address</div></button>
                    <button><div> Orders</div></button>
                    <button><div>Wishlist</div></button>
                    <button><div>Log Out</div></button>
                </div>
            </nav>
        </>
    );
}