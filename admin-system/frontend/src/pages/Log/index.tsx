import { useEffect, useState } from 'react'
import { Table, Input, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getLogs } from '../../api/user'

interface LogRecord {
  id: number
  username: string
  operation: string
  method: string
  ip: string
  duration: number
  createTime: string
}

export default function LogPage() {
  const [data, setData] = useState<LogRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res: any = await getLogs({ page, size: 10, username: search || undefined })
      setData(res.data.records)
      setTotal(res.data.total)
    } catch { /* empty */ } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [page])

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '操作用户', dataIndex: 'username' },
    { title: '操作方法', dataIndex: 'operation', ellipsis: true },
    { title: '请求方式', dataIndex: 'method', width: 80 },
    { title: 'IP', dataIndex: 'ip' },
    { title: '耗时(ms)', dataIndex: 'duration', width: 90 },
    { title: '操作时间', dataIndex: 'createTime' },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="搜索用户名" value={search} onChange={(e) => setSearch(e.target.value)} prefix={<SearchOutlined />} />
        <button onClick={() => { setPage(1); fetchData() }}>搜索</button>
      </Space>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={{ current: page, total, pageSize: 10, onChange: setPage }} />
    </div>
  )
}
