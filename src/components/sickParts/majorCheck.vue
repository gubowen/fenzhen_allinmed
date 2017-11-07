<template>
  <section class="majorCheck viewItem medical-record-form-item" data-role="mr-record-6">
    <form action="">
      <section class="major-check medical-record-main">
        <article>
          <header><h2>检验及诊断结果</h2></header>
          <section class="img-check">
            <ul class="talkImgMore">
              <li v-show="caseAttUrl.length > 0" v-for="item in caseAttUrl">
                <section>
                  <img :src="item" @click="showBigImgFunction(1)"/>
                  <p>检查资料</p>
                </section>
              </li>
              <li class='noData' v-show="caseAttUrl.length == 0">患者未上传资料</li>
            </ul>
          </section>
        </article>
        <article>
          <header><h2>视诊</h2></header>
          <section class="video-check">
            <ul class="video-check-show">
              <li v-show="videoCaseAttUrl.length > 0" v-for="item in videoCaseAttUrl">
                <section>
                  <img :src="item" @click="showBigImgFunction(2)"/>
                  <p>患病处照片</p>
                </section>
              </li>
              <li v-show="videoList.length > 0" v-for="item in videoList">
                <section>
                  <img :src="item.caseAttUrl" @click="showVideoFunction(item)"/>
                  <p>动作视频</p>
                </section>
              </li>
              <li class='noData' v-show="videoCaseAttUrl.length == 0 && videoList == 0">患者未上传资料</li>
            </ul>
            <textarea type="text" placeholder="请填写" class="J-visualInspection" maxlength="1000" v-model="visualInspection" ref="inputLimitController"/>
          </section>
        </article>
        <article class="major-check-video">
          <header><h2>活动</h2></header>
          <section>
            <ul>
              <li>
                <textarea type="text" placeholder="请填写" class="J-activityState" maxlength="1000" v-model="activityState" ref="inputLimitController"/>
              </li>
            </ul>
          </section>
        </article>
        <article>
          <header><h2>肌力</h2></header>
          <section>
            <ul>
              <li>
                <textarea type="text" placeholder="请填写" class="J-muscleStrength" maxlength="1000" v-model="muscleStrength" ref="inputLimitController"/>
              </li>
            </ul>
          </section>
        </article>
        <footer>
          <button type="button" class="detail-saveBtn" @click="saveData">保存</button>
        </footer>
      </section>
    </form>
    <transition name="fade-scale">
      <popup v-if="popupShow" :obj.sync="popupObj" :payPopupShow.sync="popupShow"></popup>
    </transition>
  </section>
