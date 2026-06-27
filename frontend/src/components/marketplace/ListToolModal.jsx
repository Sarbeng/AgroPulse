import { useState } from 'react'
import Modal from '../common/Modal'

export default function ListToolModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState('Good')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit({
      name,
      pricePerDay: Number(price),
      condition,
      owner: 'You',
    })
    setName('')
    setPrice('')
    setCondition('Good')
    setSubmitting(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="List a Tool for Rent">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-gray-600 mb-1 block">Tool Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Power Tiller"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600 mb-1 block">
            Price (₵ / Day)
          </span>
          <input
            type="number"
            required
            min={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="150"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600 mb-1 block">Condition</span>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option>Excellent</option>
            <option>Good</option>
            <option>Fair</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-forest-700 text-white font-semibold hover:bg-forest-800 disabled:opacity-50"
        >
          {submitting ? 'Listing...' : 'List Tool'}
        </button>
      </form>
    </Modal>
  )
}
