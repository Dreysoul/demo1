<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top:15px" >
      <!-- 搜索与添加 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input 
            placeholder="请输入内容" 
            v-model="param.query" 
            clearable  
             @clear="getUserList"
            class="input-with-select"
           >
              <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button @click="addDialogVisible=true" type="primary">添加用户</el-button>
          </el-col>
        </el-row>
          <el-table
          :data="UserList"
          border style="width: 100%">
          <el-table-column 
          prop="id"
          label="id">
            
          </el-table-column>
          <el-table-column
            label="姓名"
            prop="username"
            width="180">
          </el-table-column>
          <el-table-column
            label="邮箱"
            prop="email"
            width="180">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话">
          </el-table-column>
          <el-table-column
          prop="role_name" 
          label="角色">

          </el-table-column>
          <el-table-column
          label="状态">

          <!-- 定义一个作用域插槽，用slot-scope接收作用域数据 -->
            <template slot-scope="scope">
              <!-- {{scope.row}} -->
              <el-switch 
              v-model="scope.row.mg_state" 
              @change="userStateChanged(scope.row.id,scope.row.newState)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
          label="操作" width="180px">

          <!-- 添加template组件插槽，目的获取表格数据 -->
          <template slot-scope="scope">
          <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" 
            size="mini" @click="showEditDialog(scope.row.id)"></el-button>
          <!--删除  -->
            <el-button @click="remove(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
          <!-- 分配角色 -->
          <!-- 设置提示 -->
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" 
              icon="el-icon-setting" 
              size="mini" 
              @click="AssignRoleDialog(scope.row)"></el-button>
          </el-tooltip>
          </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          
          :current-page="param.pagenum" 
          :page-sizes="[2, 5, 10, 20]"
          :page-size="param.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <!-- 添加用户 -->
      <el-dialog
      @close="addDialogClosed"
        title="添加用户"
        :visible.sync="addDialogVisible" 
        width="40%">
        <!-- addDialogVisible 布尔值控制添加框弹出-->
        <!-- 内容主体 -->
        <el-form :model="addFrom" :rules="addFormRules" 
        ref="addFromRef" label-width="70px">
        <!-- addFrom.username双向绑定数据，from绑定设定的对象addFrom -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addFrom.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addFrom.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户 -->
      <el-dialog
       @close="EditDialogClosed"
        title="修改用户"
        :visible.sync="EditdialogVisible"
        width="30%">
        <!-- 编辑主体 -->
        <el-form :model="EditFrom" :rules="EditFormRules" 
        ref="EditFromRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="EditFrom.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="EditFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="EditFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 编辑底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="EditdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="EditUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户角色权限 -->
      <el-dialog title="分配用户权限"
       :visible.sync="assignroleVisible">
        <el-form label-position="left">
          <el-form-item label="用户名:">{{EditFrom.id}}</el-form-item>
          <el-form-item label="用户角色:">{{EditFrom.role_name}}</el-form-item>
          <el-form-item  label="分配角色:" label-width="100px">
            <el-select v-model="role" :placeholder="EditFrom.role_name">
              <el-option 
              v-for="item in roleList" 
              :key="item.id" 
              :label="item.roleName" 
              :value="item.roleName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="assignroleVisible = false">取 消</el-button>
          <el-button type="primary" @click="assignrole">确 定</el-button>
        </div>
      </el-dialog>
      
    </div>
</template>

