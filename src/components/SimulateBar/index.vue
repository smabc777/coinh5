<script setup>
import {switchAccount} from "@/api/user";
import {showConfirmDialog, showToast} from "vant";
import {useUserStore} from '@/store/user'
const userStore = useUserStore()
import { _WebSocket } from '@/plugin/socket/index.js'
import {_toReplace} from "@/utils/public";
import { useToast } from "@/hook/useToast";
const { _toast,_showName } = useToast()

const quitSimulate  = () =>{
  showConfirmDialog({
    width:'380px',
    message: _showName('confirm_quit_simulated_trade'),
    confirmButtonText: _showName('btnConfirm'),
    cancelButtonText: _showName('cancel')
  }).then(() => {
    switchAccount(1).then(async res=>{
      if (res.code === 200) {
        _toast('quit_simulated_trade')
        //退出成功
        await userStore.getUserInfo()
        userStore.setSimulate(false)
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
  <div class="top">
    <div class="tradeType">{{ _t18('simulated_trade') }}</div>
    <div class="quit" @click="quitSimulate">{{ _t18('quit') }}</div>
  </div>

</template>

<style scoped lang="scss">
.top{
  height: 52px;
  background: var(--ex-default-bgcolor);
  border-radius: 5px;
  padding: 15px;
  display: flex;
  align-items: center;
  .tradeType{
    font-weight: 500;
    font-size: 16px;
    font-family: Arial, sans-serif;
  }
  .quit{
    margin-left: 6px;
    padding: 2px 6px;
    background: var(--ex-primary-color);
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--ex-default-reverse-font-color);
  }
}
</style>
