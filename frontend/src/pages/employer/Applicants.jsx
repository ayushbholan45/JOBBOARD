import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../api/axios'

const STATUS_STYLES = {
  pending:  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  reviewed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
}

export default function Applicants() {
  const { jobId } = useParams()
  const [applicants, setApplicants] = useState([])
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicantsRes, jobRes] = await Promise.all([
          api.get(`/applications/job/${jobId}/applicants/`),
          api.get(`/jobs/${jobId}/`)
        ])
        setApplicants(applicantsRes.data)
        setJobTitle(jobRes.data.title)
      } catch {
        setError('Failed to load applicants.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [jobId])

  const handleStatus = async (applicationId, newStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/status/`, { status: newStatus })
      setApplicants(prev =>
        prev.map(app => app.id === applicationId ? { ...app, status: newStatus } : app)
      )
    } catch {
      alert('Failed to update status. Please try again.')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-slate-400 text-lg">Loading applicants...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link to="/employer/dashboard" className="text-slate-400 hover:text-emerald-400 text-sm mb-3 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Applicants</h1>
          {jobTitle && <p className="text-slate-400 mt-1">For: <span className="text-emerald-400">{jobTitle}</span></p>}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg mb-6">{error}</p>
        )}

        {/* Empty State */}
        {applicants.length === 0 && !error && (
          <div className="text-center py-20 border border-dashed border-slate-700 rounded-xl">
            <p className="text-slate-400 text-lg">No one has applied to this job yet.</p>
          </div>
        )}

        {/* Applicant Cards */}
        <div className="space-y-4">
          {applicants.map(app => (
            <div key={app.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Applicant Info */}
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {app.candidate_name || app.candidate_username || 'Applicant'}
                  </h2>
                  <p className="text-slate-400 text-sm mt-0.5">{app.candidate_email}</p>
                  <span className={`inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[app.status] || ''}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
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
                  <button
                    onClick={() => handleStatus(app.id, 'accepted')}
                    disabled={app.status === 'accepted'}
                    className="text-sm bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatus(app.id, 'rejected')}
                    disabled={app.status === 'rejected'}
                    className="text-sm bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg transition"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Cover Letter */}
              {app.cover_letter && (
                <div className="mt-4 border-t border-slate-700 pt-4">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">Cover Letter</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{app.cover_letter}</p>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}