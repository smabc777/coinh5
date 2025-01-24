<!-- 普通产品 -->
<template>
  <HeaderBar :currentName="_t18(`normal_product`)" />
  <van-loading v-if="loading" />

  <div class="funList" v-if="listArray.length > 0 && !isShow">
    <FoundCard v-for="item in listArray" :key="item.id" :itemObj="item"></FoundCard>
  </div>
  <Nodata v-if="listArray.length === 0 && isShow"></Nodata>
</template>
<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import FoundCard from './components/FoundCard.vue'
import { onMounted, ref } from 'vue'
import { getFinancial } from '@/api/financial/index'
import { _t18 } from '@/utils/public'
const listArray = ref([])
const isShow = ref(false)
const loading = ref(false)
const getInit = async () => {
  loading.value = true
  try {
    let data = {
      classify: '0'
    }
    const res = await getFinancial(data)
    if (res.code === 200) {
      listArray.value = res.rows
      listArray.value.length === 0 ? (isShow.value = true) : (isShow.value = false)
    }
    loading.value = false
  } catch (error) { }
}
onMounted(() => {
  getInit()
})
</script>
<style lang="scss" scoped>
.funList {
  padding: 20px 15px 0px;
}
</style>