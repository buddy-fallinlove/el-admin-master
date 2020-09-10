<template>
  <div class="container">
    <div class="form">
      <el-card >
        <div slot="header" style="text-align: center">
          <h1>欢迎来到小爱后台管理系统</h1>
        </div>
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-width="110px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item label="请输入用户名" prop="username">
            <el-input v-model="form.username" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="请输入密码" prop="password" class="el_input_item">
            <el-input v-model="form.password" style="width: 400px;" type="password"></el-input>
          </el-form-item>
          <div class="ps">
            特别提醒: 如果您是管理员,请使用管理员账号登录,如果不知道账号,请联系公司人事。
          </div>
          <el-form-item class="login__form__item">
            <div class="btn">
              <el-button class="btn1" type="primary" @click="login('ruleForm')" :loading="loading">立即登录</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { max: 10, message: "用户名最多为10位", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码最少为6位", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login(formName) {
      this.loading = true
      this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post('/api/login',{
              username: this.form.username,
              password: this.form.password
            }).then(res => {
              console.log(res)
              if (res.data.meta.status === 200) {
                this.loading = false
                this.$message.success(res.data.meta.msg)
                localStorage.setItem('adminUser', JSON.stringify(res.data.data))
                this.$router.push('/')
              }
              if (res.data.meta.status === 400) {
                this.loading = false
                this.$message.error(res.data.meta.msg)
                this.$refs[formName].resetFields();
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
  },
  mounted() {
    
  }
};
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/bj.jpg") no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  .flex {
    width: 100%;
    display: flex;
    align-items: center;
    .btn1 {
      position: relative;
      right: 100px;
    }
  }

  .form {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
</style>
