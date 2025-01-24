<template>
  <div class="userAmount">
    <div>
      <!-- 账户余额 -->
      <p>{{ _t18('asset_account', ['ebc']) }}(USDT)</p>
      <svg-load name="showicon" class="yanjin" @click="handleYanjin"></svg-load>
      <!-- <svg-load name="refresh" class="shuaxin" @click="handleShuaxin"></svg-load> -->
    </div>
    <p class="userInfo fw-num">{{ _numberWithCommas(amount) }}</p>
  </div>
  <div class="currencyAbout">
    <div v-for="(item, index) in currencyAbout.filter((items) => {
        return items.isShow
      })" :key="index" @click="toRecharge(item.url)">
      <svg-load :name="item.icon" class="currencyIcon"></svg-load>
      <p class="tips">{{ item.title }}</p>
    </div>
  </div>
</template>

<script setup>
import { dispatchCustomEvent } from '@/utils'
import { _getConfig, _t18, _toView } from '@/utils/public'
import { DIFF_ISFREEZE_RXCE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'
import { useUserStore } from "@/store/user";
import { computed } from "vue";
const userStore = useUserStore()
// 判断是否模拟交易
const isSimulate = computed(() => {
  return userStore.isSimulate
})

const { _isFreeze } = useFreeze()
const props = defineProps({
  data: {
    type: Object
  },
  amount: {
    type: String
  },
  coin: {
    type: String,
    default: 'USDT'
  },
  type: {
    type: String
  },
  showicon: {
    type: String
  },
  keyStr: {
    type: String
  }
})


const emit = defineEmits(['handleYanjin', 'handleShuaxin'])
const handleYanjin = () => {
  emit('handleYanjin')
}
const handleShuaxin = () => {
  emit('handleShuaxin')
}

const currencyAbout = computed(() => {
  let list = []
  if (props.type == '平台资产') {
    list = [
      {
        icon: 'dui',
        title: _t18('recharge'),
        url: '/recharge',
        isShow: isSimulate.value ? false : true
      }, //充币
      {
        icon: 'huazhuan',
        title: _t18('stock101'),
        url: '/withdraw',
        isShow: isSimulate.value ? false : true
      }, //提币
      { icon: 'tibi', title: _t18('asset_swap'), url: '/swap', isShow: true }, //闪兑
      { icon: 'daikuai', title: _t18('asset_loan'), url: '/loan', isShow: false }, //助力贷
      {
        icon: 'chongbi',
        title: _t18('asset_transfer'),
        url: '/transfer',
        isShow: !['jphskt'].includes(_getConfig('_APP_ENV'))
      } //划转
    ]

  } else {
    if (['gridai'].includes(_getConfig('_APP_ENV')) || ['bydfe'].includes(_getConfig('_APP_ENV'))) {
      list = [
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/transfer', isShow: true }, {}]
    } else {
      list = [
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/transfer', isShow: true },
        // { icon: 'chongbi', title: '充币', url: '/recharge', isShow: true },
        // { icon: 'tibi', title: '提币', url: '/withdraw', isShow: true },
        // { icon: 'dui', title: '闪兑', url: '/swap', isShow: true },
        {
          icon: 'daikuai', title: _t18('asset_loan'), url: '/loan',
          isShow: ['cmmetrics'].includes(_getConfig('_APP_ENV')) ? false : true
        }
      ]
    }

  }

  return list
})
/**
 * 点击快捷充币
 */
const toRecharge = (url) => {
  console.log(1212);

  if (DIFF_ISFREEZE_RXCE.includes(__config._APP_ENV) && url == '/recharge') {
    _toView(url)
  } else {
    // if (DIFF_ISFREEZE_RXCE.includes(__config._APP_ENV)) {
    if (_isFreeze(DIFF_ISFREEZE_RXCE, 'RECHARGE')) {
      _toView({
        path: url,
        query: { keyStr: props.keyStr }
      })
    }
    // } else {
    //   _toView(url)
    // }
  }
}
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}

.userAmount {
  padding: 46px 15px 26px;
  display: flex;
  flex-direction: column;
  text-align: center;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-bottom: 25px;

    .yanjin {
      font-size: 25px;
      margin: 0 0 0 15px;
    }

    .shuaxin {
      font-size: 25px;
    }

    p {
      font-size: 16px;
      color: var(--ex-passive-font-color);
    }
  }

  &>p {
    font-size: 24px;
    font-weight: 600;
    text-align: center;
  }
}

.currencyAbout {
  padding: 0 5px 21px;
  display: flex;
  text-align: center;
  justify-content: center;

  &>div {
    width: 25%;
  }

  .currencyIcon {
    font-size: 48px;
    margin-bottom: 8px;
  }

  .icon-bg {
    background: #16171b;
    border-radius: 50%;
    padding: 10px;
    font-size: 20px;
  }

  .tips {
    color: var(--ex-assets--font-color);
  }
}
</style>
