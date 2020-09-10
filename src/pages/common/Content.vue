<template>
  <el-container>
    <el-header>
      <nav-header></nav-header>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <nav-left></nav-left>
      </el-aside>
      <el-main>
        <nav-view class="nav"></nav-view>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavHeader from "../../components/navHeader/NavHeader";
import NavLeft from "../../components/navLeft/NavLeft";
import NavView from "./Nav";
export default {
  name: "Content",
  components: {
    NavHeader,
    NavLeft,
    NavView
  },
  props: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {},
  created() {},
  filters: {},
  computed: {},
  watch: {},
  directives: {}
};
</script>

<style scoped lang="scss">
.el-container.is-vertical {
  flex-direction: row;
}
.el-main {
  height: 100vh;
  padding-top: 90px;
}
.el-aside {
  height: 100vh;
  padding-top: 60px;
}
.icon {
  font-size: 24px;
  color: #fff;
}
</style>