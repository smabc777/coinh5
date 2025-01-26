<!-- 推广中心 -->
<template>
  <div v-if="!['cmmetrics'].includes(_getConfig('_APP_ENV'))">
    <HeaderBar :currentName="_t18('plug', ['strike'])" @showPopup="showPopup"></HeaderBar>
    <!-- 团队信息 -->
    <div class="banner2">
      <div class="plug_bg">
        <div class="shareContent">
          <!-- 邀请好友一起赚币 -->
          <p class="shareContent_title fw-bold">{{ _t18('plug_invite') }}</p>
          <!-- 邀请好友，充值即刻获取佣金 -->
          <p class="shareContent_info">{{ _t18('plug_toInvite', ['strike']) }}</p>
          <div class="sharkCode">
            <Copy :data="sharkCode" :contentFix="'start'" :fontSize="'12px'">
              <template #copyMsg>
                <!-- 邀请码 -->
                <p class="ff-num">{{ _t18('plug_shareCode') }}：{{ sharkCode }}</p>
              </template>
            </Copy>
          </div>
          <div class="shareLink" :contentFix="'start'">
            <Copy :data="`${shareLink}${sharkCode}`" :fontSize="'12px'">
              <template #copyMsg>
                <!-- 推广链接 -->
                <p class="ff-num">{{ _t18('plug_shareLink') }}：{{ shareLink }}{{ sharkCode }}</p>
              </template>
            </Copy>
          </div>
        </div>

      </div>
      <image-load filePath="defi/plugbg.png" class="bgImg" />
    </div>
  </div>
  <div v-else>
    <HeaderBar :currentName="_t18('plug')" :cuttentRight="cuttentRight" @showPopup="showPopup"></HeaderBar>
    <!-- 团队信息 -->
    <div class="banner">
      <div class="plug-section" v-if="!['das'].includes(_getConfig('_APP_ENV'))">
        <div class="plug-header">
          <div class="row-header">
            <img src="@/assets/invite/icon.png" class="itemImg" />
            <div>{{ _t18('my_team') }}</div>
          </div>
          <div class="row-body">
            <div>{{ _t18('plug_amount', ['aams', 'aug']) }}</div>
            <div>{{ teamInfo.sumAmount || 0 }}</div>
          </div>
        </div>
        <div class="plug-conter">
          <!-- 一代人数 -->
          <div class="row-item">
            <div class="row-item-left">
              <div class="line"></div>
              <div class="num">{{ teamInfo.oneCount || 0 }}</div>
              <div>{{ _t18('plug_oneNum', ['aams', 'aug']) }}</div>
            </div>
            <div class="row-item-right">
              <img src="@/assets/invite/team1.png" class="itemImg" />
            </div>
          </div>
          <!-- 二代人数 -->
          <div class="row-item">
            <div class="row-item-left">
              <div class="line"></div>
              <div class="num">{{ teamInfo.twoCount || 0 }}</div>
              <div>{{ _t18('plug_twoNum', ['aams', 'aug']) }}</div>
            </div>
            <div class="row-item-right">
              <img src="@/assets/invite/team2.png" class="itemImg" />
            </div>
          </div>
          <!--三代人数 -->
          <div class="row-item">
            <div class="row-item-left">
              <div class="line"></div>
              <div class="num">{{ teamInfo.threeCount || 0 }}</div>
              <div>{{ _t18('plug_threeNum', ['aams', 'aug']) }}</div>
            </div>
            <div class="row-item-right">
              <img src="@/assets/invite/team3.png" class="itemImg" />
            </div>
          </div>
          <!-- 推广总人数 -->
          <div class="row-item">
            <div class="row-item-left">
              <div class="line"></div>
              <div class="num">{{ teamInfo.sumCount || 0 }}</div>
              <div>{{ _t18('plug_sum', ['aams', 'aug']) }}</div>
            </div>
            <div class="row-item-right">
              <img src="@/assets/invite/team4.png" class="itemImg" />
            </div>
          </div>
        </div>
        <div class="plug-invite" @click="showInvite = true">{{ _t18('invite_now') }}</div>
      </div>
    </div>
    <div v-if="!['das'].includes(_getConfig('_APP_ENV'))">
      <!-- 我的推广 -->
      <div class="promotion_my" v-if="!['bitfly'].includes(_getConfig('_APP_ENV'))">
        <div class="title fw-bold">{{ _t18('plug_myShare', ['aams']) }}</div>

        <van-tabs shrink v-model:active="curIndex" line-width="0" :ellipsis="false" @click-tab="changeIndex">
          <van-tab v-for="(item, index) in tabList" :title="item.title" :key="index" :name="item.name">
            <template #title>
              <div class="tab-item" :class="{ atv: index == curIndex }">
                {{ item.title }}
              </div>
            </template>
            <template #default>
              <div class="header">
                <!--用户ID  返佣金额  注册时间 -->
                <p>{{ _t18('plug_userId') }}</p>
                <p>{{ _t18('plug_back') }}</p>
                <p>{{ _t18('plug_registerTime') }}</p>
              </div>
              <van-pull-refresh v-model="loading" @refresh="onRefresh">
                <Nodata v-if="teamList.length <= 0"></Nodata>
                <div v-else class="contentBox">
                  <div class="content" v-for="(item, index) in teamList" :key="index">
                    <p class="ff-num">{{ item.fromId || '' }}</p>
                    <p class="ff-num">{{ item.sumAmount || 0 }}</p>
                    <p class="ff-num">{{ item.createTime }}</p>
                    <!-- <p class="ff-num">
                      {{
                        item.createTime
                          ? _timeFormat(item.params?.createTime, 'YY/MM/DD HH:mm', true)
                          : ''
                      }}
                    </p> -->
                  </div>
                </div>
              </van-pull-refresh>
            </template>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <!-- 立即邀请弹框 -->
    <van-popup v-model:show="showInvite" round>
      <div class="invite-popup">
        <!-- 邀请好友一起赚币 -->
        <div class="invite-header">
          <div class="title">{{ _t18('plug_invite', ['aams']) }}</div>
        </div>
        <div>
          <div class="sharkCode">
            <!-- 邀请码 -->
            <p class="ff-num">{{ sharkCode }}</p>
            <svg-load name="copy" class="img" @click="_copy(sharkCode)"></svg-load>
          </div>
          <div class="shareLink">
            <!-- 推广链接 -->
            <p class="ff-num">{{ shareLink }}{{ sharkCode }}</p>
            <div class="copy-right">
              <p></p>
              <svg-load name="copy" class="img" @click="_copy(`${shareLink}${sharkCode}`)"></svg-load>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 质押挖矿规则弹窗 -->
    <Popup :show="showRule" @handelClose="closePopup" :title="txt" :content="popupContent" :direction="direction">
    </Popup>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import HeaderBar from '@/components/HeaderBar/index.vue'
