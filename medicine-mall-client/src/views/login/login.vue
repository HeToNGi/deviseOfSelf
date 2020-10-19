<template>
  <div>
    <div class="login-class" style="padding-top: 20px">
      <van-form>
        <van-field
            v-model="username"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
            v-model="user_password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px" class="login-button">
          <van-button plain round block type="info" @click="onSubmit">
            立即登录
          </van-button>
          <div class="login-text">
            <span>还没有账号？点击下方按钮注册 </span>
            <van-button plain round block type="primary" @click="submitReg">
              注册
            </van-button>
          </div>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import {Form} from "vant";
import {Toast} from "vant";
import request from "@/utils/request";

Vue.use(Toast);
Vue.use(Form);
export default {
  data() {
    return {
      username: "aa",
      user_password: "11",
    };
  },
  methods: {
    onSubmit(values) {
      let data = {
        username: this.username,
        user_password: this.user_password,
        user_type: "2", // 2 用户
      };
      request.post("/users/login", data).then((res) => {
        if (res.code === 200) {
          // 登录成功判断有没有实名认证 只有实名认证后才能跳转到主页
          if (!res.verified) {
            Toast.fail(res.message);
            this.$router.push("/verified")
          } else {
            Toast.success(res.message);
            this.$router.push("/home");
          }
        } else {
          Toast.fail(res.message);
        }
      });
    },
    submitReg() {
      let data = {
        username: this.username,
        user_password: this.user_password,
        user_type: "2", // 2 用户
      };
      request.post("/users/register", data).then((res) => {
        if (res.code === 200) {
          Toast.success(res.message + " 请点击登录按钮登录");
        } else {
          Toast.fail(res.message);
        }
      });
    },
  },
};
</script>
<style>
.login-class {
  margin-top: 20px;
  width: 94%;
  margin-left: 3%;
}

.login-button {
  padding-top: 20px;
}

.login-text {
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
}

.tableTitle {
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 1px;
  background-color: #d4d4d4;
  text-align: center;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
}

.midText {
  position: absolute;
  left: 50%;
  background-color: #f5f5f5;
  padding: 0 15px;
  transform: translateX(-50%) translateY(-50%);
}

.login-other {
  margin-top: 50%;
}

.login-logo {
  margin-top: 80px;
}
</style>