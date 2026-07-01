import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useAuthStore } from '../../store/auth'
import './styles.css'

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'],
    ],
    handlers: {
      image: function (this: any) {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()
        input.onchange = async () => {
          const file = input.files?.[0]
          if (!file) return
          const formData = new FormData()
          formData.append('file', file)
          const token = useAuthStore.getState().token
          try {
            const res = await fetch('/api/portal/upload/image', {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            })
            const data = await res.json()
            if (data.code === 200) {
              const quill = this.quill
              const range = quill.getSelection(true)
              quill.insertEmbed(range.index, 'image', data.data.url)
              quill.setSelection(range.index + 1)
            }
          } catch (e) {
            console.error('Image upload failed', e)
          }
        }
      },
    },
  },
}

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet', 'blockquote', 'code-block',
  'link', 'image',
]

interface Props {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  minHeight?: number
}

function RichTextEditor({ value, onChange, placeholder, minHeight = 150 }: Props) {
  return (
    <div className="rich-editor-wrapper" style={{ '--editor-min-height': `${minHeight}px` } as React.CSSProperties}>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={(content) => onChange?.(content === '<p><br></p>' ? '' : content)}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  )
}

export default RichTextEditor
