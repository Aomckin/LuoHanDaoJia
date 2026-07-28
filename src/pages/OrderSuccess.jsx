import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import OrderStatus from '../components/OrderStatus'

export default function OrderSuccess() {
  const { state } = useLocation()
  const [order, setOrder] = useState(state?.order)
  useEffect(() => { if (!order) { const saved = localStorage.getItem('luohan-order'); if (saved) setOrder(JSON.parse(saved)) } }, [order])
  const advance = () => { const next = { ...order, status: Math.min(order.status + 1, 3) }; localStorage.setItem('luohan-order', JSON.stringify(next)); setOrder(next) }
  if (!order) return <main className="not-found"><h1>暂无订单</h1><p>请选择一位技师，开启第一次放松体验。</p><Link to="/">去预约</Link></main>
  const labels = ['待接单', '已接单', '服务中', '已完成']
  return <main className="success-page"><header className="simple-header"><Link to="/">‹</Link><h1>订单详情</h1><span /></header><section className="success-banner"><div className="success-mark">✓</div><h1>{order.status === 3 ? '服务已完成' : '预约成功'}</h1><p>{order.status === 3 ? '感谢选择罗汉到家，期待再次为您服务。' : '订单已提交，正在为您匹配服务时间。'}</p></section><section className="order-card"><div className="order-top"><div><small>订单编号</small><b>{order.orderId}</b></div><span className={`status-pill s${order.status}`}>{labels[order.status]}</span></div><OrderStatus status={order.status} /><div className="order-details"><p><span>服务技师</span><b>{order.technician}</b></p><p><span>服务项目</span><b>{order.service}</b></p><p><span>预约时间</span><b>{order.date} {order.time}</b></p><p><span>服务金额</span><b className="red">¥{order.price}</b></p></div></section><button className="advance" disabled={order.status === 3} onClick={advance}>{order.status === 3 ? '订单已完成' : `推进至「${labels[order.status + 1]}」`}</button><Link className="home-link" to="/">返回首页</Link></main>
}
