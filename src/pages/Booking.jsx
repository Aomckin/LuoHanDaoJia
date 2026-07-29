import React, { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { technicians } from '../data/technicians'
import orderService from '../services/orderService'

const times = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
const formatDate = (offset) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return {
    value: date.toISOString().slice(0, 10),
    label: offset === 0 ? '今天' : offset === 1 ? '明天' : '后天',
    weekday: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
  }
}

export default function Booking() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const fallback = technicians[0]
  const technician = state?.technician ?? fallback
  const service = state?.service ?? fallback.services[0]
  const dates = useMemo(() => [formatDate(1), formatDate(2), formatDate(3)], [])
  const [date, setDate] = useState(dates[0])
  const [time, setTime] = useState(times[2])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const order = await orderService.createOrder({ technician, service, appointment: { date: date.value, time } })
      navigate(`/order-status/${order.id}`)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="booking-page">
    <header className="simple-header"><Link to={`/technician/${technician.id}`}>‹</Link><h1>确认预约</h1><span /></header>
    <section className="booking-card provider"><div className={`avatar avatar-${technician.color}`}>{technician.avatar}</div><div><small>本次服务技师</small><h2>{technician.name}</h2><p>{service.name} · {service.duration}</p></div><b>¥{service.price}</b></section>
    <section className="booking-card"><h2>选择服务日期</h2><div className="date-options">{dates.map((item) => <button className={date.value === item.value ? 'picked' : ''} key={item.value} onClick={() => setDate(item)}><small>{item.label}</small><b>{item.value.slice(5)}</b><em>周{item.weekday}</em></button>)}</div></section>
    <section className="booking-card"><h2>选择服务时间</h2><div className="time-options">{times.map((item) => <button className={time === item ? 'picked' : ''} key={item} onClick={() => setTime(item)}>{item}</button>)}</div></section>
    <p className="booking-note">预约成功后，技师将在服务前与您确认具体上门地址。</p>
    {error ? <p className="request-error">{error}</p> : null}
    <div className="sticky-action booking-action"><div><small>合计</small><b>¥{service.price}</b></div><button disabled={submitting} onClick={submit}>{submitting ? '正在创建订单…' : '确认下单'}</button></div>
  </main>
}
