<template>
  <div>
    <a-row class="center-content">
      <a-col>
        <a-alert message="请如实填写" type="warning" :show-icon="false"/>
      </a-col>
    </a-row>
    <a-row class="center-content">
      <a-col :span="24">
        <h1>药店入驻申请</h1>
      </a-col>
    </a-row>
    <a-row class="my-content">
      <a-col :offset="4">
        <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="药店名称" prop="shop_name">
            <a-input v-model="form.shop_name"/>
          </a-form-model-item>
          <a-form-model-item label="药店地址" prop="shop_addr">
            <a-input v-model="form.shop_addr"/>
          </a-form-model-item>
          <a-form-model-item label="药店占地面积" prop="shop_area">
            <a-input-number :precision="2" v-model="form.shop_area" style="width: 100%;"/>
          </a-form-model-item>
          <a-form-model-item label="药店员工数量" prop="shop_emps">
            <a-input-number v-model="form.shop_emps" style="width: 100%;"/>
          </a-form-model-item>
          <a-form-model-item label="是否取得资格证" prop="shop_cert">
            <a-switch v-model="form.shop_cert" checked-children="已取得" un-checked-children="未取得"/>
          </a-form-model-item>

          <a-form-model-item :wrapper-col="{ span: 14, offset: 8 }">
            <a-button type="primary" @click="onSubmit">
              申请
            </a-button>
            <a-button style="margin-left: 10px;" @click="resetForm">
              重新填写
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import request from "@/util/request";

export default {
  name: "MedicineShopApprove",
  data() {
    return {
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      other: '',
      form: {
        shop_name: '',
        shop_addr: '',
        shop_emps: 0,
        shop_area: '',
        shop_cert: true,
      },
      rules: {
        shop_name: [
          {required: true, message: '请输入药店名称', trigger: 'blur'}
        ],
        shop_addr: [
          {required: true, message: '请输入药店地址', trigger: 'blur'}
        ],
        shop_emps: [
          {required: true, message: '请输入药店员工数量', trigger: 'blur'}
        ],
        shop_area: [
          {required: true, message: '请输入药店占地面积', trigger: 'blur'}
        ],
        shop_cert: [
          {required: true, message: '请选择药店是否取得资格证', trigger: 'blur'}
        ],
      },
    }
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          request.post('/medicine/approve', this.form).then(response => {
            if (response.code === 200) {
              this.$message.success(response.message)
              request.post('/users/logout').then(response => {
                this.$router.push("/")
              })
            } else {
              this.$message.error(response.message)
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  }
}
</script>

<style scoped>
.my-content {
  text-align: left !important;
}

.center-content {
  text-align: center;
}
</style>