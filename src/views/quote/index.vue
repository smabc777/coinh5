<!-- 行情页面：自选，秒合约，币币交易，U本位 -->
<template>
  <div class="quote">
    <!-- 搜索 -->
    <van-field autocomplete="off" class="searchInput" v-model="searchName" center
      :placeholder="_t18(`search_currency`, ['moonex'])">
      <template #button>
        <van-icon size="20" color="var(--ex-default-font-color)" name="search" @click="handleSearch" />
      </template>
    </van-field>
    <!-- 开启模拟资产 -->
    <div class="simulate" v-if="userStore.isSign && IS_HAS_SIMULATE.includes(_getConfig('_APP_ENV')) && !isSimulate"
      @click="switchType">
      <div class="left_tips">
        <div class="tips_assets text-ellipsis2">{{ _t18('trading_account_no_assets') }}</div>
        <div class="tips_sel">{{ _t18('try_simulated_trade') }}</div>
      </div>
      <div class="right_btn">
        {{ _t18('simulated_trade') }}
        <image-load filePath="quote/quan.png" class="right_btn-bg"></image-load>
      </div>
      <image-load filePath="quote/simulate.png" class="simulate-bg"></image-load>
    </div>
    <!-- tabs -->

    <!-- <keep-alive>
          <ApanStocks ref="apanStocksRef"></ApanStocks>
        </keep-alive> -->

    <van-tabs swipeable shrink border :swipe-threshold="3" line-width="52" v-model:active="currentIndex">
      <van-tab v-for="(item, index) in headerList" :key="index" :title="item.title">
        <!--自选-->
        <Optional v-if="item.componentName == 'Optional'"></Optional>
        <SecondContract v-else-if="item.componentName == 'SecondContract'"></SecondContract>
        <BBTrading v-else-if="item.componentName == 'BBTrading'"></BBTrading>
        <Ustandard v-else-if="item.componentName == 'Ustandard'"></Ustandard>
        <Encryption v-else-if="item.componentName == 'Encryption'"></Encryption>
        <ForeignExchange v-else-if="item.componentName == 'ForeignExchange'"></ForeignExchange>

        <keep-alive>
          <ApanStocks v-if="item.componentName == 'ApanStocks' && currentIndex === 4"  ref="apanStocksRef"></ApanStocks>
        </keep-alive>
        

        <!--启用缓存加载组件-->
        <!--        <keep-alive>-->
        <!--        <component ref="quoteref" :is="headerList[currentIndex].componentName"></component>-->
        <!--        </keep-alive>-->
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { IS_HAS_SIMULATE } from '@/config/index'
import { _t18, _toView } from '@/utils/public'
import { computed, nextTick, provide, ref } from 'vue'
import { useMainStore } from '@/store/index'
import { useTradeStore } from '@/store/trade'
import { useUserStore } from '@/store/user'
import { switchAccount } from '@/api/user'
import { showConfirmDialog, showToast } from 'vant'
import { _WebSocket } from '@/plugin/socket/index.js'
import { useToast } from '@/hook/useToast'
const { _toast, _showName } = useToast()
const userStore = useUserStore()
// 判断是否模拟交易
const isSimulate = computed(() => {
  return userStore.isSimulate
})
const switchType = () => {
  showConfirmDialog({
    width: '380px',
    message: _showName('confirm_start_simulated_trade'),
    confirmButtonText: _showName('btnConfirm'),
    cancelButtonText: _showName('cancel')
  }).then(() => {
    switchAccount(2).then(async (res) => {
      if (res.code === 200) {
        _toast('enter_simulated_trade')
        //切换成功
        await userStore.getUserInfo()
        userStore.setSimulate(true)
        _WebSocket && _WebSocket.reconnect()
        _toView('/')
      } else {
        showToast(res.msg)
      }
    })
  })
}

const mainStore = useMainStore()
const tradeStore = useTradeStore()

// 搜索
const searchName = ref('')
provide('searchName', searchName)

const apanStocksRef = ref(null)

const handleSearch = () => {
  if (currentIndex.value === 4) {
    nextTick(() => {
      apanStocksRef.value[0].onRefresh()
    })
  }
}

// tabs数据
// 每次进1
// const currentIndex = ref(mainStore.tradeFlag + mainStore.isOption)

const currentIndex = ref(1)
const headerList = computed(() => mainStore.getTradeHeaderList)

watch(
  currentIndex,
  (n) => {
    mainStore.setTradeFlag(n)
  },
  { immediate: true }
)
</script>

<script>
import BBTrading from './components/BBTrading/index.vue'
import Ustandard from './components/Ustandard/index.vue'
import SecondContract from './components/SecondContract/index.vue'
import Optional from './components/Optional/index.vue'
import ApanStocks from './components/ApanStocks/index.vue'
import ForeignExchange from './components/ForeignExchange/index.vue'
import Encryption from './components/Encryption/index.vue'


export default {
  name: 'Quote',
  components: {
    Optional,
    SecondContract,
    BBTrading,
    Ustandard,
    ApanStocks,
    ForeignExchange,
    Encryption
  }
}
</script>

<style lang="scss" scoped>
.quote {

  // 搜索
  padding: 20px 16px;
  padding-bottom: 80px;

  :deep(.searchInput) {
    border-radius: 8px;
    border: 1px solid var(--ex-border-color2);

    /* 焦点状态样式 */
    &:hover {
      border: 1px solid var(--ex-input-focus-color);
      outline: none;

      /* 防止点击时出现默认的浏览器外观 */
      input::placeholder {
        color: var(--ex-white);
      }
    }
  }

  :deep(.van-tabs) {
    margin-top: 20px;

    .van-tabs__nav {
      padding-left: 0;
      padding-right: 0;
    }

    .van-tabs__wrap {
      height: 36px;

      &:after {
        border-bottom: 1px solid var(--ex-border-line);
        border-top: none;
        opacity: 0.4;
      }

    }

    .van-tab {
      padding: 0 12px;
      font-size: 15px;
    }

    .van-tabs__line {
      height: 2px;
    }
  }
}

.simulate {
  margin: 10px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 13px;
  position: relative;

  .simulate-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
  }

  .left_tips {
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .tips_assets {
      font-size: 17px;
      color: var(--ex-default-font-color-deep2);
      font-weight: 600;
    }

    .tips_sel {
      padding: 4px 10px;
      background-color: var(--ex-two-level-theme-color);
      font-size: 12px;
      color: var(--ex-default-reverse-font-color);
      border-radius: 11px;
      width: fit-content;
      margin-top: 10px;
    }
  }

  .right_btn {
    width: 58px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    //padding: 14px 15px;
    font-size: 12px;
    word-wrap: break-word;
    color: var(--ex-default-reverse-font-color);
    flex-shrink: 0;
    position: relative;

    .right_btn-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
}
</style>
