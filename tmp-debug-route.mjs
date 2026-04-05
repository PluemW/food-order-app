import { PATCH } from './app/api/orders/log/route.ts'

const req = {
  json: async () => ({ action: 'clear', amount: 120 }),
}

const res = await PATCH(req)
const body = await res.json()
console.log({ status: res.status, body })
