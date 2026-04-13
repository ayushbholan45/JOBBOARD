import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const JobCard = ({ job }) => (
  <Link
    to={`/jobs/${job.id}`}
    className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-400 transition group"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="bg-slate-100 text-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
        {job.title.charAt(0)}
      </div>
      <span className="bg-slate-50 text-emerald-500 text-xs px-3 py-1 rounded-full font-medium">
        {job.category_name}
      </span>
    </div>
    <h3 className="font-semibold text-gray-800 text-lg mt-3 group-hover:text-emerald-500 transition">
      {job.title}
    </h3>
    <p className="text-gray-400 text-sm mt-2 mb-4 line-clamp-2">
      {job.description}
    </p>
    <div className="border-t border-slate-50 pt-3 flex items-center justify-between">
      <div className="flex items-center gap-1 text-gray-400 text-xs">
        <span>📍</span>
        <span>{job.location}</span>
      </div>
      <div className="text-emerald-500 text-xs font-medium">
        {job.salary ? `NPR ${job.salary}` : 'Negotiable'}
      </div>
    </div>
    <div className="mt-2 text-xs text-gray-400">
      By {job.employer_name}
    </div>
  </Link>
)

const JobList = () => {
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchJobs()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/jobs/categories/')
      setCategories(res.data)
    } catch {
      console.error('Failed to fetch categories')
    }
  }

  const fetchJobs = async (params = {}) => {
    setLoading(true)
    try {
      const res = await api.get('/jobs/', { params })
      setJobs(res.data)
    } catch {
      console.error('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs({
      search: search || undefined,
      category: selectedCategory || undefined,
      location: location || undefined,
    })
  }

  const handleClear = () => {
    setSearch('')
    setSelectedCategory('')
    setLocation('')
    fetchJobs()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Browse Jobs
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Find the perfect opportunity for you
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col md:flex-row gap-3 shadow-sm shadow-slate-100">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job title..."
              className="flex-1 px-4 py-2 text-sm focus:outline-none rounded-xl"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location..."
              className="flex-1 px-4 py-2 text-sm focus:outline-none rounded-xl"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-4 py-2 text-sm focus:outline-none rounded-xl text-gray-500 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-emerald-500 text-white px-6 py-2 rounded-xl hover:bg-emerald-600 transition text-sm font-medium"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-gray-800 font-medium">
              {jobs.length} jobs found
            </span>
            {(search || selectedCategory || location) && (
              <button
                onClick={handleClear}
                className="ml-3 text-emerald-500 text-sm hover:text-emerald-600 transition"
              >
                Clear filters ×
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="hidden md:flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setSelectedCategory('')
                fetchJobs({ search: search || undefined })
              }}
              className={`text-xs px-3 py-1 rounded-full transition ${
                !selectedCategory
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-50 text-emerald-500 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  fetchJobs({
                    search: search || undefined,
                    category: cat.id,
                  })
                }}
                className={`text-xs px-3 py-1 rounded-full transition ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-50 text-emerald-500 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Job grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 animate-pulse h-48 border border-slate-50"
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-gray-600 font-medium mb-2">No jobs found</h3>
            <p className="text-gray-400 text-sm">
              Try different search terms or clear your filters
            </p>
            <button
              onClick={handleClear}
              className="mt-6 bg-emerald-500 text-white px-6 py-2 rounded-xl hover:bg-emerald-600 transition text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobList