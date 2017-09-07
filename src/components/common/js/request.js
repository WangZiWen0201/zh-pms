/**
* 封装 ajax 拦截session超时过期问题 请求发送，使用fetch，自动拼接request header公共参数
* author Osmond Wang
**/

// import md5 from 'md5'; 加密问推==问题
//版本号
const version = '1.0';
//数据请求接口域 prefix前缀
const domainData = '/ajax';
/**
*	ajax 发送请求
* @opts {object} 请求参数
*/
// const getHeaderParams = () => {
// 	let time = parseInt((new Date().getTime())/1000);
// 	let params = {
// 		ts: time,
// 		reqid: time,
// 		sign: '',
// 		device: `ver=${version}`,
// 		token: localStorage['token'] || '',
// 	}
// 	params.sign = md5(md5(params.plat + params.reqid + params.ts));
// 	return encodeURI(JSON.stringify(params));
// }

const getAjax = (url, type, dataType, param) => {
  this.$http.get(url, param).then(response => {
    // success callback
    // if(response.error === 10001){}
  }, response => {
    // error callback
  });
}
const postAjax = (url, type, dataType, param) => {
  this.$http.post(url, param).then(response => {
    // success callback
    // if(response.error === 10001){}
  }, response => {
    // error callback
  });
}

const checkStatus = (response) => {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		let error = new Error(response.statusText);
    error.response = response;
    error.status = response.status;
    throw error
	}
}

const parseJSON = (response) => {
	return {
		status: response.status,
		data: response.json(),
	}
}

module.exports = sendAjax;
