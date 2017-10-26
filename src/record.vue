<template id="record">
  <aside class="medical-record" v-if="showFlag" >
    <button class="btn-primary user-controller-get-triage" v-if="watingTriage" @click="getPatient">接诊</button>
    <header class="medical-record-title-text" v-show="!$store.state.inputReadOnly">
      <h2>病历编辑</h2>
    </header>
    <section class="medical-record-content" v-show="!$store.state.inputReadOnly">
      <header class="medical-record-title">
        <figure class="medical-record-img" @click="showCheckHistory()">
          <!--<img src="http://img.jfdown.com/jfdown/201409/rw4fi0eoppn.jpg" alt="">-->
          <img :src="logoUrl" alt="">
        </figure>
        <figcaption class="medical-record-userdata">
          <h3>
            <span class="name">{{name}}</span>
            <p><i class="icon-sex-female J-sex">{{sex==2?'女':'男'}}</i><span class="age">{{age}}岁</span></p>
          </h3>
          <article class="medical-record-userdata-item">
            <!--<span class="status">新患者</span>-->
            <span class="category"></span>
          </article>
        </figcaption>
      </header>
      <section class="medical-record-detail">
        <header class="tabsInner medical-record-tabs">
          <router-link :to="{name:'baseInfo',params:{num:userMessage}}" tag="figure"
                       class="tabsItem medical-record-tabs-item baseInfo">基本信息
          </router-link>
          <router-link :to="{name:'mainSpeak',params:{num:userMessage}}" tag="figure"
                       class="tabsItem medical-record-tabs-item mainSpeak">主诉
          </router-link>
          <router-link :to="{name:'nowSick',params:{num:userMessage}}" tag="figure"
                       class="tabsItem medical-record-tabs-item nowSick">现病史
          </router-link>
          <router-link :to="{name:'oldSick',params:{num:userMessage}}" tag="figure"
                       class="tabsItem medical-record-tabs-item oldSick">既往史
          </router-link>
          <router-link :to="{name:'checkBody',params:{num:userMessage}}" tag="figure"
                       class="tabsItem medical-record-tabs-item checkBody">体格检查
          </router-link>
          <router-link :to="{name:'majorCheck',params:{num:userMessage}}" tag="figure"
                       class="tabsItem medical-record-tabs-item majorCheck">专科检查
          </router-link>
        </header>
        <section class="viewInner medical-record-form">
          <transition name="slide-fade">
            <router-view :recordData="recordData"></router-view>
          </transition>
        </section>
        <remarkRecord></remarkRecord>
      </section>
    </section>
  </aside>
