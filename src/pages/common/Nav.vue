<template>
  <el-breadcrumb separator=">" class="nav" >
    <el-breadcrumb-item v-for="item in navs" :key="item.id" >
      {{item.title}}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    data () {
      return {
        navs: []
      }
    },
    methods: {
    },
    created () {
      let matched = this.$route.matched
      if (this.$route.matched[0].meta.title !== '首页') {
        this.navs = [{
          title: '首页'
        }]
      } else {
        this.navs = []
      }
      for (let i = 0; i < matched.length; i++) {
        if (matched[i].meta.title !== undefined) {
          this.navs.push({'title': matched[i].meta.title})
        }
      }
    },
    mounted () {
    },
    watch: {
      '$route' (val, oldVal) {
        if (val.matched[0].meta.title !== '首页') {
          this.navs = [{
            title: '首页'
          }]
        } else {
          this.navs = []
        }
        let matched = val.matched
        for (let i = 0; i < matched.length; i++) {
          if (matched[i].meta.title !== undefined) {
            this.navs.push({'title': matched[i].meta.title})
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .el-breadcrumb__item__inner {
    cursor: default!important;
    &:hover {
      color: #48576a!important;
    }
  }
  .nav {
    padding-bottom: 30px;
  }
</style>
