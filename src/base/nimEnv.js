/**
 * @Desc：云信环境变量适配
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 17/11/7.
 */
export default function nimEnv(){
    const host=window.location.host;
    let nimKey="";


    if (host==="triage9.allinmed.cn"){
        /*
         * triage线上测试环境
         * 使用云信测试账号
         * */
        nimKey="fb75fe44efc4772de29e1f2d8452172d";
    }else{
        /*
         * 其余任何环境
         * 使用正式账号
         *
         * 注意，该key任何人员不允许修改
         * */
        nimKey="50c93d2ab7e207fd83231a245c07bfbc";
    }
    return nimKey;
}