import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'candidate',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.role
      )
      if (user.role === 'employer') {
        navigate('/employer/dashboard')
      } else {
        navigate('/candidate/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.username?.[0] || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">

          <div className="text-center mb-8">
            <div className="bg-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">J</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Create an account</h1>
            <p className="text-slate-400 text-sm mt-1">Join Jobboard today</p>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity/10 border border-red-500 border-opacity-30 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'candidate' })}
              className={`p-4 rounded-xl border-2 text-center transition ${
                formData.role === 'candidate'
                  ? 'border-emerald-500 bg-emerald-500 bg-opacity-10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="text-2xl mb-1">🔍</div>
              <div className="text-sm font-medium text-white">Candidate</div>
              <div className="text-xs text-slate-400 mt-1">Looking for a job</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'employer' })}
              className={`p-4 rounded-xl border-2 text-center transition ${
                formData.role === 'employer'
                  ? 'border-emerald-500 bg-emerald-500 bg-opacity-10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="text-2xl mb-1">💼</div>
              <div className="text-sm font-medium text-white">Employer</div>
              <div className="text-xs text-slate-400 mt-1">Hiring someone</div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder-slate-500"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder-slate-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder-slate-500"
                placeholder="Choose a strong password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : `Create ${formData.role === 'employer' ? 'Employer' : 'Candidate'} Account`}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-slate-500 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 font-medium hover:text-emerald-300 transition">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register