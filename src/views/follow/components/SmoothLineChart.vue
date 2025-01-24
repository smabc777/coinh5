<template>
  <div class="chart-container">
    <canvas ref="canvas" width="130" height="40"></canvas>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  dataPoints: {
    type: Array,
    required: true
  }
})

const canvas = ref(null)

// Catmull-Rom 样条插值函数
// Catmull-Rom 样条插值函数
function catmullRomSpline(p0, p1, p2, p3, t) {
  const v0 = (p2 - p0) * 0.5
  const v1 = (p3 - p1) * 0.5
  const t2 = t * t
  const t3 = t * t * t
  return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1
}

// 绘制Catmull-Rom 样条曲线
function drawCatmullRomSpline(ctx, data) {
  const canvasWidth = ctx.canvas.width
  const canvasHeight = ctx.canvas.height
  const maxDataPoint = Math.max(...data)

  // 清除之前的绘图
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  ctx.beginPath()
  // 计算第一个点的坐标
  let prevX = 0
  let prevY = canvasHeight - (data[0] / maxDataPoint) * canvasHeight

  ctx.moveTo(prevX, prevY) // 移动到第一个数据点

  // 使用样条曲线绘制数据点
  for (let i = 0; i < data.length - 1; i++) {
    let p0 = i > 0 ? data[i - 1] : data[0]
    let p1 = data[i]
    let p2 = data[i + 1]
    let p3 = i < data.length - 2 ? data[i + 2] : data[data.length - 1]

    for (let t = 0; t < 1; t += 0.1) {
      let currX = (canvasWidth / (data.length - 1)) * (i + t)
      let currY = canvasHeight - (catmullRomSpline(p0, p1, p2, p3, t) / maxDataPoint) * canvasHeight
      ctx.lineTo(currX, currY)
    }
  }
  ctx.stroke() // 结束绘制
}

onMounted(() => {
  const ctx = canvas.value.getContext('2d')
  // 设置线条样式
  ctx.lineWidth = 4 // 线条宽度更粗
  // 创建渐变颜色
  const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
  gradient.addColorStop(0, '#00FF00') // 起始颜色
  gradient.addColorStop(1, '#00FFFF') // 结束颜色
  ctx.strokeStyle = gradient // 应用渐变颜色

  drawCatmullRomSpline(ctx, props.dataPoints)
})

watch(
  () => props.dataPoints,
  (newData) => {
    const ctx = canvas.value.getContext('2d')
    drawCatmullRomSpline(ctx, newData)
  },
  { deep: true }
)
</script>
<style scoped>
/* .chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 0;
  } */
/* canvas {
    border: 1px solid #444;
    padding: 2px 0;
    box-sizing: border-box;
  } */
</style>
