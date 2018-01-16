/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 17/10/23.
 */
import ajax from "@/common/js/util/ajax";
const XHRList = {
    triage: "/call/customer/case/consultation/v1/update/"
};

export default function releasePatient(data) {
    let param = {
        consultationIds: data.consultationId,
        consultationState: data.consultationState,
        customerId: data.customerId,
        consultationType: "0"
    }

    return new Promise((resolve, reject) => {
        ajax({
            url: XHRList.triage,
            method: "POST",
            data: param,
            done(res) {
                if (res.responseObject.responseStatus) {
                    resolve(res)
                } else {
                    reject(res)
                }
            }
        })
    })
}

