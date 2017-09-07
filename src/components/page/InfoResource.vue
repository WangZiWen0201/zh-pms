<template>
  <!-- 信息源管理 -->
  <div class="inforesource">
        <div class="inforesource-select">
          <div class="search-input">
            <el-input
              placeholder="请输入用户名或帐号"
              icon="search"
              v-model="searchResource"
              :on-icon-click="searchContent">
            </el-input>
          </div>
          <div class="grid-content bg-purple-light">
            <span>状态</span>
            <el-select v-model="valueSta" placeholder="请选择" class="info-sta" @change="infoUserList('', valueSta, '', 10, 1)">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="采集中" value="1"></el-option>
              <el-option label="等待" value="2"></el-option>
              <el-option label="停止" value="0"></el-option>
            </el-select>
            <span>媒体类型</span>
            <el-select v-model="mediatype" placeholder="请选择" class="info-med" @change="infoUserList(mediatype, '', '', 10, 1)">
              <el-option
                v-for="item in valueMed"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button @click="exportExc"><a :href="hrefExc">导出</a></el-button>
          </div>
        </div>
        <div class="">
          <el-table ref="multipleTable" :data="tableInfoResource" max-height="488"
           class="inforesource-table" border tooltip-effect="dark"
           @selection-change="selcetArr"
           style="width: 100%;" >
            <el-table-column type="selection">
              <!-- <template scope="scope"> {{scope.$index}}</template> -->
            </el-table-column>
            <el-table-column label="序号" >
              <template scope="scope">  {{ scope.$index +1 }} </template>
            </el-table-column>
            <!-- <el-table-column prop="" label="任务名称">
            </el-table-column> -->
            <el-table-column label="用户名称" width="">
              <template scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column prop="account" label="帐号" width="">
            </el-table-column>
            <el-table-column prop="mediaName" label="媒体类型" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="state" label="状态" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="id" label="操作" show-overflow-tooltip>
              <template scope="scope"><el-button type="primary" @click="postId(scope.row.mediaType, scope.row.name)">查看</el-button></template>
            </el-table-column>
         </el-table>
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChangeRes"
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
  name: 'inforesource',
  data () {
    return {
      msg: 'inforesource',
      valueSta: '-1',
      mediatype: '',
      searchResource: '',
      valueMed: [],
      selectionArr: [],
      selectionStr: '',
      currentPage: 1,
      tablePage: {
        size: 10,
        total: 0
      },
      tableInfoResource: [],
      hrefExc: ''
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChangeRes (val) {
      this.currentPage = val
      this.infoUserList('', this.valueSta, '', 10, val)
    },
    searchContent () {
      this.infoUserList ('', this.valueSta, this.searchResource, 10, 1)
    },
    infoUserList (mediaType, state, name, size, number) {
      let self = this
      let info_param = qs.stringify({
        mediaType: mediaType,
        state: this.valueSta,
        name: name,
        userToken: window.sessionStorage.getItem('userToken'),
        token: window.sessionStorage.getItem('token'),
        size: size,
        number: number
      })
      this.tableInfoResource = []
      instance.post('informationSource/queryInformationUserList', info_param).then(function (response) {
          response.data = JSON.parse(response.data)
        if(response.data.result&&(response.data.result.code===200||response.data.result.code==='200')){
          response.data.result.resultObj = JSON.parse(response.data.result.resultObj)
          // self.tableInfoResource = response.data.rows
          let datas_ =response.data.result.resultObj.datas
          let len_ = datas_.length
          for(let i=0;i<len_;i++){
            if(datas_[i].state==='0') datas_[i].state = '停止'
            if(datas_[i].state==='1') datas_[i].state = '采集中 '
            if(datas_[i].state==='2') datas_[i].state = '等待'
            self.tableInfoResource.push({
              account: datas_[i].account,//帐号
              id: datas_[i].id,
              mediaName: datas_[i].mediaName,//信息源
              name: datas_[i].name,//任务名称
              state: datas_[i].state//状态
            })
          }
          self.tablePage.total = response.data.page.totalElements
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
    postId (mediaType, name) {
      // console.log(id) //查看ID
      this.$router.push({
        path: '/infoResourceDetail',
        query: {
          mediaType: mediaType,
          username: name
        }
      })
    },
    infoMediaList (medittype) {
      let self = this
      let medie_param = qs.stringify({
        parentId: medittype,
        userToken: window.sessionStorage.getItem('userToken'),
        token: window.sessionStorage.getItem('token')
      })
      instance.post('informationSource/queryInformationSourceList', medie_param).then(function (response) {
        response.data = JSON.parse(response.data)
        if(response.data&&(response.data.code===200||response.data.code==='200')){
          let datas_ = response.data.resultObj
          let len_ = datas_.length
          for(let i=0;i<len_;i++){
            self.valueMed.push({
              id: datas_[i].id,
              label: datas_[i].name
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
      console.log(val.length)
      let len_val = val.length
      this.selectionArr = []
      this.selectionStr = ''
      for(let i=0;i<len_val;i++){
        this.selectionArr.push(val[i].id)
      }
      this.selectionStr = this.selectionArr.join(',')
    },
    exportExc () {
      this.hrefExc = ''
      let selectStr = this.selectionArr.length > 0 ? this.selectionStr : ''
      let parstr = '?id='+selectStr+'&state='+this.valueSta+'&name='+this.searchResource+'&size=10&number='+
                    this.currentPage+'&userToken='+window.sessionStorage.getItem('userToken')+'&token='+window.sessionStorage.getItem('token')
      let href_ = window.sessionStorage.getItem('baseUrl')+'informationSource/expInformationUserExcel'+parstr
      this.hrefExc = href_
    }
  },
  created () {
    this.infoUserList('', -1, '', 10, 1)
    this.infoMediaList(0)
    this.exportExc()
    Bus.$on('resourceData', (e) => {
      // console.log(e) tree id
      this.infoUserList(e.id, this.valueSta, '', 10, 1)
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
.inforesource-select{
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
.media-title{
  height: 36px;
  line-height: 36px;
  color: #fff;
  text-align: center;
  font-weight: bold;
  border-radius: 4px;
  background-color: #445fb0;
}
.info-sta,.info-med{
  width: 100px;
}
.bg-purple-dark {
    background: #99a9bf;
}
.bg-purple {
  text-align: left;
  background: #e5e9f2;
  overflow: hidden;
}
.bg-purple-light {
  /*background: #d3dce6;*/
  float: right;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.el-pagination{
  text-align: center;
  margin-top: 15px;
}
.search-input{
  width: 250px;
}
</style>
