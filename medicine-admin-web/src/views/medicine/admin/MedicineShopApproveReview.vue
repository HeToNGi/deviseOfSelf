<template>
  <div>
    <a-row>
      <a-col>
        <a-button style="margin: 5px;" @click="queryByPage" :loading="loading">刷新</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table :columns="columns"
                 :pagination="page"
                 @change="onChange"
                 :data-source="data">
          <div slot="approve_status" slot-scope="approve_status">
            <span style="color:deepskyblue;" v-if="approve_status === '0'">提交</span>
            <span style="color:green;" v-if="approve_status === '1'">通过</span>
            <span style="color:firebrick;" v-if="approve_status === '2'">拒绝</span>
            <span style="color:orange;" v-if="approve_status === '3'">资质审查通过</span>
          </div>
          <!--          <div slot="shop_cert" slot-scope="shop_cert">-->
          <!--            <span :style="{color:shop_cert === '0'?'red':'green'}">-->
          <!--              {{ shop_cert === '0' ? '否' : '是' }}-->
          <!--            </span>-->
          <!--          </div>-->
          <template slot="action" slot-scope="record">
            <a-button v-on:click="approve(record)" :disabled="record.approve_status === '3'">审核</a-button>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <!--<a-row>
      <a-col :span="24" style="display: flex;justify-content: flex-end;">
        <a-pagination
            :pageSizeOptions="['5', '10', '20', '30', '40']"
            show-quick-jumper
            showSizeChanger
            :showTotal="showTotal"
            :default-current="page.pageNo"
            :defaultPageSize="page.pageSize"
            :total="page.total"
            @change="onChange"/>
      </a-col>
    </a-row>-->
    <a-modal v-model="visible"
             title="审核药店申请信息"
             ok-text="确认"
             width="55%"
             cancel-text="取消"
             @cancel="resetForm()"
             @ok="submit">
      <a-row class="my-content">
        <a-col :offset="4">
          <a-form-model
              ref="ruleForm"
              :model="form"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
          >
            <a-form-model-item label="药店名称" prop="shop_name">
              <a-input v-model="form.shop_name" disabled/>
            </a-form-model-item>
            <a-form-model-item label="药店地址" prop="shop_addr">
              <a-input v-model="form.shop_addr" disabled/>
            </a-form-model-item>
            <a-form-model-item label="药店占地面积" prop="shop_area">
              <a-input-number :precision="2" v-model="form.shop_area" style="width: 100%;" disabled/>
            </a-form-model-item>
            <a-form-model-item label="药店员工数量" prop="shop_emps">
              <a-input-number v-model="form.shop_emps" style="width: 100%;" disabled/>
            </a-form-model-item>
            <a-form-model-item label="是否取得资格证" prop="shop_cert">
              <a-switch v-model="form.shop_cert" checked-children="已取得" un-checked-children="未取得" disabled/>
            </a-form-model-item>
            <a-form-model-item label="是否通过申请"
                               prop="can_approve"
                               :rules="[{required:true,message:'请选择是否同意申请',trigger:'blur'}]">
              <a-switch v-model="form.can_approve" checked-children="通过" un-checked-children="拒绝"/>
            </a-form-model-item>
            <a-form-model-item label="审核意见"
                               prop="approve_message"
                               :rules="[{required:true,message:'请输入审核意见',trigger:'blur'}]">
              <a-input v-model="form.approve_message"/>
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import request from "@/util/request";

const columns = [
  {
    title: '药店名称',
    dataIndex: 'shop_name',
  },
  {
    title: '申请状态',
    dataIndex: 'approve_status',
    scopedSlots: {customRender: 'approve_status'}
  },
  {
    title: '药店地址',
    dataIndex: 'shop_addr',
  },
  {
    title: '药店员工数量',
    dataIndex: 'shop_emps',
  },
  {
    title: '药店占地面积',
    dataIndex: 'shop_area',
  },
  // {
  //   title: '是否取得资格证',
  //   dataIndex: 'shop_cert',
  //   scopedSlots: {customRender: 'shop_cert'}
  // },
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'},
  },
];

const defaultForm = {
  shop_name: '',
  shop_addr: '',
  shop_emps: 0,
  shop_area: '',
  shop_cert: false,
  approve_message: '',
  can_approve: false,
  id: -1,
  approve_status: '',
  username: ''

};
export default {


  name: "MedicineShopApproveReview",
  data() {
    return {
      loading: false,
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      form: {
        shop_name: '',
        shop_addr: '',
        shop_emps: 0,
        shop_area: '',
        shop_cert: true,
        approve_message: '',
        can_approve: false
      },
      visible: false,
      data: [],
      columns,
      page: {
        current: 1,
        pageSize: 5,
        total: 0,
        pageSizeOptions: ['5', '10', '20', '30', '40'],
        showQuickJumper: true,
        showSizeChanger: true
      }
    }
  },
  mounted() {
    this.queryByPage();
  },
  methods: {
    resetForm() {
      this.visible = false;
      Object.assign(this.form, defaultForm);
      this.queryByPage();
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          request.post('/medicine/approveSubmit', this.form).then(res => {
            this.$message.success(res.message)
            this.visible = false;
            this.resetForm();
            this.queryByPage();
          })

        } else {
          this.$message.error("请填写审核意见");
        }
      });

    },
    approve(record) {

      request.post('/medicine/getById', {key: record.key}).then(res => {
        if (res.code === 200) {
          this.$message.success("查询成功")
          let obj = res.data;
          if (obj.shop_cert === 1) {
            obj.shop_cert = true
          } else if (obj.shop_cert === 0) {
            obj.shop_cert = false;
          }
          Object.assign(this.form, obj);
          this.visible = true;
        } else {
          this.$message.success("查询失败")
        }
      })
    },
    queryByPage() {
      this.loading = true;
      let param = {
        page: this.page
      }
      request.post('/medicine/queryByPage', param).then(response => {
        if (response.code === 200) {
          this.data = response.data;
          this.page.total = response.page.total;
        }
        this.loading = false;
      })
    },
    showTotal(total, range) {
      debugger
    },
    onChange(page) {
      this.page = page;
      this.queryByPage();
    },
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
  }
}
</script>

<style scoped>

</style>
