<template>
  <div>
    <div>
      <div v-if="attrs.length > 0">
        <div class="content" v-for="(item, index) in attrs" :key="index">
          <div class="title">{{item.attr_name}}</div>
          <el-input v-model="item.attr_vals"></el-input>
        </div>
      </div>
      <div v-else class="noData">暂无属性</div>
    </div>
    <div class="btn">
      <el-button size="small" type="success" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sel: "only",
      attrs: []
    };
  },
  components: {},
  methods: {
    getData() {
      this.$api
        .getAttrs({
          id: this.goodsCat[this.goodsCat.length - 1],
          // id: 23,
          sel: this.sel
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.attrs = res.data;
          }
        });
    },
    next() {
      this.attrs.map(item => {
        let newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
        this.$store.state.addGood.attrs.push(item);
      });
      this.$emit("next", 1);
      this.$store.state.showPic = true;
    }
  },
  mounted() {
    if (this.goodsCat.length > 0) {
      this.getData();
    }
  },
  watch: {},
  computed: {
    goodsCat() {
      return this.$store.state.addGood.goods_cat;
    }
  }
};
</script>

<style scoped lang='scss'>
.content {
  margin: 20px;
  .title {
    margin-bottom: 20px;
  }
}
.btn {
  margin: 20px 30px;
}
.noData {
  font-size: 14px;
}
</style>