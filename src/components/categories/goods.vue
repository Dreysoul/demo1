<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top:15px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input 
              placeholder="请输入内容" 
              v-model="param.query" 
              clearable  
              @clear="getGoodsList"
              class="input-with-select">
              <el-button @click="getGoodsList" 
                slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
            <el-button type="primary" @click="addGoodDialogVisible=true">添加商品</el-button>
        </el-col>
      </el-row>
        <!-- 表格数据 -->
        <el-table
            :data="goods"
            border style="width: 100%">
            <el-table-column 
            width="50"
            type="index"
            label="#">
            </el-table-column>
            <el-table-column
              label="商品名称"
              prop="goods_name"
              width="600">
            </el-table-column>
            <el-table-column
              label="商品价格(元)"
              prop="goods_price"
              width="110">
            </el-table-column>
            <el-table-column
              prop="goods_weight"
              label="商品重量">
            </el-table-column>
            <el-table-column
            prop="goods_number" 
            label="商品数量">
            </el-table-column>

             <el-table-column
            prop="add_time" 
            label="创建时间"
            width="110">
            </el-table-column>
            <el-table-column
            label="操作"
             width="120">
            <!-- 添加template组件插槽，目的获取表格数据 -->
            <template>
            <!-- 修改 -->
              <el-button type="primary" icon="el-icon-edit" 
              size="mini"></el-button>
            <!--删除  -->
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
            </el-table-column>
          </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.pagenum" 
          :page-sizes="[5, 10, 20, 30]"
          :page-size="param.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>
     <!-- 添加商品-->
      <el-dialog
      @close="addGoodDialogClosed"
        title="添加商品"
        :visible.sync="addGoodDialogVisible" 
        width="40%">
        <!-- addDialogVisible 布尔值控制添加框弹出-->
        <!-- 内容主体 -->
        <el-form :model="addGoodFrom" 
        ref="addGoodRef"
        label-width="70px">
        <!-- addFrom.username双向绑定数据，from绑定设定的对象addFrom -->
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoodFrom.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="分类列表" prop="goods_cat">
            <el-input v-model="addGoodFrom.goods_cat"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="goods_price">
            <el-input v-model="addGoodFrom.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="goods_number">
            <el-input v-model="addGoodFrom.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="重量" prop="goods_weight">
            <el-input v-model="addGoodFrom.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="介绍" prop="goods_introduce">
            <el-input v-model="addGoodFrom.goods_introduce"></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="pics">
            <el-input v-model="addGoodFrom.pics"></el-input>
          </el-form-item>
          <el-form-item label="商品参数" prop="attrs">
            <el-input v-model="addGoodFrom.attrs"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addGoodDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addGoodDialogVisible=false">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品数据
      goods:[],
      total:0,
      // 请求参数
      param:{
            query:'',
            pagenum:1, //几页
            pagesize:5,//每页几条数据
      },
      addGoodDialogVisible:false,//控制添加对话框弹出 
      //添加商品
      addGoodFrom:{
        goods_name:'', //商品名称
        goods_cat:'', //以为','分割的分类列表
        goods_price:'', //价格
        goods_number:'', //数量
        goods_weight:'', //重量
        goods_introduce:'', //介绍
        pics:'', //上传的图片临时路径（对象）
        attrs:'' //商品的参数（数组），包含 `动态参数` 和 `静态属性`
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList(){
      const {data:res}=await this.axios.get('/goods',{
        params:this.param
      })
      //得到查询总数
      this.total=res.data.total
      //得到分页查询的数据
      this.goods=res.data.goods
      console.log( this.goods);
    },
    //页面大小改变时触发
    handleSizeChange(newSize){
    // console.log(newSize)
    this.param.pagesize=newSize
    this.getGoodsList()
    },
  //页数变化时触发
    handleCurrentChange(newPage){
    // console.log(newPage)
    this.param.pagenum=newPage
    this.getGoodsList()
    },
    // 添加商品

    //监听添加商品对话框关闭重置
    addGoodDialogClosed(){
      this.$refs.addGoodRef.resetFields()
    },

  },

}
</script>

<style>

</style>