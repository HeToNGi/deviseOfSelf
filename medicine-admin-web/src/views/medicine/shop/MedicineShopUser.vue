<template>
  <div>
    <a-row>
      <a-col :span="2">
        <a-button @click="queryByPage" :loading="loading">刷新</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table :columns="columns"
                 :pagination="page"
                 :data-source="data">
          <template slot="action" slot-scope="record">
            <a-button v-on:click="">操作</a-button>
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
    title: "ID",
    dataIndex: 'id'
  },
  {
    title: '用户名称',
    dataIndex: 'username',
  },{
    title: '用户积分',
    dataIndex: 'members_point',
  },
  // {
  //   title: '操作',
  //   key: 'action',
  //   scopedSlots: {customRender: 'action'},
  // },
];

export default {
  name: "MedicineShopUser",
  data() {
    return {
      loading: false,
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      form: {
        id: '',
        medicine_name: '',
        medicine_goods_type_id: '',
        medicine_desc: '',
        medicine_price: 0,
        medicine_num: 0,
        medicine_pic_url: ''
      },
      visible: false,
      data: [],
      columns: columns,
      page: {
        current: 1,
        pageSize: 5,
        total: 0,
        pageSizeOptions: ['5', '10', '20', '30', '40'],
        showQuickJumper: true,
        showSizeChanger: true
      },
    }

  },
  mounted() {
    this.queryByPage();
  },
  methods: {
    onChange(page) {
      this.page = page;
      this.queryByPage();
    },
    queryByPage() {
      this.loading = true;
      let param = {
        page: this.page
      }
      request.post('/medicine/shop/users/list', param).then(response => {
        if (response.code === 200) {
          this.data = response.data;
          this.page.total = response.page.total;
          this.loading = false;
          this.$message.success(response.message)
        } else{
          this.$message.error(response.message)
        }
      })
    },


  },
}
</script>

<style scoped>

</style>