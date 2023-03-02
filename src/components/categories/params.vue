<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top:15px">
       <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

       <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="paramlist"
            :props="Props"
             @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab栏 -->
       <el-tabs  v-model="activeTabsName" 
       @tab-click="handleTabsClick">
         <!-- @tab-click tab栏切换触发事件 -->
         <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button  type="primary" @click="showAddailog">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>
                <!-- 输入Tag文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index">
            </el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column>
              <template>
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"     
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性"  name="only">
          <el-button  type="primary" @click="showAddailog">添加属性</el-button>
           <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
             <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>
                <!-- 输入Tag文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column>
              <template>
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"     
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
       </el-tabs>
       <!-- 添加参数 -->
        <el-dialog
          :title=" '添加' + title"
          :visible.sync="Adddialog">
            <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef">
              <el-form-item :label="title" prop="attr_name" label-width="100px">
                <el-input v-model="addFrom.attr_name"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="Adddialog = false">取 消</el-button>
              <el-button type="primary" @click="addParams">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {

  data() {
    return {
       // 商品分类列表
      cateList: [],
       // 级联选择框的配置对象
      Props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //   级联选择框双向绑定对象
      selectedCateKeys: [],
      // 级联绑定的全部数据
      paramlist:[],
       //   激活页签名称
      activeTabsName: 'many',
      // 动态参数
      manyTableData:[],
      //静态属性
      onlyTableData:[],
      // 添加属性还是参数
      title:'动态参数',

      //控制添加dialog
      Adddialog:false,
      //   添加表单的数据对象
      addFrom: {
        attr_name: ''
      },
       //   添加表单的验证规则
      addFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
    }
  },
  methods:{
     // 获取父级分类的数据
    async getparamlist () {
      const { data: res } = await this.axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败！')
      }
      this.paramlist = res.data
      console.log(this.paramlist);
    },
    
    handleTabsClick(){
     this.getParamsData()
    },
    //选择分类物品后触发事件
    handleChange(){
      this.getParamsData()
    },
    async getParamsData(){
        // 只允许选择三级分类：
      // 通过数组的长度判断
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        // 清空表格数据
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      //   根据所选分类的Id,和当前面板的参数, 获取对应的参数
      const { data: res } = await this.axios.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activeTabsName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      res.data.forEach(item => {
        //   通过三元表达式判断attr_vals是否为空 即Tag的集合数组是否为空
        //以空格拆分数据
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []

        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框的输入值
        item.inputValue = ''
      })
      if (this.activeTabsName === 'many') {
        this.manyTableData = res.data
        this.title='动态参数'
      } else {
        this.onlyTableData = res.data
        this.title='静态属性'
      }
    },
    //添加对话框
    showAddailog(){
      this.Adddialog=true
    },
    // 添加参数
    addParams () {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeTabsName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.Adddialog = false
        this.getParamsData()
      })
    },
     // 文本框失去焦点,或者按下Enter触发
    handleInputConfirm (row) {
      // 输入的内容为空时，清空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 提交数据库，保存修改
      this.saveAttrVals(row)
    },
    // 将对attr_vals（Tag） 的操作 保存到数据库
    async saveAttrVals (row) {
      const { data: res } = await this.axios.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    },
    // 点击按钮显示输入框
    showInput(row){
      row.inputVisible = true
      //   让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
     // 删除对应的参数可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  created(){
    this.getparamlist()
  },
  computed:{
    // 获取当前选中的三级分类Id
    getCateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    //获取当前添加添加操作
    getTitleText () {
      if (this.activeTabsName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
}
</script>

<style  scoped>
.input-new-tag {
  width: 90px;
}
</style>