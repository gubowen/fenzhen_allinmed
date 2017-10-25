<template>
  <section class="viewItem medical-record-form-item" id="nowSick">
    <form action="">
      <section class="main-sick medical-record-main">
        <input type="hidden" class="J-mainSickId" value=""/>
        <article class="main-sick-describe">
          <section class="mt20" v-show="treatmentName != ''">
            <span class="main-title">曾就诊情况：</span><span class="main-text J-caseMain">{{treatmentName+'&nbsp;'+illnessName}}</span>
          </section>
          <section class="mt20" v-show="takeMedicine != ''">
            <span class="main-title">服用药物：</span><span class="main-text J-caseAlong">{{takeMedicine}}</span>
          </section>
        </article>
        <article class="main-sick-product">
          <header><h2>症状产生</h2></header>
          <section>
            <ul>
              <li><span class="main-title">产生诱因</span><input class="main-sick-input J-produceReason" type="text"
                                                             placeholder="请填写" maxlength="50" v-model="produceReason"/>
              </li>
              <li>
                <span class="main-title">症状</span><select class="select-100 J-produceSymptomsId" v-model="produceSymptomsId">
                <option value="0">请选择</option>
                <option value="1">疼痛</option>
                <option value="2">肿胀</option>
                <option value="3">麻木</option>
                <option value="4">僵硬</option>
                <option value="5">无力</option>
                <option value="6">抽筋</option>
                <option value="7">发热</option>
                <option value="8">关节活动受限</option>
                <option value="9">变形</option>
                <option value="10">其他</option>
              </select>
              </li>
              <li>
                <span class="main-title">程度</span><select class="select-100 J-produceLevelId" v-model="produceLevelId">
                <option value="0">请选择</option>
                <option value="1">无</option>
                <option value="2">轻度影响</option>
                <option value="3">可以照常生活或工作</option>
                <option value="4">中度影响</option>
                <option value="5">需要减轻工作或生活劳动</option>
                <option value="6">重度影响</option>
                <option value="7">完全不能正常生活和工作</option>
              </select>
              </li>
              <li><span class="main-title">何时加重</span><select class="J-produceSharpenId" v-model="produceSharpenId">
                <option value="0">请选择</option>
                <option value="1">无</option>
                <option value="2">睡在受影响的一侧</option>
                <option value="3">打字</option>
                <option value="4">阅读</option>
                <option value="5">工作</option>
                <option value="6">弯曲时</option>
                <option value="7">活动</option>
                <option value="8">负重</option>
                <option value="9">提起重物</option>
                <option value="10">弯腰</option>
                <option value="11">骑行</option>
                <option value="12">驾驶</option>
                <option value="13">爬楼梯</option>
                <option value="14">咳嗽</option>
                <option value="15">慢跑</option>
                <option value="16">跪下</option>
                <option value="17">举起</option>
                <option value="18">抬起</option>
                <option value="19">举过头的动作</option>
                <option value="20">伸直腿</option>
                <option value="21">抬高</option>
                <option value="22">躺下</option>
                <option value="23">跑</option>
                <option value="24">坐着</option>
                <option value="25">久坐</option>
                <option value="26">睡觉</option>
                <option value="27">站立</option>
                <option value="28">久站</option>
                <option value="29">受压</option>
                <option value="30">拉伸</option>
                <option value="31">打喷嚏</option>
                <option value="32">下蹲</option>
                <option value="33">扭转</option>
                <option value="34">走路</option>
                <option value="35">天气</option>
                <option value="36">喝酒</option>
                <option value="37">吃海鲜</option>
              </select><span class="main-title ml20">何时缓解</span><select class="J-produceRemitId" v-model="produceRemitId">
                <option value="0">请选择</option>
                <option value="1">冰敷</option>
                <option value="2">热敷</option>
                <option value="3">服用镇痛药</option>
                <option value="4">没法缓解</option>
                <option value="5">抬高</option>
                <option value="6">躺下</option>
                <option value="7">按摩</option>
                <option value="8">放松</option>
                <option value="9">保持静止</option>
                <option value="10">休息</option>
                <option value="11">坐下</option>
                <option value="12">睡眠</option>
                <option value="13">站立</option>
                <option value="14">拉伸</option>
                <option value="15">行走</option>
              </select></li>
              <li><span class="main-title">治疗情况</span><select class="select-120 J-produceTreatment" v-model="produceTreatment">
                <option value="0">请选择</option>
                <option value="1">没治疗过</option>
                <option value="2">针灸</option>
                <option value="3">理疗</option>
                <option value="4">外敷膏药</option>
                <option value="5">内服药物</option>
                <option value="6">打针</option>
                <option value="7">手术</option>
                <option value="8">其他</option>
              </select><select class="select-120 ml15 J-produceTreatment-2" v-model="produceTreatment2">
                <option value="0">请选择</option>
                <option value="1">没有效果</option>
                <option value="2">有轻微好转</option>
                <option value="3">有明显好转</option>
              </select>
              </li>
            </ul>
          </section>
        </article>
        <article class="main-sick-aggravate">
          <header><h2>主要症状加重</h2></header>
          <section>
            <ul>
              <li><span class="main-title">加重诱因</span><input class="main-sick-input J-aggravateReason" type="text" placeholder="请填写" maxlength="50" v-model="aggravateReason"/></li>
              <li><span class="main-title">症状</span><select class="J-aggravateSymptomsId" v-model="aggravateSymptomsId">
                <option value="0">请选择</option>
                <option value="1">疼痛</option>
                <option value="2">肿胀</option>
                <option value="3">麻木</option>
                <option value="4">僵硬</option>
                <option value="5">无力</option>
                <option value="6">抽筋</option>
                <option value="7">发热</option>
                <option value="8">关节活动受限</option>
                <option value="9">变形</option>
                <option value="10">其他</option>
              </select><span class="main-title ml20">程度</span><select class="J-aggravateLevelId" v-model="aggravateLevelId">
                <option value="0">请选择</option>
                <option value="1">轻度影响</option>
                <option value="2">可以照常生活或工作</option>
                <option value="3">中度影响</option>
                <option value="4">需要减轻工作或生活劳动</option>
                <option value="5">重度影响</option>
                <option value="6">完全不能正常生活和工作</option>
              </select></li>
              <li><span class="main-title">何时加重</span><select class="J-aggravateSharpenId" v-model="aggravateSharpenId">
                <option value="0">请选择</option>
                <option value="1">无</option>
                <option value="2">睡在受影响的一侧</option>
                <option value="3">打字</option>
                <option value="4">阅读</option>
                <option value="5">工作</option>
                <option value="6">弯曲时</option>
                <option value="7">活动</option>
                <option value="8">负重</option>
                <option value="9">提起重物</option>
                <option value="10">弯腰</option>
                <option value="11">骑行</option>
                <option value="12">驾驶</option>
                <option value="13">爬楼梯</option>
                <option value="14">咳嗽</option>
                <option value="15">慢跑</option>
                <option value="16">跪下</option>
                <option value="17">举起</option>
                <option value="18">抬起</option>
                <option value="19">举过头的动作</option>
                <option value="20">伸直腿</option>
                <option value="21">抬高</option>
                <option value="22">躺下</option>
                <option value="23">跑</option>
                <option value="24">坐着</option>
                <option value="25">久坐</option>
                <option value="26">睡觉</option>
                <option value="27">站立</option>
                <option value="28">久站</option>
                <option value="29">受压</option>
                <option value="30">拉伸</option>
                <option value="31">打喷嚏</option>
                <option value="32">下蹲</option>
                <option value="33">扭转</option>
                <option value="34">走路</option>
                <option value="35">天气</option>
                <option value="36">喝酒</option>
                <option value="37">吃海鲜</option>
              </select><span class="main-title ml20">何时缓解</span><select class="J-aggravateRemitId" v-model="aggravateRemitId">
                <option value="0">请选择</option>
                <option value="1">冰敷</option>
                <option value="2">热敷</option>
                <option value="3">服用镇痛药</option>
                <option value="4">没法缓解</option>
                <option value="5">抬高</option>
                <option value="6">躺下</option>
                <option value="7">按摩</option>
                <option value="8">放松</option>
                <option value="9">保持静止</option>
                <option value="10">休息</option>
                <option value="11">坐下</option>
                <option value="12">睡眠</option>
                <option value="13">站立</option>
                <option value="14">拉伸</option>
                <option value="15">行走</option>
              </select></li>
              <li><span class="main-title">治疗情况</span><select class="select-120 J-aggravateTreatment" v-model="aggravateTreatment">
                <option value="0">请选择</option>
                <option value="1">没治疗过</option>
                <option value="2">针灸</option>
                <option value="3">理疗</option>
                <option value="4">外敷膏药</option>
                <option value="5">内服药物</option>
                <option value="6">打针</option>
                <option value="7">手术</option>
                <option value="8">其他</option>
              </select><select class="select-120 ml15 J-aggravateTreatment-2" v-model="aggravateTreatment2">
                <option value="0">请选择</option>
                <option value="1">没有效果</option>
                <option value="2">有轻微好转</option>
                <option value="3">有明显好转</option>
              </select>
              </li>
            </ul>
          </section>
        </article>
        <article>
          <header><h2>其他信息</h2></header>
          <section>
            <ul>
              <li><span class="main-title">睡眠状况</span><select class="J-sleepId" v-model="sleepId">
                <option value="0">请选择</option>
                <option value="1">良好</option>
                <option value="2">一般</option>
                <option value="3">较差</option>
              </select><span class="main-title ml20">精神状态</span><select class="J-spiritId" v-model="spiritId">
                <option value="0">请选择</option>
                <option value="1">良好</option>
                <option value="2">一般</option>
                <option value="3">较差</option>
              </select></li>
              <li><span class="main-title">食欲状况</span><select class="J-appetiteId" v-model="appetiteId">
                <option value="0">请选择</option>
                <option value="1">良好</option>
                <option value="2">一般</option>
                <option value="3">较差</option>
              </select><span class="main-title ml20">体重状况</span><select class="J-weightId" v-model="weightId">
                <option value="0">请选择</option>
                <option value="1">无明显变化</option>
                <option value="2">明显消瘦</option>
                <option value="3">明显长胖</option>
              </select></li>
              <li><span class="main-title">排泄状况</span><select class="J-excretionId" v-model="excretionId">
                <option value="0">请选择</option>
                <option value="1">正常</option>
                <option value="2">异常</option>
                <option value="3">失禁</option>
              </select></li>
            </ul>
          </section>
        </article>
        <footer>
          <button type="button" class="detail-saveBtn" @click="saveData">保存</button>
        </footer>
      </section>
    </form>
    <popup v-if="popupShow" :obj.sync="popupObj" :payPopupShow.sync="popupShow"></popup>
  </section>
