<template>
  <!-- 状态监控  monitor-->
  <div class="">
    <div class="monitor grid-content bg-purple-light">
        <div class="monitor-search">
          <el-input
            placeholder='帐号搜索'
            icon="search"
            v-model="searchContent"
            :on-icon-click="handleIconClick"
            >
          </el-input>
        </div>
        <div class="monitor-opt">
          <span>状态</span>
          <el-select v-model="selectState" placeholder="全部" @change="stateChange(selectState)" class="select-w">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="采集中" value="1"></el-option>
            <el-option label="等待" value="2"></el-option>
            <el-option label="停止" value="0"></el-option>
          </el-select>
          <span>舆情追踪</span>
          <el-select v-model="searchFollow" placeholder="全部" @change="followChange(searchFollow)" class="select-w">
            <el-option label="全部" value=""></el-option>
            <el-option label="作者跟踪" value="1"></el-option>
            <el-option label="文章跟踪" value="2"></el-option>
            <el-option label="探针" value="3"></el-option>
          </el-select>
          <!-- <el-button :plain="true" type="warning" class="btn-margin-l">删除</el-button> -->
          <!-- <el-button :plain="true" type="success">停止/开始</el-button> -->
          <!-- <el-button :plain="true" type="success">导出</el-button> -->
          <el-button @click="exportExc"><a :href="hrefExc">导出</a></el-button>
        </div>
    </div>
    <div class="">
      <el-table ref="multipleTable" :data="tablemonitor" max-height="500"
      class="inforesource-table" border tooltip-effect="dark" @selection-change="selcetArr"
      style="width: 100%" > <!-- @selection-change="handleSelectionChange"-->
         <el-table-column type="selection">
         </el-table-column>
         <el-table-column prop="code" label="序号" width="60">
           <template scope="scope">{{ scope.$index +1 }}</template>
         </el-table-column>
         <el-table-column prop="name" label="用户名称" width="80">
         </el-table-column>
         <el-table-column prop="account" label="帐号" how-overflow-tooltip>
         </el-table-column>
         <el-table-column prop="mediaName" label="媒体类型" width="80">
         </el-table-column>
         <el-table-column prop="collectionType" label="采集类型" width="80">
         </el-table-column>
         <el-table-column prop="startTime" label="开始时间" width="100" how-overflow-tooltip>
         </el-table-column>
         <el-table-column prop="frequency" label="采集策略" width="80">
         </el-table-column>
         <el-table-column prop="samplingToday" label="今日采集量" width="100">
         </el-table-column>
         <el-table-column prop="totalCollection" label="采集总量" width="100">
         </el-table-column>
         <el-table-column prop="state" label="状态" width="60">
         </el-table-column>
         <el-table-column prop="traceType" label="舆情跟踪类型" how-overflow-tooltip>
         </el-table-column>
         <!-- <el-table-column label="操作" width="60">
          <template scope="scope">
           <i class="iconfont icon-begin cupointer" @click="opearState(scope.row.id,scope.row.state)"></i>
          </template>
         </el-table-column> -->
     </el-table>
     <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChangeMon"
        :current-page.sync="this.currentPage"
        :page-size="this.tablePage.size"
        layout="total, prev, pager, next"
        :total="this.tablePage.total">
      </el-pagination>
    </div>
  </div>

</template>

