import { useEffect, useRef, useState, useCallback } from 'react'
import { Button, Space, Input, message, Tooltip } from 'antd'
import {
  ArrowLeftOutlined, SaveOutlined,
  PlusOutlined, DeleteOutlined,
  ZoomInOutlined, ZoomOutOutlined, AimOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { getMindMap, updateMindMap } from '../../api/mindmap'

function MindMapEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const mindMapRef = useRef<any>(null)
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (id) loadAndInit()
    return () => {
      if (mindMapRef.current) {
        mindMapRef.current.destroy()
        mindMapRef.current = null
      }
    }
  }, [id])

  const loadAndInit = async () => {
    try {
      const res: any = await getMindMap(Number(id))
      setTitle(res.data.title)
      const raw = res.data.data ? JSON.parse(res.data.data) : null
      const mapData = raw?.root ? raw.root : (raw || {
        data: { text: '中心主题', expand: true },
        children: [],
      })
      await initMindMap(mapData)
      setLoaded(true)
    } catch (e) {
      message.error('加载失败')
    }
  }

  const initMindMap = async (data: any) => {
    if (!containerRef.current) return
    const MindMap = (await import('simple-mind-map')).default
    if (mindMapRef.current) {
      mindMapRef.current.destroy()
    }
    const mindMap = new MindMap({
      el: containerRef.current,
      data,
    } as any)
    mindMapRef.current = mindMap
  }

  const handleSave = useCallback(async () => {
    if (!mindMapRef.current || !id) return
    setSaving(true)
    try {
      const nodeData = mindMapRef.current.getData()
      await updateMindMap(Number(id), {
        title,
        data: JSON.stringify(nodeData),
      })
      message.success('保存成功')
    } catch (e) {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }, [id, title])

  const handleAddChild = () => {
    if (!mindMapRef.current) return
    mindMapRef.current.execCommand('INSERT_CHILD_NODE')
  }

  const handleAddSibling = () => {
    if (!mindMapRef.current) return
    mindMapRef.current.execCommand('INSERT_NODE')
  }

  const handleDeleteNode = () => {
    if (!mindMapRef.current) return
    mindMapRef.current.execCommand('REMOVE_NODE')
  }

  const handleZoomIn = () => {
    if (!mindMapRef.current) return
    const scale = mindMapRef.current.view?.scale || 1
    mindMapRef.current.view?.setScale(scale + 0.1)
  }

  const handleZoomOut = () => {
    if (!mindMapRef.current) return
    const scale = mindMapRef.current.view?.scale || 1
    mindMapRef.current.view?.setScale(Math.max(0.3, scale - 0.1))
  }

  const handleFitView = () => {
    if (!mindMapRef.current) return
    mindMapRef.current.view?.reset()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 0', marginBottom: 12,
        borderBottom: '1px solid var(--color-border)',
      }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/mindmap')} style={{ borderRadius: 8 }}>
            返回
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: 260, borderRadius: 8, fontWeight: 600 }}
            placeholder="导图标题"
          />
        </Space>

        <Space>
          <Tooltip title="添加子节点 (Tab)">
            <Button icon={<PlusOutlined />} onClick={handleAddChild} style={{ borderRadius: 8 }}>
              子节点
            </Button>
          </Tooltip>
          <Tooltip title="添加同级节点 (Enter)">
            <Button onClick={handleAddSibling} style={{ borderRadius: 8 }}>
              同级节点
            </Button>
          </Tooltip>
          <Tooltip title="删除节点 (Delete)">
            <Button icon={<DeleteOutlined />} onClick={handleDeleteNode} danger style={{ borderRadius: 8 }} />
          </Tooltip>

          <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 4px' }} />

          <Tooltip title="放大">
            <Button icon={<ZoomInOutlined />} onClick={handleZoomIn} style={{ borderRadius: 8 }} />
          </Tooltip>
          <Tooltip title="缩小">
            <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut} style={{ borderRadius: 8 }} />
          </Tooltip>
          <Tooltip title="适应画布">
            <Button icon={<AimOutlined />} onClick={handleFitView} style={{ borderRadius: 8 }} />
          </Tooltip>

          <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 4px' }} />

          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
            style={{ borderRadius: 8 }}
          >
            保存
          </Button>
        </Space>
      </div>

      {/* Hint */}
      {loaded && (
        <div style={{
          fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8,
          padding: '6px 12px', background: 'var(--color-muted)', borderRadius: 8,
        }}>
          操作提示：双击节点编辑文字 | Tab 添加子节点 | Enter 添加同级节点 | Delete 删除 | 鼠标拖拽移动画布
        </div>
      )}

      {/* Canvas */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          borderRadius: 12,
          border: '1px solid var(--color-border)',
          background: '#fff',
          overflow: 'hidden',
        }}
      />
    </div>
  )
}

export default MindMapEditor
