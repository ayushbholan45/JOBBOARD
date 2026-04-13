import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const STATUS_STYLES = {
  pending:  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  reviewed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
}

export default function MyApplications() {
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
      <p className="text-slate-400 text-lg">Loading your applications...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/candidate/dashboard"
            className="text-slate-400 hover:text-emerald-400 text-sm mb-3 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">My Applications</h1>
          <p className="text-slate-400 mt-1">
            {applications.length} application{applications.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg mb-6">
            {error}
          </p>
        )}

        {/* Empty State */}
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

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map(app => (
            <div
              key={app.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                {/* Job Info */}
                <div>
                  <h2 className="text-lg font-semibold text-white">{app.job_title}</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Applied on {new Date(app.applied_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Status Badge */}
                <span className={`self-start text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[app.status]}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>

              </div>

              {/* Cover Letter */}
              {app.cover_letter && (
                <div className="mt-4 border-t border-slate-700 pt-4">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                    Your Cover Letter
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {app.cover_letter}
                  </p>
                </div>
              )}

              {/* Resume + View Job */}
              <div className="mt-4 flex gap-3">
                {app.resume && (
                  <a
                    href={`http://127.0.0.1:8000${app.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    View Resume
                  </a>
                )}
                <Link
                  to={`/jobs/${app.job}`}
                  className="text-sm border border-slate-600 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 px-4 py-2 rounded-lg transition"
                >
                  View Job
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}