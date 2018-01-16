<template>
  <div class="userList">
    <header-list></header-list>
    <div class="center-inner" :class="{'no-content':!noData}">
      <communication :m.message.sync="message" :n.sync="noData" :targetData.sync="targetData" :fastRelyStatus.sync="fastRelyStatusParent" v-on:listenToChildEvent="showMsgFromChild"></communication>
      <aside class="center-inner-userlist">
        <nav class="userlist-sortType">
          <section class="userlist-sortType-item">
            <ul class="custom-selector" id="data-selector">
              <h3 class="custom-selector-title firstListTitle">日期</h3>
              <i class="icon-downArrow"></i>
              <section class="custom-selector-second-box">
                <div class="custom-selector-second firstList">
                  <h4 class="time-title">年</h4>
                  <li class="custom-selector-item result-item recover"><span>不限</span></li>
                </div>
                <div class="custom-selector-second custom-selector-second-list secondList" data-down-role="dataSelect">
                  <h4 class="time-title">月</h4>
                  <li class="custom-selector-item result-item recover"><span>不限</span></li>
                </div>
                <div class="custom-selector-second custom-selector-second-list thirdList"
                     data-down-role="dataSelect-month">
                  <h4 class="time-title">日</h4>
                  <li class="custom-selector-item result-item recover"><span>不限</span></li>
                </div>
              </section>
            </ul>
          </section>
          <section class="userlist-sortType-item">
            <ul class="custom-selector" id="sex-selector">
              <h3 class="custom-selector-title firstListTitle">性别</h3>
              <i class="icon-downArrow"></i>
              <section class="custom-selector-second-box">
                <div class="custom-selector-second firstList">
                  <li class="custom-selector-item result-item recover active"><span>不限</span></li>
                  <li class="custom-selector-item result-item"><span>男</span></li>
                  <li class="custom-selector-item result-item"><span>女</span></li>
                </div>
              </section>
            </ul>
          </section>
          <section class="userlist-sortType-item">
            <ul class="custom-selector" id="age-selector">
              <h3 class="custom-selector-title firstListTitle">年龄</h3>
              <i class="icon-downArrow"></i>
              <section class="custom-selector-second-box">
                <div class="custom-selector-second firstList">
                  <li class="custom-selector-item result-item recover "><span>不限</span></li>
                  <li class="custom-selector-item result-item  " v-for="items in (age-1)">
                    <span v-if=" items % 5 == 0">{{ parseInt(items) + "-"+parseInt(items + 5)}}</span>
                  </li>
                  <li class="custom-selector-item result-item"><span>{{age + '以上'}}</span></li>
                </div>
              </section>
            </ul>
          </section>
          <section class="userlist-sortType-item">
            <ul class="custom-selector" id="area-selector">
              <h3 class="custom-selector-title firstListTitle">地区</h3>
              <i class="icon-downArrow"></i>
              <section class="custom-selector-second-box">
                <div class="custom-selector-second firstList" id="ev-provice-list">
                  <li class="custom-selector-item result-item recover active"><span>不限</span></li>
                </div>
                <div class="custom-selector-second custom-selector-second-list secondList" id="ev-city-list">
                  <li class="custom-selector-item result-item recover active"><span>不限</span></li>
                </div>
              </section>
            </ul>
          </section>
        </nav>
        <article class="search-result-tips">
          <p>点击<a href="javascript:void(0)">返回全部</a>，为您找到<span>0</span>条信息</p>
        </article>
        <nav class="userlist-status">
          <ul class="userlist-status-box tabsInner" id="ev-user-tabs">
            <li class="userlist-status-item tabsItem" data-role="ut-tabs-1" @click="statusChange(1)"
                v-bind:class="{ 'active': userListStatus.first}">沟通中
            </li>
            <li class="userlist-status-item tabsItem" data-role="ut-tabs-2" @click="statusChange(2)"
                v-bind:class="{ 'active': userListStatus.second}">已结束
            </li>
            <li class="userlist-status-item tabsItem" data-role="ut-tabs-3" @click="statusChange(3)"
                v-bind:class="{ 'active': userListStatus.third}">被退回
            </li>
          </ul>
        </nav>
        <section class="userList-inner-content viewInner" id="ev-user-inner">
          <section class="userlist-mainList viewItem" data-role="ut-tabs-1" v-show="userListStatus.status == 1">
            <article v-show="userListLoading.length > 0" @click="transformData(items,index)"
                     :class="[{ active : userActive == index }, 'userlist-mainList-item']"
                     v-for="(items,index) in userListLoading" v-bind:data-account="items.caseId"
                     v-bind:data-img="items.logoUrl"
                     v-bind:data-name="items.patientName" v-bind:data-pid="items.patientId"
                     v-bind:data-age="items.patientAge" v-bind:data-logo="items.logoUrl"
                     v-bind:data-ctype="items.consultationState" v-bind:data-type="items.caseType"
                     v-bind:data-sex="items.patientSex" v-bind:data-reason="items.returnReason"
                     v-bind:data-consultationId="items.consultationId" :key="items.patientId">
              <figure class="userlist-item-img">
                <img v-bind:src="items.logoUrl" alt="">
                <p style="display: none;"></p>
              </figure>
              <figcaption class="userlist-item-base-msg">
                <h3>
                  <span class="name">{{(items.patientName.length > 4 ? items.patientName.substring(0, 3) + '...' : items.patientName)}}</span>
                  <span class="category ">{{items.state | checkState }}</span>
                </h3>
                <article>
                  <span class="text">{{items.patientSex== 1?'男':'女'}}&nbsp;{{items.patientAge}}&nbsp;{{parseInt(items.isAttachment) === 0 ? "无影像资料" : "有影像资料"}}</span>
                </article>
              </figcaption>
              <span class="time"> {{items.createTime | timeFormat}}</span>
            </article>
            <p class="userList-no-data" v-show="userListLoading.length == 0">没有找到相应的患者</p>
          </section>
          <section class="userlist-mainList viewItem" data-role="ut-tabs-2"
                   v-show="userListStatus.status == 2">
            <article v-show="userListEnd.length > 0" @click="transformData(items,index)"
                     :class="[{ active : userActive == index }, 'userlist-mainList-item']"
                     v-for="(items,index) in userListEnd" v-bind:data-account="items.caseId"
                     v-bind:data-img="items.logoUrl"
                     v-bind:data-name="items.patientName" v-bind:data-pid="items.patientId"
                     v-bind:data-age="items.patientAge" v-bind:data-logo="items.logoUrl"
                     v-bind:data-ctype="items.consultationState" v-bind:data-type="items.caseType"
                     v-bind:data-sex="items.patientSex" v-bind:data-reason="items.returnReason"
                     v-bind:data-consultationId="items.consultationId" :key="items.patientId">
              <figure class="userlist-item-img">
                <img v-bind:src="items.logoUrl" alt="">
                <p style="display: none;"></p>
              </figure>
              <figcaption class="userlist-item-base-msg">
                <h3>
                  <span class="name">{{(items.patientName.length > 4 ? items.patientName.substring(0, 3) + '...' : items.patientName)}}</span>
                  <span class="category ">{{items.state | checkState }}</span>
                </h3>
                <article>
                  <span class="text">{{items.patientSex== 1?'男':'女'}}&nbsp;{{items.patientAge}}&nbsp;{{parseInt(items.isAttachment) === 0 ? "无影像资料" : "有影像资料"}}</span>
                </article>
              </figcaption>
              <span class="time"> {{items.createTime | timeFormat}}</span>
            </article>
            <p class="userList-no-data" v-show="userListEnd.length == 0">没有找到相应的患者</p>
          </section>
          <section class="userlist-mainList viewItem" data-role="ut-tabs-3"
                   v-show="userListStatus.status == 3">
            <article v-show="userListBack.length > 0" @click="transformData(items,index)"
                     :class="[{ active : userActive == index }, 'userlist-mainList-item']"
                     v-for="(items,index) in userListBack" v-bind:data-account="items.caseId"
                     v-bind:data-img="items.logoUrl"
                     v-bind:data-name="items.patientName" v-bind:data-pid="items.patientId"
                     v-bind:data-age="items.patientAge" v-bind:data-logo="items.logoUrl"
                     v-bind:data-ctype="items.consultationState" v-bind:data-type="items.caseType"
                     v-bind:data-sex="items.patientSex" v-bind:data-reason="items.returnReason"
                     v-bind:data-consultationId="items.consultationId">
              <figure class="userlist-item-img">
                <img v-bind:src="items.logoUrl" alt="">
                <p style="display: none;"></p>
              </figure>
              <figcaption class="userlist-item-base-msg">
                <h3>
                  <span class="name">{{(items.patientName.length > 4 ? items.patientName.substring(0, 3) + '...' : items.patientName)}}</span>
                  <span class="category ">{{items.state | checkState }}</span>
                </h3>
                <article>
                  <span class="text" v-show="items.returnReason == 0">{{items.patientSex== 1?'男':'女'}}&nbsp;{{items.patientAge}}&nbsp;{{parseInt(items.isAttachment) === 0 ? "无影像资料" : "有影像资料"}}</span>
                  <span class="text" v-show="items.returnReason != 0">{{items.returnReason}}</span>
                </article>
              </figcaption>
              <span class="time"> {{items.createTime | timeFormat}}</span>
            </article>
            <p class="userList-no-data" v-show="userListBack.length == 0">没有找到相应的患者</p>
          </section>
        </section>
        <footer class="user-list-footer">
          <button class="refresh-user-list-btn" @click="refreshList()">
            <i class="icon-refresh-btn"><span>点击刷新</span></i>
          </button>
        </footer>
      </aside>
      <record :recodrdData="message" v-if="noData"></record>
    </div>
    <footer-list></footer-list>
    <check-history v-if="$store.state.checkHistoryFlag"></check-history>
  </div>
