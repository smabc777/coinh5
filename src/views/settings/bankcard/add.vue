<!-- 绑定银行卡 -->
<template>
  <div class="bind-card">
    <!-- 导航条 -->
    <HeaderBar :currentName="_t18('sidebar_bank')" :cuttentRight="cuttentRight">
    </HeaderBar>
    <!--内容-->
    <div class="content">

      <div>
        <!-- <strong class="tip">{{ _t18('bindCard_txt') }}</strong> -->

        <div class="form" v-if="!['cmmetrics'].includes(_getConfig('_APP_ENV'))">
          <!-- 收款人姓名 -->
          <div class="formInput">
            <p class="label">
              {{
                _t18('payee_name')
              }}<span class="info" v-if="showInfo1">（*{{ _t18('required') }}）</span>
            </p>
            <input :placeholder="_t18('login_please')" v-model="formData.userName" class="form-input" />
          </div>
          <!-- 银行名 -->
          <div class="formInput">
            <p class="label">
              {{
                _t18('bank_name')
              }}<span class="info" v-if="showInfo2">（*{{ _t18('required') }}）</span>
            </p>
            <input :placeholder="_t18('login_please')" v-model="formData.bankName" class="form-input" />
          </div>
          <!-- 账户-->
          <div class="formInput">
            <p class="label">
              {{
                _t18('bank_account')
              }}<span class="info" v-if="showInfo1">（*{{ _t18('required') }}）</span>
            </p>
            <input :placeholder="_t18('login_please')" v-model="formData.cardNumber" class="form-input" />
          </div>

          <div class="formInput">
            <p class="label">{{ _t18('branch_namee') }}</p>
            <input :placeholder="_t18('login_please')" v-model="formData.bankBranch" class="form-input" />
          </div>
          <div class="formInput">
            <p class="label">
              {{ _t18('branch_number') }}
            </p>
            <input :placeholder="_t18('login_please')" v-model="formData.bankAddress" class="form-input" />
          </div>
        </div>

        <div class="form" v-else>
          <!-- <div class="formInput">
            <p class="label">开户人</p>
            <input placeholder="请输入" v-model="formData.userName" class="form-input" />
          </div> -->
          <div class="formInput">
            <p class="label">
              {{ _t18('stock86') }}<span class="info" v-if="showInfo1">（*{{ _t18('required') }}）</span>
            </p>
            <input :placeholder="_t18('login_please')" v-model="formData.nome" class="form-input" />
          </div>
          <div class="formInput">
            <p class="label">
              {{
                _t18('stock85')
              }}<span class="info" v-if="showInfo2">（*{{ _t18('required') }}）</span>
            </p>
            <input :placeholder="_t18('login_please')" v-model="formData.chavePix" class="form-input" />
          </div>
          <div class="formInput">
            <p class="label">
              {{
                _t18('stock87')
              }}<span class="info" v-if="showInfo3">（*{{ _t18('required') }}）</span>
            </p>
            <input :placeholder="_t18('login_please')" v-model="formData.bankName" class="form-input" />
          </div>

          <div class="formInput">
            <p class="label">
              {{
                _t18('stock88')
              }} (CPF)<span class="info" v-if="showInfo4">（*{{ _t18('required') }}）</span>
            </p>
            <input :placeholder="_t18('login_please')" v-model="formData.cpf" class="form-input" />
          </div>


          <!-- hfm2 币种选择-->
          <!-- <div class="formInput" v-if="['hfm2', 'dev'].includes(_getConfig('_APP_ENV'))">
            <p class="label">
              {{ _t18('recharge_coin') }}<span class="scl">（{{ _t18('optional') }}）</span>
            </p> -->
          <!-- <van-field
              class="form-input"
              background="var(--ex-div-bgColor20)"
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

          <!--gemini2 去掉选填项 -->
          <div v-if="!['gemini2'].includes(_getConfig('_APP_ENV'))">
            <div class="formInput">
              <p class="label">
                {{ _t18('branch_name') }}
                <span class="scl">({{ _t18('optional') }})</span>
              </p>
              <input :placeholder="_t18('login_please')" v-model="formData.bankBranch" class="form-input" />
            </div>
            <div class="formInput">
              <p class="label">
                {{
                  _t18('bank_address_or_number')
                }}<span class="scl"><span class="scl">({{ _t18('optional') }})</span></span>
              </p>
              <input :placeholder="_t18('login_please')" v-model="formData.bankAddress" class="form-input" />
            </div>
            <div class="formInput">
              <p class="label">
                {{
                  _t18('Bank_International_Code')
                }}<span class="scl">({{ _t18('optional') }})</span>
              </p>
              <input :placeholder="_t18('login_please')" v-model="formData.bankCode" class="form-input" />
            </div>
            <div class="formInput">
              <p class="label">
                {{ _t18('Home_address') }}<span class="scl">({{ _t18('optional') }})</span>
              </p>
              <input :placeholder="_t18('login_please')" v-model="formData.userAddress" class="form-input" />
            </div>
          </div>
        </div>

        <div class="btnBox" @click="submit">
          <ButtonBar :btnValue="_t18('advanced_submit')" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { bindCardSubmit } from '@/api/account.js'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { ref, reactive, onMounted } from 'vue'
import HeaderBar from '@/components/HeaderBar/index.vue'
import { showToast } from 'vant'
import { _getConfig, _t18, _toReplace, _toView } from '@/utils/public'
import { useToast } from '@/hook/useToast'

const { _toast, _showName } = useToast()

const formData = reactive({
  // userName: '',
  cardNumber: '',
  bankName: '',
  bankBranch: '',
  bankAddress: '',
  bankCode: '',
  userAddress: '',
  coin: '',
  nome: undefined,
  chavePix: undefined,
  cpf: undefined
})
const showInfo1 = ref(false)
const showInfo2 = ref(false)
const showInfo3 = ref(false)
const showInfo4 = ref(false)
const cuttentRight = { iconRight: [{ iconName: 'kefu', iconSize: '20px', clickTo: 'event_serviceChange' }] }


//添加提交
const submit = () => {
  let params = formData
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


  bindCardSubmit(params).then((res) => {
    if (res.code == '200') {
      // showToast(res.msg)
      _toast('quote_addSuccess')
      setTimeout(() => {
        _toReplace('/bind-card')
      }, 500)
    } else {
      showToast(res.msg)
    }
  })
}
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
