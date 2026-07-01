import { Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Login from './pages/Login'
import AdminLayout from './components/Layout/AdminLayout'
import Dashboard from './pages/Dashboard'
import UserPage from './pages/User'
import RolePage from './pages/Role'
import LogPage from './pages/Log'
import { useAuthStore } from './store/auth'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="system/user" element={<UserPage />} />
          <Route path="system/role" element={<RolePage />} />
          <Route path="system/log" element={<LogPage />} />
        </Route>
      </Routes>
    </ConfigProvider>
  )
}
