import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import OrderStatus from '../components/OrderStatus'
import orderService, { orderStatusLabels } from '../services/orderService'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    orderService.getOrderById(id)
      .then((nextOrder) => active && setOrder(nextOrder))
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id])

  const advance = async () => {
    if (!order || order.status === 3) return
    setUpdating(true)
    setError('')
    try {
      setOrder(await orderService.updateOrderStatus(order.id, order.status + 1))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <main className="not-found"><h1>正在加载订单…</h1></main>
  if (error && !order) return <main className="not-found"><h1>订单加载失败</h1><p>{error}</p><Link to="/orders">查看我的订单</Link></main>
  if (!order) return <main className="not-found"><h1>未找到订单</h1><p>订单可能不存在。</p><Link to="/orders">查看我的订单</Link></main>

  return <main className="success-page">
    <header className="simple-header"><Link to="/orders">‹</Link><h1>订单详情</h1><Link className="header-orders" to="/orders">订单</Link></header>
    <section className="success-banner"><div className="success-mark">✓</div><h1>{order.status === 3 ? '服务已完成' : '预约成功'}</h1><p>{order.status === 3 ? '感谢选择罗汉到家，期待再次为您服务。' : '订单已创建，可随时查看订单进度。'}</p></section>
    <section className="order-card"><div className="order-top"><div><small>订单编号</small><b>{order.id}</b></div><span className={`status-pill s${order.status}`}>{orderStatusLabels[order.status]}</span></div><OrderStatus status={order.status} /><div className="order-details"><p><span>服务技师</span><b>{order.technician.name}</b></p><p><span>服务项目</span><b>{order.service.name}</b></p><p><span>预约时间</span><b>{order.appointment.date} {order.appointment.time}</b></p><p><span>服务金额</span><b className="red">¥{order.service.price}</b></p></div></section>
    {error ? <p className="request-error">{error}</p> : null}
    <button className="advance" disabled={order.status === 3 || updating} onClick={advance}>{updating ? '正在更新…' : order.status === 3 ? '订单已完成' : `推进至「${orderStatusLabels[order.status + 1]}」`}</button><Link className="home-link" to="/orders">查看我的订单</Link>
  </main>
}
