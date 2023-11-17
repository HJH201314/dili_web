<script setup lang="ts">
import EasyTyper from 'easy-typer-js';
import { reactive, ref, watch } from "vue";
import { Close, Right } from "@icon-park/vue-next";
import CommonModal from "@/components/modal/CommonModal.vue";
import type { CommonModalFunc } from "@/components/modal/CommonModal";
import useUserStore from "@/stores/useUserStore";
import showToast from "@/components/toast/toast";

const userStore = useUserStore();
const refLoginModal = ref<CommonModalFunc>();

const typerObj = reactive({
  output: '',
  isEnd: false,
  speed: 150,
  singleBack: false,
  sleep: 1000,
  type: 'normal',
  backSpeed: 40,
  sentencePause: false,
})

const typer = ref<EasyTyper>();

defineExpose({
  open: () => {
    refLoginModal.value?.open();
    init();
  },
  close: () => {
    refLoginModal.value?.close();
  },
});

const loginForm = reactive({
  type: ref<'pwd'|'pin'>('pwd'),
  username: ref(''),
  phone: ref(''),
  password: ref(''),
  pin: ref(''),
  shakePhone: ref(0),
  shake: ref(0),
});
const smsTip = ref('获取验证码');
const emoji = ref('🚀');
const submitDisabled = ref(false);

function init() {
  emoji.value = '🚀';
  // @ts-ignore
  typer.value = new EasyTyper(typerObj, ['DILIDILI', 'LAUNCH!']);
}
async function handleGetSmsCode() {
  if (!loginForm.phone) {
    loginForm.shakePhone += 1;
    showToast({ text: '请输入手机号！', position: 'bottom', type: 'danger' });
    return;
  } else {
    try {
      submitDisabled.value = true;
      // await api.user.getSmsCode(loginForm.username);
      showToast({ text: '短信验证码已发送', position: 'bottom', type: 'success' });
      smsTip.value = '60s后重新获取';
      let count = 60;
      const timer = setInterval(() => {
        count--;
        smsTip.value = `${count}s后重新获取`;
        if (count === 0) {
          clearInterval(timer);
          smsTip.value = '重新获取';
        }
      }, 1000);
    }
    catch (e) {
      console.error(e);
      loginForm.shake += 1;
      showToast({ text: '获取验证码失败', position: 'bottom', type: 'danger' });
      return;
    }
    finally {
      submitDisabled.value = false;
    }
  }
}
async function handleLoginSubmit() {
  if (loginForm.type == 'pin' && !loginForm.phone) {
    loginForm.shake += 1;
    showToast({ text: '请输入手机号！', position: 'bottom', type: 'danger' });
    return;
  }
  if (loginForm.type == 'pin' && !loginForm.pin) {
    loginForm.shake += 1;
    showToast({ text: '请输入验证码！', position: 'bottom', type: 'danger' });
    return;
  }
  if (loginForm.type == 'pwd' && !loginForm.username) {
    loginForm.shake += 1;
    showToast({ text: '请输入用户名！', position: 'bottom', type: 'danger' });
    return;
  }
  if (loginForm.type == 'pwd' && !loginForm.password) {
    loginForm.shake += 1;
    showToast({ text: '请输入密码！', position: 'bottom', type: 'danger' });
    return;
  }
  try {
    submitDisabled.value = true;
    let principal = '';
    let credential = '';
    if (loginForm.type == 'pin') {
      principal = loginForm.phone;
      credential = loginForm.pin;
    } else {
      principal = loginForm.username;
      credential = loginForm.password
    }
    const result = await userStore.login(loginForm.type, principal, credential);
  }
  catch (e) {
    console.error(e);
    loginForm.shake += 1;
    showToast({ text: '点火失败', position: 'bottom', type: 'danger' });
    return;
  }
  finally {
    submitDisabled.value = false;
  }
}

/* 观测userStore中的登录结果 */
watch(() => userStore.isLogin, (v) => {
  // 若登录成功，则提示并关闭模态框
  if (v) {
    emoji.value = '🎉';
    // @ts-ignore
    typer.value = new EasyTyper(typerObj, '欢迎回来');
    showToast({ text: `登录成功，欢迎回来，UUID:${userStore.token}`, position: 'top' });
    setTimeout(() => {
      refLoginModal.value?.close();
    }, 1500);
  }
});
</script>

