<!-- 质押挖矿 -->
<template>
  <!-- 质押挖矿规则弹窗 -->
  <Popup
      :show="showRule"
      :direction="direction"
      @handelClose="closePopup"
      :title="_t18('defi_speak',['gridai'])"
      :content="popupContent"
  >
  </Popup>
  <HeaderBar
      :currentName="_t18('defi_host_lockup', ['mimic','gridai','moonex'])"
      :cuttentRight="cuttentRight"
      @showPopup="showPopup"
  ></HeaderBar>
  <!-- <Info/> -->
  <!-- 广告图 -->
  <div class="banner">
    <image-load
        v-if="['mimic'].includes(_getConfig('_APP_ENV'))"
        :filePath="`zhiyabg_${_getConfig('_APP_ENV')}.png`"
        name="defi"
    ></image-load>
    <image-load v-else filePath="zhiyabg.png" name="defi"></image-load>
  </div>
  <!-- 质押记录 -->
  <!-- <div class="pledge_record" @click="router.push('/pledge/pledgeOrder')">
    <div class="flex">
      <image-load filePath="defi/time.png" name="defi" class="time"></image-load>
      <span class="text">{{ _t18('pledge_records') }}</span>
    </div>
    <image-load filePath="defi/right-arrow.png" name="defi" class="right-arrow"></image-load>
  </div> -->

  <lazy-component>
    <!-- 收益信息（资金、收益） -->
    <div class="userAccount">
      <div class="title">
        <span class="line"></span>
        <span class="text">{{ _t18('data_preview',['moonex']) }}</span>
        <span class="line"></span>
      </div>
      <div class="fund">
      <!-- <image-load filePath="zhiyaimg.png" name="zhiyaimg" class="zhiyaimg"></image-load> -->
      <image-load
        v-if="['mimic'].includes(_getConfig('_APP_ENV'))"
        class="zhiyaimg"
        :filePath="`zhiyaimg_${_getConfig('_APP_ENV')}.png`"
        name="zhiyaimg"
      ></image-load>
      <image-load v-else filePath="zhiyaimg.png" name="zhiyaimg" class="zhiyaimg"></image-load>
      <div class="top">
        <div class="left">
          <p class="fw-num">{{ priceFormat(showInfo.amount) || 0 }}</p>
          <!-- 正在托管 -->
          <span>{{ _t18('pledge_hosting') }}</span>
        </div>
        <div class="right">
          <p class="fw-num">{{ showInfo.orderNum || 0 }}</p>
          <!-- 委托订单 -->
          <span>{{ _t18('pledge_commissioned_order') }}</span>
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <p class="fw-num">{{ priceFormat(showInfo.todayProfit) || 0 }}</p>
          <!-- 今日收益 -->
          <span>{{ _t18('pledge_Today_Earnings') }}</span>
        </div>
        <div class="right">
          <p class="fw-num">{{ priceFormat(showInfo.profitMoney) || 0 }}</p>
          <!-- 累计收益 -->
          <span>{{ _t18('Cumulative_income') }}</span>
        </div>
      </div>
    </div>
    </div>
  </lazy-component>

  <lazy-component>
    <!-- 项目信息 -->
    <div class="project">
      <div class="title">
        <span class="line"></span>
        <span class="text">{{ _t18('pledged_positions',['gridai','moonex']) }}</span>
        <span class="line"></span>
      </div>
      <div class="projectList" v-if="projectList?.length > 0">
        <Card
            v-for="(item, index) in projectList"
            @click="toView(item)"
            :key="index"
            :cardData="item"
            :index="index + 1"
        ></Card>
      </div>
      <Nodata v-else></Nodata>
    </div>
  </lazy-component>
</template>
<script setup>
import Popup from '@/components/RulePopup/index.vue'
import Card from './components/card.vue'
import Info from "./components/Info.vue"

