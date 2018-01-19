/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 2018/1/19.
 */

import Vue from "vue";
import siteEnv from "./dev.env";

export default function () {
    if (siteEnv() === "production") {
        const fundebug=require("fundebug-javascript")
        fundebug.apikey = "978f7359e7dcd8be4e2ebe3ef02e08e687330b823086432c3ca5d348946eb60b";

        Vue.config.errorHandler = function (err, vm, info) {
            let componentName = formatComponentName(vm);
            let propsData = vm.$options && vm.$options.propsData;

            fundebug.notifyError(err, {
                metaData: {
                    componeSntName: componentName,
                    propsData: propsData,
                    info: info
                }
            });
        };
    }
}


function formatComponentName(vm) {
    if (vm.$root === vm) return 'root';

    let name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name;
    return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '');

}
