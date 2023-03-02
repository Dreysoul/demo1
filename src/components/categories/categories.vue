<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top:15px">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
      style="margin-top:10px"
       class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        index-text="#"
        :show-row-hover="false"
        show-index
        border 
      >
      <!--
        :columns="columns" 指定列/ 需为table指定列的定义
        :selection-type="false"去除可选框
        :expand-type="false"去除下拉框
        index-text="#" 索引列名称
        show-index:索引排序,
       border:数据框 -->
       <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
     <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" 
    :visible.sync="addCateDialogVisible" 
    width="50%" 
    @close="addCateDialogClosed">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options：数据源 -->
          <!-- props：指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            filterable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
data(){
  return{
    // 商品分类数据
      cateList: [],
    //查询条件
    queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
       total: 0,
      // 为table指定列的定义 prop定义数据的映射
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 当前列 自定义模板
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          // 当前列 自定义模板
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // 当前列 自定义模板
          type: 'template',
          template: 'opt'
        }
      ],
      //控制添加分类对话框
      addCateDialogVisible:false,
      // 选中的父级Id数组
      selectedKeys: [],
       // 添加分类对象
      addCateForm: {
        // 将要添加分类名称
        cat_name: '',
        // 分类父级id
        cat_pid: 0,
        // 分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
       // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 配置触发选项 hover/click
        expandTrigger: 'hover',
        value: 'cat_id', //定义传过来的值为id 便于请求
        label: 'cat_name', //分类的映射名称
        children: 'children'
      },
      
  }
},
created(){
  // 获取分类数据
  this.getCateList()
},
methods:{
  async getCateList(){
    const {data:res}=await this.axios.get('categories',{
      params:this.queryInfo
    })
    if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
    // 给数据列表赋值
      this.cateList = res.data.result
      // 总数据条数
      this.total = res.data.total
    console.log(this.cateList);
  },
  //分页管理的监听页数和每页数
   // 监听 pageSizeChange 页数
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum改变 页的大小
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
     // 添加分类 重置表单
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //打开添加分类对话框
    addCateDialog(){
       // 先获取父级分类数据
      this.getParentCateList()
      this.addCateDialogVisible=true
    },
     // 获取父级分类的数据
    async getParentCateList () {
      const { data: res } = await this.axios.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败！')
      }
      this.parentCateList = res.data
    },
    // 添加分类 选择项发生变化触发
    parentCateChanged () {
      // 如何selectKeys 数组的长度>0 说明选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return 0
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 当前分类的等级
        this.addCateForm.cat_level = 0
      }
    },
      // 添加分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
}
}
</script>

<style>

</style>