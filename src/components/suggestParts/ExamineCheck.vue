<template>
    <section class="main-masker examine-check on">
        <section class="check-suggestion-box" v-show="nextFlag">
            <i class="icon-close window-close" @click="close()"></i>
            <header class="check-suggestion-title">
                <article>
                    <h2>检查检验建议</h2>
                    <p>可通过下列标签选择建议类型</p>
                </article>
                <button class="jump-box-add-term" :class="{'icon-suggestion-preview':isLight,'icon-suggestion-preview-gray forbid':!isLight}" @click="isLight&&foresee()">
                    <span>预览</span></button>
            </header>
            <section class="check-suggestion-inner">
                <nav class="config-suggestion-tabsBox">
                    <section class="config-suggestion-tabs ec-tabs tabsInner">
                        <figure class="config-suggestion-tabs-item tabsItem " :class="{active:tabActive}"
                                @click="tabActive = true;FirstIndex = -1 ;secondIndex = -1 ;ThirdIndex =-1 ;FourIndex = -1" data-role="ac-tabs-1">检查建议
                        </figure>
                        <figure class="config-suggestion-tabs-item tabsItem" :class="{active:!tabActive}"
                                @click="tabActive = false;FirstIndex = -1 ;secondIndex = -1 ;ThirdIndex =-1 ;FourIndex = -1" data-role="ac-tabs-2">检验建议
                        </figure>
                    </section>
                </nav>
                <section class="config-suggestion-viewers ec-views viewInner">
                    <section class="check-suggestion-item viewItem" data-role="ac-tabs-1" v-show="tabActive">
                        <section class="check-project">
                            <section>
                                <ul>
                                    <li v-for="(examines,index) in examineSuggest" @click="showNext('FirstIndex',index)">
                                        <article data-nodeid="" class="check-project-item" :class="{'icon-downArrow-big':examines.children.length>0}">
                                            <span>{{examines.nodeName}}</span>
                                        </article>
                                        <section class="check-project-content" v-show="examines.children.length>0" :class="{on:FirstIndex == index}">
                                            <ul>
                                                <li v-for="(SecondChildren,secondIndex)  in examines.children" @click.stop="showNext('SecondIndex',secondIndex)">
                                                    <article class="check-project-item" :class="{'icon-downArrow-big':SecondChildren.children.length>0}">
                                                        <span>{{SecondChildren.nodeName}}</span>
                                                    </article>
                                                    <section class="check-project-content" v-show="SecondChildren.children.length>0" :class="{on: SecondIndex == secondIndex}">
                                                        <ul>
                                                            <li v-for="(ThirdChildren,thirdIndex)  in SecondChildren.children">
                                                                <article class="check-project-item isHasOption" :class="{' icon-downArrow':ThirdChildren.children.length>0}">
                                                                    <figure class="setting-form-item-input setting-form-item-sex-selector">
                                                                        <figcaption class="setting-form-item-sex icon-select-normal">
                                                                            <i class="icon-choice" :class="{'active':ThirdChildren.isActive}"
                                                                               @click.stop="selectData(ThirdChildren,thirdIndex)"></i><span
                                                                                @click.stop="showNext('ThirdIndex',thirdIndex)">{{ThirdChildren.nodeName}}</span>
                                                                        </figcaption>
                                                                    </figure>
                                                                </article>
                                                                <section class="check-project-content" v-show="ThirdChildren.children.length>0"
                                                                         :class="{on: ThirdIndex == thirdIndex}">
                                                                    <ul>
                                                                        <li v-for="(FourChildren,FourIndex)  in ThirdChildren.children" @click.stop="showNext('FourIndex',index)">
                                                                            <article class="check-project-item isHasOption">
                                                                                <figure class="setting-form-item-input setting-form-item-sex-selector">
                                                                                    <figcaption class="setting-form-item-sex icon-select-normal"
                                                                                                :class="{'disable':!FourChildren.isSelected}">
                                                                                        <i class="icon-choice" :class="{'active':FourChildren.isActive}"
                                                                                           @click.stop="FourChildren.isSelected && selectData(FourChildren,FourIndex)"></i><span>{{FourChildren.nodeName}}</span>
                                                                                    </figcaption>
                                                                                </figure>
                                                                            </article>
                                                                        </li>
                                                                    </ul>
                                                                </section>
                                                            </li>
                                                        </ul>
                                                    </section>
                                                </li>
                                            </ul>
                                        </section>
                                    </li>
                                </ul>
                            </section>
                        </section>
                    </section>

                    <section class="check-suggestion-item viewItem" data-role="ac-tabs-2" v-show="!tabActive">
                        <section class="check-project">
                            <section>
                                <ul>
                                    <li v-for="(examines,index) in testSuggest" @click="showNext('FirstIndex',index)">
                                        <article data-nodeid="" class="check-project-item" :class="{'icon-downArrow-big':examines.children.length>0}">
                                            <span>{{examines.inspectionName}}</span>
                                        </article>
                                        <section class="check-project-content" v-show="examines.children.length>0" :class="{on:FirstIndex == index}">
                                            <ul>
                                                <li v-for="(SecondChildren,secondIndex)  in examines.children" @click.stop="showNext('SecondIndex',secondIndex)">
                                                    <article class="check-project-item" :class="{'icon-downArrow-big':SecondChildren.children.length>0}">
                                                        <span>{{SecondChildren.inspectionName}}</span>
                                                    </article>
                                                    <section class="check-project-content" v-show="SecondChildren.children.length>0" :class="{on: SecondIndex == secondIndex}">
                                                        <ul>
                                                            <li v-for="(ThirdChildren,thirdIndex)  in SecondChildren.children" @click.stop="showNext('ThirdIndex',thirdIndex)">
                                                                <article class="check-project-item isHasOption" :class="{'icon-downArrow':ThirdChildren.children.length>0}">
                                                                    <figure class="setting-form-item-input setting-form-item-sex-selector">
                                                                        <figcaption class="setting-form-item-sex icon-select-normal">
                                                                            <i class="icon-choice" :class="{'active':ThirdChildren.isActive}"
                                                                               @click.stop="selectData(ThirdChildren,thirdIndex)"></i><span
                                                                                @click.stop="showNext('ThirdIndex',thirdIndex)">{{ThirdChildren.inspectionName}}</span>
                                                                        </figcaption>
                                                                    </figure>
                                                                </article>
                                                                <section class="check-project-content" v-show="ThirdChildren.children.length>0"
                                                                         :class="{on: ThirdIndex == thirdIndex}">
                                                                    <ul>
                                                                        <li v-for="FourChildren  in ThirdChildren.children" @click.stop="showNext('FourIndex',index)">
                                                                            <article class="check-project-item isHasOption icon-downArrow">
                                                                                <figure class="setting-form-item-input setting-form-item-sex-selector">
                                                                                    <figcaption class="setting-form-item-sex icon-select-normal"
                                                                                                :class="{'disable':!FourChildren.isSelected}">
                                                                                        <i class="icon-choice" :class="{'active':FourChildren.isActive}"
                                                                                           @click.stop="FourChildren.isSelected && selectData(FourChildren,FourIndex)"></i><span>{{FourChildren.inspectionName}}</span>
                                                                                    </figcaption>
                                                                                </figure>
                                                                            </article>
                                                                        </li>
                                                                    </ul>
                                                                </section>
                                                            </li>
                                                        </ul>
                                                    </section>
                                                </li>
                                            </ul>
                                        </section>
                                    </li>
                                </ul>
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        </section>
        <section class="check-suggestion-inner examineTestPreview" v-show="!nextFlag" style="height:auto;">
            <header class="check-suggestion-title">
                <article>
                    <h2>检查检验建议</h2>
                </article>
            </header>
            <section style="height:520px;overflow:auto">
                <section class="check-result-content">
                    <section class="check-result-info">
                        <ul>
                            <li v-for="item in showExamineList">
                                {{item.nodeName}}
                            </li>
                            <li v-for="item in testSuggestList">
                                {{item.inspectionName}}
                            </li>
                        </ul>
                    </section>
                </section>
                <section class="btn-group clear">
                    <button type="button" class="btn-primary-small fr" @click="sendMessage()">发送</button>
                    <button type="button" class="btn-border-small btn-cancel fr r20" @click="update()">修改</button>
                </section>
            </section>
        </section>
    </section>
