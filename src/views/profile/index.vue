<template>
  <div class="app-container">
    <el-card class="box-card" style="width: 50%; margin: auto">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
      </div>
      <el-form :ref="formName" :rules="rules" :model="user">
        <el-form-item  label="用户头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            name="image"
            :action="imageAction"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload">
            <img v-if="user.avatar" :src="user.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户昵称" prop="username">
          <el-input v-model.trim="user.username" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model.trim="user.email" />
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model.trim="user.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="fr" @click="submit">更 新</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  name: 'Profile',
  data() {
    return {
      formName: 'user',
      user: {},
      activeTab: 'account',
      headers: {
        authorization: ''
      },
      imageAction: process.env.VUE_APP_BASE_API + '/upload/image',
      rules: {
        username: [
          { required: true, message: '请输入用户', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '邮箱地址格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'email',
      'token',
      'user_id'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        username: this.name,
        role: this.roles.join(' | '),
        email: this.email,
        avatar: this.avatar
      }
      this.headers.authorization = 'Bearer ' + this.token
    },
    submit() {
      this.$refs['user'].validate(valid => {
        if (valid) {
          this.$http.put('users/profile', this.user).then(response => {
            store.dispatch('user/getInfo').then(response => {
              const { roles, permissions } = response
              store.dispatch('permission/generateRoutes', [roles, permissions]).then(r => {})
            })
            this.$message.success(response.message)
          })
        }
      })
    },
    handleImageSuccess(response, file, fileList) {
      this.user.avatar = response.data
    },
    beforeImageUpload(file) {
      const image = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif'
      if (!image) {
        this.$message.error('只支持 jpg/jpeg/png/gif 格式!')
      }
      let isLtSize = false
      isLtSize = file.size / 1024 / 1024 < 5
      if (!isLtSize) {
        this.$message.error('最大支持 5MB!')
      }
      return image && isLtSize
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>
