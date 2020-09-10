<template>
  <div class="content">
    <div>
      <mavon-editor v-model="value"></mavon-editor>
    </div>
    <div class="btn">
      <el-button type="success" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ""
    };
  },
  components: {},
  methods: {
    submit () {
      this.addGood.goods_introduce = this.value
      this.$api.addGoods({
        goods_name: this.addGood.goods_name,
        goods_cat: this.addGood.goods_cat.join(','),
        goods_price: this.addGood.goods_price,
        goods_number: this.addGood.goods_number,
        goods_weight: this.addGood.goods_weight,
        goods_introduce: this.addGood.goods_introduce,
        pics: this.addGood.pics,
        attrs: this.addGood.attrs
      }).then(res =>{
        if (res.meta.status === 201) {
          this.$message.success(res.meta.msg)
          this.$router.push('/goods/goods')
        } else {
          this.$message.error(res.meta.msg)
        }
      }).catch(err =>{
        console.log(err)
      })
    }
  },
  mounted() {},
  watch: {},
  computed: {
    addGood() {
      return this.$store.state.addGood
    }
  }
};
</script>

<style scoped lang='scss'>
.content {
  height: 100vh;
}
.btn {
  margin: 20px 30px;
}
</style>