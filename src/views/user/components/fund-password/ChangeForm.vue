<!-- 修改资金密码 -->
<script setup>
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { updateFundPwd } from '@/api/user'
import { showToast } from 'vant'
import { ref, reactive } from 'vue'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
import { minSixPasswordNumAndChat } from '@/utils'

const { _toast } = useToast()
const newPwd = ref(false)
const oldPwd = ref(false)
const NPwd = ref(false)
const form = ref({
  newPwd: '',
  oldPwd: '',
  NPwd: ''
})
const setKeyVal = (val) => {
  if (val == 'oldPwd') {
    oldPwd.value = !oldPwd.value
  } else if (val == 'newPwd') {
    newPwd.value = !newPwd.value
  } else {
    NPwd.value = !NPwd.value
  }
}
const emit = defineEmits(['setPwd'])
// form.pwd.value = !form.pwd.value
const success = ref(false)
watch(success, (newValue) => {
  emit('setPwd', newValue)
})
const showPwdDiff = ref(false)
const pwdDiff = () => {
  showPwdDiff.value = !(form.value.newPwd == form.value.NPwd)
}
const changePwd = () => {
  if (form.value.oldPwd == '') {
    // showToast('请输入旧密码')
    _toast('Fund_password_pleaseOld')
    return
  }
  if (form.value.newPwd == '') {
    // showToast('请输入新密码')
    _toast('Fund_password_pleaseNew')
    return
  }

  if (!['coinomivip', 'vitc'].includes(__config._APP_ENV)) {
    if (form.value.newPwd.length != form.value.newPwd.replace(/[^\w]/g, '').length) {
      // showToast('密码只能有字母和数字')
      _toast('register_pwd_NoSpecialSymbols')
      return
    }
  }

  if (form.value.newPwd !== form.value.NPwd) {
    // showToast('两次密码不一致')
    _toast('register_pwd_diff')
    return
  }
  if (form.value.newPwd.length < 6 || form.value.NPwd.length < 6) return _toast('stock95')

  if (['aug'].includes(__config._APP_ENV)) {
    if (
      !minSixPasswordNumAndChat.test(form.value.newPwd) ||
      !minSixPasswordNumAndChat.test(form.value.NPwd)
    ) {
      _toast('at_least_6_alphanumeric_mix')
      return
    }
  }

  delete form.value.NPwd
  var data = {
    ...form.value,
    signType: 1
  }

  updateFundPwd(form.value.oldPwd, form.value.newPwd, 1, data).then((res) => {
    if (res.code == '200') {
      // showToast('资金密码修改成功')
      _toast('Fund_password_update_success')
      success.value = true
    } else {
      showToast(res.msg)
    }
  })
}
</script>
<template>
  <div class="content">
    <div class="tip">{{ _t18('Old_Password') }}</div>
    <div class="input">
      <svg-load name="mima" class="icon1"></svg-load>
      <input autocomplete="off" type="text" :class="oldPwd ? '' : 'pass'" v-model="form.oldPwd"
        :placeholder="_t18('login_please_old_password', ['aug'])" />
      <svg-load :name="oldPwd ? 'openeyes' : 'closeeyse'" class="icon2" @click="setKeyVal('oldPwd')"></svg-load>
    </div>
    <div class="tip">{{ _t18('New_Password') }}</div>
    <div class="input">
      <svg-load name="mima" class="icon1"></svg-load>
      <input autocomplete="off" type="text" v-model="form.newPwd" :class="newPwd ? '' : 'pass'"
        :placeholder="_t18('login_please_new_password', ['aug'])" />
      <svg-load :name="newPwd ? 'openeyes' : 'closeeyse'" class="icon2" @click="setKeyVal('newPwd')"></svg-load>
    </div>
    <div class="tip">{{ _t18('Confirm_Password') }}</div>
    <div class="input">
      <svg-load name="mima" class="icon1"></svg-load>
      <input autocomplete="off" :class="NPwd ? '' : 'pass'" type="text" v-model="form.NPwd" @input="pwdDiff"
        :placeholder="_t18('login_please_confirm_new_password', ['aug'])" />
      <svg-load :name="NPwd ? 'openeyes' : 'closeeyse'" class="icon2" @click="setKeyVal('NPwd')"></svg-load>
    </div>
    <p class="pwdDiff" v-if="showPwdDiff">*{{ _t18('register_pwd_diff') }}</p>
    <div class="btnBoxs" @click="changePwd">
      <ButtonBar :btnValue="_t18('btnConfirm', ['bitmake'])" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.content {
  padding: 30px 15px 0 15px;

  .tip {
    font-size: 14px;
    color: var(--ex-input-label-color2);
    margin-bottom: 10px;
    text-align: left;
  }

  .input {
    // padding: 0 15px;
    width: 100%;
    height: 50px;
    border-radius: 8px;
    background: var(--ex-input-background-color) !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: relative;

    input {
      border-radius: 8px;
      width: 100%;
      height: 100%;
      padding: 0 38px;
      font-size: 14px;
      background: var(--ex-input-background-color);
    }

    /* 焦点状态样式 */
    input:focus {
      border: 1px solid var(--ex-input-focus-color);
      outline: none;
      /* 防止点击时出现默认的浏览器外观 */
    }

    .icon1 {
      position: absolute;
      top: 15px;
      left: 14px;
      font-size: 16px;
    }

    .icon2 {
      position: absolute;
      top: 17px;
      right: 14px;
      font-size: 16px;
    }

    .pwdDiff {
      color: var(--ex-font-color14);
    }
  }
}

.btnBoxs {
  margin-top: 50px;
}
</style>
