import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

export default function EditJob() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    job_type: 'full_time',
    salary: '',
    category: '',
    is_active: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, catRes] = await Promise.all([
          api.get(`/jobs/${id}/`),
          api.get('/jobs/categories/')
        ])
        const job = jobRes.data
        setForm({
            title: job.title || '',
            description: job.description || '',
            location: job.location || '',
            job_type: job.job_type || 'full_time',
            salary: job.salary || '',
            category: job.category || '',
            is_active: job.is_active ?? true,
            })
        setCategories(catRes.data)
      } catch {
        setError('Failed to load job details.')
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.put(`/jobs/${id}/`, form)
      navigate('/employer/dashboard')
    } catch {
      setError('Failed to update job. Please check your inputs and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-slate-400 text-lg">Loading job details...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Job</h1>
          <p className="text-slate-400 mt-1">Update your job listing</p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg mb-6">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Job Title *</label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Description *</label>
            <textarea
              name="description"
              required
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Location *</label>
            <input
              type="text"
              name="location"
              required
              value={form.location}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Job Type + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Job Type *</label>
              <select
                name="job_type"
                value={form.job_type}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary */}
            <div>
            <label className="block text-sm text-slate-400 mb-1">Salary</label>
            <input
                type="text"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. $30,000 - $60,000 or Negotiable"
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
            />
            </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-4 h-4 accent-emerald-500"
            />
            <label htmlFor="is_active" className="text-slate-300 text-sm">
              Listing is active (visible to candidates)
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/employer/dashboard')}
              className="flex-1 border border-slate-600 hover:border-slate-500 text-slate-300 font-semibold py-3 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}