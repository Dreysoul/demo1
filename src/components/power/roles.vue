<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top:15px" >
          <el-col :span="3">
            <el-button  type="primary" @click="showAddRightDialog">添加用户</el-button>
          </el-col>
        <el-table 
        :data="rolesList"  border stripe>
        <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 一级目录 -->
              <el-row
               class="vcenter"
               v-for="item1 in scope.row.children" :key="item1.id">
                <el-col :span="6">
                  <el-tag
                  @close="removeRightById(scope.row, item1.id)"
                    closable>
                    {{item1.authName}}
                  </el-tag>
                </el-col>
                <!-- 二级目录 -->
                <el-col :span="18">
                  <el-row
                   class="vcenter"
                   v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag
                    @close="removeRightById(scope.row, item2.id)"
                    type="success"
                      closable>
                      {{item2.authName}}
                    </el-tag>
                  </el-col>
                    <el-col :span="18">
                      <el-tag
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children" :key="item3.id"
                    closable>
                    {{item3.authName}}
                  </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>  
          <el-table-column
           type="index"
          label="#" width="50">
          </el-table-column>
          <el-table-column 
          label="角色名称"
          prop="roleName">
          </el-table-column>
          <el-table-column
            label="角色描述"
             prop="roleDesc">
          </el-table-column>
          <el-table-column
            label="操作"
            width="300">
            <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
          </el-table-column>
         
        </el-table>
        <!-- 分配权限 -->
        <el-dialog
          title="分配权限"
          :visible.sync="setRightDialogVisible"
          width="40%"
          @close="setRightDialogClosed"
        >
         <!-- 树形控件 -->
        <el-tree
          :data="rightslist"
          :props="defaultProps"
          ref="treeRef"
          show-checkbox
          node-key="id"
          :default-checked-keys="defKeys"
            default-expand-all
          >
          <!--   default-expand-all展开至最低级目录 -->
        </el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelRight">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
          </span>
    </el-dialog>
      <!-- 添加角色对话框 -->
    <el-dialog title="添加角色"
     :visible.sync="AddRoleDialogVisible"
      width="40%"
       @close="addRoleDialogClosed">
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddRight">确 定</el-button>
      </span>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){

    return{
      //存储获取的roles数据
      rolesList:[],
      //控制分配角色弹框
      setRightDialogVisible:false,
      //控制添加角色框
      AddRoleDialogVisible:false,
      //角色权限列表
      rightslist: [],
      //添加角色表单
      addRoleForm:{},
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      //   即将分配权限的Id
      roleId: 0,
      //存储要分别配的权限
      keys:[],
      // 存储默认选中的i权限d值
      defKeys:[],
      defaultProps: {
          children: 'children',
          label: 'authName',
        },
    }
  },
  created(){
    this.GetRolesList()
  },
  methods: {
      async GetRolesList(){
        const {data:res}=await this.axios.get('roles')
        if(res.meta.status!==200){
          return this.$message.error('获取角色列表失败')
        }
        this.rolesList=res.data
        console.log(this.rolesList)
      },
      //删除角色权限
      async removeRightById(role,rightId){
        console.log(role);
        console.log(rightId);
        const {data:res}=await this.axios.delete(
          `roles/${role.id}/rights/${rightId}`)
        console.log(res);
        if(res.meta.status!==200){
          this.$message.error('删除用户权限失败')
        }else{
          this.$message.success('删除用户权限成功')
        }
        this.GetRolesList()
      },
      //分配权限
      //打开权限表弹框
       async showSetRightDialog(role){
        this.roleId = role.id
        console.log(this.roleId);
        //获取角色的所有权限
        const {data:res}=await this.axios.get('rights/tree')
        // console.log(res);
        if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
        //获取角色权限树数据
        this.rightslist=res.data
        //递归获取三级权限节点id
        this.getLeafkeys(role, this.defKeys)
        
        this.setRightDialogVisible = true
      },
      //获取权限列表中选中的三级权限id,并保存在defkeys数组中
      getLeafkeys(node, arr){
        // 没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafkeys(item, arr))
      },
     //关闭权限表弹框
     setRightDialogClosed(){
      this.defKeys = []
     },
     //取消更新权限方法
     cancelRight(){
      this.setRightDialogVisible=false
      this.defKeys = []
     },
      //监听添加用户对话框关闭重置
      addRoleDialogClosed(){
        this.$refs.addRoleFormRef.resetFields()
      },
    //  添加用户框：
    showAddRightDialog(){
      this.AddRoleDialogVisible=true;
    },
    //添加用户
    async AddRight(){
      console.log(this.addRoleForm);
     this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        this.AddRoleDialogVisible = false
        this.GetRolesList()
      })
    },
      //  分配权限
      async allotRights(roleId){
        //先要获取当前选中和半选中的id
       const keys=[
        // 展开运算符，展开数据
         ...this.$refs.treeRef.getCheckedKeys(), //获取选中的id
          ...this.$refs.treeRef.getHalfCheckedKeys(),//获取半选中的id
       ]
       //分割数据
       const idStr=keys.join(',')
       console.log(idStr);
      //发起分配请求
      const {data:res}=await this.axios.post(`roles/${this.roleId}/rights`,{rids:idStr})
      // console.log(res);
      if(res.meta.status!==200){
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.GetRolesList()
      this.setRightDialogVisible=false
      //设置空数据节点，否则显示是上次的角色权限表
      this.defKeys = []
      },
  },
  
}
</script>

<style>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>