<template>
  <van-loading v-if="loading" />

  <div class="funList" v-if="listArray.length > 0 && !isShow">
    <FoundCard v-for="item in listArray" :key="item.id" :itemObj="item"></FoundCard>
  </div>
  <Nodata v-if="listArray.length === 0 && isShow"></Nodata>
</template>
<script setup>
import FoundCard from './FoundCard.vue'
import { onMounted, ref } from 'vue'
import { getFinancial } from '@/api/financial/index'
const listArray = ref([])
const isShow = ref(false)
const isActivated = ref(false)//是否首次加载
const loading = ref(false)
const getInit = async () => {
  isActivated.value = true
  loading.value = true
  try {
    let data = {
      classify: ''
    }
    const res = await getFinancial(data)
    if (res.code === 200) {
      listArray.value = res.rows
      listArray.value.length === 0 ? (isShow.value = true) : (isShow.value = false)
    }
    loading.value = false
  } catch (error) {
    console.log(45)
  }
}
//每次进入缓存页面获取数据
onActivated(() => {
  if (isActivated.value) {
    getInit()
  }
})
onMounted(() => {
  getInit()
})
</script>
<style lang="scss" scoped>
.funList {
  padding: 20px 15px 66px;
}
</style>
