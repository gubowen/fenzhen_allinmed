<template>
  <section class="checkBody viewItem medical-record-form-item">
    <form action="">
      <section class="body-check medical-record-main">
        <article>
          <input type="hidden" class="body-check-id"/>
          <section>
            <ul>
              <li><span class="medical-title">身高</span><select v-model="height" @change="changeData">
                <option v-for="items of heightArea" :value="items.value">
                  {{items.text}}
                </option>
              </select><span class="medical-title ml20">体重</span><select v-model="weight" @change="changeData">
                <option v-for="items of weightArea" :value="items.value">
                  {{items.text}}
                </option>
              </select>
              </li>
              <li>
                <span class="medical-title">血压</span><select class="select-130" v-model="bloodPressureHigh">
                <option v-for="items of bloodPressureHighArea" :value="items.value">
                  {{items.text}}
                </option>
              </select><select class="select-130 ml15" v-model="bloodPressureLow">
                <option v-for="items of bloodPressureLowArea" :value="items.value">
                  {{items.text}}
                </option>
              </select></li>
              <li><span class="medical-title">脉搏</span><select v-model="pulse">
                <option v-for="items of pulseArea" :value="items.value">
                  {{items.text}}
                </option>
              </select><span class="medical-title ml20">呼吸</span><select v-model="breathing">
                <option v-for="items of breathArea" :value="items.value">
                  {{items.text}}
                </option>
              </select>
              </li>
              <li><span class="medical-title">体温</span><input type="text" class="input-95 J-temperature"
                                                              placeholder="请填写" maxlength="20" v-model="temperature"
                                                              @keyup="formatNumber(temperature)"
                                                              @focus="focusEvent(temperature,'℃')"
                                                              @blur="blurEvent(temperature,'℃')"/><span
                class="medical-title ml20">BMI</span><input
                type="text" class="input-95 J-bmi" placeholder="请填写"
                maxlength="20" readonly v-model="bmi"/></li>
              <li><span class="medical-title">体表面积</span><input type="text" class="input-95 J-bodySurfaceArea"
                                                                placeholder="请填写" maxlength="20" readonly
                                                                v-model="bodySurfaceArea"/></li>
              <li><span class="medical-title">其他</span><textarea class="J-other" placeholder="请填写"
                                                                 maxlength="1000" v-model="other"></textarea></li>
            </ul>
          </section>
          <footer>
            <button type="button" class="detail-saveBtn" @click="saveData">保存</button>
          </footer>
        </article>
      </section>
    </form>
    <transition name="fade-scale">
      <popup v-if="popupShow" :obj.sync="popupObj" :payPopupShow.sync="popupShow"></popup>
    </transition>
  </section>
