import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                J
              </div>
              <span className="text-xl font-bold text-white">
                Job<span className="text-emerald-400">board</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Nepal's trusted job platform connecting talented candidates with great companies.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">For Candidates</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/jobs" className="hover:text-emerald-400 transition">Browse Jobs</Link>
              <Link to="/register" className="hover:text-emerald-400 transition">Create Account</Link>
              <Link to="/candidate/applications" className="hover:text-emerald-400 transition">My Applications</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">For Employers</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/employer/post-job" className="hover:text-emerald-400 transition">Post a Job</Link>
              <Link to="/employer/dashboard" className="hover:text-emerald-400 transition">Dashboard</Link>
              <Link to="/register" className="hover:text-emerald-400 transition">Get Started</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex items-center justify-between text-xs">
          <span>© 2026 Jobboard. All rights reserved.</span>
          <span className="text-emerald-400"></span>
        </div>
      </div>
    </footer>
  )
}

export default Footer