/**
 * Created by ALLIN on 2018/2/1.
 */
const actions = {
    setCaseId: ({commit, state},data)=>{
        commit("setCaseId",data);
    },
    SetUserId: ({commit, state},data)=>{
        commit("SetUserId",data);
    },
    setPatientId: ({commit, state},data)=>{
        commit("setPatientId",data);
    },
    setPatientName: ({commit, state},data)=>{
        commit("setPatientName",data);
    },

    setCurrentItem: ({commit, state},data)=>{
        commit("setCurrentItem",data);
    },

    setWaitingList:({commit,state},data)=>{
        commit("setWaitingList",data);
    },
    setOnlineList:({commit,state},data)=>{
        commit("setOnlineList",data);
    },
    setResetList:({commit,state},data)=>{
        commit("setResetList",data);
    },
    setNewWaiting:({commit,state},data)=>{
        commit("setNewWaiting",data);
    },
    setNewOnline:({commit,state},data)=>{
        commit("setNewOnline",data);
    },
    setNewReset:({commit,state},data)=>{
        commit("setNewReset",data);
    },

    startLoading:({commit,state})=>{
        commit("startLoading");
    },
    stopLoading:({commit,state})=>{
        commit("startLoading");
    },
    //快捷提问显示隐藏
    setFastReplyShow:({commit,state},data)=>{
        commit("setFastReplyShow",data);
    },
    //常用回复显示隐藏
    setUsedReplyShow:({commit,state},data)=>{
        commit("setUsedReplyShow",data);
    },
    //只读判断
    setInputReadOnly:({commit,state},data)=>{
        commit("setInputReadOnly",data);
    }

}

export  default actions;