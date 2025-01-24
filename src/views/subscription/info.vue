<template>
  <div>
    <!-- 申购详情 -->
    <HeaderBar :currentName="_t18(`host.detail`)"></HeaderBar>
    <div class="subInfo">
      <!-- 币种介绍 -->
      <CoinInfo :data="formData"></CoinInfo>
      <!-- 产品详情 -->
      <div class="infoItem" v-if="formData?.id">
        <ProductInfo :data="formData"></ProductInfo>
      </div>
      <!-- 产品规则 -->
      <div class="infoItem">
        <RuleInfo :purchaseLimit="formData.purchaseLimit"></RuleInfo>
      </div>
      <!-- 提交申购 -->
      <div class="infoItem btnBox" @click="toApply()">
        <!--
         formData.type == 1 配售  0 申购
        formData.type == 1 ? _t18('Placement') :_t18(`Immediate-subscription`)
        -->
        <ButtonBar :btnValue="(formData.type == 1 ? _t18('Placement') :_t18(`Immediately-subscribe`))"/>
      </div>
    </div>


  </div>
</template>

<script setup>
import {_t18} from '@/utils/public'
import HeaderBar from '@/components/HeaderBar/index.vue'
import CoinInfo from './components/CoinInfo.vue'
import ProductInfo from './components/ProductInfo.vue'
import RuleInfo from './components/RuleInfo.vue'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import {_toView} from '@/utils/public'
import {getOwnCoinDetail} from '@/api/subscription/index'
import {useRoute} from 'vue-router'

const route = useRoute()
/**
 * 详情数据
 */
const formData = reactive({})
/**
 * id
 */
const id = ref('')

/**
 * 获取数据详情
 */
const getDetail = async () => {
  if (id.value) {
    const res = await getOwnCoinDetail(id.value)
    if (res.code == 200) {
      Object.assign(formData, res.data)
    }
  }
}

/**
 * 去申购
 */
const toApply = () => {
    _toView(`/subscription/apply?id=${formData.id}`)
}

onMounted(() => {
  id.value = route.query.id
  getDetail()
})
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: #333;
}

.subInfo {
  padding: 0 15px;
}

.infoItem {
  padding: 20px 0 0;
}

.btnBox {
  padding: 50px 0;
}
</style>
