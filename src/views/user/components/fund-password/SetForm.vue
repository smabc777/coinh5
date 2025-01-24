<!-- 设置资金密码 -->
<script setup>
import { watch } from 'vue'
import { reactive } from 'vue'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { setFundPwd } from '@/api/user'
import { showToast } from 'vant'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'

const { _toast } = useToast()
const form = reactive({
  pwd: false
})
const setVal = () => {
  form.pwd = !form.pwd
}
watch(
  () => form.pwd,
  (newValue, oldValue) => {
    console.log(newValue, oldValue)
  }
)
const emit = defineEmits(['setPwd'])
// form.pwd.value = !form.pwd.value
const success = ref(false)
watch(success, (newValue) => {
  emit('setPwd', newValue)
})
const formData = ref({
  password: ''
})

const submit = () => {
  if (formData.value.password == '') {
    // showToast('请输入资金密码')
    _toast('Fund_password_noempty')
    return
  }
  if (formData.value.password.length < 6) return _toast('stock95')

  if (!['coinomivip', 'vitc'].includes(__config._APP_ENV)) {
    if (formData.value.password.length != formData.value.password.replace(/[^\w]/g, '').length) {
      // showToast('密码只能有字母和数字')
      _toast('register_pwd_NoSpecialSymbols')
      return
    }
  }

  var data = { pwd: formData.value.password }

  setFundPwd(formData.value.password, data).then((res) => {
    if (res.code == '200') {
      // showToast('设置成功')
      _toast('Fund_password_set_success')
      success.value = true
    } else {
      showToast(res.msg)
    }
  })
}
</script>
<template>
  <div class="content">
    <div class="input">
      <svg-load name="mima" class="icon1"></svg-load>
      <input autocomplete="off" :type="form.pwd ? 'text' : 'password'" v-model="formData.password" />
      <svg-load :name="form.pwd ? 'openeyes' : 'closeeyse'" class="icon2" @click="setVal"></svg-load>
    </div>
    <div class="btnBox" @click="submit">
      <ButtonBar :btnValue="_t18('btnConfirm', ['bitmake'])" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.content {
  padding: 30px 15px 0 15px;

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
}
</style>
