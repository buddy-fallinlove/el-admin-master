import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    addGood: {
      goods_name: '',
      goods_price: 0,
      goods_weight: 0,
      goods_number: 0,
      // 商品所属的分类数组
      goods_cat: [],
      // 图片的数组
      pics: [],
      // 商品的详情描述
      goods_introduce: '',
      attrs: [],
    },
    // 添加商品tab栏的显示
    showParams: false,
    showAttr: false,
    showPic: false,
    showContent: false
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
