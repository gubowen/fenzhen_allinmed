<template id="oldSick">
  <section class="viewItem medical-record-form-item" data-role="mr-record-4">
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
          <button type="button" class="detail-saveBtn" @click="saveData()">保存</button>
        </footer>
      </section>
    </form>
    <popup v-if="popupShow" :obj.sync="popupObj" :payPopupShow.sync="popupShow"></popup>
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
        autosize(document.querySelectorAll('textarea'));
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
          if (this.sickHistory) {
            let content = {
              id: this.sickHistoryID,
              caseHistoryType: 0,
              caseHistoryDesc: this.sickHistory
            };
            dataList.push(content);
          }
          //手术史
          if (this.operationHistory) {
            let content = {
              id: this.operationHistoryID,
              caseHistoryType: 1,
              caseHistoryDesc: this.operationHistory
            };
            dataList.push(content);
          }
          //药物史
          if (this.medicineHistory) {
            let content = {
              id: this.medicineHistoryID,
              caseHistoryType: 2,
              caseHistoryDesc: this.medicineHistory
            };
            dataList.push(content);
          }
          //外伤史
          if (this.outSickHistory) {
            let content = {
              id: this.outSickHistoryID,
              caseHistoryType: 3,
              caseHistoryDesc: this.outSickHistory
            };
            dataList.push(content);
          }
          //过敏史
          if (this.allergyHistory) {
            let content = {
              id: this.allergyHistoryID,
              caseHistoryType: 4,
              caseHistoryDesc: this.allergyHistory
            };
            dataList.push(content);
          }
          //疫区接触史
          if (this.sickHistory) {
            let content = {
              id: this.plagueID,
              caseHistoryType: 5,
              caseHistoryDesc: this.plague
            };
            dataList.push(content);
          }
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
  @import "../../scss/index";

  .medical-record-main {
    width: 100%;
    padding: 25px 28px;
    box-sizing: border-box;
  }

  .medical-record-form {
    overflow: auto;
    height: 72%;
    box-sizing: border-box;
    &.on {
      padding-bottom: 340px;
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
      vertical-align: middle;
    }
    .select-100 {
      width: 250px;
    }
    textarea {
      background: #F9F9F9;
      border: 1px solid #E1E2E7;
      border-radius: 4px;
      width: 255px;

      padding: 5px;
      box-sizing: border-box;
      vertical-align: middle;
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
      text-align: center;
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
      .detail-saveBtn {
        margin-right: 35px;
      }

    }
  }

  .old-sick {
    .old-sick-history-list {
      margin-top: 30px;
      textarea {
        height: auto;
        padding: 5px;
      }
    }
  }

  .mt10 {
    margin-top: 10px;
  }

  .mt20 {
    margin-top: 20px;
  }
</style>
