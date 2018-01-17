/**
* @name:初诊建议
* @desc:
* @example:
* @depend:
* @date: 2017/10/18
* @author: gubowen
*/
<template>
  <!--初诊建议-->
    <section class="main-masker config-suggestion check-suggestion disease-teach-detail on show" @click = 'closeSelect()'>
      <section class="check-suggestion-box" v-show="homePageShow">
        <i class="icon-close window-close" @click="closeWindow()"></i>
        <header class="check-suggestion-title" >
          <article>
            <h2>初诊建议</h2>
          </article>
          <!--<button class="jump-box-add-term icon-suggestion-preview"><span>预览</span></button>-->
        </header>
        <section class="check-suggestion-inner">
          <section class="check-suggestion-title">
            <h2>初步诊断：</h2>
          </section>
          <nav class="search-sortType">
            <down-select :dataListInfo.sync="partList" :dataBack.sync="partListResult" :iconFlag.sync="showIconFlag"    :conIndex="1" :currentIndexNow.sync="currentSelectorIndex"></down-select>
            <down-select :dataListInfo.sync="sickness" :dataBack.sync="sicknessResult" :iconFlag.sync="showIconFlag" :conIndex="2" :currentIndexNow.sync="currentSelectorIndex"></down-select>
            <down-select :dataListInfo.sync="progressList" :dataBack.sync="progressResult" :iconFlag.sync="showIconFlag" :conIndex="3" :currentIndexNow.sync="currentSelectorIndex"></down-select>
            <down-select  v-if='operationShowFlag' :dataListInfo.sync="operationList" :iconFlag.sync="showIconFlag" :dataBack.sync="operationListResult" :conIndex="4" :currentIndexNow.sync="currentSelectorIndex"></down-select>
            <section class="search-sortType-item" v-if="!operationShowFlag">
              <ul class="search-selector" >
                <input class="custom-selector-title firstListTitle" placeholder="手术建议" readonly>
                <i class="icon-downArrow"></i>
              </ul>
            </section>
          </nav>
          <section class="search-suggestion-footer">
            <button type="button" class="search-next" :class="{'disable':nextFlag}" @click="!nextFlag&&toNextPage()">下一步</button>
          </section>
        </section>
      </section>
      <diagnosiSecond v-if="nextPageShow" :maskerShow.sync="nextPageShow" :checkData="nextPageDate" @closeWindow="closeWindow" @goBackCheck="nextPageShow=false;homePageShow=true;"></diagnosiSecond>
    </section>
