<template>
  <!-- 追加合约本金 -->
  <PublicPopup :show="showContractTwo"
               teleport="#app"
               position="absolute"
               :direction="`bottom`"
               :width="'var(--ex-max-width)'"
               @handelClose="showContractTwoClose">
    <template #titleCustomize>
      <div></div>
      <!-- 追加合约保证金 -->
      <div class="popupTitle">{{ _t18(`Add_principal`) }}</div>
    </template>
    <template #contentCustomize>
      <div class="popupInput marginStop">
        <!-- 请输入 -->
        <input
            type="number"
            class="input"
            v-model.trim="PositionAmout"
            :placeholder="_t18(`exchange.input`)"
        />
        <div>USDT</div>
      </div>
      <div class="determine">
        <!-- 确定 -->
        <div class="determinebtn" @click="adjustAmout">
          {{ _t18(`btnConfirm`, ['bitmake']) }}
        </div>
      </div>
    </template>
  </PublicPopup>

</template>
<script setup>
import PublicPopup from '@/components/Popup/public.vue'
import {_t18} from "@/utils/public";
import {computed, ref, watch, inject} from "vue";
import {useTradeStore} from "@/store/trade";
import {showToast} from "vant";
import {adjustPositionAmout, adjustPositionMargn} from "@/api/trade";

const tradeStore = useTradeStore()
//更新tab角标数量
const getOrderListNumber = inject('getOrderListNumber')
//刷新父订单
const refreshOrder = inject('refreshOrder')

//数据
const showContractTwo = ref(false)
const recordListItem = ref({})
const availableBalance = ref(0)
const PositionAmout = ref('') //追加金额

//初始化
const ContractTwoPopupInit = (item, availableBalances) => {
  PositionAmout.value = ''
  recordListItem.value = item
  availableBalance.value = availableBalances
  showContractTwo.value = true
}

defineExpose({
  ContractTwoPopupInit
})

const showContractTwoClose = () => {
  showContractTwo.value = false
}

//确定
const adjustAmout = () => {
  let data = {
    id: recordListItem.value.id,
    money: PositionAmout.value
  }
  adjustPositionAmout(data,{loading:true}).then((res) => {
    if (res.code == 200) {
      showContractTwo.value = false
      showToast(res.msg)
      refreshOrder()
      getOrderListNumber()
    } else {
      _toast('Insufficient_balance')
      showContractTwo.value = false
    }
  })
}


</script>
<style scoped lang="scss">

.popupTitle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  color: var(--ex-default-font-color);
}

.popupSelect {
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: var(--ex-passive-font-color);

  .selectItem {
    //flex: 1;
    width: 49%;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: var(--ex--backup-background-color-2);
  }

  .selectHight {
    color: var(--ex-font-color);
    background: var(--ex-trade-buy-bg-color);

  }
}

.popupInput {
  margin-top: 20px;
  height: 50px;
  background: var(--ex-default-background-color);
  border-radius: 6px;
  border: 1px solid var(--ex-border-color2);
  color: var(--ex-default-font-color);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;

  .input {
    width: 100%;
    color: var(--ex-default-font-color);
    margin-right: 10px;
    background: var(--ex-default-background-color);
  }

  input::-webkit-input-placeholder {
    color: var(--ex-font-color1);
  }

  input::-moz-input-placeholder {
    color: var(--ex-font-color1);
  }

  input::-ms-input-placeholder {
    color: var(--ex-font-color1);
  }
}

.rightFourth {
  margin-top: 20px;
  width: 100%;
  position: relative;

  .lineBg {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .node {
      width: 11px;
      height: 11px;
      background: var(--ex-div-bgColor3);
      margin-top: -5px;
      transform: rotate(45deg);
      position: relative;
    }

    .active {
      background: var(--ex-div-bgColor4);
    }
  }

  .numList {
    position: absolute;
    width: 100%;
    top: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .nodeNuber {
      display: flex;
      margin-top: 10px;
      font-size: 12px;
      font-weight: 500;
      color: var(--ex-default-font-color);
    }

    .nodeNuber:nth-child(2) {
      margin-left: 15px;
    }

    .nodeNuber:nth-child(3) {
      margin-left: 15px;
    }

    .nodeNuber:nth-child(4) {
      margin-left: 15px;
    }
  }

  .init {
    .initimg {
      width: 12px;
      height: 12px;
      background: var(--ex-div-bgColor4);
      transform: scaleY(0.5) rotate(45deg) !important;
      position: relative;
    }
  }
}

.popupLr {
  margin-top: 45px;
  display: flex;
  font-size: 14px;
  color: var(--ex-passive-font-color);

  .popupLrNum {
    margin-left: 10px;
    color: var(--ex-default-font-color);
  }
}

.popMargin {
  margin-top: 20px;
}

.determine {
  margin: 50px 0 30px;

  .determinebtn {
    height: 50px;
    background: var(--ex-trade-buy-bg-color);
    border-radius: 6px;
    font-size: 16px;
    color: var(--ex-font-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.popupName {
  margin-top: 20px;
  font-size: 14px;
  color: var(--ex-default-font-color);
}

.marginStop {
  margin-top: 10px !important;
}

.disableStop {
  background: var(--ex-div-bgColor5);
  border: none;

  .disableName {
    font-size: 14px;
    color: var(--ex-passive-font-color);
  }
}

.stopText {
  margin-top: 10px;
  display: flex;
  font-size: 14px;
  color: var(--ex-passive-font-color);

  .popupLrNum {
    margin-left: 10px;
    color: var(--ex-default-font-color);
  }
}

.stopBottom {
  margin-top: 20px;
  font-size: 12px;
  color: var(--ex-passive-font-color);
  line-height: 20px;

  .stopBottomSpan {
    color: var(--ex-default-font-color);
  }
}

.count_down {
  font-size: 12px;
}
</style>
