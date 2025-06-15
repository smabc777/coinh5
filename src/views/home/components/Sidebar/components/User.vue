<template>
  <div class="User">
    <!-- 用户信息  -->
    <div v-if="isSign" class="User-user-inf">
      <logo class="logo" v-if="!showVip"></logo>
      <div class="messLeft" v-if="showVip">
        <image-load filePath="defi/viplogo.png" class="userMessImg"></image-load>
        <p class="fw-num">LV{{ vipClass || 0 }}</p>
      </div>
      <div class="user-item">
        <div class="user-item-con">
          <div v-if="loginName?.length <= 15">
            <svg-load :name="showk ? 'yanjin-k' : 'yanjin-g'" class="yanjing" @click="showk = !showk"></svg-load>
          </div>
          <!-- <p class="user-name">
            {{
              ['vitc'].includes(_getConfig('_APP_ENV'))
                ? loginName
                : _hideAddress(loginName, 5, 4, 3)
            }}
          </p> -->
          <p class="user-name " v-if="['vitc'].includes(_getConfig('_APP_ENV'))">{{ loginName }}</p>
          <p class="user-name" v-else>{{ showk ? loginName : _hideAddress(loginName, 5, 4, 3) }}</p>
        </div>

        <p class="user-uid mb-1">
          <span>{{ _t18('credit_score') }}:{{ credits }}</span>
        </p>
        <div class="user-uid">
          <span>UID:{{ userId }}</span>
          <p @click="toCopy(userId)">{{ _t18('copy') }}</p>
        </div>
      </div>
    </div>
    <!-- 登录/注册 按钮  -->
    <!-- <div v-else class="user-login">
      <div class="user-login-but" @click="_toView('/login')">{{ _t18('login') }}</div>
      <div class="user-login-but" @click="_toView('/register')">{{ _t18('register') }}</div>
    </div> -->
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { useMainStore } from '@/store/index'
import { _getConfig, _hideAddress, _t18, _toView } from '@/utils/public'
import Copy from 'vue-clipboard3'
import { useToast } from '@/hook/useToast'

const userStore = useUserStore()
const mainStore = useMainStore()
const { _toast } = useToast()
const { toClipboard } = Copy()
const showk = ref(false)
// 判断是否登录
const isSign = computed(() => userStore.isSign)
const userId = computed(() => userStore.userInfo.user?.userId)
const credits = computed(() => userStore.detail?.credits)
const loginName = computed(() => userStore.userInfo.user?.loginName)


const showVip = ref(mainStore.getVIPClass?.isOpen)

const userAccount = computed(() => {
  let temp = userStore.asset?.filter((item) => {
    return item.symbol == 'usdt' && item.type == 1
  })
  return temp[0]?.availableAmount || 0
})

const vipClass = computed(() => {
  let temp = 0
  let start = ''
  let end = ''
  for (let key in mainStore.getVIPClass) {
    if (userAccount.value > mainStore.getVIPClass[key]) {
      start = key
    }
    if (userAccount.value <= mainStore.getVIPClass[key]) {
      end = key
      break
    }
  }
  if (start.replace('Start', '') === end.replace('End', '')) {
    temp = start.replace('Start', '').replace('vip', '')
  }
  return temp
})

//复制
const toCopy = async (data) => {
  try {
    await toClipboard(`${data}`)
    _toast('copy_success')
  } catch (e) {
    _toast('copy_error')
  }
}
</script>

<style scoped lang="scss">
.User {
  display: flex;
  padding: 0 18px;
  align-items: center;

  .User-user-inf {
    //align-items: center;
    display: flex;

    .logo {
      width: 56px;
      height: 56px;
      margin-right: 10px;
      //border-radius: 10px;
    }

    .userMessImg {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .user-item {
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .user-name {
        word-break: break-all;
        font-size: 14px;
        // margin-bottom: 10px;
      }

      .mb-1 {
        margin-bottom: 5px;
      }

      .user-uid {
        word-break: break-all;
        color: var(--ex-font-color18);
        display: flex;
        align-items: center;

        p {
          margin-left: 6px;
          padding: 0 2px;
          min-width: 34px;
          min-height: 18px;
          border-radius: 4px;
          border: 1px solid #9576ff;
          font-size: 12px;
          color: var(--ex-text-color);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .user-login {
    width: 100%;
    display: flex;

    .user-login-but {
      padding: 10px 20px;
      background: var(--ex-trade-buy-bg-color);
      border-radius: 8px;
      font-size: 14px;
      margin-right: 20px;
      color: #fff;
    }
  }
}

.messLeft {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  p {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    color: #9324ff;
  }
}

.user-item-con {
  display: flex;
  align-items: center;

  .yanjing {
    font-size: 14px;
    margin-right: 5px;
  }
}
</style>