</template>
<script>
  import  autosize  from  "autosize";
  import api from '@/common/js/util';
  import popup from  '@/common/popup';

  export default{
    name: 'checkBody',
    data(){
      return {
        getDataUrl: '/call/customer/patient/case/physical/getMapList/',
        saveDataUrl:'/call/customer/patient/case/physical/create/',
        height: "",
        heightArea: [],
        weight: '',
        weightArea: [],
        bloodPressureHigh: '',
        bloodPressureHighArea: [],
        bloodPressureLow: '',
        bloodPressureLowArea: [],
        pulse: '',
        pulseArea: [],
        breathing: '',
        breathArea: [],
        bmi: '',
        bodySurfaceArea: '',
        temperature: '',
        other: "",
        id: "",
        userMessage: {},
        popupShow: false,
        popupObj: {}
      }
    },
    components: {
      popup
    },
    methods: {
      init () {
        this.userMessage = this.$store.state.currentItem;
        this.initData();
        this.getData();
      },
      watch: {
        '$store.state.currentItem'(){
          this.init();
        }

      },
//      activated(){
//        this.userMessage = this.$route.params.num;
//        this.init();
//      },
      initData(){
        let _this = this;

        //身高
        _this.heightArea.push({value: '', text: '请选择'});
        for (let i = 140; i < 220; i++) {
          _this.heightArea.push({value: i, text: i + ' cm'});
        }
        //体重
        _this.weightArea.push({value: '', text: '请选择'});
        for (let i = 40; i < 120; i++) {
          _this.weightArea.push({value: i, text: i + ' kg'});
        }
        //收缩压
        _this.bloodPressureHighArea.push({value: '', text: '请选择'});
        for (let i = 40; i <= 180; i++) {
          _this.bloodPressureHighArea.push({value: i, text: i + ' mmHg'});
        }
        //舒张压
        _this.bloodPressureLowArea.push({value: '', text: '请选择'});
        for (let i = 20; i <= 130; i++) {
          _this.bloodPressureLowArea.push({value: i, text: i + ' mmHg'});
        }
        //脉搏
        _this.pulseArea.push({value: '', text: '请选择'});
        for (let i = 40; i <= 100; i++) {
          _this.pulseArea.push({value: i, text: i + ' 次/分'});
        }
        //脉搏
        _this.breathArea.push({value: '', text: '请选择'});
        for (let i = 40; i <= 100; i++) {
          _this.breathArea.push({value: i, text: i + ' 次/分'});
        }

        //textare自适应高度
        autosize(document.querySelectorAll('textarea'));
      },
      getData(){
        let _this = this;
        const dataValue = {
          patientId: this.userMessage.patientId,
          caseId: this.userMessage.caseId
        };
        api.ajax({         //获取基本信息
          url: _this.getDataUrl,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res) {
            console.log(res);
            if (res.responseObject.responseData.dataList && res.responseObject.responseStatus == true) {
              let dataList = res.responseObject.responseData.dataList[0];
              _this.id = dataList.id;
              _this.height = dataList.height;                        //身高
              _this.weight = dataList.weight;                          //体重
              _this.bloodPressureHigh = dataList.bloodPressureHigh;    //静脉压
              _this.bloodPressureLow = dataList.bloodPressureLow;      //静脉压
              _this.pulse = dataList.pulse;                             //脉搏
              _this.breathing = dataList.breathing;                      //呼吸
              _this.temperature = dataList.temperature;                  //体温
              _this.bmi = dataList.bmi;                                  //BMI
              _this.bodySurfaceArea = dataList.bodySurfaceArea;          //体表面积
              _this.other = dataList.other;                              //其他
            } else {
              console.log("无数据！");
            }
          },
          fail(error){
            console.log("请求失败：" + error);
          }
        });
      },
      saveData(){
        let _this = this;
        let dataValue = {
          temperature: this.temperature,
          patientId: this.userMessage.patientId,
          caseId: this.userMessage.caseId,
          height: this.height,
          weight: this.weight,
          bloodPressureHigh: this.bloodPressureHigh,
          bloodPressureLow: this.bloodPressureLow,
          pulse: this.pulse,
          breathing: this.breathing,
          bodySurfaceArea: this.bodySurfaceArea,
          bmi: this.bmi,
          other: this.other,
          isValid: 1,
          id: this.id
        };
        console.log(dataValue);
        api.ajax({         //获取基本信息
          url: _this.saveDataUrl,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res) {
            if (res != "" && res.responseObject.responseStatus != false) {
                _this.getData();
              console.log("保存成功！");
              _this.popupShow = true;
              _this.popupObj = {
                text: '保存成功'
              }
            } else {
              _this.popupShow = true;
              _this.popupObj = {
                text: '保存失败'
              }
            }
          },
          fail(error){
            console.log("请求失败：" + error);
          }
        });
      },
      changeData() {
        if (this.height != 0 && this.weight != 0) {
          let bmi = this.weight / (this.height * this.height / 10000);
          let bodySurfaceArea = 0.0061 * this.height + 0.0128 * this.weight - 0.1529;
          this.bmi = bmi.toFixed(2);
          this.bodySurfaceArea = bodySurfaceArea.toFixed(2) + "㎡";

        } else {
          this.bmi = "";
          this.bodySurfaceArea = "";
        }
      },
      formatNumber(text) {
        if (typeof (text) == "undefined" || text == "") {
        } else {
          this.temperature = text.replace(/[^0-9.]/g, '');
        }
      },
      focusEvent(text, unit){
        let re = new RegExp(unit, "ig");
        this.temperature = text.replace(re, " ");
      },
      blurEvent(text, unit){
        if (text && text.indexOf(unit) == -1) {
          this.temperature = text + unit;
        }
      }
    },
    mounted(){
      this.init()
    }
  }
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
  @import "../../scss/library/_common-modules";
  @import "../../scss/record_common";
  .medical-record-form {
    .body-check {
      .input-95 {
        width: 72px;
      }
    }
  }
</style>
