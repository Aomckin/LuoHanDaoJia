const STORAGE_KEY = 'luohan_orders'

const readOrders = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const orders = saved ? JSON.parse(saved) : []
    return Array.isArray(orders) ? orders : []
  } catch {
    return []
  }
}

const saveOrders = (orders) => localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))

const toDateKey = (date = new Date()) => date.toISOString().slice(0, 10).replaceAll('-', '')

const createOrderId = (orders) => {
  const prefix = `LH${toDateKey()}`
  const todayCount = orders.filter((order) => order.id?.startsWith(prefix)).length + 1
  return `${prefix}${String(todayCount).padStart(4, '0')}`
}

export const orderStatusLabels = ['待接单', '已接单', '服务中', '已完成']

const orderService = {
  createOrder({ technician, service, appointment }) {
    const orders = readOrders()
    const order = {
      id: createOrderId(orders),
      technician: { id: technician.id, name: technician.name, avatar: technician.avatar || '' },
      service: { id: service.id, name: service.name, price: service.price, duration: service.duration },
      appointment: { date: appointment.date, time: appointment.time },
      status: 0,
      createdAt: new Date().toISOString(),
    }
    saveOrders([...orders, order])
    return order
  },

  getOrders() {
    return readOrders().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  getCurrentOrder() {
    return this.getOrders()[0] ?? null
  },

  getOrderById(id) {
    return readOrders().find((order) => order.id === id) ?? null
  },

  updateOrderStatus(id, status) {
    const nextStatus = Math.max(0, Math.min(3, status))
    const orders = readOrders().map((order) => order.id === id ? { ...order, status: nextStatus } : order)
    saveOrders(orders)
    return orders.find((order) => order.id === id) ?? null
  },
}

export default orderService
