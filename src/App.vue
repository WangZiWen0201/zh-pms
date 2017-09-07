<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <el-radio class="radio" v-model="radio" label="1">备选项</el-radio>
    <el-radio class="radio" v-model="radio" label="2">备选项</el-radio> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html, body, #app, .wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width:100%;
  height:100%;
  overflow: hidden;
}
body{
  margin: 0;
  padding: 0;
}
.el-tree-node__expand-icon{
  float: right;
  margin-top: 12px;
}
/*.inforesource-table .el-table__body-wrapper{
  overflow-y: scroll;
}*/
.flexcontent .el-date-editor.el-input {
  width: auto;
}
.el-table .cell,.el-table th>div {
  /*text-align: center;*/
}
/*.ms-login .el-form-item{
  margin-bottom: 16px;
}*/
</style>
