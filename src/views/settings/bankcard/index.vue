<!-- 绑定银行卡 -->
<template>
  <div class="bind-card">
    <!-- 导航条 -->
    <HeaderBar :currentName="_t18('sidebar_bank')"
     :cuttentRight="cuttentRight" :backTo="'/'">
    </HeaderBar>
    <!--内容-->
    <van-overlay
      :show="showLoading"
      z-index="100"
      :custom-style="{ background: 'rgba(0, 0, 0, .6)' }"
    >
      <div style="position: fixed; top: 30%; left: 50%; transform: translate(-50%, -50%)">
        <van-loading vertical color="var(--van-primary-color)"
          >{{ _t18('loading') }}...</van-loading
        >
      </div>
    </van-overlay>
    <div class="content">
        <div v-if="bankList.length > 0">
          <BankItem :bankList="bankList"></BankItem>
        </div>
        <div v-else class="bindcard">
          <img src="@/assets/defi/notbind.png" alt="" />
          <!-- <div class="bind-text">{{ _t18('Unbound_bank_card') }}</div> -->
        </div>

        <div class="btnBox" @click="_toView('/add-bank')">
          <ButtonBar :btnValue="`+ ${_t18('add_bank_card')}`" />
        </div>
      </div>
  </div>
</template>
<script setup>
import { getBindCardList, bindCardSubmit } from '@/api/account.js'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import BankItem from '../components/BankItem.vue'
import { ref, reactive, onMounted } from 'vue'
import HeaderBar from '@/components/HeaderBar/index.vue'
import { _t18, _toView } from '@/utils/public'
import { useToast } from '@/hook/useToast'

const { _toast } = useToast()

const showLoading = ref(true)
const bankList = ref([])
const bindcard = ref(false)
const cuttentRight = { iconRight: [{ iconName: 'kefu',iconSize:'20px',  clickTo: 'event_serviceChange' }] }
const add = () => {
  bindcard.value = true
}
const getCardList = async () => {
  const res = await getBindCardList()
  if (res.code == '200') {
    if (res.data.length > 0) {
      bindcard.value = false
      bankList.value = res.data
    }
  }
  setTimeout(() => {
    showLoading.value = false
  }, 200)
}



onMounted(() => {
  getCardList()
})

</script>
<style lang="scss" scoped>
.content {
  padding: 10px 15px 40px;

  .tip {
    font-size: 12px;
    color: var(--ex-tip-font-color);
    margin-bottom: 30px;
  }

  .form {
    .formInput {
      margin-bottom: 24px;

      .label {
        color: var(--ex-input-label-color2);
        font-size: 14px;
        margin: 0 0 10px 5px;

        .scl {
          color: var(--ex-font-color19);
          // padding-left: 5px;
        }

        .info {
          font-size: 12px;
          color: var(--ex-tip-font-color);
          padding-left: 5px;
        }

        .required {
          color: var(--ex-default-font-color);
          padding-left: 2px;
        }
      }

      input {
        padding: 0 14px;
        width: 100%;
        height: 46px;
        font-size: 14px;
        border-radius: 8px;
        background: var(--ex-input-background-color);

        &::placeholder {
          color: var(--ex-input-font-color2);
        }
      }
      /* 焦点状态样式 */
      input:focus {
        border: 1px solid var(--ex-input-focus-color);
        outline: none; /* 防止点击时出现默认的浏览器外观 */
        &::placeholder {
          color: var(--ex-white);
        }
      }
      :deep(.van-cell) {
        background: var(--ex-div-bgColor20);
        height: 46px;
        padding: 0 15px;
        display: flex;
        align-items: center;
        &::placeholder {
          color: var(--ex-bindcard-input-font-color);
          font-size: 14px;
        }
      }
      .van-cell:after {
        border: 0;
      }
      :deep(.van-action-sheet__content) {
        background: var(--ex-default-background-color) !important;
      }
      :deep(.van-action-sheet__item) {
        background: var(--ex-default-background-color) !important;
        color: var(--ex-default-font-color);
      }
    }
  }

  // .btn {
  //   font-size: 14px;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   height: 50px;
  //  background: var(--ex-div-bgColor1)
  //   border-radius: 3px;
  //   color: var(--ex-font-color);
  //   margin: 50px 0;
  // }
  .btnBox {
    margin-top: 50px;
  }
}

.bindcard {
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 130px;
    height: 167px;
    margin: 100px 0 50px 0;
  }

  .bind-text {
    font-size: 14px;
    color: var(--ex-passive-font-color);
    text-align: center;
  }

  .btnBox {
    width: 100%;
    margin-top: 30px;
  }

  // .add {
  //   position: fixed;
  //   bottom: 50px;
  //   width: 92%;
  //   font-size: 14px;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   height: 50px;
  //  background: var(--ex-div-bgColor1)
  //   border-radius: 3px;
  //   color: var(--ex-font-color);
  //   margin: 50px 0;
  // }
}
</style>
