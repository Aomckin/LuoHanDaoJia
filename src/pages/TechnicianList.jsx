import React, { useMemo, useState } from 'react'
import TechnicianCard from '../components/TechnicianCard'
import { technicians } from '../data/technicians'

export default function TechnicianList() {
  const [query, setQuery] = useState('')
  const visibleTechnicians = useMemo(() => technicians
    .filter((item) => `${item.name}${item.title}${item.tags.join('')}`.includes(query.trim()))
    .sort((a, b) => a.distance - b.distance), [query])

  return <main>
    <section className="hero">
      <div className="location">⌖ 杭州市 · 西湖区</div>
      <div className="brand">罗汉到家</div>
      <p>专业上门按摩 · 让放松刚好到家</p>
      <h1>把疲惫，留在今天</h1>
      <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索技师或服务关键词" /><i>搜索</i></label>
    </section>
    <section className="content-panel">
      <div className="section-heading"><div><span>附近优选</span><h2>为你推荐的技师</h2></div><small>按距离排序</small></div>
      <div className="filter-row"><button className="filter active">全部技师</button><button className="filter">肩颈放松</button><button className="filter">中式推拿</button></div>
      <div className="technician-list">
        {visibleTechnicians.length ? visibleTechnicians.map((item) => <TechnicianCard technician={item} key={item.id} />) : <div className="empty">没有找到匹配的技师，换个关键词试试。</div>}
      </div>
    </section>
  </main>
}
