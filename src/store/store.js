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
    watingList: "",//待分诊列表
    watingListRefresh:false,
    caseId: '',       //病例Id
    patientId: '',    //患者Id
    patientName: '',  //患者姓名
    userId: '',
    mailBox: '',
    sex: '',
    currentItem: "",
    inputReadOnly:true,
    userListStatus: {
      status: "1",
      first: true,
      second: false
    },
    newWating:false,
    newOnline:false,
    EasyWayTempCache: '',
    userLoginName: '',
    key: '',
    wxBrowseAccessLockOn: '',
    LOCAL_STORAGE_KEY: '',
    searchStatus: '',
    fastReplyConfig: false,
    checkHistoryFlag: false,
    loadingShow: false, //是否请求中
    fastReplyContent: "", //
    consultationId: '',//交流Id
    usedReplyConfig: false,
    examineFlag:false,//检查检验显示隐藏
    checkSuggestionFlag:false,//初诊建议显示隐藏
    usedReplyContent: "",
    quitPatientList: [],
    SBIFlag: false, //查看大图标志位
    SBIObject: {}, //查看大图对象
    SBIType:'', //查看大图类型
    previewShow: false,
    previewId: "",
    previewData:{
      diagnoseResult:{},
      doctorList:[],
      teachingList:[],
      disposeList:[],
      examineList:[],
      testList:[]
    },
    previewType:"-1",
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
    }
  },
  mutations: {
    setInputReadOnly(state,content){
      state.inputReadOnly=content;
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
    setFastReply(state, content){
      state.fastReplyContent = content;
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
    setWatingList(state, data){
      state.watingList = data;
    },
    setCaseId(state, data){
      state.caseId = data;
    },
    setConsultationId(state, data){
      state.consultationId = data;
    },
    //添加删除退回患者
    setQuitPatientList(state, payLoad){
      if (payLoad.type === "add") {
        state.quitPatientList.push(payLoad.data);
      } else if (payLoad.type === "minus") {
        state.quitPatientList.removeByValue(payLoad.data);
      } else if (payLoad.type === "clear") {
        state.quitPatientList = [];
      }
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
    setSBIType(state,data){
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
    setPreviewId(state,data){
      state.previewId = data;
    },
    setPreviewData(state,data){
      state.previewData=data;
    },
    setPreviewType(state,data){
      state.previewType=data;
    },
    watingListRefreshFlag(state,data){
      state.watingListRefresh=data;
    },
    setNewWating(state,flag){
      state.newWating=flag;
    },
    setNewOnline(state,flag){
      state.newOnline=flag;
    },
    //检查检验显示隐藏
    setExamineFlag(state,data){
      state.examineFlag = data;
    },
    //初诊建议显示隐藏
    setCheckSuggestionFlag(state,data){
      state.checkSuggestionFlag = data;
    }
  }
});
