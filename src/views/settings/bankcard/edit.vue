<!-- 编辑银行卡 -->
<template>
  <div class="bind-card">
    <!-- 导航条 -->
    <HeaderBar :currentName="_t18('Bank_edit')" :cuttentRight="cuttentRight" :border_bottom="true" @del="del">
    </HeaderBar>
    <!--内容-->
    <div class="content">
      <div class="form" v-if="['cmmetrics'].includes(_getConfig('_APP_ENV'))">
        <div class="formInput">
          <p class="label">{{ _t18('stock86') }}<span class="info" v-if="showInfo1">（*{{ _t18('required') }}）</span></p>
          <input :placeholder="_t18('login_please')" v-model="formData.nome" class="form-input" />
        </div>
        <div class="formInput">
          <p class="label">{{ _t18('stock85') }}<span class="info" v-if="showInfo2">（*{{ _t18('required') }}）</span></p>
          <input :placeholder="_t18('login_please')" v-model="formData.chavePix" class="form-input" />
        </div>
        <div class="formInput">
          <p class="label">
            {{ _t18('Bank_own') }}<span class="info" v-if="showInfo3">（*{{ _t18('required') }}）</span>
          </p>
          <input :placeholder="_t18('stock87')" v-model="formData.bankName" class="form-input" />
        </div>
        <div class="formInput">

          <p class="label">{{ _t18('stock88') }}<span class="info" v-if="showInfo4">（*{{ _t18('required') }}）</span></p>
          <input :placeholder="_t18('login_please')" v-model="formData.cpf" class="form-input" />
        </div>

      </div>
      <div class="form" v-else>
        <div class="formInput">
          <p class="label">{{ _t18('payee_name') }}</p>
          <input :placeholder="_t18('login_please')" v-model="bindUserName" class="form-input" />
        </div>
        <div class="formInput">
          <p class="label" v-if="['jphskt'].includes(_getConfig('_APP_ENV'))">
            {{ _t18('bank_account') }}
          </p>
          <p class="label" v-else>{{ _t18('Bank_card_number') }}</p>
          <input :placeholder="_t18('login_please')" v-model="formData.cardNumber" class="form-input" />
        </div>
        <div class="formInput">
          <p class="label" v-if="['jphskt'].includes(_getConfig('_APP_ENV'))">
            {{ _t18('bank_name') }}
          </p>
          <p class="label" v-else>
            {{ _t18('Bank_own') }}
          </p>
          <input :placeholder="_t18('login_please')" v-model="formData.bankName" class="form-input" />
        </div>
        <div class="formInput" v-if="formData.bankBranch">
          <p class="label" v-if="['jphskt'].includes(_getConfig('_APP_ENV'))">
            {{ _t18('branch_namee') }}
          </p>
          <p class="label" v-else>{{ _t18('branch_name') }}</p>
          <input :placeholder="_t18('login_please')" v-model="formData.bankBranch" class="form-input" />
        </div>
        <!-- hfm2 币种选择-->
        <!-- <div class="formInput" v-if="['hfm2', 'dev'].includes(_getConfig('_APP_ENV'))">
          <p class="label">
            {{ _t18('recharge_coin') }}
          </p> -->
        <!-- <van-field
            class="form-input"
            is-link
            readonly
            v-model="formData.coin"
            :placeholder="_t18('recharge_coin')"
            @click="showCoinPicker = true"
          /> -->
        <!-- <input
            :placeholder="_t18('recharge_coin')"
            v-model="formData.coin"
            class="form-input"
            @click="showCoinPicker = true"
          />
          <van-action-sheet
            v-model:show="showCoinPicker"
            :actions="bankCoinList"
            @select="onBankCoinConfirm"
          />
        </div> -->
      </div>
      <div class="btnBox" @click="submit">
        <ButtonBar :btnValue="_t18('Bank_save')" />
      </div>
    </div>
  </div>
