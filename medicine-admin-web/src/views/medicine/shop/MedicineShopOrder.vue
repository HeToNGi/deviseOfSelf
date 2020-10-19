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
          <template slot="pay" slot-scope="record">
            {{ record === '1' ? '医保卡' : '网上支付' }}
          </template>
          <template slot="pickUp" slot-scope="record">
            {{ record === '1' ? '是' : '否' }}
          </template>
          <template slot="action" slot-scope="record">
            <a-button v-if="record.has_pickup === '0'" v-on:click="pickUp(record)">{{record.pay_type == '1' ?'取货':'发货'}}</a-button>
            <a-button v-if="record.has_pickup === '1'" v-on:click="pickUp(record)">查看</a-button>
          </template>
        </a-table>
      </a-col>
    </a-row>

    <a-modal v-model="visible"
             title="订单详情"
             :ok-text="currentOrder.has_pickup === '1' ? '确定' : currentOrder.pay_type == '1' ?'确认取货':'确认发货'"
             width="55%"
             cancel-text="取消"
             @ok="submit">
      <a-table :columns="[
          {
            title: 'ID',
            dataIndex: 'id'
          },{
            title: '用户名称',
            dataIndex: 'user_id'
          },{
            title: '药品名称',
            dataIndex: 'medicine_name'
          },{
            title: '药品单价',
            dataIndex: 'price'
          },{
            title: '购买数量',
            dataIndex: 'medicine_num'
          },{
            title: '订单价格',
            dataIndex: 'medicine_price'
          },
        ]" @cancel="orderItemList = [];currentOrder = {}"
               :data-source="orderItemList">
      </a-table>
    </a-modal>

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
    title: '订单号/取货码',
    dataIndex: 'order_no',
  }, {
    title: '顾客名称',
    dataIndex: 'username',
  },
  {
    title: '支付方式',
    dataIndex: 'pay_type',
    scopedSlots: {customRender: 'pay'}
  }, {
    title: '是否支付',
    dataIndex: 'has_pay',

  }, {
    title: '是否取货',
    dataIndex: 'has_pickup',
    scopedSlots: {customRender: 'pickUp'}
  }, {
    title: '药品数量',
    dataIndex: 'sum',
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
      typeList: [],
      orderItemList: [],
      currentOrder: {},
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
      request.post('/medicine/goods/order/list', param).then(response => {
        if (response.code === 200) {
          this.data = response.data;
          this.page.total = response.page.total;
          this.loading = false;
        }
      })
    },
    pickUp(record) {
      request.post('/medicine/server/order/items', record).then(res => {
        if (res.code === 200) {
          this.orderItemList = res.data;
          this.currentOrder = record;
          this.visible = true;
        } else {
          this.$message.error(res.message);
        }
      })
    },
    submit() {
      if (this.currentOrder.has_pickup === '1') {
        this.visible = false;
        return ;
      }
      request.post('/medicine/server/order/pickup', this.currentOrder).then(res => {
        if(res.code === 200) {
          this.$message.success(res.message)
          this.queryByPage();
          this.visible = false;
        } else {
          this.$message.success(res.message)
        }
      })
    }


  },

}
</script>

<style scoped>

</style>