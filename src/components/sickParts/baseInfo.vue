<template>
  <div id="baseInfo" @click="hiddenSelect">
    <section class="viewItem medical-record-form-item ">
      <form action="">
        <section class="base-info medical-record-main">
          <article>
            <ul>
              <li><span class="base-title">所在地区</span><span class="base-text">{{address}}</span></li>
              <li v-if="false"><span class="base-title">联系方式</span><span class="base-text">{{telephone}}</span></li>
              <li><span class="base-title">社保类型</span><span class="base-text" :data-value="socialId.value">{{socialId.text}}</span></li>
              <li><span class="base-title base-title-long">社保所在地</span><span class="base-text">{{socialAddress}}</span></li>
              <li><span class="base-title">民族</span><select class="" v-model="nationDataSelectValue">
                <option v-for="option in nation" v-bind:value="option.nationality">
                  {{option.nationality}}
                </option>
              </select><span class="base-title ml20">婚姻状况</span><select class="" v-model="marriageSelectValue">
                <option value="">请选择</option>
                <option value="1">未婚</option>
                <option value="2">已婚</option>
                <option value="3">离异</option>
                <option value="4">丧偶</option>
              </select>
              </li>
              <li>
                <span class="base-title ">籍贯</span><address-selector  :dataListInfo.sync ="addressResult" :conIndex="1" :currentIndexNow.sync="currentSelectorIndex" :dataBack.sync="addressResult" v-if="childrenShow"></address-selector>
              </li>
              <li>
                <span class="base-title">家庭住址</span><input class="base-input" type="text" maxlength="50" placeholder="请填写" v-model="homeAddress"/>
              </li>
              <li>
                <span class="base-title">工作单位</span><input class="base-input" type="text" maxlength="50" placeholder="请填写" v-model="workplace"/>
              </li>
            </ul>
          </article>
          <article>
            <header>
              <h2>个人史</h2>
            </header>
            <section>
              <ul>
                <li>
                  <span class="base-title">出生地</span><address-selector  :dataListInfo.sync ="birthResult"  :dataBack.sync="birthResult" :conIndex="2" :currentIndexNow.sync="currentSelectorIndex" v-if="childrenShow"></address-selector>
                </li>
                <li>
                  <span class="base-title">生育状况</span><select class="select-120" v-model="fertilityBoySelectValue">
                      <option value="">请选择</option>
                      <option value="0">0子</option>
                      <option value="1">1子</option>
                      <option value="2">2子</option>
                      <option value="3">3子</option>
                      <option value="4">4子</option>
                      <option value="5">5子</option>
                      <option value="6">6子</option>
                      <option value="7">7子</option>
                      <option value="8">8子</option>
                    </select><select class="select-120 ml15" v-model="fertilityGirlSelectValue">
                      <option value="">请选择</option>
                      <option value="0">0女</option>
                      <option value="1">1女</option>
                      <option value="2">2女</option>
                      <option value="3">3女</option>
                      <option value="4">4女</option>
                      <option value="5">5女</option>
                      <option value="6">6女</option>
                      <option value="7">7女</option>
                      <option value="8">8女</option>
                    </select>
                </li>
                <li>
                  <span class="base-title">配偶状况</span><select class="" v-model="spouseStatusSelectValue">
                  <option value="0">请选择</option>
                  <option value="1">健康</option>
                  <option value="2">患病</option>
                  <option value="3">严重患病</option>
                  <option value="4">身体残疾</option>
                </select><span class="base-title ml20">子女状况</span><select class="" v-model="childrenStatusSelectValue">
                  <option value="0">请选择</option>
                  <option value="1">健康</option>
                  <option value="2">患病</option>
                  <option value="3">严重患病</option>
                  <option value="4">身体残疾</option>
                </select>
                </li>
                <li>
                  <span class="base-title">结婚年龄</span><select class="" v-model="marriageAgeSelectValue">
                    <option v-for="option in marriageAge" v-bind:value="option.value">
                      {{option.text}}
                    </option>
                  </select><span class="base-title ml20">吸烟史</span><select class="" v-model="isSmokeSelectValue">
                  <option value="0">请选择</option>
                  <option value="1">从不吸烟</option>
                  <option value="2">曾经吸烟</option>
                  <option value="3">偶尔吸烟</option>
                  <option value="4">经常吸烟</option>
                </select>
                </li>
                <li>
                  <span class="base-title">饮酒史</span><select class="" v-model="isDrinkSelectValue">
                  <option value="0">请选择</option>
                  <option value="1">从不喝酒</option>
                  <option value="2">曾经喝酒</option>
                  <option value="3">偶尔喝酒</option>
                  <option value="4">经常喝酒</option>
                </select><span class="base-title ml20">毒品史</span><select class="" v-model="isNarcoticsSelectValue">
                  <option value="0">请选择</option>
                  <option value="1">无</option>
                  <option value="2">有</option>
                </select>
                </li>
              </ul>
            </section>
          </article>
          <article>
            <header>
              <h2>家族史</h2>
            </header>
            <section>
              <ul>
                <li>
                  <span class="base-title">父母状况</span><select class="" v-model="parentStratusSelectValue">
                  <option value="0">请选择</option>
                  <option value="1">父母健在</option>
                  <option value="2">父亲已故</option>
                  <option value="3">母亲已故</option>
                  <option value="4">父母已故</option>
                </select><span class="base-title ml20">兄妹状况</span><select class="" v-model="siblingsStatusSelectValue">
                  <option value="0">请选择</option>
                  <option value="1">健康</option>
                  <option value="2">患病</option>
                  <option value="3">严重患病</option>
                  <option value="4">身体残疾</option>
                </select>
                </li>
                <li>
                  <span class="base-title">传染病</span><select class="" v-model="isInfectionSelectValue">
                  <option value="0">请选择</option>
                  <option value="1">无</option>
                  <option value="2">肝炎</option>
                  <option value="3">结核</option>
                  <option value="4">非典</option>
                  <option value="5">流脑</option>
                  <option value="6">其他</option>
                </select><span class="base-title ml20">遗传病</span><select class="" v-model="isHeredopathiaSelectValue">
                  <option value="0">请选择</option>
                  <option value="1">无</option>
                  <option value="2">血友病</option>
                  <option value="3">白化病</option>
                  <option value="4">红斑狼疮</option>
                  <option value="5">美尼尔综合征</option>
                  <option value="6">其他</option>
                </select>
                </li>
              </ul>
            </section>
          </article>
          <footer>
            <button type="button" class="detail-saveBtn" @click="saveData()" v-show="$store.state.userListStatus.second && ($store.state.currentItem.consultationState == 6||$store.state.currentItem.consultationState == -1||$store.state.currentItem.consultationState ==0||$store.state.currentItem.consultationState ==9||$store.state.currentItem.consultationState ==10)">保存</button>
          </footer>
        </section>
      </form>
    </section>
    <transition name="fade-scale">
      <popup v-if="popupShow" :obj.sync="popupObj" :payPopupShow.sync="popupShow"></popup>
    </transition>
  </div>
