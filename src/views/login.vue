<template>
<!-- 登录页面 -->
  <div class="login">
    <div class="login_box">
      <!-- 图标 -->
      <div class="logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单 -->
      <div class="login_form">
        <el-form ref="form" :model="loginform" class="form" :rules="rules">
            <!-- 账号框 -->
          <el-form-item prop="username">
            <el-input v-model="loginform.username" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <!-- 密码框 -->
          <el-form-item prop="password">
            <el-input v-model="loginform.password" type="password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button @click="login" type="primary">登录</el-button>
          </el-form-item>
      </el-form> 
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      loginform:{
        username:'admin',
        password:'123456'
      },
      rules:{
        username:[
          {required:true,message:'账号不能为空',trigger:'blur'},
          {min:3,max:10,message:'长度在3到10个字符'},
        ],
        password:[
          {required:true,message:'密码不能为空',trigger:'blur'},
          {min:3,max:10,message:'长度在3到10个字符'},
        ]
      }
    }
  },
  methods:{
    login(){
      this.$refs.form.validate(async valid=>{
        if(valid){
        const {data:res}= await this.axios.post('login',this.loginform)
        // console.log(res);
        if(res.meta.status === 200){
          this.$message.success(res.meta.msg)
          // 把登录成功的token保存到sessionStorage
          window.sessionStorage.setItem('token', res.data.token)
          // 使用编程式导航，跳转到后台主页
           this.$router.push('/index')
        }else{
          this.$message.error(res.meta.msg)
        }
        }
      })
    }
  }
}
</script>

<style scoped>
.login{
  width: 100%;
  height: 100%;
  background-color:#333;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
}
.logo{
  width: 130px;
  height: 130px;
  margin: -50px auto;
  border-radius: 50%;
  background-color: #fff;
  padding: 10px;
  box-shadow: 0 0 10 #666;
}
.logo img{
  width: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form{
  margin-top: 70px;
}
.form{
  padding:0 40px;
}
</style>
