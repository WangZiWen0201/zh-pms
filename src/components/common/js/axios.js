import axios from 'axios'
import Qs from 'qs'
import Bus from './eventBus'
/**
 * 实例化 axios
 * application/x-www-form-urlencoded 默认
 */
let self = this
const instance =  axios.create({
  // headers: {'X-Requested-With': 'XMLHttpRequest'},192.168.2.203:6080 http://localhost:8878/taskCollectionCenterWeb/
  baseURL: 'http://localhost:8878/taskCollectionCenterWeb/',
  transformRequest: [function (data) {
  // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）

      return data;
  }],
  transformResponse: [function (data) {
      let comfirm_code = JSON.parse(data)
      if(data && comfirm_code.code ){
        console.log(comfirm_code.code)
        if(comfirm_code.code ==='1000'||comfirm_code.code ===1000) {
          Bus.$emit('errMessage', comfirm_code)
        }
      }
      return data
  }],
})

export default instance
