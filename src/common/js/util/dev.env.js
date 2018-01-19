/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 2018/1/19.
 */
export default function () {
    let result="";
    if (window.location.host.includes("triage")){
        result="production";
    }else{
        result="development";
    }
    return result;
}
