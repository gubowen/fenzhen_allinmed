/**
 * @Desc：患者未分诊-被接诊
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 17/10/22.
 */
import ajax from "@/common/js/ajax";
const XHRList = {
  triage: "/call/customer/case/consultation/v1/update/",
  status: "/call/customer/case/consultation/v1/getMapInfo/"
};

function getTriageStatus(id,endFn,readyFn) {
  let param = {
    consultationId: id,
    consultationStateList: "-1,2,4,5"
  };
  ajax({
    url: XHRList.status,
    method: "POST",
    data: param,
    done(res){
      if (res.responseObject.responseCode === "fail") {
        //患者已被抢单
        endFn&&endFn();
      } else {
        //患者未被抢单
        readyFn&&readyFn();
      }
    }

  });
}
export default function triagePatient(data,endFn) {
  let param = {
    consultationIds: data.consultationId,
    consultationState: "0",
    customerId: data.customerId,
    consultationType: "0"
  };
  return new Promise((resolve, reject) => {
    getTriageStatus(param.consultationIds,()=>{
      endFn&&endFn();
    },()=>{
      ajax({
        url: XHRList.triage,
        method: "POST",
        data: param,
        done(res){
          if (res.responseObject.responseStatus) {
            resolve(res);
          } else {
            console.log("网络异常，请稍后再试......")
            reject(res);
          }
        }
      })
    })

  })
}
