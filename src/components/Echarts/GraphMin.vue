<template>
  <div ref="GraphMinRef" class="chart-container"></div>
</template>
<script setup>
import * as echarts from 'echarts';

const GraphMinRef = ref(null);
const chartInstance = ref(null);

// prettier-ignore
const data = [["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135], ["2000-06-08", 86], ["2000-06-09", 73], ["2000-06-10", 85], ["2000-06-11", 73], ["2000-06-12", 68], ["2000-06-13", 92], ["2000-06-14", 130], ["2000-06-15", 245], ["2000-06-16", 139], ["2000-06-17", 115], ["2000-06-18", 111], ["2000-06-19", 309], ["2000-06-20", 206], ["2000-06-21", 137], ["2000-06-22", 128], ["2000-06-23", 85], ["2000-06-24", 94], ["2000-06-25", 71], ["2000-06-26", 106], ["2000-06-27", 84], ["2000-06-28", 93], ["2000-06-29", 85], ["2000-06-30", 73], ["2000-07-01", 83], ["2000-07-02", 125], ["2000-07-03", 107], ["2000-07-04", 82], ["2000-07-05", 44], ["2000-07-06", 72], ["2000-07-07", 106], ["2000-07-08", 107], ["2000-07-09", 66], ["2000-07-10", 91], ["2000-07-11", 92], ["2000-07-12", 113], ["2000-07-13", 107], ["2000-07-14", 131], ["2000-07-15", 111], ["2000-07-16", 64], ["2000-07-17", 69], ["2000-07-18", 88], ["2000-07-19", 77], ["2000-07-20", 83], ["2000-07-21", 111], ["2000-07-22", 57], ["2000-07-23", 55], ["2000-07-24", 60]];
const dateList = data.map(function (item) {
  return item[0];
})

const valueList = data.map(function (item) {
  return item[1];
})

const option = {
  // Make gradient line here
  visualMap: {
    show: false,
    type: 'continuous',
    seriesIndex: 0,
    min: 0,
    max: 400
  },
  title: {
    show: false,
    left: 'center',
    text: 'Gradient along the y axis'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    show: false,
    data: dateList
  },
  yAxis: {
    show: false,
  },
  grid: {
    top: '20%',
    bottom: '10%'
  },
  series: [
    {
      smooth: .5,
      type: 'line',
      showSymbol: false,
      data: valueList
    },

  ]
};

onMounted(() => {
  // 初始化图表
  chartInstance.value = echarts.init(GraphMinRef.value,'dark');

  // 使用配置项和数据显示图表
  chartInstance.value.setOption(option);


})
</script>
<style scoped lang="scss">
.chart-container {
  width: 300px;
  height: 100px;
}
</style>