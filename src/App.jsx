import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TechnicianList from './pages/TechnicianList'
import TechnicianDetail from './pages/TechnicianDetail'
import Booking from './pages/Booking'
import OrderSuccess from './pages/OrderSuccess'
import OrderStatusPage from './pages/OrderStatusPage'

export default function App() { return <div className="app-shell"><Routes><Route path="/" element={<TechnicianList />} /><Route path="/technician/:id" element={<TechnicianDetail />} /><Route path="/booking" element={<Booking />} /><Route path="/order-status" element={<OrderStatusPage />} /><Route path="/order-success" element={<OrderSuccess />} /></Routes></div> }
