import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Home from './components/Home/Home'
import Register from './components/Register/Register'
import Signin from './components/Signin/Signin'
import Dashboard from './components/Dashboard/Dashboard'
import SidebarLayout from './components/SidebarLayout/SidebarLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <>Users Protected Route</>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="explore" element={<>Songs Explore Route</>} />
          <Route path="profile" element={<>Profile Route</>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
