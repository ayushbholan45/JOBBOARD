import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const STATUS_STYLES = {
  pending:  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  reviewed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
}

export default function CandidateDashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/mine/')
        setApplications(res.data)
      } catch {
        setError('Failed to load your applications.')
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-slate-400 text-lg">Loading your dashboard...</p>
    </div>
  )

  // Calculate stats
  const total = applications.length
  const pending = applications.filter(a => a.status === 'pending').length
  const accepted = applications.filter(a => a.status === 'accepted').length
  const rejected = applications.filter(a => a.status === 'rejected').length

  const recent = applications.slice(0, 5)

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Candidate Dashboard</h1>
          <p className="text-slate-400 mt-1">Track your job applications</p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg mb-6">
            {error}
          </p>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Applied', value: total, color: 'text-white' },
            { label: 'Pending', value: pending, color: 'text-yellow-400' },
            { label: 'Accepted', value: accepted, color: 'text-emerald-400' },
            { label: 'Rejected', value: rejected, color: 'text-red-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Applications</h2>
          <Link
            to="/candidate/applications"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition"
          >
            View all →
          </Link>
        </div>

        {applications.length === 0 && !error && (
          <div className="text-center py-20 border border-dashed border-slate-700 rounded-xl">
            <p className="text-slate-400 text-lg">You haven't applied to any jobs yet.</p>
            <Link
              to="/jobs"
              className="mt-4 inline-block text-emerald-400 hover:text-emerald-300 underline"
            >
              Browse jobs →
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {recent.map(app => (
            <div
              key={app.id}
              className="bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-medium">{app.job_title}</p>
                <p className="text-slate-400 text-sm mt-0.5">
                  Applied on {new Date(app.applied_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[app.status]}`}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}