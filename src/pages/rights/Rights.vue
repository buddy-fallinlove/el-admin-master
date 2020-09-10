<template>
  <div>
    <el-card>
      <el-table :data="rightsList" border stripe style="width: 100%">
      <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
      <el-table-column prop="authName" label="权限名称" align="center"></el-table-column>
      <el-table-column label="权限等级" align="center">
        <template slot-scope="scope">
          <el-tag  v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  components: {},
  methods: {
    getData() {
      this.$api
        .allRights({
          type: "list"
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.rightsList = res.data
          }
        })
        .catch(err => {
          console.log(err);
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
</style>