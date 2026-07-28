import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TechnicianList from './pages/TechnicianList'
import TechnicianDetail from './pages/TechnicianDetail'
import Booking from './pages/Booking'
import OrderDetail from './pages/OrderDetail'
import OrderStatusPage from './pages/OrderStatusPage'
import OrderList from './pages/OrderList'

export default function App() { return <div className="app-shell"><Routes><Route path="/" element={<TechnicianList />} /><Route path="/technician/:id" element={<TechnicianDetail />} /><Route path="/booking" element={<Booking />} /><Route path="/order-status/:id" element={<OrderStatusPage />} /><Route path="/order/:id" element={<OrderDetail />} /><Route path="/orders" element={<OrderList />} /></Routes></div> }
