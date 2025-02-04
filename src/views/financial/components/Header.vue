<template>
  <div class="header">
    <div class="bgImg" v-if="finaImg">
      <image-load :filePath="finaImg" class="img" />
    </div>
    <div class="navigationList">
      <div
        class="item"
        v-for="item in listNav"
        :key="item.icon"
        @click="$router.push(item.clickName)"
      >
        <svg-load :name="item.icon" class="itemImg"></svg-load>
        <div class="itemName">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { _t18 } from '@/utils/public'
import { publiceNotice } from '@/api/common/index'
// 增值收益 会员专区 普通产品 我的投资
const listNav = computed(() => {
  return [
    {
      icon: 'f-increase',
      name: _t18(`value_added _income`),
      clickName: '/addIncome'
    },
    {
      icon: 'f-member',
      name: _t18(`members_only`),
      clickName: '/membersOnly'
    },
    {
      icon: 'f-product',
      name: _t18(`normal_product`),
      clickName: '/generalMerchandise'
    },
    {
      icon: 'f-invest',
      name: _t18(`my_invest`),
      clickName: '/myInvestment'
    }
  ]
})
const finaImg = ref('')
onMounted(async () => {
  try {
    const res = await publiceNotice('ACTIVITY_NOTICE', 'FINANCE_ACTIVITY ')
    if (res.code === 200) {
      finaImg.value = res.data[0].imgUrl
    }
  } catch (error) {}
})
</script>
<style lang="scss" scoped>
.header {
  padding: 0 0 20x;
  .bgImg {
    margin: 0 15px;
    height: 109px;
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
    }
  }
  
  .navigationList {
    padding: 19px 15px 19px;
    display: flex;
    justify-content: space-between;
    border-bottom:1px solid var(--ex--backup-background-color-2);
    border-top:1px solid var(--ex--backup-background-color-2);

    .item {
      flex: 1;
      text-align: center;
      align-items: center;
      font-size: 13px;
      color: var(--ex-default-font-color);
      justify-content: center;
      padding: 0 5px;
      .itemImg {
        width: 44px;
        height: 44px;
        margin-bottom: 10px;
      }
      .itemName {
        color: var(--ex-assets--font-color);
        text-align: center;
        word-wrap: break-word;
      }
    }
  }
}
</style>
