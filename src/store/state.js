/**
 * Created by ALLIN on 2018/1/25.
 */
const state={
    userName: "",  // 定义你的数据源
    mobile: '',


    patientList: '',  //患者列表
    patientActiveIndex:-1,
    newOnline: false,
    onlineListRefresh:false,

    waitingList: "",   //待分诊列表
    newWaiting: false,
    waitingListRefresh: false,


    resetList:[],     //重新分诊列表
    newReset:false,
    resetListRefresh:false,

    currentItem: "",
    caseId: '',       //病例Id
    patientId: '',    //患者Id
    patientName: '',  //患者姓名
    consultationId: '',//交流Id
    userId: '',
    mailBox: '',
    sex: '',
    consultationState:"",

    inputReadOnly: true,
    userListStatus: {
        status: "1",
        first: true,
        second: false
    },
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
    videoFlag:false, //查看视频标志位
    videoObject:'',  //查看视频列表
    videoListFlag:false,
    videoListObject:[],
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
    sendFileFlag:{
        flag:false,
        data:{},
        name:'',
        type:''
    },
    sendFileShow:false,
    newSickId:'',                //现病史Id
    musicPlay:false,
    beingSend:true,
    resendMsgInfo:{},
    deleteMsgInfo:{},
    triagePatientCaseIdFlag:{
        caseId:"",
        flag:false
    },
    releasePatientCaseIdFlag:{
        caseId:"",
        flag:false
    },
    refuseFlag:false,
    refuseList:[
        {flag:true,refuseContent:'您咨询的病情，不属于骨科疾病，请您去医院直接就诊。'},
        {flag:true,refuseContent:'您咨询的病情，非常紧急，不适合使用网络咨询服务，请您尽快去医院就诊。'},
        {flag:true,refuseContent:'唯医骨科互联网只进行骨科疾病的相关咨询，您的情况不属于骨科病请咨询。'},
    ],
    refuseReason:{
        flag:false,
        data:''
    },
    refuseUserListFlag:false,
    minBtnFlag:false,    //更多按钮标志
    //********开关控制*******
    isImage:true,
    isOrder:true,
    isTalk:true,
    isDeleteMsg:true,
    isVideo:true,
    isFile:true,
    deleteMsgTime:'2'   //消息撤回时间
};

export default  state;