import React from 'react'

const statuses = ['待接单', '已接单', '服务中', '已完成']

export default function OrderStatus({ status }) {
  return <div className="status-track" aria-label={`订单状态：${statuses[status]}`}>
    {statuses.map((item, index) => <div className={`status-step ${index <= status ? 'active' : ''}`} key={item}>
      <span>{index < status ? '✓' : index + 1}</span><small>{item}</small>
    </div>)}
  </div>
}