</template>
<script>
    import api from '@/common/js/util';
    import axios from "axios";
    import addressSelector from '@/common/addressSelector'
    import popup from  '@/common/popup';

    import autosize from "autosize";
    export default{
        name: 'majorCheck',
        data(){
            return {
                getDataUrl: "/call/customer/patient/case/attachment/getMapList/",
                sickDetailUrl: '/call/patient/case/hpi/v1/getMapById/',
                sickSaveUrl: '/call/patient/case/hpi/v1/save/',
                userMessage: {},
                caseAttUrl: [],
                videoCaseAttUrl: [],
                videoList:[],
                visualInspection:'',
                activityState:'',
                muscleStrength:'',
                popupShow:false,
                popupObj: {}
            }
        },
        watch: {
            '$store.state.currentItem'(){
                this.init();
            }
        },
        components:{
            popup
        },
//    activated(){
//      this.userMessage = this.$store.state.currentItem;
//      this.init();
//    },
        methods: {
            init() {
                this.userMessage = this.$store.state.currentItem;
                this.getData();

                console.log(this.$refs.inputLimitController)
                autosize(this.$refs.inputLimitController)
            },
            getData() {
                let _this = this;
                let dataValue = {
                    caseId: this.userMessage.caseId,	            //string	是	病例id
                    isValid: 1,                  //string	是	1
                    caseAttSpecPic: 1,	        //string	是	附件规格(1-原始文件、2-缩略图源文件、3-225*150、4-157*109、5-140*190、6-110*150、7-75*52、8-480*320、9-1280*720、10-900*600、12-300*200、13-450*300、14-750*500)
                    caseAttSpecVideoPic: 10,	//string	是	附件规格(1-原始文件、2-缩略图源文件、3-225*150、4-157*109、5-140*190、6-110*150、7-75*52、8-480*320、9-1280*720、10-900*600、12-300*200、13-450*300、14-750*500)
                    caseAttSpecVideo: 9,	    //string	是	附件规格(1-原始文件、2-缩略图源文件、3-225*150、4-157*109、5-140*190、6-110*150、7-75*52、8-480*320、9-1280*720、10-900*600、12-300*200、13-450*300、14-750*500)
                    firstResult: 0,	            //string	是
                    maxResult: 100,	            //string	是
                    attUseFlag: 6
                };
                api.ajax({         //获取基本信息
                    url: _this.getDataUrl,
                    method: "POST",
                    data: dataValue,
                    beforeSend(config) {

                    },
                    done(res) {
                        if (res.responseObject.responseData.data_list && res.responseObject.responseStatus == true) {
                            let data_list = res.responseObject.responseData.data_list;
                            //获取图片
                            let checkImageList = [];
                            let diagnoseList = [];
                            if (data_list[0].picMap.length) {
                                $.each(data_list[0].picMap, function (key, value) { //    1-X光片2-CT3-超声4-核磁共振5-病理6-检查结果7-其他8-曾就诊病历9-专科检查10-化验及特殊检查11-体格检查',
                                    switch (value.caseAttSource) {   //0-历史健康信息 1-视诊检查检验 2-初诊建议 3 检查检验 4患处照片,
                                        case "0":
                                        case "2":
                                        case "3":
                                        case "5":
                                            let arr=[];
                                            arr[0] =  value.caseAttUrl;
                                            _this.caseAttUrl =arr;
                                            checkImageList.push({"url": value.caseAttUrl});
                                            break;
                                        case "1":
                                        case "4":
                                        case "6":
                                            let arrs=[];
                                            arrs[0] = value.caseAttUrl;
                                            _this.videoCaseAttUrl= arrs;
                                            diagnoseList.push({"url": value.caseAttUrl});
                                            break;
                                    }
                                });

                                if(checkImageList.length > 0 && diagnoseList.length > 0){
                                    let allList ={};
                                    allList = _this.$store.state.SBIObject;
                                    allList['checkImage'] = checkImageList;
                                    allList['diagnoseListImage'] = diagnoseList;
                                    _this.$store.commit('setSBIObject',allList);
                                } else if (checkImageList.length > 0) {
                                    let allObject ={};
                                    allObject = _this.$store.state.SBIObject;
                                    allObject['checkImage'] = checkImageList;
                                    _this.$store.commit('setSBIObject',allObject);
                                } else if (diagnoseList.length > 0) {
                                    let allObject={};
                                    allObject = _this.$store.state.SBIObject;
                                    allObject['diagnoseListImage'] = diagnoseList;
                                    _this.$store.commit('setSBIObject', allObject);
                                }
                                console.log( _this.caseAttUrl);
                                console.log( _this.videoCaseAttUrl)
                            }
                            //获取视频
                            if (data_list[1].videoMap.length) {
                                  _this.videoList =[];
                                $.each(data_list[1].videoMap, function (key, value) {
                                    _this.videoList.push(value);
                                });

                            }
                        }
                    }, fail(error){
                        console.log("请求失败：" + error);
                    }
                });

                let nowSickDataValue = {
                    caseId: _this.$store.state.caseId
                };
                //现病史详情
                api.ajax({
                        url: _this.sickDetailUrl,
                        method: "POST",
                        data: nowSickDataValue,
                        beforeSend(config) {
                        },
                        done(res) {
                            if(res.responseObject.responseMessage != 'NO DATA'){
                                console.log(res);
                                _this.visualInspection = res.responseObject.responseData.dataList[0].visualInspection;
                                _this.activityState = res.responseObject.responseData.dataList[0].activityState;
                                _this.muscleStrength = res.responseObject.responseData.dataList[0].muscleStrength;
                                _this.$store.commit("setNewSickId",res.responseObject.responseData.dataList[0].id);
                            }
                        },
                        fail(error){
                          console.log("请求失败：" + error);
                        }
                })

            },
            saveData(){
                let _this = this;
                let id = '';
                console.log(_this.$store.state.newSickId);
                    id = _this.$store.state.newSickId ? _this.$store.state.newSickId :'';
               let dataValue = {
                    id:id,
                    visualInspection:_this.visualInspection,
                    activityState:_this.activityState,
                    muscleStrength:_this.muscleStrength,
                    patientId:_this.$store.state.patientId,
                    caseId:_this.$store.state.caseId
                };
                console.log(dataValue);
                api.ajax({                    //保存现病史信息
                        url: _this.sickSaveUrl,
                        method: "POST",
                        data: dataValue,
                        beforeSend(config) {
                        },
                        done(res) {
                            _this.getData();
                            _this.popupShow = true;
                            _this.popupObj = {
                                text: '保存成功'
                            };
                        },fail(error){
                        console.log("请求失败：" + error);
                    }
                });



            },
            showBigImgFunction(type){
                if (type == '1') {
                    this.$store.commit("setSBIFlag", true);
                    this.$store.commit("setSBIType", 'checkImage');
                    let index = this.$store.state.SBIObject.checkImage.length;
                    this.$store.commit("setSBIIndex",index);
                } else if (2) {
                    this.$store.commit("setSBIFlag", true);
                    this.$store.commit("setSBIType", 'diagnoseListImage');
                    let index = this.$store.state.SBIObject.diagnoseListImage.length;
                    this.$store.commit("setSBIIndex",index);
                }
            },
            showVideoFunction(item){
                this.$store.commit('setVideoObject',item.videoList[0].caseAttUrl);
                this.$store.commit('setVideoFlag',true);
            }
        },
        mounted(){
            this.init();
        }
    }
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
  @import "../../scss/library/_common-modules";
  @import "../../scss/record_common";

  .major-check {
    textarea {
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
        width:90px;
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
    footer{
      .detail-saveBtn {
        margin-right: 35px;
      }
    }
  }
</style>
