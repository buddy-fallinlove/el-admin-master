<template>
 <div>
   <div class="content" v-for='(item, index) in params' :key='index'>
     <div class="title">{{item.attr_name}}</div>
     <div class="tags">
       <div v-if='item.attr_vals.length > 0'>
         <el-tag v-for='(tag, idx) in item.attr_vals' :key='idx' class="tag">{{tag}}</el-tag>
       </div>
       <div v-else class="noData">
         暂无属性
       </div>
     </div>
   </div>
   <div class="btn">
     <el-button size="small" type="success" @click="next">下一步</el-button>
   </div>
 </div>
</template>

<script>
 export default {
   data () {
     return {
       sel: 'many',
       params: []
     }
   },
   components: {

   },
   methods: {
     getData() {
       this.$api.getAttrs({
         id: this.goodsCat[this.goodsCat.length - 1],
        //  id: 23,
         sel: this.sel
       }).then(res => {
         if (res.meta.status === 200) {
           res.data.map(item => {
             item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(' ') : []
           })
           this.params = res.data
         }
       }).catch(err => {
         console.log(err)
       })
     },
     next () {
       this.params.map(item => {
         let newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.$store.state.addGood.attrs.push(item)
          this.$store.state.showAttr = true
       })
       this.$emit('next', 1)
     }
   },
   mounted() {
     if (this.goodsCat.length > 0) {
        this.getData()
     } 
   },
   watch: {

   },
   computed: {
     goodsCat () {
       return this.$store.state.addGood.goods_cat
     } 
   }
 }
</script>

<style scoped lang='scss'>
  .content {
    .title {
      margin: 20px;
    }
    .tags {
      margin-left: 20px;
      .tag {
        margin-left: 10px;
        &:first-child {
          margin-left: 0;
        }
      }
      .noData {
        font-size: 14px;
      }
    } 
  }
   .btn {
      margin: 20px 30px;
    }
</style>