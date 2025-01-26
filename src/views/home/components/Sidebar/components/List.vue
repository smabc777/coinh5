<template>
  <div class="list">
    <div class="list-item" v-for="(item, index) in SidebarList" :key="index" @click="toView(item)">
      <div class="list-item-left">
        <image-load :filePath="item.logoUrl" alt="" class="itemImg" />
        <div>
          <span v-if="item.key == 'language'">{{ _t18(`language_key`) }}</span>
          <span v-else-if="['primary'].includes(item.key)">{{ _t18(`sidebar_${item.key}`, ['smartfund', 'moonex'])
            }}</span>
          <span v-else-if="['advanced'].includes(item.key)">{{
      _t18(`sidebar_${item.key}`, ['smartfund', 'vitc', 'moonex']) }}</span>
          <span v-else-if="['certified'].includes(item.key)">{{ _t18(`sidebar_${item.key}`, ['moonex']) }}</span>
          <span v-else-if="['termsService'].includes(item.key)">{{ _t18(`sidebar_${item.key}`, ['moonex']) }}</span>
          <span v-else>{{ _t18(`sidebar_${item.key}`) }}</span>
        </div>
      </div>
      <div v-if="_getConfig('_APP_ENV').includes('bydfe') && userStore.isSign && !userStore.userInfo.addressFlag">
        <span v-if="item.key == 'advanced'">{{ statusAdvanced }}</span>
        <span v-if="item.key == 'primary'">{{ statusPrimary }}</span>
      </div>
      <van-icon name="arrow" size="14px" />
    </div>
    <!--  退出登录  -->
    <div class="list-item" v-if="userStore.isSign && !userStore.userInfo.addressFlag" @click="loginOut">
      <div class="list-item-left">
        <image-load filePath="log-out.png" class="itemImg" />
        <div>
          <span>{{ _t18('layout', ['vitc','moonex']) }}</span>
        </div>
      </div>
      <van-icon name="arrow" size="14px" />
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '@/store/index'
import { useUserStore } from "@/store/user";
import { _getConfig, _t18, _toReplace, _toView } from "@/utils/public";
import { useToast } from "@/hook/useToast";
import { getWhitePaperUrl } from "@/api/common";
import { signOut } from "@/api/user";
import { showConfirmDialog } from "vant";

const mainStore = useMainStore()
const userStore = useUserStore()
const { _toast, _showName } = useToast()

// 侧边栏数据
const SidebarList = computed(() => {
  console.log(mainStore.getSidebarList)
  let arr = mainStore.getSidebarList?.filter(item => item.isOpen)
  return arr;
})


//认证状态
// const statusPrimary = computed(() => {
//   let temp = ''
//   if (userStore.detail.auditStatusPrimary == null) {
//     temp = _t18('please_primary')
//   } else if (userStore.detail.auditStatusPrimary == 1) {
//     temp = _t18('verified_ok')
//   } else if (userStore.detail.auditStatusPrimary == 3) {
//     temp = _t18('under_review')
//   }
//   return temp
// })
const statusPrimary = computed(() => {
  let temp = ''
  if (userStore.detail.auditStatusPrimary == 1) {
    temp = _t18('verified_ok')
  } else {
    temp = _t18('no_audit', 'bydfe')
  }
  return temp
})
const statusAdvanced = computed(() => {
  let temp = ''
  if (userStore.detail.auditStatusAdvanced == 1) {
    temp = _t18('verified_ok')
  } else {
    temp = _t18('no_audit', 'bydfe')
  }
  return temp
})



const paperUrl = ref('')
//获取白皮书URL
const getWhitePaper = async () => {
  const res = await getWhitePaperUrl()
  // return res.data?.url || ''
  paperUrl.value = res.data.url
}

//退出登录
const loginOut = () => {

  // 二次确认弹窗
  showConfirmDialog({
    teleport: '.home-sidebar-loginOut',
    className: 'loginOut-dialog',
    title: '',
    message: _showName('layout_require'),
    confirmButtonText: _showName('btnConfirm'),
    cancelButtonText: _showName('cancel'),
  })
    .then(async () => {
      const res = await signOut({}, true)
      _toast('layout_success')
      // 清除token
      userStore.signOut()
      _toReplace('/')
      setTimeout(() => location.reload(), 10)
    })
    .catch(() => {
      // on cancel
    });
}

//跳转逻辑
const toView = async (item) => {

  // 跳转外链
  /* if (item.jumpType == 'link' && (item.key == 'paper' || item.key == 'aboutUS')) {
    // const url = await getWhitePaper()
    await getWhitePaper()
    // return (window.open(url))
    setTimeout(()=>{
      window.open(paperUrl.value)
    },500)

  } */
  if (item.jumpType == 'link' && (item.jumpUrl == '/')) {
    // const url = await getWhitePaper()
    await getWhitePaper()
    // return (window.open(url))
    setTimeout(() => {
      window.open(paperUrl.value)
    }, 500)

  } else if (item.jumpType == 'link' && item.key != 'home_service') {
    if (item.key == 'paper' && ['vitc'].includes(_getConfig('_APP_ENV'))) {
      window.open(`https://preview.mq689.xyz/preview?url=${item.jumpUrl}`)
    } else {
      window.open(item.jumpUrl)
    }
  }
  // 不是路由跳转---返回
  if (item.jumpType != 'path') return false

  //在实名认证---判断
  if (item.key == 'advanced') {
    /**
     * 在实名认证的时候
     1. 先判断初级认证是否打开  如果是false  就不需要初级认证    直接放行
     2.如果初级认证是true  在判断用户的初级认证状态是否等于1  如果是1 放行
     *
     */
    const target = SidebarList.value.find((item) => item.key == 'primary')

    //jphskt平台取消初级认证判断
    if (['jphskt'].includes(_getConfig('_APP_ENV'))) {
      return (_toView(item.jumpUrl))
    }

    if (target && target.isOpen) {
      const auditStatusPrimary = userStore.detail.auditStatusPrimary
      // if (auditStatusPrimary && auditStatusPrimary == 1) {
      _toView(item.jumpUrl)
      // } else {
      //   _toast('please_primary')
      // }
      return false
    }
  }

  _toView(item.jumpUrl)

}
</script>

<style scoped lang="scss">
.list {
  padding-top: 30px;
  padding-bottom: 20px;

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;

    .list-item-left {
      display: flex;
      align-items: center;

      .itemImg {
        width: 20px;
        height: 20px;
        margin-right: 12px;
      }

      span {
        font-size: 14px;
        color: var(--ex-font-color13);
      }

    }

  }

}
</style>
