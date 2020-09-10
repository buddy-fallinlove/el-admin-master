import { setRole } from '../../../server/services/ManagerService';
<template>
  <div>
    <el-card>
      <div class="top">
      <div class="search">
        <el-input placeholder="请输入搜索内容" v-model="searchValue" clearable>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
      <div class="btn">
        <el-button type="primary" @click="addDialog = true">添加用户</el-button>
      </div>
    </div>
    <div class="table">
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="编辑角色"
              placement="top"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="editClick(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="删除角色"
              placement="top"
            >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteUser(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="showSetting(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[ 5, 15, 20, 30]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="addDialog" :show-close='false' width="40%">
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('addForm')">取 消</el-button>
        <el-button type="primary" @click="addUser('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="editDialog" :show-close='false' width="40%">
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit('editForm')">取 消</el-button>
        <el-button type="primary" @click="edirUser('editForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配用户" :visible.sync="settingDialog" :show-close='false' width="40%">
      <div class="flex">当前用户: {{setRole.name}}</div>
      <div class="flex">当前角色: {{setRole.role}}</div>
      <el-select v-model="selectValue" placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSet">取 消</el-button>
        <el-button type="primary" @click="settingRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let phoneCheck = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的手机号"));
    };
    return {
      // 用户列表
      userList: [],
      // 请求页数
      pagenum: 1,
      // 请求条数
      pagesize: 5,
      // 总数
      total: 0,
      // 搜索关键词
      searchValue: "",
      // 添加用户弹出框
      addDialog: false,
      // 添加用户的表单
      addForm: {
        name: "",
        password: "",
        email: "",
        phone: ""
      },
      // 添加用户的验证
      addRules: {
        name: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "电话不能为空", trigger: "blur" },
          {
            validator: phoneCheck,
            message: "请输入正确的电话",
            trigger: "blur"
          }
        ]
      },
      // 显示修改弹框
      editDialog: false,
      // 修改用户的表单
      editForm: {
        id: "",
        email: "",
        phone: ""
      },
      // 修改用户的验证
      editRules: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "电话不能为空", trigger: "blur" },
          {
            validator: phoneCheck,
            message: "请输入正确的电话",
            trigger: "blur"
          }
        ]
      },
      // 显示分配角色
      settingDialog: false,
      // 分配角色
      setRole: {
        id: '',
        name: "",
        role: ""
      },
      // 所有角色
      roleList: [],
      // 下拉框的值
      selectValue: ""
    };
  },
  components: {},
  methods: {
    // 获取全部数据
    getData() {
      this.$api
        .getUsers({
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        .then(res => {
          if (res.meta.status === 200) {
            res.data.users.map((item, index) => {
              this.$set(item, "index", index + 1);
            });
            this.userList = res.data.users;
            this.total = res.data.total;
          }
        });
    },
    // 改变用户状态
    changeState(row) {
      this.$api
        .updateUserState({
          uId: row.id,
          type: row.mg_state
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg);
          } else {
            this.$message.error("修改失败");
          }
        });
    },
    // 搜索
    search() {
      this.$api
        .getUsers({
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          query: this.searchValue
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.userList = res.data.users;
            this.total = res.data.total;
          }
        });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getData();
    },
    // 取消添加
    cancelAdd(formName) {
      this.addDialog = false;
      this.$refs[formName].resetFields();
    },
    // 添加用户
    addUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api
            .addUser({
              username: this.addForm.name,
              password: this.addForm.password,
              email: this.addForm.email,
              mobile: this.addForm.phone
            })
            .then(res => {
              if (res.meta.status === 201) {
                this.$message.success(res.meta.msg);
                this.getData();
                this.$refs[formName].resetFields();
                this.addDialog = false;
              } else {
                this.$message.error("添加失败");
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除用户
    async deleteUser(row) {
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
      let res = await this.$api.deleteUser({
        id: row.id
      });
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg);
        this.getData();
      } else {
        this.$message.error("删除失败");
      }
    },
    // 取消编辑
    cancelEdit(formName) {
      this.editDialog = false;
      this.$refs[formName].resetFields();
    },
    // 显示编辑弹框
    editClick(row) {
      this.editForm.id = row.id;
      this.editForm.name = row.username;
      this.editForm.email = row.email;
      this.editForm.phone = row.mobile;
      this.editDialog = true;
    },
    // 编辑用户
    edirUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api
            .updateUser({
              uId: this.editForm.id,
              email: this.editForm.email,
              mobile: this.editForm.phone
            })
            .then(res => {
              if (res.meta.status === 200) {
                this.$message.success(res.meta.msg);
                this.getData();
                this.$refs[formName].resetFields();
                this.editDialog = false;
              } else {
                this.$message.error("修改失败");
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showSetting(row) {
      this.setRole.id = row.id
      this.setRole.name = row.username;
      this.setRole.role = row.role_name;
      this.$api.getRole().then(res => {
        if (res.meta.status === 200) {
          console.log(res.data)
          this.roleList = res.data;
        }
      });
      this.settingDialog = true;
    },
    settingRole() {
      this.$api.serUserRole({
        id: this.setRole.id,
        rid: this.selectValue
      }).then(res => {
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
          this.getData()
          this.selectValue = ''
          this.settingDialog = false
        } else {
          this.$message.error(res.meta.msg)
        }
      })
    },
    cancelSet () {
      this.settingDialog = false
      this.selectValue = ''
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
.top {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  .search {
    width: 30%;
    margin-right: 20px;
  }
}
.flex {
  display: flex;
  align-items: center;
  height: 40px;
  margin: 5px 0;
  &:first-child {
    margin: 0;
  }
}
</style>