/**
 * 创建
 */
export function create() {
  this.formVisible = true
  this.title = '新增'
}

/**
 * 更新
 *
 * @param record
 */
export function update(record) {
  Object.keys(this.formFieldsData).forEach((k) => {
    this.formFieldsData[k] = record[k]
  })
  this.formVisible = true
  this.title = '更新'
}

/**
 * 删除
 *
 * @param url
 * @param title
 */
export function del(url, title) {
  this.$confirm(title, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    this.$http.delete(url).then((response) => {
      this.$message({
        type: 'success',
        message: response.message
      })
      this.handleRefresh()
    })
  })
}

/**
 * 批量删除
 *
 * @param url
 * @param title
 */
export function multiDel(url, title = '确定批量删除吗') {
  this.$confirm(title, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    this.$http.delete(url + '/' + this.selectedIds.join(',')).then((response) => {
      this.$message({
        type: 'success',
        message: response.message
      })
      this.selectedIds = []
      this.handleRefresh()
    })
  })
}

/**
 * 提交
 */
export function submitForm(url) {
  this.$refs[this.formName].validate((valid) => {
    if (valid) {
      if (!this.id) {
        this.$http.post(url, this.formFieldsData).then(response => {
          this.$message.success(response.message)
          this.resetFormFields()
          this.handleRefresh()
          // 刷新路由
          if (this.refreshRoute !== undefined && this.refreshRoute === true) {
            this.handleUpdateUserInfo()
          }
        })
      } else {
        this.$http.put(url + '/' + this.id, this.formFieldsData).then((response) => {
          this.$message.success(response.message)
          this.resetFormFields()
          this.handleRefresh()
          // 刷新路由
          if (this.refreshRoute !== undefined && this.refreshRoute === true) {
            this.handleUpdateUserInfo()
          }
        })
      }
    } else {
      this.resetFormFields()
      return false
    }
  })
}