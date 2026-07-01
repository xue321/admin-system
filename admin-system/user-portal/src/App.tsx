import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Login from './pages/Login'
import PortalLayout from './components/Layout/PortalLayout'
import Dashboard from './pages/Dashboard'
import Category from './pages/Category'
import QuestionList from './pages/Question'
import QuestionEdit from './pages/Question/Edit'
import TagManagement from './pages/Tag'
import ReviewPage from './pages/Review'
import MindMapPage from './pages/MindMap'
import MindMapEditor from './pages/MindMap/Editor'
import { useAuthStore } from './store/auth'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token)
  return token ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#7C3AED',
          colorSuccess: '#059669',
          colorWarning: '#D97706',
          colorError: '#DC2626',
          colorInfo: '#3B82F6',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        components: {
          Menu: {
            itemBorderRadius: 8,
            itemMarginInline: 8,
            itemHeight: 44,
          },
          Button: {
            borderRadius: 8,
          },
          Input: {
            borderRadius: 8,
          },
          Select: {
            borderRadius: 8,
          },
          Card: {
            borderRadius: 12,
          },
          Modal: {
            borderRadius: 16,
          },
          Table: {
            borderRadius: 8,
          },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PortalLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<Category />} />
            <Route path="questions" element={<QuestionList />} />
            <Route path="questions/new" element={<QuestionEdit />} />
            <Route path="questions/edit/:id" element={<QuestionEdit />} />
            <Route path="tags" element={<TagManagement />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="mindmap" element={<MindMapPage />} />
            <Route path="mindmap/edit/:id" element={<MindMapEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
