/**
* @name:省市区选择器
* @desc:
* @example:
* @depend:
* @date: 2017/10/24
* @author: gubowen
*/
<template>
    <nav class="userlist-sortType address-selector">
        <section class="userlist-sortType-item">
            <section class="custom-selector">
                <h3 class="custom-selector-title firstListTitle" @click.stop="showData()">{{showAddress}}</h3>
                <i class="icon-downArrow" @click.stop="showData()"></i>
                <section class="custom-selector-second-box" v-show="conIndex===currentIndexNow">
                    <ul class="custom-selector-second firstList J-province" v-show="provinceFlag">
                        <li class="custom-selector-item secondListTitle" @click.stop="selectProvince()"><span>请选择</span></li>
                        <li class="custom-selector-item secondListTitle" v-for="item in provinceList" @click.stop="selectProvince(item)">
                            <span>{{item.regionName}}</span>
                        </li>
                    </ul>
                    <ul class="custom-selector-second custom-selector-second-list secondList" v-show="cityFlag ">
                        <li class="custom-selector-item result-item" @click.stop="selectCity()">
                            <span>未知</span>
                        </li>
                        <li class="custom-selector-item thirdListTitle" v-for=" cItem in  cityList" @click.stop="selectCity(cItem)">
                            <span>{{cItem.regionName}}</span>
                        </li>
                    </ul>
                    <ul class="custom-selector-second custom-selector-second-list thirdList" v-show="districtFlag ">
                        <li class="custom-selector-item result-item" @click.stop="selectDistrict()">
                            <span>未知</span>
                        </li>
                        <li class="custom-selector-item thirdListTitle" v-for=" ccItem in  districtList" @click.stop="selectDistrict(ccItem)">
                            <span>{{ccItem.regionName}}</span>
                        </li>
                    </ul>
                </section>
            </section>
        </section>
    </nav>
