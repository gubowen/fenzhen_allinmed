/**
 * @Desc：入口
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by gubowen on 2017/3/7
 */

requirejs.config({
    paths: {
        jquery: '/js/third-party/jquery/jquery-2.1.0.min',
        jquery1: '/js/third-party/jquery/jquery-1.8.0.min',
        toJSON: "/js/third-party/jquery/jquery.json-2.4",
        common: '/js/common',
        jPager:"/js/third-party/jquery.pager",
        downSelector: '/js/plugins/plugins.downSelector',
        tabView: "/js/plugins/plugins.tabView",
        validate: "/js/plugins/plugins.validate",                          //表单验证
        messageCommunication: "/js/scene/index/scene.message.communication",
        medicalRecord: "/js/scene/index/scene.medical.record",
        recordRemark: "/js/scene/index/scene.record.remark",
        userList: "/js/scene/index/scene.user.list",
        mainHeader: "/js/scene/index/scene.main.header",
        bottomController: "/js/scene/index/scene.bottom.controller",
        checkSuggestion: "/js/scene/index/scene.check.suggestion",
        previewSuggestion: "/js/scene/index/scene.preview.suggestion",
        searchSuggestion: "/js/scene/index/scene.search.suggestion",
        fastReply: "/js/scene/index/scene.fast.reply",
        usedReply: "/js/scene/index/scene.used.reply",
        filterList: "/js/scene/index/scene.filter.list",
        swiper: "https://cdn.bootcss.com/Swiper/3.4.1/js/swiper.min",
        bigPicShow: '/js/plugins/plugins.showBigImg',
        //bigPicShow: '//paas.allinmd.cn/modules/show_big_img/1.1/showBigImg',
        indexMain: '/js/scene/index/scene.index.main',
        examineCheck: "/js/scene/index/scene.examine.check",
        diseaseTeach: "/js/scene/index/scene.disease.teach",
        selfSetting: "/js/scene/index/scene.setting",                             //个人设置
        mD5: "/js/third-party/md5/md5",                                           //MD5
        text: "/js/third-party/require/text",
        headerTemplate: "/pages/index/main_header.html",
        bottomTemplate: "/pages/index/bottom_controller.html",
        medicalRecordTemplate: "/pages/index/medical_record.html",
        userListTemplate: "/pages/index/user_list.html",
        fastReplyTemplate: "/pages/index/fast_reply.html",
        fastReplyConfigTemplate: "/pages/index/fast_reply_config.html",
        usedReplyTemplate: "/pages/index/used_reply.html",
        usedReplyConfigTemplate: "/pages/index/used_reply_config.html",
        checkSuggestionTemplate: "/pages/index/check_suggestion.html",
        configSuggestionTemplate: "/pages/index/config_suggestion.html",
        searchSuggestionTemplate: "/pages/index/search_suggestion.html",      //出诊建议查询
        examineCheckTemplate: "/pages/index/examine_check.html",
        diseaseTeachTemplate: "/pages/index/disease_teach_detail.html",
        selfSettingTemplate: "/pages/setting/setting.html",                            //个人设置
        medicalRemarkTemplate: "/pages/index/medical_record_remark.html",//病例备注
        ymd: "/js/plugins/ymd",
        NIM: "/js/third-party/nim/NIM_Web_NIM_v3.4.0",
        autosize:'/js/plugins/plugins.autosize',
        video:'/js/plugins/plugins.video',
        videoAllinmd:'/js/plugins/plugins.videojs.allinmd',
        exif:"/js/third-party/exif" //读取图片元数据
    },
    waitSeconds: 0,
    shim: {                                   //加载非规范的模块
        'jquery': {exports: 'jquery'},
        'jquery1': {exports: 'jquery1'},
        'common': {deps: ['jquery'], exports: 'common'},
        "jPager": {deps: ['jquery'],exports: "jPager"},
        'swiper': {deps: ['jquery'], exports: 'swiper'},
        'bigPicShow': {deps: ['jquery'], exports: 'bigPicShow'},
        "toJSON": {deps: ["jquery"], exports: "toJSON"},
        "ymd": {deps: ["jquery"], exports: "ymd"},
        "validate": {deps: ["jquery"], exports: "validate"},
        "NIM": {exports: "NIM"},
        "mD5": {exports: "mD5"},
        "autosize":{exports:"autosize"},
        "video":{exports:"video"},
        "videoAllinmd":{deps:["jquery","video"],exports:"videoAllinmd"},
        "exif":{exports:"exif"}
    },
    // urlArgs: "bust=" + (new Date()).getTime(),
    text: {
        useXhr: function (url, protocol, hostname, port) {
            //Override function for determining if XHR should be used.
            //url: the URL being requested
            //protocol: protocol of page text.js is running on
            //hostname: hostname of page text.js is running on
            //port: port of page text.js is running on
            //Use protocol, hostname, and port to compare against the url
            //being requested.
            //Return true or false. true means "use xhr", false means
            //"fetch the .js version of this resource".
        },
        onXhr: function (xhr, url) {
            console.log(2);
            //Called after the XHR has been created and after the
            //xhr.open() call, but before the xhr.send() call.
            //Useful time to set headers.
            //xhr: the xhr object
            //url: the url that is being used with the xhr object.
        },
        createXhr: function () {
            console.log(2);
            //Overrides the creation of the XHR object. Return an XHR
            //object from this function.
            //Available in text.js 2.0.1 or later.
        },
        onXhrComplete: function (xhr, url) {
            console.log(2);
            //Called whenever an XHR has completed its work. Useful
            //if browser-specific xhr cleanup needs to be done.
        }
    }
});
requirejs(
    ['jquery',
        'common',
        'jPager',
        'messageCommunication',
        'tabView',
        'downSelector',
        'medicalRecord',
        'userList',
        'mainHeader',
        'bottomController',
        'fastReply',
        'usedReply',
        'checkSuggestion',
        'examineCheck',
        'indexMain',
        'text',
        'recordRemark',
        'filterList',
        'selfSetting',
        'validate',
        'mD5',
        'exif'
    ], function ($, common,jPager,mc,tv,ds, mr, userList, mainHeader, bottom, fastReply, usedReply, check, examine, toJSON, indexMain, text, recordRemark, filterList, selfSetting, validate, mD5,exif) {
        // alert(2)
        // console.log(mainHeader)
        // mainHeader.init();
    });
