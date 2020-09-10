<template>
  <div class="container">
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
        <el-input type="number" v-model="ruleForm.price" :disabled="ruleForm.name ===''"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="weight">
        <el-input
          type="number"
          v-model.number="ruleForm.weight"
          :disabled="ruleForm.name ==='' || ruleForm.price ===''"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="number">
        <el-input
          type="number"
          v-model.number="ruleForm.number"
          :disabled="ruleForm.name=== '' || ruleForm.price ==='' || ruleForm.weight === ''"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="category">
        <el-cascader
          style="width: 30%;"
          v-model="selectValue"
          :options="selectList"
          expandTrigger="hover"
          :props="selectProps"
          @change="handleChange"
          clearable
          :disabled="ruleForm.name=== '' || ruleForm.price ==='' || ruleForm.weight === '' || ruleForm.number === ''"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          size="small"
          @click="next"
          v-if="ruleForm.name!== '' && ruleForm.price !=='' && ruleForm.weight !== '' && ruleForm.number !== '' && selectValue.length > 0"
        >下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'baseInfo',
  props: {},
  data() {
    return {
      ruleForm: {
        name: "",
        price: "",
        weight: "",
        number: ""
      },
      selectList: [],
      selectValue: [],
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" }
        ],
        weight: [
          { required: true, message: "商品重量不能为空", trigger: "blur" }
        ],
        number: [
          { required: true, message: "商品数量不能为空", trigger: "blur" }
        ]
      },
      selectProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  components: {},
  methods: {
    getData() {
      this.$api
        .getCategory({
          type: 3
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.selectList = res.data
          }
        })
        .catch(err => {
          console.log(err)
        });
    },
    handleChange() {},
    next() {
      this.$store.state.addGood.goods_name = this.ruleForm.name
      this.$store.state.addGood.goods_price = this.ruleForm.price
      this.$store.state.addGood.goods_number = this.ruleForm.number
      this.$store.state.addGood.goods_weight = this.ruleForm.weight
      this.$store.state.addGood.goods_cat = this.selectValue
      this.$emit("next", 1)
      this.$store.state.showParams = true
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
.el-form {
  height: 100%;
}
</style>