</template>
<script>
  import api from '@/common/js/util';
  import popup from  '@/common/popup';
  export default{
    name: "nowSick",
    data(){
      return {
        sickDetailUrl: '/call/patient/case/hpi/v1/getMapById/',
        sickSaveUrl: '/call/patient/case/hpi/v1/save/',
        mainSpeakInfo: "/call/customer/patient/case/v1/getMainMapById/", //主诉
        treatmentName: '',
        illnessName: '',
        takeMedicine: '',
        produceReason: '',         //产生诱因
        produceSymptomsId: 0,     //症状
        produceSymptomsName: '',
        produceLevelId: 0,        //程度
        produceLevelName: '',
        produceSharpenId: 0,      //何时加重
        produceSharpenName: '',
        produceRemitId: 0,        //何时缓解
        produceRemitName: '',
        produceTreatment: 0,      //治疗情况
        produceTreatment2: 0,      //治疗情况2
        aggravateReason: '',       //加重诱因
        aggravateSymptomsId: 0,   //症状
        aggravateSymptomsName: '',
        aggravateLevelId: 0,      //程度
        aggravateLevelName: '',
        aggravateSharpenId: 0,    //何时加重
        aggravateSharpenName: '',
        aggravateRemitId: 0,      //何时缓解
        aggravateRemitName: '',
        aggravateTreatment: 0,    //治疗情况
        aggravateTreatment2: 0,   //治疗情况2
        sleepId: 0,               //睡眠状况
        sleepName:'',
        spiritId: 0,              //精神状态
        spiritName: '',
        appetiteId: 0,            //食欲状况
        appetiteName: '',
        weightId: 0,              //体重状况
        weightName: '',
        excretionId: 0,           //排泄状况
        excretionName: '',
        popupShow:false,
        popupObj: {}
      }
    },
    components:{
      popup
    },
    mounted: function () {
      this.init();
    },
    watch: {
      '$route.params.num': function () {
        this.init();
      }
    },
    methods: {
      init: function () {
        this.userMessage = JSON.parse(this.$route.params.num);
        this.initText();
        this.addData();
      },
      addData: function () {
        let _this = this;
        let dataValue = {
          caseId: this.userMessage.caseId
        };
        //现病史详情
        api.ajax({
          url: _this.sickDetailUrl,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res) {
            if (res.responseObject.responseData.dataList && res.responseObject.responseStatus == true) {
              let dataList = res.responseObject.responseData.dataList[0];
              _this.id = dataList.id;
              _this.produceReason = dataList.produceReason;         //产生诱因
              _this.produceSymptomsId = dataList.produceSymptomsId;      //症状
              _this.produceLevelId = dataList.produceLevelId;         //程度
              _this.produceSharpenId = dataList.produceSharpenId;      //何时加重
              _this.produceRemitId = dataList.produceRemitId;        //何时缓解

              if (dataList.produceTreatment != '') {
                let produceTreatmentList = dataList.produceTreatment.split(",");
                _this.produceTreatment = produceTreatmentList[0];        //治疗情况
                _this.produceTreatment2 = produceTreatmentList[1];       //治疗情况2
              }
              _this.aggravateReason = dataList.aggravateReason;          //加重诱因
              _this.aggravateSymptomsId = dataList.aggravateSymptomsId;  //症状
              _this.aggravateLevelId = dataList.aggravateLevelId;        //程度
              _this.aggravateSharpenId = dataList.aggravateSharpenId;    //何时加重
              _this.aggravateRemitId = dataList.aggravateRemitId;        //何时缓解

              if (dataList.aggravateTreatment != '') {
                let aggravateTreatmentList = dataList.aggravateTreatment.split(",");
                _this.aggravateTreatment = aggravateTreatmentList[0];    //治疗情况
                _this.aggravateTreatment2 = aggravateTreatmentList[1];   //治疗情况2
              }
              _this.sleepId = dataList.sleepId;                  //睡眠状况
              _this.spiritId = dataList.spiritId;                //精神状态
              _this.appetiteId = dataList.appetiteId;            //食欲状况
              _this.weightId = dataList.weightId;                //体重状况
              _this.excretionId = dataList.excretionId;          //排泄状况

//            $(".J-visualInspection").val(dataListValue.visualInspection);             //珍视
//            $(".J-activityState").val(dataListValue.activityState);                   //活动
//            $(".J-muscleStrength").val(dataListValue.muscleStrength);                 //肌力

            }
          },
          fail(error){
            console.log("请求失败：" + error);
          }
        });
      },
      saveData: function () {
        let _this = this ;
        let dataValue = {
          id: this.id,	                                                                    //string	是	主键id创建时不传，修改时传
          caseId: this.userMessage.caseId,                                                                                    //string	是	病例id
          produceReason: this.produceReason,                //	string	是	产生诱因
          produceSymptomsId: this.produceSymptomsId,	      //	string	是	症状Id
          produceSymptomsName: this.produceSymptomsName,    //	string	是	症状名称
          produceLevelId: this.produceLevelId,              //	string	是	程度Id
          produceLevelName: this.produceLevelName,           //	string	是	程度名称
          produceSharpenId: this.produceSharpenId,	        //	string	是	何时加重Id
          produceSharpenName: this.produceSharpenName,      //	string	是	何时加重名称
          produceRemitId: this.produceRemitId,	            //	string	是	何时缓解Id
          produceRemitName: this.produceRemitName,           //	string	是	何时缓解名称
          produceTreatment: this.produceTreatment + ',' + this.produceTreatment2,	        //	string	是	治疗情况
          aggravateReason: this.aggravateReason,            //	string	是	加重诱因
          aggravateSymptomsId: this.aggravateSymptomsId,    //	string	是	症状Id
          aggravateSymptomsName: this.aggravateSymptomsName,//	string	是	症状名称
          aggravateLevelId: this.aggravateLevelId,          //	string	是	程度Id
          aggravateLevelName: this.aggravateLevelName,	    //	string	是	程度名称
          aggravateSharpenId: this.aggravateSharpenId,	    //	string	是	何时加重Id
          aggravateSharpenName: this.aggravateSharpenName,	  //	string	是	何时加重名称
          aggravateRemitId: this.aggravateRemitId,	        //	string	是	何时缓解Id
          aggravateRemitName: this.aggravateRemitName,    	//	string	是	何时缓解名称
          aggravateTreatment: this.aggravateTreatment + ',' + this.aggravateTreatment2,	      //	string	是	治疗情况
          sleepId: this.sleepId,	                            //	string	是	睡眠状况Id
          sleepName: this.sleepName,	                      //	string	是	睡眠状况名称
          spiritId: this.spiritId,	                        //	string	是	精神状况Id
          spiritName: this.spiritName,	                    //	string	是	精神状况名称
          appetiteId: this.appetiteId,	                    //	string	是	食欲状况Id
          appetiteName: this.appetiteName,	                //	string	是	食欲状况名称
          weightId: this.weightId,	                        //	string	是	体重状况Id
          weightName: this.weightName,	                    //	string	是	体重状况名称
          excretionId: this.excretionId,	                  //	string	是	排泄状况Id
          excretionName: this.excretionName,	              //	string	是	排泄状况名称
//          visualInspection: this,//	string	是	视诊
//          activityState: $(".J-activityState").attr("data-val") != "undefined" ? $(".J-activityState").val() : $(".J-activityState").attr("data-val"),	                                                                                //	string	是	活动状态
//          muscleStrength: $(".J-muscleStrength").attr("data-val") != "undefined" ? $(".J-muscleStrength").val() : $(".J-muscleStrength").attr("data-val"),                                //	string	是	肌力
          remark: "",	                                                                        //	string	是	备注
          patientId: this.$store.state.patientId	                                    // string	是	患者id

        };
        console.log(dataValue);
        api.ajax({
          url: _this.sickSaveUrl,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res) {
            console.log("保存成功！");
            _this.popupShow = true;
            _this.popupObj = {
              text: '保存成功'
            }
          },
          fail(error){
            console.log("保存失败：" + error);
            _this.popupShow = true;
            _this.popupObj = {
              text: '保存失败'
            }
          }
        });
      },
      initText: function () {
        let _this = this;
        let dataValue = {
          caseId: this.userMessage.caseId,
          patientId: this.userMessage.patientId
        };
        //主诉
        api.ajax({
          url: _this.mainSpeakInfo,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res) {
            var dataList = res.responseObject.responseData.dataList;
            _this.treatmentName = dataList[0].treatmentName;
            _this.illnessName = dataList[0].illnessName;
            _this.takeMedicine = dataList[0].takeMedicine;
          },
          fail(error){
            console.log("保存失败：" + error);
          }
        });
      }
    }
  }