</template>
<script>
  import api from '../../common/js/util/util';
  import downSelect from  '../../common/downSelector.vue';
  import diagnosiSecond from './diagnosiSecond.vue';

  import store from "@/store/store";
  export default{
    name: 'check-suggestion',
    data(){
      return {
        majorData: "/call/comm/data/tag/v1/getMapList/", //专科接口
        partList: {
          dataList: '',
          placeholderText: '',
          disabledFlag:false
        },
        partListResult:{
            id:'',
            tagName:''
        },
        currentSelectorIndex: -1,
        nextPageShow:false,
        nextPageDate:{},
        homePageShow:true,

        sicknessUrl: "/call/comm/data/illness/v1/getMapList/",
        sickness:{
          dataList: '',
          placeholderText: '疾病',
          disabledFlag:false
        },
        sicknessResult:{},

        progressList:{
            dataList:[
              {
                progressValue:'0',
                progressName:'暂不需手术'
              },
              {
                progressValue:'1',
                progressName:'需手术'
              },
              {
                progressValue:'2',
                progressName:'急需手术'
              }
            ],
            placeholderText:'程度',
          disabledFlag:false
        },
        progressResult:{},

        operationUrl: "/call/cms/major/operation/relation/v1/getMapList/",
        operationList:{
          dataList: '',
          placeholderText: '',
          disabledFlag:true
        },
        operationListResult:{},


        parentId:'',
        operationName:'',
        nextFlag:false,
        operationShowFlag:true,
        showIconFlag:false
      }
    },
    props: {
    },
    watch:{
      partListResult:{
        handler(curVal,oldVal){
            //this.sickness.disabledFlag = false;
            if(this.sicknessResult.illnessName && this.sicknessResult.illnessName.length>0){
                //  this.progressList.disabledFlag = false;
                if(this.progressResult && this.progressResult.progressName=='暂不需手术'){
                    this.nextFlag = false;
                }
            }else{
//                if(this.operationListResult.operationId){
//                    this.nextFlag = false;
//                }else{
//                    this.nextFlag = true ;
//                }
          }
        }
      },
      sicknessResult:{
        handler(curVal,oldVal){
           //   this.progressList.disabledFlag = true;
            }
      },
      progressResult:{
        handler(curVal,oldVal){
          if(curVal.progressName == '暂不需手术'){
              this.nextFlag = false ;
              this.operationList.disabledFlag = true;
              this.operationShowFlag = false;
          }else{
              this.nextFlag =true;
              this.operationList.disabledFlag = false;
              this.operationShowFlag = true;
          }
        }
      },
      operationListResult:{
        handler(curVal,oldVal){
            this.nextFlag = false;
        }
      }
    },
    components: {
      downSelect,
      diagnosiSecond
    },
    methods: {
      init(){
        this.partSelect();
        this.sicknessSelect();
        this.operationData();
      },
      closeSelect(ev){
          this.currentSelectorIndex = -1;
          this.showIconFlag = false;
      },
      closeWindow(){
        this.nextPageShow = false;
        this.homePageShow = true;
        this.$store.commit("setCheckSuggestionFlag",false);
      },
      partSelect(){
        let _this = this;
        let dataValue = {
          isValid: 1,	                        //string	是		1
          firstResult: 0,	                    //string	是	分页参数
          maxResult: 999,	                    //string	是	分页参数
          treeLevel: "2"
        };
          store.commit("startLoading");
        api.ajax({
          url: _this.majorData,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res) {
           // console.log(res);
            _this.partList.dataList = res.responseObject.responseData.data_list;
            _this.partList.placeholderText = '专科';
              store.commit("stopLoading");
          },
          fail(error){
            console.log("请求失败：" + error);
              store.commit("stopLoading");
          }
        })

      },
      sicknessSelect() {
        let _this = this;
        let dataValue = {
          isValid: 1,	                //string	是		1
          firstResult: 0,	            //string	是	分页参数
          maxResult: 999,	            //string	是	分页参数
          illnessName: "",	        //string	否	疾病名称（搜索用）
          isSolr: 1
        };
          store.commit("startLoading");
        api.ajax({
          url: _this.sicknessUrl,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res) {
            // console.log(res);
            _this.sickness.dataList = res.responseObject.responseData.dataList;
            _this.sickness.placeholderText = '疾病';
              store.commit("stopLoading");
          },
          fail(error){
            console.log("请求失败：" + error);
              store.commit("stopLoading");
          }
        })
      },
      operationData(){
        let _this = this;
         // console.log(_this.partListResult);
          let dataValue = {
          isValid: 1,	                  //string	是		1
          firstResult: 0,	              //string	是	分页参数
          treeLevel: 1,
          maxResult: 999,	              //string	是	分页参数
          //majorId: _this.partListResult.id, //string	否	专业ID
          //operationName: _this.partListResult.tagName  //string	是	手术名称
        };
          store.commit("startLoading");
        api.ajax({
          url: _this.operationUrl,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res) {
              if(res.responseObject.responseData){
                _this.operationList.dataList = res.responseObject.responseData.dataList;
                _this.operationList.placeholderText = '手术建议';
              }
              store.commit("stopLoading");
          },
          fail(error){
            console.log("请求失败：" + error);
              store.commit("stopLoading");
          }
        })
      },
      toNextPage(){
        let _this = this ;
        _this.nextPageShow = true;
        _this.homePageShow = false;

        let degreeType='';
        if (_this.progressResult.progressName == "暂不需手术") {
            _this.operationListResult.operationId ='';
            _this.operationListResult.operationId ='';
          degreeType = 0;
        } else if (_this.progressResult.progressName== "需手术") {
          degreeType = 1;
        } else if (_this.progressResult.progressName == "急需手术") {
          degreeType = 2;
        }

        _this.nextPageDate = {
          customerId: _this.$store.state.userId,                                    //string	是	医生id
          caseId: _this.$store.state.caseId,                                        //	string	是	病例id
          patientId: _this.$store.state.patientId,	                                //	string	是	患者id
          diagnosisType: "1",	                                                    //	string	是	1-初诊
          majorId: _this.partListResult.id,                                         //	string	是	部位id
          majorName: _this.partListResult.tagName?_this.partListResult.tagName.indexOf("&") != -1?_this.partListResult.tagName.replace(/&/g, ","):_this.partListResult.tagName:'',	             //	string	是	部位名称
          illnessId: _this.sicknessResult.illnessId,	                             //	string	是	疾病id
          illnessName: _this.sicknessResult.illnessName,	                         //	string	是	疾病名称
          operationId: _this.operationListResult.operationId || "",	                 //	string	是	手术id
          operationName: _this.operationListResult.operationName || "",	            //	string	是	手术名称
          degreeType: degreeType,                                                   //  string	是	1-暂不确定，2-一级，3-二级，4-三级，5-四级，6-五级
          positionId: "",
          // positionName: $(".firstListTitle", "#direction-selector").val()
          positionName: ""
        };
//        console.log( _this.nextPageDate);
      }
    },
    mounted(){
      this.init();
    }
  }