<script>
  export default {
    data() {
      // 自定义添加表单数据检查规则
      //验证邮箱数据格式
      var checkEmail=(rule, value, cb) => {
        const regEmail = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
        if(regEmail.test(value)){
          //合法邮箱
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
      //验证手机号数据格式
      var checkMobile=(rule, value, cb) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)){
          //合法邮箱
          return cb()
        }
        cb(new Error('请输入合法的手机号'))
      }

      return {
        mg_state:true,
        total:0,
        param:{
            query:'',
            pagenum:1, //几页
            pagesize:2 //每页几条数据
          },
        UserList: [],
        addDialogVisible:false,//控制添加对话框
        EditdialogVisible:false,//控制编辑对话框
        //添加用户的表单数据
        addFrom:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        //当前被选中的用户信息保存
        EditFrom:{
          
        },
        //分配角色选择的角色
        role:'',
        //添加表单的验证规则对象
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', 
            trigger: 'blur' },
            {min:3,max:10,message:'用户名的长度在3-10个字符之间',
            trigger: 'blur'}],
          password: [
            { required: true, message: '请输入密码', 
            trigger: 'blur' },
            {min:6,max:15,message:'密码的长度在6-15个字符之间',
            trigger: 'blur'}],
          email:[
            { required: true, message: '请输入邮箱', 
            trigger: 'blur' },
            {validator:checkEmail,
            trigger: 'blur'}],
          mobile:[
            { required: true, message: '请输入手机', 
            trigger: 'blur' },
            {validator:checkMobile,
            trigger: 'blur'}],
          },
          //编辑表单的验证规则
          EditFormRules:{
            email:[
               { required: true, message: '请输入邮箱', 
                trigger: 'blur' },
                {validator:checkEmail,trigger: 'blur'}
            ],
            mobile:[
            { required: true, message: '请输入手机', 
            trigger: 'blur' },
            {validator:checkMobile,
            trigger: 'blur'}],
          },
          // 控制角色分配框
          assignroleVisible:false,
          //角色列表
          roleList:[],
      }
    },
    methods: {
      change(){
        this.mg_state=false
      },
      async getUserList(){
      const {data : res} = await this.axios.get('users',{
            params:this.param
       })
        console.log(res);
        this.UserList=res.data.users
        this.total=res.data.total
      },
        //页面大小改变时触发
      handleSizeChange(newSize){
        // console.log(newSize)
        this.param.pagesize=newSize
        this.getUserList()
      },
        //页数变化时触发
      handleCurrentChange(newPage){
        // console.log(newPage)
        this.param.pagenum=newPage
        this.getUserList()
      },
      async userStateChanged(id,newState){
        const { data: res } = await this.axios.put(`users/${id}/state/${newState}`)
        if (res.meta.status !== 200) {
          param.mg_state=!this.param.mg_state
        return this.$message.error('更新状态失败！')
        }
        this.$message.success('更新用户状态成功')
      },
      //监听添加用户对话框关闭重置
      addDialogClosed(){
        this.$refs.addFromRef.resetFields()
      },
      //监听编辑用户对话框关闭重置
      EditDialogClosed(){
         this.$refs.EditFromRef.resetFields()
      },
      //点击按钮添加用户
      addUser(){
        //表单预校验
        this.$refs.addFromRef.validate(async valid=>{
          // console.log(valid);
          if (!valid) return 
          //发起添加他用户网络请求
          const {data : res} = await this.axios.post('users',this.addFrom)
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败！')
          }
          this.$message.success('添加用户成功！')
          //隐藏用户对话框
          this.addDialogVisible=false
          this.getUserList()
        })
      },
      //监听修改按钮展示编辑用户框
      async showEditDialog(id){
        const {data : res} = await this.axios.get('users/'+id)
        if(res.meta.status !==200){
          return this.$message.error('查询用户信息失败')
        }
        this.EditFrom=res.data
        console.log(this.EditFrom);
        this.EditdialogVisible=true
      },
      EditUser(){
        //修改表单预验证
        this.$refs.EditFromRef.validate(async valid=>{
          // console.log(valid);
          if(!valid) return
          const {data : res} = await this.axios.put('users/'+this.EditFrom.id,
          // 请求体
          {email:this.EditFrom.email,
          mobile:this.EditFrom.mobile})
          if (res.meta.status !== 200) {
            this.$message.error('修改用户失败！')
          }
          //隐藏用户对话框
          this.EditdialogVisible=false
          this.getUserList()
          this.$message.success('修改用户成功！')
        })
      },
      //删除用户
      async remove(id){
        const confirmResult=await this.$confirm('此操作将永久删除用户，是否继续？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).catch(err=>err)
        if (confirmResult!=='confirm') {
          return this.$message.info('已取消删除')
        }
        console.log('确认了删除');
        const {data : res}=await this.axios.delete('users/'+id)
         if(res.meta.status!==200) return this.$message.error('删除用户失败')
            this.$message.success('用户删除成功')
            this.getUserList()
        // .then(async ()=>{
        //    const {data : res}=await this.axios.delete('users/'+id)
        //    if(res.meta.status!==200) return this.$message.error('删除用户失败')
        //     this.$message.success('用户删除成功')
        //     this.getUserList()
        // }).catch(()=>{
        //    this.$message.info('已取消删除')
        // // this.getUserList()
        // })
        // // const {data : res}=await this.axios.delete('users/'+id)
        // // if(res.meta.status!==200) return this.$message.error('删除用户失败')
      },
      async AssignRoleDialog(selectUser){
        // 得到被选中的角色信息
        this.EditFrom=selectUser
        //请求当前的角色权限列表
        const {data : res} = await this.axios.get('roles')
        this.roleList=res.data
        console.log(this.roleList);
       
        // 打开分配角色对话框
        this.assignroleVisible=true
      },
      //分配角色权限方法
      async assignrole(){
        this.roleList.forEach(async item=>{
          if (item.roleName===this.role){
           const {data:res}=await this.axios.put('users/'+this.EditFrom.id+'/role',{
              rid: item.id
            })
            //关闭角色分配对话框
            this.assignroleVisible=false
           if(res.meta.status===200){
            this.$message.success(res.meta.msg)
            this.getUserList()
           }else{
             this.$message.error("权限分配失败")
            this.getUserList()
           }
          }
        })
      }
    },
    created(){
      this.getUserList()
    }
  }
</script>

<style>

</style>
