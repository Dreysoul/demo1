<template>
  <div class="box">
    <ul>
      <li>{{ user.name }}</li>
      <li>{{ user.sex }}</li>
      <li></li>
      <li></li>
    </ul>
    <div class="container">
      <el-row :gutter="30" align="bottom">
  <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
</el-row>

  </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'homeIndex',
  data () {
    return {

    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapMutations(['checkinfo'])
  }
}
</script>

<style lang="less" scoped>
.box{
    ul li{
        list-style: none;
    }
    .chart{
        width: 400px;
        height: 400px;
    }
    .container{
      .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
    }
}
</style>
