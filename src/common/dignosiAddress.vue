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
                <section class="custom-selector-second-box">
                    <ul class="custom-selector-second firstList" v-show="provinceFlag">
                        <li class="custom-selector-item secondListTitle" @click.stop="selectProvince()"><span>请选择</span></li>
                        <li class="custom-selector-item secondListTitle" v-for="item in provinceList" @click.stop="selectProvince(item)">
                            <span>{{item.regionName}}</span>
                        </li>
                    </ul>
                    <div class="custom-selector-second secondList custom-selector-second-list " v-show="cityFlag&&conIndex===currentIndexNow">
                        <ul v-for="(item,key) in cityList" v-show="dataBack.provinceId == key">
                            <li class="custom-selector-item result-item" @click.stop="selectCity()">
                                <span>不限</span>
                            </li>
                            <li class="custom-selector-item thirdListTitle" v-for=" children in  item" @click.stop="selectCity(children)">
                                <span>{{children.regionName}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="custom-selector-second thirdList custom-selector-third-list" v-show="districtFlag">
                        <ul v-for="(item,key) in districtList"  v-show="dataBack.cityId == key">
                            <li class="custom-selector-item result-item" @click="selectDistrict()">
                                <span>不限</span>
                            </li>
                            <li class="custom-selector-item thirdListTitle" v-for=" children in  item" @click="selectDistrict(children)">
                                <span>{{children.regionName}}</span>
                            </li>
                        </ul>
                    </div>
                </section>
            </section>
        </section>
    </nav>
</template>
<script>
    import api from '@/common/js/util/util';
    export default{
        name: 'address-selector',
        data(){
            return {
                addressSearch: "/call/comm/data/baseinfo/v1/getRegionList/",
                provinceList: [],
//                provinceFlag: false,
//                provinceFlag:{
//                    type:Boolean
//                },
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
                type: Object
            },
            provinceFlag:{
                type:Boolean
            }
        },
        methods: {
            init(){
                console.log(this.provinceFlag);
                if (this.dataListInfo.provinceName == '') {

                } else {
                    this.showAddress = this.dataListInfo.provinceName + '-' + this.dataListInfo.cityName + '-' + this.dataListInfo.districtName;
                }
                this.showProvince();
              //  this.showCity();
             //   this.showDistrict();
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
            showCity(){
                let _this = this;
                _this.cityList = {};
                let dataValue = {
//          parentId:parentId,
//          regionName:regionName,
                    isValid: 1,
                    firstResult: 0,
                    maxResult: 9999,
                    treeLevel: 3
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

                            $.each(data, function (k, v) {
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
                            });
                            console.log(_this.cityList);
                        }
                    },
                    fail(error){
                        console.log("请求失败：" + error);
                    }
                });
            },
            showDistrict(){
                let _this = this;
                let dataValue = {
                    isValid: 1,
                    firstResult: 0,
                    maxResult: 9999,
                    treeLevel: 4
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
                            $.each(data, function (k, v) {
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
                            });
                        }
                    },
                    fail(error){
                        console.log("请求失败：" + error);
                    }
                });
            },
            showData(){
                this.provinceFlag = !this.provinceFlag;
                this.$emit("update:provinceFlag", true);
                this.cityFlag = false;
                this.districtFlag = false;
            },
            selectProvince(item){
                if (item) {
                    this.showAddress = item.regionName;
                    this.dataBack.provinceId = item.regionId;
                    this.dataBack.provinceName = item.regionName;
                    this.provinceFlag =false;
                    this.$emit("update:provinceFlag", this.provinceFlag);
                    this.cityFlag = false;
                    this.districtFlag = false;
                    this.$emit('update:dataBack', this.dataBack);
                }else{
                    this.provinceFlag =false;
//                    this.$emit("update:provinceFlag", this.provinceFlag);
                    this.cityFlag = false;
                    this.districtFlag = false;
                    this.dataBack.provinceId='';
                    this.dataBack.provinceName ='';
                    this.dataBack.cityId ='';
                    this.dataBack.cityName ='';
                    this.dataBack.districtId ='';
                    this.dataBack.districtName ='';
                    this.showAddress = '请选择';
                    this.$emit('update:dataBack', this.dataBack);
                    }
            },
            selectCity(item){
                if (item) {
                    this.dataBack.cityId = item.regionId;
                    this.dataBack.cityName = item.regionName;
                   // this.showAddress = this.dataBack.provinceName + '-' + item.regionName;
                    this.showAddress = item.regionName;
                    this.districtFlag = true;
                } else {
                    this.showAddress = this.dataBack.provinceName + '-' + '未知';
                    this.provinceFlag = false;
//                    this.$emit("update:provinceFlag", this.provinceFlag);
                    this.cityFlag = false;
                    this.districtFlag = false;
                    this.$emit('update:dataBack', this.dataBack);
                }

            },
            selectDistrict(item){
                if (item) {
                    //this.showAddress = this.showAddress + '-' + item.regionName;
                    this.showAddress = item.regionName;
                    this.dataBack.districtId = item.regionId;
                    this.dataBack.districtName = item.regionName;
                } else {
                    this.showAddress = this.showAddress + '-' + '未知';
                }
                this.provinceFlag = false;
//                this.$emit("update:provinceFlag", this.provinceFlag);
                this.cityFlag = false;
                this.districtFlag = false;
                this.$emit('update:dataBack', this.dataBack);
            }
        }, mounted(){
            this.init()
        }
    }
