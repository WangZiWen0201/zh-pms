<template>
  <div class="">
    <div class="tree-opera"  v-show="this.$route.path==='/infoResource'">
      <i class="iconfont icon-add" @click="addItem()"></i>
      <i class="iconfont icon-edit_" @click="editItem()"></i>
      <i class="iconfont icon-delet_" @click="delItem()"></i>
    </div>
    <div class="tree">
      <!-- 策略管理 -->
      <div class="grid-content bg-purple margint100" v-show="this.$route.path==='/tactics'">
        <div class="media-title">
          媒体类型
        </div>
        <el-tree :data="dataInfoPlan" :props="planeDefaultProps" @node-click="nodeClickMe" highlight-current></el-tree>
        <!-- default-expand-all  @node-click="handleNodeClick" -->
      </div>

      <!-- 状态监控 -->
      <div class="grid-content bg-purple margint100" v-show="this.$route.path==='/monitor'">
        <div class="media-title">
          客户类型
        </div>
        <el-input
          placeholder="客户类型"
          icon="search"
          v-model="searchInput"
          :on-icon-click="handleIconClick"
          v-show="this.$route.path==='/monitor'"
          >
        </el-input>
        <!-- default-expand-all -->
        <el-tree
          :data="dataInfoPlanMonitor"
          node-key="id"
          ref="monitorTree"
          highlight-current
          :props="monitorDefaultProps"
          :filter-node-method="filterNode"
          @node-click="nodeClickMo">
        </el-tree>
      </div>
      <!-- 信息源管理 -->
      <div class="grid-content bg-purple" v-show="this.$route.path==='/infoResource'">
        <div class="media-title">
          信息源
        </div>
        <!-- default-expand-all   @node-click="handleNodeClick"-->
        <el-tree
          :data="dataInfoResource"
          :props="infoResourceDefaultProps"
          show-checkbox
          ref="tree"
          node-key="id"
          highlight-current
          :default-expanded-keys="this.dialogReAddMess.expArray"
          :check-strictly="strictly"
          @node-click="nodeClickRe"
          >
        </el-tree>
        <el-dialog title="新增信息源" :visible.sync="dialogReAdd">
          <el-input :placeholder="this.dialogReAddMess.name" :disabled="true" class="paddingb15">
            <template slot="prepend">上级信息源名称:</template>
          </el-input>
          <el-input placeholder="请输入信息源名称" class="paddingb15" v-model="addname">
            <template slot="prepend">新增信息源名称:</template>
          </el-input>
          <div class="diabtn">
            <el-button type="primary" @click="addConfrim()"><i class="el-icon-loading" v-show="addLoading"></i>确定</el-button>
            <el-button @click="dialogReAdd = false">取消</el-button>
          </div>
        </el-dialog>
        <el-dialog title="修改信息源" :visible.sync="dialogReEdit">
          <el-input placeholder="请修改信息源名称" class="paddingb15" v-model="editname">
            <template slot="prepend">修改信息源名称:</template>
          </el-input>
          <div class="diabtn">
            <el-button type="primary" @click="editConfrim()"><i class="el-icon-loading" v-show="editLoading"></i>确定</el-button>
            <el-button @click="dialogReEdit = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import instance from '../js/axios'