</template>
<script>
  import {common, modules} from "common";
  import api from './common/js/util/util';
  import axios from "axios";
  import TabsViewChange from "tabView";
  import downSelector from "downSelector";
  import ymd from "ymd";
  import record from "./record";
  import communication from "./communication";
  import Vue from "vue";
  import footerList from "./Footer"
  import headerList from "./Header"
  import checkHistory  from './components/CheckHistory'

  import store from "@/store/store";

  Vue.filter('timeFormat', function (time, a) {
    let result = "";
    let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth() + 1,
      d = date.getDate(),
      h = date.getHours(),
      mm = date.getMinutes();
    let nowFirst = new Date(y + "/" + (m >= 10 ? m : "0" + m) + "/" + (d >= 10 ? d : "0" + d)).getTime(),
      timeFirst = new Date(time.substring(0, 10).replace(/-/g, "/")).getTime();
    let week = new Date(timeFirst).getDay();
    if (nowFirst === timeFirst) {
      result = time.substring(10, 16);
    } else if (parseInt((nowFirst / (60 * 60 * 24 * 1000) + 4) / 7) === parseInt((timeFirst / (60 * 60 * 24 * 1000) + 4) / 7)) {
      result = "星期" + common.numToChinese(week);
    } else {
      result = time.substring(0, 16);
    }
    return result;
  });

  Vue.filter('checkState', function (type, a) {
    let result = "";
    switch (parseInt(type)) {
      case 0:
        result = "咨询";
        break;
      case 1:
        result = "复诊";
        break;
      case 2:
        result = "预约手术";
        break;
      case 3:
        result = "待检查";
        break;
    }
    return result;
  });

  export  default{
    name: 'userList',
    data(){
      return {
        userListData: "",
        userListLoading: [],
        userListEnd: [],
        userListBack: [],
        userActive: '',
        questionShow: '',
        userName: "默认",
        message: {},
        userListStatus: {
          status: "1",
          first: true,
          second: false,
          third: false
        },
        age: 90,
        noData: false,
        data: '',
        targetData: {
          account: '',
          avatar: ''
        },
        filterMethod: {
          conType: 0,
          conState: ""
        },
        fastRelyStatusParent:false,  //快捷提问
        loadingShow:false
      }
    },
    components: {
      record,
      communication,
      headerList,
      footerList,
      checkHistory
    },
    watch: {
      'message.createTime': function () {
        this.noData = true;
        this.$router.push({
          name: "baseInfo",
          params: {
            num: this.data
          }
        });
      },
      '$store.state.userListStatus':function(){
        this.init();
      }
    },
    methods: {
      showMsgFromChild(data){
         // alert(data);
      },
      init(){
//        localStorage.setItem("patientId", "1497856903972");
//        localStorage.setItem("caseId", "1498632663942");
       // localStorage.setItem("userId", "1489998865491");
        this.$store.state.searchStatus =true;
        this.getUserList();
      },
      //给子组件传值..
      transformData: function (items, index) {
          console.log("transformData");
        this.message = items;
        this.userActive = index;
        this.$store.commit('setPatientId',items.patientId);
        this.$store.state.patientId = items.patientId;
        this.$store.state.caseId = items.caseId;
        this.$store.state.patientName=items.patientName;
        this.$store.state.consultationId=items.consultationId;

        let data = JSON.stringify(items);
        this.data = data;
        this.targetData.account = "0_" + items.caseId;
        this.targetData.avatar = items.logoUrl;
        this.fastRelyStatusParent = false;
      },
      //三个状态的点击切换（沟通中、已结束、被退回）
      statusChange: function (status) {
        //Tab 切换
        this.userListStatus.status = status;
        if (status == 1) {
          this.userListStatus.first = true;
          this.userListStatus.second = false;
          this.userListStatus.third = false;
          this.message.userController = true;
        } else if (status == 2) {
          this.userListStatus.first = false;
          this.userListStatus.second = true;
          this.userListStatus.third = false;
          this.message.userController = false;
        } else if (status == 3) {
          this.userListStatus.first = false;
          this.userListStatus.second = false;
          this.userListStatus.third = true;
          this.message.userController = true;
        }


//        new TabsViewChange({
//          tabsInner: $(".userlist-status-box.tabsInner"),
//          views: $(".userList-inner-content.viewInner"),
//          changeCallback: function () {
//            $(".center-inner").addClass("no-content");
//            if ($(".userlist-status-item.active").attr("data-role") === "ut-tabs-2") {
//              $(".user-controller").addClass("disabled");
//              $(".user-controller-input").attr("readonly", "readonly")
//            } else {
//              $(".user-controller").removeClass("disabled");
//              $(".user-controller-input").removeAttr("readonly")
//            }
//
//
//            if ($(".userlist-status-item.active").attr("data-role") === "ut-tabs-1") {
//              console.log("111");
//              if ($(".userlist-mainList[data-role='ut-tabs-1'] .active").size() === 1) {
//                $(".center-inner").removeClass("no-content");
//              }
//            }
//          },
//          role: "ut-tabs"
//        });
      },
      //获取患者列表
      getUserList: function (param, type) {
        let _this = this;
        _this.userListData = '';
        _this.userListLoading = [];
        _this.userListEnd = [];
        _this.userListBack = [];
        let dataValue = param ? param : {
          conType: 0,
          conState: ""
        };
//        dataValue = $.extend(false, {
//          customerId:  _this.$store.state.userId, //148999886548
//          logoUseFlag: 3
//        }, dataValue);
        dataValue=Object.assign(dataValue,{
          customerId:  _this.$store.state.userId, //148999886548
          logoUseFlag: 3
        })
        console.log($)
        store.commit("startLoading")
        api.ajax({
          url: "/call/customer/case/consultation/v1/getMapListByCustomerId/",
          method: "POST",
          data:  dataValue,
          done(res) {
            // console.log(222);
            store.commit("stopLoading")
            let userListLoading = [];
            let userListEnd = [];
            let userListBack = [];
            if (res.responseObject.responseData.dataList && res.responseObject.responseStatus == true) {
              let dataList = res.responseObject.responseData.dataList;
              if (dataList.length > 0) {
                $(dataList).each(function (index, element) {
                  switch (parseInt(element.consultationState)) {
                    case 0:
                      userListLoading.push(element);
                      break;
                    case 1:
                      userListEnd.push(element);
                      break;
                    case 2:
                      userListBack.push(element);
                      break;
                  }
                });
                _this.userListLoading = userListLoading;
                _this.userListEnd = userListEnd;
                _this.userListBack = userListBack;
              }
              _this.filterInit(param);
            } else {
              _this.userListLoading = userListLoading;
              _this.userListEnd = userListEnd;
              _this.userListBack = userListBack;
            }
          },
          fail(err) {
            console.log("请求失败：" + err);
          }
        });
      },
      filterTemplateList: function (data) {
        return '<li class="custom-selector-item secondListTitle ' + (parseInt(data.treeLevel) === 3 ? 'result-item' : '') + '" data-down-role="' + data.regionId + '" data-level="' + data.treeLevel + '"><span>' + data.regionName + '</span></li>';
      },
      toggleFilterList: function () {

        var that = this;
        var _that = this;
        $("#sex-selector").downSelector({
          list: [{
            titleName: "firstListTitle",
            listName: "firstList"
          }],
          resultCallback: function (e) {
            var sex = (e.find("span").text() === "男") ? 1 : 2;
            if (e.hasClass("recover")) {

              that.filterMethod = $.extend(false, that.filterMethod, {selectSex: ""});
              that.getUserList(that.filterMethod, "filter");
              $("#sex-selector .firstListTitle").text("性别");
            } else {
              that.filterMethod = $.extend(false, that.filterMethod, {selectSex: sex});
              that.getUserList(that.filterMethod, "filter");
            }
          }
        });

        $("#area-selector").downSelector({
          list: [{
            titleName: "firstListTitle",
            listName: "firstList"
          },
            {
              titleName: "secondListTitle",
              listName: "secondList"
            }],
          resultCallback: function (e) {
            var that = this;
            var selectProvince = $("#ev-provice-list .active").attr("data-down-role"),
              selectCity = $("#ev-city-list .active").attr("data-down-role");

            if (e.hasClass("recover")) {
              if (e.parents(".custom-selector-second").hasClass("firstList")) {
                that.filterMethod = $.extend(false, that.filterMethod, {
                  selectProvince: "",
                  selectCity: ""
                })
                _that.getUserList(that.filterMethod, "filter");
                $("#area-selector .firstListTitle").text("地区");
              } else if (e.parents(".custom-selector-second").hasClass("secondList")) {
                that.filterMethod = $.extend(false, that.filterMethod, {selectProvince: selectProvince});
                _that.getUserList(that.filterMethod, "filter");
                $("#area-selector .firstListTitle").text($("#ev-provice-list .active").text());
              }
            } else {
              that.filterMethod = $.extend(false, that.filterMethod, {
                selectCity: selectCity
              })
              _that.getUserList(that.filterMethod, "filter");
            }
            $("#area-selector .firstListTitle").text($("#area-selector .firstListTitle").text().length > 3 ? $("#area-selector .firstListTitle").text().substring(0, 3) + "..." : $("#area-selector .firstListTitle").text());
          }
        });
        $("#age-selector").downSelector({
          list: [{
            titleName: "firstListTitle",
            listName: "firstList"
          }],
          resultCallback: function (e) {
            var age = e.find("span").text();
            var ageList = age.split("-");
            if (ageList.length == 2) {
              age = ageList[0] + ',' + ageList[1];
            } else {
              age = "90,200";
            }

            if (e.hasClass("recover")) {
              $("#age-selector .firstListTitle").text("年龄");
              that.filterMethod = $.extend(false, that.filterMethod, {selectAge: ""})
            } else {
              that.filterMethod = $.extend(false, that.filterMethod, {selectAge: age})
            }

            that.getUserList(that.filterMethod, "filter");
          }
        });
        $("#data-selector").downSelector({
          list: [{
            titleName: "firstListTitle",
            listName: "firstList"
          },
            {
              titleName: "secondListTitle",
              listName: "secondList"
            },
            {
              titleName: "thirdListTitle",
              listName: "thirdList"
            }],
          resultCallback: function (e) {

            var y = e.attr("data-year"),
              m = e.attr("data-month"),
              d = e.text();
            $("#data-selector .custom-selector-title").text();

            if (e.hasClass("recover")) {
              if (e.parents(".custom-selector-second").hasClass("firstList")) {
                that.filterMethod = $.extend(false, that.filterMethod, {
                  selectDate: ""
                });
                that.getUserList(that.filterMethod, "filter");
                $("#data-selector .custom-selector-title").text("日期");
              } else if (e.parents(".custom-selector-second").hasClass("secondList")) {
                that.filterMethod = $.extend(false, that.filterMethod, {
                  selectDate: $("#data-selector .firstList .active").text()
                })
                that.getUserList(that.filterMethod, "filter");
                $("#data-selector .custom-selector-title").text($("#data-selector .firstList .active").text());
              } else if (e.parents(".custom-selector-second").hasClass("thirdList")) {
                that.filterMethod = $.extend(false, that.filterMethod, {
                  selectDate: y + "-" + m
                });
                that.getUserList(that.filterMethod, "filter");
                $("#data-selector .custom-selector-title").text(y.substring(2, 4) + "/" + m);

              }
            } else {
              that.filterMethod = $.extend(false, that.filterMethod, {
                selectDate: y + "-" + m + "-" + d
              });
              that.getUserList(that.filterMethod, "filter");
              $("#data-selector .custom-selector-title").text(y.substring(2, 4) + "/" + m);
            }
          }
        });
        if ($("#data-selector .firstList [data-down-role='dataSelect']").length === 0) {
          ymd({
            year: $("#data-selector .firstList"),
            month: $("#data-selector .secondList"),
            day: $("#data-selector .thirdList")
          });
        }
      },
      filterInit: function (param) {
        if ($("#ev-provice-list .secondListTitle").length === 0) {
          this.getArea({
            id: "",
            treeLevel: "2",
            container: $("#ev-provice-list")
          });
        }
        this.toggleFilterList();
        this.createAgeList();//年龄列表至底...
        this.searchPatient();
        this.filterMethod = param || {
            conType: 0,
            conState: ""
          }
      },
      //年龄列表至底...
      createAgeList: function () {
        $("#age-selector .firstListTitle").on("click", function () {
          setTimeout(function () {
            $("#age-selector .firstList").scrollTop(1485);
          }, 10);
        })
      },
      //获取省市区列表
      getArea: function (param) {
        var that = this;
        let dataValue = {
          parentId: param.id,
          isValid: "1",
          firstResult: "0",
          maxResult: "9999",
          regionName: "",
          treeLevel: param.treeLevel
        };

        axios({
          method: "post",
          url: "/call/comm/data/baseinfo/v1/getRegionList/",
          data: dataValue,
          responseType: 'json',
          transformRequest: [function (data) {
            data = "paramJson=" + JSON.stringify(data);
            return data;
          }],
          before: function () {
           // common.loading.show();
          }
        }).then(function (res) {
          if (res.data.responseObject.responseData) {
            var dataList = res.data.responseObject.responseData.dataList;
            if (dataList && dataList.length !== 0) {
              $(dataList).each(function (index, element) {
                param.container.append(that.filterTemplateList(element))
              })
            }
            that.selectArea();
          }
        })
      },
      selectArea: function () {
        var that = this;
        $(".custom-selector-item").off("click").on("click", function () {
          if (parseInt($(this).attr("data-level")) === 2) {
            $("#ev-city-list").css("display", "inline-block").children().not(".recover").remove();
            that.getArea({
              id: $(this).attr("data-down-role"),
              treeLevel: "3",
              container: $("#ev-city-list")
            });
          } else if (parseInt($(this).attr("data-level")) === 3) {
            $("#ev-city-list").hide();
            $("#area-selector .firstListTitle").attr("data-id", $(this).attr("data-down-role"))
          }
        })
      },
      //患者搜索...
      searchPatient: function () {
        var that = this;
        $(".main-search").on("keyup", function (e) {
          if ($(this).val().length !== 0) {
            clearTimeout(this.time);
            var _C = $(this).val();
            this.time = setTimeout(function () {
              if (e.keyCode == 13) {
                that.filterMethod = $.extend(false, that.filterMethod, {
                  selectName: _C,
                });
                that.getUserList(that.filterMethod, "filter");
                $("#ev-user-inner").addClass("search-result");
              }
            }, 300);

            if ($(this).val().length > 20) {
              $(this).val($(this).val().substring(0, 20));
            }
          }
        });
        $(".main-header-search .icon-header-search").off("click").on("click", function () {
          var _C = $(".main-header-search .main-search").val();
          if (_C.length !== 0) {
            that.filterMethod = $.extend(false, that.filterMethod, {
              selectName: _C,
            });
            that.getUserList(that.filterMethod, "filter");
            $("#ev-user-inner").addClass("search-result");
          }
        })
      },
      refreshList: function () {
        let that = this;
        that.getUserList(that.filterMethod, "refresh");

//          if ($(".userlist-mainList[data-role='ut-tabs-1'] .userlist-mainList-item .userlist-item-img p:visible").size() === 0) {
//            $(".userlist-status-item[data-role='ut-tabs-1']").removeClass("new");
//          }
//        $(".search-result-tips a").on("click", function () {
//          that.filterMethod = {
//            conType: 0,
//            conState: "",
//          };
//          $("#ev-user-inner").removeClass("search-result");
//        })
      },

    }, mounted(){
     // this.init();
    }
  }
