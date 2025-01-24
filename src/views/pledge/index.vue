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
  <Info/>
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
  <div class="pledge_record" @click="router.push('/pledge/pledgeOrder')">
    <div class="flex">
      <image-load filePath="defi/time.png" name="defi" class="time"></image-load>
      <span class="text">{{ _t18('pledge_records') }}</span>
    </div>
    <image-load filePath="defi/right-arrow.png" name="defi" class="right-arrow"></image-load>
  </div>

  <lazy-component>
    <!-- 收益信息（资金、收益） -->
    <div class="userAccount">
      <div class="title">
        <span class="line"></span>
        <span class="text">{{ _t18('data_preview',['moonex']) }}</span>
        <span class="line"></span>
      </div>
      <div class="fund">
        <van-grid :gutter="10" :column-num="2" :border="false" class="list">
          <van-grid-item class="item">
            <image-load filePath="defi/pledge_hosting.png" name="defi" class="icon"></image-load>
            <p class="fw-num">{{ priceFormat(showInfo.amount) || 0 }}</p>
            <!-- 正在托管 -->
            <span class="til">{{ _t18('pledge_hosting') }}</span>
          </van-grid-item>
          <van-grid-item class="item">
            <image-load
                filePath="defi/pledge_commissioned_order.png"
                name="defi"
                class="icon"
            ></image-load>
            <p class="fw-num">{{ showInfo.orderNum || 0 }}</p>
            <!-- 委托订单 -->
            <span class="til">{{ _t18('pledge_commissioned_order') }}</span>
          </van-grid-item>
          <van-grid-item class="item">
            <image-load
                filePath="defi/pledge_Today_Earnings.png"
                name="defi"
                class="icon"
            ></image-load>
            <p class="fw-num">{{ priceFormat(showInfo.todayProfit) || 0 }}</p>
            <!-- 今日收益 -->
            <span class="til">{{ _t18('pledge_Today_Earnings') }}</span>
          </van-grid-item>
          <van-grid-item class="item">
            <image-load filePath="defi/Cumulative_income.png" name="defi" class="icon"></image-load>
            <p class="fw-num">{{ priceFormat(showInfo.profitMoney) || 0 }}</p>
            <!-- 累计收益 -->
            <span class="til">{{ _t18('Cumulative_income') }}</span>
          </van-grid-item>
        </van-grid>
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
    {iconName: 'right-rule', clickTo: '', name: _showName('gameplay_description',['vitc'])},
    // { iconName: 'jilu', clickTo: '/pledge/pledgeOrder' }
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
    .item {
      align-items: flex-start;
      border-radius: 10px;
      position: relative;

      .icon {
        width: 30px;
        height: 30px;
      }

      .fw-num {
        font-size: 16px;
        word-break: break-all;
        color: var(--ex-default-font-color);
        margin: 20px 0 6px;
      }

      .til {
        word-wrap: break-word;
        color: #9493AC;
      }
    }

    :deep(.van-grid-item__content) {
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      align-items: flex-start;
      padding-left: 10px;
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