import Bus from '../js/eventBus.js'
export default {
  name: 'tree',
  props: {
    routerPath: String
  },
  data () {
    return {
      searchInput: '',
      addLoading: false,
      editLoading: false,
      dataInfoPlan: [],
      planeDefaultProps: {
        children: 'children',
        label: 'label'
      },
      dataInfoPlanMonitor: [],
      monitorDefaultProps: {
        children: 'children',
        label: 'label'
      },
      tableInfoResource: [],
      //resource data
      strictly: true, //父子节点不关联
      dataInfoResource: [],
      infoResourceDefaultProps: {
        children: 'children',
        label: 'label',
        id: 'id',
        parentId: 'parentId'
      },
      dialogReAdd: false,
      dialogReEdit: false,
      dialogReAddMess: {
        name: '',
        parent_id: '',
        id: '',
        expArray: []
      },
      dialogReEditMess: {
        name: '',
        parent_id: '',
        id: ''
      },
      addname: '',
      editname: ''
    }
  },
  methods: {
    handleIconClick () {
      this.$message('若无数据,请尝试重输入!')
    },
    // 信息源接口
    queryInformationSourceList () {
      let re_params = qs.stringify({
        userToken: window.sessionStorage.getItem('userToken'),
        token: window.sessionStorage.getItem('token')
      })
      let self = this
      let inArr = (array) => {
        let len_arr = array.length
        let reArr = []
        for(let i=0;i<len_arr;i++){
          if(array[i].children&&array[i].children.length>0){
            reArr.push({
              id: array[i].id,
              label: array[i].name,
              parentId: array[i].parentId,
              children: inArr(array[i].children)
            })
          } else {
            reArr.push({
              id: array[i].id,
              label: array[i].name,
              parentId: array[i].parentId
            })
          }
        }
        return reArr
      }
      instance.post('informationSource/queryInformationSourceList', re_params).then(function (response) {
        response.data = JSON.parse(response.data)
        if(response.data.status){
          let arr_tree = inArr(response.data.resultObj)
          self.dataInfoResource = arr_tree
          self.dataInfoPlan = arr_tree
          self.dataInfoPlanMonitor = arr_tree
        } else {
          self.$message({
            showClose: true,
            message: response.data.message,
            type: 'warning'
          })
        }
      })
    },
    addItem () {
       let addArr = this.$refs.tree.getCheckedNodes()
       let self = this
       if (addArr && addArr.length === 1){
         let add_param =qs.stringify({
           name: addArr[0].label,
           parent_id: addArr[0].parentId,
           id: addArr[0].id
         })
         this.dialogReAddMess.name = addArr[0].label
         this.dialogReAddMess.parent_id = addArr[0].parentId
         this.dialogReAddMess.id = addArr[0].id
         this.dialogReAdd = true
       } else {
         self.$message({
           showClose: true,
           message: '请选取一条信息源添加!',
           type: 'warning'
         })
       }
    },
    addConfrim () {
      let self =this
      this.addLoading = true
      let add_param =qs.stringify({
        name: this.addname,
        parentId: this.dialogReAddMess.id,
        userToken: window.sessionStorage.getItem('userToken'),
        token: window.sessionStorage.getItem('token')
      })
      instance.post('informationSource/addInformationSource', add_param).then(function (response) {
        response.data = JSON.parse(response.data)
        if(response.data.code===200||response.data.code==='200'){
          self.dialogReAdd = false
          self.$message({
            showClose: true,
            message: '添加成功!',
            type: 'success'
          })
          self.addname = '' //resultObj -> id name parentId self.dialogReAddMess.parent_id
          self.$options.methods.queryInformationSourceList.bind(self)() //动态加载方法 tree
          self.dialogReAddMess.expArray = self.$refs.tree.getCheckedKeys()
          self.$refs.tree.setCheckedKeys(self.$refs.tree.getCheckedKeys())
        } else {
          let alMess = response.data.message ? response.data.message : '添加失败!'
          self.$message({
            showClose: true,
            message: alMess,
            type: 'warning'
          })
        }
        self.addLoading = false
      })
    },
    editItem () {
      let addArr = this.$refs.tree.getCheckedNodes()
      let self = this
      if (addArr && addArr.length === 1){
        this.editname = addArr[0].label
        this.dialogReEditMess.name = addArr[0].label
        this.dialogReEditMess.parent_id = addArr[0].parentId
        this.dialogReEditMess.id = addArr[0].id
        this.dialogReEdit = true
      } else {
        self.$message({
          showClose: true,
          message: '请选取一条信息源修改!',
          type: 'warning'
        })
      }
    },
    editConfrim () {
      let self =this
      this.editLoading = true
      let edit_param = qs.stringify({
        name: this.editname,
        parent_id: this.dialogReEditMess.parent_id,
        id: this.dialogReEditMess.id,
        userToken: window.sessionStorage.getItem('userToken'),
        token: window.sessionStorage.getItem('token')
      })
      instance.post('informationSource/updateInformationSource', edit_param).then(function (response) {
        response.data = JSON.parse(response.data)
        if(response.data.code===200||response.data.code==='200'){
          self.dialogReEdit= false
          self.editname = '' //resultObj -> id name parentId self.dialogReEditMess.parent_id
          self.$options.methods.queryInformationSourceList.bind(self)() //动态加载方法 tree
          self.dialogReAddMess.expArray = self.$refs.tree.getCheckedKeys()
          self.$refs.tree.setCheckedKeys(self.$refs.tree.getCheckedKeys())
          self.$message({
            showClose: true,
            message: '修改成功!',
            type: 'success'
          })
        } else {
          let alMess = response.data.message ? response.data.message : '编辑失败!'
          self.$message({
            showClose: true,
            message: alMess,
            type: 'warning'
          })
        }
        self.editLoading = false
      })
    },
    delItem () {
      let delArr = this.$refs.tree.getCheckedNodes()
      let self = this
      if (delArr && delArr.length > 0){
        let self = this
        let delStr = this.$refs.tree.getCheckedKeys().join(',')
        let del_params = qs.stringify({
          id: delStr,
          userToken: window.sessionStorage.getItem('userToken'),
          token: window.sessionStorage.getItem('token')
        })
        this.$confirm('此操作将删除该信息源, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          instance.post('informationSource/delInformationSource', del_params).then(function (response) {
            response.data = JSON.parse(response.data)
            if(response.data.code === 200 || response.data.code === '200'){
              self.$options.methods.queryInformationSourceList.bind(self)()
              self.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              let alMess = response.data.message ? response.data.message : '删除失败!'
              self.$message({
                type: 'info',
                message: alMess
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        self.$message({
          showClose: true,
          message: '请最少选取一条信息源删除!',
          type: 'warning'
        })
      }
    },
    // filterNode
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    nodeClickRe (data) {
      Bus.$emit('resourceData', data)
    },
    nodeClickMo (data) {
      Bus.$emit('monitorData', data)
    },
    nodeClickMe (data){
      Bus.$emit('mediaData', data)
    }
  },
  mounted () {
    this.queryInformationSourceList()
  },
  watch: {
    searchInput(val) {
      this.$refs.monitorTree.filter(val);
    }
  }
}
</script>

<style scoped>
/*策略管理cs eleui css 修改了部分公共样式 2017-08-03*/
.tree-opera{
  padding-top: 76px;
  display: flex;
  justify-content: space-around;
}
.tree-opera i{
  cursor: pointer;
}
.el-tree{
  background-color: #f0f0f0;
  padding: 0 10px;
  height: 550px;
  overflow-y: auto;
  overflow-x: hidden;
}
.media-title{
  height: 36px;
  line-height: 36px;
  color: #fff;
  text-align: center;
  color: #969696;
  font-size: 18px;
  /*border-radius: 4px;*/
  background-color: #f0f0f0;
  text-align: left;
  padding-left: 10px;
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
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.paddingb15{
  padding-bottom: 15px;
}
.margint100{
  margin-top: 100px;
}
.diabtn{
  text-align: center;
}
/*end*/
</style>
