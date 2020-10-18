<template>
  <div>
    <van-form @submit="onSubmit" style="padding-top: 20px">
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="user_password"
        type="user_password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        readonly
        clickable
        name="picker"
        :value="card_type"
        label="证件类型"
        placeholder="点击选择证件类型"
        @click="showPicker = true"
        :rules="[{ required: true, message: '请填写选择证件类型' }]"
      />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @confirm="onConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>
      <van-field
        v-model="card_num"
        type="card_num"
        name="证件号码"
        label="证件号码"
        placeholder="证件号码"
        :rules="[{ required: true, message: '请填写证件号码' }]"
      />
      <div style="margin: 16px" class="login-button">
        <van-button round block type="info" native-type="submit">
          认证
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import Vue from "vue";
import { Form } from "vant";
import { Toast } from "vant";
import request from "@/utils/request";

Vue.use(Toast);
Vue.use(Form);

export default {
  name: "verified",
  data() {
    return {
      columns: ["身份证", "户口簿", "军官证", "回乡证"],
      showPicker: false,
      username: "aa",
      user_password: "11",
      card_type: "身份证",
      card_num: "12345",
      user_type: "2",
    };
  },
  methods: {
    onConfirm(value) {
      this.card_type = value;
      this.showPicker = false;
    },
    onSubmit(values) {
      let data = {
        username: this.username,
        user_password: this.user_password,
        card_num: this.card_num,
        user_type: "2", // 2 用户
      };
      request.post("/users/verified", data).then((res) => {
        if (res.code === 200) {
          Toast.success(res.message);
          this.$router.push("/home");
        } else {
          if (res.verified) {
            Toast.success(res.message);
            this.$router.push("/home");
          } else {
            Toast.fail(res.message);
          }
        }
      });
    },
  },
};
</script>
