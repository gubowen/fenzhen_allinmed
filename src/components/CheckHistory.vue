<template>
    <section class="check-history-modules">
        <section class="maskers infoBox-tips show">
            <section class="infoBox-inner">
                <article class="infoBox-content">
                    <section>
                        <h2>{{$store.state.patientName}}咨询历史</h2>
                    </section>
                </article>
                <section class="check-history">
                    <article class="check-history-majorTitle"><span class="check-title-left">诊断结论</span><span class="check-title-right">患者提交病例时间</span></article>
                    <ul>
                        <li v-for="(items,index) in diagnoseHistoryList">
                            <section class="check-history-info">
                                <span class="check-history-title" @click.self="chatHistoryRecord(0,items,index)"><i class="icon-downArrow"
                                                                                                                    @click.self="chatHistoryRecord(0,items,index)"></i>{{items.mainContent.caseMain}}</span>
                                <span class="check-history-text">{{items.createTime|timeFormatCheckHistory}}</span>
                            </section>
                            <article class="check-history-show" :class="{'on': index == currentIndex}" v-show="chatHistoryRecordList.length >0">
                                <h3>咨询对话历史</h3>
                                <section class="check-history-talk">
                                    <ul>
                                        <li v-for="ele in chatHistoryRecordList">
                                            <article>
                                                <header class="doctor-letter" v-if="ele.fromAccount == '1_doctor00001'&& filterInfo(ele)">
                                                    {{分诊医生 +' '+ele.createTime.replace(/-/g, "/").substr(0,ele.createTime.replace(/-/g, "/").length-2)}}
                                                </header>
                                                <header v-if="ele.fromAccount != '1_doctor00001' && filterInfo(ele)">
                                                    {{$store.state.patientName +' '+ele.createTime.replace(/-/g, "/").substr(0,ele.createTime.replace(/-/g, "/").length-2)}}
                                                </header>
                                                <p v-if="ele.msgType.toLowerCase()==='text'">{{ele.body }}</p>
                                                <figure @click.stop="updateShow(ele)" v-if="ele.msgType.toLowerCase()==='custom'&& JSON.parse(ele.body.substring(1,ele.body.length-1)).type == 'previewSuggestion'">
                                                    <figcaption class="check-suggestion-message">
                                                        <header class="check-suggestion-message-title">初诊建议</header>
                                                        <section class="preview-suggestion-content">
                                                            <p class="preview-suggestion-img">
                                                                <img src="/static/img/img00/index/dialog_report.png" alt="">
                                                            </p>
                                                            <template v-if="Array.isArray(JSON.parse(ele.body.substring(1,ele.body.length-1)).data)">
                                                                <section class="preview-suggestion-content-text"
                                                                         v-for="element in  JSON.parse(ele.body.substring(1,ele.body.length-1)).data">
                                                                    <header class="preview-suggestion-title">{{element.createTime}}</header>
                                                                    <p class="preview-suggestion-result">{{element.illnessName}}</p>
                                                                </section>
                                                            </template>

                                                            <template
                                                                    v-if="JSON.parse(ele.body.substring(1,ele.body.length-1)).data && !(Array.isArray(JSON.parse(ele.body.substring(1,ele.body.length-1)).data))">
                                                                <section class="preview-suggestion-content-text">
                                                                    <header class="preview-suggestion-title">
                                                                        {{JSON.parse(ele.body.substring(1,ele.body.length-1)).data.createTime}}
                                                                    </header>
                                                                    <p class="preview-suggestion-result">
                                                                        {{JSON.parse(ele.body.substring(1,ele.body.length-1)).data.illnessName}}</p>
                                                                </section>
                                                            </template>
                                                        </section>
                                                    </figcaption>
                                                </figure>
                                                <figure v-if="ele.msgType.toLowerCase()==='custom'&&JSON.parse(ele.body.substring(1,ele.body.length-1)).type =='checkSuggestion'">
                                                    <figcaption class="check-suggestion-message">
                                                        <header class="check-suggestion-message-title">检查/检验建议</header>
                                                        <template v-if="ele.msgType.toLowerCase()==='custom'">
                                                            <section class="check-suggestion-content">
                                                                <article class="check-suggestion-item" v-for="element in  JSON.parse(ele.body.substring(1,ele.body.length-1)).data">
                                                                    <span>{{element.adviceName}}</span>
                                                                </article>
                                                            </section>
                                                        </template>
                                                    </figcaption>
                                                </figure>
                                                <figure v-if="ele.msgType.toLowerCase()==='custom'&& JSON.parse(ele.body.substring(1,ele.body.length-1)).type =='videoTriage'">
                                                    <figcaption class="check-suggestion-message">
                                                        <header class="check-suggestion-message-title">视诊</header>
                                                        <section class="check-suggestion-content">
                                                            <article class="check-suggestion-item">
                                                                <span>{{JSON.parse(ele.body.substring(1,ele.body.length-1)).data.content}} </span></article>
                                                        </section>
                                                    </figcaption>
                                                </figure>
                                                <figure v-if="ele.msgType.toLowerCase()==='custom'&& JSON.parse(ele.body.substring(1,ele.body.length-1)).type =='ensureOperation'">
                                                    <figcaption class="messageList-item-text">你好，分诊医生已收到您的全部信息，正在帮您预约' + {{ele.doctorName}} + '医生，会在12小时内给您答复。
                                                        <span>立即咨询></span>
                                                    </figcaption>
                                                </figure>
                                                <figure v-if="ele.msgType.toLowerCase() === 'file'">
                                                    <figcaption class="messageList-item-text">
                                                        <img :src="ele.attUrl" class="img-show"/>
                                                    </figcaption>
                                                </figure>
                                                <!--提示信息-->
                                                <figure v-if="ele.msgType.toLowerCase()==='custom'&& JSON.parse(ele.body.substring(1,ele.body.length-1)).type =='reTriageTip'">
                                                    <figcaption class="messageList-item-text">
                                                        上一位服务该患者的分诊医生已下班，如有需要请继续沟通
                                                    </figcaption>
                                                </figure>
                                                <figure v-if="ele.msgType.toLowerCase()==='custom'&& JSON.parse(ele.body.substring(1,ele.body.length-1)).type =='triageSendTips'">
                                                    <figcaption class="messageList-item-text" v-if="JSON.parse(ele.body.substring(1,ele.body.length-1)).data.actionType =='image'">
                                                        上传图片：患者已上传检查资料，点击至“专科检查”查看。
                                                    </figcaption>
                                                    <figcaption class="messageList-item-text" v-else="JSON.parse(ele.body.substring(1,ele.body.length-1)).data.actionType =='video'">
                                                        上传视频：患者已上传视诊资料，点击至“专科检查”查看。若视频上传中，请稍后再次点击查看。
                                                    </figcaption>
                                                </figure>
                                                <figure v-if="ele.msgType.toLowerCase()==='custom'&& JSON.parse(ele.body.substring(1,ele.body.length-1)).type =='checkSuggestSendTips'">
                                                    <figcaption class="messageList-item-text" v-if="JSON.parse(ele.body.substring(1,ele.body.length-1)).data.actionType =='checkSuggest'">
                                                        患者已上传检查资料，点击至 "专科检查" 查看。
                                                    </figcaption>
                                                </figure>

                                            </article>
                                        </li>
                                    </ul>
                                    <div class="page-container" v-if="totalCount>pageNum&&diagnoseHistoryList.length>0">
                                        <div class="pagination pager">
                                            <ul class="pages">
                                                <li class="pgNext" :class="{'pgEmpty':pageIndex == 1}" @click.stop="chatHistoryRecord(0,items)">首页</li>
                                                <li class="pgNext" :class="{'pgEmpty':pageIndex == 1}" @click.stop="chatHistoryRecord(pageIndex-2,items)">上一页</li>
                                                <li class="page-number" :class="{'pgCurrent':pageIndex == item}" v-for="(item,key) in pages"
                                                    @click.stop="chatHistoryRecord(key,items)">{{item}}
                                                </li>
                                                <li class="pgNext" :class="{'pgEmpty':pageIndex == Math.ceil(totalCount/pageNum)}" @click.stop="chatHistoryRecord(pageIndex,items)">
                                                    下一页
                                                </li>
                                                <li class="pgNext" :class="{'pgEmpty':pageIndex == Math.ceil(totalCount/pageNum)}"
                                                    @click.stop="chatHistoryRecord(Math.ceil(totalCount/pageNum)-1,items)">末页
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </article>
                        </li>
                    </ul>
                </section>
            </section>
            <section class="mask-close" @click="$store.state.checkHistoryFlag = false"></section>
        </section>
        <section class="mask-background show"></section>
        <loading v-if="loadingShow"></loading>
        <transition name="fade-scale">
            <popup v-if="popupShow" :obj.sync="popupObj" :payPopupShow.sync="popupShow"></popup>
        </transition>
    </section>
