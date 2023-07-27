<template>
  <el-card class="box-card">
    <el-form  label-width="80px" :model="user" :rules="rules">
       <h2>欢迎来到管理系统</h2>
      <el-form-item label="账号" prop="name" >
        <el-input v-model="user.name" type="text"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password"  >
        <el-input v-model="user.password" type="password" ></el-input>
      </el-form-item>
    </el-form>
        <el-button type="primary" style="width: 200px;" @click="Reigster()">注册</el-button>
  </el-card>
</template>

<script>
export default {
  name: 'regIndex',
  data () {
    return {
      user: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.Reigster()
  },
  methods: {
    Reigster () {
      console.log('123')
    }
  }
}

</script>

<style lang="less" scoped>
.box-card{
    width: 500px;
    height: 400px;
    margin: 0 auto;
    margin-top: 300px;
    text-align: center;

//     display: flex;
//    justify-content: center; /* 水平居中 */
//    align-items: center;     /* 垂直居中 */

// display: grid;
//   place-items: center; /* 水平和垂直居中 */
}
</style>
