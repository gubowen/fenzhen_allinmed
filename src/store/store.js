/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 17/10/18.
 */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userName: "",  // 定义你的数据源
        mobile: '',
        patientList: '',  //患者列表
        patientActiveIndex:-1,
        waitingList: "",   //待分诊列表
        waitingListRefresh: false,
        caseId: '',       //病例Id
        patientId: '',    //患者Id
        patientName: '',  //患者姓名
        userId: '',
        mailBox: '',
        sex: '',
        currentItem: "",
        inputReadOnly: true,
        userListStatus: {
            status: "1",
            first: true,
            second: false
        },
        newWaiting: false,
        newOnline: false,
        EasyWayTempCache: '',
        userLoginName: '',
        key: '',
        wxBrowseAccessLockOn: '',
        LOCAL_STORAGE_KEY: '',
        searchStatus: '',
        enableSearch: true,
        fastReplyConfig: false,
        checkHistoryFlag: false,
        loadingShow: false, //是否请求中
        popupShow: false,
        popupContent: {
            hasImg: false,
            text: ""
        },
        fastReplyContent: "", //
        fastReplyShow:false,
        consultationId: '',//交流Id
        usedReplyConfig: false,
        examineFlag: false,//检查检验显示隐藏
        checkSuggestionFlag: false,//初诊建议显示隐藏
        usedReplyContent: "",
        usedReplyShow:false,
        // quitPatientList: [],
        quitPatientItem: {},
        SBIFlag: false, //查看大图标志位
        SBIObject: {}, //查看大图对象
        SBIIndex:'',   //查看大图索引
        SBIType: '', //查看大图类型
        videoFlag:false, //查看视频标致位
        videoObject:'',  //查看视频列表
        previewShow: false,
        previewId: "",
        triageContent:[],
        previewData: {
            diagnoseResult: {},
            doctorList: [],
            teachingList: [],
            disposeList: [],
            examineList: [],
            testList: []
        },
        previewType: "-1",
        sendPreviewSuggestionFlag: {
            flag: false,
            data: {}
        },
        sendCheckSuggestionFlag: {
            flag: false,
            data: []
        },
        sendVideoTriageFlag: {
            flag: false,
            data: {}
        },
        sendImgFlag:{
            flag: false,
            data: {}
        },
        sendImgShow:false,
        sendVideoFlag:{
            flag:false,
            data:{}
        },
        sendVideoShow:false,
        sendFileFlag:{
            flag:false,
            data:{},
            name:''
        },
        sendFileShow:false,
        newSickId:'',                //现病史Id
        musicPlay:false,
        beingSend:true,
        resendMsgInfo:{},
        deleteMsgInfo:{},
        deleteMsgTime:'2',   //消息撤回时间
        triagePatientCaseIdFlag:{
            caseId:"",
            flag:false
        },
        releasePatientCaseIdFlag:{
            caseId:"",
            flag:false
        }
    },
    mutations: {
        setPatientActiveIndex(state,index){
           state.patientActiveIndex = index;
        },
        enableSearchFn(state,data){
            state.enableSearch = data;
        },
        setInputReadOnly(state, content){
            state.inputReadOnly = content;
        },
        setUserLoginName(state, userNameVal){
            state.userLoginName = userNameVal;
        },
        showUserName(state){

        },
        setUserListStatus(state, data){
            state.userListStatus = data;
        },
        stopLoading(state){
            state.loadingShow = false;
        },
        startLoading(state){
            state.loadingShow = true;
        },
        showPopup(state,payLoad){
            state.popupContent=payLoad;
            state.popupShow=true;
            setTimeout(()=>{
                state.popupShow=false;
            },3000);
        },
        setFastReply(state, content){
            state.fastReplyContent = content;
        },
        setUesdReply(state,content){
            state.usedReplyContent=content;
        },
        setTriageContent(state,data){
          state.triageContent.push(data);
        },
        clearTraigeContent(state){
            state.triageContent=[];
        },
        setPatientList(state, data){
            state.patientList = data;
        },
        setPatientId(state, data){
            state.patientId = data;
        },
        setPatientName(state, data){
            state.patientName = data;
        },
        setWaitingList(state, data){
            state.waitingList = data;
        },
        setCaseId(state, data){
            state.caseId = data;
        },
        setConsultationId(state, data){
            state.consultationId = data;
        },
        //添加删除退回患者
        // setQuitPatientList(state, payLoad){
        //   if (payLoad.type === "add") {
        //     state.quitPatientList.push(payLoad.data);
        //   } else if (payLoad.type === "minus") {
        //     state.quitPatientList.removeByValue(payLoad.data);
        //   } else if (payLoad.type === "clear") {
        //     state.quitPatientList = [];
        //   }
        // },
        //设置退回患者（单选
        setQuitPatientItem(state, item){
            state.quitPatientItem = item;
        },
        setCurrentItem(state, data){
            state.currentItem = data;
        },
        setSBIFlag(state, data){
            state.SBIFlag = data;

        },
        setSBIObject(state, data){
            state.SBIObject = data;
        },
        setSBIType(state, data){
            state.SBIType = data;
        },
        previewSuggestionSender(state, data){
            state.sendPreviewSuggestionFlag = data;
        },
        checkSuggestionSender(state, data){
            state.sendCheckSuggestionFlag = data;
        },
        videoTriageSender(state, data){
            state.sendVideoTriageFlag = data;
        },
        setPreviewShow(state, data){
            state.previewShow = data;
        },
        setPreviewId(state, data){
            state.previewId = data;
        },
        setPreviewData(state, data){
            state.previewData = data;
        },
        setPreviewType(state, data){
            state.previewType = data;
        },
        waitingListRefreshFlag(state, data){
            state.waitingListRefresh = data;
        },
        onlineListRefresh(state, data){
            state.onlineListRefresh = data;
        },
        setNewWaiting(state, flag){
            state.newWaiting = flag;
        },
        setNewOnline(state, flag){
            state.newOnline = flag;
        },
        //检查检验显示隐藏
        setExamineFlag(state, data){
            state.examineFlag = data;
        },
        //初诊建议显示隐藏
        setCheckSuggestionFlag(state, data){
            state.checkSuggestionFlag = data;
        },
        //快捷提问显示隐藏
        setFastReplyShow(state,flag){
            state.fastReplyShow=flag;
        },
        //常用回复显示隐藏
        setUsedReplyShow(state,flag){
            state.usedReplyShow=flag;
        },
        setVideoFlag(state,data){
            state.videoFlag = data;
        },
        setVideoObject(state,data){
            state.videoObject=data;
        },
        setSBIIndex(state,data){
            state.SBIIndex=data;
        },
        setNewSickId(state,data){
            state.newSickId = data;
        },
        setMusicPlay(state,data){
            state.musicPlay = data;
        },
        setSendStatus(state,data){
            state.beingSend = data;
        },
        setResendMsgInfo(state,data){
            state.resendMsgInfo = data;
        },
        setDeleteMsgInfo(state,data){
            state.deleteMsgInfo = data;
        },
        setTriagePatientCaseIdFlag(state,param){
            state.triagePatientCaseIdFlag=param;
        },
        setReleasePatientCaseIdFlag(state,param){
            state.releasePatientCaseIdFlag=param;
        },
        setSendImgFlag(state,data){
            state.sendImgFlag = data;
        },
        setSendImgShow(state,data){
            state.sendImgShow = data;
        },
        setSendVideoFlag(state,data){
            state.sendVideoFlag = data;
        },
        setSendVideoShow(state,data){
            state.sendVideoShow = data;
        },
        setSendFileFlag(state,data){
            state.sendFileFlag = data;
        },
        setSendFileShow(state,data){
            state.sendFileShow = data;
        }

    }
});
