/**
 * Created by ALLIN on 2018/1/25.
 */
import ajax from "@/common/js/util/ajax";
const mutations=  {
    setCaseId(state, data){
        state.caseId = data;
    },
    SetUserId(state,data){
        state.userId = data;
    },

    setNewWaiting(state, flag){
        state.newWaiting = flag;
    },
    setNewOnline(state, flag){
        state.newOnline = flag;
    },
    setNewReset(state,data){
        state.newReset = data;
    },
    setOnlineList(state, data){
        state.onlineList = data;
    },
    setWaitingList(state, data){
        state.waitingList = data;
    },
    setResetList(state,data){
        state.resetList = data;
    },
    startLoading(state){
        state.loadingShow = true;
    },
    stopLoading(state){
        state.loadingShow = false;
    },



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

    showPopup(state,payLoad){
        state.popupContent=payLoad;
        state.popupShow=true;
        setTimeout(()=>{
            state.popupShow=false;
        },2000);
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


    setPatientId(state, data){
        state.patientId = data;
    },
    setPatientName(state, data){
        state.patientName = data;
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
    setVideoListFlag(state,data){
        state.videoListFlag = data;
    },
    videoListObject(state,data){
        state.videoListObject =data;
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

    //拒绝分诊
    setRefuseFlag(state,data){
        state.refuseFlag = data;
    },
    //***********刷新**************
    waitingListRefreshFlag(state, data){
        state.waitingListRefresh = data;
    },
    onlineListRefresh(state, data){
        state.onlineListRefresh = data;
    },
    resetListRefreshFlag(state,data){
        state.resetListRefresh = data;
    },
    //***********拒绝**************
    setRefuseReason(state,data){
        state.refuseReason = data;
    },
    setRefuseList(state,data){
        state.refuseList = data;
    },
    //*********发送文件************
    setSendFileFlag(state,data){
        state.sendFileFlag = data;
    },
    setSendFileShow(state,data){
        state.sendFileShow = data;
    },
    //*****************************
    setConsultationState(state,data){
        state.consultationState = data ;
    },

    setMinBtnFlag(state,data){
        state.minBtnFlag = data;
    },
    setRefuseUserListFlag(state,data){
        state.refuseUserListFlag =data;
    },
    setStateSetting(state,data){

        ajax({
            url:"/call/comm/data/tool/v1/getMapList/",
            method: "POST",
            data: {
                deviceType: 'PC',
                sortType: 1,
                visitSiteId:18
            },
            done(res){
                if( res.responseObject.responseData){
                    res.responseObject.responseData.dataList.forEach(function(element,index){
                        switch(parseInt(element.toolType) ){
                            case 1: //图片
                                if(parseInt(element.state) == 1){
                                    state.isImage = true;
                                }else{
                                    state.isImage = false;
                                }
                                break;
                            case 2://门诊邀约
                                if(parseInt(element.state) ==1){
                                    state.isOrder = true;
                                }else{
                                    state.isOrder = false;
                                }
                                break;
                            case 3: //常用语
                                if(parseInt(element.state) == 1){
                                    state.isTalk = true;
                                }else{
                                    state.isTalk = false;
                                }
                                break;
                            case 4://撤销
                                if(parseInt(element.state) == 1){
                                    state.isDeleteMsg = true;
                                    state.deleteMsgTime = element.toolConfig/60;break;
                                }else{
                                    state.isDeleteMsg = false;
                                }
                                break;
                            case 5://视频
                                if(parseInt(element.state) == 1){
                                    state.isVideo = true;
                                }else{
                                    state.isVideo = false;
                                }
                                break;
                            case 6://文件
                                if(parseInt(element.state) == 1){
                                    state.isFile = true;
                                }else{
                                    state.isFile = false;
                                }
                                break;
                        }
                    })
                }

            }
        });

        state.deleteMsgTime =data;
    }
};


export default  mutations;