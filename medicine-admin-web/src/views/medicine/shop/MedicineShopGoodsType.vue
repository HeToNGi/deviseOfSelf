<template>
  <div>
    <a-row style="padding: 5px;">
      <a-col :span="2">
        <a-button @click="showModal">新增分类</a-button>
      </a-col>
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
            <a-button v-on:click="deleteType(record)">删除</a-button>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-modal v-model="visible"
             title="药品分类信息"
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
            <a-form-model-item label="药品分类名称"
                               :rules="[{required:true, message:'请输入药品分类', trigger:'blur'}]"
                               prop="medicine_type_name">
              <a-input v-model="form.medicine_type_name"/>
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: '药品分类ID',
    dataIndex: 'id',
  },
  // {
  //   title: '用户名称',
  //   dataIndex: 'username',
  // },
  {
    title: '药品分类名称',
    dataIndex: 'medicine_type_name',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'},
  },
];
const defaultForm = {
  id: '',
  username: '',
  medicine_type_name: '',
};
import request from "@/util/request";

export default {
  name: "MedicineShopGoodsType",
  data() {
    return {
      loading: false,
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      form: defaultForm,
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
      }
    }
  },
  mounted(){
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
      request.post('/medicine/goods/type/list', param).then(response => {
        if (response.code === 200) {
          this.data = response.data;
          this.page.total = response.page.total;
          this.loading = false;
        }
      })
    },
    showModal() {
      this.visible = true;
    },
    resetForm() {
      this.visible = false;
      Object.assign(this.form, defaultForm);
      this.form.medicine_type_name =  '';
      this.queryByPage();
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          request.post('/medicine/shop/goods/type', this.form).then(res => {
            this.$message.success(res.message)
            this.resetForm();
          })
        }
      });
    },
    deleteType(record) {
      request.post('/medicine/goods/type/delete',{id:record.id}).then(res=>{
        if(res.code == 200) {
          this.$message.success(res.message);
        } else  {
          this.$message.error(res.message);
        }
        this.queryByPage();
      })
    }
  }
}
</script>

<style scoped>

</style>