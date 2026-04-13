import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/mine/')
      setJobs(res.data)
    } catch (err) {
      setError('Failed to load your jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm('Are you sure you want to delete this job?')
    if (!confirmed) return

    try {
      await api.delete(`/jobs/${jobId}/`)
      setJobs(jobs.filter(job => job.id !== jobId))
    } catch (err) {
      alert('Failed to delete job. Please try again.')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-slate-400 text-lg">Loading your jobs...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Employer Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your job listings</p>
          </div>
          <Link
            to="/employer/post-job"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-lg transition"
          >
            + Post New Job
          </Link>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 bg-red-500 bg-opacity/10 px-4 py-3 rounded-lg mb-6">
            {error}
          </p>
        )}

        {/* Empty State */}
        {jobs.length === 0 && !error && (
          <div className="text-center py-20 border border-dashed border-slate-700 rounded-xl">
            <p className="text-slate-400 text-lg">You haven't posted any jobs yet.</p>
            <Link
              to="/employer/post-job"
              className="mt-4 inline-block text-emerald-400 hover:text-emerald-300 underline"
            >
              Post your first job →
            </Link>
          </div>
        )}

        {/* Job Cards */}
        <div className="space-y-4">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              {/* Job Info */}
              <div>
                <h2 className="text-xl font-semibold text-white">{job.title}</h2>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
                  <span>📍 {job.location}</span>
                  <span>💼 {job.job_type}</span>
                  <span className={`font-medium ${job.is_active ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {job.is_active ? '● Active' : '● Inactive'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  to={`/employer/applicants/${job.id}`}
                  className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Applicants
                </Link>
                <Link
                  to={`/employer/edit-job/${job.id}`}
                  className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}