</script>
<style lang="scss" type="text/css" rel="stylesheet/scss">
  @import "./scss/base.scss";

  .userList {
    width: 100%;
    height: 100%;
  }

  .userlist-status {
    background-color: #fff;
    box-sizing: border-box;
    padding: 10px 14px;
    &-box {
      text-align: center;
      font-size: 0;
      border: 1px solid #ACB1BE;
      border-radius: 4px;
    }
    &-item {
      display: inline-block;
      font-size: 14px;
      color: #808080;
      padding: 12px 0;
      width: 33.3%;
      box-sizing: border-box;
      border-right: 1px solid #acb1be;
      cursor: pointer;

      &.new {
        position: relative;
        &:after {
          content: '';
          // @include circle(8px, rgba(242, 62, 51, 0.90));
          box-shadow: 0 1px 1px 0 rgba(45, 17, 14, 0.15);
          position: absolute;
          right: 5px;
          top: 5px;
        }

      }
      &:nth-last-child(1) {
        border-right: none;
      }
      &.active {
        background-color: #7a8ec1;
        color: #fff;
      }
    }
  }

  .userlist-sortType {
    background-color: #fff;
    text-align: center;
    padding: 40px 0 12px 0;
    i {
      display: inline-block;
      cursor: pointer;
      margin-top: 5px;
    }
    &-item {
      display: inline-block;
      color: #222;
      border-right: 1px solid #e4e4e4;
      width: 90px;
      &:nth-last-child(1) {
        border-right: none;
      }
    }

    .custom-selector {
      display: inline-block;
      cursor: pointer;

      & > h3 {
        font-weight: normal;
        font-size: 16px;
        color: #808080;
        display: inline-block;
        min-width: 30px;
      }
      .time-title {
        font-size: 14px;
        font-weight: normal;
        margin-top: 15px;
      }

      .custom-selector-second-box {
        box-shadow: 0 0 8px 0 rgba(153, 167, 208, 0.35);
        border-radius: 4px;
        background-color: #fff;
        position: absolute;
        z-index: 5;
        text-align: left;
        font-size: 0;
        width: auto;
        margin-left: -20px;
        margin-top: 10px;

      }

    }

    #area-selector {
      h3 {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 65px;
      }
      .custom-selector-second {
        width: auto;
      }
    }

  }

  .custom-selector-second {
    display: none;
    width: 80px;
    font-size: 12px;
    vertical-align: top;
    text-align: left;
    box-sizing: border-box;
    padding: 0 15px;
    max-height: 310px;
    overflow: auto;
    &.custom-selector-second-list {
      right: -100%;
    }
    & > .custom-selector-item {
      margin: 20px 0;
      width: 100%;
      & > span {
        display: block;
      }
      &.active > span {
        color: #2899e6;
      }
    }
  }

  .time-title {
    font-size: 13px;
    color: #909090;
    margin-bottom: 24px;
  }

  .userlist-mainList {
    overflow: auto;
    height: 80%;
  }

  .userlist-mainList-item {
    padding: 25px 20px 25px 40px;
    font-size: 0;
    background-color: #fff;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    display: flex;
    width: 100%;
    &.active {
      background-color: #f4f6fb;
      box-shadow: 0 0 8px 0 rgba(179, 205, 199, 0.45);
    }
    &:hover {
      background-color: #f4f6fb;
      box-shadow: 0 0 8px 0 rgba(179, 205, 199, 0.45);
      //&:before {
      //  content: '';
      //  display: block;
      //  position: absolute;
      //  top: 0;
      //  left: 0;
      //  bottom: 0;
      //  background-color: #4fc8d5;
      //  width: 5px;
      //}
    }
    .userlist-item-img {
      display: inline-block;
      vertical-align: middle;
      margin-right: 12px;
      position: relative;
      & > p {
        font-size: 15px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 15px;
        background: rgba(242, 62, 51, 0.90);
        box-shadow: 0 1px 1px 0 rgba(45, 17, 14, 0.35);
        border-radius: 10px;
        padding: 2px 6px 3px;
        position: absolute;
        top: 0;
        right: -10px;
        display: none;
      }
      & > img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        vertical-align: top;
      }
    }
    .userlist-item-msg {
      display: table-cell;
      width: 100%;
      vertical-align: top;
      font-size: 0;
      padding-left: 10px;
    }
    & > .time {
      font-size: 12px;
      color: #808080;
      letter-spacing: 0;
      line-height: 12px;
      position: absolute;
      right: 25px;
      top: 32px;
    }

  }

  .userlist-item-base-msg {
    //margin-top: 6px;
    display: inline-block;
    vertical-align: middle;
    width: 255px;
    & > h3 {
      font-size: 16px;
      color: #222222;
      display: inline-block;
      vertical-align: middle;
      padding-right: 5px;

      .name {
        font-size: 18px;
        color: #222222;
        letter-spacing: 0;
        line-height: 18px;
        padding: 0 8px 0 0;
      }

      .category {
        font-size: 13px;
        color: #6b748c;
        letter-spacing: 0;
        line-height: 13px;
        padding-left: 8px;
        border-left: 1px solid #e1e2e7;
        font-weight: 400;
        display: inline-block;
        vertical-align: middle;
        max-width: 125px;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        overflow: hidden;
        &.short {
          max-width: 65px;
        }
        span {
          margin-right: 8px;
        }

      }
    }
    .userlist-item-msg-category {
      //@include clearfix();
      display: inline-block;
      vertical-align: middle;
      color: #222;
      border-left: 1px solid #e1e2e7;
      padding-left: 5px;

      & > span {
        padding-right: 7px;
        font-size: 12px;
      }
    }
    & > .time {
      float: right;
      font-size: 12px;
      color: #666;
    }
    .text {
      font-size: 13px;
      color: #808080;
      letter-spacing: 0;
      line-height: 13px;
      margin-top: 10px;
      display: inline-block;
      white-space: nowrap;
    }
  }

  .userlist-item-msg-item {
    margin-top: 14px;
    font-size: 0;
    & > span {
      font-size: 12px;
      color: #666;
    }
    .sex {
      margin-right: 10px;
    }
    .age {
      margin-right: 10px;
    }
  }

  .user-list-footer {
    background: rgba(255, 255, 255, 0.97);
    box-shadow: 0 2px 6px 0 rgba(153, 167, 208, 0.62);
    border-radius: 4px;
    width: 350px;
    height: 40px;
    text-align: center;
    position: absolute;
    bottom: 50px;
    //opacity: .67;
    left: 20px;
    &:before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      height: 100%;
    }
    .refresh-user-list-btn {
      display: inline-block;
      vertical-align: middle;
    }
    .icon-refresh-btn {
      cursor: pointer;
      span {
        font-size: 16px;
        color: #7A8EC1;
        vertical-align: middle;
        padding-left: 4px;
      }
    }
  }

  .search-result-tips {
    display: block;
    text-align: center;
    background: #E8F6FD;
    height: 33px;
    line-height: 33px;
    padding: 0 15px;
    box-sizing: border-box;
    position: absolute;
    width: 356px;
    margin-left: 14px;
    margin-top: -28px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s linear;
    &.show {
      opacity: 1;
      visibility: visible;
    }
    & > p {
      font-size: 13px;
      color: #6B748C;
      display: inline-block;
      a, span {
        font-size: 13px;
        color: #F23E34;
        display: inline;
      }

    }
  }

  .userList-inner-content {
    overflow: auto;
    height: 100%;
  }

  .userList-no-data {
    font-size: 14px;
    color: #AAAAAA;
    text-align: center;
    margin-top: 52px;
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
          max-width: 168px;
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
  }

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

  .medical-record-main {
    width: 100%;
    padding: 25px 28px;
    box-sizing: border-box;
    // height: 630px;
    //overflow: auto;
    //overflow-x:hidden;
  }

  .base-title {
    width: 54px;
    font-size: 13px;
    color: #555555;
    letter-spacing: 0;
    line-height: 14px;
    margin-right: 8px;
    text-align: right;
    display: inline-block;
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
  }

  .sick-text {
    font-size: 14px;
    color: #808080;
    letter-spacing: 0;
    line-height: 14px;
  }

  .base-info {
    li {
      margin-top: 15px;
    }
    .select-120 {
      min-width: 119px;
    }
    .select-248 {
      min-width: 248px;
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
    header {
      position: relative;
      margin-bottom: 30px;
      margin-top: 50px;
      z-index: 1;
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
    h2 {
      font-size: 12px;
      color: #AAAAAA;
      letter-spacing: 0;
      line-height: 12px;
      margin: 0 auto;
      width: 56px;
      background: #fff;
      text-align: center;
      position: relative;
      z-index: 10;
    }
    footer {
      .base-saveBtn {
        background: #7A8EC1;
        border-radius: 4px;
        width: 70px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #fff;
        text-align: center;
      }
    }

    .userlist-sortType {
      background: #f9f9f9;
      border: 1px solid #e1e2e7;
      border-radius: 4px;
      padding: 5px 10px;
      font-size: 14px;
      line-height: 14px;
      height: 18px;
      width: 230px;
      display: inline-block;
      position: relative;
      .userlist-sortType-item {
        border: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        .custom-selector {
          width: 100%;
          height: 100%;
          .custom-selector-title {
            width: 100%;
            font-size: 14px;
            height: 100%;
            line-height: 18px;
            text-align: left;
          }
          .icon-downArrow:after {
            position: absolute;
            top: 10px;
            right: 10px;
          }
          .custom-selector-second-box {
            margin-left: 0;
          }
        }
      }
    }
  }

  .main-sick {
    .main-title {
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

  .old-sick .old-sick-history-list {
    margin-top: 30px;
    textarea {
      height: auto;
      padding: 5px;
    }
  }

  .medical-title {
    white-space: nowrap !important;
  }

  .body-check {
    .select-130 {
      min-width: 118px;
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

    select {
      background: #F9F9F9;
      border: 1px solid #E1E2E7;
      border-radius: 4px;
      padding: 5px 0 5px 10px;
      font-size: 14px;
      line-height: 14px;
      min-width: 95px;
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
        background: url("/static/image/img00/employee/dot.png") no-repeat;
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

  .center-inner-userlist {
    background-color: #fff;
    color: #fff;
    width: 385px;
    float: left;
    margin-left: -100%;
    height: 100%;
    border-right: 1px solid #ededed;
    box-sizing: border-box;
  }

</style>
