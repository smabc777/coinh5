<script setup>
import {computed, ref} from 'vue'
import {_back, _t18, _toReplace} from "@/utils/public";
import { useUserStore } from '@/store/user/index'
import {storeToRefs} from "pinia";
import {switchAccount} from "@/api/user";
import {showConfirmDialog, showToast} from "vant";
const userStore = useUserStore()
import { _WebSocket } from '@/plugin/socket/index.js'
import { useToast } from "@/hook/useToast";
import {IS_HAS_SIMULATE} from "@/config";
const { _toast,_showName } = useToast()

const props = defineProps({
  // 资产类型
  type: {
    type: Number
  }
})

// 判断是否有平台资产
function isAssets() {
  const { asset } = storeToRefs(userStore)
  const total = asset.value.filter(e => e.type === props.type).reduce((sum, e) => sum + e.exchageAmount, 0)
  return total > 0
}

// 判断是否模拟交易
const isSimulate = computed(() => {
  return userStore.isSimulate
})

const switchType = () =>{
  showConfirmDialog({
    width:'380px',
    message: _showName('confirm_start_simulated_trade'),
    confirmButtonText: _showName('btnConfirm'),
    cancelButtonText: _showName('cancel')
  }).then(() => {
    switchAccount(2).then(async res=>{
      if (res.code === 200) {
        _toast('enter_simulated_trade')
        //切换成功
        await userStore.getUserInfo()
        userStore.setSimulate(true)
        _WebSocket && _WebSocket.reconnect()
        _toReplace('/')
        // setTimeout(() => {
        //   location.reload()
        // }, 100)
      } else {
        showToast(res.msg)
      }
    })
  })
}
</script>

<template>
  <!-- 无资产，可开启模拟交易-->
  <template v-if="IS_HAS_SIMULATE.includes(_getConfig('_APP_ENV'))&&!isAssets()&&!isSimulate">
    <div class="tips">
      <div class="fw-bold tips_nozc">{{_t18('trading_account_no_assets')}}</div>
      <div class="tips_smn">{{_t18('try_simulated_trade')}}</div>
    </div>
    <!-- 开启模拟交易-->
    <div class="start_sim" @click="switchType">
      <div class="start_btn">{{_t18('start_simulated_trade')}}</div>
    </div>
  </template>
</template>

<style scoped lang="scss">
.tips{
  padding: 50px 0 80px;
  text-align: center;
  .tips_nozc{
    font-size: 16px;
    color: var(--ex-default-font-color-deep2);
  }
  .tips_smn{
    margin-top: 13px;
    font-size: 13px;
    color: var(--ex-default-font-color-light);
  }
}

.start_sim{
  width: 100%;
  position: fixed;
  bottom: 64px;
  height: 74px;
  background-color: var(--ex-default-background-color);
  z-index: 9999;
  padding: 0 15px;
  //text-align:center;
  //display: flex;
  //align-items: center;
  //justify-content: center;
  .start_btn{
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 345px;
    height: 50px;
    font-size: 16px;
    color: var(--ex-default-font-color);
    border-radius: 3px 3px 3px 3px;
    background: var(--ex-primary-color);
  }
}
</style>
