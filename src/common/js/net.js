/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 17/9/27.
 */
class Net {
  constructor(){

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
}

export default new Net();
