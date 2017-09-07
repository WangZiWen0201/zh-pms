<template>
  <!-- 策略管理 搜索帐号/名称/网址/任务名-->
  <div class="">
    <div class="tactics grid-content bg-purple-light">
        <div :class="this.status.searchFocus ? 'stactics-search-l':'tactics-search'">
          <el-input
            placeholder="帐号/关键词/url/任务名称"
            icon="search"
            v-model="status.searchitem"
            :on-icon-click="handleIconClick"
            >
            <!-- @focus="searchFocus()" @blur="searchBlur()" status.elholder -->
          </el-input>
        </div>
        <div class="tactics-opt">
          <span>状态</span>
          <el-select v-model="workState" placeholder="全部" @change="toggleState" class="select-w">
            <el-option label="全部" value="-1"></el-option><!-- 状态，1：采集中0：等待 -1：停止 -->
            <el-option label="采集中" value="1"></el-option>
            <el-option label="等待" value="2"></el-option>
            <el-option label="停止" value="0"></el-option>
          </el-select>
          <el-button :plain="true" type="info" style="margin-left: 10px;" @click="dialogAdd = true">添加</el-button>
          <el-button :plain="true" type="info" @click="dialogExcel = true">批量添加</el-button>
          <el-button :plain="true" type="success" ><a :href="hrefExc">模版</a></el-button>
          <el-button :plain="true" type="success" @click="dialogMutilOpen">批量编辑</el-button>
          <el-button :plain="true" type="warning" v-show="status.widthLimit" @click="delData('')">删除</el-button>
          <el-button :plain="true" type="success" v-show="status.widthLimit" @click="opearState('','')">开始</el-button>
          <el-button :plain="true" type="success" v-show="status.widthLimit" ><a :href="mutilExport">导出</a></el-button>
        </div>
    </div>
    <div class="">
      <el-table ref="multipleTable" :data="tableTactics" @selection-change="selectChange"
      class="inforesource-table" border max-height="500"
       style="width: 100%;" > <!-- @selection-change="handleSelectionChange"-->
       <el-table-column type="selection">
       </el-table-column>
       <el-table-column prop="code" label="任务编号" width="80" show-overflow-tooltip>
       </el-table-column>
       <el-table-column prop="name" label="任务名称" show-overflow-tooltip>
       </el-table-column>
       <el-table-column label="用户名称" width="100">
         <template scope="scope">
           {{ scope.row.username ? scope.row.username.replace('，',',').split(',')[0] : '' }}
           <el-tooltip class="item" effect="dark" content="Bottom Left 提示文字" placement="bottom-start" v-show="scope.row.username&&scope.row.username.replace('，',',').split(',').length>1">
              <div slot="content"  @click="hoverMessage()">{{ scope.row.username }}</div>
              <i class="el-icon-plus"></i>
            </el-tooltip>
         </template>
       </el-table-column>
       <el-table-column label="帐号"  width="100">
         <template scope="scope">
           {{ scope.row.account? scope.row.account.replace('，',',').split(',')[0] : '' }}
           <el-tooltip class="item" effect="dark" content="Bottom Left 提示文字" placement="bottom-start" v-show="scope.row.account&&scope.row.account.replace('，',',').split(',').length>1">
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
       <el-table-column prop="customerOrg" label="客户组织" width="90">
       </el-table-column>
       <el-table-column prop="address" label="操作" width="100" show-overflow-tooltip>
        <template scope="scope">
         <i class="iconfont icon-begin cupointer"@click="opearState(scope.row.id,scope.row.state)"></i>
         <i class="iconfont icon-edit_ cupointer" @click="updateInfo(scope.row.id)"></i>
         <i class="iconfont icon-delet_ cupointer" @click="delData(scope.row.id)"></i>
        </template>
       </el-table-column>
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
    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="dialogAdd" style="min-width: 650px;">
      <el-form :model="formAdd" :rules="rules" ref="formAdd" >
        <el-form-item label="任务名称:" prop="taskName" :label-width="formLabelWidth">
          <el-input v-model="formAdd.taskName" auto-complete="off" placeholder="请输入任务名称"></el-input>
      </el-form-item>

      <div class="flexcontent">
        <el-form-item label="媒体类型:" prop="colMedia":label-width="formLabelWidth">
          <el-select v-model="formAdd.colMedia" placeholder="请选择">
            <el-option
              v-for="item in valueMed"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="采集类型:" prop="colType" :label-width="formLabelWidth">
          <el-select v-model="formAdd.colType" placeholder="请选择">
            <el-option label="帐号" value="1"></el-option>
            <el-option label="关键词" value="2"></el-option>
            <el-option label="URL" value="3"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="帐号/关键词/url:" prop="account" :label-width="formLabelWidth">
        <el-input v-model="formAdd.account" auto-complete="off" placeholder="帐号/关键词/url"></el-input>
      </el-form-item>

      <div class="flexcontent">
        <el-form-item label="采集频率:" :label-width="formLabelWidth">
          <el-input v-model="formAdd.frequency" placeholder="min/次" :disabled='addfredate'></el-input>
        </el-form-item>
        <el-form-item label="或特定时间:" :label-width="formLabelWidth">
          <el-time-picker type="fixed-time" placeholder="选择特定时间" v-model="formAdd.specificTime" style="width: 100%;" :disabled='addspedate'></el-time-picker>
        </el-form-item>
      </div>

      <div class="flexcontent">
        <el-form-item label="状态:" prop="state" :label-width="formLabelWidth">
          <el-select v-model="formAdd.state" placeholder="请选择">
            <el-option label="采集中" value="1"></el-option>
            <el-option label="等待" value="2"></el-option>
            <el-option label="停止" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户组织:" prop="clientOrg" :label-width="formLabelWidth">
            <el-input v-model="formAdd.clientOrg" placeholder="需指定客户"></el-input>
        </el-form-item>
      </div>

      <div class="flexcontent">
        <el-form-item label="选择日期:" :label-width="formLabelWidth" prop="startDate">
            <el-date-picker
            v-model="formAdd.startDate"
            type="daterange"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="到期时间:" :label-width="formLabelWidth" prop="endDate">
          <el-date-picker
            v-model="formAdd.endDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item> -->
      </div>

      <div style="display: flex;">
        <el-form-item label="优先采集:" :label-width="formLabelWidth">
          <el-checkbox v-model="formAdd.jumpQueue">插队</el-checkbox>
        </el-form-item>
        <el-form-item label="支持评论:" :label-width="formLabelWidth">
          <el-checkbox v-model="formAdd.comment" class="margin-l-8">支持评论</el-checkbox>
        </el-form-item>
      </div>
      </el-form>

      <div slot="footer" class="dialog-footer textalign-center">
        <el-button type="primary" @click="submitTask('add')">确 定</el-button>
        <el-button @click="dialogAdd = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 批量添加 -->
      <el-dialog title="批量添加" :visible.sync="dialogExcel">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadUrl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
          accept=".xls, .xlsx"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xlsx/xls文件(模版)</div><!-- ，且不超过XXXkb -->
        </el-upload>
      </el-dialog>
      <!-- 批量编辑框 -->
      <el-dialog title="批量编辑" :visible.sync="dialogMutilEdit" style="min-width: 650px;">
        <el-form :model="formMutilEdit" ref="formMutilEdit">
          <!-- <el-form-item label="任务名称:" prop="taskName" :label-width="formLabelWidth">
            <el-input v-model="formMutilEdit.taskName" auto-complete="off" placeholder="请输入任务名称"></el-input>
        </el-form-item>

        <div class="flexcontent">
          <el-form-item label="媒体类型:" prop="colMedia":label-width="formLabelWidth">
            <el-select v-model="formMutilEdit.colMedia" placeholder="请选择">
              <el-option
                v-for="item in valueMed"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="采集类型:" prop="colType" :label-width="formLabelWidth">
            <el-select v-model="formMutilEdit.colType" placeholder="请选择">
              <el-option label="帐号" value="1"></el-option>
              <el-option label="关键词" value="2"></el-option>
              <el-option label="URL" value="3"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="帐号/关键词/url:" prop="account" :label-width="formLabelWidth">
          <el-input v-model="formMutilEdit.account" auto-complete="off" placeholder="帐号/关键词/url"></el-input>
        </el-form-item> -->

        <div class="flexcontent">
          <el-form-item label="采集频率:" :label-width="formLabelWidth">
            <el-input v-model="formMutilEdit.frequency" placeholder="min/次" :disabled='mutilfredate'></el-input>
          </el-form-item>
          <el-form-item label="或特定时间:" :label-width="formLabelWidth">
            <el-time-picker type="fixed-time" placeholder="选择特定时间" v-model="formMutilEdit.specificTime" style="width: 100%;" :disabled='mutilspedate'></el-time-picker>
          </el-form-item>
        </div>

        <div class="flexcontent">
          <el-form-item label="状态:" prop="state" :label-width="formLabelWidth">
            <el-select v-model="formMutilEdit.state" placeholder="请选择">
              <el-option label="采集中" value="1"></el-option>
              <el-option label="等待" value="2"></el-option>
              <el-option label="停止" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户组织:" prop="clientOrg" :label-width="formLabelWidth">
              <el-input v-model="formMutilEdit.clientOrg" placeholder="需指定客户"></el-input>
          </el-form-item>
        </div>

        <div class="flexcontent">
          <el-form-item label="请选择日期:" :label-width="formLabelWidth" prop="startDate">
              <el-date-picker
              v-model="formMutilEdit.startDate"
              type="daterange"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="到期时间:" :label-width="formLabelWidth" prop="endDate">
            <el-date-picker
              v-model="formMutilEdit.endDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item> -->
        </div>

        <div style="display: flex;">
          <el-form-item label="优先采集:" :label-width="formLabelWidth">
            <el-checkbox v-model="formMutilEdit.jumpQueue">插队</el-checkbox>
          </el-form-item>
          <el-form-item label="支持评论:" :label-width="formLabelWidth">
            <el-checkbox v-model="formMutilEdit.comment" class="margin-l-8">支持评论</el-checkbox>
          </el-form-item>
        </div>
        </el-form>

        <div slot="footer" class="dialog-footer textalign-center">
          <el-button type="primary" @click="submitTaskMutilEdit()" :disabled="mutilResponse"><i class="el-icon-loading" v-show="mutilResponse"></i>确 定</el-button>
          <el-button @click="dialogMutilEdit = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 编辑修改 -->
      <el-dialog title="编辑" :visible.sync="dialogEdit" style="min-width: 650px;">
        <el-form :model="formEdit" :rules="rules" ref="formEdit" >
          <el-form-item label="任务名称:" prop="taskName" :label-width="formLabelWidth">
            <el-input v-model="formEdit.taskName" auto-complete="off" placeholder="请输入任务名称"></el-input>
        </el-form-item>

        <div class="flexcontent">
          <el-form-item label="媒体类型:" prop="colMedia":label-width="formLabelWidth">
            <el-select v-model="formEdit.colMedia" placeholder="请选择" >
              <el-option
                v-for="item in valueMed"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="采集类型:" prop="colType" :label-width="formLabelWidth">
            <el-select v-model="formEdit.colType" placeholder="请选择">
              <el-option label="帐号" value="1"></el-option>
              <el-option label="关键词" value="2"></el-option>
              <el-option label="URL" value="3"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="帐号/关键词/url:" prop="account" :label-width="formLabelWidth">
          <el-input v-model="formEdit.account" auto-complete="off" placeholder="帐号/关键词/url"></el-input>
        </el-form-item>

        <div class="flexcontent">
          <el-form-item label="采集频率:" :label-width="formLabelWidth">
            <el-input v-model="formEdit.frequency" placeholder="min/次" :disabled='editfredate'></el-input>
          </el-form-item>
          <el-form-item label="或特定时间:" :label-width="formLabelWidth">
            <el-time-picker type="fixed-time" placeholder="选择特定时间" v-model="formEdit.specificTime" style="width: 100%;" :disabled='editspedate'></el-time-picker>
          </el-form-item>
        </div>

        <div class="flexcontent">
          <el-form-item label="状态:" prop="state" :label-width="formLabelWidth">
            <el-select v-model="formEdit.state" placeholder="请选择">
              <el-option label="采集中" value="1"></el-option>
              <el-option label="等待" value="2"></el-option>
              <el-option label="停止" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户组织:" prop="clientOrg" :label-width="formLabelWidth">
              <el-input v-model="formEdit.clientOrg" placeholder="需指定客户"></el-input>
          </el-form-item>
        </div>

        <div class="flexcontent">
          <el-form-item label="请选择日期:" :label-width="formLabelWidth" prop="startDate">
              <el-date-picker
              v-model="formEdit.startDate"
              type="daterange"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="到期时间:" :label-width="formLabelWidth" prop="endDate">
            <el-date-picker
              v-model="formEdit.endDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item> -->
        </div>

        <div style="display: flex;">
          <el-form-item label="优先采集:" :label-width="formLabelWidth">
            <el-checkbox v-model="formEdit.jumpQueue">插队</el-checkbox>
          </el-form-item>
          <el-form-item label="支持评论:" :label-width="formLabelWidth">
            <el-checkbox v-model="formEdit.comment" class="margin-l-8">支持评论</el-checkbox>
          </el-form-item>
        </div>
        </el-form>

        <div slot="footer" class="dialog-footer textalign-center">
          <el-button type="primary" @click="submitTaskEdit('edit')">确 定</el-button>
          <el-button @click="dialogEdit = false">取 消</el-button>
        </div>
      </el-dialog>
  </div>

