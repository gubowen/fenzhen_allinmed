/**
 * @Desc：云信环境变量适配
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 17/11/7.
 */
import ajax from "@/common/js/ajax";

export default function nimEnv() {
    const host = window.location.host;
    const XHRList = "/call/im/interact/v1/getToken/";
    let nimKey;
    if (host === "triage9.allinmed.cn") {
        /*
         * triage线上测试环境
         * 使用云信测试账号
         * */
        return new Promise((resolve, reject) => {
            ajax({
                url: XHRList,
                method: "POST",
                data: {
                    firstResult: 0,
                    maxResult: 1
                },
                done(res) {
                    if (res.responseObject.responseStatus) {
                        nimKey = res.responseObject.responseData.accessKey;
                        resolve(nimKey);
                    }
                }
            })
        });

    } else {
        /*
         * 其余任何环境
         * 使用正式账号
         *
         * 注意，该key任何人员不允许修改
         * */
        return new Promise((resolve, reject) => {
            resolve("50c93d2ab7e207fd83231a245c07bfbc");
        })
    }
}