import QRCode from '@/components/common/QRCode/index.vue'
import Copy from '@/components/common/Copy/index.vue'
import Popup from '@/components/RulePopup/index.vue'
import { useUserStore } from '@/store/user/index'
import { getAgentInfo, getAgentList } from '@/api/plug.js'
import { computed, onMounted, ref } from 'vue'
import { rulesList } from '@/api/common/index'
import { useCopy } from '@/hook/useCopy'
const cuttentRight = {
  iconRight: [{ iconName: 'right-rule', clickTo: '', name: _t18('revenue_rules') }]
}
const useStore = useUserStore()
const userInfo = useStore.userInfo
const sharkCode = userInfo?.user?.activeCode
// const shareLink = `${import.meta.env.VITE_APP_PLANFORM_H5}/#/i&`
const shareLink = `${location.origin}/#/i&`
// 推广中心数据
const showLoading = ref(true)
const teamInfo = ref({})
const teamList = ref([])
const loading = ref(false)
const onRefresh = () => {
  loading.value = true
  getTeamList()
  setTimeout(() => {
    loading.value = false
  }, 500)
}
const teamLists = ref([
  {
    fromId: '21e4545643',
    sumAmount: '324',
    createTime: '2023-09-9-12'
  }
])
const popupContent = ref({})
const getTeamInfo = async () => {
  const res = await getAgentInfo()
  if ((res.code = '200')) {
    teamInfo.value = res.data
  }
}
const getTeamList = async () => {
  showLoading.value = true
  const res = await getAgentList({ params: { leve: curIndex.value + 1 } })
  if ((res.code = '200')) {
    setTimeout(() => {
      showLoading.value = false
      teamList.value = res.data
    }, 500)
  }
}
const getPopupContent = async () => {
  const res = await rulesList('PROMOTION_CENTER_EXPLAIN')
  if ((res.code = '200')) {
    popupContent.value = res.data
  }
}
// const backgroundImage = computed(() => {
//   let temp = `url('/resource/images/${__theme}/plugbg.png') no-repeat center`
//   return temp
// })
onMounted(() => {
  getTeamInfo()
  getTeamList()
  getPopupContent()
})
// const teamInfo = computed(() => {
//   let obj = {}
//   obj = { one: 10, two: 20, three: 30, sum: '60', amount: 10000000 }
//   return obj
// })
const showInvite = ref(false) //邀请弹框
const { _copy } = useCopy()
const showRule = ref(false)
const txt = _t18('plug_rule') //规则
const direction = ref('bottom')
let showPopup = () => {
  showRule.value = true
}
let closePopup = () => {
  showRule.value = false
}
const curIndex = ref(0)
const tabList = computed(() => {
  let list = []
  list = [
    {
      title: _t18('plug_one', ['aams', 'aug']),
      id: 0
    },
    {
      title: _t18('plug_two', ['aams', 'aug']),
      id: 1
    },
    {
      title: _t18('plug_three', ['aams', 'aug']),
      id: 2
    }
  ]
  return list
})
const changeIndex = (v) => {
  console.log('vv---', v)
  curIndex.value = v.name
  teamList.value = []
  getTeamList()
}
</script>

