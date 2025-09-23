import './Order.css'

export default function Orders({ orders, page, totalPages, onPageChange }) {
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
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.date}</td>
                                <td>{order.status}</td>
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
