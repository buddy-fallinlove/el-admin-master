<template>
  <div>
    <el-card>
      <div class="top">
        <div class="search">
          <el-input placeholder="请输入搜索内容" v-model="searchValue" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="table">
        <el-table :data="orderList" border stripe style="width: 100%">
          <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
          <el-table-column prop="order_number" label="订单编号" align="center"></el-table-column>
          <el-table-column prop="order_price" label="订单价格" align="center"></el-table-column>
          <el-table-column prop="pay_status" label="是否付款" align="center">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.pay_status === 0">未付款</el-tag>
              <el-tag type="danger" v-else>已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" align="center"></el-table-column>
          <el-table-column prop="time" label="下单时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit"></el-button>
              <el-button type="success" size="mini" @click="check" icon="el-icon-location"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[ 5, 15, 20, 30]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog title="编辑地址" :visible.sync="dialogVisible" width="40%" @close="close">
      <el-cascader :options="city" v-model="selectValue" style="width: 100%;"></el-cascader>
    </el-dialog>
    <el-dialog title="物流信息" :visible.sync="show" width="40%" @close="close">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in logistics"
          :key="index"
          :timestamp="activity.time"
        >
          <div :class="{col: index > 0}">{{activity.context}}</div>
          <span slot="dot" class="dot" :class="{col: index > 0}">{{index + 1}}</span>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import city from "../../utils/citydata";
export default {
  data() {
    return {
      pagenum: 1,
      pagesize: 10,
      total: 0,
      orderList: [],
      searchValue: "",
      orderId: "",
      city: city,
      dialogVisible: false,
      // 物流信息
      logistics: [],
      selectValue: [],
      show: false
    };
  },
  components: {},
  methods: {
    getData() {
      this.$api
        .getOrders({
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        .then(res => {
          if (res.meta.status === 200) {
            res.data.goods.map(item => {
              item.time = this.$dayjs(item.create_time).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            this.total = res.data.total;
            this.orderList = res.data.goods;
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
    search() {
      this.$api
        .getOrders({
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          query: this.searchValue
        })
        .then(res => {
          console.log(res);
          if (res.meta.status === 200) {
            res.data.goods.map(item => {
              item.time = this.$dayjs(item.create_time).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            this.orderList = res.data.goods;
            this.total = res.data.goods.length;
          }
        });
    },
    edit () {
      this.dialogVisible = true
    },
    check() {
      this.show = true;
      this.$api
        .getLogistics({
          id: 804909574412544580
        })
        .then(res => {
          if (res.meta.status === 200) {
            this.logistics = res.data;
          }
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
      // this.dialogVisible = true
    },
    close() {
      this.selectValue = [];
      this.logistics = [];
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
.flex {
  display: flex;
  align-items: center;
  height: 40px;
  margin: 5px 0;
  &:first-child {
    margin: 0;
  }
}
.col {
  color: #c0c4cc;
}
.dot {
  border-radius: 50%;
  border: 2px solid;
  border-color: inherit;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: -8px;
  left: -9px;
}
</style>