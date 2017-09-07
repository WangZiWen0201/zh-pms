<template>
  <!-- 采集概况 -->
    <div class="infobasic">
        <div class="info-icon">
          <i :class="this.toggleFocus ? 'iconfont icon-data info-icon-fucos'  : 'iconfont icon-data'" @click="toggleBg()"></i>
          <i :class="!this.toggleFocus ? 'iconfont icon-curve info-icon-fucos'  : 'iconfont icon-curve'" @click="toggleBg()"></i>
        </div>
        <div class="info-table" v-show='this.toggleFocus'>
          <el-table
            :data="infobasicData"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column
              prop="mediaType"
              label="媒体类型"
              width="">
            </el-table-column>
            <el-table-column
              prop="samplingToday"
              label="今日采集量"
              width="">
            </el-table-column>
            <el-table-column
              prop="hoursCollection"
              width=""
              label="24小时采集量">
            </el-table-column>
            <el-table-column
              prop="totalCollection"
              label="采集总量"
              width="">
            </el-table-column>
            <el-table-column
              prop="thisweekGrowth"
              label="本周平均日新增"
              width="">
            </el-table-column>
            <el-table-column
              prop="lastweekGrowth"
              width=""
              label="上周平均日新增">
            </el-table-column>
            <el-table-column
              prop="momGrowth"
              width=""
              label="周环比增长">
            </el-table-column>
          </el-table>
        </div>
        <div class=" info-echarts" v-show='!this.toggleFocus'>
            <div class="info-echarts-toggle">
              <el-switch
              v-model="dayOrhours"
              on-color="#13ce66"
              off-color="#1D8CE0"
              on-text="时"
              off-text="天">
              </el-switch>
            </div>
            <div id="charts-col">

            </div>
            <div class="echarts-bg">

            </div>
        </div>
        <!-- 新增弹框部分 -->
        <!-- <el-button type="text" @click="dialogFormVisible = true;">openDialog</el-button> -->
        <!-- <el-dialog title="添加采集策略" :visible.sync="dialogFormVisible">
          别点了 懒得写。
        </el-dialog> -->
    </div>
</template>

