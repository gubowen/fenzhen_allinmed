/**
 * Created by ALLIN on 2018/1/25.
 */
const getters={
    userName(state){
        return state.userName;
    },
    mobile(state){
        return state.mobile;
    },
    onlineList(state){
        return state.onlineList;
    },
    patientActiveIndex(state){
        return state.patientActiveIndex;
    },
    newOnline(state){
        return state.newOnline;
    },
    onlineListRefresh(state){
        return state.onlineListRefresh;
    },
    waitingList(state){    //待分诊列表
        return state.waitingList;
    },
    newWaiting(state){
        return state.newWaiting;
    },
    waitingListRefresh(state){
        return state.waitingListRefresh;
    },
    resetList(state){    //重新分诊列表
        return state.resetList;
    },
    newReset(state){
        return state.newReset;
    },
    resetListRefresh(state){
        return state.resetListRefresh;
    },
    currentItem(state){
        return state.currentItem;
    },
    caseId(state){
        return state.caseId;
    },
    patientId(state){
        return state.patientId;
    },
    patientName(state){
        return state.patientName;
    },
    consultationId(state){
        return state.consultationId;
    },
    userId(state){
        return state.userId;
    },
    mailBox(state){
        return state.mailBox;
    },
    sex(state){
        return state.sex;
    },
    consultationState(state){
        return state.consultationState;
    },
    inputReadOnly(state){
        return state.inputReadOnly;
    },
    userListStatus(state){
        return state.userListStatus;
    },
    EasyWayTempCache(state){
        return state.EasyWayTempCache;
    },
    userLoginName(state){
        return state.userLoginName;
    },
    key(state){
        return state.key;
    },
    wxBrowseAccessLockOn(state){
        return state.wxBrowseAccessLockOn;
    },
    LOCAL_STORAGE_KEY(state){
        return state.LOCAL_STORAGE_KEY;
    },
    searchStatus(state){
        return state.searchStatus;
    },
    enableSearch(state){
        return state.enableSearch;
    },
    fastReplyConfig(state){
        return state.fastReplyConfig;
    },
    checkHistoryFlag(state){
        return state.checkHistoryFlag;
    },
    loadingShow(state){
        return state.loadingShow;
    },
    popupShow(state){
        return state.popupShow;
    },
    popupContent(state){
        return state.popupContent;
    },
    fastReplyContent(state){
        return state.fastReplyContent;
    },
    fastReplyShow(state){
        return state.fastReplyShow;
    },
    usedReplyConfig(state){
        return state.usedReplyConfig;
    },
    examineFlag(state){
        return state.examineFlag;
    },
    checkSuggestionFlag(state){
        return state.checkSuggestionFlag;
    },
    usedReplyContent(state){
        return state.usedReplyContent;
    },
    usedReplyShow(state){
        return state.usedReplyShow;
    },
    quitPatientItem(state){
        return state.quitPatientItem;
    },
    // SBIFlag(state){
    //     return state.SBIFlag;
    // },
    SBIObject(state){
        return state.SBIObject;
    },
    SBIIndex(state){
        return state.SBIIndex;
    },
    SBIType(state){
        return state.SBIType;
    },
    videoFlag(state){
        return state.videoFlag;
    },
    videoObject(state){
        return state.videoObject;
    },
    videoListFlag(state){
        return state.videoListFlag;
    },
    videoListObject(state){
        return state.videoListObject;
    },
    previewShow(state){
        return state.previewShow;
    },

    previewId(state){
        return state.previewId;
    },
    triageContent(state){
        return state.triageContent;
    },
    previewData(state){
        return state.previewData;
    },
    previewType(state){
        return state.previewType;
    },
    sendPreviewSuggestionFlag(state){
        return state.sendPreviewSuggestionFlag;
    },
    sendCheckSuggestionFlag(state){
        return state.sendCheckSuggestionFlag;
    },
    sendVideoTriageFlag(state){
        return state.sendVideoTriageFlag;
    },
    sendFileFlag(state){
        return state.sendFileFlag;
    },
    sendFileShow(state){
        return state.sendFileShow;
    },
    newSickId(state){
        return state.newSickId;
    },
    musicPlay(state){
        return state.musicPlay;
    },
    beingSend(state){
        return state.beingSend;
    },
    resendMsgInfo(state){
        return state.resendMsgInfo;
    },
    deleteMsgInfo(state){
        return state.deleteMsgInfo;
    },
    triagePatientCaseIdFlag(state){
        return state.triagePatientCaseIdFlag;
    },
    releasePatientCaseIdFlag(state){
        return state.releasePatientCaseIdFlag;
    },
    refuseFlag(state){
        return state.refuseFlag;
    },
    refuseList(state){
        return state.refuseList;
    },
    refuseReason(state){
        return state.refuseReason;
    },
    refuseUserListFlag(state){
        return state.refuseUserListFlag;
    },

    minBtnFlag(state){
        return state.minBtnFlag;
    },
    isImage(state){
        return state.isImage;
    },
    isOrder(state){
        return state.isOrder;
    },
    isTalk(state){
        return state.isTalk;
    },
    isDeleteMsg(state){
        return state.isDeleteMsg;
    },
    isVideo(state){
        return state.isVideo;
    },
    isFile(state){
        return state.isFile;
    },
    deleteMsgTime(state){
        return state.deleteMsgTime;
    }

};
export  default  getters;