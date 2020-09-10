<template>
  <div>
    <el-card>
      <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" :closable="false" show-icon></el-alert>
      <div class="select">
        <div class="desc">选择商品分类:</div>
        <div class="cascader">
          <el-cascader
            style="width: 100%;"
            v-model="selectValue"
            :options="selectList"
            expandTrigger="hover"
            :props="selectProps"
            @change="handleChange"
          ></el-cascader>
        </div>
      </div>
      <div class="tab">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button
              type="primary"
              @click="addDialog = true"
              size="mini"
              :disabled="selectValue.length === 0"
            >添加参数</el-button>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column label="#" type="index" align="center"></el-table-column>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    style="margin-right: 15px;"
                    :key="item"
                    v-for="(item, index) in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(index, scope.row)"
                  >{{item}}</el-tag>
                  <el-input
                    style="width: 300px"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="addTag(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column label="参数名称" prop="attr_name" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="small"
                    @click="showMany(scope.row)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    @click="deleteAttr(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="静态属性" name="only">
            <el-button
              type="primary"
              @click="addDialog = true"
              size="mini"
              :disabled="selectValue.length === 0"
            >添加属性</el-button>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column label="#" type="index" align="center"></el-table-column>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    style="margin-right: 15px;"
                    :key="item"
                    v-for="(item, index) in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(index, scope.row)"
                  >{{item}}</el-tag>
                  <el-input
                    style="width: 300px"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="addTag(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column label="参数名称" prop="attr_name" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="small"
                    @click="showMany(scope.row)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    @click="deleteAttr(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    
    <el-dialog title="修改动态参数" :visible.sync="updateDialog" width="30%" :show-close="false">
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="动态参数" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEidt('editForm')">取 消</el-button>
        <el-button type="primary" @click="updateAttr('editForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="addDialog" width="30%" :show-close="false">
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="动态参数" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('addForm')">取 消</el-button>
        <el-button type="primary" @click="addAttr('addForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "添加动态参数",
      selectList: [],
      selectValue: [],
      selectProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      activeName: "many",
      tableData: [],
      // 参数id
      id: "",
      sel: "many",
      updateDialog: false,
      editForm: {
        name: "",
        id: "",
        attrId: "",
        attr_sel: ""
      },
      rules: {
        name: [
          { required: true, message: "参数名不能为空", trigger: "blur" },
          { min: 2, max: 10, message: "参数名在2-10位之间", trigger: "blur" }
        ]
      },
      onlyDialog: false,
      addDialog: false,
      addForm: {
        name: ""
      }
    };
  },
  components: {},
  methods: {
    getCatgory() {
      this.$api
        .getCategory({
          type: 3
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.selectList = res.data;
          }
        });
    },
    getAttrs() {
      this.$api
        .getAttrs({
          id: this.id,
          sel: this.sel
        })
        .then(res => {
          if (res.meta.status === 200) {
            res.data.map(item => {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
              item.inputVisible = false;
              item.inputValue = "";
            });
            this.tableData = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleChange() {
      this.id = this.selectValue[2];
      this.getAttrs();
    },
    tabClick(tab) {
      this.sel = tab.name;
      this.title = "添加静态属性";
      this.getAttrs();
    },
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.$api
        .editAttrs({
          id: this.id,
          attrId: row.attr_id,
          attr_name: row.attr_name,
          attr_sel: this.sel,
          attr_vals: row.attr_vals.join(" ")
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg);
            this.inputValue = "";
            this.inputVisible = false;
          } else {
            this.$message.error(res.meta.msg);
            this.inputVisible = false;
          }
        });
    },
    addTag(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim() !== "") {
        row.attr_vals.push(row.inputValue.trim());
        row.inputValue = "";
        row.inputVisible = false;
        this.$api
          .editAttrs({
            id: this.id,
            attrId: row.attr_id,
            attr_name: row.attr_name,
            attr_sel: this.sel,
            attr_vals: row.attr_vals.join(" ")
          })
          .then(res => {
            if (res.meta.status === 200) {
              this.$message.success(res.meta.msg);
              this.inputValue = "";
              this.inputVisible = false;
            } else {
              this.$message.error(res.meta.msg);
              this.inputVisible = false;
            }
          });
      } else {
        this.$message.error("添加内容不能为空");
        return;
      }
    },
    showMany(row) {
      this.editForm.name = row.attr_name;
      this.editForm.id = row.cat_id;
      this.editForm.attrId = row.attr_id;
      this.editForm.attr_sel = row.attr_sel;
      this.updateDialog = true;
    },
    showOnly() {
      this.onlyDialog = true;
    },
    cancelEidt(formName) {
      this.updateDialog = false;
      this.$refs[formName].resetFields();
    },
    updateAttr(formName) {
      this.$api
        .editAttrs({
          id: this.editForm.id,
          attrId: this.editForm.attrId,
          attr_name: this.editForm.name,
          attr_sel: this.editForm.attr_sel
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg);
            this.$refs[formName].resetFields();
            this.getAttrs();
            this.updateDialog = false;
          } else {
            this.$message.error(res.meta.msg);
            this.$refs[formName].resetFields();
            this.updateDialog = false;
          }
        });
    },
    cancelAdd(formName) {
      this.addDialog = false;
      this.$refs[formName].resetFields();
    },
    addAttr(formName) {
      this.$api
        .addAttrs({
          id: this.id,
          attr_name: this.addForm.name,
          attr_sel: this.sel
        })
        .then(res => {
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg);
            this.$refs[formName].resetFields();
            this.getAttrs();
            this.addDialog = false;
          }
        })
        .catch(err => {
          this.$message.error(res.meta.msg);
          this.$refs[formName].resetFields();
          this.addDialog = false;
        });
    },
    async deleteAttr(row) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该选项, 是否继续?",
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
      let res = await this.$api.deleteAttr({
        id: row.cat_id,
        attrid: row.attr_id
      });
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg);
        this.getAttrs();
      } else {
        this.$message.error("删除失败");
      }
    }
  },
  mounted() {
    this.getCatgory();
  },
  watch: {},
  computed: {}
};
</script>

<style scoped lang='scss'>
.select {
  display: flex;
  align-items: center;
  margin: 20px 0;
  .desc {
    font-size: 18px;
    margin-right: 20px;
  }
  .cascader {
    width: 250px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>