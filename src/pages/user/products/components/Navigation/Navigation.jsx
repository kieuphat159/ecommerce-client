import "./Navigation.css";

export default function Navigation() {
    return (
        <nav>
            <div className="leftSide">3legant.</div>
            <div className="center">
                <a href="#">Home</a>
                <a href="#">Products</a>
                <a href="#">Cart</a>
                <a href="#">Profile</a>
            </div>
            <div className="rightSide">
                <button>search</button>
                <button>profile</button>
                <button>cart</button>
            </div>
            
        </nav>
    );
}