</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
  @import "../scss/library/_common-modules.scss";

  .medical-record-main {
    width: 100%;
    padding: 25px 28px;
    box-sizing: border-box;
  }

  .main-sick {
    .main-title {
      width: auto;
      min-width: 52px;
      font-size: 13px;
      color: #555;
      letter-spacing: 0;
      line-height: 14px;
      margin-right: 8px;
      text-align: right;
      display: inline-block;
      white-space: nowrap;
    }
    .main-text {
      font-size: 14px;
      color: #808080;
      letter-spacing: 0;
      line-height: 1.5;
    }
    header {
      position: relative;
      margin-bottom: 30px;
      margin-top: 50px;
      &:before {
        content: "";
        position: absolute;
        top: 50%;
        width: 216px;
        left: 50%;
        margin-left: -108px;
        border: 1px solid #E1E2E7;
      }
    }
    li {
      margin-top: 24px;
    }
    h2 {
      font-size: 12px;
      color: #AAAAAA;
      letter-spacing: 0;
      line-height: 12px;
      margin: 0 auto;
      width: 92px;
      background: #fff;
      text-align: center;
      position: relative;
      z-index: 2;
    }
    select {
      background: #F9F9F9;
      border: 1px solid #E1E2E7;
      border-radius: 4px;
      padding: 5px 10px;
      font-size: 14px;
      line-height: 14px;
      min-width: 84px;
    }
    .select-120 {
      min-width: 119px;
    }
    .main-sick-input {
      background: #F9F9F9;
      border: 1px solid #E1E2E7;
      border-radius: 4px;
      padding: 5px 10px;
      font-size: 14px;
      line-height: 14px;
      width: 235px;
    }
  }

  .medical-record-form {
    overflow: auto;
    //height: 620px;
    height: 72%;
    box-sizing: border-box;
    &.on {
      padding-bottom: 340px;
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
        background: url("/image/img00/employee/dot.png") no-repeat;
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
        line-height: 1.5;
        margin-right: 15px;
        text-align: right;
        display: inline-block;
        white-space: nowrap;
        vertical-align: top;
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
      vertical-align: middle;
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

  .ml20 {
    margin-left: 23px;
  }

  .ml15 {
    margin-left: 15px;
  }

  .mt10 {
    margin-top: 10px;
  }

  .mt20 {
    margin-top: 20px;
  }
</style>
