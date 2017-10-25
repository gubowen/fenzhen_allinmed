/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 17/7/14.
 */

import ajax from "./ajax";
import prototype from "./prototype";
import wxCommon from "./wxCommon";
import accountValidate from "./accountValidate";
import net from "./net";

class Api {
  constructor() {

  }

  ajax(param) {
    ajax(param);
  }

  getPara(symbol) {
    let url = window.location.origin + window.location.pathname + window.location.search;
    let param = {};
    let str, item;
    if (url.lastIndexOf(symbol ? symbol : "?") > 0) {
      str = url.substring(url.lastIndexOf(symbol ? symbol : "?") + 1, url.length);
      let arr = str.split("&");
      for (let i = 0; i < arr.length; i++) {
        item = arr[i].split("=");
        param[item[0]] = decodeURIComponent(item[1]);
      }
    }
    return param;
  }

  getCookie(name) {
    let arr;
    const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return decodeURIComponent(arr[2]);
    }
    else {
      return null;
    }
  }

  removeDub(arr) {
    return [...new Set(arr)];
  }

  removeByValue = function (arr, value) {
    for (let i = 0; i < this.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
    return arr;
  }

  isWXBrowse() {
    return wxCommon.isWXBrowse();
  }

  getByteLen(val) {
    let len = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i].match(/[^\x00-\xff]/ig) !== null) {
        len += 2;
      } else {
        len += 1;
      }
    }
    return len;
  }

  getStrByteLen(str, len) {
    let newStr = '',
      newLength = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 128) {
        newLength += 2;
      } else {
        newLength++;
      }
      if (newLength <= len) {
        newStr = newStr.concat(str[i]);
      } else {
        break;
      }
    }
    if (newLength > len) {
      newStr = newStr + ""
    }
    return newStr;
  }

  getConnectType() {
    let connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {tyep: 'unknown'};
    let type_text = ['unknown', 'ethernet', 'wifi', '2g', '3g', '4g', 'none'];
    let _browseType = this.isWXBrowse(),
      userAgentInfo = navigator.userAgent;
    let checkKey = '';
    if (typeof(connection.type) == "number") {
      connection.type_text = type_text[connection.type];
    } else {
      if (_browseType === "androidWX") {
        //Android通过返回type判断
        if (connection.type !== "WIFI" || connection.type !== "wifi") {
          if (userAgentInfo.indexOf("WIFI") > 0) {
            connection.type_text = 'wifi';
          } else {
            connection.type_text = 'other';
          }
        } else {
          connection.type_text = connection.type;
        }
      } else if (_browseType === "iphoneWX") {
        //ios没有返回type 通过设备类型里的NetType判断联网类型（尝试中 需测试）
        if (userAgentInfo.indexOf("WIFI") > 0) {
          connection.type_text = 'wifi';
        } else {
          connection.type_text = 'other';
        }
      } else {
        //除Android、ios微信浏览器之外的其他浏览器
        if (connection.type !== "undefined") {
          connection.type_text = connection.type;
        } else {
          //不识别网络或不兼容
          connection.type_text = 'other';
        }
      }
    }
    //通过Bandwidth判断网络类型（多数浏览器没有返回改字段）
    if (typeof(connection.bandwidth) == "number") {
      if (connection.bandwidth > 10) {
        connection.type = 'wifi';
      } else if (connection.bandwidth > 2) {
        connection.type = '3g';
      } else if (connection.bandwidth > 0) {
        connection.type = '2g';
      } else if (connection.bandwidth == 0) {
        connection.type = 'none';
      } else {
        connection.type = 'unknown';
      }
    }
    //返回类型 (1-wifi、0-other)
    if (connection.type_text == 'wifi') {
      checkKey = 1;
    } else {
      checkKey = 0;
    }
    return checkKey;
  }

  //openId check
  checkOpenId() {
    return wxCommon.checkOpenId();
  }

  //get openID
  wxGetOpenId() {
    wxCommon.wxGetOpenId();
  }


//手机号验证
  mobileCheck() {
    accountValidate();
  }

//时间处理  2017年05月08日 星期一 14:20 / 2017.05.08 星期一 14:20
  timeFormate(op) {
    let _operationTime = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      _timeDeal = op.time.substring(0, 10).replace(/\-/g, "\/"),
      _timesList = new Date(_timeDeal).getDay(),
      _timeCompare = '', //  2017年05月08日 星期一 14:20
      _timeCompares = '', //  05月08日 星期一 14:20
      _week = _operationTime[_timesList],
      _hours = op.time.substring(11, 16);
    switch (parseInt(op.type)) {
      case 1: //2017年05月08日
        _timeCompare = op.time.substring(0, 4) + "年" + op.time.substring(5, 7) + "月" + op.time.substring(8, 10) + "日"; //  2017年05月08日 星期一 14:20
        _timeCompares = op.time.substring(5, 7) + "月" + op.time.substring(8, 10) + "日"; //  05月08日 星期一 14:20
        break;
      case 2: //2017.05.08
        _timeCompare = op.time.substring(0, 4) + "." + op.time.substring(5, 7) + "." + op.time.substring(8, 10); //  2017.05.08 星期一 14:20
        _timeCompares = op.time.substring(5, 7) + "." + op.time.substring(8, 10); //  05.08 星期一 14:20
        break;
      case 3:
        break;
    }
    return {year: _timeCompare, years: _timeCompares, week: _week, hour: _hours};
  }

  MillisecondToDate(msd) {
    var time = parseFloat(msd) / 1000;
    if (null != time && "" != time) {
      if (time > 60 && time < 60 * 60) {
        time = parseInt(time / 60.0) + "分钟"; //+ parseInt((parseFloat(time /60.0) -parseInt(time /60.0)) *60) +"秒";
      } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
        time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
            parseInt(time / 3600.0)) * 60) + "分钟"; //+
        // parseInt((parseFloat((parseFloat(time /3600.0) - parseInt(time /3600.0)) *60) -
        //     parseInt((parseFloat(time /3600.0) - parseInt(time /3600.0)) *60)) *60) +"秒";
      } else if (time >= 60 * 60 * 24) {
        time = Math.round(parseInt(time / (3600 * 24))) + "天";
      }
    } else {
      time = "0 时 0 分0 秒";
    }
    return time;

  }

  MillisecondToDateNew(msd) {
    var time = parseFloat(msd) / 1000;
    if (null != time && "" != time) {
      if (time > 60 && time < 60 * 60) {
        time = parseInt(time / 60.0) + "分钟"; //+ parseInt((parseFloat(time /60.0) -parseInt(time /60.0)) *60) +"秒";
      } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
        time = parseInt(time / 3600.0) + "小时"
        // parseInt((parseFloat((parseFloat(time /3600.0) - parseInt(time /3600.0)) *60) -
        //     parseInt((parseFloat(time /3600.0) - parseInt(time /3600.0)) *60)) *60) +"秒";
      } else {
        time = parseInt(time) + "秒";
      }
    } else {
      time = "0 时 0 分0 秒";
    }
    return time;

  }
}

let api = new Api();
prototype();
export default api;
