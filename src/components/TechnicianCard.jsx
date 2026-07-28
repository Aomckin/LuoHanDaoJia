import React from 'react'
import { Link } from 'react-router-dom'

export default function TechnicianCard({ technician }) {
  return (
    <article className="technician-card">
      <div className={`avatar avatar-${technician.color}`} aria-hidden="true">{technician.avatar}</div>
      <div className="technician-info">
        <div className="name-row"><h3>{technician.name}</h3><span className="rating">★ {technician.rating}</span></div>
        <p className="technician-title">{technician.title}</p>
        <div className="meta"><span>◉ {technician.distance}km</span><span>已服务 {technician.completed} 人</span></div>
        <p className="price">¥<b>{technician.price}</b><small> 起</small></p>
      </div>
      <Link className="book-link" to={`/technician/${technician.id}`}>查看服务</Link>
    </article>
  )
}
