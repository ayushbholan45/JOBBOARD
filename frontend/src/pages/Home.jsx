import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const JobCard = ({ job }) => (
  <Link
    to={`/jobs/${job.id}`}
    className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300 transition group"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="bg-slate-100 text-slate-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
        {job.title.charAt(0)}
      </div>
      <span className="bg-emerald-50 text-emerald-600 text-xs px-3 py-1 rounded-full font-medium">
        {job.category_name}
      </span>
    </div>
    <h3 className="font-semibold text-slate-800 text-lg mt-3 group-hover:text-emerald-600 transition">
      {job.title}
    </h3>
    <p className="text-slate-400 text-sm mt-2 mb-4 line-clamp-2">
      {job.description}
    </p>
    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
      <div className="flex items-center gap-1 text-slate-400 text-xs">
        <span>📍</span>
        <span>{job.location}</span>
      </div>
      <div className="text-emerald-600 text-xs font-medium">
        {job.salary ? `NPR ${job.salary}` : 'Negotiable'}
      </div>
    </div>
    <div className="mt-2 text-xs text-slate-400">
      By {job.employer_name}
    </div>
  </Link>
)

const Home = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/')
        setJobs(res.data.slice(0, 6))
      } catch {
        console.error('Failed to fetch jobs')
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  return (
    <div className="bg-white">

      {/* Hero */}
      <div className="bg-slate-900 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-emerald-500 bg-opacity-20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-emerald-500 border-opacity-30">
            Nepal's #1 Job Platform
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Find Your
            <span className="text-emerald-400"> Next Big </span>
            Opportunity
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Connect with top companies across Nepal. Whether you're a fresh graduate or a seasoned professional — your next career move starts here.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/jobs"
              className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-emerald-600 transition"
            >
              Browse All Jobs
            </Link>
            <Link
              to="/register"
              className="border border-slate-600 text-slate-300 px-8 py-3 rounded-xl font-medium hover:border-emerald-500 hover:text-emerald-400 transition"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400">100+</div>
            <div className="text-slate-400 text-sm mt-1">Jobs Posted</div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400">50+</div>
            <div className="text-slate-400 text-sm mt-1">Companies</div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400">500+</div>
            <div className="text-slate-400 text-sm mt-1">Candidates</div>
          </div>
        </div>
      </div>

      {/* Latest Jobs */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Latest Jobs</h2>
            <p className="text-slate-400 text-sm mt-1">Fresh opportunities added daily</p>
          </div>
          <Link to="/jobs" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-100 rounded-2xl p-6 animate-pulse h-48" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No jobs posted yet — be the first to post one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-slate-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">How It Works</h2>
          <p className="text-slate-400 text-sm mb-12">Get started in 3 simple steps</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up as a candidate or employer in seconds' },
              { step: '02', title: 'Browse or Post', desc: 'Find jobs that match your skills or post your opening' },
              { step: '03', title: 'Get Hired', desc: 'Apply with one click and track your application status' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="text-emerald-500 font-bold text-sm mb-3">{item.step}</div>
                <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to take the next step?
        </h2>
        <p className="text-slate-400 mb-8">
          Join thousands of candidates and employers already using Jobboard
        </p>
        <Link
          to="/register"
          className="bg-emerald-500 text-white px-10 py-4 rounded-xl font-medium hover:bg-emerald-600 transition text-lg"
        >
          Get Started Free
        </Link>
      </div>

    </div>
  )
}

export default Home