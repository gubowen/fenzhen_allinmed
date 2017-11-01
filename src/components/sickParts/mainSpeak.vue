<template>
    <div id="mainSpeak">
        <section class="viewItem medical-record-form-item">
            <form action="">
                <section class="main-speak medical-record-main">
                    <article class="J-consult">
                        <ul>
                            <li class="operation-name" v-show="caseMain != ''"><span class="sick-title">主要症状</span><span class="sick-text">{{caseMain}}</span></li>
                            <li class="operation-expectation-time" v-show="painNature != ''"><span class="sick-title">疼痛性质</span><span class="sick-text">{{painNature}}</span></li>
                            <li class="operation-expectation-time" v-show="VASLevelL != ''"><span class="sick-title">VAS评分</span><span class="sick-text">{{VASLevelL}}</span></li>
                            <li class="operation-expectation-time" v-show="caseAlong != ''"><span class="sick-title">其他症状</span><span class="sick-text">{{caseAlong}}</span></li>

                        </ul>
                    </article>
                </section>
            </form>
        </section>
    </div>
</template>
<script>
    import axios from 'axios'
    import api from '../../common/js/util';
    export default{
        name: 'mainSpeak',
        data(){
            return {
                MedicalReport: '/call/customer/patient/case/v1/getMapById/', //问诊单接口-（提供主诉数据）
                name: "",
                sex: '',
                logo: '',
                type: '',
                age: '',
                category: '',
                caseId: this.$store.state.caseId,
                caseMain: '',       //主要症状
                caseAlong: '',      //其他症状
                painNature: '',      //疼痛性质
                VASLevelL: '',      //VAS评分
                expectedTime: '',
                expectedAddress: '',
                userMessage: {}
            }
        },
        mounted(){
            this.userMessage = this.$route.params.num;
            this.init();
        },
        activated(){
            this.userMessage = this.$route.params.num;
            this.init();
        },

        watch: {
            '$store.state.currentItem'(){
                this.init();
            }

        },
        methods: {
            init: function () {
                let _this = this;
                this.userMessage = this.$store.state.currentItem;
                let dataValue = {
                    caseId: this.userMessage.caseId,
                    isOrder: 0,
                    attUseFlag: 6
                };

                api.ajax({
                    url: _this.MedicalReport,
                    method: "POST",
                    data: dataValue,
                    beforeSend(config) {
                    },
                    done(res) {
                        console.log(res);
                        let dataList = res.responseObject.responseData.dataList[0];

                        if (dataList.patientCasemap.caseMain.caseMain != '') {
                            _this.caseMain = dataList.patientCasemap.caseMain.caseMain;
                        }
                        if (dataList.resultMainList.length > 0) {
                            dataList.resultMainList[0].symptomOptions.forEach(function (value, index) {
                                if (value.refQuestionList && value.refQuestionList.length > 0) {
                                    if (value.refQuestionList[0]) {
                                        if (value.refQuestionList[0].symptomOptions && value.refQuestionList[0].symptomOptions.length > 0) {
                                            if (value.refQuestionList[0].symptomOptions[0].optionName && value.refQuestionList[0].symptomOptions[0].optionName.length > 0) {
                                                _this.painNature = value.refQuestionList[0].symptomOptions[0].optionName;
                                            }
                                        }
                                    }
                                    if (value.refQuestionList[1]) {
                                        if (value.refQuestionList[1].symptomOptions && value.refQuestionList[1].symptomOptions.length > 0) {
                                            if (value.refQuestionList[1].symptomOptions[0].optionName && value.refQuestionList[1].symptomOptions[0].optionName.length > 0) {
                                                var optionNameStr = value.refQuestionList[1].symptomOptions[0].optionName;
                                                optionNameStr = optionNameStr.substring(optionNameStr.length - 1) == '：' ? optionNameStr.substring(0, optionNameStr.length - 1) : optionNameStr;
                                                _this.VASLevelL = optionNameStr;
                                            }
                                        }
                                    }
                                }
                            });
                        }
                        if (dataList.patientCasemap.caseMain.caseAlong != '') {
                            _this.caseAlong = dataList.patientCasemap.caseMain.caseAlong;
                        }
                    },
                    fail(error){
                        console.log("请求失败：" + error);
                    }
                });
            }
        }
    }
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
    @import "../../scss/library/_common-modules";
    @import "../../scss/record_common";

    .main-speak {
        ul {
            margin-top: 100px;
            li {
                margin-top: 24px;
                &.operation-name {
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
                .sick-text {
                    font-size: 14px;
                    color: #808080;
                    letter-spacing: 0;
                    line-height: 1.5;
                    width: 230px;
                    display: inline-block;
                    vertical-align: middle;
                }
            }
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
            background: url("../../assets/img00/employee/dot.png") no-repeat;
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
    }
</style>
