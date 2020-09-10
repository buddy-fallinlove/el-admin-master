<template>
  <div>
    <el-card>
      <div class="container">
        <div class="top">
          <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
          <div class="steps">
            <el-steps :active="active" finish-status="success">
              <el-step title="基本信息"></el-step>
              <el-step title="商品参数"></el-step>
              <el-step title="商品属性"></el-step>
              <el-step title="商品图片"></el-step>
              <el-step title="商品内容"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
          </div>
        </div>
        <div class="bot el__tab">
          <div class="tabs">
            <el-tabs
              tab-position="left"
              :value="String(active)"
              style="height: 200px;"
              @tab-click="clickTab"
            >
              <el-tab-pane label="基本信息">
                <div style="margin-left: 15px">
                  <base-info v-show="active === 0" @next="next"></base-info>
                </div>
              </el-tab-pane>
              <el-tab-pane label="商品参数" :disabled="showParams===false">
                <good-params v-if="active === 1" @next="next"></good-params>
              </el-tab-pane>
              <el-tab-pane label="商品属性" :disabled="showAttr === false">
                <good-attr v-show="active === 2" @next="next"></good-attr>
              </el-tab-pane>
              <el-tab-pane label="商品图片" :disabled="showPic === false">
                <upload-pic v-if="active === 3" @next="next"></upload-pic>
              </el-tab-pane>
              <el-tab-pane label="商品内容" :disabled="showContent === false">
                <good-content v-if="active === 4"></good-content>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import BaseInfo from "../../components/addGoods/BaseInfo";
import GoodParams from "../../components/addGoods/GoodParams";
import GoodAttr from "../../components/addGoods/GoodAttr";
import UploadPic from "../../components/addGoods/UploadPic";
import GoodContent from "../../components/addGoods/GoodContent";
export default {
  name: "addGoods",
  data() {
    return {
      active: 0,
    };
  },
  components: {
    BaseInfo,
    GoodParams,
    GoodAttr,
    UploadPic,
    GoodContent,
  },
  methods: {
    next(data) {
      this.active += data;
    },
    clickTab(tab) {
      this.active = tab.index * 1;
    },
  },
  mounted() {},
  watch: {},
  computed: {
    showParams() {
      return this.$store.state.showParams;
    },
    showAttr() {
      return this.$store.state.showAttr;
    },
    showPic() {
      return this.$store.state.showPic;
    },
    showContent() {
      return this.$store.state.showContent;
    },
  },
};
</script>

<style scoped lang='scss'>
.el-card__body {
  height: calc(100vh - 200px);
  .top {
    margin-left: 120px;
    margin-bottom: 20px;
  }
  .bot {
    height: 100%;
    .tabs {
      height: 100%;
    }
  }
}
.steps {
  margin-top: 30px;
}
</style>