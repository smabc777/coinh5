<template>
  <!-- 冻结弹窗 -->
  <div class="freezePopup">
    <van-dialog
        v-model:show="show"
        :title="_t18('notify')"
        theme="round-button"
        confirmButtonColor="var(--ex-primary-color)"
        :confirmButtonText="_t18('btnConfirm')"
        @confirm="confirmFreezeDialog"
        :before-close="beforeClose"
    >
      <slot name="content">
        <div class="id" v-if="['dev'].includes(_getConfig('_APP_ENV'))">
          ID: {{ userStore.userInfo.user?.userId }}
        </div>
        <div class="tips" v-html="freezeMessage"></div>
      </slot>
    </van-dialog>
  </div>

</template>
<script setup>

import {_getConfig, _t18} from "@/utils/public";
import {dispatchCustomEvent} from "@/utils";
import {DIFF_ISFREEZE, DIFF_ISFREEZE_SECONDANDBB} from "@/config";
import {rulesList} from "@/api/common";
import {useToast} from '@/hook/useToast'
import {useUserStore} from "@/store/user";

const {_toast, _showName} = useToast()
const userStore = useUserStore()

//显示
const show = ref(false)
const setSreezePopupShow = () => {
  show.value = true
  judgeLangFreezeMessage()
}

// 获取数据
const freezeMessage = ref('')
const judgeLangFreezeMessage = async () => {

  if (['rxce'].includes(__config._APP_ENV)) {
    return freezeMessage.value = _showName('account_frozen_info')
  } else if (['coinomivip'].includes(__config._APP_ENV)) {
    const res = await rulesList('FREEZE_PROMPT')
    if (res.code === 200) {
      if (Array.isArray(res.data) && res.data.length) {
        return freezeMessage.value = res.data[0].content
      }
    }
  }

  freezeMessage.value = _showName('account_frozen')
}

//暴露弹窗设置方法
defineExpose({setSreezePopupShow})

//确定
const confirmFreezeDialog = () => {
  show.value = false
  //触发客服弹窗
  dispatchCustomEvent('event_serviceChange')
}

//关闭
const beforeClose = () => {

  // 是否阻止关闭
  return new Promise((resolve) => {
    if (DIFF_ISFREEZE.includes(__config._APP_ENV) || DIFF_ISFREEZE_SECONDANDBB.includes(__config._APP_ENV)) {
      resolve(true);
    } else {
      resolve(false);
    }
  })

}


</script>

<style scoped lang="scss">
.freezePopup {
  :deep(.van-popup ) {
    .van-action-bar {
      background: var(--ex-default-background-color);
    }

    .van-dialog__header {
      color: var(--ex-default-font-color);
    }
  }

  .id {
    color: var(--ex-default-font-color);
    text-align: center;
    padding-top: 8px;
  }

  .tips {
    color: var(--ex-default-font-color);
    text-align: center;
    padding: 8px 24px 16px;
  }
}
</style>
