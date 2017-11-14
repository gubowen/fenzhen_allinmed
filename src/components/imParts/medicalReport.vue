<template>
    <article class="messageList-item-content">
        <!--问诊单-->
        <figure class="messageList-item-img">
            <img :src="$store.state.currentItem.logoUrl" alt="">
        </figure>
        <figcaption class="messageList-item-text special-message">
            <section class="special-message-box medical-report" data-role="medical-report">
                <header class="special-message-title">
                    <h2>{{medicalReportMsg.patientCasemap && medicalReportMsg.patientCasemap.patientName}}问诊信息</h2>
                </header>
                <section class="special-message-content ">
                    <article class="special-message-item inline-message">
                        <header class="special-message-item-title">
                            <span>基本信息</span>
                        </header>
                        <article class="special-message-item-text medical-report-name">
                            <h4>{{medicalReportMsg.patientCasemap && medicalReportMsg.patientCasemap.patientName}}</h4>
                            <i class="J-sex icon-sex-male"
                               v-if="medicalReportMsg.patientCasemap&&medicalReportMsg.patientCasemap.sexId == 1">男</i>
                            <i class="J-sex icon-sex-female"
                               v-if="medicalReportMsg.patientCasemap&&medicalReportMsg.patientCasemap.sexId == 2">女</i>
                            <span>{{medicalReportMsg.patientCasemap && medicalReportMsg.patientCasemap.age}}岁</span>
                        </article>
                        <article class="special-message-item-text">
                            <article class="special-message-item-list">
                                <span class="answer"><p
                                        class="question">问诊目的：</p>{{medicalReportMsg.patientCasemap && getMRTitle(medicalReportMsg.patientCasemap.caseType)}}</span>
                            </article>
                            <article class="special-message-item-list">
                                <span class="answer"><p class="question">所在地区：</p>{{medicalReportMsg.patientCasemap && medicalReportMsg.patientCasemap.provinceName}}&nbsp;&nbsp;{{medicalReportMsg.patientCasemap && medicalReportMsg.patientCasemap.cityName}}</span>
                            </article>
                        </article>
                        <article class="special-message-item-text">
                            <article class="special-message-item-list">
                                <p class="answer"><span class="question">患者是问诊人的：</span>{{medicalReportMsg.patientCasemap?getPatientrelation(medicalReportMsg.patientCasemap.patientRelationId):''}}</p>
                            </article>
                        </article>
                    </article>
                    <article class="special-message-item"
                             v-if="medicalReportMsg.patientCasemap&&(medicalReportMsg.patientCasemap.caseMain.caseMain.length > 0 || medicalReportMsg.patientCasemap.caseMain.caseMain.length>0)">
                        <header class="special-message-item-title">
                            <span>主诉</span>
                        </header>
                        <article class="special-message-item-text">
                            <figcaption class="special-message-item-list"
                                        v-if="medicalReportMsg.patientCasemap.caseMain.caseMain.length > 0">
                                <p class="question">主要症状：</p>
                                <span class="answer"
                                      style="display:inline-block;max-width:80%;vertical-align:top">{{medicalReportMsg.patientCasemap.caseMain.caseMain}}</span>
                            </figcaption>
                            <figcaption class="special-message-item-list"
                                        v-if="getPainMessage(medicalReportMsg.resultMainList[0].symptomOptions).typeShow">
                                <p class="question">疼痛性质：</p>
                                <span class="answer"
                                      style="display:inline-block;max-width:80%;vertical-align:top">{{getPainMessage(medicalReportMsg.resultMainList[0].symptomOptions).type}}</span>
                            </figcaption>
                            <figcaption class="special-message-item-list"
                                        v-if="getPainMessage(medicalReportMsg.resultMainList[0].symptomOptions).VASShow">
                                <p class="question">VAS评分：</p>
                                <span class="answer" style="display:inline-block;max-width:80%;vertical-align:top">{{getPainMessage(medicalReportMsg.resultMainList[0].symptomOptions).VAS}}</span>
                            </figcaption>
                            <figcaption class="special-message-item-list" v-if="medicalReportMsg.patientCasemap.caseMain.caseAlong.length > 0">
                                <p class="question">其他症状：</p>
                                <span class="answer" style="display:inline-block;max-width:80%;vertical-align:top">{{medicalReportMsg.patientCasemap.caseMain.caseAlong}}</span>
                            </figcaption>
                        </article>
                    </article>
                    <article class="special-message-item">
                        <header class="special-message-item-title">
                            <span>现病史</span>
                        </header>
                        <article class="special-message-item-list"
                                 v-if="medicalReportMsg.patientCasemap&&(medicalReportMsg.patientCasemap.treatmentName.length > 0 || medicalReportMsg.patientCasemap.treatmentName.length > 0)">
                            <span class="answer"><p
                                    class="question">曾就诊情况：</p>{{medicalReportMsg.patientCasemap.treatmentName}}&nbsp;&nbsp;&nbsp;{{medicalReportMsg.patientCasemap.illnessName}}</span>
                        </article>
                        <article class="special-message-item-list"
                                 v-if="medicalReportMsg.patientCasemap&&medicalReportMsg.patientCasemap.takeMedicine.length > 0">
                            <span class="answer"><p
                                    class="question">服用药物：</p>{{medicalReportMsg.patientCasemap.takeMedicine}}</span>
                        </article>
                        <figcaption class="special-message-item-list img-box"
                                    v-if="medicalReportMsg.patientCasemap&&medicalReportMsg.patientCasemap.attachmentList.length > 0">
                            <figure class="special-message-item-img "
                                    v-for="(imgs,index) in medicalReportMsg.patientCasemap.attachmentList">
                                <img :src="imgs.caseAttUrl" @click="showBigImgFunction(index)">
                            </figure>
                        </figcaption>
                    </article>
                    <article class="special-message-item inline-message"
                             v-if="medicalReportMsg.patientCasemap&&medicalReportMsg.patientCasemap.remark.length > 0">
                        <header class="special-message-item-title"><span>备注</span></header>
                        <article class="special-message-item-list"><span
                                class="answer">{{medicalReportMsg.patientCasemap && (medicalReportMsg.patientCasemap.remark.length > 0 ? medicalReportMsg.patientCasemap.remark : '未填写')}}</span>
                        </article>
                    </article>
                </section>
            </section>
        </figcaption>
    </article>
