<!-- Defi挖矿 -->
<template>
  <!-- 通知弹窗 -->
  <van-popup v-model:show="showNotice" round closeable>
    <div class="showNoticeContent">
      <p class="showNoticeContent_title fw-bold">{{ showNoticeContent.noticeTitle }}</p>
      <div class="showNoticeContent_content">
        <image-load :filePath="showNoticeContent.imgUrl" v-if="showNoticeContent.imgUrl"/>
      </div>
    </div>
  </van-popup>
  <!-- 档位收益比率说明弹窗 -->
  <Popup
      :show="showRule"
      :direction="direction"
      @handelClose="closePopup"
      :title="_t18('defi_speak')"
      :content="popupContent"
  >
  </Popup>
  <HeaderBar
      :currentName="_t18('host_non-collateralized_mining', ['mimic','gridai'])"
      :cuttentRight="cuttentRight"
      :border_bottom="false"
  ></HeaderBar>
  <Info/>
  <div class="content">

    <!-- 挖矿 -->
    <Mining :incomeInfo="incomeInfo" :outcomeInfo="outcomeInfo"></Mining>

    <!-- 幸运活动 -->
    <LuckyActivity
        v-if="activityInfo.id"
        :data="activityInfo"
        @getShowDefiActivity="getShowDefiActivity"
    ></LuckyActivity>

    <!-- 档位收益 profit -->
    <div class="profit">
      <div class="tit">
        <div class="left fw-bold">{{ _t18('defi_rule_fzywk_til3_1') }}</div>
        <div class="rule" @click="showPopup">
          <van-icon name="info-o" color="var(--ex-usdc-button-color)" class="icon"/>
          {{
            _t18('defi_speak')
          }}
        </div>
      </div>
      <div class="profit_content">
        <table>
          <thead>
          <tr>
            <th>{{ _t18('defi_rule_fzywk_tab1') }}</th>
            <th>{{ _t18('defi_count') }}</th>
            <th>{{ _t18('defi_rule_fzywk_tab3') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in defiRateList" :key="index">
            <td class="ff-num">{{['gridai'].includes(_getConfig('_APP_ENV'))?'VIP':''}}{{ item.sort }}</td>
            <td class="ff-num">{{ item.amountTotle }}</td>
            <!-- <td class="ff-num">{{ item.rate }}{{['gridai'].includes(_getConfig('_APP_ENV'))?`-${_mul(item.remark,100)}%`:''}}</td> -->
            <td class="ff-num">{{ item.rate }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <lazy-component>
      <!-- 用户输出 output -->
      <div class="output">
        <div class="tit fw-bold">{{ _t18('defi_host_user output') }}</div>
        <div class="output_content">
          <div class="output_content_title">
            <p>{{ _t18('defi_host_address') }}</p>
            <p>{{ _t18('defi_count') }}</p>
          </div>
          <van-swipe
              autoplay="800"
              loop
              vertical
              :touchable="false"
              :show-indicators="false"
              height="50"
              @change="swipeChange"
          >
            <van-swipe-item v-for="(item, index) in userInvestmentList" :key="index">
              <div class="ff-num">
                {{ item.address }}
              </div>
              <div class="ff-num">{{ item.num }} ETH</div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </lazy-component>

    <lazy-component>
      <!-- 合约审核机构 process -->
      <div class="process">
        <div class="tit fw-bold">{{ _t18('defi_ho_tit1') }}</div>
        <div class="imgs">
          <p>
            <image-load filePath="defi/openzeppelin.png" name="defi"></image-load>
          </p>
          <p>
            <image-load filePath="defi/consensys.png" name="defi"></image-load>
          </p>
        </div>
      </div>
    </lazy-component>

    <lazy-component>
      <Advert></Advert>
    </lazy-component>
  </div>
</template>
<script setup>
import Advert from '@/components/Advert/index.vue'
import {publiceNotice} from '@/api/common/index'
import HeaderBar from '@/components/HeaderBar/index.vue'
import Popup from '@/components/RulePopup/index.vue'
import Mining from '@/views/defic/components/mining.vue'
import LuckyActivity from './components/LuckyActivity.vue'
import {_t18} from '@/utils/public'
import {_mul} from '@/utils/decimal'
import {rulesList} from '@/api/common/index'
import {
  getUserInvestmentApi,
  getDefiRateApi,
  getIncomeApi,
  showDefiActivityApi
} from '@/api/defi/index'
import {useUserStore} from '@/store/user'
import {showToast} from 'vant'
import {useMainStore} from '@/store/index.js'
import Info from './components/Info.vue'

const mainStore = useMainStore()
const cuttentRight = {iconRight: [{iconName: 'kefu', iconSize: '20px', clickTo: 'event_serviceChange'}]}
const showRule = ref(false)
const direction = ref('bottom')
const showPopup = () => {
  showRule.value = true
}
let closePopup = () => {
  showRule.value = false
}
const popupContent = ref({})
const userInvestmentList = ref([])
/**
 * 获取用户输出
 */
const getUserInvestment = async () => {
  let res = await getUserInvestmentApi()
  if (res.code == 200) {
    userInvestmentList.value = res.data.map((elem) => {
      elem.address = elem.address.replace(/\*{5,}/g, '******')
      return elem
    })
  } else {
    showToast(res.msg)
  }
}
/**弹窗内容 */
const getPopupContent = async () => {
  const res = await rulesList('DEFI_EXPLAIN')
  if ((res.code = '200')) {
    popupContent.value = res.data
  }
}
const showNotice = ref(false)
const showNoticeContent = ref({})
/**进入弹窗内容 */
const getOpenPopupContent = async () => {
  const res = await publiceNotice('POP_UPS_NOTICE', 'DEFI_POP_UPS_NOTICE')
  if ((res.code = '200')) {
    if (res.data.length) {
      showNotice.value = true
      showNoticeContent.value = res.data[0]
    }
  }
}

const defiRateList = ref([])

/**
 * 获取档位收益比率
 */
const getDefiRate = async () => {
  let res = await getDefiRateApi()
  if (res.code == 200) {
    defiRateList.value = res.data
  } else {
    showToast(res.msg)
  }
}
const incomeInfo = ref({})
const outcomeInfo = ref(mainStore.getDefiList)
const userStore = useUserStore()
/**
 * 授权后 获取金额
 */
const getIncome = async () => {
  if (userStore.userInfo.approveUsdc == 1) {
    let res = await getIncomeApi(userStore.userInfo.user.userId,'usdc')
    if (res.code == 200) {
      incomeInfo.value = res.data
    } else {
      showToast(res.msg)
    }
  }
}
const activityInfo = ref({})
/**
 * 获取 defi活动
 */
const getShowDefiActivity = async () => {
  if (userStore.userInfo.approveUsdc == 1) {
    let res = await showDefiActivityApi(userStore.userInfo.user.userId)
    if (res.code == 200) {
      if (res.data.length) {
        res.data = res.data[0]
        res.data.days = Math.ceil((res.data.endTimeS - res.data.beginTimeS) / (24 * 60 * 60 * 1000))
        activityInfo.value = res.data
      }
    } else {
      showToast(res.msg)
    }
  }
}
/**
 * 轮播监听
 */
const swipeChange = (val) => {
  let itemList = document.querySelectorAll('.van-swipe-item')
  let count = userInvestmentList.value.length - 1
  if (val == 1) {
    for (let i = 1; i < count; i++) {
      itemList[i].style.transform = ''
    }
  } else if (val > 1 && val < count) {
    let height = document.querySelector('.van-swipe__track').style.height
    let i = val - 1
    itemList[i].style.transform = `translateY(${height})`
  }
}

onMounted(() => {
  getUserInvestment()
  getDefiRate()
  // getOutcome()
  getIncome()
  // 幸运活动
  // getShowDefiActivity()
  getPopupContent()//说明文档
  // 通知弹窗
  // getOpenPopupContent()
})
</script>
<style lang="scss" scoped>
:deep(.van-popup) {
  max-width: var(--ex-max-width);
  background: var(--ex-default-background-color);
}

* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}

.banner {
  img {
    width: 100%;
    height: auto;
  }
}

.content {
  padding-bottom: 35px;

  & > div {
    padding: 40px 15px 0;

    .tit {
      display: flex;
      justify-content: space-between;

      .rule {
        color: var(--ex-usdc-button-color);

        .icon {
          margin-right: 4px;
        }
      }
    }
  }

  .profit {
    // border-top: 1px solid var(--ex-border-color);
    .fw-bold {
      font-size: 16px;
    }

    .profit_content {
      margin-top: 10px;
      border: 1px solid var(--ex-profit-table-border-color);
      border-radius: 3px;

      table {
        width: 100%;
        color: var(--ex-profit-table-font-color);

        td,
        th {
          border: 1px solid var(--ex-profit-table-border-color);
          text-align: center;
          padding: 14px 0;
          font-size: 12px;
        }

        thead {
          th {
            border-top: 0;
          }

          tr {
            & > th:first-child {
              border-left: 0;
            }

            & > th:last-child {
              border-right: 0;
            }
          }
        }

        tbody {
          & > tr:last-child {
            td {
              border-bottom: 0;
            }
          }

          tr {
            & > td:first-child {
              border-left: 0;
            }

            & > td:last-child {
              border-right: 0;
            }

            &:nth-child(2n + 1) {
              background: #161A33;
            }
          }
        }
      }
    }
  }

  .output {
    color: var(--ex-output-table-font-color);

    .fw-bold {
      font-size: 16px;
    }

    .output_content {
      margin-top: 10px;
      border: 1px solid var(--ex-output-table-border-color);
      border-radius: 3px;

      .output_content_title {
        display: flex;
        padding: 15px;
        justify-content: space-between;
        border-bottom: 1px solid var(--ex-output-table-border-color);
      }

      .van-swipe {
        height: 200px;

        .van-swipe-item {
          width: 100%;
          height: 50px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &:nth-child(2n+1) {
            background: #161A33;
          }
        }
      }
    }
  }

  .process {
    .fw-bold {
      font-size: 16px;
    }

    .imgs {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      p {
        padding: 8px 15px;
        background-color: var(--ex-div-bgColor17);
        border-radius: 3px;

        img {
          height: 40px;
          width: auto;
        }
      }
    }
  }

}

.showNoticeContent {
  min-width: 300px;
  text-align: center;

  .showNoticeContent_title {
    font-size: 18px;
    padding: 15px 0;
    border-bottom: 1px solid #e1e1e1;
  }

  .showNoticeContent_content {
    padding: 20px 15px 30px;
    max-height: 400px;
  }
}
</style>
