import './Orders.css'

const StatsHeader = () => {
  const stats = [
    { label: 'Revenue', value: '$75,620', change: '+ 22%', type: 'positive' },
    { label: 'Orders', value: '520', change: '+ 5.7%', type: 'positive' },
    { label: 'Visitors', value: '7,283', change: '18%', type: 'negative' },
    { label: 'Conversion', value: '28%', change: '+ 12%', type: 'positive' }
  ]

  return (
    <div className="stats-header">
      <div className="stats-header__title">
        <h2>Orders</h2>
      </div>

      <div className="stats-header__date-picker">
        <span>Jan 01 - Jan 28</span>
        <i className="fas fa-ellipsis-h"></i>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card__info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
            <div className={`stat-card__change ${stat.type}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const mockOrders = [
    {
        orderId: '#53200002',
        products: [
            { img: '/images/bamboo_basket.jpg', items: 8 }, 
            { img: '/images/bamboo_basket.jpg', items: 8 }
        ],
        date: 'Jan 10, 2020',
        customer: 'Ronald Jones',
        revenue: '$253.82',
        status: 'Pending'
    },
    {
        orderId: '#53200003',
        products: [
            { img: '/images/bamboo_basket.jpg', items: 5 }, 
            { img: '/images/bamboo_basket.jpg', items: 5 }
        ],
        date: 'Sep 4, 2020',
        customer: 'Jacob Mckinney',
        revenue: '$556.24',
        status: 'Shipping'
    },
    {
        orderId: '#53200004',
        products: [
            { img: '/images/bamboo_basket.jpg', items: 7 }
        ],
        date: 'Aug 30, 2020',
        customer: 'Randall Murphy',
        revenue: '$115.26',
        status: 'Refund'
    },
    {
        orderId: '#53200005',
        products: [
            { img: '/images/bamboo_basket.jpg', items: 3 }
        ],
        date: 'Aug 29, 2020',
        customer: 'Philip Webb',
        revenue: '$675.51',
        status: 'Completed'
    },
    {
        orderId: '#53200006',
        products: [
            { img: '/images/bamboo_basket.jpg', items: 4 }
        ],
        date: 'Dec 26, 2020',
        customer: 'Arthur Bell',
        revenue: '$910.71',
        status: 'Shipping'
    },
    {
        orderId: '#53200007',
        products: [
            { img: '/images/bamboo_basket.jpg', items: 5 }
        ],
        date: 'Apr 27, 2020',
        customer: 'Gregory Nguyen',
        revenue: '$897.90',
        status: 'Completed'
    },
    {
        orderId: '#53200008',
        products: [
            { img: '/images/bamboo_basket.jpg', items: 3 }
        ],
        date: 'May 5, 2020',
        customer: 'Soham Henry',
        revenue: '$563.43',
        status: 'Pending'
    },
    {
        orderId: '#53200009',
        products: [
            { img: '/images/bamboo_basket.jpg', items: 5 }
        ],
        date: 'Oct 15, 2020',
        customer: 'Jenny Hawkins',
        revenue: '$883.96',
        status: 'Refund'
    },
];

export default function Orders() {
  return (
    <div className="orders-section">
      <StatsHeader />
      <div className="latest-orders">
        <div className="latest-orders__header">
          <h2>Latest orders</h2>
        </div>
        <div className="order-table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Products</th>
                <th>Datey</th>
                <th>Customer</th>
                <th>Total amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>
                    <div className="product-cell">
                      <div className="product-images">
                        {order.products.map((product, index) => (
                          <img
                            key={index}
                            src={product.img}
                            alt={`Product ${index}`}
                            className="order-table__product-image"
                          />
                        ))}
                      </div>
                      <span>{order.products.length} Items </span>
                    </div>
                  </td>
                  <td>{order.date}</td>
                  <td>{order.customer}</td>
                  <td>{order.revenue}</td>
                  <td>
                    <span
                      className={`status-badge status--${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="actions">
                      <button className="icon-btn"><img src="/assets/edit-3.png" alt="edit" /></button>
                      <button className="icon-btn"><img src="/assets/trash-2.png" alt="delete" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}