</template>
<script>
    import api from '@/common/js/util';
    export default{
        name: 'address-selector',
        data(){
            return {
                addressSearch: "/call/comm/data/baseinfo/v1/getRegionList/",
                provinceList: [],
                provinceFlag: false,
                cityList: {},
                cityFlag: false,
                districtList: {},
                districtFlag: false,
                showAddress: '请选择',
                dataBack: {
                    provinceId: '',
                    provinceName: '',
                    cityId: '',
                    cityName: '',
                    districtId: '',
                    districtName: ''
                }
            }
        },
        props: {
            dataListInfo: {
                type: Object,
            },
            conIndex: {
                type: Number
            },
            currentIndexNow: {
                type: Number || String,
                default:-1
            }
        },
        methods: {
            init(){
//        console.log(this.dataListInfo);
//        console.log(this.dataListInfo.provinceName);
                if (this.dataListInfo.provinceName == '') {

                } else {
                    this.showAddress = this.dataListInfo.provinceName + '-' + this.dataListInfo.cityName + '-' + this.dataListInfo.districtName;
                }

//                this.showCity();
//                this.showDistrict();
            },
            showProvince(){
                let _this = this;
                let dataValue = {
                    //parentId:"",
                    isValid: 1,
                    firstResult: 0,
                    maxResult: 9999,
                    //regionName:,
                    treeLevel: 2       //省:2;
                };
                api.ajax({         //获取省信息
                    url: _this.addressSearch,
                    method: "POST",
                    data: dataValue,
                    beforeSend(config) {
                    },
                    done(res){
                        if (res != undefined && res != "" && res.responseObject.responseStatus != false) {
                            _this.provinceList = res.responseObject.responseData.dataList;
                        }
                    },
                    fail(error){
                        console.log("请求失败：" + error);
                    }
                });
            },
            showCity(item){
                let _this = this;
                let dataValue = {
                    isValid: 1,
                    firstResult: 0,
                    maxResult: 9999,
                    treeLevel: 3,
                    parentId:item.regionId
                };

                api.ajax({         //获取市信息
                    url: _this.addressSearch,
                    method: "POST",
                    data: dataValue,
                    beforeSend(config) {
                    },
                    done(res){
                        if (res.responseObject.responseData.dataList && res.responseObject.responseStatus != false) {
                            let data = res.responseObject.responseData.dataList;
                            _this.cityList=data;
      /*                      $.each(data, function (k, v) {
                                let cityListInfo = [];
                                let cityObj = {
                                    parentId: "",
                                    regionName: "",
                                    regionId: ""
                                };
                                cityObj.parentId = v.parentId;
                                cityObj.regionName = v.regionName;
                                cityObj.regionId = v.regionId;
                                cityListInfo.push(cityObj);
                                if (_this.cityList[v.parentId]) {
                                    let oldData = _this.cityList[v.parentId];
                                    oldData.push(cityObj);
                                    _this.cityList[v.parentId] = oldData;
                                } else {
                                    _this.cityList[v.parentId] = cityListInfo;
                                }
                            });*/
                        }
                    },
                    fail(error){
                        console.log("请求失败：" + error);
                    }
                });
            },
            showDistrict(item){
                let _this = this;
                let dataValue = {
                    isValid: 1,
                    firstResult: 0,
                    maxResult: 9999,
                    treeLevel: 4,
                    parentId:item.regionId
                };
                api.ajax({         //获取区信息
                    url: _this.addressSearch,
                    method: "POST",
                    data: dataValue,
                    beforeSend(config) {
                    },
                    done(res){
                        if (res.responseObject.responseData.dataList && res.responseObject.responseStatus != false) {
                            let data = res.responseObject.responseData.dataList;
                            _this.districtList=data;
/*                            $.each(data, function (k, v) {
                                let districtListInfo = [];
                                let cityObj = {
                                    parentId: "",
                                    regionName: "",
                                    regionId: ""
                                };
                                cityObj.parentId = v.parentId;
                                cityObj.regionName = v.regionName;
                                cityObj.regionId = v.regionId;
                                districtListInfo.push(cityObj);

                                if (_this.districtList[v.parentId]) {
                                    let oldData = _this.districtList[v.parentId];
                                    oldData.push(cityObj);
                                    _this.districtList[v.parentId] = oldData;
                                } else {
                                    _this.districtList[v.parentId] = districtListInfo;
                                }
                            });*/
                        }
                    },
                    fail(error){
                        console.log("请求失败：" + error);
                    }
                });
            },
            showData(){
                this.$emit("update:currentIndexNow",this.conIndex);
                if (this.provinceList.length===0){
                    this.showProvince();
                }
                this.provinceFlag = !this.provinceFlag;
                this.cityFlag = false;
                this.districtFlag = false;
            },
            selectProvince(item){
                if (item) {
                    this.showAddress = item.regionName;
                    this.dataBack.provinceId = item.regionId;
                    this.dataBack.provinceName = item.regionName;
                    this.showCity(item);
                    this.cityFlag = true;
                    this.districtFlag = false;
                }else{
                    this.showAddress ='请选择';
                    this.dataBack.provinceId='';
                    this.dataBack.provinceName='';
                    this.dataBack.cityId='';
                    this.dataBack.cityName='';
                    this.dataBack.districtId='';
                    this.dataBack.districtName='';
                    this.$emit('update:dataBack', this.dataBack);

                    this.provinceFlag = false;
                    this.cityFlag = false;
                    this.districtFlag = false;
                }

            },
            selectCity(item){
                if (item) {
                    this.dataBack.cityId = item.regionId;
                    this.dataBack.cityName = item.regionName;
                    this.showAddress = this.dataBack.provinceName + '-' + item.regionName;
                    this.districtFlag = true;
                    this.showDistrict(item);
                } else {
                    this.dataBack.cityId = 0;
                    this.dataBack.cityName = "未知";
                    this.showAddress = this.dataBack.provinceName + '-' + '未知';
                    this.provinceFlag = false;
                    this.cityFlag = false;
                    this.districtFlag = false;
                    this.$emit('update:dataBack', this.dataBack);
                }

            },
            selectDistrict(item){
                if (item) {
                    this.showAddress = this.showAddress + '-' + item.regionName;
                    this.dataBack.districtId = item.regionId;
                    this.dataBack.districtName = item.regionName;
                } else {
                    this.showAddress = this.showAddress + '-' + '未知';
                    this.dataBack.districtId = 0;
                    this.dataBack.districtName = "未知";
                }
                this.provinceFlag = false;
                this.cityFlag = false;
                this.districtFlag = false;
                this.$emit('update:dataBack', this.dataBack);
            }
        },
        mounted(){
            console.log(this.provinceList)
            this.init()
        }
    }
</script>
<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    .userlist-sortType {
        background: #f9f9f9;
        border: 1px solid #e1e2e7;
        border-radius: 4px;
        padding: 5px;
        font-size: 14px;
        line-height: 14px;
        height: 18px;
        width: 240px;
        display: inline-block;
        position: relative;
        vertical-align: middle;
        .userlist-sortType-item {
            border: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display: inline-block;
            color: #222;
            .custom-selector {
                width: 100%;
                height: 100%;
                display: inline-block;
                cursor: pointer;
                .custom-selector-title {
                    display: inline-block;
                    min-width: 30px;
                    width: 90%;
                    float: left;
                    font-size: 14px;
                    font-weight: normal;
                    height: 100%;
                    line-height: 18px;
                    color: #808080;
                    text-align: left;

                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;

                }
                .icon-downArrow {
                    cursor: pointer;
                    &:after {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        margin-right:0;
                    }
                }
                .custom-selector-second-box {
                    margin-left: 0;
                    box-shadow: 0 0 8px 0 rgba(153, 167, 208, 0.35);
                    border-radius: 4px;
                    background-color: #fff;
                    position: absolute;
                    z-index: 5;
                    text-align: left;
                    font-size: 0;
                    width: auto;
                    margin-top: 24px;
                    .custom-selector-second {
                        display: inline-block;
                        width: 80px;
                        font-size: 12px;
                        vertical-align: top;
                        text-align: left;
                        box-sizing: border-box;

                        max-height: 310px;
                        overflow: auto;
                        &.custom-selector-second-list {
                            right: -100%;
                        }
                        & > .custom-selector-item {
                            padding: 20px 15px;
                            width: 100%;
                            & > span {
                                display: block;
                            }
                            &.active > span {
                                color: #2899e6;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
