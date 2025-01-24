<template>
    <div class="password-input" :style="{ width: width }">
        <input type="text" :value="hideValue" @input="handleInput" ref="password-input" />
    </div>

</template>


<script>
export default {
    name: 'testInput',
    props: {
        modelVal: String,
        placeholder: {
            type: String,
            default: '请输入'
        },
        width: {
            type: String,
            default: '300px'
        }
    },
    model: {
        prop: 'modelVal', // 指向props的参数名
        event: 'input' //事件名称
    },
    data() {
        return {
            hideValue: ''
        }
    },
    watch: {
        modelVal: function (val) {
            console.log('watch model', val)
            this.render(val);
        }
    },
    methods: {
        render(val) {
            this.hideValue = val.replace(/[^*]/g, '*');
            // 同等长度替换时，会出现键入字符不被设置为*
            this.$forceUpdate()
        },
        handleInput() {
            this.dealPassword()
        },
        dealPassword(e) {
            let new_pwd = ''; // 存储新的真实密码
            let old_pwd = this.modelVal || ''; // 获取旧的真实密码
            const pwd_input_elem = this.$refs['password-input']; // 获取密码输入框DOM
            let val = this.$refs['password-input'].value; // 获取输入框中的值
            const cursorIndex = pwd_input_elem.selectionStart; // 获取光标在输入框中的位置
            // 旧的真实密码存在，且其字符串长度大于输入框的字符串长度，说明用户进行删除操作
            if (old_pwd && old_pwd.length > val.length) {
                const stop = old_pwd.length - val.length + cursorIndex; // 用户删除的字符串长度加光标的当前的位置，计算得出删除字符串的最后一个字符的位置
                let del_string;
                const reg = /[^*]/.exec(val);
                if (reg) { // 说明为删除时有新值补充
                    del_string = old_pwd.substring(cursorIndex - 1, stop)
                    old_pwd = old_pwd.replace(del_string, '');
                    let temp = this.findStrIndex(val)
                    // 根据temp数组进行插入
                    temp.forEach(item => {
                        let isReplace = old_pwd && val.length === old_pwd.length
                        new_pwd = this.insertStr(old_pwd, item.index, item.val, isReplace); // 将用户新输入的字符插入旧的真实密码
                        this.cursorMove(pwd_input_elem, item.index + 1); // 设置光标的位置
                        old_pwd = new_pwd
                    })
                } else { // 仅删除
                    del_string = old_pwd.substring(cursorIndex, stop)
                    old_pwd = old_pwd.replace(del_string, '');
                    new_pwd = old_pwd
                }
            } else {
                // 新增或原长度替换
                // reg中的非*字符 要么一个 要么几个 一个表示输入或者复制黏贴 几个 肯定是复制黏贴
                const reg = /[^*]/.exec(val)
                if (reg) {
                    if (reg.length > 0 && !/[*]/g.test(reg.input) && reg.input.length > 1) { // 说明为全部选中，则需要将旧密码置空
                        old_pwd = ''
                    } else {// 鼠标选中 部分元素(不包含所有)进行复制黏贴
                        // 看val中有多少个*
                        let num = this.findStrNum('*', val)
                        let del_string;
                        // old_pwd.length - num 表示在旧字符串中删除的位数 reg.index为新字符中第一个非*字符的位置
                        del_string = old_pwd.substring(reg.index, reg.index + (old_pwd.length - num))
                        old_pwd = old_pwd.replace(del_string, '');
                    }
                }
                // 是否为等长替换
                let isReplace = old_pwd && val.length === old_pwd.length
                let temp = this.findStrIndex(val)
                // 根据temp数组进行插入
                temp.forEach(item => {
                    new_pwd = this.insertStr(old_pwd, item.index, item.val, isReplace); // 将用户新输入的字符插入旧的真实密码
                    this.cursorMove(pwd_input_elem, item.index + 1); // 设置光标的位置
                    old_pwd = new_pwd
                })
            }
            // 将实际密码同步到input输入框中
            this.$emit('input', new_pwd);
        },
        // 查找字符串中在源串中的位置
        findStrIndex(str) {
            if (str) {
                const reg = /[^*]/g;
                const temp = [];
                let match;
                // 如果一个个输入的话，不会存在while循环，主要用来处理复制插入 替换等情况
                while ((match = reg.exec(str)) !== null) {
                    temp.push({ val: match[0], index: match.index });
                }

                return temp
            } else {
                return []
            }

        },
        // 查找源字符串中目标字符串的个数
        findStrNum(target, source) {
            let num = 0;
            let temp = source.split('')
            temp.forEach(item => {
                if (item === target) num++
            })
            return num
        },
        // 在字符串中插入字符串
        insertStr(soure, start, newStr, isReplace) {
            return soure.slice(0, start) + newStr + soure.slice(isReplace ? start + 1 : start);
        },
        // 控制光标的位置
        cursorMove(elem, spos) {
            // spos 光标的位置 -1为最后一位
            if (spos < 0) spos = elem.value.length;
            if (elem.setSelectionRange) {
                //兼容火狐,谷歌
                setTimeout(function () {
                    elem.setSelectionRange(spos, spos);
                    elem.focus();
                }, 0);
            } else if (elem.createTextRange) {
                //兼容IE
                var rng = elem.createTextRange();
                rng.move('character', spos);
                rng.select();
            }
        }
    }
}
</script>