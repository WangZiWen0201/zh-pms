<template>
<!-- 信息源管理 -》 查看 -->
<div class="">
  <el-table ref="multipleTable" :data="tableTactics"
  class="inforesource-table" border
   style="width: 100%" > <!-- @selection-change="handleSelectionChange" @selection-change="selectChange"-->
   <!-- <el-table-column type="selection">
   </el-table-column> -->
   <el-table-column prop="code" label="任务编号" width="80" show-overflow-tooltip>
   </el-table-column>
   <el-table-column prop="name" label="任务名称" show-overflow-tooltip>
   </el-table-column>
   <el-table-column label="用户名称" width="100">
     <template scope="scope">
       {{ scope.row.username ? scope.row.username.split(',')[0] : '' }}
       <el-tooltip class="item" effect="dark" content="Bottom Left 提示文字" placement="bottom-start" v-show="scope.row.username&&scope.row.username.split(',').length>1">
          <div slot="content"  @click="hoverMessage()">{{ scope.row.username }}</div>
          <i class="el-icon-plus"></i>
        </el-tooltip>
     </template>
   </el-table-column>
   <el-table-column label="帐号"  width="80">
     <template scope="scope">
       {{ scope.row.account? scope.row.account.split(',')[0] : '' }}
       <el-tooltip class="item" effect="dark" content="Bottom Left 提示文字" placement="bottom-start" v-show="scope.row.account&&scope.row.account.split(',').length>1">
          <div slot="content"  @click="hoverMessage()">{{ scope.row.account }}</div>
          <i class="el-icon-plus"></i>
        </el-tooltip>
     </template>
   </el-table-column>
   <el-table-column prop="mediaName" label="媒体类型" width="">
   </el-table-column>
   <el-table-column prop="collectionType" label="采集类型">
   </el-table-column>
   <el-table-column prop="startTime" label="开始时间" width="" show-overflow-tooltip>
   </el-table-column>
   <el-table-column prop="samplingToday" label="今日采集量" width="100">
   </el-table-column>
   <el-table-column prop="totalCollection" label="采集总量" width="">
   </el-table-column>
   <el-table-column prop="state" label="状态" width="70">
   </el-table-column>
   <el-table-column prop="customerOrg" label="客户组织" width="">
   </el-table-column>
   <!--<el-table-column prop="address" label="操作" width="100" show-overflow-tooltip>
     <template scope="scope">
     <i class="iconfont icon-begin cupointer"@click="opearState(scope.row.id,scope.row.state)"></i>
     <i class="iconfont icon-edit_ cupointer" @click="updateInfo(scope.row.id)"></i>
     <i class="iconfont icon-delet_ cupointer" @click="delData(scope.row.id)"></i>
    </template>
   </el-table-column>-->
 </el-table>
 <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChangeTac"
    :current-page.sync="this.currentPage"
    :page-size="this.tablePage.size"
    layout="total, prev, pager, next"
    :total="this.tablePage.total">
  </el-pagination>
</div>
</template>

<script>
import qs from 'qs'
import instance from '../../common/js/axios'
import Bus from '../../common/js/eventBus.js'
export default {
  name: 'resourceDetail',
  data () {
    return {
      msg: 'Welcome to tactics',
      currentPage: 1,
      tablePage: {
        size: 10,
        total: 0
      },
      tableTactics: [],
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChangeTac (val) {
      this.currentPage = val
      this.taskTaskList('', '', '', 10, val)
    },
    taskTaskList (state, taskcode, taskname, size, number) {
     let list_params, url_
     url_ = 'informationSource/queryInformationTaskInfoList'
     list_params =qs.stringify({
       state: state,
       code: taskcode,
       name: taskname,
       mediaType: this.$route.query.mediaType,
       username: this.$route.query.username,
       size: size,
       number: number,
       userToken: window.sessionStorage.getItem('userToken'),
       token: window.sessionStorage.getItem('token')
     })
     let self = this
     this.tableTactics = []
     instance.post(url_, list_params).then(function (response) {
       response.data = JSON.parse(response.data)
       if (response.data.page) {
         self.currentPage = response.data.page.number
         self.tablePage.total = response.data.page.totalElements
       }
       if(response.data.result&&(response.data.result.code===200||response.data.result.code==='200')){
         response.data.result.resultObj = JSON.parse(response.data.result.resultObj)
         let datas_ = response.data.result.resultObj.datas
         let len_ = datas_.length
         for(let i=0;i<len_;i++){
           self.tableTactics.push({
             code: datas_[i].code,//任务编号
             name: datas_[i].name,//任务名称
             username: datas_[i].username,//任务名称
             account: datas_[i].account,//帐号
             mediaName: datas_[i].mediaName,//媒体类型
             // updateBy: datas_[i].updateBy,//username
             // updateBy: datas_[i].updateBy,//帐号
             //媒体类型
             collectionType: datas_[i].collectionType,//采集类型1：账号2：关键词3：URL
             startTime: datas_[i].startTime,//开始时间
             totalCollection: datas_[i].totalCollection,//采集总量
             samplingToday: datas_[i].samplingToday,//今日采集量
             state: datas_[i].state,//状态，1：采集中2：等待 0：停止
             customerOrg: datas_[i].customerOrg,//客户组织
             id: datas_[i].id,//客户组织
           })
         }
       } else {
         let alMess = response.data.message ? response.data.message : '数据错误!'
         self.$message({
           showClose: true,
           message: alMess,
           type: 'warning'
         })
       }
     })
   }
  },
  mounted () {
    this.taskTaskList('', '', '', 10, 1)
  },
  created () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
a {
  color: #1f2d3d;
  text-decoration: none;
}
.tactics{
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
.tactics-search{
  width: 100px;
}
.tactics-search-s{
  width: 60px;
}
.stactics-search-l{
  width: 250px;
}
.tactics-opt .select-w{
  width: 100px;
}
/*dialog 添加*/
.label-for-med{
  width: 108px;
  display: inline-block;
  text-align: right;
  padding-right: 12px;
}
.label-for-type{
  margin-left: 12px;
}
/*form*/
.textalign-center{
  text-align: center;
}
.textalign-right{
  text-align: right;
}
.padding-l-8{
  padding-left: 8px;
}
.margin-l-8{
  margin-left: 8px;
}
.flexcontent{
  display: flex;
  justify-content: space-between;

}
.el-pagination{
  text-align: center;
  margin-top: 15px;
}
.padding0{
  padding: 0;
  padding: 0 6px;
}
.el-table__body-wrapper{
  overflow-y: hidden;
}
.cupointer{
  cursor: pointer;
}
</style>
