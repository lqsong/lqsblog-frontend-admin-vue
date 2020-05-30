<template>
  <div class="login">
      <div class="form">
        <h1 class="title">
          <img src="../../assets/images/logo-login.png" />
        </h1>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" size="medium">
          <el-form-item label="" prop="username">
            <el-input v-model.trim="ruleForm.username" autocomplete="off" placeholder="请输入账号" @keyup.enter.native="submitForm('ruleForm')">
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>            
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input type="password" v-model.trim="ruleForm.password" autocomplete="off" placeholder="请输入密码" @keyup.enter.native="submitForm('ruleForm')">
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="imgCode">
            <el-row>
              <el-col :span="16">
                <el-input v-model.trim="ruleForm.imgCode" autocomplete="off" placeholder="请输入验证码" @keyup.enter.native="submitForm('ruleForm')">
                  <i slot="prefix" class="el-input__icon el-icon-picture-outline"></i>
                </el-input>
              </el-col>
              <el-col :span="8">
                <el-tooltip effect="light" content="点击可刷新" placement="bottom-end">
                  <div class="imgcode" v-loading="imgCodeDataLoading" @click="getImgCode()">
                    <img :src="imgCodeData">
                  </div>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button class="submit" type="primary" @click="submitForm('ruleForm')" :loading="loading">登录</el-button>
          </el-form-item>
        </el-form>

      </div>
  </div>
</template>
<script>
import request from '@/service/lib/request';
export default {
  name: 'Login',
  data() {
      return {
        loading: false,
        imgCodeDataLoading: false,
        imgCodeData: '',
        ruleForm: {
          username: '',
          password: '',
          imgCode: '',
          imgCodeToken: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
          ],
          imgCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        },
        redirect: undefined,
        otherQuery: {}
      };
    },
    watch: {
      $route: {
        handler: function(route) {
          const query = route.query;
          if (query) {
            this.redirect = query.redirect;
            this.otherQuery = this.getOtherQuery(query);
          }
        },
        immediate: true
      }
    },
    methods: {
      submitForm(formName) {
        const _this = this;
        _this.$refs[formName].validate((valid) => {
          if (valid) {
              _this.loading = true;
              const paramData = {
                  username: _this.ruleForm.username,
                  password: _this.ruleForm.password,
                  imgCode: _this.ruleForm.imgCode,
                  imgCodeToken: _this.ruleForm.imgCodeToken
              };
              _this.$store.dispatch('user/login', paramData).then(() => {
                  _this.loading = false;
                  _this.$router.push({ path: _this.redirect || '/', query: _this.otherQuery },() => {});
                }).catch(error => {
                  _this.$message.error(error.msg || 'Has Error');
                  _this.loading = false;
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
      },
      // 加载验证码
      getImgCode() {
        const _this = this;
        if(_this.imgCodeDataLoading) {
          return false;
        }

        _this.imgCodeDataLoading = true;
        request({
          url: '/guest/validateCodeImg',
          method: 'get'
        }).then(res => {
            const { code, data } = res;
            if(code === 0) {
                
                const { base64, tokenCode } = data;
                _this.imgCodeData = base64;
                _this.imgCodeDataLoading = false;

                _this.ruleForm.imgCodeToken = tokenCode;
              
            }
        }).catch(() => {});
      }
    },
    mounted() {
      this.getImgCode();
    }
};
</script>
<style lang="scss" scoped>
.login {
  display: flex;
  width: 100%;
  height: 100vh;
  min-height: 500px;
  overflow: auto;
  background-image: url("../../assets/images/bg-smooth.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
  align-items: center;
  .form{
      flex: none;
      width: 320px;
      padding: 60px;
      margin: 0 auto;
      border-radius: 4px;
      background-color: rgba($color: #FFFFFF, $alpha: 0.2);
      .title{
        font-weight: 300;
        margin-top: 0;
        margin-bottom: 60px;
        text-align: center;
        color: #FFFFFF;
      }
      .imgcode {        
        width: 90%;
        height: 34px;
        cursor: pointer;
        border-radius: 3px;
        float: right;
        img {
          border-radius: 3px;
          width: 100%;
          height: 100%;
        }
      }
      .submit{
        margin-top: 10px;
        width: 100%;
      }
  }
}
</style>
