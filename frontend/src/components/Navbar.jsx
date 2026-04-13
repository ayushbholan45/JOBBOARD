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
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          Jobboard
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link
            to="/jobs"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Browse Jobs
          </Link>

          {/* Not logged in */}
          {!user && (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}

          {/* Employer links */}
          {user?.role === 'employer' && (
            <>
              <Link
                to="/employer/dashboard"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/employer/post-job"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Post Job
              </Link>
            </>
          )}

          {/* Candidate links */}
          {user?.role === 'candidate' && (
            <>
              <Link
                to="/candidate/dashboard"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/candidate/applications"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                My Applications
              </Link>
            </>
          )}

          {/* Logged in user */}
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Hi, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
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