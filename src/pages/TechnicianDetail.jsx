import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ServiceCard from '../components/ServiceCard'
import { technicians } from '../data/technicians'

export default function TechnicianDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const technician = technicians.find((item) => item.id === Number(id))
  const [service, setService] = useState(technician?.services[0])
  if (!technician) return <main className="not-found"><h1>未找到该技师</h1><Link to="/">返回首页</Link></main>
  const book = () => navigate('/booking', { state: { technician, service } })

  return <main className="detail-page">
    <div className="detail-hero"><Link className="back" to="/">‹</Link><div className={`avatar avatar-${technician.color} detail-avatar`}>{technician.avatar}</div><div className="detail-intro"><span>认证技师</span><h1>{technician.name}</h1><p>{technician.title} · ★ {technician.rating} · 距您 {technician.distance}km</p></div></div>
    <section className="detail-card about"><h2>关于 {technician.name}</h2><p>{technician.intro}</p><div>{technician.tags.map((tag) => <i key={tag}>{tag}</i>)}</div></section>
    <section className="detail-card"><div className="section-heading"><div><span>服务项目</span><h2>选一项，开始放松</h2></div><small>可按需选择</small></div><div className="service-list">{technician.services.map((item) => <ServiceCard key={item.id} service={item} selected={service?.id === item.id} onSelect={setService} />)}</div></section>
    <div className="sticky-action"><div><small>当前选择</small><b>{service?.name} · ¥{service?.price}</b></div><button onClick={book}>立即预约</button></div>
  </main>
}
