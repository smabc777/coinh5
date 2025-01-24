<!-- 添加登录密码 -->
<script setup>
import { _t18 } from '@/utils/public'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { addLoginPwd } from '@/api/user'
import { showToast } from 'vant'
import { useToast } from '@/hook/useToast'

const { _toast, _showName } = useToast()

//数据
const isPwd = ref(true)
const showPwdDiff = ref(false)
const formData = ref({
  newPwd: '',
  NPwd: ''
})
// 验证
const pwdDiff = () => {
  showPwdDiff.value = !(formData.value.newPwd == formData.value.NPwd)
}

const submit = () => {
  if (!formData.value.newPwd) {
    //请输入密码
    return showToast(_showName(`login_please`) + _showName(`login_pwd`))
  }

  if (formData.value.newPwd !== formData.value.NPwd) {
    //两次密码不一致
    showPwdDiff.value = true
    return _toast('register_pwd_diff')
  }

  addLoginPwd(formData.value.NPwd).then((res) => {
    if (res.code == '200') {
      //设置成功
      _toast('Fund_password_set_success')
      formData.value.newPwd = ''
      formData.value.NPwd = ''
    } else {
      showToast(res.msg)
    }
  })
}
</script>

<template>
  <div class="content">
    <div class="tip">{{ _t18('login_pwd') }}</div>
    <div class="input">
      <svg-load name="mima" class="icon1"></svg-load>
      <input autocomplete="off" :type="isPwd ? 'text' : 'password'" :placeholder="_t18('login_please')"
        v-model="formData.newPwd" />
      <svg-load :name="isPwd ? 'openeyes' : 'closeeyse'" class="icon2" @click="isPwd = !isPwd"></svg-load>
    </div>
    <div class="tip">{{ _t18('Confirm_Password') }}</div>
    <div class="input">
      <svg-load name="mima" class="icon1"></svg-load>
      <input autocomplete="off" :type="isPwd ? 'text' : 'password'" :placeholder="_t18('login_please')"
        v-model="formData.NPwd" @input="pwdDiff" />
      <svg-load :name="isPwd ? 'openeyes' : 'closeeyse'" class="icon2" @click="isPwd = !isPwd"></svg-load>
    </div>
    <p class="pwdDiff" v-if="showPwdDiff">*{{ _t18('register_pwd_diff') }}</p>
    <div class="btnBox" @click="submit">
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

  .btnBox {
    margin-top: 50px;
  }

  .pwdDiff {
    color: var(--ex-font-color14);
  }
}
</style>
