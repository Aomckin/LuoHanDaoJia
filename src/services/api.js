const API_BASE_URL = 'http://127.0.0.1:8100'

const request = async (path, options) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail || '请求失败，请确认后端服务已启动。')
  }
  return response.json()
}

export const getTechnicians = () => request('/technicians')

export const createOrder = (order) => request('/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(order),
})

export const getOrders = () => request('/orders')

export const updateOrderStatus = (id, status) => request(`/orders/${id}/status`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status }),
})
