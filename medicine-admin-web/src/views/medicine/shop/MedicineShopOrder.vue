<template>
  <div>
    <a-row style="padding: 5px;">
      <a-col :span="2">
        <a-button @click="queryByPage" :loading="loading">刷新</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table :columns="columns"
                 :pagination="page"
                 @change="onChange"
                 :data-source="data">
          <template slot="action" slot-scope="record">
            <a-button v-on:click="pickUp(record)">取货</a-button>
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
    title: '订单号',
    dataIndex: 'order_no',
  },{
    title: '顾客名称',
    dataIndex: 'username',
  },
  {
    title: '支付方式',
    dataIndex: 'pay_type',
  }, {
    title: '是否支付',
    dataIndex: 'has_pay',
  },
  {
    title: '取货码',
    dataIndex: 'pickup_code',
  }, {
    title: '是否取货',
    dataIndex: 'has_pickup',
  },
  {
    title: '订单总价',
    dataIndex: 'order_price',
  },
  {
    title: '创建时间',
    dataIndex: 'create_date',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'},
  },
];

export default {
  name: "MedicineShopOrder",
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
      typeList: []
    }

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
      request.post('/medicine/goods/order/list', param).then(response => {
        if (response.code === 200) {
          this.data = response.data;
          this.page.total = response.page.total;
          this.loading = false;
        }
      })
    },
    pickUp(record) {

    },



  },

}
</script>

<style scoped>

</style>