<template>
  <CommonModal ref="refLoginModal" :show-close="false" style="padding-bottom: 100px;">
    <template #default>
      <div class="login">
        <Close class="login-close" size="20" @click="() => refLoginModal?.close()" />
        <div style="margin-top: .5rem;">
          <span class="sidebar-logo sidebar-logo-animation">DILIDILI</span>
          <span class="login-type">
            <span class="login-type-item" :class="{'active': loginForm.type === 'pwd'}" @click="loginForm.type = 'pwd'">密码登录</span>
            <span>&nbsp;|&nbsp;</span>
            <span class="login-type-item" :class="{'active': loginForm.type === 'pin'}" @click="loginForm.type = 'pin'">短信登录</span>
          </span>
        </div>
        <div class="login-top">
          <span class="login-top-emoji transition-all-circ">{{ emoji }}</span>
          <span class="login-top-text">{{ typerObj.output }}</span>
          <span class="typed-cursor login-top-text">|</span>
        </div>
        <form class="login-bottom">
          <div class="login-form">
            <input v-if="loginForm.type === 'pwd'" class="login-form-input" type="text" name="username" placeholder="请输入用户名（guest）" v-model="loginForm.username" autocomplete="username" />
            <input v-if="loginForm.type === 'pin'" class="login-form-input" type="text" name="phone" placeholder="请输入手机号" v-model="loginForm.phone" />
            <input v-if="loginForm.type === 'pwd'" class="login-form-input" type="password" name="password" placeholder="请输入密码（123456）" v-model="loginForm.password" autocomplete="current-password" />
            <div v-if="loginForm.type === 'pin'" style="position: relative;">
              <input class="login-form-input" type="text" name="sms" placeholder="请输入短信验证码（1234）" v-model="loginForm.pin" />
              <div class="login-form-get-sms" @click="handleGetSmsCode">{{ smsTip }}</div>
            </div>
          </div>
          <div class="login-form-submit" v-shake="loginForm.shake" @click="handleLoginSubmit">
            <button style="outline: none; color: inherit;" :disabled="submitDisabled" @submit="handleLoginSubmit">
              <Right size="32" />
            </button>
          </div>
        </form>
        <div class="login-footer">
          我已阅读并同意<a href="http://localhost">《DiliDili用户协议》</a>
        </div>
      </div>
    </template>
  </CommonModal>
</template>

<style scoped lang="scss">
@import "@/assets/main";
.login {
  margin: .25rem 1rem 1rem 1rem;
  position: relative;

  &-close {
    @extend %click-able;
    position: absolute;
    top: 0;
    right: 0;
    margin-top: .5rem;
    padding: .5rem;
    cursor: pointer;
    border-radius: .5rem;
  }

  &-type {
    font-size: 1rem;
    color: #5c5c5c;
    margin-left: .5rem;
    vertical-align: center;
    &-item {
      transition: all .2s $ease-out-circ;
      &:not(.active) {
        @extend %click-able;
      }
      padding: .35rem .5rem;
      border-radius: .5rem;
      &.active {
        color: $color-primary;
      }
    }
  }

  &-top {
    width: 100%;
    font-size: 100px;
    line-height: 1;
    text-align: center;
    margin: 1rem 0;
    &-emoji {
      &:focus {
        transform: scale(0.9);
      }
    }
    &-text {
      font-size: 56px;
      font-weight: bold;
      color: $color-primary;
      background-image: $linear-gradient-primary;
      -webkit-text-fill-color: rgba(0,0,0,0);
      -webkit-background-clip: text;
      background-clip: text;
    }
  }

  &-title {
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 4px;

    &:before {
      display: inline-block;
      content: '';
      height: 1rem;
      width: 4px;
      background-color: $color-primary;
    }
  }

  &-bottom {
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }

  &-footer {
    margin-top: .5rem;
    color: $color-grey-500;
    text-align: center;
  }

  &-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    &-input {
      width: 100%;
      font-size: large;
      border-radius: .5rem;
      padding: .25rem .5rem;
      border: 2px solid #FFFFFF00;
      background-color: $color-grey-100;
      outline: none;
      transition: all .2s $ease-out-circ;
      &:focus {
        border: 2px solid $color-primary;
      }
    }
    &-get-sms {
      @extend %click-able;
      font-size: 14px;
      color: $color-grey-500;
      padding: 0 .5rem;
      margin: 2px; // 避开边框
      border-radius: .5rem;
      position: absolute; right: 0; top: 0; bottom: 0; display: flex; place-items: center;
    }
    &-submit {
      position: relative;
      font-size: 20px;
      background-image: $linear-gradient-primary-2;
      color: white;
      text-align: center;
      border-radius: .5rem;
      display: flex;
      padding: .75rem;
      box-sizing: border-box;
      cursor: pointer;
      transition: all .2s $ease-out-circ;
      &:hover {
        opacity: 0.85;
      }
      &:active {
        background-image: $linear-gradient-primary-3;
      }
    }
  }
}
.sidebar-logo {
  flex: 1;
  font-size: 28px;
  &-animation {
    // background-image: linear-gradient(-135deg, #41e0a3, #56d8c0, #dc8bc3, #56d8c0, #41e0a3, #56d8c0, #dc8bc3, #56d8c0, #41e0a3);
    background-image: linear-gradient(-135deg, #418ae0, #56a0d8, #dc8bc3, #56a0d8, #418ae0, #56a0d8, #dc8bc3, #56a0d8, #418ae0);
    -webkit-text-fill-color: rgba(0,0,0,0);
    background-clip: text;
    background-size: 200% 200%;
    animation: text-masked-animation 3s infinite linear;
  }
  @keyframes text-masked-animation {
    0% {
      background-position: 0 -100%;
    }
    100% {
      background-position: -100% 0;
    }
  }
}
</style>