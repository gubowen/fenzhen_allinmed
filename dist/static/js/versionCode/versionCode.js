/**
 * Created by ALLIN on 2018/1/15.
 */
import ajax from "@/common/js/util/ajax";

export  default  function(){
    const VERSION_CODE = "1.1.4";
    const XHRList ="";
    return new Promise((resolve,reject)=>{
        ajax({
            url:XHRList,
            methods:"POST",
            data:{
                VERSION_CODE:VERSION_CODE
            },
            timeout:10000,
            done(res){
                resolve(res.data);
            },
            fail(err){
                reject(err);
            }
        });
    });
};