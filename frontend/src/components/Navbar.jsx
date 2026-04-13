import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          <div className="bg-emerald-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
            J
          </div>
          <span className="text-xl font-bold text-white">
            Job<span className="text-emerald-400">board</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/jobs" className="text-slate-400 hover:text-emerald-400 transition text-sm font-medium">
            Browse Jobs
          </Link>

          {!user && (
            <>
              <Link to="/login" className="text-slate-400 hover:text-emerald-400 transition text-sm font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition text-sm font-medium">
                Get Started
              </Link>
            </>
          )}

          {user?.role === 'employer' && (
            <>
              <Link to="/employer/dashboard" className="text-slate-400 hover:text-emerald-400 transition text-sm font-medium">
                Dashboard
              </Link>
              <Link to="/employer/post-job" className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition text-sm font-medium">
                Post a Job
              </Link>
            </>
          )}

          {user?.role === 'candidate' && (
            <>
              <Link to="/candidate/dashboard" className="text-slate-400 hover:text-emerald-400 transition text-sm font-medium">
                Dashboard
              </Link>
              <Link to="/candidate/applications" className="text-slate-400 hover:text-emerald-400 transition text-sm font-medium">
                My Applications
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium border border-slate-700">
                {user.username}
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-400 transition text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar