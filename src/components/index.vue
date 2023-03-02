<template>
  <div class="home_contaoner">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
         <img src="../assets/logo.png" alt />
        <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout" class="logout">退出</el-button>
      </el-header>
      <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togleCollapse">|||</div>
        <el-menu 
        unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="#409FFF"
        > 
         <!-- :unique-opened="true"->只允许展开一个菜单 -->
           <!-- :collapse-transition="false" -> 关闭动画 -->
           <!-- router -> 导航开启路由模式 -->
        <!-- :index="1" -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"  @click="saveNavState('/' + subItem.path)">
                <template  slot="title">
                   <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      </el-container>
      </el-container>
  </div>
</template>
<script>
export default {
  data(){
    return{
      menuList:[],
      iconObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-check',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-data'
      },
      // 默认不折叠
      isCollapse: false,
      // 被激活导航地址
      activePath: ''
    }
  },
  methods:{
    logout(){
      this.$router.push('/login')
      //session的一个清空
      window.sessionStorage.clear()
      this.$message.success('退出成功')
    },
    async getMenuList(){
      const {data:res} = await this.axios.get('menus')
      console.log(res);
      this.menuList=res.data
      this.$message.success(res.meta.msg)
    },
    // 菜单的折叠与展开
    togleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活地址
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  },
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style scoped>
.home_contaoner{
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373f41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
    display: flex;
    align-items: center;  
  }
.el-header div  img {
      height: 40px;
}
.el-header div span {
      margin-left: 15px;
 }
.el-aside {
  background-color: #333744;
}
.el-aside  .el-menu {
    border: none;
  }
.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  /*  鼠标放上去变成小手 */
  cursor: pointer;
}
</style>
