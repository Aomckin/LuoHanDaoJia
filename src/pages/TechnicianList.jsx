import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TechnicianCard from '../components/TechnicianCard'
import TechnicianMap from '../components/TechnicianMap'
import { technicians } from '../data/technicians'
import { getTechnicians } from '../services/api'

export default function TechnicianList() {
  const [query, setQuery] = useState('')
  const [loadedTechnicians, setLoadedTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getTechnicians()
      .then((apiTechnicians) => {
        if (!active) return
        setLoadedTechnicians(apiTechnicians.map((item) => ({
          ...technicians.find((local) => local.id === item.id),
          ...item,
        })))
      })
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const visibleTechnicians = useMemo(() => loadedTechnicians
    .filter((item) => `${item.name}${item.title}${item.tags.join('')}`.includes(query.trim()))
    .sort((a, b) => a.distance - b.distance), [loadedTechnicians, query])

  return <main>
    <section className="hero">
      <div className="location">⌖ 长沙市 · 岳麓区</div>
      <Link className="brand" to="/orders">我的订单</Link>
      <p>专业上门按摩 · 让放松刚好到家</p>
      <h1>把疲惫，留在今天</h1>
      <label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索技师或服务关键词" /><i>搜索</i></label>
    </section>
    <section className="content-panel">
      {loading ? <div className="inline-state">正在加载附近技师…</div> : null}
      {error ? <div className="inline-state error-state">{error}</div> : null}
      {!loading && !error ? <TechnicianMap technicians={loadedTechnicians} /> : null}
      <div className="section-heading"><div><span>附近优选</span><h2>为你推荐的技师</h2></div><small>按距离排序</small></div>
      <div className="filter-row"><button className="filter active">全部技师</button><button className="filter">肩颈放松</button><button className="filter">中式推拿</button></div>
      <div className="technician-list">
        {!loading && !error && (visibleTechnicians.length ? visibleTechnicians.map((item) => <TechnicianCard technician={item} key={item.id} />) : <div className="empty">没有找到匹配的技师，换个关键词试试。</div>)}
      </div>
    </section>
  </main>
}
