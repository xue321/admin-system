import { useEffect, useState } from 'react'
import { Select, Tag, Space } from 'antd'
import { getTags } from '../../api/tag'

interface Props {
  value?: number[]
  onChange?: (value: number[]) => void
}

function TagSelector({ value = [], onChange }: Props) {
  const [tags, setTags] = useState<any[]>([])

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      const res: any = await getTags()
      setTags(res.data || [])
    } catch (e) { /* ignore */ }
  }

  return (
    <Select
      mode="multiple"
      placeholder="选择标签"
      value={value}
      onChange={onChange}
      style={{ width: '100%' }}
      optionLabelProp="label"
    >
      {tags.map((tag) => (
        <Select.Option key={tag.id} value={tag.id} label={tag.name}>
          <Space>
            <span style={{
              width: 10, height: 10, borderRadius: 3,
              background: tag.color, display: 'inline-block',
            }} />
            {tag.name}
          </Space>
        </Select.Option>
      ))}
    </Select>
  )
}

export function TagDisplay({ tags }: { tags: any[] }) {
  if (!tags?.length) return null
  return (
    <Space size={4} wrap>
      {tags.map((tag) => (
        <Tag key={tag.id} color={tag.color} style={{ borderRadius: 6, fontSize: 11 }}>
          {tag.name}
        </Tag>
      ))}
    </Space>
  )
}

export default TagSelector