<script>
import qs from 'qs'
import instance from '../common/js/axios'
import Bus from '../common/js/eventBus.js'
export default {
  name: 'monitor',
  data () {
    return {
      msg: 'Welcome to monitor',
      searchFollow: '',
      selectState: '-1',
      searchContent: '',
      hrefExc: '',
      currentPage: 1,
      tablePage: {
        size: 10,
        total: 0
      },
      tablemonitor: [],
      selectionArr: [],
      selectionStr: ''
    }
  },
  methods: {
    handleIconClick(ev) {
      // console.log(ev)
      this.queryMonitorInfoList(this.selectState, this.searchFollow, this.searchContent, 10 ,1)
    },
    // searchFocus () {
    //   this.status.elholder = '请输入帐号/名称/Url/任务名称'
    //   this.status.widthLimit = false
    //   this.status.searchFocus = true
    // },
    // searchBlur () {
    //   this.status.elholder = ''
    //   this.status.widthLimit = true
    //   this.status.searchFocus = false
    // },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChangeMon (val) {
      this.queryMonitorInfoList(this.selectState, this.searchFollow, this.searchContent, 10 ,val)
    },
    stateChange (e) {
      this.queryMonitorInfoList(e, this.searchFollow, this.searchContent, 10 ,1)
    },
    followChange (e) {
      this.queryMonitorInfoList(this.selectState, e, this.searchContent, 10 ,1)
    },
    ///monitorInfo/queryMonitorInfoList
    queryMonitorInfoList (state, traceType, account, size, number, mediaType) {
      let monitor_params = qs.stringify({
        state: state,
        traceType: traceType,
        account: account,
        size: size,
        number: number,
        mediaType: mediaType,
        userToken: window.sessionStorage.getItem('userToken'),
        token: window.sessionStorage.getItem('token')
      })
      let self = this
      this.tablemonitor = []
      instance.post('monitorInfo/queryMonitorInfoList', monitor_params).then(function (response) {
        response.data = JSON.parse(response.data)
        let formatDate = (obj) => {//日期时间转换
           let d = new Date(obj)
           let month_ = d.getMonth() + 1 <= 9 ? '0'+(d.getMonth() + 1) : (d.getMonth() + 1)
           return d.getFullYear() + '-' + month_ + '-' + d.getDate()
        }
        if(response.data.result&&(response.data.result.code===200||response.data.result.code==='200')){
          let date_res = JSON.parse(response.data.result.resultObj)
          let datas_ = date_res.datas
          let len_ = datas_.length
          self.tablePage.total = date_res.totalPages
          for(let i=0;i<len_;i++){
            // let state_
            // if(datas_[i].state === 1 || datas_[i].state === '1') state_ = '采集中'
            // if(datas_[i].state === 2 || datas_[i].state === '2') state_ = '等待'
            // if(datas_[i].state === 3 || datas_[i].state === '3') state_ = '停止'
            // let traceType_
            // if(datas_[i].traceType === 1 || datas_[i].traceType === '1') traceType_ = '作者跟踪'
            // if(datas_[i].traceType === 2 || datas_[i].traceType === '2') traceType_ = '文章跟踪'
            // if(datas_[i].traceType === 3 || datas_[i].traceType === '3') traceType_ = '探针'
            self.tablemonitor.push({
              id: datas_[i].id,
              name: datas_[i].name,
              account: datas_[i].account,
              mediaName: datas_[i].mediaName,
              collectionType: datas_[i].collectionType,
              frequency: datas_[i].frequency,
              state: datas_[i].state,
              startTime: formatDate(datas_[i].startTime),
              samplingToday: datas_[i].samplingToday,
              totalCollection: datas_[i].totalCollection,
              traceType: datas_[i].traceType
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
    },
    selcetArr (val) {
      let len_val = val.length
      this.selectionArr = []
      this.selectionStr = ''
      for(let i=0;i<len_val;i++){
        this.selectionArr.push(val[i].id)
      }
      this.selectionStr = this.selectionArr.join(',')
    },
    exportExc () {
      this.hrefExc = '' //'&name='+this.account+
      let selectStr = this.selectionArr.length > 0 ? this.selectionStr : ''
      let parstr = '?state='+this.selectState+'&traceType='+this.searchFollow+'&size=10&number=1&id='+ selectStr +
                    '&account='+this.searchContent+'&userToken='+window.sessionStorage.getItem('userToken')+
                    '&token='+window.sessionStorage.getItem('token')
      let href_ = window.sessionStorage.getItem('baseUrl')+'monitorInfo/expMonitorInfoExcel'+parstr
      this.hrefExc = href_
    },
    opearState (id, state) {
      console.log(id)
      console.log(state)
    }
  },
  created () {
    this.queryMonitorInfoList(-1, '', '', 10, 1, '')
    this.exportExc()
    // this.infoMediaList(0)
    Bus.$on('monitorData', (e) => {
      // console.log(e.id) //tree id
      this.queryMonitorInfoList(this.selectState, this.searchFollow, this.searchContent, 10 , 1, e.id)
    })
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
.monitor{
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
.monitor-search{
  width: 120px;
}
.monitor-opt .select-w{
  width: 100px;
}
.btn-margin-l{
  margin-left: 10px;
}
.cupointer{
  cursor: pointer;
}
.el-pagination{
  text-align: center;
  margin-top: 15px;
}
</style>
