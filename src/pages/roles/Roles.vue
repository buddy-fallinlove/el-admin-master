<template>
  <div class="container">
    <el-card>
      <div class="btn">
        <el-button type="primary" @click="showAdd">添加角色</el-button>
      </div>
      <div class="table">
        <el-table :data="roles" style="width: 100%" border stripe>
          <el-table-column type="expand">
            <template slot-scope="props">
              <div v-if="props.row.children.length > 0">
                <div v-for="(item, index) in props.row.children" :key="index" class="level">
                  <div class="levelone">
                    <el-tag closable @close="removeRightById(props.row, item.id)">{{item.authName}}</el-tag>
                    <span class="right-icon">
                      <i class="el-icon-caret-right"></i>
                    </span>
                  </div>
                  <div class="leveltwo" v-if="item.children.length > 0">
                    <div v-for="(item1, index1) in item.children" :key="index1" class="two-tag">
                      <el-tag
                        type="success"
                        closable
                        @close="removeRightById(props.row, item1.id)"
                      >{{item1.authName}}</el-tag>
                      <span class="right-icon">
                        <i class="el-icon-caret-right"></i>
                      </span>
                      <div
                        class="leveltwo levelthree"
                        v-if="item1.children && item1.children.length > 0"
                      >
                        <div
                          v-for="(item2, index2) in item1.children"
                          :key="index2"
                          class="two-tag"
                        >
                          <el-tag
                            style="margin-left:20px;"
                            type="warning"
                            closable
                            @close="removeRightById(props.row, item2.id)"
                          >{{item2.authName}}</el-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="props.row.children.length === 0">暂无权限</div>
            </template>
          </el-table-column>
          <el-table-column label="#" type="index" align="center"></el-table-column>
          <el-table-column label="职位" prop="roleName" align="center"></el-table-column>
          <el-table-column label="描述" prop="roleDesc" align="center"></el-table-column>
          <el-table-column label="操作" width="350" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteRole(scope.row)">删除</el-button>
              <el-button type="warning" size="mini" @click="setting(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="添加角色" :visible.sync="addDialog" :show-close='false' width="30%">
      <div>
        <el-form :model="addRuleForm" :rules="rules" ref="addRuleForm" label-width="100px">
          <el-form-item label="角色名" prop="name">
            <el-input v-model="addRuleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="desc">
            <el-input v-model="addRuleForm.desc"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('addRuleForm')">取 消</el-button>
        <el-button type="primary" @click="addRole('addRuleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="updateDialog" :show-close='false' width="30%">
      <div>
        <el-form :model="updateRuleForm" :rules="rules" ref="updateRuleForm" label-width="100px">
          <el-form-item label="角色名" prop="name">
            <el-input v-model="updateRuleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="desc">
            <el-input v-model="updateRuleForm.desc"></el-input>
          </el-form-item>
        </el-form>
        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate('updateRuleForm')">取 消</el-button>
        <el-button type="primary" @click="updateRole('updateRuleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="settingDialog" :show-close='false' width="50%" @close="closeSettingDialog">
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      // 添加角色弹出框
      addDialog: false,
      // 编辑角色弹出框
      updateDialog: false,
      // 添加角色表单
      addRuleForm: {
        name: "",
        desc: ""
      },
      // 编辑角色表单
      updateRuleForm: {
        name: "",
        desc: ""
      },
      rules: {
        name: [
          { required: true, message: "角色名不能为空", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ]
      },
      // 控制分配权限对话框的显示与隐藏
      settingDialog: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: "",
      // 编辑角色id
      updateId: ""
    };
  },
  components: {},
  methods: {
    // 获取所有角色
    getData() {
      this.$api
        .getRole()
        .then(res => {
          if (res.meta.status === 200) {
            this.roles = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取所有权限
    getRights() {
      this.$api
        .allRights({
          type: "tree"
        })
        .then(res => {
          if (res.meta.status == 200) {
            this.rightslist = res.data;
          }
        });
    },
    // 设置权限
    setting(row) {
      this.roleId = row.id;
      this.getRights();
      this.getLeafKeys(row, this.defKeys);
      this.settingDialog = true;
    },
    // 获取当前角色拥有的权限
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },
    closeSettingDialog() {
      this.defKeys = [];
    },
    // 确定分配权限
    setRoles() {
      let keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      let rids = keys.join(",");
      let roleId = this.roleId;
      this.$api
        .serRoles({
          roleId,
          rids
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg);
            this.getData();
            this.settingDialog = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除！");
      }
      let res = await this.$api.deleteRights({
        roleId: role.id,
        rightId: rightId
      });
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      } else {
        this.$message.success("删除权限成功");
      }
      role.children = res.data;
    },
    showAdd() {
      this.addDialog = true;
    },
    // 添加角色
    addRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api
            .addRole({
              roleName: this.addRuleForm.name,
              roleDesc: this.addRuleForm.desc
            })
            .then(res => {
              if (res.meta.status === 201) {
                this.$message.success("添加成功");
                this.addDialog = false
                this.$refs[formName].resetFields();
                this.getData()
              } else {
                this.$message.error("添加失败");
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });

      this.addDialog = false;
    },
    // 删除角色
    async deleteRole(row) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除！");
      }
      let res = await this.$api.deleteRole({
        id: row.id
      });
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg);
        this.getData();
      } else {
        this.$message.error("删除失败");
      }
    },
    // 取消添加
    cancelAdd(formName) {
      this.$refs[formName].resetFields();
      this.addDialog = false;
    },
    // 取消编辑
    cancelUpdate(formName) {
      this.$refs[formName].resetFields();
      this.updateDialog = false;
    },
    // 显示编辑角色弹出框
    showUpdateDialog(row) {
      this.updateId = row.id;
      this.updateRuleForm.name = row.roleName;
      this.updateDialog = true;
    },
    // 编辑角色
    updateRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api
            .updateRole({
              id: this.updateId,
              roleName: this.updateRuleForm.name,
              roleDesc: this.updateRuleForm.desc
            })
            .then(res => {
              if (res.meta.status === 200) {
                this.updateDialog = false;
                this.$refs[formName].resetFields();
                this.getData();
                this.$message.success("修改成功");
              } else {
                this.$message.error("修改失败");
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    this.getData();
  },
  watch: {},
  computed: {}
};
</script>

<style scoped lang='scss'>
.level {
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
  .levelone {
    padding: 10px 0;
    margin: 2px 0;
    flex: 1;
  }
  .leveltwo {
    flex: 4;
    .two-tag {
      margin: 5px 0;
      display: flex;
      align-items: center;
      &:nth-child(2n) {
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        padding: 10px 0;
      }
    }
  }
  .levelthree {
    margin-left: 60px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .right-icon {
    margin-left: 10px;
  }
}
.btn {
  margin-bottom: 20px;
}
</style>