import {_t18} from '@/utils/public'
import {_getConfig, _toView} from '@/utils/public'
import {getPledgeProductList, getPledgeShowInfo} from '@/api/pledge/index'
import {priceFormat} from '@/utils/decimal.js'
import {useRouter} from 'vue-router'
import {useToast} from '@/hook/useToast'

import {onMounted} from 'vue'
import {rulesList} from '@/api/common/index'

const router = useRouter()
const {_showName} = useToast()

const showRule = ref(false)
const popupContent = ref({})
const direction = ref('bottom')
let showPopup = () => {
  showRule.value = true
}
let closePopup = () => {
  showRule.value = false
}
const cuttentRight = reactive({
  iconRight: [
    {iconName: 'right-rule', clickTo: ''},
    { iconName: 'sub-record', clickTo: '/pledge/pledgeOrder' }
  ]

 
})
const toView = (data) => {
  router.push({
    path: '/pledge/pledgeDetail',
    query: {data: encodeURI(JSON.stringify(data))}
  })
}
const showInfo = ref({})
const projectList = ref([])
const getProjectList = async () => {
  const res = await getPledgeProductList()
  if (res.code == '200') {
    projectList.value = res.rows
    if(['gridai'].includes(_getConfig('_APP_ENV'))){
      projectList.value.forEach((item,index) => {
        if(item.title === "USDT"){
          projectList.value[index].title = "Miner"
        }
      });
    }
    console.log(projectList.value)
  }
}
const getShowInfo = async () => {
  const res = await getPledgeShowInfo()
  if (res.code == '200') {
    showInfo.value = res.data
  }
}

/**弹窗内容 */
const getPopupContent = async () => {
  const res = await rulesList('PLEDGE_EXPLAIN')
  if ((res.code = '200')) {
    popupContent.value = res.data
  }
}

onMounted(() => {
  getProjectList()
  getShowInfo()
  getPopupContent()
})
</script>
<style lang="scss" scoped>
.banner {
  // padding: 10px 25px 0;
  img {
    width: 100%;
    height: auto;
  }
}

.pledge_record {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38px;
  padding: 0 15px;
  background: rgba(16, 244, 177, 0.13);
  border-radius: 6px;

  .flex {
    display: flex;
    align-items: center;
  }

  .time {
    width: 16px;
    height: 16px;
  }

  .text {
    font-size: 14px;
    font-weight: 400;
    color: #10F4B1;
    margin-left: 6px;
    cursor: pointer;
  }

  .right-arrow {
    width: 15px;
    height: 10px;
  }
}

.userAccount {
  font-size: 14px;
  padding: 0 15px;
  color: var(--ex-default-font-color);

  .fund {
    border: 1px solid var(--ex-box-border-color);
    border-radius: 10px;
    position: relative;
    background: var(--ex-default-bgcolor);
    .zhiyaimg {
      position: absolute;
      font-size: 50px;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
    }
    .top,
    .bottom {
      display: flex;
      justify-content: space-between;
      .left,
      .right {
        width: 100%;
        height: 100%;
        padding: 25px 15px;

        p,
        span {
          max-width: 100%;
          word-break: break-word;
        }
      }
      .right {
        border-left: 1px solid var(--ex-box-border-color);
        text-align: right;
      }
      p {
        font-size: 18px;
        margin-bottom: 10px;
      }
      span {
        color: var(--ex-passive-font-color);
      }
    }
    .bottom {
      border-top: 1px solid var(--ex-box-border-color);
      p {
        color: var(--ex-primary-color);
      }
    }
    .title {
      margin-bottom: 14px;
      span {
        color: var(--ex-passive-font-color);
      }
    }
    .amount {
      font-size: 28px;
    }
  }
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 25px 0 16px;

  .line {
    width: 86px;
    height: 1px;
    opacity: 0.19;
    border: 1px solid #D0DAD5;
  }

  .text {
    white-space: nowrap;
    font-size: 18px;
    font-weight: 400;
    margin: 0 20px;
    color: var(--ex-default-font-color);
  }
}

.project {
  padding: 0 15px 50px;
}
</style>
