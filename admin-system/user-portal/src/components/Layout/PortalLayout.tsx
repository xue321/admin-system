import { Layout, Menu, Avatar, Dropdown } from 'antd'
import {
  DashboardOutlined,
  FolderOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
  BookOutlined,
  TagsOutlined,
  ScheduleOutlined,
  PartitionOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

const { Header, Sider, Content } = Layout

function PortalLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { nickname, logout } = useAuthStore()

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '概览' },
    { key: '/review', icon: <ScheduleOutlined />, label: '今日复习' },
    { key: '/categories', icon: <FolderOutlined />, label: '分类管理' },
    { key: '/questions', icon: <FileTextOutlined />, label: '我的错题' },
    { key: '/tags', icon: <TagsOutlined />, label: '标签管理' },
    { key: '/mindmap', icon: <PartitionOutlined />, label: '思维导图' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const dropdownItems = [
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <Sider
        theme="light"
        width={240}
        style={{
          background: '#fff',
          borderRight: '1px solid var(--color-border)',
          boxShadow: '1px 0 8px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 24px',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <BookOutlined style={{ fontSize: 18, color: '#fff' }} />
          </div>
          <span style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-foreground)',
            letterSpacing: -0.3,
          }}>
            错题本
          </span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            border: 'none',
            padding: '12px 8px',
            fontSize: 14,
          }}
        />
      </Sider>
      <Layout style={{ background: 'var(--color-background)' }}>
        <Header style={{
          background: '#fff',
          padding: '0 32px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: 64,
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 10,
              transition: 'var(--transition-fast)',
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-muted)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                }}
              />
              <span style={{ fontWeight: 500, color: 'var(--color-foreground)' }}>
                {nickname || '用户'}
              </span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{
          margin: 24,
          padding: 28,
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          minHeight: 'calc(100vh - 64px - 48px)',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default PortalLayout
