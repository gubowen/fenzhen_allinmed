<template>
  <section class="preview-suggestion-box" v-if="$store.state.previewShow">
    <i class="icon-close window-close" @click="closePreview"></i>
    <header class="preview-suggestion-title">
      <button type="button" class="btn-border-small-pvw btn-cancel fl" @click="reviseSuggest" v-if="$store.state.previewType ==1 ">修改</button>
      <span>初诊建议</span>
      <button type="button" class="btn-primary-small-pvw fr ev-send-suggestion" @click="sendSuggest" v-if="$store.state.previewType ==1">发送</button>
    </header>
    <section class="preview-suggestion-inner">
      <section class="preview-suggestion-item">
        <header class="preview-suggestion-item-title">
          <span>初步诊断</span>
        </header>
        <section class="patient-message">
          <figure class="patient-message-img"><img :src="getLogoImg().patientImg"></figure>
          <figcaption class="patient-message-content">
            <h3>{{getLogoImg().patientName}}</h3>
            <article class="disease-base-msg icon-disease-message">
              <article>
                <ul>
                  <li><span>患病专科：</span><span>{{previewSendData.diagnoseResult.majorName}}</span></li>
                  <li v-if="previewSendData.diagnoseResult.illnessName != '' && previewSendData.diagnoseResult.illnessName != '暂不确定'"><span>所患疾病：</span><span class="caseIllnessName">{{previewSendData.diagnoseResult.illnessName}}</span></li>
                  <li v-if="previewSendData.diagnoseResult.operationName != '' && previewSendData.diagnoseResult.operationName != '暂不确定'"><span>手术建议：</span><span>{{previewSendData.diagnoseResult.operationName}}</span></li>
                </ul>
              </article>
            </article>
            <p class="time icon-disease-time"><span>{{nowTime}}</span></p>
          </figcaption>
        </section>
      </section>
      <section class="preview-suggestion-item result_recommendDoctor" v-if="previewSendData.doctorList && previewSendData.doctorList.length>0">
        <header class="preview-suggestion-item-title">
          <span>推荐医生</span>
        </header>
        <header class="preview-project-title">
          <span>以下医生最擅长解决您的问题。</span>
        </header>
        <section class="doctor-message">
          <section class="doctor-message-item" v-for="item in previewSendData.doctorList">
            <figure class="doctor-message-img"><img :src="item.logoUrl"></figure>
            <figcaption class="doctor-message-content">
              <header class="doctor-message-content-head">
                <h4>{{item.fullName}}</h4>
                <span class="netstat">{{item.adviceStatus==1?"在线":"休息"}}</span>
                <figure class="doctor-message-tags">
                  <span class="tags" v-if="item.isTop == 1">全国TOP10骨科医院</span>
                  <span class="tags" v-if="item.isNearest == 1">距离最近</span>
                  <span class="tags" style="background: #FFF1D4;color: #EB9E00;" v-if="item.isFreeTimes != 0">首次问诊免费</span>
                </figure>
              </header>
              <article class="doctor-message-hospital">
                <span class="hos-ddress">{{item.province?item.province:""}}  {{item.city?item.city:""}}  {{item.district?item.district:""}}</span>
                <span class="hospital">{{item.company}}</span>
                <span class="medical">{{item.medicalTitle}}</span>
              </article>
              <article class="doctor-message-goodAt">擅长:{{item.illnessNameList}}</article>
              <article class="doctor-message-num">
                <span class="price"><em>¥{{item.generalPrice}}</em>/{{item.generalTimes}}次起</span>
                <span class="lastNum">仅剩<em>{{item.adviceNum}}</em>个名额</span>
              </article>
              <button class="doctor-message-consult">立即咨询</button>
            </figcaption>
          </section>
        </section>
      </section>
      <section class="preview-suggestion-item result_examineTestSuggest" v-if="(previewSendData.examineList&&previewSendData.examineList.length>0 )|| (previewSendData.testList&&previewSendData.testList.length>0)">
        <header class="preview-suggestion-item-title">
          <span>建议检查/检验</span>
        </header>
        <header class="preview-project-title">
          <span>您还可进行以下检查，并上传检查资料，唯医会诊将为您定制更详细建议。</span>
        </header>
        <section class="preview-project">
          <section class="preview-project-list">
            <article class="preview-project-item examine" v-for="item in previewSendData.examineList">{{item.nodeName || item.checkName}}</article>
            <article class="preview-project-item test" v-for="item in previewSendData.testList">{{item.inspectionName}}</article>
          </section>
        </section>
      </section>
      <section class="preview-suggestion-item result_teachingKnowledge" v-if="previewSendData.teachingList && previewSendData.teachingList.length>0">
        <header class="preview-suggestion-item-title">
          <span>患教知识</span>
        </header>
        <section class="disease-teach-box">
          <section class="disease-teach-item" v-for="item in previewSendData.teachingList">
            <figcaption class="disease-teach-content">
              <h4>{{item.knowledgeName}}</h4>
            </figcaption>
          </section>
        </section>
      </section>
      <section class="preview-suggestion-item result_disposeSuggest" v-if="previewSendData.disposeList && previewSendData.disposeList.length>0">
        <header class="preview-suggestion-item-title">
          <span>处置建议</span>
        </header>
        <header class="preview-project-title">
          <span>请在医生指导下合理进行，咨询医生</span>
        </header>
        <section class="preview-project">
          <section class="preview-project-list">
            <article class="preview-project-item dispose" v-for="item in previewSendData.disposeList">{{item.treatmentName}}</article>
          </section>
        </section>
      </section>
      <section class="preview-suggestion-item result_operationSuggest" v-if="previewSendData.diagnoseResult.operationName&&previewSendData.diagnoseResult.operationName.length>0">
        <header class="preview-suggestion-item-title">
          <span>手术建议</span>
        </header>
        <header class="preview-project-title">
          <span>请在医生指导下合理安排，咨询医生</span>
        </header>
        <section class="preview-project">
          <section class="preview-project-list">
            <article class="preview-project-item operation">{{previewSendData.diagnoseResult.operationName}}</article>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>
