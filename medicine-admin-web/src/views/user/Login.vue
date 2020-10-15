<template>
  <div class="register-container">
    <div class="title">
      <h1>药品管理系统-后台</h1>
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
                  @blur="
                  () => {
                    $refs.name.onFieldBlur();
                  }
                "
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

            <a-form-model-item :wrapper-col="{ span: 14, offset: 8 }">
              <a-button type="primary" @click="onSubmit"> 注册</a-button>
              <a-button style="margin-left: 10px" @click="resetForm">
                重置
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
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
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
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