</script>
<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    .userlist-sortType {
        background: #fff;
        border: 1px solid #e1e2e7;
        border-radius: 4px;
        padding: 5px 10px;
        font-size: 14px;
        line-height: 14px;
        height: 18px;
        width: 230px;
        display: inline-block;
        position: relative;
        vertical-align: top;
        &-item {
            display: block;
            color: #222;
            border-right: 1px solid #e4e4e4;
            padding: 0;
            width: 100%;
            height: 100%;
            &:nth-last-child(1) {
                border-right: none;
            }
            .custom-selector {
                width: 100%;
                height: 100%;
                display: inline-block;
                cursor: pointer;
                .custom-selector-title {
                    width: 100%;
                    height: 100%;
                    line-height: 28px;
                    text-align: left;
                    font-weight: normal;
                    font-size: 14px;
                    color: #808080;
                    display: block;
                    min-width: 30px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .icon-downArrow {
                    cursor: pointer;
                }
                .icon-downArrow:after {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                }
                .custom-selector-second {
                    display: inline-block;
                    width: 156px;
                    font-size: 12px;
                    vertical-align: top;
                    text-align: left;
                    box-sizing: border-box;
                    max-height: 310px;
                    overflow: auto;
                    box-shadow: 0 0 8px 0 rgba(153, 167, 208, 0.35);
                    border-radius: 4px;
                    background-color: #fff;
                    white-space: nowrap;
                    &-box {
                        /*box-shadow: 0 0 8px 0 rgba(153, 167, 208, 0.35);*/
                        border-radius: 4px;
                        background-color: #fff;
                        position: absolute;
                        z-index: 5;
                        text-align: left;
                        font-size: 0;
                        width: auto;
                        left: 0;
                        top: 36px;
                    }
                    &-list {
                        margin-right: -120px;
                        margin-left: 4px;
                        margin-top: 10px;
                    }
                    & > .custom-selector-item {
                        height:34px;
                        line-height: 34px;
                        width: 100%;
                        list-style: none;
                        font-size: 14px;
                        color: #222222;
                        letter-spacing: 0;
                        &:hover{
                            background: #F6F9FA;
                        }
                        & > span {
                            display: block;
                            padding:0 18px;
                            box-sizing: border-box;
                        }
                        &.active > span {
                            color: #2899e6;
                        }
                    }
                }
                .custom-selector-third-list{
                    margin-right: -240px;
                    margin-left: 124px;
                    margin-top: 20px;
                }
            }
        }
    }
</style>
