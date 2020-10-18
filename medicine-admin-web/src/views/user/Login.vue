<template>
  <div class="register-container">
    <div class="title">
      <h1>药店服务端-登录</h1>
    </div>
    <div class="register">
      <a-row>
        <a-col :span="8" :offset="8">
          <a-form-model
              ref="ruleForm"
              :model="form"
              :rules="rules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
          >
            <a-form-model-item ref="name" label="用户名" prop="username">
              <a-input
                  v-model="form.username"
                  placeholder="请输入用户名"
              />
            </a-form-model-item>

            <a-form-model-item label="密码" required prop="user_password">
              <a-input
                  v-model="form.user_password"
                  type="password"
                  placeholder="请输入密码"
                  style="width: 100%"
              />
            </a-form-model-item>

            <a-form-model-item label="用户类型" prop="user_type">
              <a-radio-group v-model="form.user_type">
                <a-radio value="0">管理员</a-radio>
                <a-radio value="1">药店</a-radio>
              </a-radio-group>
            </a-form-model-item>

            <a-form-model-item :wrapper-col="{ span: 14, offset: 7 }">
              <a-button type="primary" @click="onSubmit">
                登录
              </a-button>
              <a-button style="margin-left: 10px" @click="resetForm">
                重置
              </a-button>
              <a-button type="danger" style="margin-left: 10px" @click="goRegister">
                去注册
              </a-button>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{offset:2}">
              <a-alert style="text-align: center;border-style: dashed;" message="如果您还没有账号，请先注册"></a-alert>

            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import request from "@/util/request";

export default {
  name: "Login",
  data() {
    return {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
      other: "",
      form: {
        username: "",
        user_password: "",
        user_type: "0",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          }
        ],
        user_password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          }
        ],
        user_type: [
          {
            required: true,
            message: "请选择用户类型",
            trigger: "blur",
          }
        ],
      },
    };
  },
  methods: {
    goRegister() {
      this.$router.push("/register")
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          request.post("/users/login", this.form).then(resp => {
            if (resp.code === 200) {
              this.$store.commit('saveUser', resp.data)
              this.$message.success(resp.message);
              if (this.form.user_type === '1') { // 药店登录
                // 判断药店有没有申请过 如果没申请过  跳转到申请页面 , 申请过跳转到药品增删改查等页面
                if (!resp.approve) {
                  this.$router.push("/medicine/approve")
                } else {
                  // 跳转到 药品增删改查等页面
                  this.$router.push("/medicine/shop/main")
                }
              } else if (this.form.user_type === '0') { // 管理员登录
                this.$router.push("/medicine/admin/main")
              } else if (this.form.user_type === '2') { // 买家登录

              }
            } else {
              this.$message.error(resp.message)
            }
          })
        } else {
          this.$message.error("请先填写表单")
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
.register-container {
  text-align: left;
}

.title {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
