<template>
  <div>
    <el-card>
      <div class="btn">
        <el-button type="primary" @click="showAdd">添加分类</el-button>
      </div>
      <div>
        <tree-table
          class="table"
          :data="categoryList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          border
          show-index
          index-text="#"
          :show-row-hover="false"
        >
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:skyblue"></i>
            <i class="el-icon-error" v-else style="color:red"></i>
          </template>
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <template slot="option" slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteCategory(scope.row)"
            >删除</el-button>
          </template>
        </tree-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="addDialog" width="35%" :show-close="false">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            style="width: 100%;"
            v-model="selectValue"
            :options="selectList"
            expandTrigger="hover"
            :props="selectProps"
            @change="handleChange"
            change-on-select
            clearable
            :disabled='addForm.name.trim() === ""'
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('addForm')">取 消</el-button>
        <el-button type="primary" @click="addCategory('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑分类" :visible.sync="editDialog" width="35%" :show-close="false">
      <el-form :model="editForm" :rules="addRules" ref="editForm" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit('editForm')">取 消</el-button>
        <el-button type="primary" @click="updateCategory('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      type: 3,
      pagenum: 1,
      pagesize: 5,
      total: 0,
      // 表格每一列
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
          align: "center",
          headerAlign: "center"
        },
        {
          label: "排序",
          type: "template",
          template: "order",
          align: "center",
          headerAlign: "center"
        },
        {
          label: "操作",
          type: "template",
          template: "option",
          align: "center",
          headerAlign: "center"
        }
      ],
      addDialog: false,
      // 添加表单
      addForm: {
        pid: 0,
        name: "",
        // 默认为一级分类
        level: 0
      },
      addRules: {
        name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
          { min: 2, max: 10, message: "分类名称在2-10位之间", trigger: "blur" }
        ]
      },
      // 级联选择器选中的值
      selectValue: [],
      // 所有一级和二级分类
      selectList: [],
      // 级联选择器配置项
      selectProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 编辑分类表单
      editForm: {
        name: "",
        id: ""
      },
      editDialog: false
    };
  },
  components: {},
  methods: {
    getData() {
      this.$api
        .getCategory({
          type: this.type,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        .then(res => {
          if (res.meta.status === 200) {
            if (this.type === 3) {
              this.categoryList = res.data.result;
              this.total = res.data.total;
            }
            if (this.type === 2) {
              this.selectList = res.data;
            }
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
    showAdd() {
      this.type = 2;
      this.pagesize = null;
      this.pagenum = null;
      this.getData();
      this.addDialog = true;
    },
    // 取消添加
    cancelAdd(formName) {
      this.$refs[formName].resetFields();
      this.selectValue = [];
      this.addDialog = false;
    },
    // 级联选择器选择
    handleChange() {
      // 如果this.selectValue的长度大于0 则说明选中了某个父级分类
      // 反之则没有选中任何分类
      if (this.selectValue.length > 0) {
        this.addForm.pid = this.selectValue[this.selectValue.length - 1];
        this.addForm.level = this.selectValue.length;
      } else {
        this.addForm.pid = 0;
        this.addForm.level = 0;
      }
    },
    // 确认添加
    addCategory(formName) {
      this.$api
        .addCategories({
          cat_pid: this.addForm.pid,
          cat_name: this.addForm.name,
          cat_level: this.addForm.level
        })
        .then(res => {
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg);
            this.$refs[formName].resetFields();
            this.selectValue = [];
            this.type = 3;
            this.pagenum = 1;
            this.pagesize = 5;
            this.getData();
            this.addDialog = false;
          }
        })
        .catch(err => {
          this.$message.error("添加失败");
          this.addDialog = false;
        });
    },
    // 删除分类
    async deleteCategory(row) {
      console.log(row);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
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
      let res = await this.$api.deleteCategory({
        id: row.cat_id
      });
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg);
        this.type = 3;
        this.getData();
      } else {
        this.$message.error("删除失败");
      }
    },
    showEdit(row) {
      this.editForm.id = row.cat_id;
      this.editDialog = true;
      this.editForm.name = row.cat_name;
    },
    cancelEdit(formName) {
      this.editDialog = false;
      this.$refs[formName].resetFields();
    },
    updateCategory(formName) {
      this.$api
        .updateCategory({
          id: this.editForm.id,
          cat_name: this.editForm.name
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
            this.editDialog = false;
             this.getData()
            this.$refs[formName].resetFields()
          } else {
            this.$message.error(res.meta.msg)
            this.editDialog = false;
            this.getData()
            this.$refs[formName].resetFields()
          }
        })
        .catch(err => {
          this.editDialog = false;
          this.$refs[formName].resetFields();
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
.btn,
.table {
  margin-bottom: 20px;
}
</style>