<script>
import qs from 'qs'
import instance from '../common/js/axios'
import Bus from '../common/js/eventBus.js'
export default {
  name: 'infobasic',
  data () {
    return {
      dialogFormVisible: false,
      toggleFocus: false,
      dayOrhours: false,
      infobasicData: [{
        medianame: 'app客户端',
        samplingToday: '426690',
        hoursCollection: '46335',
        totalCollection: '6628882',
        thisweekGrowth: '87692368',
        lastweekGrowth: '4463',
        momGrowth: '15%'
      }]
    }
  },
  methods: {
    tableRowClassName (row, index) {
      if (index === 1) {
        return 'info-row'
      } else if (index === 3) {
        return 'positive-row'
      }
      return ''
    },
    toggleBg () {
      this.toggleFocus = this.toggleFocus ? false : true
      if (this.toggleFocus) {
        Bus.$emit('toggleFocus', true)
      } else {
        Bus.$emit('toggleFocus', false)
      }
    },
    colquerylist () {
      let collist_params = qs.stringify({
        // state: state,
        // traceType: traceType,
        // account: account,
        // size: size,
        // number: number,
        userToken: window.sessionStorage.getItem('userToken'),
        token: window.sessionStorage.getItem('token')
      })
      let self = this
      this.infobasicData = []
      instance.post('collectionSurvey/queryCollectionSurveyList', collist_params).then(function (response) {
        response.data = JSON.parse(response.data)
        if(response.data&&(response.data.code===200||response.data.code==='200')){
          let datas_ = JSON.parse(response.data.resultObj)
          let len_ = datas_.length
          for(let i=0;i<len_;i++){
            // let state_
            // if(datas_[i].state === 1 || datas_[i].state === '1') state_ = '采集中'
            // if(datas_[i].state === 2 || datas_[i].state === '2') state_ = '等待'
            // if(datas_[i].state === 3 || datas_[i].state === '3') state_ = '停止'
            // let traceType_
            // if(datas_[i].traceType === 1 || datas_[i].traceType === '1') traceType_ = '作者跟踪'
            // if(datas_[i].traceType === 2 || datas_[i].traceType === '2') traceType_ = '文章跟踪'
            // if(datas_[i].traceType === 3 || datas_[i].traceType === '3') traceType_ = '探针'
            self.infobasicData.push({
              id: datas_[i].id,
              mediaType: datas_[i].mediaType,
              hoursCollection: datas_[i].hoursCollection,
              lastweekGrowth: datas_[i].lastweekGrowth,
              thisweekGrowth: datas_[i].thisweekGrowth,
              samplingToday: datas_[i].samplingToday,
              totalCollection: datas_[i].totalCollection,
              momGrowth: datas_[i].momGrowth+'%'
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
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('charts-col'))
      // 绘制图表 默认 时
      let charts_params = qs.stringify({
        userToken: window.sessionStorage.getItem('userToken'),
        token: window.sessionStorage.getItem('token')
      })
      // instance.post('/collectionChart/queryCollectionChartList', charts_params).then(function (response) {
      //   console.log(response)
      //   response.data = JSON.parse(response.data)
        // if(response.data&&(response.data.code===200||response.data.code==='200')){
          // let datas_ = JSON.parse(response.data.resultObj)
          // let len_ = datas_.length
          // for(let i=0;i<len_;i++){
            // let state_
            // if(datas_[i].state === 1 || datas_[i].state === '1') state_ = '采集中'
            // if(datas_[i].state === 2 || datas_[i].state === '2') state_ = '等待'
            // if(datas_[i].state === 3 || datas_[i].state === '3') state_ = '停止'
            // let traceType_
            // if(datas_[i].traceType === 1 || datas_[i].traceType === '1') traceType_ = '作者跟踪'
            // if(datas_[i].traceType === 2 || datas_[i].traceType === '2') traceType_ = '文章跟踪'
            // if(datas_[i].traceType === 3 || datas_[i].traceType === '3') traceType_ = '探针'
            // self.infobasicData.push({
            //   id: datas_[i].id,
            //   mediaType: datas_[i].mediaType,
            //   hoursCollection: datas_[i].hoursCollection,
            //   lastweekGrowth: datas_[i].lastweekGrowth,
            //   thisweekGrowth: datas_[i].thisweekGrowth,
            //   samplingToday: datas_[i].samplingToday,
            //   totalCollection: datas_[i].totalCollection,
            //   momGrowth: datas_[i].momGrowth+'%'
            // })
          // }
        // } else {
        //   let alMess = response.data.message ? response.data.message : '数据错误!'
        //   self.$message({
        //     showClose: true,
        //     message: alMess,
        //     type: 'warning'
        //   })
        // }
      // })
      myChart.setOption({
        title: {
        text: '采集统计',
        left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
        },
        toolbox: {
            show : true,
            feature : {
                saveAsImage : {show: true}
            },
            itemSize: 30
        },
        xAxis: {
            type: 'category',
            name: 'x',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {show: false},
            data: ['00：00', '01：00', '02：00', '03：00', '04：00', '05：00', '06：00', '07：00', '08：00', '09：00', '10：00', '11：00', '12：00'
          , '13：00', '14：00', '15：00', '16：00', '17:00', '18：00', '19：00', '20：00', '21：00', '22：00', '23：00'],
            axisLabel: {
              textStyle: {
                align: 'center'
              }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            axisLine: {
              show: false
            },
            type: 'log',
            axisTick: {
              show: false
            }
        },
        series: [
            {
                name: 'APP客户端',
                type: 'line',
                data: [13, 233, 2557, 5221, 77747, 449, 2557, 5221, 77747, 2557, 5221,
                   77747, 10669,12223, 233, 2557, 5221, 77747, 2557, 5221, 77747, 5221, 77747, 10669]
            },
            {
                name: '论坛',
                type: 'line',
                data: [66, 1234, 4532, 6624, 4532, 6624, 7555, 8213, 2232, 3136,4532, 6624, 7555, 8213, 1234, 2232, 3136, 4532, 6624, 7555, 8213, 1234, 2232, 3136]
            },
            {
                name: '微信',
                type: 'line',
                data: [5566, 1234, 8992,9624, 18532, 192224, 202555, 222213, 233232, 2433136,2684532, 2996624, 3087555, 3988213, 4001234, 40022232, 4093136, 4124532, 4166624, 4277555, 4288213, 4291234, 4992232, 5063136]
            }
        ]
      })
    }
  },
  created () {
    Bus.$on('errMessage', (e) => {
      console.log(e)
    })
  },
  mounted () {
    this.colquerylist ()
    this.toggleFocus = true
    window.sessionStorage.setItem('toggleFocus', false)
    document.getElementsByClassName('el-table__body-wrapper')[0].style.overflow = 'hidden'
    this.drawLine()
  },
  watch: {

  }
}
</script>

<style scoped>
.infobasic{
  height: 100%;
  width: 100%;
}
.info-icon{
  text-align: right;
  height: 40px;
  line-height: 40px;
}
.info-icon i {
  font-size: 14px;
  padding: 14px;
}
.info-table{
  margin-top: 30px;
}
.info-icon-fucos{
  background-color: #324157;
  color: #fff;
}
.info-echarts{
  width: 100%;
  height: 100%;
}
.info-echarts-toggle{
  padding-left: 30px;
}
#charts-col{
  width: 100%;
  height: 500px;
}
.echarts-bg{
  margin-top: 30px;
  height: 44px;
  width: 100%;
  background: url('../common/image/echartsbottom.png')no-repeat center;
}
</style>
