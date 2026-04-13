import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import JobList from './pages/JobList'
import JobDetail from './pages/JobDetail'

import EmployerDashboard from './pages/employer/Dashboard'
import PostJob from './pages/employer/PostJob'
import Applicants from './pages/employer/Applicants'

import CandidateDashboard from './pages/candidate/Dashboard'
import MyApplications from './pages/candidate/MyApplications'

import EditJob from './pages/employer/EditJob'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobList />} />
              <Route path="/jobs/:id" element={<JobDetail />} />

              <Route path="/employer/dashboard" element={
                <ProtectedRoute role="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/employer/post-job" element={
                <ProtectedRoute role="employer">
                  <PostJob />
                </ProtectedRoute>
              } />
              <Route path="/employer/applicants/:jobId" element={
                <ProtectedRoute role="employer">
                  <Applicants />
                </ProtectedRoute>
              } />

              <Route path="/candidate/dashboard" element={
                <ProtectedRoute role="candidate">
                  <CandidateDashboard />
                </ProtectedRoute>
              } />
              <Route path="/candidate/applications" element={
                <ProtectedRoute role="candidate">
                  <MyApplications />
                </ProtectedRoute>
              } />
              <Route path="/employer/edit-job/:id" element={
                <ProtectedRoute role="employer">
                  <EditJob />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App