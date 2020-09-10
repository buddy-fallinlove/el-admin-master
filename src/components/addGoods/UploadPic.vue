<template>
  <div class="content">
    <el-upload
      class="upload-demo"
      drag
      action="/api/upload"
      multiple
      :headers="headers"
      :on-success="success"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <div class="btn">
      <el-button type="success" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: {}
    };
  },
  components: {},
  methods: {
    success(res) {
      if (res.meta.status === 200) {
        let picInfo = { pic: res.data.tmp_path };
        this.$store.state.addGood.pics.push(picInfo);
      }
    },
    next() {
      this.$emit("next", 1)
      this.$store.state.showContent = true
    }
  },
  mounted() {
    let token = JSON.parse(localStorage.adminUser).token;
    this.headers = {
      Authorization: token
    };
  },
  watch: {},
  computed: {
    addGood() {
      return this.$store.state.addGood;
    }
  }
};
</script>

<style scoped lang='scss'>
.content {
  margin: 20px;
}
.btn {
  margin: 20px 30px;
}
</style>