<style lang="scss" scoped>
* {
  color: var(--ex-default-font-color);
  font-size: 14px;
}

.content {
  font-size: 0;
  min-height: 100vh;
  position: relative;

  .img-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .toBack {
    position: absolute;
    margin-top: 30px;
    margin-left: 20px;

    .back {
      font-size: 18px;
    }
  }

  .code_box {
    min-width: 300px;
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 20px;
    background-color: #161a33;
    border-radius: 10px;

    p.code1 {
      font-size: 18px;
      text-align: center;
    }

    p.code2 {
      font-size: 12px;
      text-align: center;
      color: #b5b5b5;
      margin-top: 10px;
    }

    .erweima {
      padding: 20px 0;

      p {
        margin-top: -25px;
        font-size: 20px;
        text-align: center;
        font-weight: bold;
      }
    }

    .link {
      word-break: break-all;
    }
  }
}

.banner {
  .plug-section {
    padding: 16px 16px;

    .plug-header {
      background: var(--ex-default-font-color);
      border-radius: 8px;

      .row-header {
        display: flex;
        align-items: center;
        background: var(--ex-primary-color);
        padding: 15px 14px;
        border-radius: 8px 8px 0 0;

        img {
          width: 17px;
          height: 16px;
        }

        div {
          margin-left: 4px;
          font-size: 16px;
          font-weight: 500;
          color:#fff;
        }
      }

      .row-body {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px;

        div {
          font-size: 12px;
          font-weight: 500;
          color: var(--ex-default-background-color);
        }
      }
    }

    .plug-conter {
      display: grid;
      grid-template-columns: 166px 166px;
      grid-column-gap: 11px;
      grid-row-gap: 11px;
      margin: 14px 0 30px;

      .row-item {
        display: flex;
        justify-content: space-between;
        border-radius: 10px;
        border: 1px solid var(--ex-border-line);
        padding: 18px 14px;

        .row-item-left {
          width: calc(166px - 80px);

          .line {
            width: 18px;
            height: 2px;
            background: var(--ex-text-color);
          }

          .num {
            font-size: 16px;
            font-weight: 600;
            margin: 21px 0 3px;
            word-break: break-all;
          }

          :last-child {
            font-size: 12px;
            font-weight: 500;
            color: var(--ex--home-grid-text-color);
          }
        }

        .row-item-right {
          img {
            width: 44px;
            height: 44px;
          }
        }
      }
    }

    .plug-invite {
      width: 343px;
      height: 54px;
      line-height: 54px;
      text-align: center;
      background: var(--ex-copy-font-color);
      border-radius: 8px;
      color:#fff;
    }
  }
}

