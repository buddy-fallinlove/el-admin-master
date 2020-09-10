<template>
 <div>
   <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
 </div>
</template>

<script>
import echarts from 'echarts'
 export default {
   data () {
     return {
      reports:{},
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
     }
   },
   components: {

   },
   methods: {
     getData () {
         this.$api.getReports().then(res =>{
           if (res.meta.status === 200) {
              let myChart = echarts.init(document.getElementById('main'))
              myChart.setOption(res.data)
           }
         }).catch(err => {
           console.log(err)
         })
       }
   },
   mounted() {
    
     this.getData()
   },
   watch: {

   },
   computed: {

   }
 }
</script>

<style scoped lang='scss'>

</style>