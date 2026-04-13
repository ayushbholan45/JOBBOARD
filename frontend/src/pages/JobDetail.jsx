import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Apply form state
  const [coverLetter, setCoverLetter] = useState('')
  const [resume, setResume] = useState(null)
  const [applying, setApplying] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [applySuccess, setApplySuccess] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}/`)
        setJob(res.data)
      } catch {
        setError('Failed to load job details.')
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    setApplyError('')
    setApplying(true)

    try {
      const formData = new FormData()
      formData.append('cover_letter', coverLetter)
      if (resume) formData.append('resume', resume)

      await api.post(`/applications/apply/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setApplySuccess(true)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to apply. Please try again.'
      setApplyError(msg)
    } finally {
      setApplying(false)
    }
  }

  const formatJobType = (type) => {
    const map = {
      full_time: 'Full Time',
      part_time: 'Part Time',
      contract: 'Contract',
      internship: 'Internship',
      freelance: 'Freelance',
    }
    return map[type] || type
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-slate-400 text-lg">Loading job...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  )

  if (!job) return null

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <Link
          to="/jobs"
          className="text-slate-400 hover:text-emerald-400 text-sm mb-6 inline-block transition"
        >
          ← Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Job Header */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                  <p className="text-emerald-400 mt-1 font-medium">{job.employer_name}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${job.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
                  {job.is_active ? 'Active' : 'Closed'}
                </span>
              </div>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full">
                  📍 {job.location}
                </span>
                <span className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full">
                  💼 {formatJobType(job.job_type)}
                </span>
                {job.category_name && (
                  <span className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full">
                    🏷️ {job.category_name}
                  </span>
                )}
                {job.salary && (
                  <span className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full">
                    💰 {job.salary}
                  </span>
                )}
                <span className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full">
                  🗓️ Posted {new Date(job.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Job Description</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

          </div>

          {/* Right — Apply Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sticky top-6">

              {/* Not logged in */}
              {!user && (
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-4">
                    You need to be logged in to apply.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Login to Apply
                  </button>
                </div>
              )}

              {/* Employer view */}
              {user?.role === 'employer' && (
                <div className="text-center">
                  <p className="text-slate-400 text-sm">
                    You are viewing this as an employer.
                  </p>
                </div>
              )}

              {/* Candidate — success */}
              {user?.role === 'candidate' && applySuccess && (
                <div className="text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="text-emerald-400 font-semibold text-lg">Application Sent!</p>
                  <p className="text-slate-400 text-sm mt-2">
                    Good luck! You can track your application in your dashboard.
                  </p>
                  <Link
                    to="/candidate/applications"
                    className="mt-4 inline-block text-emerald-400 hover:text-emerald-300 text-sm underline"
                  >
                    View my applications →
                  </Link>
                </div>
              )}

              {/* Candidate — apply form */}
              {user?.role === 'candidate' && !applySuccess && (
                <>
                  <h2 className="text-lg font-semibold text-white mb-4">Apply for this Job</h2>

                  {applyError && (
                    <p className="text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg text-sm mb-4">
                      {applyError}
                    </p>
                  )}

                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">
                        Cover Letter
                      </label>
                      <textarea
                        value={coverLetter}
                        onChange={e => setCoverLetter(e.target.value)}
                        rows={5}
                        placeholder="Tell the employer why you're a great fit..."
                        className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 resize-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-1">
                        Resume (PDF)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={e => setResume(e.target.files[0])}
                        className="w-full text-sm text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:text-white file:cursor-pointer hover:file:bg-emerald-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={applying || !job.is_active}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
                    >
                      {applying ? 'Submitting...' : job.is_active ? 'Submit Application' : 'Job Closed'}
                    </button>
                  </form>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}