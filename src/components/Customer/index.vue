<template>
  <div>
    <!-- 内容 -->
    <van-popup v-model:show="show" round>
      <div class="popup-box">
        <div class="head">
          <div class="title">在线客服</div>
          <div class="close" @click.stop="handelClose">
            <svg-load class="closeSvg" name="guanbi"></svg-load>
          </div>
        </div>
        <div class="conn" v-if="_getConfig('_APP_ENV').includes('zhilian_')">
          <div>
            请认准Telegram智联科技官方客服，核对Telegram用户名，其他人员请找官方客服人员确认，谨防上当受骗
          </div>
          <div>如需搭建，联系智联科技官方客服：</div>
          <div v-for="(v, i) in customerData" :key="i" class="heng">
            <div>
              <span class="customer" @click="tohref(v.customer)">@{{ v.customer }}</span
              >-{{ v.title }}
            </div>
          </div>
        </div>
        <div class="conn" v-else>
          <div>
            请认准telegram华硕官方客服，核对telegram用户名， 其他人员均为假冒伪劣，谨防上当受骗
          </div>
          <div>如需开台，联系以下推广客服：</div>
          <div v-for="(v, i) in customerData" :key="i" class="heng">
            <div>
              <span class="customer" @click="tohref(v.customer)">@{{ v.customer }}</span
              >-{{ v.title }}
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMainStore } from '@/store/index'
const mainStore = useMainStore()
const show = ref(mainStore.showPopup)

const handelClose = () => {
  show.value = false
  mainStore.setShowPopup(false)
}
const tohref = (v) => {
  window.open(`https://t.me/${v}`)
}
const customerData = computed(() => {
  let tempList = []
  if (__config._APP_ENV.includes('zhilian_')) {
    tempList = [
      {
        customer: 'zhilian1919',
        title: '智联科技💰王羲之（包网🔥定制🔥搭建）'
      }
    ]
  } else {
    tempList = [
      {
        customer: 'hskj26',
        title: '华硕科技客服13:00-24:00'
      },
      {
        customer: 'taizi22',
        title: '华硕科技维护专员-太13:00-24:00'
      },
      {
        customer: 'UUUUU_FFFFFFF',
        title: '包网咨询-客服（11.00-24.00）'
      },
      {
        customer: 'lucky839',
        title: '华硕科技客服13:00-24:00（转账请语音确认）'
      },
      {
        customer: 'yefan11',
        title: '华硕包网-叶凡'
      },
      {
        customer: 'xiazi88',
        title: '华硕科技-包网搭建'
      },
      {
        customer: 'yefan88888',
        title: '华硕包网-叶凡小号'
      }
    ]
  }
  return tempList
})
</script>

<style lang="scss" scoped>
.popup-box {
  width: 310px;
  padding-bottom: 15px;
  background: var(--ex-backup--background-color);
  .head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 15px;
    height: 50px;
    border-bottom: 1px solid var(--ex-border-line);
    .title {
      font-size: 16px;
      color: var(--ex-font-color6);
      text-align: center;
      width: 100%;
      position: absolute;
      left: 0;
    }
    .close {
      position: relative;
      z-index: 9;
      .closeSvg {
        font-size: 20px;
      }
    }
  }
  .time {
    width: 100%;
    padding: 10px 15px 0;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 1.5;
  }
  .conn {
    min-height: 250px;
    max-height: calc(100vh - 700px);
    overflow: hidden auto;
    line-height: 20px;
    padding: 10px 15px 0;
    box-sizing: border-box;
    font-size: 14px;
    .heng {
      font-size: 14px;
      margin-top: 12px;
      .customer {
        color: #0052ff;
      }
    }
  }
}
</style>
