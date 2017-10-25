<template>
  <section class="center-inner-message" id="communication">
    <section class="layout-helper">
      <figure class="center-inner-wrapper">
        <img src="./assets/img00/index/logo_empty bg.png" alt="">
      </figure>
      <BaseIm ref="baseImComponent"></BaseIm>
      <section class="user-controller">
        <nav class="user-controller-fastBtn" data-template="tpl-fastReply" v-if="!watingTriage">
          <button class="user-controller-fastReply" @click="fastRely()"><i class="icon-fastReply"></i><span>快捷提问</span>
          </button>
          <button class="user-controller-result" @click="usedRely()"><i class="icon-userReply"></i><span>常用回复</span>
          </button>
          <button class="user-controller-report" @click="suggestion()"><i class="icon-suggestion"></i><span>初诊建议</span>
          </button>
          <button class="user-controller-check" @click="examine()"><i class="icon-checkout"></i><span>检查检验</span>
          </button>
          <button class="user-controller-check" @click="reTriageShow=true"><i class="icon-checkout"></i><span>患者转移分诊</span></button>
          <!--快捷提问-->
          <fast-Rely v-if="fastRelyStatus" :controllerInputStatus.sync="controllerInputStatus"></fast-Rely>
          <!--常用回复-->
          <used-Rely v-show="usedRelyStatus"></used-Rely>
          <SmallConfirm @ensureCallback="reTriageComfirm" :comfirmContent="reTriageContentTips"
                        @cancelCallback="reTriageShow=false" v-if="reTriageShow"></SmallConfirm>
        </nav>
        <article class="user-controller-middle">
          <textarea name="" id="" cols="" rows="" class="user-controller-input" v-model="controllerInput"
                    @keyup="sendMessage($event)" :readonly="$store.state.inputReadOnly"></textarea>

        </article>
        <footer class="user-controller-footer" v-if="!watingTriage">
          <span class="user-send-message">按下Enter发送</span>
          <button class="btn-primary user-controller-send-btn" @click="sendMessage">发送</button>
        </footer>
        <button class="btn-primary user-controller-get-triage" v-if="watingTriage" @click="getPatient">接诊</button>

      </section>
    </section>
    <!--编辑常用回复-->
    <UsedReplyConfig v-if="$store.state.usedReplyConfig"></UsedReplyConfig>
    <!--编辑快捷提问-->
    <fast-Reply-Config v-if="$store.state.fastReplyConfig"></fast-Reply-Config>
    <!--检查检验-->
    <examine-check  v-if="$store.state.examineFlag" ></examine-check>
    <!--初诊建议-->
    <Check-Suggestion v-if="$store.state.checkSuggestionFlag"></Check-Suggestion>

    <show-big-Img :showBigImgFlag.sync="$store.state.SBIFlag" v-if="$store.state.SBIFlag"></show-big-Img>
    <section :class="{on:$store.state.previewType == 2,'main-masker':$store.state.previewType == 2}" v-if="$store.state.previewShow">
      <PreviewSuggestion></PreviewSuggestion>
    </section>
  </section>