</template>
<script>
    import api from '../common/js/util';
    import Vue from "vue";
    import loading from  '../common/loading';
    import popup from  '../common/popup';
    Vue.filter('timeFormatCheckHistory', function (time, a) {
        let result = "";
        time = time.replace("-", "年");
        time = time.replace("-", "月");
        result = time.substring(0, 10) + "日" + time.substring(10, 16);
        return result;
    });
    Vue.filter('previewSuggestion', function (data, a) {
        let result = "";

        return result;
    });
    export default{
        name: 'check-history-modules',
        data(){
            return {
                diagnoseHistoryUrl: "/call/customer/patient/case/v1/getCaseMapList/",
                chatHistoryRecordUrl: "/call/patient/case/chat/v1/getMapList/",
                diagnoseHistoryList: [],
                chatHistoryRecordList: [],
                currentIndex: -1,
                totalCount: 0,
                pageNum: 5,
                pageIndex: 1,
                pageResult: 0,
                loadingShow: false,
                popupShow: false,
                popupObj: {}
            }
        },
        components: {
            loading,
            popup
        },
        methods: {
            init(){
                this.diagnoseHistory();
            },
            updateShow(ele){
                console.log(ele);
                document.querySelector(".mask-background").style.display = "none";
                this.$store.commit("setPreviewType",2);
                this.$store.commit("setPreviewId",JSON.parse(ele.body.substring(1,ele.body.length-1)).data[0].diagnosisId);
                this.$store.commit("setPreviewShow",true);
            },
            diagnoseHistory(){
                let _this = this;
                let dataValue = {
                    patientId: _this.$store.state.patientId
                };
                api.ajax({
                    url: _this.diagnoseHistoryUrl,
                    method: "POST",
                    data: dataValue,
                    beforeSend(config) {
                    },
                    done(res) {
                        _this.diagnoseHistoryList = res.responseObject.responseData.dataList;
                    },
                    fail(error){

                    }
                })
            },
            chatHistoryRecord(num, items, index){
                let _this = this;
                _this.pageResult = num * _this.pageNum;
                _this.pageIndex = num + 1;
//                console.log(_this.pageIndex)
                if (index || index == 0) {
                    if (_this.currentIndex == index) {
                        _this.currentIndex = -1;
                    } else {
                        _this.currentIndex = index;
                    }
                }
                _this.chatHistoryRecordList = [];
                let dataValue = {
                    fromAccount: "1_doctor00001",   // localStorage.getItem("patientId"),
                    receiveAccount: "0_" + items.caseId,
                    firstResult: _this.pageResult,
                    maxResult: _this.pageNum,
                    sortType: 1
                };
                api.ajax({
                    url: _this.chatHistoryRecordUrl,
                    method: "POST",
                    data: dataValue,
                    done(res) {
                        if (res.responseObject.responseMessage == "NO DATA") {
                            _this.chatHistoryRecordList = [];
                            _this.popupShow = true;
                            _this.popupObj = {
                                text: '无聊天记录'
                            }
                        } else {
                            _this.popupShow = false;
                            if (parseInt(res.responseObject.responseData.totalCount) > 2) {
                                _this.totalCount = parseInt(res.responseObject.responseData.totalCount) - 2;
                                _this.chatHistoryRecordList = res.responseObject.responseData.dataList;
                            } else {
                                _this.totalCount = 0;
                                _this.chatHistoryRecordList = [];
                                _this.popupShow = true;
                                _this.popupObj = {
                                    text: '无聊天记录'
                                }
                            }
                        }
                    }
                })
            },
            filterInfo(ele){
               // console.log(ele);
                if (ele.msgType.toLowerCase() === 'file') {
                    return true;
                } else if (ele.msgType.toLowerCase() === 'custom') {
                    let bodyInfo = JSON.parse(ele.body.substring(1, ele.body.length - 1));
                    switch (bodyInfo.type) {
                        case 'new-health':
                        case 'medicalReport':
                            return false;
                            break;
                        case 'notification':
                            if(bodyInfo.data.actionType === 5){
                                return false ;
                            }else{
                                return true ;
                            }
                            break;
                        default : return true ;
                    }
                }else if(ele.msgType.toLowerCase() === 'text'){
                    return true ;
                }
            }
        },
        computed: {
            pages(){
                let pageArr = [], that = this;
                for (let i = 1; i <= Math.ceil(that.totalCount / that.pageNum); i++) {
                    pageArr.push(i);
                }
                return pageArr;
            }
        },
        mounted(){
            this.init();
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../scss/pages/employee/commonMask";
    @import "../scss/modules/_middleMessageBox";
    //分页
    .page-container {
        padding-bottom: 30px;
        .pagination {
            height: 36px;
            margin-top: 45px;
            padding: 0;
            .pages {
                text-align: center;
            }
            .pgEmpty {
                color: #eee;
                cursor: default;
            }
            .pgNext {
                width: 50px;
            }
            li {
                display: inline-block;
                width: 36px;
                height: 36px;
                line-height: 36px;
                margin-right: 8px;
                text-align: center;
                color: grey;
                background-color: #fff;
                font-size: 14px;
                overflow: hidden;
                padding: 0;
                cursor: pointer;
            }
            .pgCurrent {
                height: 36px;
                width: 36px;
                background: #3d84c6;
                color: #fff;
            }
        }
    }

</style>
