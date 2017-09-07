<template>
  <div class="header">
      <!-- <div class="logo">后台管理系统PMS</div> -->
      <div class="user-info">
          <el-dropdown trigger="click" @command='linkToPath'>
              <span class="el-dropdown-link">
                  <!-- <img class="user-logo" src="../../../static/img/img.jpg"> -->
                  您好, {{this.username}} !
              </span>
              <el-dropdown-menu slot="dropdown" class="loginout">
                  <el-dropdown-item command='login'>退出</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button @click="printscreen()" style="float:right">print</el-button> -->
      </div>
      <div class="infobasic-fnc" v-show="this.$route.path==='/infobasic'">
        <a v-show="this.shown" :href=printExc>打印</a>
        <span @click="printCharts ()" v-show="!this.shown">导出</span>
      </div>
  </div>
</template>

<script>
import Bus from '../js/eventBus.js'
export default {
  name: 'header',
  data () {
    return {
      msg: 'Welcome to Your header',
      username: '',
      shown: false,
      printExc: ''
    }
  },
  methods: {
    linkToPath (path) {
      this.$router.push({path: path})
    },
    printCharts () {
      this.$message('请点击下方图表中的下载按钮!')
    },
    printscreen () {
      if(window.sessionStorage.getItem('toggleFocus') === true || window.sessionStorage.getItem('toggleFocus') === 'true'){
        this.$message('请点击下方图表中的下载按钮!')
        return
      }
      let mywindow = window.open('', 'PRINT', 'height=500,width=800')
      mywindow.document.write('<html><head><title>' + document.title  + '</title>')
      mywindow.document.write('</head><body >')
      mywindow.document.write('<h1>' + document.title  + '</h1>')
      mywindow.document.write(document.getElementById('printHtml').innerHTML)  //content块内容 选择生成
      mywindow.document.write('</body></html>')
      //判断ie9包括9 一下ie浏览器问题
      let browser=navigator.appName
      let b_version=navigator.appVersion
      let version=b_version.split(";");
      let trim_Version=version[1].replace(/[ ]/g,"")
      if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9."){
        this.$message({
          message: '请在ie10版本以上使用打印功能',
          type: 'success'
        })
        return
      }
      mywindow.document.close()  // necessary for IE >= 10 兼容ie10以上
      mywindow.focus()  // necessary for IE >= 10*/
      mywindow.print()
      mywindow.close()

      return true
    },
    compareShown () {
      if(window.sessionStorage.getItem('toggleFocus')){
        this.shown = true
      } else{
        this.shown = false
      }
    }
  },
  created () {
    this.shown = true
    Bus.$on('toggleFocus', (e) => {
      if (e) {
        this.shown = true
      } else {
        this.shown = false
      }
    })
    let res_str = window.sessionStorage.getItem('res_string')
    res_str = JSON.parse(res_str)
    this.username = res_str.showName
    this.printExc = window.sessionStorage.getItem('baseUrl')+'collectionSurvey/expCollectionSurveyExcel?'+
    'userToken='+window.sessionStorage.getItem('userToken')+'&token='+window.sessionStorage.getItem('token')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
a {
  color: #42b983;
  text-decoration: none;
}
.header {
    /*position: relative;*/
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    font-size: 22px;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
}
.header .logo{
    float: left;
    width:250px;
    text-align: center;
}
.user-info {
    /*float: right;*/
    /*padding-right: 50px;*/
    font-size: 16px;
    color: #fff;
}
.infobasic-fnc{
  padding-right: 20px;
  font-size: 16px;
}
.loginout {
  text-align: center;
}
.user-info .el-dropdown-link{
    position: relative;
    display: inline-block;
    cursor: pointer;
    vertical-align: middle;
    padding-left: 20px;
}
.user-info .user-logo{
    position: absolute;
    left:0;
    top:15px;
    width:40px;
    height:40px;
    border-radius: 50%;
}
.el-dropdown-menu__item{
    text-align: center;
  }
</style>
