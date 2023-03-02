<template>
  <div>
   <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top:15px" >
      <!-- 搜索与添加 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input 
            placeholder="请输入内容" 
            v-model="param.query" 
            clearable  
             @clear="getOrderList"
            class="input-with-select"
           >
              <el-button @click="getOrderList" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>
         <el-table
          :data="OrderList"
          border style="width: 100%">
          <el-table-column 
         type="index"
          label="#"
           stripe>
          </el-table-column>
          <el-table-column
           width="210px"
            label="订单编号"
            prop="order_number"
          >
          </el-table-column>
          <el-table-column
            label="订单价格"
            prop="order_price"
           >
          </el-table-column>
          <el-table-column
            prop="pay_status"
            label="是否付款">
            <template slot-scope="scope">
            <el-tag type="danger" size="mini" v-if="scope.row.pay_status">未付款</el-tag>
            <el-tag type="success" size="mini" v-else>已付款</el-tag>
          </template>
          </el-table-column>
          <el-table-column
          prop="is_send" 
          label="是否发货">
          </el-table-column>
          <el-table-column
          prop="create_time"
          label="下单时间">
          </el-table-column>
          <el-table-column
          label="操作">
          <!-- 添加template组件插槽，目的获取表格数据 -->
          <template >
          <!-- 修改 -->
            <el-button type="primary" 
            icon="el-icon-edit" 
            size="mini"></el-button>
          <!--删除  -->
            <el-button type="success" 
            icon="el-icon-location" 
            size="mini"></el-button>
          </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          
          :current-page="param.pagenum" 
          :page-sizes="[10, 15, 20, 25]"
          :page-size="param.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
      return {
        total:0,
        param:{
            query:'',
            pagenum:1, //几页
            pagesize:10,//每页几条数据
            user_id:'', //用户 ID
            pay_status:'',//支付状态
            is_send:'',//是否发货
            order_fapiao_title:'',//['个人','公司']
            order_fapiao_company:'',//公司名称
            order_fapiao_content:'',//发票内容
            consignee_addr:'',//发货地址
          },
        OrderList: [],//订单数据
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      async getOrderList(){
      const {data : res} = await this.axios.get('orders',{
            params:this.param
       })
        console.log(res);
        this.OrderList=res.data.goods
        this.total=res.data.total
      },
        //页面大小改变时触发
      handleSizeChange(newSize){
        // console.log(newSize)
        this.param.pagesize=newSize
        this.getOrderList()
      },
        //页数变化时触发
      handleCurrentChange(newPage){
        // console.log(newPage)
        this.param.pagenum=newPage
        this.getOrderList()
      },
    },

}
</script>

<style>

</style>