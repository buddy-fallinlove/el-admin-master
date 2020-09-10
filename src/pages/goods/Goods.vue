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
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </div>
      </div>
      <el-table :data="goodsList" style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="140" align="center"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" align="center" width="100"></el-table-column>
        <el-table-column label="创建时间" prop="time" width="180" align="center"></el-table-column>
        <el-table-column width="150" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showUpdate(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteGood(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[ 10, 30, 50, 100]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="编辑商品" :visible.sync="dialogVisible" width="40%">
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="price">
            <el-input type="number" v-model.number="ruleForm.price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="number">
            <el-input type="number" v-model.number="ruleForm.number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="weight">
            <el-input type="number" v-model.number="ruleForm.weight"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="updateGood('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      searchValue: "",
      dialogVisible: false,
      ruleForm: {
        id: "",
        name: "",
        price: "",
        number: "",
        weight: "",
        cat_id: "",
      },
      rules: {
        name: [{ required: true, message: "商品名称不能为空" }],
        price: [{ required: true, message: "商品价格不能为空" }],
        number: [{ required: true, message: "商品数量不能为空" }],
        weight: [{ required: true, message: "商品重量不能为空" }],
      },
    };
  },
  components: {},
  methods: {
    getData() {
      this.$api
        .getGoods({
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        })
        .then((res) => {
          if (res.meta.status === 200) {
            res.data.goods.map((item) => {
              item.time = this.$dayjs(item.add_time).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            this.goodsList = res.data.goods;
            this.total = res.data.total;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    search() {
      this.$api
        .getGoods({
          query: this.searchValue,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        })
        .then((res) => {
          if (res.meta.status === 200) {
            res.data.goods.map((item) => {
              item.time = this.$dayjs(item.add_time).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            this.goodsList = res.data.goods;
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
    async deleteGood(row) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除！");
      }
      let res = await this.$api.deleteGood({
        id: row.goods_id,
      });
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg);
        this.getData();
      } else {
        this.$message.error("删除失败");
      }
    },
    showUpdate(row) {
      console.log(row);
      this.ruleForm.name = row.goods_name;
      this.ruleForm.id = row.goods_id;
      this.ruleForm.price = row.goods_price;
      this.ruleForm.number = row.goods_number;
      this.ruleForm.weight = row.goods_weight;
      this.dialogVisible = true;
    },
    cancel(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    updateGood(formName) {
      this.$api
        .updateGood({
          id: this.ruleForm.id,
          goods_name: this.ruleForm.name,
          goods_number: this.ruleForm.number,
          goods_price: this.ruleForm.price,
          goods_weight: this.ruleForm.weight,
        })
        .then((res) => {
          if (res.meta.status === 200) {
            this.$message.success("修改成功");
            this.dialogVisible = false;
            this.getData();
            this.$refs[formName].resetFields();
            
          } else {
            this.$message.error(res.meta.msg);
            this.dialogVisible = false;
            this.$refs[formName].resetFields();
          }
        })
        .catch((err) => {
          console.log(err);
          this.dialogVisible = false;
          this.$refs[formName].resetFields();
        });
    },
    addGoods() {
      this.$router.push("addGoods");
    },
  },
  mounted() {
    this.getData();
  },
  watch: {},
  computed: {},
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
</style>