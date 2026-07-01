import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportQuestionsToPDF(questions: any[]) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = 210
  const margin = 15
  const contentWidth = pageWidth - margin * 2

  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.top = '0'
  container.style.width = `${contentWidth * 3.78}px`
  container.style.fontFamily = "'Inter', sans-serif"
  container.style.fontSize = '14px'
  container.style.lineHeight = '1.8'
  container.style.color = '#1E1B4B'
  document.body.appendChild(container)

  let currentY = margin

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const el = document.createElement('div')
    el.style.padding = '16px'
    el.style.marginBottom = '12px'
    el.innerHTML = `
      <h2 style="font-size:18px;font-weight:700;margin-bottom:12px;color:#1E1B4B;">
        ${i + 1}. ${q.title}
      </h2>
      ${q.content ? `<div style="margin-bottom:12px;"><strong>题目内容：</strong><div style="margin-top:4px;">${q.content}</div></div>` : ''}
      ${q.myAnswer ? `<div style="margin-bottom:12px;padding:10px;background:#FEF2F2;border-radius:8px;border:1px solid #FECACA;"><strong style="color:#DC2626;">我的错误答案：</strong><div style="margin-top:4px;">${q.myAnswer}</div></div>` : ''}
      ${q.correctAnswer ? `<div style="margin-bottom:12px;padding:10px;background:#F0FDF4;border-radius:8px;border:1px solid #BBF7D0;"><strong style="color:#059669;">正确答案：</strong><div style="margin-top:4px;">${q.correctAnswer}</div></div>` : ''}
      ${q.note ? `<div style="margin-bottom:12px;padding:10px;background:#F5F3FF;border-radius:8px;border:1px solid #E5E1F5;"><strong style="color:#7C3AED;">笔记：</strong><div style="margin-top:4px;">${q.note}</div></div>` : ''}
      <hr style="border:none;border-top:1px solid #E5E1F5;margin-top:16px;"/>
    `
    container.innerHTML = ''
    container.appendChild(el)

    const canvas = await html2canvas(container, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL('image/png')
    const imgHeight = (canvas.height * contentWidth) / canvas.width

    if (currentY + imgHeight > 297 - margin) {
      pdf.addPage()
      currentY = margin
    }

    pdf.addImage(imgData, 'PNG', margin, currentY, contentWidth, imgHeight)
    currentY += imgHeight + 5
  }

  document.body.removeChild(container)
  pdf.save('错题导出.pdf')
}