</template>

<script>
import qs from 'qs'
import instance from '../common/js/axios'
import Bus from '../common/js/eventBus.js'
export default {
  name: 'tactics',
  data () {
    return {
      msg: 'Welcome to tactics',
      workState: '-1',
      valueMed: [],
      hrefExc: '',
      uploadUrl: '',
      mutilExport: '',
      status: {
        searchitem: '',
        selectState: '',
        elholder: '',
        widthLimit: true,
        searchFocus: true
      },
      currentPage: 1,
      tablePage: {
        size: 10,
        total: 0
      },
      tableTactics: [],
      dialogAdd: false,
      dialogEdit: false,
      dialogMutilEdit: false,
      mutilResponse: false,
      formAdd: {
        taskName: '',
        colMedia: '',
        colType: '',
        frequency: '',
        specificTime: '',
        startDate: [],
        endDate: '',
        state: '',
        clientOrg: '',
        account: '',
        jumpQueue: false,
        comment: false
      },
      formMutilEdit: {
        taskName: '',
        colMedia: '',
        colType: '',
        frequency: '',
        specificTime: '',
        startDate: [],
        endDate: [],
        state: '',
        clientOrg: '',
        account: '',
        jumpQueue: false,
        comment: false
      },
      formEdit: {
        taskName: '',
        colMedia: '',
        colType: '',
        frequency: '',
        specificTime: '',
        startDate: [],
        endDate: '',
        state: '',
        clientOrg: '',
        account: '',
        jumpQueue: false,
        comment: false
      },
      currentMediaType: '',//当前选中的
      addspedate: false,
      mutilspedate: false,
      editspedate: false,
      addfredate: false,
      mutilfredate: false,
      editfredate: false,
      editId: '',
      formLabelWidth: '120px',
      dialogExcel: false,
      fileList: [],
      selectArr: [],
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ],
        taskName: [{required: true, message: '请填写任务名称', trigger: 'blur'}],
        colMedia: [{required: true, message: '请选择媒体类型', trigger: 'blur'}],
        colType: [{required: true, message: '请选择采集类型', trigger: 'blur'}],
        account: [{required: true, message: '请填写帐号/关键词/url', trigger: 'blur'}],
        state: [{required: true, message: '请选择状态', trigger: 'blur'}],
        clientOrg: [{required: true, message: '请填写客户组织', trigger: 'blur'}],
        startDate: [{type: 'array', required: true, message: '请填写开始结束日期', trigger: 'blur'}],
        endDate: [{ type: 'date', required: true, message: '请选择到期时间', trigger: 'blur'}],
      }
    }
  },
  methods: {
      handleIconClick() {
        this.taskTaskList (this.workState, '', this.status.searchitem, 10, 1)
      },
      toggleState () {
        this.taskTaskList (this.workState, '', this.status.searchitem, 10, 1)
      },
      searchFocus () {
        this.status.elholder = '帐号/关键词/url/任务名称'
        this.status.widthLimit = false
        this.status.searchFocus = true
      },
      searchBlur () {
        this.status.elholder = ''
        this.status.widthLimit = true
        this.status.searchFocus = false
      },
      hoverMessage () {
        this.$message({
          message: '功能预留模块',
          type: 'success'
        })
      },
      //上传部分
      submitUpload() {
        this.$refs.upload.submit()
        this.taskTaskList(this.workState, '', '', 10, this.currentPage, this.currentMediaType)
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handleSuccess (res, file) {
        if(res.code === 200 || res.code ==='200') {
          this.$message({
            message: '上传成功!',
            type: 'success'
          })
          this.dialogExcel = false
        } else {
          let mes_ = res.message ? res.message: '上传数据有误,请查看表格格式'
          this.$message({
            message: mes_,
            type: 'warning'
          })
        }
      },
      handleError (){
        this.$message({
          message: '上传失败!',
          type: 'warning'
        })
      },
      handlePreview(file) {
        console.log(file)
      },

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChangeTac (val) {
        let pager =qs.stringify({
          // state: this.status.searchitem,
          state: this.workState,
          size: 10,
          number: val,
          userToken: window.sessionStorage.getItem('userToken'),
          token: window.sessionStorage.getItem('token')
        })
        this.taskTaskList(this.workState, '', this.status.searchitem, 10, val)
     },
     selectChange (val) {
       this.selectArr = val
       let len_ = this.selectArr.length,id_=[]
       if(this.selectArr.length > 0) {
         for(let i=0;i<len_;i++){
           id_.push(this.selectArr[i].id)
         }
         id_ = id_.join(',')
       } else {
         id_ = ''
       }
       let parstr = '?id='+id_+'&state='+ this.workState+'&name='+this.status.searchitem+'&size=10&number='+this.currentPage+
                    '&userToken='+window.sessionStorage.getItem('userToken')+'&token='+window.sessionStorage.getItem('token')
       this.mutilExport = window.sessionStorage.getItem('baseUrl')+'taskInfo/expTaskInfoExcel'+parstr
     },
     taskTaskList (state, taskcode, taskname, size, number, id) {
      this.tableTactics = []
      let list_params, url_
      url_ = 'taskInfo/queryTaskInfoList'
      list_params =qs.stringify({
        state: state,
        code: taskcode,
        name: taskname,
        size: size,
        number: number,
        mediaType: id,
        userToken: window.sessionStorage.getItem('userToken'),
        token: window.sessionStorage.getItem('token')
      })
      let self = this
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
    },
    //媒体类型
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
    submitTask (formName, url) {
      if(this.formAdd.frequency&&(this.formAdd.frequency < 15 || this.formAdd.frequency > 43200)){
        this.$message({
          showClose: true,
          message: '输入采集频率须在15~43200分钟之间',
          type: 'warning'
        })
        return
      }
      let formatDate = (obj) => {//日期时间转换
         let d = new Date(obj)
         let month_ = d.getMonth() + 1 <= 9 ? '0'+(d.getMonth() + 1) : (d.getMonth() + 1)
         return d.getFullYear() + '-' + month_ + '-' + d.getDate()
      }
      this.$refs['formAdd'].validate((valid) => {
        let math_num = 15*Math.ceil(this.formAdd.frequency/15)
        let self = this, spe_time
        if (valid) {
          let jumpQueue_ = this.formAdd.jumpQueue?1:0
          let comment_ = this.formAdd.comment?1:0
          let frequency_ = Math.ceil(this.formAdd.frequency/15) === 0 ? '' : 15*Math.ceil(this.formAdd.frequency/15)
          if(this.formAdd.specificTime) {
            spe_time = this.formAdd.specificTime.getHours() +':'+ this.formAdd.specificTime.getMinutes() +':'+ this.formAdd.specificTime.getSeconds()
          } else {
            spe_time = ''
          }
          let post_param = qs.stringify({
            name: this.formAdd.taskName,//任务名称
            mediaType: this.formAdd.colMedia,//媒体类型
            collectionType: this.formAdd.colType,//采集类型
            account: this.formAdd.account,//帐号 关键词 url
            frequency: frequency_, //采集频率 specificTime 或者 frequency
            specificTime: spe_time, //采集频率 specificTime 或者 frequency
            state: this.formAdd.state,//状态
            customerOrg: this.formAdd.clientOrg,//客户组织
            startTime: formatDate(this.formAdd.startDate[0]),//开始时间
            endTime: formatDate(this.formAdd.startDate[1]),//结束时间
            jumpQueue: jumpQueue_,//插队
            comment: comment_,//評論
            userToken: window.sessionStorage.getItem('userToken'),
            token: window.sessionStorage.getItem('token')
          })
          this.currentMediaType = this.formAdd.colMedia
          instance.post('taskInfo/addTaskInfo', post_param).then(function (response) {
            response.data = JSON.parse(response.data)
            if(response.data&&(response.data.code===200||response.data.code==='200')){
              self.$refs['formAdd'].resetFields()
              self.taskTaskList(self.workState, '', '', 10, 1)
              self.dialogAdd = false
              self.$message({
                showClose: true,
                message: '添加成功!',
                type: 'success'
              })
            } else {
              let alMess = response.data.message ? response.data.message : '数据错误!'
              self.$message({
                showClose: true,
                message: alMess,
                type: 'warning'
              })
            }
            // self.$refs.tree.setCheckedKeys([self.currentMediaType])
          })
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    submitTaskEdit () {
      if(this.formEdit.frequency&&(this.formEdit.frequency < 15 || this.formEdit.frequency > 43200)){
        this.$message({
          showClose: true,
          message: '输入采集频率须在15~43200分钟之间',
          type: 'warning'
        })
        return
      }
      this.formEdit.startDate = this.formEdit.startDate
      // this.formEdit.endDate = new Date(this.formEdit.endDate)
      this.$refs['formEdit'].validate((valid) => {
        let math_num = 15*Math.ceil(this.formEdit.frequency/15)
        let self = this
        if (valid) {
          let jumpQueue_ = this.formEdit.jumpQueue?1:0
          let comment_ = this.formEdit.comment?1:0
          let frequency_ = this.formEdit.frequency ? 15*Math.ceil(this.formEdit.frequency/15) : ''
          let formatDate = (obj) => {//日期时间转换
             let d = new Date(obj)
             let month_ = d.getMonth() + 1 <= 9 ? '0'+(d.getMonth() + 1) : (d.getMonth() + 1)
             return d.getFullYear() + '-' + month_ + '-' + d.getDate()
          }
          let new_date = new Date(), spe_hour, spe_min, spe_sec, speTime
          let spe_year = new_date.getFullYear(),spe_month = new_date.getMonth(),spe_day = new_date.getDate()
          if (this.formEdit.specificTime) {
            spe_hour = this.formEdit.specificTime.getHours()
            spe_min = this.formEdit.specificTime.getMinutes()
            spe_sec = this.formEdit.specificTime.getSeconds()
            speTime = spe_hour +':'+ spe_min +':'+ spe_sec
          }else {
            speTime = ''
          }
          let post_param = qs.stringify({
            id:  this.editId,//批量 ,
            code: this.formEdit.code,//任務編碼
            name: this.formEdit.taskName,//任务名称
            mediaType: this.formEdit.mediaType,//媒体类型
            collectionType: this.formEdit.colType,//采集类型
            account: this.formEdit.account,//帐号 关键词 url
            frequency: frequency_, //采集频率 specificTime 或者 frequency
            specificTime: speTime, //修改hou
            state: this.formEdit.state,//状态
            customerOrg: this.formEdit.clientOrg,//客户组织
            startTime: formatDate(this.formEdit.startDate[0]),//开始时间
            endTime: formatDate(this.formEdit.startDate[1]),//结束时间
            jumpQueue: jumpQueue_,//插队
            comment: comment_,//插队
            samplingToday: this.formEdit.samplingToday,//今日采集量
            totalCollection: this.formEdit.totalCollection,//今日采集量
            userToken: window.sessionStorage.getItem('userToken'),
            token: window.sessionStorage.getItem('token')
          })
          instance.post('taskInfo/updateTaskInfo', post_param).then(function (response) {
            response.data = JSON.parse(response.data)
            if(response.data&&(response.data.code===200||response.data.code==='200')){
              self.$refs['formEdit'].resetFields()
              self.taskTaskList(self.workState, '', '', 10, self.currentPage, self.currentMediaType)
              self.dialogEdit = false
              self.$message({
                showClose: true,
                message: '修改成功!',
                type: 'success'
              })
            } else {
              let alMess = response.data.message ? response.data.message : '数据错误!'
              self.$message({
                showClose: true,
                message: alMess,
                type: 'warning'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    dialogMutilOpen () {
      if(!this.selectArr.length) {
        this.$message({
          showClose: true,
          message: '请选择需要编辑的任务',
          type: 'warning'
        })
        return
      } else {
        this.dialogMutilEdit=true
      }
    },
    submitTaskMutilEdit () {
      let idsArr = this.selectArr,ids,idArr=[]
      if(idsArr.length > 0){
        for(let i=0;i<idsArr.length;i++){
          idArr.push(idsArr[i].id)
        }
        ids = idArr.join(',')
      }
      if(this.formMutilEdit.frequency&&(this.formMutilEdit.frequency < 15 || this.formMutilEdit.frequency > 43200)){
        this.$message({
          showClose: true,
          message: '输入采集频率须在15~43200分钟之间',
          type: 'warning'
        })
        return
      }
      // let arr_temp = this.formMutilEdit.startDate
      // this.formMutilEdit.startDate = new Date(arr_temp[0])
      // this.formMutilEdit.endDate = new Date(arr_temp[1])
      this.mutilResponse = true
      let math_num = 15*Math.ceil(this.formMutilEdit.frequency/15)
      let self = this
      let jumpQueue_ = this.formMutilEdit.jumpQueue?1:0
      let comment_ = this.formMutilEdit.comment?1:0
      let frequency_ = this.formMutilEdit.frequency ? 15*Math.ceil(this.formMutilEdit.frequency/15) : ''
      let formatDate = (obj) => {//日期时间转换
         let d = new Date(obj)
         let month_ = d.getMonth() + 1 <= 9 ? '0'+(d.getMonth() + 1) : (d.getMonth() + 1)
         return d.getFullYear() + '-' + month_ + '-' + d.getDate()
      }
      let start_, end_
      if (this.formMutilEdit.startDate.length >0) {
        start_ = formatDate(this.formMutilEdit.startDate[0])
        end_ = formatDate(this.formMutilEdit.startDate[1])
      } else {
        start_ = ''
        end_ = ''
      }
      let post_param = qs.stringify({
        id:  ids,//批量id
        // code: this.formMutilEdit.code,//任務編碼
        // name: this.formMutilEdit.taskName,//任务名称
        // mediaType: this.formMutilEdit.colMedia,//媒体类型
        // collectionType: this.formMutilEdit.colType,//采集类型
        // account: this.formMutilEdit.account,//帐号 关键词 url
        frequency: frequency_, //采集频率 specificTime 或者 frequency
        specificTime: this.formMutilEdit.specificTime,
        state: this.formMutilEdit.state? this.formMutilEdit.state: -1,//状态
        customerOrg: this.formMutilEdit.clientOrg,//客户组织
        startTime: start_,//开始时间
        endTime: end_,//结束时间
        jumpQueue: jumpQueue_,//插队
        comment: comment_,//插队
        samplingToday: this.formMutilEdit.samplingToday,//今日采集量
        totalCollection: this.formMutilEdit.totalCollection,//今日采集量
        userToken: window.sessionStorage.getItem('userToken'),
        token: window.sessionStorage.getItem('token')
      })
      instance.post('taskInfo/updateTaskInfo', post_param).then(function (response) {
        response.data = JSON.parse(response.data)
        if(response.data&&(response.data.code===200||response.data.code==='200')){
          self.taskTaskList(self.workState, '', '', 10, 1, self.currentMediaType)
          self.$refs['formMutilEdit'].resetFields()
          self.formMutilEdit.frequency = ''
          self.formMutilEdit.specificTime = ''
          self.formMutilEdit.comment = 0
          self.formMutilEdit.jumpQueue = 0
          self.dialogMutilEdit = false
          self.$message({
            showClose: true,
            message: '批量编辑成功!',
            type: 'success'
          })
        } else {
          let alMess = response.data.message ? response.data.message : '数据错误!'
          self.$message({
            showClose: true,
            message: alMess,
            type: 'warning'
          })
        }
        self.mutilResponse = false
      })
    },
    mutilCopera () {

    },
    opearState (id,state) {
      let state_,tex
      if(state === '采集中') {
        state_ = 0
        tex = '停止'
      } else if (state === '停止') {
        state_ = 1
        tex = '采集中'
      } else { //等待
        state_ = 0
        tex = '采集中'
      }
      if(!id){
        state_ = 1
        state = '所有状态'
        if(!this.selectArr.length){
          this.$message({
            showClose: true,
            message: '请选择任务',
            type: 'warning'
          })
          return
        }
        let idArr = []
        for(let i=0;i<this.selectArr.length;i++){
          idArr.push(this.selectArr[i].id)
        }
        id = idArr.join(',')
      }
      this.$confirm('当前状态为 “'+state+'” 此操作将状态会改为 “'+tex+'” , 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let self = this
        let copera_param = qs.stringify({
          id: id,
          state: state_,
          userToken: window.sessionStorage.getItem('userToken'),
          token: window.sessionStorage.getItem('token')
        })
        instance.post('taskInfo/updateTaskInfo', copera_param).then(function (response) {
          response.data = JSON.parse(response.data)
          if(response.data&&(response.data.code===200||response.data.code==='200')){
            self.taskTaskList(self.workState, '', '', 10, self.currentPage, self.currentMediaType)
            self.$message({
              type: 'success',
              message: '操作成功!'
            })
          } else {
            let alMess = response.data.message ? response.data.message : '数据错误!'
            self.$message({
              showClose: true,
              message: alMess,
              type: 'warning'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    updateInfo (id) {
      this.editId = id
      let self = this
      let edit_params = qs.stringify({
        id: id,
        userToken: window.sessionStorage.getItem('userToken'),
        token: window.sessionStorage.getItem('token')
      })
      self.formEdit.startDate = []
      instance.post('taskInfo/queryTaskInfoById', edit_params).then(function (response) {
        response.data = JSON.parse(response.data)
        if(response.data&&(response.data.code===200||response.data.code==='200')){
          let edit_data = response.data.resultObj , date_ =new Date()
          let spe_year = date_.getFullYear(),
              spe_month = date_.getMonth()+1, spe_day = date_.getDate()
          let spe_hour = edit_data.specificTime.split(':')[0],  spe_min = edit_data.specificTime.split(':')[1],
              spe_sec = edit_data.specificTime.split(':')[2]
          let speTime = new Date(spe_year, spe_month, spe_day, spe_hour, spe_min, spe_sec)
          if(!spe_hour && !spe_min && !spe_sec) speTime=''
          self.formEdit.code = edit_data.code
          self.formEdit.taskName = edit_data.name
          self.formEdit.colMedia = edit_data.mediaType
          self.formEdit.colType = edit_data.collectionType
          self.formEdit.state = edit_data.state
          // self.formEdit.state = edit_data.collectionType
          self.formEdit.account = edit_data.account
          self.formEdit.startDate.push(new Date(edit_data.startTime))
          self.formEdit.startDate.push(new Date(edit_data.endTime))
          // self.formEdit.endDate = edit_data.endTime
          self.formEdit.comment = edit_data.comment===1 ? true: false
          self.formEdit.jumpQueue = edit_data.jumpQueue===1 ? true: false
          self.formEdit.clientOrg = edit_data.customerOrg
          self.formEdit.frequency = edit_data.frequency
          self.formEdit.specificTime = speTime
          self.formEdit.samplingToday = edit_data.samplingToday
          self.formEdit.totalCollection = edit_data.totalCollection
          self.dialogEdit = true
          // self.taskTaskList('', '', '', 10, 1)
          // self.$refs['formEdit'].resetFields()
          // self.dialogAdd = false
          // self.$message({
          //   showClose: true,
          //   message: '添加成功!',
          //   type: 'success'
          // })
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
    delData (id) {
      if(!id) {
        if(!this.selectArr.length){
          this.$message({
            showClose: true,
            message: '请选择任务',
            type: 'warning'
          })
          return
        }
      }
      this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this
        if(!id) {
          let idArr = []
          for(let i=0;i<this.selectArr.length;i++){
            idArr.push(this.selectArr[i].id)
          }
          id = idArr.join(',')
        }
        let edit_params = qs.stringify({
          id: id,
          userToken: window.sessionStorage.getItem('userToken'),
          token: window.sessionStorage.getItem('token')
        })
        instance.post('taskInfo/delTaskInfo', edit_params).then(function (response) {
          response.data = JSON.parse(response.data)
          if(response.data&&(response.data.code===200||response.data.code==='200')){
            self.taskTaskList(self.workState, '', '', 10, self.currentPage, self.currentMediaType)
            self.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            let alMess = response.data.message ? response.data.message : '数据错误!'
            self.$message({
              showClose: true,
              message: alMess,
              type: 'warning'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    }
  },
  mounted () {
    this.taskTaskList(-1, '', '', 10, 1)
    this.hrefExc = window.sessionStorage.getItem('baseUrl')+'taskInfo/expTaskInfo'
    let len_ = this.selectArr.length,id_=[]
    if(this.selectArr.length > 0) {
      for(let i=0;i<len_;i++){
        id_.push(this.selectArr[i].id)
      }
      id_ = id_.join(',')
    } else {
      id_ = ''
    }
    let parstr = '?id='+id_+'&state='+ this.workState+'&name='+this.status.searchitem+'&size=10&number='+this.currentPage+
                 '&userToken='+window.sessionStorage.getItem('userToken')+'&token='+window.sessionStorage.getItem('token')
    this.mutilExport = window.sessionStorage.getItem('baseUrl')+'taskInfo/expTaskInfoExcel'+parstr
  },
  created () {
    this.infoMediaList(0)
    let urlStr = window.sessionStorage.getItem('baseUrl')+'taskInfo/impTaskInfo?token='+
          window.sessionStorage.getItem('token')+'&userToken='+window.sessionStorage.getItem('userToken')
    this.uploadUrl = urlStr
    Bus.$on('mediaData', (e) => {
      this.taskTaskList (this.workState, '', this.status.searchitem, 10, 1, e.id)
      this.currentMediaType = e.id
    })
    Bus.$on('errMessage', (e) => {
      let mess_ = e.message ? e.message: '登录超时,已为您跳转登录页面!'
      this.$message({
        showClose: true,
        message: mess_,
        type: 'warning'
      })
      this.$router.push({
        path: '/login'
      })
    })
  },
  watch: {
    'formAdd.frequency': {
      handler (n, o) {
        if(this.formAdd.frequency.length>0) {
          this.addspedate=true
        } else if(!this.formAdd.frequency) {
          this.addspedate=false
        }
      }
    },
    'formAdd.specificTime': {
      handler (n, o) {
        if(this.formAdd.specificTime) {
          this.addfredate=true
        } else if(!this.formAdd.specificTime) {
          this.addfredate=false
        }
      }
    },
    'formEdit.frequency': {
      handler (n, o) {
        if(this.formEdit.frequency.length>0) {
          this.editspedate=true
        } else if(!this.formEdit.frequency) {
          this.editspedate=false
        }
      }
    },
    'formEdit.specificTime': {
      handler (n, o) {
        if(this.formEdit.specificTime) {
          this.editspedate=true
        } else if(!this.formEdit.specificTime) {
          this.editspedate=false
        }
      }
    },
    'formMutilEdit.frequency': {
      handler (n, o) {
        if(this.formMutilEdit.frequency.length>0) {
          this.mutilspedate=true
        } else if(!this.formMutilEdit.frequency) {
          this.mutilspedate=false
        }
      }
    },
    'formMutilEdit.specificTime': {
      handler (n, o) {
        if(this.formMutilEdit.specificTime) {
          this.mutilspedate=true
        } else if(!this.formMutilEdit.specificTime) {
          this.mutilspedate=false
        }
      }
    },
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
  width: 200px;
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
.cupointer{
  cursor: pointer;
}
</style>