</template>
<script type="text/javascript">
  import remarkRecord from "./components/triageRecord";
  import triagePatient from "@/base/triagePatient";
  import store from "@/store/store";
  export default{
    name: 'record',
    props: {
      recordData: {
        type: Object
      },
      watingTriage: {
        type: Boolean
      },
      userListStatus: {
        type: Object
      }
    },
    data(){
      return {
        userMessage: '',
        showFlag: false,
        name: '',
        logoUrl: '',
        checkHistoryFlag: false
      }
    },
    methods: {
      init(){
//        alert(5)
//        this.userMessage = this.$route.params.num;
        this.userMessage=JSON.stringify(this.$store.state.currentItem);
        this.name = JSON.parse(this.userMessage).patientName;
        this.age = JSON.parse(this.userMessage).patientAge;
        this.sex = JSON.parse(this.userMessage).patientSex;
        this.logoUrl = JSON.parse(this.userMessage).logoUrl;
        this.showFlag = true;
      },
//      activated(){
//        this.init();
//
//      },
      showCheckHistory(){
        this.$store.state.checkHistoryFlag = !this.$store.state.checkHistoryFlag;
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
          store.commit("setInputReadOnly", false);
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
    watch: {
      '$route.params.num': function () {

      },
      '$store.state.currentItem'(){
        this.init();
      }
    },
    components:{
      remarkRecord
    },
    mounted(){
      this.init();
    }
  }
</script>
<style lang="scss" scoped="" rel="stylesheet/scss">
  @import "./scss/base.scss";
  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slider-fade-enter, .slide-fade-leave-active {
    transform: translateX(-430px);
    opacity: 0;
  }

  .medical-record {
    background-color: #fff;
    width: 385px;
    height: 100%;
    float: right;
    position: relative;
    margin-left: -385px;
      .user-controller-get-triage{
        position: absolute;
        top: 50%;
        left: 50%;
        transform:translate(-50%,-50%);
        @include circle(100px,#7a8ec1);
        font-size:16px;
        box-shadow: -2px -2px 2px #000,5px 5px 5px #7a8ec1;
      }
    .medical-record-title-text {
      height: 56px;
      width: 100%;
      box-sizing: border-box;
      padding-left: 20px;
      line-height: 56px;
      & > h2 {
        font-weight: normal;
        font-size: 16px;
        color: #555555;
        height: 100%;
        width: 100%;
        line-height: 56px;
      }
    }

    .medical-record-content {
      .medical-record-title {
        font-size: 0;
        padding: 18px 30px 0;
        box-sizing: border-box;
        .medical-record-img {
          display: inline-block;
          vertical-align: middle;
          margin-right: 12px;
          cursor: pointer;
          & > img {
            width: 70px;
            height: 70px;
            vertical-align: top;
          }
        }
        .medical-record-userdata {
          display: inline-block;
          vertical-align: middle;
          & > h3 {
            color: #222;
            font-size: 16px;
            font-weight: normal;
            .name {
              font-size: 20px;
              color: #222222;
              vertical-align: middle;
              letter-spacing: 0;
              line-height: 20px;
              max-width: 150px;
              display: inline-block;
            }
            & > p {
              display: inline-block;
              vertical-align: bottom;

              .age {
                font-size: 16px;
                color: #222222;
                letter-spacing: 0;
                line-height: 16px;
                vertical-align: bottom;
                margin-left: 12px;
              }
            }

          }
          .medical-record-userdata-item {
            color: #222;
            font-size: 12px;
            margin-top: 16px;
            .status {
              font-size: 15px;
              color: #6B748C;
              letter-spacing: 0;
              line-height: 15px;
              margin-right: 10px;
            }
            .category {
              font-size: 15px;
              color: #6B748C;
              letter-spacing: 0;
              line-height: 15px;

            }
          }
        }
      }
      .medical-record-detail {
        margin-top: 30px;
        .tabsInner.medical-record-tabs {
          text-align: center;
          border-bottom: 1px solid #E1E2E7;
          font-size: 0;
          margin: 0 14px;
          box-sizing: border-box;
          & > .tabsItem {
            display: inline-block;
            font-size: 15px;
            color: #808080;
            padding: 0 2px;
            margin: 0 2.5px;
            cursor: pointer;
            box-sizing: border-box;
            padding-bottom: 10px;
            &.active {
              border-bottom: 4px solid #7a8ec1;
              color: #323D5E;
            }
          }
        }
      }
    }
  }

  .medical-record-form {
    overflow: auto;
    height: 630px;
    &.on {
      height: 320px;
    }
    .main-speak {
      .operation-name {
        margin-top: 100px;
      }

      header {
        text-align: center;
        margin-bottom: 30px;
        position: relative;
      }

      .sick-img-one {
        display: inline-block;
        position: relative;

      }

      .sick-img {
        width: 150px;
        height: auto;
      }
      .sick-dot {
        width: 25px;
        height: 25px;
        position: absolute;
        background: url("./assets/img00/employee/dot.png") no-repeat;
        background-size: 100% 100%;
      }

      .sick-info {
        font-size: 14px;
        color: #808080;
        letter-spacing: 0;
        line-height: 1.5;
      }
      .J-consult {
        //display: none;
      }

      .J-order-operation {
        //display: none;
      }
      .sick-title {
        width: 78px;
        font-size: 13px;
        color: #555555;
        letter-spacing: 0;
        line-height: 14px;
        margin-right: 15px;
        text-align: right;
        display: inline-block;
      }
      li {
        margin-top: 24px;
      }

    }
    // max-height: 400px;
    .J-order-operation {
      //display: none;
    }
    input[type="text"] {
      background: #F9F9F9;
      border: 1px solid #E1E2E7;
      border-radius: 4px;
      padding: 5px 5px;
      font-size: 14px;
      line-height: 14px;
      height: 18px;
      width: 240px;
    }

    footer {
      text-align: right;
      margin-top: 24px;
      .detail-saveBtn {
        background: #7A8EC1;
        border-radius: 4px;
        width: 70px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #fff;
        text-align: center;
        cursor: pointer;
        margin-right: 10px;
      }
    }
    .medical-title {
      width: 52px;
      font-size: 13px;
      color: #555;
      letter-spacing: 0;
      line-height: 14px;
      margin-right: 8px;
      text-align: right;
      display: inline-block;
      white-space: nowrap;
    }
    .medical-text {
      font-size: 14px;
      color: #808080;
      letter-spacing: 0;
      line-height: 14px;
      margin-right: 15px;

    }
    .medical-text-long {
      //margin-left: -28px;

      width: 80px;
    }
    select {
      background: #F9F9F9;
      border: 1px solid #E1E2E7;
      border-radius: 4px;
      padding: 5px 0 5px 0;
      font-size: 14px;
      line-height: 14px;
      min-width: 80px;
      width: 84px;
    }
    .select-100 {
      width: 250px;
    }
    textarea {
      background: #F9F9F9;
      border: 1px solid #E1E2E7;
      border-radius: 4px;
      width: 255px;
      height: 150px;
      vertical-align: top;
      padding: 10px;
      box-sizing: border-box;
    }
    li {
      margin-top: 25px;
    }
    li:first-child {
      margin-top: 15px;
    }
    .body-check {
      .input-95 {
        width: 72px;
      }
    }
    .major-check {
      input[type="text"] {
        margin: 0 auto;
        display: block;
      }
      header {
        position: relative;
        margin-bottom: 30px;
        margin-top: 50px;
        text-align: center;
        &:before {
          content: "";
          position: absolute;
          top: 50%;
          width: 216px;
          left: 50%;
          margin-left: -108px;
          border: 1px solid #E1E2E7;
        }
        h2 {
          font-size: 12px;
          color: #AAAAAA;
          letter-spacing: 0;
          line-height: 12px;
          margin: 0 auto;
          padding: 0 10px;
          background: #fff;
          text-align: center;
          position: relative;
          z-index: 2;
          display: inline-block;
        }
      }
      .img-check {
        ul {
          li {
            margin: 0 0 30px 0;
            width: 104px;
            height: 107px;
            float: left;
            text-align: center;
            &.noData {
              width: 100%;
              height: 20px;
              float: none;
              color: #aaa;
              font-size: 13px;
            }
            img {
              width: 80px;
              height: 80px;
              border-radius: 4px;
              cursor: pointer;
            }
            p {
              margin-top: 12px;
              font-size: 13px;
              color: #555555;
              letter-spacing: 0;
              line-height: 13px;

            }
          }
        }
        ul:after {
          content: "";
          display: block;
          clear: both;
          visibility: hidden;
        }
      }
      .video-check {
        ul {
          li {
            margin: 0 0 30px 0;
            height: 107px;
            float: left;
            text-align: center;
            margin-right: 30px;
            &.noData {
              width: 100%;
              height: 20px;
              float: none;
              margin-right: 0;
              font-size: 13px;
              line-height: 20px;
              color: #aaa;
            }

            img {
              width: auto;
              height: 80px;
              border-radius: 4px;
            }
            p {
              margin-top: 12px;
              font-size: 13px;
              color: #555555;
              letter-spacing: 0;
              line-height: 13px;
            }
          }
          &:first-child {
            margin-left: 12px;
          }
        }
        ul:after {
          content: "";
          display: block;
          clear: both;
          visibility: hidden;
        }
      }
      .detail-saveBtn {
        margin-right: 35px;
      }

    }
  }

</style>