</template>
<script>
    import api from '../../common/js/util';
    import store from "../../store/store";
    import releasePatient from "@/base/releasePatient";   //改变患者状态
    export default{
        name: 'examine-check',
        data(){
            return {
                FirstIndex: -1,
                SecondIndex: -1,
                ThirdIndex: -1,
                FourIndex: -1,
                examineSuggest: [],
                testSuggest: [],
                isLight: false,
                tabActive: true,
                nextFlag: true,
                showExamineList: [],
                testSuggestList: [],
                saveExamineUrl: "/call/patient/recovery/advice/v1/create/",//保存检查检验
                recoveryAdviceList: [],
                updateCount: "/call/customer/case/consultation/v1/updateFrequency/", //关闭24小时定时
                changeStatus: "/call/customer/patient/case/v1/update/" //改变为待检查状态

            }
        },
        methods: {
            init(){
                this.examine();
            },
            examine: function () {
                this.nextFlag = true;
                this.examineGetData("/call/comm/data/check/v1/getMapList/", "examineSuggest", 1);
                this.examineGetData("/call/comm/data/inspection/v1/getMapList/", "testSuggest", 2);
            },
            examineGetData: function (url, target, type) {
                store.commit("startLoading");
                let _this = this;
                let dataValue = {
                    isValid: 1,
                    firstResult: 0,
                    maxResult: 999
                };

                api.ajax({
                    url: url,
                    method: "POST",
                    data: dataValue,
                    done(res) {
                        res.responseObject.responseData.dataList.forEach(function (key, value) {
                            key.isActive = false;
                            if (key.children && key.children.length > 0) {
                                key.children.forEach(function (element) {
                                    element.isActive = false;
                                    if (element.children && element.children.length > 0) {
                                        element.children.forEach(function (elem) {
                                            elem.isActive = false;
                                            elem.isSelected = true;
                                            if (elem.children && elem.children.length > 0) {
                                                elem.children.forEach(function (el) {
                                                    el.isActive = false;
                                                    el.isSelected = true;
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        });
                        if (target == "examineSuggest") {
                            _this.examineSuggest = res.responseObject.responseData.dataList;
                        } else {
                            _this.testSuggest = res.responseObject.responseData.dataList;
                        }
                        store.commit("stopLoading");
                    },
                    fail(error){
                    }
                })
            },
            showNext(type, index){
                if (type == 'FirstIndex') {
                    if (this.FirstIndex == index) {
                        this.FirstIndex = -1;
                        this.SecondIndex = -1;
                        this.ThirdIndex = -1;
                        this.FourIndex = -1
                    } else {
                        this.FirstIndex = index;
                        this.SecondIndex = -1;
                        this.ThirdIndex = -1;
                        this.FourIndex = -1
                    }
                } else if (type == 'SecondIndex') {
                    if (this.SecondIndex == index) {
                        this.SecondIndex = -1;
                        this.ThirdIndex = -1;
                        this.FourIndex = -1
                    } else {
                        this.SecondIndex = index;
                        this.ThirdIndex = -1;
                        this.FourIndex = -1
                    }
                } else if (type == 'ThirdIndex') {
                    if (this.ThirdIndex == index) {
                        this.ThirdIndex = -1;
                        this.FourIndex = -1
                    } else {
                        this.ThirdIndex = index;
                        this.FourIndex = -1
                    }
                } else if (type == 'FourIndex') {
                    if (this.FourIndex == index) {
                        this.FourIndex = -1
                    } else {
                        this.FourIndex = index;
                    }
                }
            },
            selectData(item, index){
                item.isActive = !item.isActive;
                if (item.children && item.children.length > 0) {
                    item.children.forEach(function (itemII, indexII) {
                        itemII.isSelected = !itemII.isSelected;
                        itemII.isActive = false;
                    });
                }
                ;
                this.isToLight();
            },
            foresee(){
                this.nextFlag = !this.nextFlag;
                let _this = this;
                _this.examineSuggest.forEach(function (key) {
                    if (key.children && key.children.length > 0) {
                        key.children.forEach(function (element) {
                            if (element.children && element.children.length > 0) {
                                element.children.forEach(function (elem) {
                                    if (elem.isActive) {
                                        _this.showExamineList.push(elem);
                                    }
                                    if (elem.children && elem.children.length > 0) {
                                        elem.children.forEach(function (el) {
                                            if (el.isActive) {
                                                _this.showExamineList.push(el);
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                });

                _this.testSuggest.forEach(function (key) {
                    if (key.children && key.children.length > 0) {
                        key.children.forEach(function (element) {
                            if (element.children && element.children.length > 0) {
                                element.children.forEach(function (elem) {
                                    if (elem.isActive) {
                                        _this.testSuggestList.push(elem);
                                    }
                                    if (elem.children && elem.children.length > 0) {
                                        elem.children.forEach(function (el) {
                                            if (el.isActive) {
                                                _this.testSuggestList.push(el);
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                });

            },
            update(){
                this.nextFlag = !this.nextFlag;
                this.showExamineList = [];
            },
            sendMessage(){
                this.saveData()
            },
            saveData(){
                let _this = this;


                _this.showExamineList.forEach(function (item, index) {
                    _this.recoveryAdviceList.push({
                        adviceType: 1,
                        adviceId: item.nodeId,
                        adviceName: item.nodeName
                    })
                });

                _this.testSuggestList.forEach(function (item, index) {
                    _this.recoveryAdviceList.push({
                        adviceType: 2,
                        adviceId: item.inspectionId,
                        adviceName: item.inspectionName
                    })
                });

                let dataValue = {
                    caseId: _this.$store.state.caseId,
                    patientId: _this.$store.state.patientId,
                    customerId: _this.$store.state.userId,
                    recoveryAdviceList: JSON.stringify(_this.recoveryAdviceList),
                    type: 0
                };
                api.ajax({
                    url: _this.saveExamineUrl,
                    method: "POST",
                    data: dataValue,
                    beforeSend(config) {
                    },
                    done(res) {

                        api.ajax({
                            url: _this.updateCount,
                            method: "POST",
                            data: {
                                consultationId: _this.$store.state.consultationId,
                                frequency: "-1",
                                frequencyType: "4"
                            },
                            beforeSend(config) {
                            },
                            done(res) {
                                console.log("关闭24小时定时");
                            },
                            fail(res){

                            }
                        });

                        api.ajax({
                            url: _this.changeStatus,
                            method: "POST",
                            data: {
                                caseId: _this.$store.state.caseId,
                                state: 3
                            },
                            beforeSend(config) {
                            },
                            done(res) {
                                console.log("更改待检查成功");
                                let inquiryResult = _this.$store.state.currentItem;
                                inquiryResult.diagnosisContent = "待检查";
                                store.commit('setCurrentItem', inquiryResult);


                                store.commit("checkSuggestionSender", {
                                    flag: true,
                                    data: _this.recoveryAdviceList
                                })

                                _this.$store.state.patientList.forEach(function (item) {
                                    if (item.caseId == _this.$store.state.caseId) {
                                        item.state = '3'
                                    }
                                });
                                _this.nextFlag = !_this.nextFlag;
                                _this.$emit('update:examineCheckFlag', false);
                                _this.$store.commit('setExamineFlag', false);


                            },
                            fail(res){

                            }
                        });

                        releasePatient({
                            customerId: _this.$store.state.userId,
                            consultationId: _this.$store.state.currentItem.consultationId,
                            consultationState:9
                        }).then(res => {
                            let currentItem = _this.$store.state.currentItem;
                                currentItem.consultationState = 9;
                            that.$store.commit('setCurrentItem',currentItem);
                        })

                    },
                    fail(err){
                    }
                })
            },
            close(){
                this.$store.commit('setExamineFlag', false);
            },
            isToLight(){
                let flag = false;
                this.examineSuggest.forEach(function (key) {
                    if (key.children && key.children.length > 0) {
                        key.children.forEach(function (element) {
                            if (element.children && element.children.length > 0) {
                                element.children.forEach(function (elem) {
                                    if (elem.isActive) {
                                        flag = true;
                                        return false;
                                    }
                                    if (elem.children && elem.children.length > 0) {
                                        elem.children.forEach(function (el) {
                                            if (el.isActive) {
                                                flag = true;
                                                return false;
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
                this.testSuggest.forEach(function (key) {
                    if (key.children && key.children.length > 0) {
                        key.children.forEach(function (element) {
                            if (element.children && element.children.length > 0) {
                                element.children.forEach(function (elem) {
                                    if (elem.isActive) {
                                        flag = true;
                                        return false;
                                    }
                                    if (elem.children && elem.children.length > 0) {
                                        elem.children.forEach(function (el) {
                                            if (el.isActive) {
                                                flag = true;
                                                return false;
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
                this.isLight = flag;
            }
        },
        watch: {},
        mounted(){
            this.init();
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../scss/base";
    @import "../../scss/modules/_checkSuggestion";
    @import "../../scss/modules/_configSuggestion";

    .jump-box-add-term {
        padding: 7px 15px;
        background-color: #fff;
        border-radius: 4px;
        position: absolute;
        top: 50%;
        right: 40px;
        cursor: pointer;
        transform: translateY(-50%);
        &.icon-suggestion-preview:before {
            content: '';
            display: inline-block;
            vertical-align: middle;
            background: url("../../assets/img00/check/suggestion_view.png") no-repeat;
            background-size: 100% 100%;
            width: 14px;
            height: 14px;
            margin-right: 7px;
        }
        &.icon-suggestion-preview-gray:before {
            content: '';
            display: inline-block;
            vertical-align: middle;
            background: url("../../assets/img00/check/preview_off.png") no-repeat;
            background-size: 100% 100%;
            width: 14px;
            height: 14px;
            margin-right: 7px;
        }
        &.forbid {
            background: #ECEFF6;
            color: #CCC;
        }
    }
</style>
