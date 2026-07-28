import React from 'react'

export default function ServiceCard({ service, selected, onSelect }) {
  return (
    <button type="button" className={`service-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(service)}>
      <span className="service-icon">✦</span>
      <span className="service-content"><b>{service.name}</b><small>{service.description}</small><em>{service.duration}</em></span>
      <span className="service-price">¥{service.price}</span>
      <span className="choose-mark">{selected ? '✓' : '+'}</span>
    </button>
  )
}
