<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item prop="frontCaptcha">
            <span class="svg-container">
              <svg-icon icon-class="captcha" />
            </span>
            <el-input
              ref="frontCaptcha"
              v-model="loginForm.frontCaptcha"
              class="captcha-input"
              type="text"
              placeholder="frontCaptcha"
              name="frontCaptcha"
              tabindex="2"
              autocomplete="on"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <front-captcha @getCaptcha="getFrontCaptcha" />
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item prop="backCaptcha">
            <span class="svg-container">
              <svg-icon icon-class="captcha" />
            </span>
            <el-input
              ref="backCaptcha"
              v-model="loginForm.backCaptcha"
              class="captcha-input"
              type="text"
              placeholder="backCaptcha"
              name="backCaptcha"
              tabindex="2"
              autocomplete="on"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
        </el-col>
        <el-col ref="one" :span="10">
          <div class="back-Captcha">
            <img :src="backCaptcha" @click="getBackCaptcha">
          </div>
        </el-col>
      </el-row>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

      <div style="position:relative">
        <div class="tips">
          <span>Username : admin</span>
          <span>Password : any</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">Username : editor</span>
          <span>Password : any</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          Or connect with
        </el-button>
      </div>
    </el-form>

    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'
import FrontCaptcha from './components/FrontCaptcha'
import { getCaptcha, checkCaptcha } from '../../api/captcha'

export default {
  name: 'Login',
  components: { SocialSign, FrontCaptcha },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    const validateFrontCaptcha = (rule, value, callback) => {
      if (!this.checkFrontCaptcha(value)) {
        callback(new Error('Please enter the correct captcha'))
      } else {
        callback()
      }
    }
    const validateBackCaptcha = (rule, value, callback) => {
      checkCaptcha(value).then(response => {
        if (response.data) {
          callback()
        } else {
          callback(new Error('Please enter the correct captcha'))
        }
      })
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111',
        frontCaptcha: '',
        backCaptcha: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        frontCaptcha: [{ required: true, trigger: 'blur', validator: validateFrontCaptcha }],
        backCaptcha: [{ required: true, trigger: 'blur', validator: validateBackCaptcha }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      frontCaptcha: '',
      backCaptcha: '',
      backLoading: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.getBackCaptcha()
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    } else if (this.loginForm.frontCaptcha === '') {
      this.$refs.frontCaptcha.focus()
    } else if (this.loginForm.backCaptcha === '') {
      this.$refs.backCaptcha.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // 设置前端验证码
    getFrontCaptcha(data) {
      this.frontCaptcha = data
    },
    // 检测前端验证码
    checkFrontCaptcha(data) {
      // 大小写不敏感
      const input = String(data)
      return this.frontCaptcha.toLowerCase() === input.toLowerCase()
    },
    // 设置后台验证码
    getBackCaptcha() {
      if (this.backLoading === false) {
        this.backLoading = true
        getCaptcha().then(response => {
          this.backCaptcha = response.data.url
          this.backLoading = false
        }).catch(err => {
          console.log(`err:${err}`)
          this.backLoading = false
        })
      }
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.back-Captcha{
  position: relative;
  width: 112px;
  height: 49px;
  line-height: 47px;
  margin: auto;

  img{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 112px;
    margin: auto;
  }
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