</template>
<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { showConfirmDialog, showToast } from 'vant'
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { delBindCard, updateBindCard } from '@/api/account'
import { _toView, _t18, _getConfig } from '@/utils/public'
import { useToast } from '@/hook/useToast'
import { useUserStore } from '@/store/user/index'
import { dict } from '@/api/common/index.js'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
// userStore.getUserInfo()
// 用户信息
const { userInfo } = storeToRefs(userStore)
const { _toast, _showName } = useToast()
const Route = useRoute()
const Router = useRouter()
// const formData = reactive({
//   bankAddress: '美国花旗银行',
//   bankBranch: '华盛顿支行',
//   bankName: '储蓄卡',
//   cardNumber: '78910',
//   id: 6,
//   userName: '张三'
// })
const showInfo1 = ref(false)
const showInfo2 = ref(false)
const showInfo3 = ref(false)
const showInfo4 = ref(false)
const formData = reactive(JSON.parse(decodeURI(Route.query.data)))
console.log(formData)
const bindUserName = ref(formData.userName || userInfo.value.user?.loginName)
const cuttentRight = { iconRight: [{ name: _t18('quote_del'), clickTo: 'del' }] }
const del = () => {
  showConfirmDialog({
    className: 'showConfirmDialogContent',
    confirmButtonText: _showName('confirm'),
    cancelButtonText: _showName('cancel'),
    message: _showName('Bank_delete')
  }).then(() => {
    delBindCard(formData.id).then((res) => {
      if (res.code == '200') {
        // showToast('删除成功！')
        _toast('Bank_delete_success')
        setTimeout(() => {
          Router.push('/bind-card')
        }, 500)
      } else {
        showToast(msg)
      }
    })
  })
}

// 币种列表
const bankCoinList = ref([])
const showCoinPicker = ref(false)
const getBankCoinList = () => {
  dict('t_bank_coin').then((res) => {
    if (res.code == '200' && res.data.length) {
      bankCoinList.value = res.data.map((item) => {
        return { ...item, name: item.dictValue.toUpperCase() }
      })
    }
  })
}
//币种选择
const onBankCoinConfirm = (item) => {
  formData.coin = item.name
  showCoinPicker.value = false
}

onMounted(() => {
  getBankCoinList()
})
const submit = () => {
  if (!formData.nome) {
    // showToast('请填写银行卡号')
    _toast('Bank_please_cardName')
    showInfo1.value = true
    return
  }
  if (!formData.chavePix) {
    // showToast('请填写银行名称')
    _toast(_showName('login_please_verification_code') + _showName('stock85'))
    showInfo2.value = true
    return
  }
  if (formData.bankName == '') {
    // showToast('请填写银行名称')
    _toast(_showName('login_please_verification_code') + _showName('stock87'))

    showInfo3.value = true
    return
  }
  if (!formData.cpf) {
    _toast(_showName('login_please_verification_code') + _showName('stock88'))

    showInfo4.value = true

    return
  }
  updateBindCard(formData).then((res) => {
    if (res.code == '200') {
      // showToast('修改成功！')
      _toast('Bank_update_success')
      setTimeout(() => {
        Router.push('/bind-card')
      }, 500)
    } else {
      showToast(msg)
    }
  })
}
</script>
<style lang="scss" scoped>
* {
  font-size: 16px;
  color: var(--ex-default-font-color);
}

.showConfirmDialogContent {
  color: var(--ex-default-font-color);
}

.header {
  display: flex;

  .title {
    margin-left: 10px;
  }
}

.content {
  margin-top: 10px;
  padding: 0 15px;

  .tip {
    font-size: 12px;
    color: var(--ex-font-color3);
    margin-bottom: 30px;
  }

  .form {
    padding-top: 5px;

    .formInput {
      margin-top: 20px;

      .label {
        min-width: 80px;
        font-size: 14px;
        color: var(--ex-input-label-color2);
        text-align: left;
        margin-bottom: 10px;
        margin-left: 5px;

        .scl {
          color: var(--ex-font-color11);
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
        border: 1px solid rgba(0, 0, 0, 0);

        &::placeholder {
          color: var(--ex-input-font-color2);
        }
      }

      /* 焦点状态样式 */
      input:focus {
        border: 1px solid var(--ex-input-focus-color);
        outline: none;

        /* 防止点击时出现默认的浏览器外观 */
        &::placeholder {
          color: var(--ex-white);
        }
      }

      :deep(.van-cell) {
        border: 1px solid var(--ex-bindcard-input-border-color);
        height: 46px;
        padding: 0 15px;
        display: flex;
        align-items: center;

        &::placeholder {
          color: var(--ex-bindcard-input-font-color);
          font-size: 14px;
        }
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

.info {
  font-size: 12px;
  color: var(--ex-tip-font-color);
  padding-left: 5px;
}
</style>