</template>
<script>
  import axios from "axios";
  import SmallConfirm from "@/common/smallConfirm";
  import fastRely from './components/fast_reply';
  import usedRely from './components/used_rely';
  import fastReplyConfig from  './components/fast_reply_config';
  import UsedReplyConfig from './components/usedReplyConfig';
  import CheckSuggestion from './components/CheckSuggestion';
  import ExamineCheck from './components/ExamineCheck';
  import PreviewSuggestion from './components/previewSuggestion'
  import BaseIm from './baseIm';


  import triagePatient from "@/base/triagePatient";
  import releasePatient from "@/base/releasePatient";
  import ShowBigImg from './common/ShowBigImg';
  import store from "@/store/store";

  export default {
    name: 'communication',
    data(){
      return {
        controllerInput: '',
        controllerInputStatus: 0,
        examineSuggest: '',
        FirstIndex: -1,
        SecondIndex: -1,
        ThirdIndex: -1,
        FourIndex: -1,
        testSuggest: '',
        examineFlag: false,//检查检验
        suggestionFlag: false,
        checkSuggestionFlag: false,//初诊建议
        tabActive: true,
        fastRelyStatus: '',     //快捷提问是否能点击
        SBIFlag: false,
        usedRelyStatus: false,      //常用回复是否能点击
        fastReplyConfig: false,
        reTriageShow: false,
        reTriageContentTips: "确定要重新分诊您选中的患者吗？",
        inputReadOnly:""
      }
    },
    components: {
      fastRely,
      usedRely,
      fastReplyConfig,
      CheckSuggestion,
      ExamineCheck,
      ShowBigImg,
      BaseIm,
      SmallConfirm,
      PreviewSuggestion
    },
    props: {
      m: {
        type: Object
      },
      n: {
        type: Boolean
      },

      watingTriage: {
        type: Boolean
      },
      userListStatus: {
        type: Object
      }
    },
    watch: {
      '$store.state.fastReplyContent'(content){
        this.controllerInput = content;
      },
      '$store.state.usedReplyContent'(content){
        this.controllerInput = content;
      },
    },
    methods: {
      //初始化
      init(){
        let that = this;
      },
      sendMessage(e){
        const that = this;
        let baseFn = function () {
          if (that.controllerInput.trim().length === 0) {
            return;
          } else {
            if (that.controllerInputStatus == 0) {
              that.$refs.baseImComponent.sendMessage(that.controllerInput).then((obj) => {
                that.controllerInput = "";
              })
            } else {
              store.commit("videoTriageSender", {
                flag: true,
                data: {
                  content: that.controllerInput,
                  type: that.controllerInputStatus
                }
              })
              that.controllerInput = "";
              that.controllerInputStatus = 0;
            }

          }
        };
        if (e.keyCode) {
          if (e.keyCode == 13) {
            baseFn();
          }
        } else {
          baseFn()
        }
      },
      //出诊建议按钮
      suggestion () {
          this.$store.commit("setCheckSuggestionFlag",!this.$store.state.checkSuggestionFlag);
      },
      //检查检验
      examine () {
        this.$store.commit('setExamineFlag',!this.$store.state.examineFlag);
      },
      //快捷提问按钮
      fastRely(){
        let _this = this;
        _this.fastRelyStatus = !_this.fastRelyStatus;
        _this.usedRelyStatus = false;
      },
      //常用回复
      usedRely(){
        let _this = this;
        _this.usedRelyStatus = !_this.usedRelyStatus;
        _this.fastRelyStatus = false;
      },

      //患者转移至其他分诊医生：
      reTriageComfirm(){
        let consultationId = [];
        let watingList = this.$store.state.watingList;
        let patientList = this.$store.state.patientList;
        if (this.$store.state.quitPatientList.length===0){
          this.reTriageShow = false;
          return false;
        }
        this.$store.state.quitPatientList.forEach((element, index) => {
          consultationId.push(element.consultationId);
        });
        releasePatient({
          customerId: this.$store.state.userId,
          consultationId: consultationId.join(",")
        }).then((res) => {

          this.$store.state.quitPatientList.forEach((element, index) => {
            patientList.removeByValue(element);
            watingList.unshift(element);
          });

          store.commit("setPatientList", patientList);
          store.commit("setWatingList", watingList);

          this.reTriageShow = false;

          this.$emit("update:n",false);
        })
      },

      //患者接诊
      getPatient(){
        let currentItem = this.$store.state.currentItem;
        let watingList = this.$store.state.watingList;
        let patientList = this.$store.state.patientList;
        triagePatient({
          consultationId: this.$store.state.consultationId,
          customerId: this.$store.state.userId
        }).then((res) => {

          this.$emit("update:watingTriage", false);

          watingList.removeByValue(currentItem);
          patientList.unshift(currentItem);

          store.commit("setPatientList", patientList);
          store.commit("setWatingList", watingList);
          store.commit("setInputReadOnly",false);
          this.$emit("update:userListStatus", {
            first: false,
            second: true,
            status: 2
          })
        }).catch((res) => {
          console.log("网络异常...")
        });
      }
    },
    mounted(){
      this.init();
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "./scss/base.scss";
  @import "./scss/modules/_bottomBtns.scss";
  @import "./scss/modules/_middleMessageBox.scss";
  @import "./scss/modules/_ImMedicalRecord.scss";
  @import "./scss/modules/_masker.scss";
  @import "./scss/modules/_checkSuggestion.scss";
  @import "./scss/modules/_configSuggestion.scss";

  .center-inner-message {
    float: left;
    width: 100%;
    height: 100%;
    & > .layout-helper {
      margin: 0 385px;
      position: relative;
      padding-top: 55px;
      height: 100%;
    }
  }

  .center-inner-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 56px;
    left: 2px;
    background-color: #fff;
    z-index: 3;
    text-align: center;
    display: none;

    &:before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      height: 100%;
    }
    & > img {
      width: 170px;
      height: 170px;
      vertical-align: middle;
    }
  }

  .no-content {
    .layout-helper {
      margin-right: 0;
    }
    .medical-record {
      display: none;
    }
    .center-inner-wrapper {
      display: block;
    }
  }

  .user-controller {

    .user-controller-get-triage {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
    }
    .modal-confirm {
      top: -150px;
      right: 25%;
      left: auto;
      @include query(1500px) {
        right: 35%;
      }
      &:after {
        position: absolute;
        bottom: -10px;
        right: 30%;
        top: auto;
        transform: rotate(180deg);
        @incldue query(1500px) {
          right: 25%;
        }
      }
    }
  }
</style>
