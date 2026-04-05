"use client"

import { useState } from "react"
import { menus } from "@/lib/data"

type OrderType = "dine-in" | "delivery"

export default function CheckoutModal({
  cart,
  total,
  onClose,
  onSubmit,
  submitting,
}: {
  cart: { menuId: number; qty: number; extraSize?: boolean }[]
  total: number
  onClose: () => void
  onSubmit: (payload: {
    customerName: string
    orderType: OrderType
    tableNumber?: string
    phone?: string
    notes?: string
  }) => Promise<void>
  submitting: boolean
}) {
  const [customerName, setCustomerName] = useState("")
  const [orderType, setOrderType] = useState<OrderType>("dine-in")
  const [tableNumber, setTableNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      setError("กรุณากรอกชื่อผู้รับออเดอร์")
      return
    }

    if (orderType === "dine-in") {
      if (tableNumber.trim() === "") {
        setError("กรุณาใส่เลขโต๊ะ (0 = รอรับ)")
        return
      }

      if (!/^[0-9]+$/.test(tableNumber.trim())) {
        setError("เลขโต๊ะต้องเป็นตัวเลขเท่านั้น")
        return
      }

      const tableNum = Number(tableNumber)
      if (tableNum < 0) {
        setError("เลขโต๊ะต้องเป็นจำนวนเต็มบวก หรือ 0")
        return
      }
    }

    if (orderType === "delivery" && phone.trim() === "") {
      setError("กรุณากรอกเบอร์โทรสำหรับจัดส่ง")
      return
    }

    setError("")
    await onSubmit({ customerName, orderType, tableNumber, phone, notes })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-orange-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-orange-700">ชำระเงิน</h3>
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            ปิด
          </button>
        </div>

        {error && <div className="mb-3 text-red-600">{error}</div>}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">ชื่อผู้สั่ง <span className="text-red-500">*</span></label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-orange-200"
              placeholder="เช่น สมชาย"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">ประเภทคำสั่งซื้อ</label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as OrderType)}
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-orange-200"
            >
              <option value="dine-in">นั่งทาน</option>
              <option value="delivery">จัดส่ง</option>
            </select>
          </div>

          {orderType === "dine-in" && (
            <div>
              <label className="block text-sm font-medium">เลขโต๊ะ (0 = รอรับ) <span className="text-red-500">*</span></label>
              <input
                type="number"
                min={0}
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-orange-200"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">💬 ใส่ 0 เมื่อสั่งรอรับ</p>
            </div>
          )}

          {orderType === "delivery" && (
            <div>
              <label className="block text-sm font-medium">Phone <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-orange-200"
                placeholder="0812345678"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">หมายเหตุ (Notes)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-orange-200"
              placeholder="เช่น ขอไม่ใส่ผัก"
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="font-semibold">รวม: ₿{total}</span>
            <button onClick={handleSubmit} disabled={submitting} className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50">
              {submitting ? "กำลังส่ง..." : "ยืนยันคำสั่งซื้อ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
