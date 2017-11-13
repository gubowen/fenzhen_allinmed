<template>
  <section class="oldSick viewItem medical-record-form-item" data-role="mr-record-4">
    <form action="">
      <section class="old-sick medical-record-main">
        <article class="old-sick-out" v-html=" oldSickOut"></article>
        <article>
          <section>
            <ul class="old-sick-history-list">
              <li><span class="medical-title">疾病史</span><textarea :data-type="0" placeholder="请填写" maxlength="200" class="J-textArea" rows="1" v-model="sickHistory"></textarea>
              </li>
              <li><span class="medical-title">药物史</span><textarea :data-type="1" placeholder="请填写" maxlength="200" class="J-textArea" rows="1" v-model="medicineHistory"></textarea>
              </li>
              <li><span class="medical-title">手术史</span><textarea :data-type="2" placeholder="请填写" maxlength="200" class="J-textArea" rows="1"
                                                                  v-model="operationHistory"></textarea></li>
              <li><span class="medical-title">外伤史</span><textarea :data-type="3" placeholder="请填写" maxlength="200" class="J-textArea" rows="1" v-model="outSickHistory"></textarea>
              </li>
              <li><span class="medical-title">过敏史</span><textarea :data-type="4" placeholder="请填写" maxlength="200" class="J-textArea" rows="1" v-model="allergyHistory"></textarea>
              </li>
              <li><span class="medical-title medical-text-long" style="margin-left:-28px;">疫区接触史</span><textarea data-type="5" placeholder="请填写" maxlength="200" class="J-textArea"
                                                                                                                 rows="1" v-model="plague"></textarea></li>
            </ul>
          </section>
        </article>
        <footer>
          <button type="button" class="detail-saveBtn" @click="saveData()" v-show="$store.state.currentItem.consultationState == 0">保存</button>
        </footer>
      </section>
    </form>
    <transition name="fade-scale">
      <popup v-if="popupShow" :obj.sync="popupObj" :payPopupShow.sync="popupShow"></popup>
    </transition>
  </section>
