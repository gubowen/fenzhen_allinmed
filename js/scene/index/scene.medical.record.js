/**
 * @Desc：
 * @Usage:病例单
 * @Notify：
 * @Depend：
 *
 * Created by gubowen on 2017/3/2
 */
define(['jquery', "text!medicalRecordTemplate", "tabView", "toJSON", "bigPicShow", "downSelector", "common", "autosize", "video", "videoAllinmd"], function ($, text, TabsViewChange, toJSON, bigPicShow, downSelector, common, autosize, video, AllinmdPlayer) {
    var medicalRecord = {
        init: function (userInfo) {
            //加载模板
            this.template = text;
            this.templateUrl();
            //个人信息初始化
            userInfo.name != "" ? this.userData.name = userInfo.name : this.userData.name = "";
            userInfo.sex != "" ? this.userData.sex = userInfo.sex : this.userData.sex = "";
            userInfo.logo != "" ? this.userData.logo = userInfo.logo : this.userData.logo = "";
            userInfo.type != "" ? this.userData.type = userInfo.type : this.userData.type = "";
            userInfo.age != "" ? this.userData.age = userInfo.age : this.userData.age = "";
            userInfo.category != "" ? this.userData.category = userInfo.category : this.userData.category = "";

            //  this.userData.sex = "2";
            //  this.userData.age="60";

            $("img", ".medical-record-img").attr("src", this.userData.logo);
            $(".name", ".medical-record-userdata").text(this.userData.name);
            $(".age", ".medical-record-userdata").text(this.userData.age + "岁");
            // switch (this.userData.sex) {
            //     case "0" :
            //         $(".J-sex").addClass("icon-sex-child").removeClass("icon-sex-male").removeClass("icon-sex-female");
            //         break;
            //     case "1" :
            //         $(".J-sex").addClass("icon-sex-male").removeClass("icon-sex-female").removeClass("icon-sex-child");
            //         break;
            //     case "2" :
            //         $(".J-sex").addClass("icon-sex-female").removeClass("icon-sex-male").removeClass("icon-sex-child");
            //         break;
            //     default:
            //         $(".J-sex").addClass("icon-sex-male").removeClass("icon-sex-female").removeClass("icon-sex-child");
            //         break;
            // }
            //性别-汉字
            switch (this.userData.sex) {

                case "1" :
                    $(".J-sex").html("男");
                    break;
                case "2" :
                    $(".J-sex").html("女");
                    break;
                default:
                    $(".J-sex").html("男");
                    break;
            }


            var userType = "";
            switch (this.userData.type) {
                case "0" :
                    userType = "咨询";
                    break;
                case "1" :
                    userType = "复诊";
                    break;
                case "2" :
                    userType = "预约手术";
                    break;
                case "3" :
                    userType = "待检测";
                    break;
            }
            if (this.userData.category != "" && typeof (this.userData.category) != "undefined") {
                $(".medical-record-title .category").text(this.userData.category);
            } else {
                $(".medical-record-title .category").text(userType);// 咨询/预约手术 0-咨询1-复诊2-手术直约 3-待检查
            }


            this.tabsChange();
            this.dataInit();
            this.textSubstr();
            // this.remark();   //备注在scene.record.remark.js 文件里控制
        },
        userData: {
            name: "",        //患者姓名
            sex: "",         //1 ： 男  2 ：  女
            logo: "",        //患者头像
            type: "",        //咨询/预约手术 0-咨询1-复诊2-手术直约 3-待检查
            age: "",         //年龄
            category: ""      //
        },
        XHRList: {
            getBaseInfo: "/call/customer/patient/baseinfo/v1/getMapList/",
            saveBaseInfo: "/call/customer/patient/baseinfo/v1/save/",

            mainSpeakInfo: "/call/customer/patient/case/v1/getMainMapById/", //主诉
            MedicalReport:'/call/customer/patient/case/v1/getMapById/', //问诊单接口-（提供主诉数据）
            bodyCheckSearch: "/call/customer/patient/case/physical/getMapList/",
            bodyCheckSave: "/call/customer/patient/case/physical/create/",
            oldSickSearch: "/call/customer/patient/case/history/getMapList/",
            oldSickSave: "/call/customer/patient/case/history/saveOrUpdate/",
            getMainSick: "/call/patient/case/hpi/v1/getMapById/",
            saveMainSick: "/call/patient/case/hpi/v1/save/",
            majorCheck: "/call/customer/patient/case/attachment/getMapList/",
            addressSearch: "/call/comm/data/baseinfo/v1/getRegionList/",
            nationSearch: "/call/comm/data/baseinfo/v1/getNationalityList/"
        },
        imageUrl: {
            childFront: "/image/img00/employee/child_front.png",
            childBack: "/image/img00/employee/child_back.png",
            maleFront: "/image/img00/employee/male_front.png",
            maleBack: "/image/img00/employee/male_back.png",
            femaleFront: "/image/img00/employee/female_front.png",
            femaleBack: "/image/img00/employee/female_back.png"
        },
        templateUrl: function () {
            $("[data-template='tpl-medical-record']").html('<aside class="medical-record-remark" data-template="tpl-medical-record-remark"> </aside>');
            $("[data-template='tpl-medical-record']").append(this.template).attr("data-users", localStorage.getItem("caseId"));
        },
        tabsChange: function () {
            var that = this ;
            new TabsViewChange({
                tabsInner: $(".tabsInner.medical-record-tabs"), //导航tabs容器（并非每个tabsItem，为其父容器
                views: $(".viewInner.medical-record-form"), //tabs对应view容器
                changeCallback: function (index) { //tabs切换时执行回调
                    //  console.log('喵')
                    if(index == 5){
                        that.getMajorCheck();
                    }

                },
                role: "mr-record" //tabs与View对应的角色名，插件本身会按照索引号实现点击切换显示
            });
        },
        getBaseData: function (data) {
            var that = this;
            that.getBaseInfo();        //获取基本信息
            that.mainSpeakInfo(data);      //主诉信息查询
            that.getMainSick();        //现病史信息
            that.oldSickSearch();      //既往史查询
            that.getMajorCheck();      //专科检查
            // that.getData(data);        //主诉问题

        },
        dataInit: function () {
            var that = this;
            that.bodyCheckSearch();    //体格检查-查询
            that.provinceShow();       //省
            that.cityShow();           //市
            that.districtShow();       //区


            //籍贯
            $("#base-info-address").downSelector({
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
                    }
                ],
                all: true,
                resultCallback: function (e) {
                    //  var dataValue = e.attr("data-value");
                    var provinceValue = $(".active", "#base-info-address .firstList").attr("data-value");
                    var cityValue = $(".active", "#base-info-address .secondList").attr("data-value");
                    var districtValue = $(".active", "#base-info-address .thirdList").attr("data-value");
                    if (provinceValue == 0) {
                        $("#base-info-address").find("h3").attr("data-province", 0).attr("data-city", 0).attr("data-district", 0);
                    }
                    else if (provinceValue) {
                        //  console.log(cityValue);

                        $("#base-info-address").find("h3").attr("data-province", provinceValue);
                        if (cityValue) {
                            $("#base-info-address").find("h3").attr("data-city", cityValue);
                        }
                        if (districtValue) {
                            $("#base-info-address").find("h3").attr("data-district", districtValue);
                        }
                    }

                }
            });

            $("#base-info-born-address").downSelector({
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
                    }
                ],
                all: true,
                resultCallback: function (e) {
                    var provinceValue = $(".active", "#base-info-born-address .firstList").attr("data-value");
                    var cityValue = $(".active", "#base-info-born-address .secondList").attr("data-value");
                    var districtValue = $(".active", "#base-info-born-address .thirdList").attr("data-value");

                    if (provinceValue) {
                        $("#base-info-born-address").find("h3").attr("data-province", provinceValue);

                        if (cityValue) {
                            $("#base-info-born-address").find("h3").attr("data-city", cityValue);
                        }
                        if (districtValue) {
                            $("#base-info-born-address").find("h3").attr("data-district", districtValue);
                        }

                    } else if (provinceValue == 0) {
                        $("#base-info-born-address").find("h3").attr("data-province", 0).attr("data-city", 0).attr("data-district", 0);
                    }

                }
            });

            $(".detail-saveBtn", ".base-info").on("click", function () {
                if (!$(this).hasClass("oneClick")) {
                    that.saveBaseInfo();        //保存基本信息
                }
            });

            $(".detail-saveBtn", '.body-check').on('click', function () {
                if (!$(this).hasClass("oneClick")) {
                    that.bodyCheckSave();       //体格检查-创建/修改
                }
            });

            $(".detail-saveBtn", '.main-sick').on('click', function () {
                if (!$(this).hasClass("oneClick")) {
                    that.saveMainSick();        //现病史保存
                }
            });

            $(".detail-saveBtn", '.major-check').on('click', function () {
                    if (!$(this).hasClass("oneClick")) {
                        that.saveMainSick();        //专科检查
                    }
                }
            );

            $(".detail-saveBtn", ".old-sick").on("click", function () {
                var flag = false;
                var list = [];
                $(".old-sick").find("textarea").each(function () {
                    if ($(this).val() != 0) {
                        var content = {
                            id: $(this).attr("data-id"),
                            caseHistoryType: $(this).attr("data-type"),
                            caseHistoryDesc: $(this).val()
                        };
                        list.push(content);
                        flag = true;
                    }
                });
                if (!flag) {
                    alert("至少输入一项病史！");
                } else {
                    that.oldSickSave(list)

                }
            });

            //textare自适应高度
            autosize(document.querySelectorAll('.autoSize'));
        },
        getBaseInfo: function () {             //获取基本信息
            var that = this;
            var ageHtml = "";
            ageHtml += '<option  value="">请选择</option>';
            for (var i = 15; i <= 60; i++) {
                ageHtml += "<option  value=" + i + ">" + i + "</option>";
            }
            $(".J-marriageAge").append(ageHtml);
            //  $(".J-marriageAge").find("option[value='22']").attr("selected", true);
            that.nationSearch();       //民族
            var data = {
                isValid: "1",
                firstResult: "0",
                maxResult: "1",
                patientId: localStorage.getItem("patientId")     //患者ID 假数据
            };
            $.ajax({
                url: that.XHRList.getBaseInfo,
                type: "POST",
                dataType: 'json',
                data: {
                    paramJson: $.toJSON(data)
                },
                beforeSend: function () {
                    common.loading.show();
                },
                success: function (data) {
                    if (data.responseObject.responseData.dataList && data.responseObject.responseStatus != false) {
                        data = data.responseObject.responseData.dataList[0];
                        $(".J-idIndex").val(data.id);                                                                       //主键ID
                        var nativeAddress = "";
                        if (data.nativeDistrict) {
                            nativeAddress = data.nativeProvince + "-" + data.nativeCity + "-" + data.nativeDistrict;
                        } else if (data.nativeCity) {
                            nativeAddress = data.nativeProvince + "-" + data.nativeCity;
                        } else if (data.nativeProvince) {
                            nativeAddress = data.nativeProvince;
                        } else {
                            nativeAddress = "请选择";
                        }
                        var birthplaceInfo = "";
                        if (data.nativeDistrict) {
                            birthplaceInfo = data.birthplaceProvince + "-" + data.birthplaceCity + "-" + data.birthplaceDistrict;
                        } else if (data.birthplaceCity) {
                            birthplaceInfo = data.birthplaceProvince + "-" + data.birthplaceCity;
                        } else if (data.birthplaceProvince) {
                            birthplaceInfo = data.birthplaceProvince;
                        } else {
                            birthplaceInfo = "请选择";
                        }
                        //所在地区
                        $(".J-address").text(data.province + " " + data.city + " " + data.district).attr("data-province", data.provinceId).attr("data-city", data.cityId).attr("data-district", data.districtId);
                        //社保所在地
                        $(".J-socialAddress").text(data.socialProvince + " " + data.socialCity + " " + data.socialDistrict).attr("data-province", data.socialProvinceId).attr("data-city", data.socialCityId).attr("data-district", data.socialDistrictId);
                        //籍贯
                        $("#base-info-address").find(".firstListTitle").text(nativeAddress).attr("data-province", data.nativeProvinceId).attr("data-city", data.nativeCityId).attr("data-district", data.nativeDistrictId);                                   //籍贯
                        //出生地
                        $("#base-info-born-address").find(".firstListTitle").text(birthplaceInfo).attr("data-province", data.birthplaceProvinceId).attr("data-city", data.birthplaceCityId).attr("data-district", data.birthplaceDistrictId);                           //出生地
                        //手机号
                        $(".J-telephone").text(data.mobile);                                                                 //联系方式
                        //城镇职工；城镇居民；新农合；商业保险；无
                        var socialType = "";
                        switch (data.socialId) {
                            case "0" :
                                socialType = "无";
                                break;
                            case "1" :
                                socialType = "城镇职工";
                                break;
                            case "2" :
                                socialType = "城镇居民";
                                break;
                            case "3" :
                                socialType = "新农合";
                                break;
                            case "4" :
                                socialType = "商业保险";
                                break;
                            default:
                        }
                        $(".J-socialId").text(socialType).attr("data-socialId", data.socialId);                             //社保类型
                        $(".J-nation").find("option[value='" + data.nation + "']").attr("selected", true);                  //民族

                        $(".J-Marriage").find("option[value='" + data.isMarriage + "']").attr("selected", true);            //婚姻状况
                        $(".J-homeAddress").val(data.homeAddress);                                                          //家庭住址
                        $(".J-workplace").val(data.workplace);                                                              //工作单位
                        var fertilityList = data.fertility.split(",");
                        $(".J-fertility-boy").find("option[value='" + fertilityList[0] + "']").attr("selected", true);      //生育状况-子
                        $(".J-fertility-girl").find("option[value='" + fertilityList[1] + "']").attr("selected", true);     //生育状况-女
                        $(".J-spouseStatus").find("option[value='" + data.spouseStatus + "']").attr("selected", true);      //配偶状况
                        $(".J-childrenStatus").find("option[value='" + data.childrenStatus + "']").attr("selected", true);  //子女状况
                        $(".J-marriageAge").find("option[value='" + data.marriageAge + "']").attr("selected", true);        //结婚年龄
                        $(".J-isSmoke").find("option[value='" + data.isSmoke + "']").attr("selected", true);                //吸烟史
                        $(".J-isDrink").find("option[value='" + data.isDrink + "']").attr("selected", true);                //饮酒史
                        $(".J-isNarcotics").find("option[value='" + data.isNarcotics + "']").attr("selected", true);        //毒品史
                        $(".J-parentStatus").find("option[value='" + data.parentStatus + "']").attr("selected", true);      //父母状况
                        $(".J-siblingsStatus").find("option[value='" + data.siblingsStatus + "']").attr("selected", true);  //兄妹状况
                        $(".J-isInfection").find("option[value='" + data.isInfection + "']").attr("selected", true);        //传染病
                        $(".J-isHeredopathia").find("option[value='" + data.isHeredopathia + "']").attr("selected", true);  //遗传病
                        $(".base-input").each(function () {
                            var text = $(this).val();
                            $(this).attr("data-val", text);
                            var text_substr = common.getStrByteLen(text, 18);
                            $(this).val(text_substr);
                        });
                    }
                },
                error: function () {
                    console.log("获取数据失败!");
                }
            });
            common.loading.hide();
        },
        saveBaseInfo: function () {       //保存基本信息
            var that = this;
            //所在地
            var province = "";
            var city = "";
            var district = "";
            var provinceId = $(".J-address").attr("data-province");
            var cityId = $(".J-address").attr("data-city");
            var districtId = $(".J-address").attr("data-district");

            var address = $(".J-address").text();
            var addressList = address.split(" ");
            switch (addressList.length) {
                case 2 :
                    province = addressList[0];
                    city = addressList[1];
                    break;
                case 3 :
                    province = addressList[0];
                    city = addressList[1];
                    district = addressList[2];
                    break;
                default:
                    province = "";
                    city = "";
                    district = "";
            }

            //社保所在地
            var socialAddress = $(".J-socialAddress").text();
            var socialProvinceId = $(".J-socialAddress").attr("data-province");	//string	是	社保省Id
            var socialProvince = "";	//string	是	社保省
            var socialCityId = $(".J-socialAddress").attr("data-city");	//string	是	社保市ID
            var socialCity = "";	//string	是	社保市
            var socialDistrictId = $(".J-socialAddress").attr("data-district");	//string	是	社保区县ID
            var socialDistrict = "";	//string	是	社保区县
            var socialId = $(".J-socialId").attr("data-socialId");

            var socialAddressList = socialAddress.split(" ");
            switch (socialAddressList.length) {
                case 2 :
                    socialProvince = socialAddressList[0];
                    socialCity = socialAddressList[1];
                    break;
                case 3 :
                    socialProvince = socialAddressList[0];
                    socialCity = socialAddressList[1];
                    socialDistrict = socialAddressList[2];
                    break;
                default:
                    socialProvince = "";
                    socialCity = "";
                    socialDistrict = "";
            }

            //籍贯
            var nativePlace = $("#base-info-address").find("h3").text();
            nativePlaceList = nativePlace.split("-");
            var nativeProvinceId = $('#base-info-address').find("h3").attr("data-province");   //string	是	籍贯省Id
            var nativeProvince = "";	//string	是	籍贯省
            var nativeCityId = $('#base-info-address').find("h3").attr("data-city");	//string	是	籍贯市ID
            var nativeCity = "";//string	是	籍贯市
            var nativeDistrictId = $('#base-info-address').find("h3").attr("data-district");	//string	是	籍贯区县
            var nativeDistrict = "";	//string	是	籍贯区县
            switch (nativePlaceList.length) {
                case 2 :
                    nativeProvince = nativePlaceList[0];
                    nativeCity = nativePlaceList[1];
                    nativeDistrict = "";
                    break;
                case 3 :
                    nativeProvince = nativePlaceList[0];
                    nativeCity = nativePlaceList[1];
                    nativeDistrict = nativePlaceList[2];
                    break;
                default:
                    nativeProvince = "";
                    nativeCity = "";
                    nativeDistrict = "";
            }

            //出生地
            var birthplace = $("#base-info-born-address").find("h3").text();
            birthplaceList = birthplace.split("-");
            var birthplaceProvince = "";
            var birthplaceProvinceId = $("#base-info-born-address").find("h3").attr("data-province");
            var birthplaceCity = "";
            var birthplaceCityId = $("#base-info-born-address").find("h3").attr("data-city");
            var birthplaceDistrict = "";
            var birthplaceDistrictId = $("#base-info-born-address").find("h3").attr("data-district");
            switch (birthplaceList.length) {
                case 2 :
                    birthplaceProvince = birthplaceList[0];
                    birthplaceCity = birthplaceList[1];
                    birthplaceDistrict = "";
                    break;
                case 3 :
                    birthplaceProvince = birthplaceList[0];
                    birthplaceCity = birthplaceList[1];
                    birthplaceDistrict = birthplaceList[2];
                    break;
                default:
                    birthplaceProvince = "";
                    birthplaceCity = "";
                    birthplaceDistrict = "";
            }
            var data = {
                id: $(".J-idIndex").val(),                   //序列ID
                patientId: localStorage.getItem('patientId'),                  //患者ID 假数据

                provinceId: provinceId,                      //string	是	所在地省id
                province: province,	                         //string	是	所在地省
                cityId: cityId,	                             //string	是	所在地市id
                city: city,	                                 //string	是	所在地市
                districtId: districtId,	                     //string	是	所在地区/县id
                district: city,	                             //string	是	所在地区/县

                socialProvinceId: socialProvinceId,	//string	是	社保省Id
                socialProvince: socialProvince,	//string	是	社保省
                socialCityId: socialCityId,	//string	是	社保市ID
                socialCity: socialCity,	//string	是	社保市
                socialDistrictId: socialDistrictId,   	//string	是	社保区县ID
                socialDistrict: socialDistrict,	//string	是	社保区县
                socialId: socialId,	//string	是	社保类型

                nativeProvinceId: nativeProvinceId,   //string	是	籍贯省Id
                nativeProvince: nativeProvince,	//string	是	籍贯省
                nativeCityId: nativeCityId,	//string	是	籍贯市ID
                nativeCity: nativeCity,//string	是	籍贯市
                nativeDistrictId: nativeDistrictId,	//string	是	籍贯区县
                nativeDistrict: nativeDistrict,	//string	是	籍贯区县

                birthplaceProvinceId: birthplaceProvinceId,	//string	是	出生地省id
                birthplaceProvince: birthplaceProvince,	//string	是	出生地省
                birthplaceCityId: birthplaceCityId,//string	是	出生地市id
                birthplaceCity: birthplaceCity,	//string	是	出生地市
                birthplaceDistrictId: birthplaceDistrictId,	//string	是	出生地区/县id
                birthplaceDistrict: birthplaceDistrict,	//string	是	出生地区/县


                telephone: $(".J-telephone").text(),         //联系方式
                nation: $(".J-nation").val(),                //民族

                isMarriage: $(".J-Marriage").val(),          //婚姻状况
                homeAddress: $(".J-homeAddress").attr("data-val") ? $(".J-homeAddress").attr("data-val") : $(".J-homeAddress").val(),     //家庭住址
                workplace: $(".J-workplace").attr("data-val") ? $(".J-workplace").attr("data-val") : $(".J-workplace").val(),             //工作单位
                //结婚年龄
                spouseStatus: $(".J-spouseStatus").val(),    //配偶状况
                childrenStatus: $(".J-childrenStatus").val(),//子女状况
                fertility: ( $(".J-fertility-boy").val() == "" && $(".J-fertility-girl").val() == "") ? "" : $(".J-fertility-boy").val() + "," + $(".J-fertility-girl").val(),       //生育状况
                marriageAge: $(".J-marriageAge").val(),       //结婚年龄
                isSmoke: $(".J-isSmoke").val(),              //吸烟史
                isDrink: $(".J-isDrink").val(),              //饮酒史
                isNarcotics: $(".J-isNarcotics").val(),      //毒品史
                parentStatus: $(".J-parentStatus").val(),    //父母状况
                siblingsStatus: $(".J-siblingsStatus").val(),//兄妹状况
                isInfection: $(".J-isInfection").val(),      //兄妹状况
                isHeredopathia: $(".J-isHeredopathia").val() //遗传病
            };

            $(".detail-saveBtn", ".base-info").addClass("oneClick");
            $.ajax({
                url: that.XHRList.saveBaseInfo,
                dataType: 'json',
                type: "POST",
                catch: false,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {
                if (data.responseObject.responseStatus != false) {
                    $(".J-idIndex").val(data.responseObject.responsePk);
                    common.popupRight({text: "保存成功"});
                } else {
                    common.popupRight({text: "保存失败"});
                }
                $(".detail-saveBtn", ".base-info").removeClass("oneClick");
            }).fail(function () {
                console.log("XHR error...");
                $(".detail-saveBtn", ".base-info").removeClass("oneClick");
            });
        },
        mainSpeakInfo: function (dataTreate) {    //主诉信息
            var _this = this;
            var data = {
                caseId: localStorage.getItem("caseId"),
                patientId: localStorage.getItem("patientId")
            };
            $.ajax({
                url: _this.XHRList.MedicalReport,
                dataType: 'json',
                type: "POST",
                catch: false,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {
                console.log(data);
                if (data.responseObject.responseData.dataList && data.responseObject.responseStatus != false) {
                    $(".main-speak").html(" ");
                    var dataList = data.responseObject.responseData.dataList;
                    // console.log(dataList);
                    $.each(dataList, function (key, value) {
                            var front = [
                                1491806838222,
                                1491806838222,
                                1491806845477,
                                1491806845477,
                                1491806841841,
                                1491806841841,
                                1491806847001,
                                1491806847001,
                                1491806848305,
                                1491806848305
                            ];
                            var back = [
                                1491806850917,
                                1491806850917,
                                1491806850917,
                                1491806839523,
                                1491806839523
                            ];


                            var bodyPlace = "";
                            var alongBodyPlace = "";
                            var url = "";
                            var alongUrl = "";
                            var mainPartId = value.mainPartId;
                            var alongPartId = value.alongPartId;

                            var mainPartTwoId = value.mainPartTwoId;
                            var alongPartTwoId = value.alongPartTwoId;


                            $.each(front, function (key, value) {
                                if (mainPartTwoId == value) {
                                    bodyPlace = "front";
                                }
                            });
                            $.each(back, function (key, value) {
                                if (mainPartTwoId == value) {
                                    bodyPlace = "back";
                                }
                            });

                            if (_this.userData.age <= 12) {
                                //孩子
                                if (bodyPlace == 'front') {
                                    url = _this.imageUrl.childFront;
                                } else if (bodyPlace == 'back') {
                                    url = _this.imageUrl.childBack;
                                } else {
                                    url = _this.imageUrl.childFront;
                                }
                            } else {
                                switch (_this.userData.sex) {
                                    case "1" :                              //男
                                        if (bodyPlace == 'front') {
                                            url = _this.imageUrl.maleFront;
                                        } else if (bodyPlace == 'back') {
                                            url = _this.imageUrl.maleBack;
                                        } else {
                                            url = _this.imageUrl.maleFront;
                                        }
                                        break;
                                    case "2" :                              //女
                                        if (bodyPlace == 'front') {
                                            url = _this.imageUrl.femaleFront;
                                        } else if (bodyPlace == 'back') {
                                            url = _this.imageUrl.femaleBack;
                                        } else {
                                            url = _this.imageUrl.femaleFront;
                                        }
                                        break;
                                }
                            }

                            if (url) {
                                var sickImgHtml = ' <article>' +
                                    '<header>' +
                                    '<div class="sick-img-content">' +
                                    '<div class="sick-img-one main-img">' +
                                    '<img class="sick-img" src="' + url + '" alt="病图"/>' +
                                    '<p class="sick-dot"></p>' +
                                    '</div>' +
                                    '</div>' +
                                    '</header>' +
                                    '</article>';
                                //    $(".main-speak").append(sickImgHtml);
                            }
                            if (_this.userData.age <= 12) {
                                //孩子
                                if (bodyPlace == 'front') {
                                    switch (mainPartTwoId) {
                                        case front[0] :
                                            $('.sick-dot').css({top: "75px", left: "34px"});
                                            break;
                                        case front[1]:
                                            $('.sick-dot').css({top: "75px", left: "94px"});
                                            break;
                                        case front[2] :
                                            $('.sick-dot').css({top: "145px", left: "9px"});
                                            break;
                                        case front[3] :
                                            $('.sick-dot').css({top: "145px", left: "119px"});
                                            break;
                                        case front[4] :
                                            $('.sick-dot').css({top: "140px", left: "45px"});
                                            break;
                                        case front[5] :
                                            $('.sick-dot').css({top: "145px", left: "83px"});
                                            break;
                                        case front[6] :
                                            $('.sick-dot').css({top: "199px", left: "41px"});
                                            break;
                                        case front[7] :
                                            $('.sick-dot').css({top: "199px", left: "86px"});
                                            break;
                                        case front[8] :
                                            $('.sick-dot').css({top: "240px", left: "38px"});
                                            break;
                                        case front[9] :
                                            $('.sick-dot').css({top: "241px", left: "91px"});
                                            break;
                                        default:
                                            $('.sick-dot').css({"display": "none"});
                                    }
                                }
                                else {
                                    switch (mainPartTwoId) {
                                        case back[0] :
                                            $('.sick-dot').css({top: "65px", left: "153px"});
                                            break;
                                        case back[1]  :
                                            $('.sick-dot').css({top: "96px", left: "153px"});
                                            break;
                                        case back[2]  :
                                            $('.sick-dot').css({top: "136px", left: "153px"});
                                            break;
                                        case back[3]  :
                                            $('.sick-dot').css({top: "114px", left: "109px"});
                                            break;
                                        case back[4]  :
                                            $('.sick-dot').css({top: "114px", left: "194px"});
                                            break;
                                        default:
                                            $('.sick-dot').css({"display": "none"});
                                    }
                                }
                            } else {
                                switch (_this.userData.sex) {
                                    case "1" :                             //男
                                        if (bodyPlace == 'front') {
                                            switch (mainPartTwoId) {
                                                case front[0] :
                                                    $('.sick-dot').css({top: "44px", left: "33px"});
                                                    break;
                                                case front[1] :
                                                    $('.sick-dot').css({top: "44px", left: "94px"});
                                                    break;
                                                case front[2] :
                                                    $('.sick-dot').css({top: "114px", left: "6px"});
                                                    break;
                                                case front[3] :
                                                    $('.sick-dot').css({top: "112px", left: "96px"});
                                                    break;
                                                case front[4] :
                                                    $('.sick-dot').css({top: "112px", left: "139px"});
                                                    break;
                                                case front[5] :
                                                    $('.sick-dot').css({top: "114px", left: "208px"});
                                                    break;
                                                case front[6] :
                                                    $('.sick-dot').css({top: "182px", left: "49px"});
                                                    break;
                                                case front[7] :
                                                    $('.sick-dot').css({top: "183px", left: "77px"});
                                                    break;
                                                case front[8] :
                                                    $('.sick-dot').css({top: "250px", left: "51px"});
                                                    break;
                                                case front[9] :
                                                    $('.sick-dot').css({top: "250px", left: "75px"});
                                                    break;
                                                default:
                                                    $('.sick-dot').css({"display": "none"});
                                            }
                                        } else {
                                            switch (mainPartTwoId) {
                                                case back[0] :
                                                    $('.sick-dot').css({top: "25px", left: "153px"});
                                                    break;
                                                case back[1] :
                                                    $('.sick-dot').css({top: "60px", left: "153px"});
                                                    break;
                                                case back[2] :
                                                    $('.sick-dot').css({top: "102px", left: "153px"});
                                                    break;
                                                case back[3] :
                                                    $('.sick-dot').css({top: "80px", left: "96px"});
                                                    break;
                                                case back[4] :
                                                    $('.sick-dot').css({top: "80px", left: "195px"});
                                                    break;
                                                default:
                                                    $('.sick-dot').css({"display": "none"});
                                            }
                                        }
                                        break;
                                    case "2" :                             //女
                                        if (bodyPlace == 'front') {
                                            switch (mainPartTwoId) {
                                                case front[0] :
                                                    $('.sick-dot').css({top: "54px", left: "36px"});
                                                    break;
                                                case front[1] :
                                                    $('.sick-dot').css({top: "54px", left: "90px"});
                                                    break;
                                                case front[2] :
                                                    $('.sick-dot').css({top: "142px", left: "6px"});
                                                    break;
                                                case front[3] :
                                                    $('.sick-dot').css({top: "142px", left: "120px"});
                                                    break;
                                                case front[4] :
                                                    $('.sick-dot').css({top: "133px", left: "44px"});
                                                    break;
                                                case front[5] :
                                                    $('.sick-dot').css({top: "133px", left: "80px"});
                                                    break;
                                                case front[6] :
                                                    $('.sick-dot').css({top: "222px", left: "50px"});
                                                    break;
                                                case front[7] :
                                                    $('.sick-dot').css({top: "222px", left: "76px"});
                                                    break;
                                                case front[8] :
                                                    $('.sick-dot').css({top: "287px", left: "53px"});
                                                    break;
                                                case front[9] :
                                                    $('.sick-dot').css({top: "287px", left: "72px"});
                                                    break;
                                                default:
                                                    $('.sick-dot').css({"display": "none"});
                                            }
                                        } else {
                                            switch (mainPartTwoId) {
                                                case back[0] :
                                                    $('.sick-dot').css({top: "36px", left: "63px"});
                                                    break;
                                                case back[1]:
                                                    $('.sick-dot').css({top: "73px", left: "63px"});
                                                    break;
                                                case back[2] :
                                                    $('.sick-dot').css({top: "102px", left: "22px"});
                                                    break;
                                                case back[3] :
                                                    $('.sick-dot').css({top: "102px", left: "105px"});
                                                    break;
                                                case back[4] :
                                                    $('.sick-dot').css({top: "118px", left: "63px"});
                                                    break;
                                                default:
                                                    $('.sick-dot').css({"display": "none"});
                                            }
                                        }
                                        break;
                                    default:
                                        $("sick-dot").hide();
                                }
                            }
                            if (alongPartTwoId && alongPartTwoId != "0") {
                                $.each(front, function (key, value) {
                                    if (alongPartTwoId == value) {
                                        alongBodyPlace = "front";
                                    }
                                });
                                $.each(back, function (key, value) {
                                    if (alongPartTwoId == value) {
                                        alongBodyPlace = "back";
                                    }
                                });


                                if (bodyPlace == alongBodyPlace) {
                                    var alongDotHtml = '<p class="sick-dot-along"></p>';
                                    $(".main-img").append(alongDotHtml);

                                    if (_this.userData.age <= 12) {
                                        //孩子
                                        if (bodyPlace == 'front') {
                                            switch (alongPartTwoId) {
                                                case front[0] :
                                                    $('.sick-dot-along').css({top: "75px", left: "34px"});
                                                    break;
                                                case front[1]:
                                                    $('.sick-dot-along').css({top: "75px", left: "94px"});
                                                    break;
                                                case front[2] :
                                                    $('.sick-dot-along').css({top: "145px", left: "9px"});
                                                    break;
                                                case front[3] :
                                                    $('.sick-dot-along').css({top: "145px", left: "119px"});
                                                    break;
                                                case front[4] :
                                                    $('.sick-dot-along').css({top: "140px", left: "45px"});
                                                    break;
                                                case front[5] :
                                                    $('.sick-dot-along').css({top: "145px", left: "83px"});
                                                    break;
                                                case front[6] :
                                                    $('.sick-dot-along').css({top: "199px", left: "41px"});
                                                    break;
                                                case front[7] :
                                                    $('.sick-dot-along').css({top: "199px", left: "86px"});
                                                    break;
                                                case front[8] :
                                                    $('.sick-dot-along').css({top: "240px", left: "38px"});
                                                    break;
                                                case front[9] :
                                                    $('.sick-dot-along').css({top: "241px", left: "91px"});
                                                    break;
                                                default:
                                                    $('.sick-dot-along').css({"display": "none"});
                                            }
                                        } else {
                                            switch (alongPartTwoId) {
                                                case back[0] :
                                                    $('.sick-dot-along').css({top: "65px", left: "153px"});
                                                    break;
                                                case back[1]  :
                                                    $('.sick-dot-along').css({top: "96px", left: "153px"});
                                                    break;
                                                case back[2]  :
                                                    $('.sick-dot-along').css({top: "136px", left: "153px"});
                                                    break;
                                                case back[3]  :
                                                    $('.sick-dot-along').css({top: "114px", left: "109px"});
                                                    break;
                                                case back[4]  :
                                                    $('.sick-dot-along').css({top: "114px", left: "194px"});
                                                    break;
                                                default:
                                                    $('.sick-dot-along').css({"display": "none"});
                                            }
                                        }

                                    } else {
                                        switch (_this.userData.sex) {
                                            case "1" :                             //男
                                                if (bodyPlace == 'front') {
                                                    switch (alongPartTwoId) {
                                                        case front[0] :
                                                            $('.sick-dot-along').css({top: "45px", left: "121px"});
                                                            break;
                                                        case front[1] :
                                                            $('.sick-dot-along').css({top: "45px", left: "183px"});
                                                            break;
                                                        case front[2] :
                                                            $('.sick-dot-along').css({top: "114px", left: "6px"});
                                                            break;
                                                        case front[3] :
                                                            $('.sick-dot-along').css({top: "112px", left: "96px"});
                                                            break;
                                                        case front[4] :
                                                            $('.sick-dot-along').css({top: "112px", left: "139px"});
                                                            break;
                                                        case front[5] :
                                                            $('.sick-dot-along').css({top: "114px", left: "208px"});
                                                            break;
                                                        case front[6] :
                                                            $('.sick-dot-along').css({top: "182px", left: "140px"});
                                                            break;
                                                        case front[7] :
                                                            $('.sick-dot-along').css({top: "182px", left: "167px"});
                                                            break;
                                                        case front[8] :
                                                            $('.sick-dot-along').css({top: "250px", left: "140px"});
                                                            break;
                                                        case front[9] :
                                                            $('.sick-dot-along').css({top: "250px", left: "165px"});
                                                            break;
                                                        default:
                                                            $('.sick-dot-along').css({"display": "none"});
                                                    }
                                                } else {
                                                    switch (alongPartTwoId) {
                                                        case back[0] :
                                                            $('.sick-dot-along').css({top: "25px", left: "153px"});
                                                            break;
                                                        case back[1] :
                                                            $('.sick-dot-along').css({top: "60px", left: "153px"});
                                                            break;
                                                        case back[2] :
                                                            $('.sick-dot-along').css({top: "102px", left: "153px"});
                                                            break;
                                                        case back[3] :
                                                            $('.sick-dot-along').css({top: "80px", left: "96px"});
                                                            break;
                                                        case back[4] :
                                                            $('.sick-dot-along').css({top: "80px", left: "195px"});
                                                            break;
                                                        default:
                                                            $('.sick-dot-along').css({"display": "none"});
                                                    }
                                                }
                                                break;
                                            case "2" :                             //女
                                                if (bodyPlace == 'front') {
                                                    switch (alongPartTwoId) {
                                                        case front[0] :
                                                            $('.sick-dot-along').css({top: "54px", left: "36px"});
                                                            break;
                                                        case front[1] :
                                                            $('.sick-dot-along').css({top: "54px", left: "90px"});
                                                            break;
                                                        case front[2] :
                                                            $('.sick-dot-along').css({top: "142px", left: "6px"});
                                                            break;
                                                        case front[3] :
                                                            $('.sick-dot-along').css({top: "142px", left: "120px"});
                                                            break;
                                                        case front[4] :
                                                            $('.sick-dot-along').css({top: "133px", left: "44px"});
                                                            break;
                                                        case front[5] :
                                                            $('.sick-dot-along').css({top: "133px", left: "80px"});
                                                            break;
                                                        case front[6] :
                                                            $('.sick-dot-along').css({top: "222px", left: "50px"});
                                                            break;
                                                        case front[7] :
                                                            $('.sick-dot-along').css({top: "222px", left: "76px"});
                                                            break;
                                                        case front[8] :
                                                            $('.sick-dot-along').css({top: "287px", left: "53px"});
                                                            break;
                                                        case front[9] :
                                                            $('.sick-dot-along').css({top: "287px", left: "72px"});
                                                            break;
                                                        default:
                                                            $('.sick-dot-along').css({"display": "none"});
                                                    }
                                                } else {
                                                    switch (alongPartTwoId) {
                                                        case back[0] :
                                                            $('.sick-dot-along').css({top: "36px", left: "63px"});
                                                            break;
                                                        case back[1]:
                                                            $('.sick-dot-along').css({top: "73px", left: "63px"});
                                                            break;
                                                        case back[2] :
                                                            $('.sick-dot-along').css({top: "102px", left: "22px"});
                                                            break;
                                                        case back[3] :
                                                            $('.sick-dot-along').css({top: "102px", left: "105px"});
                                                            break;
                                                        case back[4] :
                                                            $('.sick-dot-along').css({top: "118px", left: "63px"});
                                                            break;
                                                        default:
                                                            $('.sick-dot-along').css({"display": "none"});
                                                    }
                                                }
                                                break;
                                            default:
                                                $("sick-dot-along").hide();
                                        }
                                    }
                                } else {
                                    if (_this.userData.age <= 12) {
                                        //孩子
                                        if (alongBodyPlace == 'front') {
                                            alongUrl = _this.imageUrl.childFront;
                                        } else {
                                            alongUrl = _this.imageUrl.childBack;
                                        }
                                    } else {

                                        switch (_this.userData.sex) {
                                            case "1" :                              //男
                                                if (alongBodyPlace == 'front') {
                                                    alongUrl = _this.imageUrl.maleFront;
                                                } else {
                                                    alongUrl = _this.imageUrl.maleBack;
                                                }
                                                break;
                                            case "2" :                              //女
                                                if (alongBodyPlace == 'front') {
                                                    alongUrl = _this.imageUrl.femaleFront;
                                                } else {
                                                    alongUrl = _this.imageUrl.femaleBack;
                                                }
                                                break;
                                            default:
                                                if (alongBodyPlace == 'front') {
                                                    alongUrl = _this.imageUrl.maleFront;
                                                } else {
                                                    alongUrl = _this.imageUrl.maleBack;
                                                }
                                        }

                                    }
                                    var alongImgHtml = '<div class="sick-img-one"><img class="sick-img" src="' + alongUrl + '" alt="病图"/><p class="sick-dot-along"></p></div>';
                                    $(".sick-img-content").append(alongImgHtml);
                                    switch (_this.userData.sex) {
                                        case "0" :                             //孩子
                                            if (bodyPlace == 'front') {
                                                switch (mainPartId) {
                                                    case front[0] :
                                                        $('.sick-dot-along').css({top: "75px", left: "125px"});
                                                        break;
                                                    case front[1]:
                                                        $('.sick-dot-along').css({top: "75px", left: "180px"});
                                                        break;
                                                    case front[2] :
                                                        $('.sick-dot-along').css({top: "145px", left: "96px"});
                                                        break;
                                                    case front[3] :
                                                        $('.sick-dot-along').css({top: "140px", left: "134px"});
                                                        break;
                                                    case front[4] :
                                                        $('.sick-dot-along').css({top: "140px", left: "172px"});
                                                        break;
                                                    case front[5] :
                                                        $('.sick-dot-along').css({top: "145px", left: "208px"});
                                                        break;
                                                    case front[6] :
                                                        $('.sick-dot-along').css({top: "201px", left: "40px"});
                                                        break;
                                                    case front[7] :
                                                        $('.sick-dot-along').css({top: "201px", left: "85px"});
                                                        break;
                                                    case front[8] :
                                                        $('.sick-dot-along').css({top: "240px", left: "38px"});
                                                        break;
                                                    case front[9] :
                                                        $('.sick-dot-along').css({top: "241px", left: "91px"});
                                                        break;
                                                    default:
                                                        $('.sick-dot-along').css({"display": "none"});
                                                }
                                            } else {
                                                switch (mainPartId) {
                                                    case back[0] :
                                                        $('.sick-dot-along').css({top: "65px", left: "153px"});
                                                        break;
                                                    case back[1]  :
                                                        $('.sick-dot-along').css({top: "96px", left: "153px"});
                                                        break;
                                                    case back[2]  :
                                                        $('.sick-dot-along').css({top: "136px", left: "153px"});
                                                        break;
                                                    case back[3]  :
                                                        $('.sick-dot-along').css({top: "114px", left: "109px"});
                                                        break;
                                                    case back[4]  :
                                                        $('.sick-dot-along').css({top: "114px", left: "194px"});
                                                        break;
                                                    default:
                                                        $('.sick-dot-along').css({"display": "none"});
                                                }
                                            }
                                            break;
                                        case "1" :                             //男
                                            if (bodyPlace == 'front') {
                                                switch (mainPartId) {
                                                    case front[0] :
                                                        $('.sick-dot-along').css({top: "45px", left: "121px"});
                                                        break;
                                                    case front[1] :
                                                        $('.sick-dot-along').css({top: "45px", left: "183px"});
                                                        break;
                                                    case front[2] :
                                                        $('.sick-dot-along').css({top: "114px", left: "96px"});
                                                        break;
                                                    case front[3] :
                                                        $('.sick-dot-along').css({top: "112px", left: "96px"});
                                                        break;
                                                    case front[4] :
                                                        $('.sick-dot-along').css({top: "112px", left: "139px"});
                                                        break;
                                                    case front[5] :
                                                        $('.sick-dot-along').css({top: "114px", left: "208px;"});
                                                        break;
                                                    case front[6] :
                                                        $('.sick-dot-along').css({top: "182px", left: "140px;"});
                                                        break;
                                                    case front[7] :
                                                        $('.sick-dot-along').css({top: "182px", left: "167px;"});
                                                        break;
                                                    case front[8] :
                                                        $('.sick-dot-along').css({top: "250px", left: "140px;"});
                                                        break;
                                                    case front[9] :
                                                        $('.sick-dot-along').css({top: "250px", left: "165px;"});
                                                        break;
                                                    default:
                                                        $('.sick-dot-along').css({"display": "none"});
                                                }
                                            } else {
                                                switch (mainPartId) {
                                                    case back[0] :
                                                        $('.sick-dot-along').css({top: "25px", left: "153px"});
                                                        break;
                                                    case back[1] :
                                                        $('.sick-dot-along').css({top: "60px", left: "153px"});
                                                        break;
                                                    case back[2] :
                                                        $('.sick-dot-along').css({top: "102px", left: "153px"});
                                                        break;
                                                    case back[3] :
                                                        $('.sick-dot-along').css({top: "80px", left: "96px"});
                                                        break;
                                                    case back[4] :
                                                        $('.sick-dot-along').css({top: "80px", left: "195px"});
                                                        break;
                                                    default:
                                                        $('.sick-dot-along').css({"display": "none"});
                                                }
                                            }
                                            break;
                                        case "2" :                             //女
                                            if (bodyPlace == 'front') {
                                                switch (mainPartId) {
                                                    case front[0] :
                                                        $('.sick-dot-along').css({top: "55px", left: "125px"});
                                                        break;
                                                    case front[1] :
                                                        $('.sick-dot-along').css({top: "70px", left: "180px"});
                                                        break;
                                                    case front[2] :
                                                        $('.sick-dot-along').css({top: "142px", left: "96px"});
                                                        break;
                                                    case front[3] :
                                                        $('.sick-dot-along').css({top: "142px", left: "209px"});
                                                        break;
                                                    case front[4] :
                                                        $('.sick-dot-along').css({top: "135px", left: "135px"});
                                                        break;
                                                    case front[5] :
                                                        $('.sick-dot-along').css({top: "170px", left: "140px;"});
                                                        break;
                                                    case front[6] :
                                                        $('.sick-dot-along').css({top: "222px", left: "140px;"});
                                                        break;
                                                    case front[7] :
                                                        $('.sick-dot-along').css({top: "222px", left: "166px;"});
                                                        break;
                                                    case front[8] :
                                                        $('.sick-dot-along').css({top: "287px", left: "144px;"});
                                                        break;
                                                    case front[9] :
                                                        $('.sick-dot-along').css({top: "287px", left: "162px;"});
                                                        break;
                                                    default:
                                                        $('.sick-dot-along').css({"display": "none"});
                                                }
                                            } else {
                                                switch (mainPartId) {
                                                    case back[0] :
                                                        $('.sick-dot-along').css({top: "35px", left: "152px"});
                                                        break;
                                                    case back[1]:
                                                        $('.sick-dot-along').css({top: "70px", left: "152px"});
                                                        break;
                                                    case back[2] :
                                                        $('.sick-dot-along').css({top: "118px", left: "152px"});
                                                        break;
                                                    case back[3] :
                                                        $('.sick-dot-along').css({top: "103px", left: "112px"});
                                                        break;
                                                    case back[4] :
                                                        $('.sick-dot-along').css({top: "103px", left: "195px"});
                                                        break;
                                                    default:
                                                        $('.sick-dot-along').css({"display": "none"});
                                                }
                                            }
                                            break;
                                        default:
                                            $("sick-dot-along").hide();
                                    }
                                }
                            }
                            switch (_this.userData.type) {      // 0  1 3  2-预约手术
                                case "0" :
                                case "1" :
                                case "2" :
                                case "3" :
                                    var consultHtml = ' <article class="J-consult">' +
                                        '<ul>';
                                    if (value.patientCasemap.caseMain.caseMain != '') {
                                        consultHtml += '<li class="operation-name"><span class="sick-title">主要症状：</span><span class="sick-text J-caseMain">' + value.patientCasemap.caseMain.caseMain + '</span></li>';
                                    }
                                    (function (data) {
                                        $.each(data, function (index, value) {
                                            if (value.refQuestionList && value.refQuestionList.length > 0) {
                                                if (value.refQuestionList[0]) {
                                                    if (value.refQuestionList[0].symptomOptions && value.refQuestionList[0].symptomOptions.length > 0) {
                                                        if (value.refQuestionList[0].symptomOptions[0].optionName && value.refQuestionList[0].symptomOptions[0].optionName.length > 0) {
                                                            consultHtml += '<li class="operation-expectation-time"><span class="sick-title">疼痛性质：</span><span class="sick-text J-caseMain">' + value.refQuestionList[0].symptomOptions[0].optionName + '</span></li>';
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }(value.resultMainList.length>0 ? value.resultMainList[0].symptomOptions:''));


                                    (function (data) {
                                        console.log(data);
                                        $.each(data, function (index, value) {
                                            if (value.refQuestionList && value.refQuestionList.length > 0) {
                                                if (value.refQuestionList[1]) {
                                                    if (value.refQuestionList[1].symptomOptions && value.refQuestionList[1].symptomOptions.length > 0) {
                                                        if (value.refQuestionList[1].symptomOptions[0].optionName && value.refQuestionList[1].symptomOptions[0].optionName.length > 0) {
                                                            var optionNameStr = value.refQuestionList[1].symptomOptions[0].optionName;
                                                            optionNameStr = optionNameStr.substring(optionNameStr.length-1) == '：' ?optionNameStr.substring(0,optionNameStr.length-1):optionNameStr;
                                                                consultHtml += '<li class="operation-expectation-time"><span class="sick-title">VAS评分：</span><span class="sick-text J-caseMain">' + optionNameStr + '</span></li>';
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }(value.resultMainList.length>0?value.resultMainList[0].symptomOptions:""));


                                    if (value.patientCasemap.caseMain.caseAlong != '') {
                                        consultHtml += '<li class="operation-expectation-time"><span class="sick-title ">其他症状：</span><span class="sick-text J-caseAlong">' + value.patientCasemap.caseMain.caseAlong + '</span></li>';
                                    }
                                    consultHtml += '</ul>' +
                                        '</article>';
                                    $(".main-speak").append(consultHtml);
                                    break;
                            }
                            var patientHtml = "";
                            console.log(value);
                            console.log(value.patientCasemap.treatmentName);
                            if (value.patientCasemap.treatmentName != 0 || value.patientCasemap.illnessName != 0) {
                                patientHtml += '<section class="mt20">' +
                                    '<span class="main-title main-title-long">曾就诊情况：</span><span class="main-text">' + value.patientCasemap.treatmentName + '&nbsp&nbsp' + value.patientCasemap.illnessName + '</span></section>'
                            }

                        // (function () {
                        //     var title = "";
                        //     switch (key) {
                        //         case 0:
                        //             title = '<span class="main-title">' + mainTitle + '：</span>' + '<span class="main-text">' + (mainTitle === "主要症状" ? data.patientCasemap.caseMain : data.patientCasemap.caseAlong) + '</span>';
                        //             break;
                        //         case 1:
                        //             title = '<span class="main-title main-title-long">影响活动程度：</span>';
                        //             break;
                        //         case 2:
                        //             break;
                        //         case 3:
                        //             break;
                        //         case 4:
                        //             title = '<span class="main-title">何时加重：</span>';
                        //             break;
                        //         case 5:
                        //             title = '<span class="main-title">何时缓解：</span>';
                        //             break;
                        //         case 6:
                        //             title = '<span class="main-title">曾做治疗：</span>';
                        //             break;
                        //     }
                        //     return title;
                        // }());

                        if (value.patientCasemap.takeMedicine != '') {
                                patientHtml += '<span class="main-title main-title-long">服用药物：</span><span class="main-text">' + value.patientCasemap.takeMedicine + '</span>';
                            }

                            $(".main-sick-describe ").html(patientHtml);

                            //现病史-（主要症状、伴随症状）;
                            // if (value.caseMain && value.caseAlong) {
                            //     // $(".J-caseMain").text(value.caseMain + "," + value.caseAlong);
                            //     $(".J-caseMain").text(value.caseAlong);
                            // } else if (value.caseMain) {
                            //     $(".J-caseMain").text(value.caseMain);
                            // } else {
                            //     $(".J-caseMain").text("无数据");
                            // }
                            //
                            // if (value.alongPartName && value.caseAlong) {
                            //     $(".J-caseAlong").text(value.caseAlong);
                            // } else if (value.alongPartName) {
                            //     $(".J-caseAlong").text(value.alongPartName);
                            // } else {
                            //     $(".J-caseAlong").text("无数据");
                            // }
                            // if (typeof (value.illnessName ) != "undefined" && typeof (value.treatmentName) != "undefined" && value.illnessName != "" && value.illnessName != "") {
                            //     var textHtml = "曾在" + value.illnessName + "被诊断为" + value.treatmentName;
                            //     $('.J-treat').text(textHtml);
                            // }
                        }
                    );

                }
               // _this.getData(dataTreate);
            }).fail(function () {
                console.log("主诉获取信息失败！");
                $(".J-caseDescribe", ".main-speak").text("主要症状：暂无数据！");
                $(".J-operationName").text("暂无数据!");
                $(".J-expectedTime").text("暂无数据!");
                $(".J-expectedAddress").text("暂无数据!");
                // _this.getData(dataTreate);
            });
        },
        bodyCheckSearch: function () {   //体格检查查新
            var _this = this;
            //身高
            var heightHtml = "<option  value=''>请选择</option>";
            for (var i = 140; i <= 220; i++) {
                heightHtml += "<option  value=" + i + ">" + i + "cm</option>";
            }
            $('.J-height').append(heightHtml);
            // $('.J-height').find("option[value='170']").attr("selected", true);

            //体重
            var weightHtml = "<option  value=''>请选择</option>";
            for (var j = 40; j <= 120; j++) {
                weightHtml += "<option  value=" + j + ">" + j + "kg</option>";
            }
            $('.J-weight').append(weightHtml);
            //$('.J-weight').find("option[value='65']").attr("selected", true);

            //收缩压
            var bloodPressureHeightHtml = "<option  value=''>请选择</option>";
            for (var m = 50; m <= 180; m++) {
                bloodPressureHeightHtml += "<option  value=" + m + ">" + m + "mmHg</option>";
            }
            $('.J-bloodPressureHigh').append(bloodPressureHeightHtml);
            // $('.J-bloodPressureHigh').find("option[value='120']").attr("selected", true);

            //舒张压
            var bloodPressureLowHtml = "<option  value=''>请选择</option>";
            for (var n = 20; n <= 130; n++) {
                bloodPressureLowHtml += "<option  value=" + n + ">" + n + "mmHg</option>";
            }
            $('.J-bloodPressureLow').append(bloodPressureLowHtml);
            // $('.J-bloodPressureLow').find("option[value='80']").attr("selected", true);


            //脉搏
            var pulseHtml = "<option  value=''>请选择</option>";
            for (var k = 40; k <= 100; k++) {
                pulseHtml += "<option  value=" + k + ">" + k + "次/分</option>";
            }
            $('.J-pulse').append(pulseHtml);
            //  $('.J-pulse').find("option[value='75']").attr("selected", true);

            //呼吸
            var breathingHtml = "<option  value=''>请选择</option>";
            for (var l = 40; l <= 100; l++) {
                breathingHtml += "<option  value=" + l + ">" + l + "次/分</option>";
            }
            $('.J-breathing').append(breathingHtml);
            // $('.J-breathing').find("option[value='16']").attr("selected", true);

            $('.J-height').on('change', function () {
                if ($(this).val() != 0 && $('.J-weight').val() != 0) {
                    var BMIvalue = $('.J-weight').val() / ( $(this).val() * $(this).val() / 10000);
                    var JbodySurfaceAreaVal = 0.0061 * $(this).val() + 0.0128 * $('.J-weight').val() - 0.1529;
                    $(".J-bmi").val(BMIvalue.toFixed(2));
                    $(".J-bodySurfaceArea").val(JbodySurfaceAreaVal.toFixed(2) + "㎡")
                } else {
                    $(".J-bmi").val("");
                    $(".J-bodySurfaceArea").val("");
                }


            });


            $('.J-weight').on('change', function () {
                if ($('.J-height').val() != 0 && $(this).val() != 0) {
                    var BMIvalue = $(this).val() / ($('.J-height').val() * $('.J-height').val() / 10000);
                    $(".J-bmi").val(BMIvalue.toFixed(2));
                    var JbodySurfaceAreaVal = 0.0061 * parseInt($(".J-height").val()) + 0.0128 * parseInt($(this).val()) - 0.1529;
                    $(".J-bodySurfaceArea").val(JbodySurfaceAreaVal.toFixed(2) + "㎡")
                } else {
                    $(".J-bmi").val("");
                    $(".J-bodySurfaceArea").val("");
                }
            });


            var that = this;
            var data = {
                id: $('.body-check-id').val(),
                patientId: localStorage.getItem("patientId"),
                caseId: localStorage.getItem("caseId")
            };

            _this.formatNumber("J-temperature", "℃");      //体温
            // _this.formatNumber("J-bmi", "kg");           //BMI
            // _this.formatNumber("J-bodySurfaceArea", "㎡");  //体表面积

            $.ajax({
                //url: "/call/customer/patient/case/physical/getMapList/",
                url: that.XHRList.bodyCheckSearch,
                dataType: 'json',
                type: "POST",
                catch: false,
                data: {
                    paramJson: $.toJSON(data)
                },
                beforeSend: function () {
                    common.loading.show();
                }
            }).done(function (data) {
                //console.log(data);
                if (data.responseObject.responseData.dataList && data.responseObject.responseStatus != false) {
                    data = data.responseObject.responseData.dataList;
                    for (var i = 0; i < data.length; i++) {

                        $('.body-check-id').val(data[i].id);
                        $(".J-height").find("option[value='" + data[i].height + "']").attr("selected", true);                         //身高
                        $(".J-weight").find("option[value='" + data[i].weight + "']").attr("selected", true);                         //体重
                        $(".J-bloodPressureHigh").find("option[value='" + data[i].bloodPressureHigh + "']").attr("selected", true); //静脉压
                        $(".J-bloodPressureLow").find("option[value='" + data[i].bloodPressureLow + "']").attr("selected", true);     //静脉压
                        $(".J-pulse").find("option[value='" + data[i].pulse + "']").attr("selected", true);                           //脉搏
                        $(".J-breathing").find("option[value='" + data[i].breathing + "']").attr("selected", true);                   //呼吸
                        $(".J-temperature").val(data[i].temperature);                                                                 //体温
                        $(".J-bmi").val(data[i].bmi);                                                                                 //BMI
                        $(".J-bodySurfaceArea").val(data[i].bodySurfaceArea);                                                         //体表面积
                        $(".J-other").val(data[i].other);                                                                            //其他
                    }
                }
            }).fail(function () {
                console.log("XHR error...");
            });
            common.loading.hide();
        },
        bodyCheckSave: function () {   //体格检查保存
            var that = this;
            var data = {
                temperature: $(".J-temperature").val(),
                patientId: localStorage.getItem("patientId"),
                caseId: localStorage.getItem("caseId"),
                height: $(".J-height").val(),
                weight: $(".J-weight").val(),
                bloodPressureHigh: $(".J-bloodPressureHigh").val(),
                bloodPressureLow: $(".J-bloodPressureLow").val(),
                breathing: $(".J-breathing").val(),
                pulse: $(".J-pulse").val(),
                bodySurfaceArea: $(".J-bodySurfaceArea").val(),
                bmi: $(".J-bmi").val(),
                other: $(".J-other").val(),
                isValid: 1,
                id: $('.body-check-id').val()
            };
            console.log(data);
            $.ajax({
                // url: "/call/customer/patient/case/physical/create/",
                url: that.XHRList.bodyCheckSave,
                dataType: 'json',
                type: "POST",
                catch: false,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {
                if (data != undefined && data != "" && data.responseObject.responseStatus != false) {
                    if (data.responseObject.responsePk > 0) {
                        $('.body-check-id').val(data.responseObject.responsePk);
                    }
                    common.popupRight({text: "保存成功"});
                } else {
                    common.popupRight({text: "保存失败"});
                }
            }).fail(function () {
                console.log("XHR error...");
            });

        },
        getMainSick: function () {
            var _this = this;
            // _this.textareaHeight();
            var data = {
                id: $(".J-mainSickId").val(),
                caseId: localStorage.getItem("caseId")
            };
            $.ajax({
                url: _this.XHRList.getMainSick,
                dataType: 'json',
                type: "POST",
                catch: false,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {
                if (data.responseObject.responseData.dataList && data.responseObject.responseStatus != false) {
                    var dataList = data.responseObject.responseData.dataList;
                    $.each(dataList, function (key, value) {
                        if (key == 0) {
                            var dataListValue = value;
                            //  console.log(dataListValue);
                            //主要症状产生

                            $(".J-mainSickId").val(dataListValue.id);
                            $(".J-produceReason").val(dataListValue.produceReason);                 //产生诱因
                            $(".J-produceSymptomsId").val(dataListValue.produceSymptomsId);         //症状
                            $(".J-produceLevelId").val(dataListValue.produceLevelId);               //程度
                            $(".J-produceSharpenId").val(dataListValue.produceSharpenId);           //何时加重
                            $(".J-produceRemitId").val(dataListValue.produceRemitId);               //何时缓解

                            var produceTreatmentList = dataListValue.produceTreatment.split(",");

                            $(".J-produceTreatment").val(produceTreatmentList[0]);                  //治疗情况
                            $(".J-produceTreatment-2").val(produceTreatmentList[1]);
                            //主要症状加重
                            $(".J-aggravateReason").val(dataListValue.aggravateReason);              //加重诱因
                            $(".J-aggravateSymptomsId").val(dataListValue.aggravateSymptomsId);      //症状
                            $(".J-aggravateLevelId").val(dataListValue.aggravateLevelId);            //程度
                            $(".J-aggravateSharpenId").val(dataListValue.aggravateSharpenId);        //何时加重
                            $(".J-aggravateRemitId").val(dataListValue.aggravateRemitId);            //何时缓解

                            var aggravateTreatmentList = dataListValue.aggravateTreatment.split(",");

                            $(".J-aggravateTreatment").val(aggravateTreatmentList[0]);               //治疗情况
                            $(".J-aggravateTreatment-2").val(aggravateTreatmentList[1]);

                            $(".J-sleepId").val(dataListValue.sleepId);                              //睡眠状况
                            $(".J-spiritId").val(dataListValue.spiritId);                            //精神状态
                            $(".J-appetiteId").val(dataListValue.appetiteId);                        //食欲状况
                            $(".J-weightId").val(dataListValue.weightId);                            //体重状况
                            $(".J-excretionId").val(dataListValue.excretionId);                      //排泄状况


                            $(".J-visualInspection").val(dataListValue.visualInspection);             //珍视
                            $(".J-activityState").val(dataListValue.activityState);                   //活动
                            $(".J-muscleStrength").val(dataListValue.muscleStrength);                 //肌力


                        }
                    })
                }
            }).fail(function () {
                console.log("XHR error...");
            });
        },
        saveMainSick: function () {
            var _this = this;
            var data = {
                id: $(".J-mainSickId").val(),	                                                                    //string	是	主键id创建时不传，修改时传
                caseId: localStorage.getItem("caseId"),	                                                                                    //string	是	病例id
                produceReason: $(".J-produceReason").attr("data-val") != "undefined" ? $(".J-produceReason").val() : $(".J-produceReason").attr("data-val"),//	string	是	产生诱因
                produceSymptomsId: $(".J-produceSymptomsId").val(),	                                                //	string	是	症状Id
                produceSymptomsName: $(".J-produceSymptomsId").val() == 0 ? "" : $(".J-produceSymptomsId").find("option:selected").text(),                       //	string	是	症状名称
                produceLevelId: $(".J-produceLevelId").val(),	                                                    //	string	是	程度Id
                produceLevelName: $(".J-produceLevelId").val() == 0 ? "" : $(".J-produceLevelId").find("option:selected").text(),	                        //	string	是	程度名称
                produceSharpenId: $(".J-produceSharpenId").val(),	                                                //	string	是	何时加重Id
                produceSharpenName: $(".J-produceSharpenId").val() == 0 ? "" : $(".J-produceSharpenId").find("option:selected").text(),                        //	string	是	何时加重名称
                produceRemitId: $(".J-produceRemitId").val(),	                                                    //	string	是	何时缓解Id
                produceRemitName: $(".J-produceRemitId").val() == 0 ? "" : $(".J-produceRemitId").find("option:selected").text(),                     //	string	是	何时缓解名称
                produceTreatment: $(".J-produceTreatment").val() + "," + $(".J-produceTreatment-2").val(),	        //	string	是	治疗情况
                aggravateReason: $(".J-produceReason").attr("data-val") != "undefined" ? $(".J-aggravateReason").val() : $(".J-aggravateReason").attr("data-val"),//	string	是	加重诱因
                aggravateSymptomsId: $(".J-aggravateSymptomsId").val(),	                                            //	string	是	症状Id
                aggravateSymptomsName: $(".J-aggravateSymptomsId").val() == 0 ? "" : $(".J-aggravateSymptomsId").find("option:selected").text(),	                //	string	是	症状名称
                aggravateLevelId: $(".J-aggravateLevelId").val(),	                                                //	string	是	程度Id
                aggravateLevelName: $(".J-sleepId").val() == 0 ? "" : $(".J-aggravateLevelId").find("option:selected").text(),	                        //	string	是	程度名称
                aggravateSharpenId: $(".J-aggravateSharpenId").val(),	                                            //	string	是	何时加重Id
                aggravateSharpenName: $(".J-sleepId").val() == 0 ? "" : $(".J-aggravateSharpenId").find("option:selected").text(),	                //	string	是	何时加重名称
                aggravateRemitId: $(".J-aggravateRemitId").val(),	                                                //	string	是	何时缓解Id
                aggravateRemitName: $(".J-aggravateRemitId").val() == 0 ? "" : $(".J-aggravateRemitId").find("option:selected").text(),                     	//	string	是	何时缓解Id
                aggravateTreatment: $(".J-aggravateTreatment").val() + "," + $(".J-aggravateTreatment-2").val(),	//	string	是	治疗情况
                sleepId: $(".J-sleepId").val(),	                                                                    //	string	是	睡眠状况Id
                sleepName: $(".J-sleepId").val() == 0 ? "" : $(".J-sleepId").find("option:selected").text(),	                                        //	string	是	睡眠状况名称
                spiritId: $(".J-spiritId").val(),	                                                                //	string	是	精神状况Id
                spiritName: $(".J-appetiteId").val() == 0 ? "" : $(".J-sleepId").find("option:selected").text(),	                                        //	string	是	精神状况名称
                appetiteId: $(".J-appetiteId").val(),	                                                            //	string	是	食欲状况Id
                appetiteName: $(".J-appetiteId").val() == 0 ? "" : $(".J-appetiteId").find("option:selected").text(),	                                //	string	是	食欲状况名称
                weightId: $(".J-weightId").val(),	                                                                //	string	是	体重状况Id
                weightName: $(".J-weightId").val() == 0 ? "" : $(".J-weightId").find("option:selected").text(),	                                    //	string	是	体重状况名称
                excretionId: $(".J-excretionId").val(),	                                                            //	string	是	排泄状况Id
                excretionName: $(".J-excretionId").val() == 0 ? "" : $(".J-excretionId").find("option:selected").text(),	               //	string	是	排泄状况名称
                visualInspection: $(".J-visualInspection").attr("data-val") != "undefined" ? $(".J-visualInspection").val() : $(".J-visualInspection").attr("data-val"),//	string	是	视诊
                activityState: $(".J-activityState").attr("data-val") != "undefined" ? $(".J-activityState").val() : $(".J-activityState").attr("data-val"),	                                                                                //	string	是	活动状态
                muscleStrength: $(".J-muscleStrength").attr("data-val") != "undefined" ? $(".J-muscleStrength").val() : $(".J-muscleStrength").attr("data-val"),                                //	string	是	肌力
                remark: "",	                                                                        //	string	是	备注
                patientId: localStorage.getItem("patientId")	                                    // string	是	患者id

            };
            $.ajax({
                url: _this.XHRList.saveMainSick,
                dataType: 'json',
                type: "POST",
                catch: false,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {
                if (data.responseObject.responseStatus != false) {
                    if (data.responseObject.responsePk > 0) {
                        $(".J-mainSickId").val(data.responseObject.responsePk);
                    }
                    common.popupRight({text: "保存成功"});
                } else {
                    common.popupRight({text: "保存失败"});
                }
            }).fail(function () {
                console.log("XHR error...");
            });
        },
        oldSickSearch: function () {
            var that = this;
            var data = {
                id: $('.old-sick-id').val,
                patientId: localStorage.getItem("patientId"),
                caseId: localStorage.getItem("caseId"),
                firstResult: 0,
                maxResult: 100
            };

            $.ajax({
                url: that.XHRList.oldSickSearch,
                dataType: 'json',
                type: "POST",
                catch: false,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {
                if (data.responseObject.responseData.dataList && data.responseObject.responseStatus != false) {
                    dataList = data.responseObject.responseData.dataList;
                    var html = "";
                    for (var i = 0; i < dataList.length; i++) {
                        var caseHistoryType = "";
                        if (dataList[i].operatorType == 0) {
                            //dataList[i].caseHistoryType = 5;
                            switch (dataList[i].caseHistoryType) {
                                case "0" :
                                    caseHistoryType = "疾病史";
                                    if (dataList[i].caseHistoryName || dataList[i].caseHistoryDesc) {


                                        html += '<section class="mt20">' +
                                            '<span class="medical-title">' + caseHistoryType + '：</span><span class="medical-text old-sick-out">' + dataList[i].caseHistoryName + '</span>' +
                                            '<p class="medical-text old-sick-out mt10">' + dataList[i].caseHistoryDesc + '</p>' +
                                            '</section>';
                                    }
                                    break;
                                case "1" :
                                    caseHistoryType = "手术史";
                                    if (dataList[i].caseHistoryName || dataList[i].caseHistoryDesc) {
                                        html += '<section class="mt20">' +
                                            '<span class="medical-title">' + caseHistoryType + '：</span><span class="medical-text old-sick-out">' + dataList[i].caseHistoryName + '</span>' +
                                            '<p class="medical-text old-sick-out mt10">' + dataList[i].caseHistoryDesc + '</p>' +
                                            '</section>';
                                    }
                                    break;
                                case "2":
                                    caseHistoryType = "药物史";
                                    if (dataList[i].caseHistoryName || dataList[i].caseHistoryDesc) {
                                        html += '<section class="mt20">' +
                                            '<span class="medical-title">' + caseHistoryType + '：</span><span class="medical-text old-sick-out">' + dataList[i].caseHistoryName + '</span>' +
                                            '<p class="medical-text old-sick-out mt10">' + dataList[i].caseHistoryDesc + '</p>' +
                                            '</section>';
                                    }
                                    break;
                                case "3":
                                    caseHistoryType = "外伤史";
                                    if (dataList[i].caseHistoryName || dataList[i].caseHistoryDesc) {
                                        html += '<section class="mt20">' +
                                            '<span class="medical-title">' + caseHistoryType + '：</span><span class="medical-text old-sick-out">' + dataList[i].caseHistoryName + '</span>' +
                                            '<p class="medical-text old-sick-out mt10">' + dataList[i].caseHistoryDesc + '</p>' +
                                            '</section>';
                                    }
                                    break;
                                case "4":
                                    caseHistoryType = "过敏史";
                                    if (dataList[i].caseHistoryName || dataList[i].caseHistoryDesc) {
                                        html += '<section class="mt20">' +
                                            '<span class="medical-title">' + caseHistoryType + '：</span><span class="medical-text old-sick-out">' + dataList[i].caseHistoryName + '</span>' +
                                            '<p class="medical-text old-sick-out mt10">' + dataList[i].caseHistoryDesc + '</p>' +
                                            '</section>';
                                    }
                                    break;
                                case "5":
                                    caseHistoryType = "疫区接触史";
                                    if (dataList[i].caseHistoryName || dataList[i].caseHistoryDesc) {
                                        html += '<section class="mt20">' +
                                            '<span class="medical-title medical-text-long">' + caseHistoryType + '：</span><span class="medical-text old-sick-out">' + dataList[i].caseHistoryName + '</span>' +
                                            '<p class="medical-text old-sick-out mt10">' + dataList[i].caseHistoryDesc + '</p>' +
                                            '</section>';
                                    }
                                    break;
                                default :
                                    caseHistoryType = "";
                            }
                            // html += '<section class="mt20">' +
                            //     '<span class="medical-title">' + caseHistoryType + '：</span><span class="medical-text old-sick-out">' + dataList[i].caseHistoryDesc + '</span>' +
                            //     '</section>';
                            $('.old-sick-out').html(html);
                        } else if (dataList[i].operatorType == 1) {
                            switch (dataList[i].caseHistoryType) {
                                case "0" :
                                    $(".old-sick-history-list li").eq(0).find("textarea").val(dataList[i].caseHistoryDesc).attr("data-id", dataList[i].id);
                                    caseHistoryType = "疾病史";
                                    break;
                                case "1" :
                                    $(".old-sick-history-list li").eq(1).find("textarea").val(dataList[i].caseHistoryDesc).attr("data-id", dataList[i].id);
                                    caseHistoryType = "手术史";
                                    break;
                                case "2":
                                    $(".old-sick-history-list li").eq(2).find("textarea").val(dataList[i].caseHistoryDesc).attr("data-id", dataList[i].id);
                                    caseHistoryType = "药物史";
                                    break;
                                case "3":
                                    $(".old-sick-history-list li").eq(3).find("textarea").val(dataList[i].caseHistoryDesc).attr("data-id", dataList[i].id);
                                    caseHistoryType = "外伤史";
                                    break;
                                case "4":
                                    $(".old-sick-history-list li").eq(4).find("textarea").val(dataList[i].caseHistoryDesc).attr("data-id", dataList[i].id);
                                    caseHistoryType = "过敏史";
                                    break;
                                case "5":
                                    $(".old-sick-history-list li").eq(5).find("textarea").val(dataList[i].caseHistoryDesc).attr("data-id", dataList[i].id);
                                    caseHistoryType = "疫区接触史";
                                    break;
                                default :
                                    caseHistoryType = "";
                            }
                        }

                    }
                }
            }).fail(function () {
                console.log("XHR error...");
            });
        },
        oldSickSave: function (dataList) {
            var that = this;

            if (!dataList[0].id) createTime = common.date.local_time();
            dataList = JSON.stringify(dataList);
            var createTime = "";
            var sortId = "";
            var siteId = "";

            var data = {
                //id: id,                                         //	string	是	id:不为空是修改，为空是新增
                patientId: localStorage.getItem("patientId"),   //	string	是	患者id
                caseId: localStorage.getItem("caseId"),         //	string	是	病例id
                operatorId: localStorage.getItem("userId"),                         //	string	是	操作人
                operatorType: 1,                                //	string	是	操作人类型0-患者1-医生
                caseHistoryType: "",                            //	string	是	既往史类型
                caseHistoryList: dataList,                    //	string	是	既往史idList
                caseHistoryName: "",                            //	string	是	既往史名称串
                caseHistoryDesc: "",                  //	string	是	既往史描述
                createTime: createTime,                         //	string	是	创建时间
                updateTime: common.date.local_time(),           //	string	是	修改时间
                sortId: sortId,                                 //	string	是	排序
                isValid: 1,                                     //	string	是	是否有效1-有效0-无效
                siteId: siteId                                  //	string	是	发送渠道
            };
            $.ajax({
                url: that.XHRList.oldSickSave,
                dataType: 'json',
                type: "POST",
                catch: false,
                async: false,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {
                if (data.responseObject.responseStatus) {
                    common.popupRight({text: "保存成功"});
                    that.oldSickSearch();
                } else {
                    common.popupRight({text: "保存失败"})
                }
            }).fail(function () {
                console.log("XHR error...");
            });
        },
        getMajorCheck: function () {
            var _this = this;
            var caseId = localStorage.getItem("caseId");
            var data = {
                caseId: caseId,	            //string	是	病例id
                isValid: 1,                  //string	是	1
                caseAttSpecPic: 1,	        //string	是	附件规格(1-原始文件、2-缩略图源文件、3-225*150、4-157*109、5-140*190、6-110*150、7-75*52、8-480*320、9-1280*720、10-900*600、12-300*200、13-450*300、14-750*500)
                caseAttSpecVideoPic: 10,	//string	是	附件规格(1-原始文件、2-缩略图源文件、3-225*150、4-157*109、5-140*190、6-110*150、7-75*52、8-480*320、9-1280*720、10-900*600、12-300*200、13-450*300、14-750*500)
                caseAttSpecVideo: 9,	    //string	是	附件规格(1-原始文件、2-缩略图源文件、3-225*150、4-157*109、5-140*190、6-110*150、7-75*52、8-480*320、9-1280*720、10-900*600、12-300*200、13-450*300、14-750*500)
                firstResult: 0,	            //string	是
                maxResult: 100,	            //string	是
                attUseFlag: 3
            };
            $.ajax({
                //url: "/call/customer/patient/case/physical/create/",
                url: _this.XHRList.majorCheck,
                dataType: 'json',
                type: "POST",
                catch: false,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {
                if (data.responseObject.responseData.data_list && data.responseObject.responseStatus != false) {
                    var data_list = data.responseObject.responseData.data_list;
                    var picMapList = {};
                    var picMapHtml = "";
                    var videoMapList = {};
                    var videoMapHtml = "";
                    //获取图片
                    if (data_list[0].picMap.length) {
                        var mapList = ["12"];
                        var mapList2 = ["12"];

                        $.each(data_list[0].picMap, function (key, value) {
                            // var type = "";      //    1-X光片2-CT3-超声4-核磁共振5-病理6-检查结果7-其他8-曾就诊病历9-专科检查10-化验及特殊检查11-体格检查',
                            // // switch (value.caseCategoryId) {
                            // //     case "1" :
                            // //         type = "X光片";
                            // //         break;
                            // //     case "2" :
                            // //         type = "CT";
                            // //         break;
                            // //     case "3" :
                            // //         type = "超声";
                            // //         break;
                            // //     case "4" :
                            // //         type = "核磁共振";
                            // //         break;
                            // //     case "5" :
                            // //         type = "病理";
                            // //         break;
                            // //     case "6" :
                            // //         type = "检查结果";
                            // //         break;
                            // //     case "7" :
                            // //         type = "其他";
                            // //         break;
                            // //     case "8" :
                            // //         type = "曾就诊病历";
                            // //         break;
                            // //     case "9" :
                            // //         type = "专科检查";
                            // //         break;
                            // //     case "10" :
                            // //         type = "化验及特殊检查";
                            // //         break;
                            // //     case "11" :
                            // //         type = "体格检查";
                            // //         break;
                            // //     default:
                            // //         switch (value.caseAttSource) {
                            // //             case "0":
                            // //                 type = "其他";
                            // //                 break;
                            // //             case "1":
                            // //             case "2":
                            // //                 if (value.caseAttType == 1) {
                            // //                     type = "外观图片";
                            // //                 } else if (value.caseAttType == 2) {
                            // //                     type = "视频";
                            // //                 }
                            // //         }
                            // // }

                            switch (value.caseAttSource) {   //0-历史健康信息 1-视诊检查检验 2-初诊建议 3 检查检验 4患处照片,
                                case "0":
                                case "2":
                                case "3":
                                case "5":
                                    picMapHtml = '<li>' +
                                        '<section>' +
                                        '<img src="' + value.caseAttUrl + '"/>' +
                                        '<p>' + "检查资料" + '</p>' +
                                        '</section>' +
                                        '</li>';
                                    // if (mapList.indexOf(value.caseCategoryId) == -1) {
                                    //     mapList.push(value.caseCategoryId);
                                    //     picMapHtml += '<li>' +
                                    //         '<section>' +
                                    //         '<img src="' + value.caseAttUrl + '"/>' +
                                    //         '<p>' + type + '</p>' +
                                    //         '</section>' +
                                    //         '</li>';
                                    // }
                                    break;
                                case "1":
                                case "4":
                                case "6":
                                    videoMapHtml = '<li>' +
                                        '<section>' +
                                        '<img  class="J_img_show" src="' + value.caseAttUrl + '"/>' +
                                        '<p>患病处照片</p>' +
                                        '</section>' +
                                        '</li>';
                                    // if (mapList2.indexOf(value.caseCategoryId) == -1) {
                                    //     mapList2.push(value.caseCategoryId);
                                    //     videoMapHtml += '<li>' +
                                    //         '<section>' +
                                    //         '<img  class="J_img_show" src="' + value.caseAttUrl + '"/>' +
                                    //         '<p>' + type + '</p>' +
                                    //         '</section>' +
                                    //         '</li>';
                                    // }
                                    break;
                            }
                            // if (mapList.indexOf(value.caseCategoryId) == -1) {
                            //     mapList.push(value.caseCategoryId);
                            //     picMapHtml += '<li>' +
                            //         '<section>' +
                            //         '<img src="' + value.caseAttUrl + '"/>' +
                            //         '<p>' + type + '</p>' +
                            //         '</section>' +
                            //         '</li>';
                            // }
                        });
                        if (picMapHtml == "") {
                            var noDataHtml = "<li class='noData'>患者未上传资料</li>";
                            $('.talkImgMore').html(noDataHtml);
                        } else {
                            // $.each(picMapList,function(key,value){
                            //     picMapHtml+= value;
                            // });
                            $('.talkImgMore').html(picMapHtml);
                            $(".talkImgMore li").on("click", function () {
                                timeOne = setTimeout(function () {
                                    _this.bigPictureShow(0);
                                },250)
                            })
                            $(".talkImgMore li").on("dblclick", function () {
                                clearTimeout(timeOne)
                            })
                        }

                        if (videoMapHtml != "") {
                            // $.each(videoMapList,function(key,value){
                            //     videoMapHtml+= value;
                            // });

                            $('.video-check-show').html(videoMapHtml);

                            $(".video-check-show  .J_img_show").each(function (key, value) {
                                $(this).on("click", function () {
                                    timeTwo = setTimeout(function () {
                                        _this.bigPictureShow(1);
                                    },250)
                                })
                                $(this).on("dblclick", function () {
                                    clearTimeout(timeTwo)
                                })
                            });
                        }else{
                            //debugger;
                            $('.video-check-show').html("");
                        }

                    } else {
                        var noDataHtml = "<li class='noData'>患者未上传资料</li>";
                        $('.talkImgMore').html(noDataHtml);
                        $('.video-check-show').html("");

                    }

                    //获取视频
                    if (data_list[1].videoMap.length) {
                        var videoMapHtml_video = "";
                        $.each(data_list[1].videoMap, function (key, value) {
                            videoMapHtml_video += '<li>' +
                                '<section>' +
                                '<img  class="J_video_show" src="' + value.caseAttUrl + '"  data-video="' + value.videoList[0].caseAttUrl + '"/>' +
                                //    '<p>' + value.caseAttName + '</p>' +
                                '<p>动作视频</p>' +
                                '</section>' +
                                '</li>';
                        });
                        $('.video-check-show').append(videoMapHtml_video);

                        $(".video-check-show .J_video_show").each(function (key, value) {
                            if ($(this).attr("data-video") != "") {
                                $(this).on("click", function () {
                                    var hrefVideo = $(this).attr("data-video");
                                    _this.videoShow(hrefVideo);
                                })
                            }
                        });

                    } else {
                        // var noDataHtmlCheck = "<li class='noData'>视诊无内容</li>";
                        //  $('.video-check-show').html(noDataHtmlCheck);
                    }

                } else {
                    var noDataHtml = "<li class='noData'>患者未上传资料</li>";
                    $('.talkImgMore').html(noDataHtml);


                    //  var noDataHtmlCheck = "<li class='noData'>视诊无内容</li>";
                    //  $('.video-check-show').html(noDataHtmlCheck);
                }
            }).fail(function () {
                console.log("XHR error...");
            });
        },
        bigPictureShow: function (caseAttSource) {
            if (caseAttSource == 0) {
                caseAttSource = "0,2,3,5";
                //    caseAttSource = "";
            }else{
                caseAttSource = "1,4,6";
            }
            //debugger;
            var _this = this;
            var isInit = true;
            $.ajax({
                beforeSend: function (XHR) {
                    console.log("发送之前");
                },
                url: _this.XHRList.majorCheck,
                data: {
                    paramJson: $.toJSON({
                        caseId: localStorage.getItem("caseId"),	 //string	是	病例id
                        isValid: 1,                              //string	是	1
                        caseAttSpecPic: 1,	                     //string	是	附件规格(1-原始文件、2-缩略图源文件、3-225*150、4-157*109、5-140*190、6-110*150、7-75*52、8-480*320、9-1280*720、10-900*600、12-300*200、13-450*300、14-750*500)
                        caseAttSpecVideoPic: 10,	                 //string	是	附件规格(1-原始文件、2-缩略图源文件、3-225*150、4-157*109、5-140*190、6-110*150、7-75*52、8-480*320、9-1280*720、10-900*600、12-300*200、13-450*300、14-750*500)
                        caseAttSpecVideo: 1,	                 //string	是	附件规格(1-原始文件、2-缩略图源文件、3-225*150、4-157*109、5-140*190、6-110*150、7-75*52、8-480*320、9-1280*720、10-900*600、12-300*200、13-450*300、14-750*500)
                        firstResult: 0,	                         //string	是
                        maxResult: 100,	                         //string	是
                        caseAttSource: caseAttSource,
                        attUseFlag: 1
                    })
                },
                success: function (data) {

                    if (data) {
                        var str = "";
                        var swiperDom = "";

                        if (data.responseObject.responseData.data_list && data.responseObject.responseStatus != false) {
                            var data_list = data.responseObject.responseData.data_list;
                            if (data_list[0].picMap.length) {
                                $.each(data_list[0].picMap, function (key, value) {
                                    str += '<div class="swiper-slide swiper-no-swiping " style="margin-right:10px"><img src=' + value.caseAttUrl + ' /></div>';
                                });

                                if (data_list[0].picMap.length == 1) {
                                    var isInit = false;
                                    swiperDom = '<div id="EV-swiper">' +
                                        '<div class="background-hidden">' +
                                        '<div class="rotate-button"></div>' +
                                        '<div class="bigger-button"></div>' +
                                        '<div class="smaller-button"></div>' +
                                        '  <div class="swiper-container gallery-top">' +
                                        '      <div class="swiper-wrapper">' +
                                        //  str +
                                        '      </div>' +
                                        '</div>' +
                                        '      <div class="swiper-pagination EV-gallery-top"></div>' +
                                        '      </div>' +
                                        '      <div class="closeBtn"></div>' +
                                        '      </div>';
                                } else if (data_list[0].picMap.length <= 6) {
                                    isInit = false;
                                    swiperDom = '<div id="EV-swiper">' +
                                        '<div class="background-hidden">' +
                                        '<div class="rotate-button"></div>' +
                                        '<div class="bigger-button"></div>' +
                                        '<div class="smaller-button"></div>' +
                                        '  <div class="swiper-container gallery-top">' +
                                        '      <div class="swiper-wrapper">' +
                                        //     str +
                                        '      </div>' +
                                        '</div>' +
                                        '      <div class="swiper-button-next swiper-right-gray"></div>' +
                                        '      <div class="swiper-button-prev swiper-left-gray"></div>' +
                                        '      <div class="swiper-pagination EV-gallery-top"></div>' +

                                        '      </div>' +
                                        '      <div class="swiper-container gallery-thumbs">' +
                                        '      <div class="swiper-wrapper  swiper-wrapper-center">' +
                                        //  str +
                                        '      </div>' +
                                        '      <!-- Add Pagination -->' +
                                        '      <div class="swiper-pagination EV-gallery-thumbs"></div>' +
                                        '      </div>' +
                                        '      <div class="closeBtn"></div>' +

                                        '      </div>';


                                } else {
                                    swiperDom = '<div id="EV-swiper">' +
                                        '<div class="background-hidden">' +
                                        '<div class="rotate-button"></div>' +
                                        '<div class="bigger-button"></div>' +
                                        '<div class="smaller-button"></div>' +
                                        '<div class="swiper-container gallery-top">' +
                                        '      <div class="swiper-wrapper">' +
                                        // str +
                                        '      </div>' +
                                        '</div>' +
                                        '      <div class="swiper-button-next swiper-right-gray"></div>' +
                                        '      <div class="swiper-button-prev swiper-left-gray"></div>' +
                                        '      <div class="swiper-pagination EV-gallery-top"></div>' +

                                        '      </div>' +
                                        '      <div class="swiper-container gallery-thumbs">' +
                                        '      <div class="swiper-wrapper">' +
                                        //str +
                                        '      </div>' +
                                        '      <!-- Add Pagination -->' +
                                        '      <div class="swiper-button-next swiper-right-gray"></div>' +
                                        '      <div class="swiper-button-prev swiper-left-gray"></div>' +
                                        '      <div class="swiper-pagination EV-gallery-thumbs"></div>' +
                                        '      </div>' +
                                        '      <div class="closeBtn"></div>' +

                                        '      </div>';
                                    isInit = true;
                                }
                            }
                            // bigPicShow.addSwiperDom("", "", swiperDom);
                            // var windowScrollY = window.scrollY;
                            //  bigPicShow.addBindClose(windowScrollY);
                            //  $(".talkImgMore li").on("click",function(){
                            //debugger;
                            $.bigPicShow({
                                swiperList: str,
                                index: data_list[0].picMap.length,
                                topSwiperOptions: {
                                    isInit: true,//是否需要初始化,
                                    // loop: true, // 开启循环模式,必须设置loopedSlides
                                    // loopedSlides: 5, //looped slides should be the same
                                    autoplay: "",//自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换。
                                    preventClicks: false,//当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转。
                                    //pagination : '.swiper-pagination', //分页器
                                    noSwiping: true,
                                    pagination: '',//分页器q
                                    paginationType: 'fraction',
                                    /*** ‘bullets’  圆点（默认）‘fraction’  分式‘progress’  进度条‘custom’ 自定义**/
                                    prevButton: '.swiper-button-prev',
                                    nextButton: '.swiper-button-next',//前进按钮的css选择器或HTML元素。
                                    /**
                                     *  回调函数，初始化后执行。
                                     */
                                    simulateTouch: false,
                                    onInit: function (swiper) {
                                        $(".gallery-thumbs .swiper-slide").on("click", function () {
                                            var index = $(this).index();
                                            console.log("asdfasdfasdf");
                                            swiper.slideTo(index);//切换到第一个slide，速度为1秒
                                        });
                                        // $(".gallery-thumbs .swiper-slide").eq(0).addClass("swiper-slide-active");
                                        $(".gallery-thumbs .swiper-slide-active").length > 0 ? " " : $(".gallery-thumbs .swiper-slide").eq(0).addClass("swiper-slide-active");

                                        $('.swiper-right-gray').on("click", function () {
                                            $("#EV-swiper .gallery-thumbs").stop().addClass("show");
                                            setTimeout(function () {
                                                $("#EV-swiper .gallery-thumbs").stop().removeClass("show");
                                            }, 0);
                                        });

                                        $('.swiper-left-gray').on("click", function () {
                                            $("#EV-swiper .gallery-thumbs").stop(false, true).addClass("show");
                                            setTimeout(function () {
                                                $("#EV-swiper .gallery-thumbs").stop(false, true).removeClass("show");
                                            }, 0);
                                        });
                                        console.log("sipwer初始化完成!,回调函数，初始化后执行。");
                                        //查看大图 旋转 缩放 保存
                                            $.openPhotoGallery($(".swiper-slide-active").eq(0));
                                            console.log("检查及诊断结果-查看大图!");
                                    },
                                    /**
                                     * 回调函数，当你轻触(tap)Swiper后执行。在移动端，click会有 200~300 ms延迟，所以请用tap代替click作为点击事件。
                                     * */
                                    onTap: function (swiper, event) {
                                        console.log(swiper.activeIndex); //swiper当前的活动块的索引


                                        console.log(swiper.realIndex);//swiper当前的活动块的真实索引,排除loop模式下添加的滑块DOM
                                        console.log(swiper.clickedIndex);//返回最后点击Slide的索引。(click)
                                        swiper.stopAutoplay();    //停止自动切换
                                        swiper.startAutoplay();    //开始自动切换
                                    },
                                    onSlideChangeStart: function (swiper) { //滑块释放时如果触发slider切换则执行
                                        console.log(swiper.activeIndex + "当前索引");
                                        if (!isInit) {
                                            $(".gallery-thumbs .swiper-slide").removeClass("swiper-slide-active").eq(swiper.activeIndex).addClass("swiper-slide-active");

                                        }
                                        console.log("loop循环模式前的索引值为" + swiper.realIndex);
                                        //查看大图 旋转 缩放 保存
                                            $.openPhotoGallery($(".swiper-slide-active").eq(0));
                                            console.log("视诊查看大图!");
                                    }
                                },
                                bottomSwiperOptions: {
                                    isInit: isInit,//是否需要初始化,
                                    // loop: true, // 开启循环模式,必须设置loopedSlides
                                    paginationType: '',
                                    loopedSlides: 5 //looped slides should be the same
                                },
                                /**
                                 * 为每个指定的图片（会触发大图）单击事件绑定回调函数
                                 * 此方法针对以dom为数据源的方式
                                 * */
                                imgElementCallBack: function () {
                                    console.log("为每个指定的图片（会触发大图）单击事件绑定回调函数");
                                },
                                /**
                                 * 关闭按钮回调函数
                                 * */
                                closeCallBack: function () {
                                    console.log("关闭按钮回调函数");
                                },
                                /**
                                 * 指定的dom结构
                                 * */
                                swiperDom: swiperDom
                            });
                            //     });
                        }

                    }
                }
            });

        },
        videoShow: function (data) {

            //    var htmlText = "<video src=" + data + " controls='controls'>";

            var date = new Date();
            var s = date.getSeconds();


            var htmlText = '<section class="maskers infoBox-tips show">' +
                '<section class="infoBox-inner video-Box">' +
                //   '<video src=" ' + data + ' " controls="controls"></video>' +
                '<video id="example_video_2' + s + '" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered" oncontextmenu="return true">' +
                '<source src="' + data + '"></source>' +
                '</video>' +
                '</section>' +
                '<section class="mask-close"></section>' +
                '</section>' +
                '<section class="mask-background show"></section>';

            common.gbw.infoBox({
                html: htmlText,
                container: $(".main-inner")
            });
            var player2 = new window.AllinmdPlayer('example_video_2' + s, {
                width: 800,
                height: 600,
                controls: true
            }, function () {
                console.log("videojs对象初始化后的回调函数");
            });
        },
        provinceShow: function () {
            var that = this;
            var data = {
                //parentId:"",
                isValid: 1,
                firstResult: 0,
                maxResult: 9999,
                //regionName:,
                treeLevel: 2       //省:2;
            };

            $.ajax({
                url: that.XHRList.addressSearch,
                type: "post",
                catch: false,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {
                if (data != undefined && data != "" && data.responseObject.responseStatus != false) {
                    data = data.responseObject.responseData.dataList;
                    var html = '<li class="custom-selector-item result-item" data-down-role="0" data-value="0"><span>请选择</span></li>';

                    $.each(data, function (k, v) {
                        html += '<li class="custom-selector-item secondListTitle" data-down-role="' + v.regionId + '" data-value="' + v.regionId + '"><span>' + v.regionName + '</span></li>';
                    });

                    $(".J-province", "[data-users='" + localStorage.getItem("caseId") + "']").append(html);
                }
            }).fail(function () {
                console.log("失败");
            });

        },
        cityShow: function () {
            var that = this;
            var data = {
                //parentId:"",
                isValid: 1,
                firstResult: 0,
                maxResult: 9999,
                // regionName:,
                treeLevel: 3
            };
            $.ajax({
                url: that.XHRList.addressSearch,
                type: "post",
                catch: false,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {

                if (data.responseObject.responseData.dataList && data.responseObject.responseStatus != false) {
                    data = data.responseObject.responseData.dataList;
                    var allObj = {};

                    $.each(data, function (k, v) {
                        var cityList = [];
                        var cityObj = {
                            parentId: "",
                            regionName: "",
                            regionId: ""
                        };
                        cityObj.parentId = v.parentId;
                        cityObj.regionName = v.regionName;
                        cityObj.regionId = v.regionId;


                        cityList.push(cityObj);

                        if (allObj[v.parentId]) {

                            var oldData = allObj[v.parentId];
                            oldData.push(cityObj);
                            allObj[v.parentId] = oldData;
                        } else {
                            allObj[v.parentId] = cityList;

                        }
                    });
                     console.log(allObj);
                    var html = "";
                    $.each(allObj, function (k, v) {
                        html += '<div class="custom-selector-second custom-selector-second-list secondList" data-down-role="' + k + '">';
                        html += '<li class="custom-selector-item result-item"><span>未知</span></li>';
                        for (var i = 0; i < v.length; i++) {

                            html += '<li class="custom-selector-item thirdListTitle" data-down-role="' + v[i].regionId + '" data-value="' + v[i].regionId + '"><span>' + v[i].regionName + '</span></li>';
                        }
                        html += '</div>';
                    });


                    // $(".custom-selector-second-box", ".medical-record").append(html);
                    $(".custom-selector-second-box", "[data-users='" + localStorage.getItem("caseId") + "']").append(html);

                    //   var html = '<li class="custom-selector-item secondListTitle"><span>不限</span></li>';

                    //  $(".J-province").html(html);
                }
            }).fail(function () {
                console.log("失败");
            })
        },
        districtShow: function () {
            var that = this;
            var data = {
                //parentId:"",
                isValid: 1,
                firstResult: 0,
                maxResult: 9999,
                // regionName:,
                treeLevel: 4
            };
            $.ajax({
                url: that.XHRList.addressSearch,
                type: "post",
                catch: false,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {
                if (data.responseObject.responseData.dataList && data.responseObject.responseStatus != false) {
                    data = data.responseObject.responseData.dataList;

                    var allObj = {};

                    $.each(data, function (k, v) {
                        var cityList = [];
                        var cityObj = {
                            parentId: "",
                            regionName: "",
                            regionId: ""
                        };
                        cityObj.parentId = v.parentId;
                        cityObj.regionName = v.regionName;
                        cityObj.regionId = v.regionId;


                        cityList.push(cityObj);

                        if (allObj[v.parentId]) {

                            var oldData = allObj[v.parentId];
                            oldData.push(cityObj);
                            allObj[v.parentId] = oldData;
                        } else {
                            allObj[v.parentId] = cityList;

                        }
                    });
                    // console.log(allObj);
                    var html = "";
                    $.each(allObj, function (k, v) {
                        html += '<div class="custom-selector-second custom-selector-second-list thirdList" data-down-role="' + k + '">';
                        html += '<li class="custom-selector-item result-item"><span>未知</span></li>';
                        for (var i = 0; i < v.length; i++) {
                            // console.log(v[i]);

                            html += '<li class="custom-selector-item result-item" data-value="' + v[i].regionId + '"><span>' + v[i].regionName + '</span></li>';
                        }
                        html += '</div>';
                    });
                    // console.log(html);
                    // $(".custom-selector-second-box", ".medical-record").append(html);
                    $(".custom-selector-second-box", "[data-users='" + localStorage.getItem("caseId") + "']").append(html);

                    //   var html = '<li class="custom-selector-item secondListTitle"><span>不限</span></li>';

                    //  $(".J-province").html(html);
                }
            }).fail(function () {
                console.log("失败");
            })
        },
        nationSearch: function () {
            var that = this;
            var data = {
                // parentId: "1",
                isValid: 1,
                firstResult: 0,
                maxResult: 100     //
                // regionName:"",
                // treeLevel:""
            };
            $.ajax({
                url: that.XHRList.nationSearch,
                dataType: 'json',
                async: false,
                type: "POST",
                data: {
                    paramJson: $.toJSON(data)
                },
                success: function (data) {
                    if (data.responseObject.responseData && data.responseObject.responseStatus != false) {
                        var dataList = data.responseObject.responseData.dataList;
                        var nationHtml = "";
                        nationHtml = "<option  value=''>请选择</option>";
                        $.each(dataList, function (index, value) {
                            nationHtml += "<option  value=" + value.nationality + ">" + value.nationality + "</option>";
                        });
                        $('.J-nation').append(nationHtml);
                        // $('.J-nation').find("option[value='170']").attr("selected", true);
                    }
                },
                error: function () {
                    console.log("获取数据失败!");
                }
            });
        },
        formatNumber: function (target, unit) {
            $("." + target).keyup(function (event) {
                $(this).val($(this).val().replace(/[^0-9.]/g, ''));
            });
            // $("."+target).keydown(function (event) {
            //     var reg =  /^[0-9]+.?[0-9]/;
            //         console.log(String.fromCharCode(event.keyCode));
            //     return (reg.test(String.fromCharCode(event.keyCode)))
            // });
            $("." + target).on('focus', function () {
                var text = $(this).val();
                var re = new RegExp(unit, "ig");
                $(this).val(text.replace(re, " "));
            });
            $("." + target).on('blur', function () {
                var text = $(this).val();
                if (text && text.indexOf(unit) == -1) {
                    $(this).val(text + unit);
                }
            });
        },
        remarkInit: function (flag) {
            //状态
            switch (flag) {
                case 0:
                    $(".remark-new", ".medical-record-remark-header").addClass('active').siblings("section").removeClass("active");
                    $(".remark-back", ".medical-record-remark-header .remark-new").addClass("on");
                    break;  //修改数据
                case 1:
                    $(".remark-add", ".medical-record-remark-header").addClass('active').siblings("section").removeClass("active");
                    break;  //新建
                case 2:
                    $(".remark-reduce", ".medical-record-remark-header").addClass('active').siblings("section").removeClass("active");
                    break;  //压缩
                case 4:
                    $(".remark-new", ".medical-record-remark-header").addClass('active').siblings("section").removeClass("active");
                    $(".remark-back", ".medical-record-remark-header .remark-new").removeClass("on");
                    break;  //无数据
                default:
                    console.log("无");
            }
        },
        remark: function () {
            //  debugger;
            console.log(2341);
            var that = this;
            that.remarkInit(1);
            $('.medical-record-remark').addClass("on");
            // $(".edit", ".medical-record-remark-content").addClass('active').siblings("section").removeClass("active");
            $('.medical-record-form').addClass("on");


            //备注按钮
            $('.remark-name').on('click', function () {
                that.remarkInit(1);
                $('.medical-record-remark').addClass("on");
                $(".date", ".medical-record-remark-content").addClass('active').siblings("section").removeClass("active");
                $('.medical-record-form').addClass("on");
            });

            //收起
            $('.remark-toggle').on('click', function () {
                that.remarkInit(2);
                $('.medical-record-remark').removeClass("on");
                $('.medical-record-form').removeClass("on");
            });

            //新建按钮
            $('.remark-build').on('click', function () {
                that.remarkInit(0);
                $(".edit", ".medical-record-remark-content").addClass('active').siblings("section").removeClass("active");
                $(".edit", ".medical-record-remark-content").find("article").text(" ");
            });

            //返回按钮
            $('.remark-back').on('click', function () {
                $(".remark-add", ".medical-record-remark-header").addClass('active').siblings("section").removeClass("active");
                $(".date", ".medical-record-remark-content").addClass('active').siblings("section").removeClass("active");
            });

            //保存按钮
            $('.saveButton').on('click', function () {
                //保存成功
                var sucessful = true;
                if (sucessful) {
                    $(".remark-add", ".medical-record-remark-header").addClass('active').siblings("section").removeClass("active");
                    $(".date", ".medical-record-remark-content").addClass('active').siblings("section").removeClass("active");
                } else {
                    console.log("保存失败");
                }
            });

            //删除按钮
            $('.delete', ".medical-record-remark-content").on('click', function () {
                common.confirmBox({
                    textList: {
                        text: "确定删除该回复吗"
                    },
                    ensure: '确定',
                    cancel: '取消',
                    container: $(this).parent(),
                    ensureCallback: function () {
                        alert("确定！");
                    },
                    cancelCallback: function () {
                        alert("取消");
                    }
                });
                //   $(this).parents('article').remove();
            });

            //详情按钮
            $('.text', '.medical-record-remark-content').on('click', function () {
                var text = $(this).text();
                var time = $(this).next().text();
                $(".remark-new", ".medical-record-remark-header").addClass('active').siblings("section").removeClass("active");
                $(".edit", ".medical-record-remark-content").addClass('active').siblings("section").removeClass("active");
                $(".edit", ".medical-record-remark-content").find("article").text(text);
                $(".remark-time", ".medical-record-remark-content").text(time);
            });
        },
        textSubstr: function () {//截断字符（最长输入50个，对多显示18个）
            $("input[type='text']", ".medical-record-form").on("blur", function () {
                var text = $(this).val();
                $(this).attr("data-val", text);
                var text_substr = common.getStrByteLen(text, 18);
                $(this).val(text_substr);
            });
            $("input[type='text']", ".medical-record-form").on("focus", function () {
                var text = $(this).attr("data-val");
                if (text != undefined && text != "") {
                    $(this).val(text);
                }
            });
        },
        textareaHeight: function () {
            var _this = this;
            $('.J-textArea').each(function () {
                // $(this).keydown(function () {
                //     var maxRow = 8;
                //     var scrollTop = $(this).scrollTop();
                //     var rows = $(this).attr("rows");
                //     if (scrollTop > 0 && rows < maxRow) {
                //         $(this).attr("rows", parseInt(rows) + 1);
                //     }
                // });
                $(this).one("focus", function () {
                    $(this).text(" ").css("color", "#000");
                });
                $(this).keydown(function (e) {
                    e = e ? e : event;
                    if ($(this).text().length > 100) {
                        if (e.keyCode == 8) {
                        } else {
                            e.preventDefault();
                            var text100 = $(this).text().toString().substr(0, 100);
                            $(this).html(text100);
                        }
                    }
                })
            });
        },
        getData: function (data) {

            data = data[0];
            function splitString(list, mainTitle) {
                var result = "";
                $(list).each(function (index, element) {
                    if (index === 3) {
                        mLink = "加重";
                        if (mainTitle == "主要症状" && list[3].symptomOptions[0].optionName != "") {
                            if (list[3].symptomOptions[0].isAttachment == 2) {

                                $(".J-caseMain ").append("," + mLink + list[3].symptomOptions[0].optionDesc);
                            } else {
                                $(".J-caseMain ").append("," + mLink + list[3].symptomOptions[0].optionName);
                            }
                        }
                        if (mainTitle == "伴随症状" && list[3].symptomOptions[0].optionName != "") {
                            if (list[3].symptomOptions[0].isAttachment == 2) {

                                $(".J-caseMain ").append("," + mLink + list[3].symptomOptions[0].optionDesc);
                            } else {
                                $(".J-caseAlong ").append("," + mLink + list[3].symptomOptions[0].optionName);
                            }

                        }
                    }
                    result += '<section class="mt20">' +
                        (function () {
                            var title = "";
                            switch (index) {
                                case 0:
                                    title = '<span class="main-title">' + mainTitle + '：</span>' + '<span class="main-text">' + (mainTitle === "主要症状" ? data.patientCasemap.caseMain : data.patientCasemap.caseAlong) + '</span>';
                                    break;
                                case 1:
                                    title = '<span class="main-title main-title-long">影响活动程度：</span>';
                                    break;
                                case 2:
                                    break;
                                case 3:
                                    break;
                                case 4:
                                    title = '<span class="main-title">何时加重：</span>';
                                    break;
                                case 5:
                                    title = '<span class="main-title">何时缓解：</span>';
                                    break;
                                case 6:
                                    title = '<span class="main-title">曾做治疗：</span>';
                                    break;
                            }
                            return title;
                        }()) +
                        (function (sList) {
                            var sResult = "", link = "-";
                            if (index === 0) {
                                if (list[3]) {
                                    sResult += '<span class="main-text">，加重' + (list[3] ? (list[3].symptomOptions[0].isAttachment == 2 ? list[3].symptomOptions[0].optionDesc : list[3].symptomOptions[0].optionName) : '') + '</span>';
                                }
                            } else if (index === 2 || index === 3) {
                                return "";
                            } else {
                                $(sList).each(function (iindex, eelement) {
                                    if (iindex === sList.length - 1) {
                                        link = ""
                                    } else if (parseInt(eelement.isMain) === 1) {
                                        link = "伴随";
                                    } else {
                                        link = "-";
                                    }
                                    sResult += '<span class="main-text">' + (eelement.isAttachment == 2 ? eelement.optionDesc : eelement.optionName) + '</span>' + link;
                                });
                            }
                            return sResult;
                        })(element.symptomOptions) +
                        '</section>';
                });
                return result;
            }

            (function (mList) {
                $(".main-sick-describe").append(splitString(mList, "主要症状"));
            }(data.resultMainList));

            (function (mList) {
                $(".main-sick-describe").append(splitString(mList, "伴随症状"));
            }(data.resultAlongList));

            (function (patientCasemap) {
                var patientHtml = '<section class="mt20"><span class="main-title main-title-long">曾就诊情况：</span><span class="main-text">' + patientCasemap.treatmentName + '&nbsp&nbsp' + patientCasemap.illnessName + '</span></section>';
                $(".main-sick-describe").append(patientHtml);
            }(data.patientCasemap))
        }
    };
// medicalRecord.init();
    return medicalRecord;
})
;
