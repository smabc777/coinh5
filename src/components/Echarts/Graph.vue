<template>
  <div ref="GraphRef" class="chart-container"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import {markRaw} from 'vue'

const GraphRef = ref(null);
const chartInstance = ref(null);

// 设置图表的配置项和数据
const option = {
  title: {
    show: false,
    text: 'Stacked Line'
  },
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  legend: {
    data: ['发放资金', '用户收入'],
    top: '15px',
  },
  grid: {
    left: '0%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    show: false,
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    show: false,
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Su2n']
  },
  yAxis: {
    show: false,
    type: 'value'
  },
  series: [
    {
      smooth: 0.5,
      name: '发放资金',
      type: 'line',
      // stack: 'Total',
      symbolSize: 10, //小圆点的大小
      // symbol: 'circle',
      // symbol: 'none',
      symbol:(value, params) => {
        if (6 == params.dataIndex) {
          return 'circle'
        }else {
          return 'none'
        }
      },
      endLabel: {
        show: true,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        offset: [-30, -20],
        formatter: function (params) {
          return params.value;
        }
      },
      itemStyle: {
        normal: {
          lineStyle: {
            width: 5 //设置线条粗细
          },
          formatter: function (params) {
            return params.value;
          }
        }
      },
      data: [120, 1, 1501, 1, 1190, 230, 2210]
    },
    {
      smooth: 0.5,
      name: '用户收入',
      type: 'line',
      // stack: 'Total',
      symbolSize: 10, //小圆点的大小
      // symbol: 'circle',
      symbol:(value, params) => {
        if (6 == params.dataIndex) {
          return 'circle'
        }else {
          return 'none'
        }
      },
      endLabel: {
        show: true,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        offset: [-30, -20],
        formatter: function (params) {
          return params.value;
        }
      },
      itemStyle: {
        normal: {
          lineStyle: {
            width: 5 //设置线条粗细
          },
          formatter: function (params) {
            return params.value;
          }
        }
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    }
  ]
};

onMounted(() => {
  // 初始化图表
  chartInstance.value = markRaw(echarts.init(GraphRef.value, 'dark'))
  // 使用配置项和数据显示图表
  chartInstance.value.setOption(option);

  // 如果你的数据是响应式的，你可以使用 watch 来监听数据变化并更新图表
  // watch(arrSeries, (newVal) => {
  //   chartInstance.value.setOption({
  //     xAxis: {
  //       data: newVal.map(item => item.name)
  //     },
  //     series: newVal
  //   });
  // }, {deep: true})
})

</script>


<style scoped lang="scss">
.chart-container {
  // width: 300px;
  width: 100%;
  height: 200px;
}
</style>