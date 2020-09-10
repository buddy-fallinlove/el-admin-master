<template>
  <div class="headerNav">
    <div class="t-left">欢迎来到小爱后台系统</div>
    <div class="t-right">
      <div class="time">{{now}}</div>
      <div class="weather">
        <div v-if="hour < 20" class="w-img">
          <img :src="weather.dayPictureUrl">
        </div>
        <div v-if="hour >= 20" class="w-img">
          <img :src="weather.nightPictureUrl">
        </div>
        <div>{{weather.weather}}</div>
      </div>
      <div class="user">
        亲爱的, {{user.username}}
      </div>
      <div class="out" @click="logout">
        退出
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "NavHeader",
  data() {
    return {
      weather: {},
      timer: null,
      now: new Date().toLocaleString(),
      hour: '',
      user: JSON.parse(localStorage.adminUser)
    };
  },
  methods: {
    getWeather() {
      this.$api
        .jsonp({
          url:
            "http://api.map.baidu.com/telematics/v3/weather?location=%E6%88%90%E9%83%BD&output=json&ak=3p49MVra6urFRGOT9s8UBWr2"
        })
        .then(res => {
          if (res.status === "success") {
            this.weather = res.results[0].weather_data[0]
          }
        });
    },
    logout () {
      localStorage.removeItem('adminUser')
      this.$router.push('/login')
      this.$message.success('欢迎下次光临')
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.now = new Date().toLocaleString();
    }, 1000);
    this.getWeather()
    this.hour = this.$dayjs(Date.now()).format('HH')
  },
  destroyed () {
    clearInterval(this.timer)
    this.timer = null
  }
};
</script>

<style scoped lang="scss">
.headerNav {
  background: #fff;
  width: 100%;
  display: flex;
  align-items: center;
  color: #2e5e85;
  position: fixed;
  top: 0;
  z-index: 99;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  justify-content: space-between;
  .t-left {
    margin-left: 30px;
  }
  .t-right {
    margin-right: 50px;
    display: flex;
      align-items: center;
    .weather {
      display: flex;
      align-items: center;
      flex: 1;
      margin: 0 20px;
      .w-img {
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 8px;
        img {
          height: 25px;
          width: 38px;
        }  
      }
    }
    .out {
      cursor: pointer;
      color: #409EFF;
      margin-left: 12px;
    }
  }
}
</style>
