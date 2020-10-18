<template>
  <div>
    <a-row>
      <a-col>
        <div style="display: flex; align-content: flex-start;">
          <div style="width: 10%;">
            <a-button style="margin: 5px;" @click="queryByPage" :loading="loading">刷新</a-button>
          </div>
          <div style="width: 90%; display: flex;align-items: center; ">
            <span style="color: #e6a23c">资质审查通过后才药店才可以登录，对各类药品的增删查改；对订单的处理；销售额度的统计；用户的积分情况</span>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table :columns="columns"
                 :pagination="page"
                 @change="onChange"
                 :data-source="data">
          <div slot="approve_status" slot-scope="approve_status">
            <span style="color:deepskyblue;" v-if="approve_status === '0'">申请提交</span>
            <span style="color:green;" v-if="approve_status === '1'">申请通过</span>
            <span style="color:firebrick;" v-if="approve_status === '2'">申请拒绝</span>
            <span style="color:orange;" v-if="approve_status === '3'">资质审查通过</span>
          </div>
          <div slot="shop_cert" slot-scope="shop_cert">
            <span :style="{color:shop_cert === '0'?'red':'green'}">
              {{ shop_cert === '0' ? '否' : '是' }}
            </span>
          </div>
          <template slot="action" slot-scope="record">
            <a-button v-on:click="submit(record)" :disabled="record.approve_status === '3'">资质审查-审查通过</a-button>
          </template>
        </a-table>
      </a-col>
    </a-row>


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
    title: '审核状态',
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
  {
    title: '是否取得资格证',
    dataIndex: 'shop_cert',
    scopedSlots: {customRender: 'shop_cert'}
  },
  {
    title: '审核信息',
    dataIndex: 'approve_message',
  },
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
  name: "MedicineShopCertReview",
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
    submit(record) {
      request.post('/medicine/approveReview', {
        id: record.key,
        approve_status: '3'
      }).then(res => {
        this.$message.success(res.message)
      })
      this.queryByPage();
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
      request.post('/medicine/queryByPageReview', param).then(response => {
        if (response.code === 200) {
          this.data = response.data;
          this.page.total = response.page.total;
          this.loading = false;
        }
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