</template>
<script>
  import Vue from 'vue'
  import api from '@/common/js/util/util';
  import addressSelector from '@/common/addressSelector'
  import popup from  '@/common/popup';

  const XHRList = {
      nationSearch: "/call/comm/data/baseinfo/v1/getNationalityList/",
      getBaseInfo:'/call/customer/patient/baseinfo/v1/getMapList/',
      saveBaseInfo: "/call/customer/patient/baseinfo/v1/save/",
  };
  export default {
    name: 'baseInfo',
    data(){
      return {
        id: '',
        address: '',
        telephone: '',
        socialId: '',
        socialAddress: '',
        marriageAge: [],
        marriageAgeSelectValue: '',
        nation: [],
        nationDataSelectValue: '',
        nationDataSelectName:'',
        marriageSelectValue: '',
        nativeAddress: '',
        homeAddress: '',
        workplace: '',
        fertilityBoySelectValue: '',
        fertilityGirlSelectValue: '',
        spouseStatusSelectValue: '',
        childrenStatusSelectValue: '',
        isSmokeSelectValue: '',
        isDrinkSelectValue: '',
        isNarcoticsSelectValue: '',
        parentStratusSelectValue: '',
        siblingsStatusSelectValue: '',
        isInfectionSelectValue: '',
        isHeredopathiaSelectValue: '',
        userMessage: {},
        provinceList:[],
        cityList:{},
        addressResult:{
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          districtId: '',
          districtName: ''
        },
        birthResult:{
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          districtId: '',
          districtName: ''
        },
        childrenShow:false,
        popupShow:false,
        popupObj: {},
        currentSelectorIndex:1
      }
    },
    props: {
      recordData: {
        type: Object
      }
    },
    components:{
      addressSelector,
      popup
    },
    mounted(){
      this.init();
    },
    watch: {
      '$store.state.currentItem'(){
        this.init();
      }
    },
    methods: {
      init() {
        this.childrenShow = false;
        this.userMessage = this.$store.state.currentItem;
        this.addData();
      },
      addData() {
        this.nationGet();  //获取民族列表
        this.baseInfoGet();//获取基本信息
      },
      nationGet() {
        let _this = this;
        let dataValue = {
          "isValid": 1,
          "firstResult": 0,
          "maxResult": 999
        };
        api.ajax({                //获取民族列表
          url: XHRList.nationSearch,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res) {
            if (res.responseObject.responseData.dataList && res.responseObject.responseStatus == true) {
              let dataList = res.responseObject.responseData.dataList;
              let dataObj = {
                firstResult: 0,
                id: 0,
                ids: {},
                maxResult: {},
                nationality: "请选择",
                page: {},
                pageSize: {},
                sortType: 0
              };
              dataList.unshift(dataObj);
              _this.nation = dataList;
            } else {
              console.log("无数据！");
            }
          },
          fail(error){
            console.log("请求失败：" + error);
          }
        });
      },
      baseInfoGet() {
        let _this = this;
        let dataValue = {
          isValid: "1",
          firstResult: "0",
          maxResult: "1",
          patientId: _this.userMessage.patientId     //患者ID 假数据
        };
        api.ajax({         //获取基本信息
          url: XHRList.getBaseInfo,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res) {
            if (res.responseObject.responseData.dataList && res.responseObject.responseStatus == true) {
              let data = res.responseObject.responseData.dataList[0];
              _this.id = data.id;
              //所在地区
              _this.address = data.province + " " + data.city + " " + data.district;
              //联系电话
              _this.telephone = data.mobile;
              //社保类型
              switch (data.socialId) {
                case "0" :
                  _this.socialId = {value: 0, text: "无"};
                  break;
                case "1" :
                  _this.socialId = {value: 1, text: "城镇职工"};
                  break;
                case "2" :
                  _this.socialId = {value: 2, text: "城镇居民"};
                  break;
                case "3" :
                  _this.socialId = {value: 2, text: "新农合"};
                  break;
                case "4" :
                  this.socialId = {value: 2, text: "商业保险"};
                  break;
                default:
                  _this.socialId = {value: data.socialId, text: "无"};
              }
              //民族
              _this.nationDataSelectValue =data.nation?(data.nation == '未填写'?'请选择':data.nation):'请选择';
              //婚姻状况
              _this.marriageSelectValue = data.isMarriage > 0 ? data.isMarriage : "";
              //  data.marriage ? _this.marriageSelectValue = data.marriage : _this.marriageSelectValue = "";
              //籍贯
              _this.addressResult.provinceId=data.nativeProvinceId;
              _this.addressResult.provinceName=data.nativeProvince;
              _this.addressResult.cityId=data.nativeCityId;
              _this.addressResult.cityName=data.nativeCity;
              _this.addressResult.districtId=data.nativeDistrictId;
              _this.addressResult.districtName=data.nativeDistrict;

              //出生地
               _this.birthResult.provinceId=data.birthplaceProvinceId;
               _this.birthResult.provinceName=data.birthplaceProvince;
               _this.birthResult.cityId=data.birthplaceCityId;
               _this.birthResult.cityName=data.birthplaceCity;
               _this.birthResult.districtId=data.birthplaceDistrictId;
               _this.birthResult.districtName=data.birthplaceDistrict;

              //  $("#base-info-address").find(".firstListTitle").text(nativeAddress).attr("data-province", data.nativeProvinceId).attr("data-city", data.nativeCityId).attr("data-district", data.nativeDistrictId);                                   //籍贯
              //社保所在地
              data.socialProvince ? _this.socialAddress = data.socialProvince + " " + data.socialCity + " " + data.socialDistrict : _this.socialAddress = "未填写";
              //家庭住址
              _this.homeAddress = data.homeAddress;
              //工作单位
              _this.workplace = data.workplace;
              //生育状况
              if (data.fertility.length > 0) {
                let fertilityList = data.fertility.split(",");
                _this.fertilityBoySelectValue = fertilityList[0];
                _this.fertilityGirlSelectValue = fertilityList[1];
              } else {
                _this.fertilityBoySelectValue = "";
                _this.fertilityGirlSelectValue = "";
              }
              //配偶状态
              data.spouseStatus != '' && data.spouseStatus > 0 ? _this.spouseStatusSelectValue = data.spouseStatus : _this.spouseStatusSelectValue = 0;
              //子女状态
              data.childrenStatus != '' && data.childrenStatus > 0 ? _this.childrenStatusSelectValue = data.childrenStatus : _this.childrenStatusSelectValue = 0;
              //结婚年龄

              _this.marriageAge=[];
              _this.marriageAge.push({value: "", text: "请选择"});
              for (let i = 15; i <= 60; i++) {
                _this.marriageAge.push({value: i, text: i});
              }
              data.marriageAge != '' && data.marriageAge > 0 ? _this.marriageAgeSelectValue = data.marriageAge : _this.marriageAgeSelectValue = "";
              //吸烟史
              data.isSmoke != '' && data.isSmoke > 0 ? _this.isSmokeSelectValue = data.isSmoke : _this.isSmokeSelectValue = 0;
              //饮酒史
              data.isDrink != '' && data.isDrink > 0 ? _this.isDrinkSelectValue = data.isDrink : _this.isDrinkSelectValue = 0;
              //毒品史
              data.isNarcotics != '' && data.isNarcotics > 0 ? _this.isNarcoticsSelectValue = data.isNarcotics : _this.isNarcoticsSelectValue = 0;
              //父母状况
              data.parentStatus != '' && data.parentStatus > 0 ? _this.parentStratusSelectValue = data.parentStatus : _this.parentStratusSelectValue = 0;
              //兄妹状况
              data.siblingsStatus != '' && data.siblingsStatus > 0 ? _this.siblingsStatusSelectValue = data.siblingsStatus : _this.siblingsStatusSelectValue = 0;
              //传染病
              data.isInfection != '' && data.isInfection > 0 ? _this.isInfectionSelectValue = data.isInfection : _this.isInfectionSelectValue = 0;
              //遗传病
              data.isHeredopathia != '' && data.isHeredopathia > 0 ? _this.isHeredopathiaSelectValue = data.isHeredopathia : _this.isHeredopathiaSelectValue = 0;

//            //社保所在地
//            $(".J-socialAddress").text(data.socialProvince + " " + data.socialCity + " " + data.socialDistrict).attr("data-province", data.socialProvinceId).attr("data-city", data.socialCityId).attr("data-district", data.socialDistrictId);
//            //籍贯
//            $("#base-info-address").find(".firstListTitle").text(nativeAddress).attr("data-province", data.nativeProvinceId).attr("data-city", data.nativeCityId).attr("data-district", data.nativeDistrictId);                                   //籍贯
//            //出生地
//            $("#base-info-born-address").find(".firstListTitle").text(birthplaceInfo).attr("data-province", data.birthplaceProvinceId).attr("data-city", data.birthplaceCityId).attr("data-district", data.birthplaceDistrictId);                           //出生地
              _this.childrenShow = true;
            }
          },
          fail(error){
            console.log("请求失败：" + error);
          }
        });
      },
      saveData() {
        let _this = this;
        let dataValue = {
          nativeProvinceId: this.addressResult.provinceId,   //string	是	籍贯省Id
          nativeProvince:  this.addressResult.provinceName,	//string	是	籍贯省
          nativeCityId: this.addressResult.cityId,	//string	是	籍贯市ID
          nativeCity:  this.addressResult.cityName,//string	是	籍贯市
          nativeDistrictId:  this.addressResult.districtId,	//string	是	籍贯区县
          nativeDistrict: this.addressResult.districtName,	//string	是	籍贯区县

          birthplaceProvinceId: this.birthResult.provinceId,	//string	是	出生地省id
          birthplaceProvince: this.birthResult.provinceName,	//string	是	出生地省
          birthplaceCityId: this.birthResult.cityId,//string	是	出生地市id
          birthplaceCity: this.birthResult.cityName,	//string	是	出生地市
          birthplaceDistrictId: this.birthResult.districtId,	//string	是	出生地区/县id
          birthplaceDistrict:  this.birthResult.districtName,	//string	是	出生地区/县

          patientId: this.userMessage.patientId,          //患者ID 假数据
          id: this.id,
          address: this.address,
          telephone: this.telephone,                      //联系方式
          socialId: this.socialId.value,                   //string	是	社保类型
          socialAddress: this.socialAddress,
          nation: this.nationDataSelectValue=='请选择'?'未填写': this.nationDataSelectValue,             //民族
          isMarriage: this.marriageSelectValue,           //婚姻状况
          homeAddress: this.homeAddress,                  //家庭住址
          workplace: this.workplace,                      //工作单位
          spouseStatus: this.spouseStatusSelectValue,     //配偶状况
          childrenStatus: this.childrenStatusSelectValue, //子女状况
          fertility: this.fertilityBoySelectValue + ',' + this.fertilityGirlSelectValue,  //生育状况
          marriageAge: this.marriageAgeSelectValue,       //结婚年龄
          isSmoke: this.isSmokeSelectValue,               //吸烟史
          isDrink: this.isDrinkSelectValue,               //饮酒史
          isNarcotics: this.isNarcoticsSelectValue,        //毒品史
          parentStatus: this.parentStratusSelectValue,    //父母状况
          siblingsStatus: this.siblingsStatusSelectValue, //兄妹状况
          isInfection: this.isInfectionSelectValue,       //传染病
          isHeredopathia: this.isHeredopathiaSelectValue  //遗传病
        };

        api.ajax({         //获取基本信息
          url: XHRList.saveBaseInfo,
          method: "POST",
          data: dataValue,
          beforeSend(config) {
          },
          done(res){
              _this.baseInfoGet();

            _this.popupShow = true;
            _this.popupObj = {
              text: '保存成功'
            }
          },
          fail(error){
            _this.popupShow = true;
            _this.popupObj = {
              text: '保存失败'
            };
            console.log("请求失败：" + error);
          }
         });
      },
      hiddenSelect(){
          this.currentSelectorIndex =-1;
      }
    }
  }
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
  //baseInfo.scss
  @import "../../scss/library/_common-modules";
  @import "../../scss/record_common";
  .base-info {
    .base-title {
      width: 54px;
      font-size: 13px;
      color: #555555;
      letter-spacing: 0;
      line-height: 14px;
      margin-right: 8px;
      text-align: right;
      display: inline-block;
      vertical-align: middle;
      white-space: nowrap;

    }
    .base-title-long {
      width: 65px;
      margin-left: -12px;
    }
    .base-text {
      font-size: 14px;
      color: #222222;
      letter-spacing: 0;
      line-height: 14px;
      display: inline-block;
      width: 248px;
      vertical-align: middle;
    }
    li {
      margin-top: 15px;
    }
    .base-input {
      background: #F9F9F9;
      border: 1px solid #E1E2E7;
      border-radius: 4px;
      padding: 5px 10px;
      font-size: 14px;
      line-height: 14px;
      width: 239px;
    }
  }
</style>


