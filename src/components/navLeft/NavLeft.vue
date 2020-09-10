<template>
  <div class="container el__aside__menu">
    <el-menu
      :default-active="$route.meta.path"
      router
      unique-opened
      active-text-color="#15AAFB"
      class="el-menu-vertical-demo"
      @select="selectMenu"
    >
      <template v-for="item in menu">
        <el-submenu :index="item.key" :key="item.path" v-if="item.children.length > 0">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{ item.authName }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item :index="child.key" v-for="child in item.children" :key="child.path">
              <i :class="child.icon"></i>
              <span slot="title">{{ child.authName }}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item :index="item.key" :key="item.path" v-else>
          <i :class="item.icon"></i>
          <span slot="title">{{ item.authName }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import router from "../../router";
export default {
  name: "NavLeft",
  components: {},
  props: {},
  data() {
    return {
      menu: []
    };
  },
  methods: {
    selectMenu(index, indexPath) {
      if (indexPath.length === 1) {
        this.$router.push("/" + indexPath[0]);
      } else {
        this.$router.push(`/${indexPath[0]}/${indexPath[1]}`);
      }
    },
    getMenu() {
      this.$api
        .getMenus()
        .then(res => {
          if (res.meta.status === 200) {
            res.data.unshift({
              id: 1,
              authName: "首页",
              children: [],
              path: "home",
              order: 0
            });
            res.data.map(item => {
              if (item.children.length === 0) {
                this.$set(item, "key", `/${item.path}`);
              } else {
                this.$set(item, "key", `/${item.path}`);
                item.children.map(child => {
                  this.$set(child, "key", `/${item.path}/${child.path}`);
                })
              }
            });
            router.options.routes.map(item => {
              if (item.meta) {
                res.data.map(item1 => {
                  if (item.meta.title === item1.authName) {
                    this.$set(item1, "icon", item.meta.icon);
                  }
                  if (
                    item.children &&
                    item.children.length > 0 &&
                    item1.children.length > 0
                  ) {
                    item.children.map(item2 => {
                      if (item2.meta) {
                        item1.children.map(item3 => {
                          if (item2.meta.title === item3.authName) {
                            this.$set(item3, "icon", item2.meta.icon);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
          this.menu = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.getMenu()
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.el-menu {
  height: calc(100vh - 60px) !important;
}
</style>
