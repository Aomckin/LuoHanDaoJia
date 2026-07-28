import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import orderService, { orderStatusLabels } from '../services/orderService'

export default function OrderList() {
  const [orders, setOrders] = useState([])
  useEffect(() => setOrders(orderService.getOrders()), [])

  return <main className="order-list-page"><header className="simple-header"><Link to="/">‹</Link><h1>我的订单</h1><span /></header>
    <section className="orders-heading"><span>订单中心</span><h1>所有预约订单</h1><p>共 {orders.length} 笔订单</p></section>
    <section className="orders-list">{orders.length ? orders.map((order) => <Link className="history-card" to={`/order/${order.id}`} key={order.id}>
      <div className="history-top"><span>{order.id}</span><b className={`status-pill s${order.status}`}>{orderStatusLabels[order.status]}</b></div>
      <div className="history-main"><div className="mini-avatar">{order.technician.avatar || order.technician.name.slice(0, 1)}</div><div><h2>{order.technician.name}</h2><p>{order.service.name} · {order.service.duration}</p><small>{order.appointment.date} {order.appointment.time}</small></div><strong>¥{order.service.price}</strong></div>
    </Link>) : <div className="orders-empty"><div>◇</div><h2>还没有预约订单</h2><p>选择一位合适的技师，开启放松体验。</p><Link to="/">去预约</Link></div>}</section>
  </main>
}