<script type="text/ecmascript-6">
    const XHRList = {
        getPreviewSuggest:"/call/patient/case/diagnosis/v1/getMapById/",//预览初诊建议
        getRecommendDoctor:"/call/patient/recommend/v1/getMapList/",//预览推荐医生
        saveData: "/call/patient/case/diagnosis/v1/create/",//保存初步诊断
        savePreviewSuggest:"/call/patient/recovery/advice/v1/create/",//保存初诊建议
        saveRecommendDoc:"/call/patient/recommend/v1/create/",//保存初诊医生
      }
    import ajax from "../../common/js/ajax";
    import store from "@/store/store";
    export default{
      data(){
        return {
          nowTime:"",
          previewSendData:{
            diagnoseResult:{},
            doctorList:[],
            teachingList:[],
            disposeList:[],
            examineList:[],
            testList:[]
          },
        }
      },
      mounted(){
        this.getDataList();
      },
      methods:{
        getLogoImg(){
          return {
            patientImg:this.$store.state.currentItem.logoUrl,
            patientName:this.$store.state.patientName
          }
        },
        closePreview(){
          store.commit("setPreviewShow",false);
          store.commit("setPreviewId","");
          store.commit("setPreviewType",-1);
          store.commit("setPreviewData",{
            diagnoseResult:{},
            doctorList:[],
            teachingList:[],
            disposeList:[],
            examineList:[],
            testList:[]
          })
        },
        getDataList(){
          let that = this;
          let date = new Date()
          if(this.$store.state.previewType == 1){
            this.previewSendData=this.$store.state.previewData;
            this.nowTime = date.getFullYear()+'年'+(date.getMonth()+1<10?"0"+(date.getMonth()+1):date.getMonth()+1)+'月'+(date.getDate()<10?"0"+date.getDate():date.getDate())+'日';
          }else{
            //获取推荐建议
            ajax({
              url: XHRList.getRecommendDoctor,
              method: 'POST',
              data: {
                diagnosisId: this.$store.state.previewId,
                isValid: 1,
                firstResult: 0,
                maxResult: 9999,
                sortType: 1,
                caseId:this.$store.state.currentItem.caseId
              },
              done(data){
                if(data.responseObject.responseData&&data.responseObject.responseData.dataList&&data.responseObject.responseData.dataList.length>0){
                  that.previewSendData.doctorList = data.responseObject.responseData.dataList;
                }
              }
            })
            ajax({
              url: XHRList.getPreviewSuggest,
              method: 'POST',
              data: {
                caseId:this.$store.state.currentItem.caseId,
                diagnosisId:this.$store.state.previewId,
                isValid:1,
                firstResult:0,
                maxResult:1,
                sortType:1
              },
              done(data){
                if(data.responseObject.responseData&&data.responseObject.responseData.dataList&&data.responseObject.responseData.dataList.length>0){
                  let items = data.responseObject.responseData.dataList[0];
                  if(items.caseDiagnosis.createTime){
                    let caseTime = items.caseDiagnosis.createTime.split(" ")[0];
                    that.nowTime =caseTime.split('-')[0] + '年' + caseTime.split('-')[1] + '月' + caseTime.split('-')[2] + '日'
                  }
                  that.previewSendData.diagnoseResult = items.caseDiagnosis;
                  that.previewSendData.teachingList = items.knowledgeList;
                  that.previewSendData.disposeList = items.treatmentList;
                  that.previewSendData.examineList = items.checkList;
                  that.previewSendData.testList = items.inspectionList;
                }
              }
            })
          }
        },
        reviseSuggest(){
          store.commit("setPreviewShow",false);
          store.commit("setPreviewType",-1);
        },
        sendSuggest(){
          let that = this;
          let recommendCustomerList = [],recoveryAdviceList = [];
          //推荐医生
          if(this.previewSendData.doctorList.length>0){
            this.previewSendData.doctorList.forEach(function (key) {
              let recommendCause = '';
              if(key.isTop==1&&key.isNearest==1){
                recommendCause = 2
              }else if(key.isTop==1){
                recommendCause = 1
              }else{
                recommendCause = 0
              }
              recommendCustomerList.push({
                recommendType:1,
                recommendId:key.customerId,
                recommendCause:recommendCause
              })
            })
          };
          //患教知识
          if(this.previewSendData.teachingList.length>0){
            this.previewSendData.teachingList.forEach(function (key) {
              recoveryAdviceList.push({
                adviceType:3,
                adviceId:key.knowledgeId
              })
            })
          };
          //处置建议
          if(this.previewSendData.disposeList.length>0){
            this.previewSendData.disposeList.forEach(function (key) {
              recoveryAdviceList.push({
                adviceType:0,
                adviceId:key.treatmentId
              })
            })
          };
          //检查建议
          if(this.previewSendData.examineList.length>0){
            this.previewSendData.examineList.forEach(function (key) {
              recoveryAdviceList.push({
                adviceType:1,
                adviceId:key.nodeId
              })
            })
          };
          //检验建议
          if(this.previewSendData.testList.length>0){
            this.previewSendData.testList.forEach(function (key) {
              recoveryAdviceList.push({
                adviceType:2,
                adviceId:key.inspectionId
              })
            })
          };
          ajax({
            url: XHRList.saveData,
            method: 'POST',
            data: that.previewSendData.diagnoseResult,
            done(data){
              if (data.responseObject.responseStatus) {
                console.log("初步诊断保存成功");
                let diagnosisId = data.responseObject.responsePk;
                if(recommendCustomerList.length>0){
                  //推荐医生保存
                  ajax({
                    url: XHRList.saveRecommendDoc,
                    method: 'POST',
                    data: {
                      caseId:that.$store.state.caseId,
                      patientId:that.$store.state.patientId,
                      customerId:that.$store.state.userId,
                      recommendCustomerList:JSON.stringify(recommendCustomerList),
                      diagnosisId:diagnosisId,
                      type:1
                    },
                    done(data){
                      console.log("推荐医生保存成功");
                    }
                  })
                };
                if(recoveryAdviceList.length>0){
                  //四大建议保存
                  ajax({
                    url: XHRList.savePreviewSuggest,
                    method: 'POST',
                    data: {
                      caseId:that.$store.state.caseId,
                      patientId:that.$store.state.patientId,
                      customerId:that.$store.state.userId,
                      recoveryAdviceList:JSON.stringify(recoveryAdviceList),
                      diagnosisId:diagnosisId,
                      type:1
                    },
                    done(data){
                      console.log("四大建议保存成功");
                    }
                  })
                };
                //发送IM
                let nowTime = new Date(),
                createTime = (nowTime.getFullYear()+'.'+(nowTime.getMonth()+1<10?"0"+(nowTime.getMonth()+1):nowTime.getMonth()+1)+'.'+(nowTime.getDate()<10?"0"+nowTime.getDate():nowTime.getDate())).replace(/-/g,".");
                that.closePreview();
                that.$store.commit("setCheckSuggestionFlag", !that.$store.state.checkSuggestionFlag);
                store.commit("previewSuggestionSender",{
                    flag:true,
                    data:{
                      "illnessName":that.previewSendData.diagnoseResult.illnessName?that.previewSendData.diagnoseResult.illnessName:"暂不确定",
                      "customerId":that.$store.state.userId,
                      "caseId":that.$store.state.caseId,
                      "patientName":that.$store.state.patientName,
                      "createTime":createTime,
                      "diagnosisId":diagnosisId
                    }
                });
              }
            }
          })
        }
      },
      props:{

      }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../../scss/base";
  @import "../../scss/modules/_buttonModule";
  .preview-suggestion-box {
    height: 90.7%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 800px;
    background-color: #fff;
    z-index: 5;
    .window-close {
      position: absolute;
      right: -34px;
      cursor: pointer;
    }
    .preview-suggestion-title {
      padding: 20px 40px;
      background: #D9DFEC;
      text-align: center;
      color: #222;
      font-size: 18px;
    }
  }

  .preview-suggestion-inner {
    overflow: auto;
    height:93.7%;
  }
  .preview-suggestion-item {
    margin: 40px 0;
    box-sizing: border-box;
    &-title {
      font-size:17px;
      color: #555;
      padding: 0 40px;
      margin: 20px 0;
      & > span {
        display: inline-block;
        vertical-align: middle;
        margin-left: 4px;
        font-weight: bold;
      }
      &:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        width: 2px;
        height: 12px;
        background-color: #7A8EC1;

      }
    }
  }
  .patient-message {
    padding: 20px 40px;
    &-img {
      @include circle(88px);
      display: inline-block;
      vertical-align: top;
      & > img {
        @include circle(88px);
        vertical-align: top;
      }
    }
    &-content {
      display: inline-block;
      vertical-align: top;
      margin-left: 20px;
      width: 80%;
      & > h3 {
        font-size: 22px;
        color: #222222;
      }
      .disease-base-msg {
        margin-top: 28px;
        margin-bottom: 20px;
        span {
          vertical-align: middle;
        }
        & > article {
          display: inline-block;
          vertical-align: top;
          line-height: 1.5;
          font-size: 16px;
          color: #555;
          width: 93%;
          li{
            display:inline;
            &:after{
              display:inline-block;
              content: '';
              width:1px;
              height:16px;
              vertical-align: middle;
              background:#ededed;
              margin:0 20px;
            }
            &:first-child{
              padding-left:0;
            }
            &:last-child:after{
              display:none;
            }
          }
        }
      }
      .time {
        font-size: 14px;
        color: #939BAB;
        & > span {
          vertical-align: middle;
        }
      }
    }
  }
  .preview-project {
    &-title {
      margin: 40px 0 20px 0;
      font-size: 15px;
      color: #555555;
      padding-left: 40px;
    }
    &-item {
      position:relative;
      font-size: 16px;
      color: #222;
      padding: 18px 0 18px 40px;
      cursor: pointer;
      //&:hover > span {
      //  color: #7a8ec1;
      //}
      &.isHasOption{
        padding:10px 0 10px 45px;
        color:#808080;
      }
      &.icon-upArrow{
        color: #7A8EC1;
      }
      &.icon-upArrow-big{
        color: #7A8EC1;
      }
    }
    &-content {
      background: #F9F9F9;
      padding-left: 16px;
      display: none;
    }
    &-content.on {
      display: block;
    }

    .icon-downArrow-big {
      &:after {
        position: absolute;
        right: 40px;

      }
    }
    .icon-downArrow {
      position: relative;
      &:after {
        position: absolute;
        right: 40px;
      }
    }

    .icon-upArrow-big {
      position: relative;
      &:after {
        position: absolute;
        right: 40px;

      }
    }
    .icon-upArrow {
      position: relative;
      &:after {
        position: absolute;
        right: 40px;
      }
    }
  }
  .setting-form-item-sex-selector {
    font-size: 0;
    display: inline-block;
    vertical-align: bottom;
    .setting-form-item-sex {
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
      font-size:14px;
      margin-right: 12px;
      & > span {
        display: inline-block;
        vertical-align: middle;
      }
    }
    .sex-selector {
      display: inline-block;
      vertical-align: middle;
      @include circle(15px, #f4f6fb);
      margin-right: 15px;
      &-on {
        background-color: #4fc8d5;
      }
    }

  }
  .setting-form-btn {
    padding-left: 90px;
    width: 100%;
    box-sizing: border-box;
    & > button {
      width: 100%;
    }
  }
  .icon-select-normal {
    & > span {
      vertical-align: middle;
      padding-left: 8px;

    }
    .icon-choice{
      display: inline-block;
      &:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        width: 14px;
        height: 14px;
        background: url("/image/img00/login/1_choose_sel_small.png");
        background-size: 100% 100%;
      }
      &.active {
        &:before {
          background: url("/image/img00/login/1_choose_nor_small.png");
        }
      }
    }

    &.disable {
      color: #ccc !important;
    }
  }
  .preview-result-content {
    padding: 40px;
    box-sizing: border-box;
    min-height: 400px;
    .preview-result-info {
      font-size: 16px;
      color: #222222;
      letter-spacing: 0;
      line-height: 16px;
      ul {

        li {
          margin-bottom: 40px;

        }
      }

    }
  }
  .btn-group {
    padding: 0 40px 40px;
    box-sizing: border-box;
  }
  .preview-suggestion-tips-text {
    margin: 60px 0 50px;
    text-align: center;
    font-size: 14px;
    color: #AAA;
  }
  .disease-teach-box{

  }
  .disease-teach-item{
    padding:30px 40px;
    display: flex;
    &:hover{
      box-shadow: 0px 0px 10px 0px rgba(179,205,199,0.35);
    }
  }
  .disease-teach-content{
    & > h4{
      font-weight:normal;
      font-size: 16px;
      color: #222;
    }
    & > article{
      margin:18px 0;
      font-size: 14px;
      line-height: 1.5;
      color: #909090;
    }
    & > .release-time{
      font-size: 11px;
      color: #CCCCCC;
      margin-top:35px;
    }
  }
  .disease-teach-img{
    width: 180px;
    flex-shrink: 0;
    height: 120px;
    margin-right: 30px;
    & > img{
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }

  .doctor-message-item{
    display: flex;
    padding:30px 40px;
    //&:hover{
    //  box-shadow: 0px 0px 10px 0px rgba(179,205,199,0.35);
    //}
    &.active{
      &:before{
        background: url(../../assets/img00/check/choose_nor_small.png) no-repeat;
      }
    }
  }
  .doctor-message-img{
    @include circle(50px);
    flex-shrink: 0;
    margin-right: 16px;
    & > img{
      width: 100%;
      height: 100%;
      vertical-align: top;
      border-radius: 50%;
    }
  }
  .doctor-message-content{
    width: 100%;
    position: relative;
  }
  .doctor-message-content-head {
    font-size: 0;
    & > h4 {
      font-size: 18px;
      display: inline-block;
      vertical-align: middle;
      color: #222222;
      margin-right: 18px;
      max-width: 365px;
      line-height: 1.2;
    }

    & > .rate {
      font-size: 15px;
      color: #555555;
      display: inline-block;
      vertical-align: middle;
    }
    &>.netstat{
      font-size: 15px;
      color: #00BEAF;
      display: inline-block;
      vertical-align: middle;
      margin:0 14px;
      &.rest{
        color:#cccccc;
      }
    }
    .doctor-message-tags {
      display: inline-block;
      vertical-align: middle;
      .tags {
        background: #EEF6FF;
        border-radius: 2px;
        font-size: 12px;
        color: #8DAED9;
        display: inline-block;
        padding: 4px 8px;
        vertical-align: middle;
        margin-right: 8px;
      }
    }
  }

  .doctor-message-hospital{
    font-size: 14px;
    color: #555;
    margin-top: 10px;
    margin-bottom: 16px;
    .medical,.hospital{
      margin-right:16px;
    }
  }

  .doctor-message-goodAt{
    margin:16px 0;
    color: #909090;
    font-size: 14px;
    max-width: 500px;
    line-height: 1.5;
    .high-light-search-text{
      color: #252525;
      font-weight:bold;
    }
  }
  .doctor-message-num{
    margin:16px 0;
    font-size: 0;
    & > span{
      margin-right: 40px;

    }
    & > .price{
      font-size: 14px;
      color: #909090;
      em{
        color: #F23E34;
        font-style: normal;
        font-weight: bolder;
      }
    }
    & > .askNum{
      color: #909090;
      font-size: 14px;

    }
    & > .lastNum{
      font-size: 14px;
      color: #909090;
      em{
        color: #00BEAF;
        font-style: normal;
        font-weight: bold;
      }
    }
  }

  .doctor-message-consult{
    border: 1px solid #A1AFD3;
    border-radius: 4px;
    height: 30px;
    padding:0 17px;
    font-size: 13px;
    color: #7A8EC1;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -15px;
    cursor: pointer;
  }
</style>
