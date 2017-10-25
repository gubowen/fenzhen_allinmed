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
            <li v-for="(items,index) in diagnoseHistoryList" @click="chatHistoryRecord(items,index)">
              <section class="check-history-info">
                <span class="check-history-title"><i class="icon-downArrow"></i>{{items.mainContent.caseMain}}}</span>
                <span class="check-history-text">{{items.createTime|timeFormatCheckHistory}}</span>
              </section>
              <article class="check-history-show" :class="{'on': index == currentIndex}" v-show="chatHistoryRecordList.length >0">
                <h3>咨询对话历史</h3>
                <section class="check-history-talk">
                  <ul>
                    <li v-for="ele in chatHistoryRecordList">
                      <article>
                        <header :class="{'doctor-letter':ele.fromAccount == '1_doctor00001'}"
                                v-show="JSON.parse(ele.body.substring(1,ele.body.length-1)).type != 'new-health'&& JSON.parse(ele.body.substring(1,ele.body.length-1)).type != 'medicalReport'">
                          {{$store.state.patientName +ele.createTime.replace(/-/g, "/").substr(0,ele.createTime.replace(/-/g, "/").length-2)}}
                        </header>
                        <p v-show="ele.msgType.toLowerCase()==='text'">{{ele.body }}</p>
                        <figure v-show="ele.msgType.toLowerCase()==='custom' && JSON.parse(ele.body.substring(1,ele.body.length-1)).type == 'previewSuggestion'">
                          <figcaption class="check-suggestion-message">
                            <header class="check-suggestion-message-title">初诊建议</header>
                            <section class="preview-suggestion-content">
                              <p class="preview-suggestion-img">
                                <img src="/static/img/img00/index/dialog_report.png" alt="">
                              </p>
                              <section class="preview-suggestion-content-text" v-for="element in  JSON.parse(ele.body.substring(1,ele.body.length-1)).data">
                                <header class="preview-suggestion-title">{{element.createTime}}</header>
                                <p class="preview-suggestion-result" >{{element.illnessName}}</p>
                              </section>
                            </section>
                          </figcaption>
                        </figure>
                        <figure v-show="ele.msgType.toLowerCase()==='custom'&&JSON.parse(ele.body.substring(1,ele.body.length-1)).type =='checkSuggestion'">
                          <figcaption class="check-suggestion-message">
                            <header class="check-suggestion-message-title">检查/检验建议</header>
                            <section class="check-suggestion-content">
                              <article class="check-suggestion-item" v-for="element in  JSON.parse(ele.body.substring(1,ele.body.length-1)).data">
                                <span>{{element.adviceName}}</span>
                              </article>
                            </section>
                          </figcaption>
                        </figure>
                        <figure v-show="ele.msgType.toLowerCase()==='custom'&& JSON.parse(ele.body.substring(1,ele.body.length-1)).type =='videoTriage'">
                          <figcaption class="check-suggestion-message">
                            <header class="check-suggestion-message-title">视诊</header>
                            <section class="check-suggestion-content">
                              <article class="check-suggestion-item"><span>{{ele.content}} </span></article>
                            </section>
                          </figcaption>
                        </figure>
                        <figure v-show="ele.msgType.toLowerCase()==='custom'&& JSON.parse(ele.body.substring(1,ele.body.length-1)).type =='ensureOperation'">
                          <figcaption class="messageList-item-text">你好，分诊医生已收到您的全部信息，正在帮您预约' + {{ele.doctorName}} + '医生，会在12小时内给您答复。
                            <span>立即咨询></span>
                          </figcaption>
                        </figure>
                        <figure v-show="ele.msgType.toLowerCase()==='custom'&& JSON.parse(ele.body.substring(1,ele.body.length-1)).type =='reTriageTip'">
                          <figcaption class="messageList-item-text">
                            上一位服务该患者的分诊医生已下班，如有需要请继续沟通
                          </figcaption>
                        </figure>
                      </article>
                    </li>
                  </ul>
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
    <popup v-if="popupShow" :obj.sync="popupObj" :payPopupShow.sync="popupShow"></popup>
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
      chatHistoryRecord(items, index){
        let _this = this;
        if(_this.currentIndex == index){
            _this.currentIndex = -1;
        }else{
          _this.currentIndex = index;
        }
        _this.chatHistoryRecordList = [];
        let maxResult = 5;
        let dataValue = {
          fromAccount: "1_doctor00001",   // localStorage.getItem("patientId"),
          receiveAccount: "0_" + items.caseId,
          firstResult: 0,
          maxResult: maxResult,
          sortType: 1
        };
        api.ajax({
          url: _this.chatHistoryRecordUrl,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res) {
            if (res.responseObject.responseMessage == "NO DATA") {
              _this.chatHistoryRecordList = [];
              _this.popupShow = true;
              _this.popupObj = {
                text: '无聊天记录'
              }
            } else {
              _this.popupShow = false;
              _this.chatHistoryRecordList = res.responseObject.responseData.dataList;
            }
          },
          fail(error){
          }
        })
      }
    },
    mounted(){
      this.init();
    }
  }
</script>
<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
  @import "../scss/pages/employee/commonMask";
  @import "../scss/modules/_middleMessageBox";

</style>