</template>
<script type="text/ecmascript-6">
    /**
     * @Desc：
     * @Usage:
     * @Notify：
     * @Depend：
     *
     * Created by Qiangkailiang on 17/10/23.
     */
    import ajax from "@/common/js/ajax";

    const XHRList = {
        getMapList: "/call/customer/patient/case/v1/getMapById/"
    }
    export default{
        data(){
            return {
                medicalReportMsg: {},
                showBigImageList: []
            }
        },
        mounted(){
            this.getMedicalReport();
        },
        methods: {
            getMedicalReport(){
                const that = this;
                ajax({
                    url: XHRList.getMapList,
                    method: "POST",
                    data: {
                        caseId: this.$store.state.currentItem.caseId,
                        isOrder: 0,
                        attUseFlag: 6
                    },
                    done(res){
                        if (res.responseObject.responseData) {
                            let dataList = res.responseObject.responseData.dataList;
                            if (dataList && dataList.length) {
                                that.medicalReportMsg = dataList[0];
                                console.log(that.medicalReportMsg);
                                // console.log(that.medicalReportMsg = dataList[0]);
                            }
                        }
                    }
                })
            },
            getPatientrelation(type){
                let result = "";
                switch(parseInt(type)){
                    case 0:
                        result = "本人";
                        break;
                    case 1:
                        result = "配偶";
                        break;
                    case 2:
                        result = "子女(有证件)";
                        break;
                    case 3:
                        result = "父亲";
                        break;
                    case 4:
                        result = "母亲";
                        break;
                    case 5:
                        result = "爷爷";
                        break;
                    case 6:
                        result = "奶奶";
                        break;
                    case 7:
                        result = "亲戚";
                        break;
                    case 8:
                        result = "朋友";
                        break;
                    case 9:
                        result = "邻居";
                        break;
                    case 10:
                        result = "其他";
                        break;
                    case 11:
                        result = "子女(无证件)";
                        break;
                };
                return result;
            },
            getPainMessage(item){
                    let painItem;
                    if (item){
                        item.forEach((element,index)=>{
                            if (element.optionName==="疼痛"){
                                painItem=element;
                                return false;
                            }
                        })
                    }

                    console.log(!Object.is(painItem,{}))
                    if (painItem){
                        return {
                            VASShow:true,
                            VAS:painItem.refQuestionList[1].symptomOptions[0].optionName.substring(0,2),
                            typeShow:true,
                            type:painItem.refQuestionList[0].symptomOptions[0].optionName
                        }
                    }else{
                        return {
                            VASShow:false,
                            typeShow:false,
                        };
                    }
//                    medicalReportMsg.resultMainList[0].symptomOptions[0].refQuestionList[0]&&medicalReportMsg.resultMainList[0].symptomOptions[0].refQuestionList[1].questionName

                },
            getMRTitle(type){
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
                }
                return result;
            },
            //查看大图
            showBigImgFunction(index){
                let _this = this;
                _this.showBigImageList = [];

                _this.medicalReportMsg.patientCasemap.attachmentList.forEach(function (item, index) {
                    _this.showBigImageList.push({"url": item.caseAttUrl});
                });

                let allList ={};
                allList = _this.$store.state.SBIObject;
                allList['medicalReport'] = _this.showBigImageList;


                _this.$store.commit("setSBIObject",allList);
                _this.$store.commit("setSBIType", 'medicalReport');

                _this.$store.commit("setSBIIndex",index);

                _this.$store.commit("setSBIFlag", true);
            }

        },
        props: {
            message: {
                type: Object
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
