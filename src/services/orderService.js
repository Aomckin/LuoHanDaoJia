import { createOrder, getOrders, updateOrderStatus } from './api'

export const orderStatusLabels = ['待接单', '已接单', '服务中', '已完成']

const normalizeOrder = (order) => ({
  id: String(order.id),
  technician: { id: order.technician_id, name: order.technician_name, avatar: '' },
  service: { name: order.service_name, price: order.price, duration: '' },
  appointment: { date: order.date, time: order.time },
  status: order.status,
  createdAt: order.created_at,
})

const orderService = {
  async createOrder({ technician, service, appointment }) {
    const order = await createOrder({
      technician_id: technician.id,
      service_name: service.name,
      price: service.price,
      date: appointment.date,
      time: appointment.time,
    })
    return normalizeOrder(order)
  },

  async getOrders() {
    return (await getOrders()).map(normalizeOrder)
  },

  async getCurrentOrder() {
    return (await this.getOrders())[0] ?? null
  },

  async getOrderById(id) {
    return (await this.getOrders()).find((order) => order.id === String(id)) ?? null
  },

  async updateOrderStatus(id, status) {
    return normalizeOrder(await updateOrderStatus(id, status))
  },
}

export default orderService
