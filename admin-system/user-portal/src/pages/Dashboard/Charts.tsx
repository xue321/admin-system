import { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { Row, Col } from 'antd'
import { getChartData } from '../../api/question'
import { getCategoryTree } from '../../api/category'

function flattenTree(nodes: any[], result: any[] = []): any[] {
  nodes.forEach((n: any) => { result.push(n); if (n.children) flattenTree(n.children, result) })
  return result
}

function Charts() {
  const [data, setData] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [chartRes, catRes]: any[] = await Promise.all([
        getChartData(30),
        getCategoryTree(),
      ])
      setData(chartRes.data)
      setCategories(flattenTree(catRes.data || []))
    } catch (e) { /* ignore */ }
  }

  if (!data) return null

  const dailyReviews = data.dailyReviews || {}
  const categoryDist = data.categoryDistribution || {}
  const statusDist = data.statusDistribution || {}

  const reviewLineOption = {
    title: { text: '每日复习量', textStyle: { fontSize: 14, fontWeight: 600 } },
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: Object.keys(dailyReviews).map((d) => d.slice(5)),
      axisLabel: { fontSize: 10 },
    },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      data: Object.values(dailyReviews),
      type: 'line',
      smooth: true,
      areaStyle: { color: 'rgba(124, 58, 237, 0.1)' },
      lineStyle: { color: '#7C3AED' },
      itemStyle: { color: '#7C3AED' },
    }],
  }

  const categoryPieOption = {
    title: { text: '分类分布', textStyle: { fontSize: 14, fontWeight: 600 } },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: Object.entries(categoryDist).map(([id, count]) => ({
        name: categories.find((c) => c.id === Number(id))?.name || `分类${id}`,
        value: count,
      })),
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.1)' } },
    }],
  }

  const statusBarOption = {
    title: { text: '状态分布', textStyle: { fontSize: 14, fontWeight: 600 } },
    tooltip: {},
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: ['未复习', '复习中', '已掌握'],
    },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      type: 'bar',
      data: [
        { value: statusDist.unreviewed || 0, itemStyle: { color: '#DC2626' } },
        { value: statusDist.reviewing || 0, itemStyle: { color: '#D97706' } },
        { value: statusDist.mastered || 0, itemStyle: { color: '#059669' } },
      ],
      barWidth: 40,
      itemStyle: { borderRadius: [6, 6, 0, 0] },
    }],
  }

  const masteryTrend = data.masteryTrend || {}
  const masteryAreaOption = {
    title: { text: '掌握趋势', textStyle: { fontSize: 14, fontWeight: 600 } },
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: Object.keys(masteryTrend).map((d) => d.slice(5)),
      axisLabel: { fontSize: 10 },
    },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      data: Object.values(masteryTrend),
      type: 'line',
      smooth: true,
      areaStyle: { color: 'rgba(5, 150, 105, 0.1)' },
      lineStyle: { color: '#059669' },
      itemStyle: { color: '#059669' },
    }],
  }

  return (
    <div style={{ marginTop: 28 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 16 }}>
        学习数据分析
      </h3>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid var(--color-border)' }}>
            <ReactECharts option={reviewLineOption} style={{ height: 240 }} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid var(--color-border)' }}>
            <ReactECharts option={categoryPieOption} style={{ height: 240 }} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid var(--color-border)' }}>
            <ReactECharts option={statusBarOption} style={{ height: 240 }} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid var(--color-border)' }}>
            <ReactECharts option={masteryAreaOption} style={{ height: 240 }} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Charts
