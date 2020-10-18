<template>
  <div>
    <div>
      <a-row style="padding: 5px;">
        <a-col :span="2">
          <a-button @click="showModal">新增</a-button>
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
              <a-form-model-item label="药品名称"
                                 :rules="[{required:true, message:'请输入药品名称', trigger:'blur'}]"
                                 prop="medicine_name">
                <a-input v-model="form.medicine_name"/>
              </a-form-model-item>
              <a-form-model-item label="药品分类"
                                 :rules="[{required:true, message:'请选择药品分类', trigger:'blur'}]"
                                 prop="medicine_goods_type_id">
                <a-select v-model="form.medicine_goods_type_id">
                  <a-select-option v-for="(type, index) in typeList" :key="type.id" :value="type.id">
                    {{type.medicine_type_name}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="药品描述"
                                 :rules="[{required:true, message:'请输入药品描述', trigger:'blur'}]"
                                 prop="medicine_desc">
                <a-input v-model="form.medicine_desc"/>
              </a-form-model-item>
              <a-form-model-item label="药品价格"
                                 :rules="[{required:true, message:'请输入药品价格', trigger:'blur'}]"
                                 prop="medicine_price">
                <a-input-number style="width: 100%;" :precision="2" v-model="form.medicine_price"/>
              </a-form-model-item>
              <a-form-model-item label="药品库存"
                                 :rules="[{required:true, message:'请输入药品库存', trigger:'blur'}]"
                                 prop="medicine_num">
                <a-input-number style="width: 100%;" v-model="form.medicine_num"/>
              </a-form-model-item>
              <a-form-model-item label="图片">
                <a-upload
                    name="pic"
                    :multiple="false"
                    :showUploadList="false"
                    action="http://127.0.0.1:3000/upload"
                    accept=".jpg,.png"
                    @change="handleChange"
                >
                  <a-button> <a-icon type="upload" /> Click to Upload </a-button>
                </a-upload>
              </a-form-model-item>
            </a-form-model>
          </a-col>
        </a-row>
      </a-modal>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: "ID",
    dataIndex: 'id'
  },
  {
    title: '药品名称',
    dataIndex: 'medicine_name',
  },
  {
    title: '药品分类名称',
    dataIndex: 'medicine_type_name',
  },
  {
    title: '药品描述',
    dataIndex: 'medicine_desc',
  },
  {
    title: '药品价格',
    dataIndex: 'medicine_price',
  },
  {
    title: '药品库存',
    dataIndex: 'medicine_num',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'},
  },
];
const defaultForm = {
  id: '',
  medicine_name: '',
  medicine_goods_type_id: '',
  medicine_desc: '',
  medicine_price: 0,
  medicine_num: 0,
  medicine_pic_url:''
};
import request from "@/util/request";

export default {
  name: "MedicineShopGoods",
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
        medicine_pic_url:''
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
  mounted() {
    this.queryByPage();
    this.queryTypeList();
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
      request.post('/medicine/goods/list', param).then(response => {
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
      this.queryByPage();
    },
    submit() {
      if(this.form.medicine_pic_url === '') {
        this.$message.error("请上传图片")
        return;
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          request.post('/medicine/goods/add', this.form).then(res => {
            this.$message.success(res.message)
            this.resetForm();
          })
        }
      });
    },
    deleteType(record) {
      request.post('/medicine/goods/delete', {id: record.id}).then(res => {
        if (res.code == 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
        this.queryByPage();
      })
    },

    queryTypeList() {
      request.post("/medicine/goods/type/all").then(res => {
        this.typeList = res.data;
      })
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.form.medicine_pic_url = info.file.response.data;
        this.$message.success(`${info.file.name}上传成功`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
  }
}
</script>

<style scoped>

</style>