</template>
<script>
  import  autosize  from  "autosize";
  import {common, modules} from "../../../js/common";
  import api from '@/common/js/util';
  import popup from  '@/common/popup';

  export default{
    name: 'oldSick',
    data(){
      return {
        getUrl: '/call/customer/patient/case/history/getMapList/',
        saveUrl: '/call/customer/patient/case/history/saveOrUpdate/',
        oldSickOut: '',
        responsePK: '',
        userMessage: {},
        id: '',
        sickHistory: '',
        sickHistoryID: '',
        medicineHistory: '',
        medicineHistoryID: '',
        operationHistory: '',
        operationHistoryID: '',
        outSickHistory: '',
        outSickHistoryID: '',
        allergyHistory: '',
        allergyHistoryID: '',
        plague: '',
        plagueID: '',
        popupShow:false,
        popupObj: {}
      }
    },
      components:{
          popup
      },
    watch: {
      '$store.state.currentItem'(){
        this.init();
      }

    },
    activated(){
      this.userMessage = this.$store.state.currentItem;
      this.init();
    },
    methods: {
      init: function () {
        this.userMessage = JSON.parse(this.$route.params.num);
        this.getData();
        //textare自适应高度
        autosize(document.querySelectorAll('.J-textArea'));

      },
      getData: function () {

        let _this = this;

        let dataValue = {
          patientId: this.userMessage.patientId,
          caseId: this.userMessage.caseId,
          firstResult: 0,
          maxResult: 100
        };

        api.ajax({         //获取基本信息
          url: _this.getUrl,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res) {
            if (res.responseObject.responseData.dataList && res.responseObject.responseStatus == true) {
              let dataList = res.responseObject.responseData.dataList;
              for (let i = 0; i < dataList.length; i++) {
                if (dataList[i].operatorType == 1) {
                  switch (dataList[i].caseHistoryType) {
                    case "0" :    //疾病史
                      _this.sickHistory = dataList[i].caseHistoryDesc;
                      _this.sickHistoryID = dataList[i].id;
                      break;
                    case "1" :  //手术史
                      _this.operationHistory = dataList[i].caseHistoryDesc;
                      _this.operationHistoryID = dataList[i].id;
                      break;
                    case "2": //药物史
                      _this.medicineHistory = dataList[i].caseHistoryDesc;
                      _this.medicineHistoryID = dataList[i].id;
                      break;
                    case "3": //外伤史
                      _this.outSickHistory = dataList[i].caseHistoryDesc;
                      _this.outSickHistoryID = dataList[i].id;
                      break;
                    case "4": //过敏史
                      _this.allergyHistory = dataList[i].caseHistoryDesc;
                      _this.allergyHistoryID = dataList[i].id;
                      break;
                    case "5":
                      _this.plague = dataList[i].caseHistoryDesc;
                      _this.plagueID = dataList[i].id;
                      break;
                    default :
                  }
                    setTimeout(()=>{
                        autosize.update(document.querySelectorAll('.J-textArea'));
                    },200);
                }
              }
            } else {
              console.log("无数据!");
            }
          },
          fail(error){
            console.log("请求失败" + error);
          }
        });
      },
      saveData: function () {
          let _this = this;
     //   if (this.sickHistory || this.operationHistory || this.medicineHistory || this.outSickHistory || this.allergyHistory || this.plague) {
          let dataList = [];
          //疾病史
        //  if (this.sickHistory) {
            let contentHistory = {
              id: this.sickHistoryID,
              caseHistoryType: 0,
              caseHistoryDesc: this.sickHistory
            };
            dataList.push(contentHistory);
      //    }
          //手术史
      //    if (this.operationHistory) {
            let contentOperation = {
              id: this.operationHistoryID,
              caseHistoryType: 1,
              caseHistoryDesc: this.operationHistory
            };
            dataList.push(contentOperation);
     //     }
          //药物史
      //    if (this.medicineHistory) {
            let contentMedicine = {
              id: this.medicineHistoryID,
              caseHistoryType: 2,
              caseHistoryDesc: this.medicineHistory
            };
            dataList.push(contentMedicine);
       //   }
          //外伤史
       //   if (this.outSickHistory) {
            let contentOut = {
              id: this.outSickHistoryID,
              caseHistoryType: 3,
              caseHistoryDesc: this.outSickHistory
            };
            dataList.push(contentOut);
        //  }
          //过敏史
        //  if (this.allergyHistory) {
            let contentGM = {
              id: this.allergyHistoryID,
              caseHistoryType: 4,
              caseHistoryDesc: this.allergyHistory
            };
            dataList.push(contentGM);
       //   }
          //疫区接触史
       //   if (this.sickHistory) {
            let contentArea = {
              id: this.plagueID,
              caseHistoryType: 5,
              caseHistoryDesc: this.plague
            };
            dataList.push(contentArea);
      //    }
          dataList = JSON.stringify(dataList).toString();
          let dataValue = {
            patientId: this.userMessage.patientId,           //	string	是	患者id
            caseId: this.userMessage.caseId,                 //	string	是	病例id
            operatorId: this.$store.state.userId,      //	string	是	操作人
            operatorType: 1,                                 //	string	是	操作人类型0-患者1-医生
            caseHistoryList: dataList                        //	string	是	既往史idList
          };
          api.ajax({         //获取基本信息
            url: _this.saveUrl,
            method: "POST",
            data: dataValue,
            beforeSend(config) {
            },
            done(res){
              if (res.responseObject.responseStatus) {
                  _this.popupShow = true;
                  _this.popupObj = {
                      text: '保存成功'
                  };
                  _this.getData();
              } else {
                  _this.popupShow = true;
                  _this.popupObj = {
                      text: '保存失败'
                  };
              }
            }, fail(error){
              console.log("请求失败" + error);
            }
          });

//        } else {
//            _this.popupShow = true;
//            _this.popupObj = {
//                text: '只少输入一项病史'
//            };
//          //common.popupRight({text: "只少输入一项病史"});
//        }

      }
    },
    mounted()
    {
      this.init();

    }
  }

</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
  @import "../../scss/library/_common-modules";
  @import "../../scss/record_common";

  .old-sick {
    .old-sick-history-list {
      margin-top: 30px;
      li{
        .medical-title{

        }
        textarea {
          height: auto;
          padding: 5px;
          vertical-align: middle;
        }
      }

    }
  }
</style>