.promotion_my {
  .title {
    padding: 0 15px 20px;
    color: var(--ex-font-color6);
    font-weight: bold;
    font-size: 16px;
  }

  .header {
    padding: 15px 15px 10px;
    display: flex;

    &>p:first-child {
      text-align: left;
    }

    &>p:last-child {
      text-align: right;
    }

    p {
      font-size: 12px;
      flex: 1;
      color: var(--ex-passive-font-color);
      text-align: center;
    }
  }

  .contentBox {
    height: 50vh;
    overflow: auto;
  }

  .content {
    padding: 15px 0;
    display: flex;

    &>p:first-child {
      text-align: left;
    }

    &>p:last-child {
      text-align: right;
    }

    p {
      padding: 0 15px;
      font-size: 12px;
      flex: 1;
      text-align: center;
      font-weight: 400;
    }
  }
}

.invite-popup {
  padding: 29px 14px;
  background: #0e1327;
  width: 343px;

  .title {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: var(--ex-input-focus-color);
    margin-bottom: 20px;
  }

  .sharkCode {
    background: var(--ex-backup--background-color);
    border-radius: 8px;
    padding: 15px 16px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .shareLink {
    background: var(--ex-backup--background-color);
    border-radius: 8px;
    padding: 15px 16px;
    line-height: 1.2;
    font-size: 12px;
    word-break: break-all;

    .copy-right {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
  }
}

.van-loading {
  text-align: center;
  padding: 30px;
}

.tabContent,
.van-pull-refresh {
  height: calc(100vh - 70px - 30px);
  overflow: auto;
}

:deep(.van-tabs--card > .van-tabs__wrap) {
  height: 35px;
}

:deep(.van-tabs__nav--card) {
  height: 35px;
}

:deep(.van-tabs) {
  overflow: hidden;
  padding: 0 0 16px;
  background: var(--ex-default-background-color);

  .van-tabs__wrap {
    padding: 0 16px;
  }

  .van-tabs__nav {
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    border-radius: 10px;
    padding: 0;
    background: var(--ex-home-tabs-bg-color);
  }

  .tab-item {
    padding: 9px 20px;
    width: 100%;
    font-size: 14px;
    color: var(--ex-home-tabs-text-color);

    &.atv {
      font-size: 15px;
      color: var(--ex-home-tabs-text-atv-color);
    }
  }

  .van-tab--active {
    background: var(--ex-home-tabs-bg-atv-color);
    color: var(--ex-home-tabs-text-atv-color) !important;
    border-radius: 10px;
  }
}

.banner2 {
  width: 100%;
  padding: 25px 15px 20px;
  text-align: center;

  .bgImg {
    width: 50%;
    margin-top: 60px;
  }

  .plug_bg {
    // border: 3px double var(--ex-primary-color);
    border: 1px solid var(--ex-text-color);
    border-radius: 10px;
    padding: 35px 15px;



    .shareContent {
      width: 100%;
      text-align: left;

      .shareContent_title {
        font-size: 20px;
        color: var(--ex-default-font-color);
      }

      .shareContent_info {
        font-size: 14px;
        color: var(--ex-default-font-color);
        padding: 10px 0 5px;
      }

      .sharkCode,
      .shareLink {
        p {
          line-height: 1.2;
          font-size: 12px;
          word-break: break-all;
          color: var(--ex-default-font-color);
          // word-wrap:break-word;
          // word-break:normal;
        }
      }
    }
  }

  img {
    width: 100%;
    height: auto;
  }

  .teamInfo {
    padding: 15px 0 0;
    display: flex;
    flex-wrap: wrap;

    &>div {
      width: 33.33%;
      padding: 15px 5px;
      text-align: center;

      // flex: 1;
      p {
        height: 30px;
        color: var(--ex-passive-font-color);
        margin-bottom: 15px;
        word-wrap: break-word;
      }

      span {
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
}
</style>