</script>
<style lang="scss" scoped  rel="stylesheet/scss">
  @import "../../scss/base";

  .check-suggestion {

    .check-suggestion-inner {
      overflow: visible;
      height: 600px;
      .check-suggestion-title {
        background: none;
        color: #555;
        text-align: left;
        font-size: 15px;
        padding: 40px 40px 0 40px;
      }
    }
    .check-suggestion-title {

      padding: 20px 40px;
      background: #D9DFEC;
      text-align: center;
      color: #222;
      font-size: 18px;
    }
  }

  .main-masker.on {
    .check-suggestion-box {
      transform: translateY(-50%);
    }
  }

  .check-suggestion-box {
    height:600px;
    position: absolute;
    top: 50%;
    transform: translateY(-200%);
    left: 50%;
    width: 800px;
    margin-left: -400px;
    background-color: #fff;
    transition: all 0.3s ease-in-out;
    .window-close {
      position: absolute;
      right: -34px;
      cursor: pointer;
    }
  }

  .search-sortType {
    background-color: #fff;
    text-align: center;
    padding: 30px 0;
    display: inline-block;
    width: 100%;
    i {
      cursor: pointer;
    }

    &-item {
      display: inline-block;
      font-size: 14px;
      color: #AAAAAA;
      letter-spacing: 0;
      line-height: 14px;
      border: 1px solid #F9F9F9;
      border-radius: 4px;
      background: #F9F9F9;
      margin-right: 17px;
      width: 130px;
      height: 30px;
    }

    &-item:last-child {
      margin-right: 0;
    }

    &-item.long-item {
      width: 202px;
    }

    .search-selector {
      display: inline-block;
      cursor: pointer;
      height: 100%;
      width: 100%;
      position: relative;
      border-radius: 4px;
      border: 1px solid #e1e2e7;
      text-align: left;

      & > h3 {
        font-weight: normal;
        font-size: 14px;
        color: #AAAAAA;
        display: inline-block;
        line-height: 14px;
        height: 100%;
        width: 100%;
        padding: 8px 10px;
        box-sizing: border-box;
        text-align: left;
      }
      & > input {
        font-weight: normal;
        font-size: 14px;
        color: #222222;
        display: inline-block;
        line-height: 14px;
        height: 100%;
        width: 90%;
        padding: 8px 10px;
        box-sizing: border-box;
        text-align: left;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        //   border-radius: 4px;
        //   border: 1px solid #E1E2E7;
      }

      & > input.disable {
        border: 1px solid #F9F9F9;
      }

      //& > input:focus{
      //  border: 1px solid #E1E2E7;
      //}

      & > .icon-downArrow {
        position: absolute;
        top: 10px;
        right: 0;
      }
      & > .icon-upArrow {
        position: absolute;
        top: 5px;
        right: 0;
      }

      .time-title {
        font-size: 14px;
        font-weight: normal;
        margin-top: 15px;
      }

      .search-selector-second-box {
        position: absolute;
        z-index: 5;
        text-align: left;
        font-size: 0;
        width: 700px;
        margin-left: 0;
        margin-top: 10px;

      }

      .custom-selector-second {
        display: inline-block;
        min-width: 130px;
        width: auto;
        font-size: 14px;
        color: #222222;
        letter-spacing: 0;
        line-height: 14px;
        vertical-align: top;
        text-align: left;
        box-sizing: border-box;
        padding: 0;
        max-height: 336px;
        overflow: auto;
        border-radius: 5px;
        box-shadow: 0 0 15px #666;
        background-color: #fff;

        &.custom-selector-second-list {
          right: -100%;
        }
        & > .search-icon-rightArrow {
          position: relative;
          &:before {
            content: "";
            display: block;
            width: 10px;
            height: 10px;
            position: absolute;
            right: 9px;
            top: 13px;
            background: url("/static/image/img00/common/arrow_enter.png") no-repeat;
          }

        }

        & > .custom-selector-item {
          padding: 10px 18px;
          box-sizing: border-box;
          width: 100%;
          margin: 0;
          & > span {
            display: block;
          }

          &.active {
            background: #F6F9FA;
          }
          &.active > span {
            color: #2899e6;
          }
        }
      }

    }

    #sick-selector {
      .custom-selector-second {

        width: 202px;
      }
      .no-data {
        padding-top: 24px;
        padding-bottom: 24px;
        text-align: center;
        color: #bbb;

      }
    }
  }

  .search-suggestion-footer {
    position: absolute;
    bottom: 0;
    right: 0;
    display: block;
    width: 100%;
    box-sizing: border-box;

    text-align: right;
    padding: 40px 40px 30px 40px;
    .search-next.disable {
      background: #CCCCCC;
    }
    .search-next {
      background: #7A8EC1;
      border-radius: 4px;
      width: 70px;
      height: 30px;
      font-size: 13px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
