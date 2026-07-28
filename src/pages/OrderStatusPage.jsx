import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const tasks = [
  { title: '创建预约订单', detail: '已生成订单编号' },
  { title: '匹配服务技师', detail: '正在通知技师确认时间' },
  { title: '等待技师接单', detail: '通常需要几分钟，请耐心等候' },
]

export default function OrderStatusPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState(state?.order)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!order) {
      const saved = localStorage.getItem('luohan-order')
      if (saved) setOrder(JSON.parse(saved))
    }
  }, [order])

  useEffect(() => {
    if (step >= tasks.length - 1) return undefined
    const timer = window.setTimeout(() => setStep((current) => current + 1), 850)
    return () => window.clearTimeout(timer)
  }, [step])

  if (!order) return <main className="not-found"><h1>暂无订单任务</h1><p>请先完成服务预约。</p><Link to="/">去预约</Link></main>

  const complete = step === tasks.length - 1
  return <main className="status-page">
    <header className="simple-header"><Link to="/">‹</Link><h1>订单状态</h1><span /></header>
    <section className="task-hero">
      <div className={`task-orbit ${complete ? 'complete' : ''}`}><span>{complete ? '✓' : '…'}</span></div>
      <p>{complete ? '订单任务已创建' : '正在加载订单任务'}</p>
      <h1>{complete ? '等待技师接单' : '请稍候，正在为您安排'}</h1>
      <small>订单号：{order.orderId}</small>
    </section>
    <section className="task-card">
      <div className="task-card-title"><div><span>订单进度</span><h2>预约任务</h2></div><b>{complete ? '已完成' : '处理中'}</b></div>
      <div className="task-list">{tasks.map((task, index) => <div className={`task-item ${index <= step ? 'done' : ''} ${index === step ? 'current' : ''}`} key={task.title}>
        <span>{index < step ? '✓' : index + 1}</span><div><h3>{task.title}</h3><p>{index <= step ? task.detail : '等待处理'}</p></div>
      </div>)}</div>
    </section>
    <button className="detail-action" disabled={!complete} onClick={() => navigate('/order-success', { state: { order } })}>{complete ? '查看订单详情' : '订单任务加载中…'}</button>
  </main>
}
