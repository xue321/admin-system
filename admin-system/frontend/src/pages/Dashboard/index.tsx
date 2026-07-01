import { Card, Col, Row, Statistic } from 'antd'
import { UserOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons'

export default function Dashboard() {
  return (
    <div>
      <h2>仪表盘</h2>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="用户总数" value={1} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="角色总数" value={2} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="今日操作" value={0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
