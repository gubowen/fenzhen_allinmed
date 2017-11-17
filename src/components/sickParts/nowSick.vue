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
                            <li><span class="main-title">产生诱因</span><input class="main-sick-input J-produceReason" type="text" placeholder="请填写" maxlength="50"
                                                                           v-model="produceReason"/>
                            </li>
                            <li>
                                <span class="main-title">症状</span><select class="select-100 J-produceSymptomsId" v-model="produceSymptomsId">
                                <option v-for="item in  produceSymptomsList" :value="item.produceSymptomsId">{{item.produceSymptomsName}}</option>
                            </select>
                            </li>
                            <li>
                                <span class="main-title">程度</span><select class="select-100 J-produceLevelId" v-model="produceLevelId">
                                <option v-for="item in produceLevelList" :value="item.produceLevelId">{{item.produceLevelName}}</option>
                            </select>
                            </li>
                            <li><span class="main-title">何时加重</span><select class="J-produceSharpenId" v-model="produceSharpenId">
                                <option v-for="item in produceSharpenList" :value="item.produceSharpenId">{{item.produceSharpenName}}</option>

                            </select><span class="main-title ml20">何时缓解</span><select class="J-produceRemitId" v-model="produceRemitId">
                                <option v-for="item in produceRemitList" :value="item.produceRemitId">{{item.produceRemitName}}</option>
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
                            <li><span class="main-title">加重诱因</span><input class="main-sick-input J-aggravateReason" type="text" placeholder="请填写" maxlength="50"
                                                                           v-model="aggravateReason"/></li>
                            <li><span class="main-title">症状</span><select class="J-aggravateSymptomsId" v-model="aggravateSymptomsId">
                                <option v-for="item in aggravateSymptomsList" :value="item.aggravateSymptomsId">{{item.aggravateSymptomsName}}</option>
                            </select><span class="main-title ml20">程度</span><select class="J-aggravateLevelId" v-model="aggravateLevelId">
                                <option v-for="item in aggravateLevelList" :value="item.aggravateLevelId">{{item.aggravateLevelName}}</option>
                            </select></li>
                            <li><span class="main-title">何时加重</span><select class="J-aggravateSharpenId" v-model="aggravateSharpenId">
                                <option v-for="item in aggravateSharpenList" :value="item.aggravateSharpenId">{{item.aggravateSharpenName}}</option>
                            </select><span class="main-title ml20">何时缓解</span><select class="J-aggravateRemitId" v-model="aggravateRemitId">
                                <option v-for="item in aggravateRemitList" :value="item.aggravateRemitId">{{item.aggravateRemitName}}</option>
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
                                <option v-for="item in sleepList" :value="item.sleepId">{{item.sleepName}}</option>
                            </select><span class="main-title ml20">精神状态</span><select class="J-spiritId" v-model="spiritId">
                                <option v-for="item in spiritList" :value="item.spiritId">{{item.spiritName}}</option>

                            </select></li>
                            <li><span class="main-title">食欲状况</span><select class="J-appetiteId" v-model="appetiteId">
                                <option v-for="item in appetiteList" :value="item.appetiteId">{{item.appetiteName}}</option>
                            </select><span class="main-title ml20">体重状况</span><select class="J-weightId" v-model="weightId">
                                <option v-for="item in weightList" :value="item.weightId">{{item.weightName}}</option>
                            </select></li>
                            <li><span class="main-title">排泄状况</span><select class="J-excretionId" v-model="excretionId">
                                <option v-for="item in excretionList" :value="item.excretionId">{{item.excretionName}}</option>

                            </select></li>
                        </ul>
                    </section>
                </article>
                <footer>
                    <button type="button" class="detail-saveBtn" @click="saveData" v-show="$store.state.currentItem.consultationState == 0">保存</button>
                </footer>
            </section>
        </form>
        <popup v-if="popupShow" :obj.sync="popupObj" :payPopupShow.sync="popupShow"></popup>
    </section>
</template>
<script>
    import api from '@/common/js/util';
    import popup from  '@/common/popup';

    const XHRList = {
        sickDetailUrl: '/call/patient/case/hpi/v1/getMapById/',
        sickSaveUrl: '/call/patient/case/hpi/v1/save/',
        mainSpeakInfo: "/call/customer/patient/case/v1/getMainMapById/", //主诉
    };


    export default{
        name: "nowSick",
        data(){
            return {
                treatmentName: '',
                illnessName: '',
                takeMedicine: '',
                produceReason: '',         //产生诱因
                produceSymptomsList: [
                    {
                        produceSymptomsId: 0,
                        produceSymptomsName: '请选择'
                    },
                    {
                        produceSymptomsId: 1,
                        produceSymptomsName: '疼痛'
                    },
                    {
                        produceSymptomsId: 2,
                        produceSymptomsName: '肿胀'
                    },
                    {
                        produceSymptomsId: 3,
                        produceSymptomsName: '麻木'
                    },
                    {
                        produceSymptomsId: 4,
                        produceSymptomsName: '僵硬'
                    },
                    {
                        produceSymptomsId: 5,
                        produceSymptomsName: '无力'
                    },
                    {
                        produceSymptomsId: 6,
                        produceSymptomsName: '抽筋'
                    },
                    {
                        produceSymptomsId: 7,
                        produceSymptomsName: '发热'
                    },
                    {
                        produceSymptomsId: 8,
                        produceSymptomsName: '关节活动受限'
                    },
                    {
                        produceSymptomsId: 9,
                        produceSymptomsName: '变形'
                    },
                    {
                        produceSymptomsId: 10,
                        produceSymptomsName: '其他'
                    }
                ],
                produceSymptomsId: 0,     //症状
                produceSymptomsName: '',
                produceLevelList: [
                    {
                        produceLevelId: '0',
                        produceLevelName: '请选择'
                    },
                    {
                        produceLevelId: '1',
                        produceLevelName: '无'
                    },
                    {
                        produceLevelId: '2',
                        produceLevelName: '轻度影响'
                    },
                    {
                        produceLevelId: '3',
                        produceLevelName: '可以照常生活或工作'
                    },
                    {
                        produceLevelId: '4',
                        produceLevelName: '中度影响'
                    },
                    {
                        produceLevelId: '5',
                        produceLevelName: '需要减轻工作或生活劳动'
                    },
                    {
                        produceLevelId: '6',
                        produceLevelName: '重度影响'
                    },
                    {
                        produceLevelId: '7',
                        produceLevelName: '完全不能正常生活和工作'
                    }],
                produceLevelId: 0,        //程度
                produceLevelName: '',
                produceSharpenList: [
                    {
                        produceSharpenId: '0',
                        produceSharpenName: '请选择'
                    },
                    {
                        produceSharpenId: '1',
                        produceSharpenName: '无'
                    },
                    {
                        produceSharpenId: '2',
                        produceSharpenName: '睡在受影响的一侧'
                    },
                    {
                        produceSharpenId: '3',
                        produceSharpenName: '打字'
                    },
                    {
                        produceSharpenId: '4',
                        produceSharpenName: '阅读'
                    },
                    {
                        produceSharpenId: '5',
                        produceSharpenName: '工作'
                    },
                    {
                        produceSharpenId: '6',
                        produceSharpenName: '弯曲时'
                    },
                    {
                        produceSharpenId: '7',
                        produceSharpenName: '活动'
                    },
                    {
                        produceSharpenId: '8',
                        produceSharpenName: '负重'
                    },
                    {
                        produceSharpenId: '9',
                        produceSharpenName: '提起重物'
                    },
                    {
                        produceSharpenId: '10',
                        produceSharpenName: '弯腰'
                    },
                    {
                        produceSharpenId: '11',
                        produceSharpenName: '骑行'
                    },
                    {
                        produceSharpenId: '12',
                        produceSharpenName: '驾驶'
                    },
                    {
                        produceSharpenId: '13',
                        produceSharpenName: '爬楼梯'
                    },
                    {
                        produceSharpenId: '14',
                        produceSharpenName: '咳嗽'
                    },
                    {
                        produceSharpenId: '15',
                        produceSharpenName: '慢跑'
                    },
                    {
                        produceSharpenId: '16',
                        produceSharpenName: '跪下'
                    },
                    {
                        produceSharpenId: '17',
                        produceSharpenName: '举起'
                    },
                    {
                        produceSharpenId: '18',
                        produceSharpenName: '抬起'
                    },
                    {
                        produceSharpenId: '19',
                        produceSharpenName: '举过头的动作'
                    },
                    {
                        produceSharpenId: '20',
                        produceSharpenName: '伸直腿'
                    },
                    {
                        produceSharpenId: '21',
                        produceSharpenName: '抬高'
                    },
                    {
                        produceSharpenId: '22',
                        produceSharpenName: '躺下'
                    },
                    {
                        produceSharpenId: '23',
                        produceSharpenName: '跑'
                    },
                    {
                        produceSharpenId: '24',
                        produceSharpenName: '坐着'
                    },
                    {
                        produceSharpenId: '25',
                        produceSharpenName: '久坐'
                    },
                    {
                        produceSharpenId: '26',
                        produceSharpenName: '睡觉'
                    },
                    {
                        produceSharpenId: '27',
                        produceSharpenName: '站立'
                    },
                    {
                        produceSharpenId: '28',
                        produceSharpenName: '久站'
                    },
                    {
                        produceSharpenId: '29',
                        produceSharpenName: '受压'
                    },
                    {
                        produceSharpenId: '30',
                        produceSharpenName: '拉伸'
                    },
                    {
                        produceSharpenId: '31',
                        produceSharpenName: '打喷嚏'
                    },
                    {
                        produceSharpenId: '32',
                        produceSharpenName: '下蹲'
                    },
                    {
                        produceSharpenId: '33',
                        produceSharpenName: '扭转'
                    },
                    {
                        produceSharpenId: '34',
                        produceSharpenName: '走路'
                    },
                    {
                        produceSharpenId: '35',
                        produceSharpenName: '天气'
                    },
                    {
                        produceSharpenId: '36',
                        produceSharpenName: '喝酒'
                    },
                    {
                        produceSharpenId: '37',
                        produceSharpenName: '吃海鲜'
                    }
                ],    //何时加重
                produceSharpenId: 0,
                produceSharpenName: '',
                produceRemitList: [
                    {
                        produceRemitId: '0',
                        produceRemitName: '请选择'
                    },
                    {
                        produceRemitId: '1',
                        produceRemitName: '冰敷'
                    },
                    {
                        produceRemitId: '2',
                        produceRemitName: '热敷'
                    },
                    {
                        produceRemitId: '3',
                        produceRemitName: '服用镇痛药'
                    },
                    {
                        produceRemitId: '4',
                        produceRemitName: '没法缓解'
                    },
                    {
                        produceRemitId: '5',
                        produceRemitName: '抬高'
                    },
                    {
                        produceRemitId: '6',
                        produceRemitName: '躺下'
                    },
                    {
                        produceRemitId: '7',
                        produceRemitName: '按摩'
                    },
                    {
                        produceRemitId: '8',
                        produceRemitName: '放松'
                    },
                    {
                        produceRemitId: '9',
                        produceRemitName: '保持静止'
                    },
                    {
                        produceRemitId: '10',
                        produceRemitName: '休息'
                    },
                    {
                        produceRemitId: '11',
                        produceRemitName: '坐下'
                    },
                    {
                        produceRemitId: '12',
                        produceRemitName: '睡眠'
                    },
                    {
                        produceRemitId: '13',
                        produceRemitName: '站立'
                    },
                    {
                        produceRemitId: '14',
                        produceRemitName: '拉伸'
                    },
                    {
                        produceRemitId: '15',
                        produceRemitName: '行走'
                    }

                ],        //何时缓解
                produceRemitId: 0,
                produceRemitName: '',
                produceTreatment: 0,      //治疗情况
                produceTreatment2: 0,      //治疗情况2
                aggravateReason: '',       //加重诱因
                aggravateSymptomsList: [
                    {
                        aggravateSymptomsId: 0,
                        aggravateSymptomsName: '请选择'
                    },
                    {
                        aggravateSymptomsId: 1,
                        aggravateSymptomsName: '疼痛'
                    },
                    {
                        aggravateSymptomsId: 2,
                        aggravateSymptomsName: '肿胀'
                    },
                    {
                        aggravateSymptomsId: 3,
                        aggravateSymptomsName: '麻木'
                    },
                    {
                        aggravateSymptomsId: 4,
                        aggravateSymptomsName: '僵硬'
                    },
                    {
                        aggravateSymptomsId: 5,
                        aggravateSymptomsName: '无力'
                    },
                    {
                        aggravateSymptomsId: 6,
                        aggravateSymptomsName: '抽筋'
                    },
                    {
                        aggravateSymptomsId: 7,
                        aggravateSymptomsName: '发热'
                    },
                    {
                        aggravateSymptomsId: 8,
                        aggravateSymptomsName: '关节活动受限'
                    },
                    {
                        aggravateSymptomsId: 9,
                        aggravateSymptomsName: '变形'
                    },
                    {
                        aggravateSymptomsId: 10,
                        aggravateSymptomsName: '其他'
                    }],   //症状
                aggravateSymptomsId: 0,
                aggravateSymptomsName: '',
                aggravateLevelList: [
                    {
                        aggravateLevelId: '0',
                        aggravateLevelName: '请选择'
                    },
                    {
                        aggravateLevelId: '1',
                        aggravateLevelName: '无'
                    },
                    {
                        aggravateLevelId: '2',
                        aggravateLevelName: '轻度影响'
                    },
                    {
                        aggravateLevelId: '3',
                        aggravateLevelName: '可以照常生活或工作'
                    },
                    {
                        aggravateLevelId: '4',
                        aggravateLevelName: '中度影响'
                    },
                    {
                        aggravateLevelId: '5',
                        aggravateLevelName: '需要减轻工作或生活劳动'
                    },
                    {
                        aggravateLevelId: '6',
                        aggravateLevelName: '重度影响'
                    },
                    {
                        aggravateLevelId: '7',
                        aggravateLevelName: '完全不能正常生活和工作'
                    }
                ],    //程度
                aggravateLevelId: 0,
                aggravateLevelName: '',
                aggravateSharpenList: [
                    {
                        aggravateSharpenId: '0',
                        aggravateSharpenName: '请选择'
                    },
                    {
                        aggravateSharpenId: '1',
                        aggravateSharpenName: '无'
                    },
                    {
                        aggravateSharpenId: '2',
                        aggravateSharpenName: '睡在受影响的一侧'
                    },
                    {
                        aggravateSharpenId: '3',
                        aggravateSharpenName: '打字'
                    },
                    {
                        aggravateSharpenId: '4',
                        aggravateSharpenName: '阅读'
                    },
                    {
                        aggravateSharpenId: '5',
                        aggravateSharpenName: '工作'
                    },
                    {
                        aggravateSharpenId: '6',
                        aggravateSharpenName: '弯曲时'
                    },
                    {
                        aggravateSharpenId: '7',
                        aggravateSharpenName: '活动'
                    },
                    {
                        aggravateSharpenId: '8',
                        aggravateSharpenName: '负重'
                    },
                    {
                        aggravateSharpenId: '9',
                        aggravateSharpenName: '提起重物'
                    },
                    {
                        aggravateSharpenId: '10',
                        aggravateSharpenName: '弯腰'
                    },
                    {
                        aggravateSharpenId: '11',
                        aggravateSharpenName: '骑行'
                    },
                    {
                        aggravateSharpenId: '12',
                        aggravateSharpenName: '驾驶'
                    },
                    {
                        aggravateSharpenId: '13',
                        aggravateSharpenName: '爬楼梯'
                    },
                    {
                        aggravateSharpenId: '14',
                        aggravateSharpenName: '咳嗽'
                    },
                    {
                        aggravateSharpenId: '15',
                        aggravateSharpenName: '慢跑'
                    },
                    {
                        aggravateSharpenId: '16',
                        aggravateSharpenName: '跪下'
                    },
                    {
                        aggravateSharpenId: '17',
                        aggravateSharpenName: '举起'
                    },
                    {
                        aggravateSharpenId: '18',
                        aggravateSharpenName: '抬起'
                    },
                    {
                        aggravateSharpenId: '19',
                        aggravateSharpenName: '举过头的动作'
                    },
                    {
                        aggravateSharpenId: '20',
                        aggravateSharpenName: '伸直腿'
                    },
                    {
                        aggravateSharpenId: '21',
                        aggravateSharpenName: '抬高'
                    },
                    {
                        aggravateSharpenId: '22',
                        aggravateSharpenName: '躺下'
                    },
                    {
                        aggravateSharpenId: '23',
                        aggravateSharpenName: '跑'
                    },
                    {
                        aggravateSharpenId: '24',
                        aggravateSharpenName: '坐着'
                    },
                    {
                        aggravateSharpenId: '25',
                        aggravateSharpenName: '久坐'
                    },
                    {
                        aggravateSharpenId: '26',
                        aggravateSharpenName: '睡觉'
                    },
                    {
                        aggravateSharpenId: '27',
                        aggravateSharpenName: '站立'
                    },
                    {
                        aggravateSharpenId: '28',
                        aggravateSharpenName: '久站'
                    },
                    {
                        aggravateSharpenId: '29',
                        aggravateSharpenName: '受压'
                    },
                    {
                        aggravateSharpenId: '30',
                        aggravateSharpenName: '拉伸'
                    },
                    {
                        aggravateSharpenId: '31',
                        aggravateSharpenName: '打喷嚏'
                    },
                    {
                        aggravateSharpenId: '32',
                        aggravateSharpenName: '下蹲'
                    },
                    {
                        aggravateSharpenId: '33',
                        aggravateSharpenName: '扭转'
                    },
                    {
                        aggravateSharpenId: '34',
                        aggravateSharpenName: '走路'
                    },
                    {
                        aggravateSharpenId: '35',
                        aggravateSharpenName: '天气'
                    },
                    {
                        aggravateSharpenId: '36',
                        aggravateSharpenName: '喝酒'
                    },
                    {
                        aggravateSharpenId: '37',
                        aggravateSharpenName: '吃海鲜'
                    }
                ],    //何时加重
                aggravateSharpenId: 0,
                aggravateSharpenName: '',
                aggravateRemitList: [
                    {
                        aggravateRemitId: '0',
                        aggravateRemitName: '请选择'
                    },
                    {
                        aggravateRemitId: '1',
                        aggravateRemitName: '冰敷'
                    },
                    {
                        aggravateRemitId: '2',
                        aggravateRemitName: '热敷'
                    },
                    {
                        aggravateRemitId: '3',
                        aggravateRemitName: '服用镇痛药'
                    },
                    {
                        aggravateRemitId: '4',
                        aggravateRemitName: '没法缓解'
                    },
                    {
                        aggravateRemitId: '5',
                        aggravateRemitName: '抬高'
                    },
                    {
                        aggravateRemitId: '6',
                        aggravateRemitName: '躺下'
                    },
                    {
                        aggravateRemitId: '7',
                        aggravateRemitName: '按摩'
                    },
                    {
                        aggravateRemitId: '8',
                        aggravateRemitName: '放松'
                    },
                    {
                        aggravateRemitId: '9',
                        aggravateRemitName: '保持静止'
                    },
                    {
                        aggravateRemitId: '10',
                        aggravateRemitName: '休息'
                    },
                    {
                        aggravateRemitId: '11',
                        aggravateRemitName: '坐下'
                    },
                    {
                        aggravateRemitId: '12',
                        aggravateRemitName: '睡眠'
                    },
                    {
                        aggravateRemitId: '13',
                        aggravateRemitName: '站立'
                    },
                    {
                        aggravateRemitId: '14',
                        aggravateRemitName: '拉伸'
                    },
                    {
                        aggravateRemitId: '15',
                        aggravateRemitName: '行走'
                    }
                ],
                aggravateRemitId: 0,      //何时缓解
                aggravateRemitName: '',
                aggravateTreatment: 0,    //治疗情况
                aggravateTreatment2: 0,   //治疗情况2
                sleepList: [
                    {
                        sleepId: '0',
                        sleepName: '请选择'
                    },
                    {
                        sleepId: '1',
                        sleepName: '良好'
                    },
                    {
                        sleepId: '2',
                        sleepName: '一般'
                    },
                    {
                        sleepId: '3',
                        sleepName: '较差'
                    }
                ],          //睡眠状况
                sleepId: 0,
                sleepName: '',
                spiritList: [
                    {
                        spiritId: '0',
                        spiritName: '请选择'
                    },
                    {
                        spiritId: '1',
                        spiritName: '良好'
                    }, {
                        spiritId: '2',
                        spiritName: '一般'
                    }, {
                        spiritId: '3',
                        spiritName: '较差'
                    }],        //精神状态
                spiritId: 0,
                spiritName: '',
                appetiteList: [
                    {
                        appetiteId: '0',
                        appetiteName: '请选择'
                    },
                    {
                        appetiteId: '1',
                        appetiteName: '良好'
                    },
                    {
                        appetiteId: '2',
                        appetiteName: '一般'
                    },
                    {
                        appetiteId: '3',
                        appetiteName: '较差'
                    }
                ],      //食欲状况
                appetiteId: 0,
                appetiteName: '',
                weightList: [
                    {
                        weightId: '0',
                        weightName: '请选择'
                    },
                    {
                        weightId: '1',
                        weightName: '无明显变化'
                    },
                    {
                        weightId: '2',
                        weightName: '明显消瘦'
                    },
                    {
                        weightId: '3',
                        weightName: '明显长胖'
                    }
                ],        //体重状况
                weightId: 0,
                weightName: '',
                excretionList: [
                    {
                        excretionId: '0',
                        excretionName: '请选择'
                    },
                    {
                        excretionId: '1',
                        excretionName: '正常'
                    },
                    {
                        excretionId: '2',
                        excretionName: '异常'

                    },
                    {
                        excretionId: '3',
                        excretionName: '失禁'

                    }],    //排泄状况
                excretionId: 0,
                excretionName: '',
                popupShow: false,
                popupObj: {}
            }
        },
        components: {
            popup
        },
        mounted: function () {
            this.init();
        },
        watch: {
            '$store.state.currentItem'(){
                this.init();
            },
            //选择症状
            produceSymptomsId(data){
                this.produceSymptomsName = this.produceSymptomsList[data].produceSymptomsName;
            },
            //程度
            produceLevelId(data){
                this.produceLevelName = this.produceLevelList[data].produceLevelName;
            },
            //何时加重
            produceSharpenId(data){
                this.produceSharpenName = this.produceSharpenList[data].produceSharpenName;
            },
            //何时缓解
            produceRemitId(data){
                this.produceRemitName = this.produceRemitList[data].produceRemitName;
            },
            //症状
            aggravateSymptomsId(data){
                this.aggravateSymptomsName = this.aggravateSymptomsList[data].aggravateSymptomsName;
            },
            //程度
            aggravateLevelId(data){
                this.aggravateLevelName = this.aggravateLevelList[data].aggravateLevelName;
            },
            //何时加重
            aggravateSharpenId(data){
                this.aggravateSharpenName = this.aggravateSharpenList[data].aggravateSharpenName;
            },
            //何时缓解
            aggravateRemitId(data){
                this.aggravateRemitName = this.aggravateRemitList[data].aggravateRemitName;
            },
            //睡眠质量
            sleepId(data){
                this.sleepName = this.sleepList[data].sleepName;
            },
            //精神状态
            spiritId(data){
                this.spiritName = this.spiritList[data].spiritName;
            },
            //食欲状态
            appetiteId(data){
                this.appetiteName = this.appetiteList[data].appetiteName;
            },
            //体重
            weightId(data){
                this.weightName = this.weightList[data].weightName;
            },
            //排泄
            excretionId(data){
                this.excretionName = this.excretionList[data].excretionName;
            }
        },
        methods: {
            init() {
                this.userMessage = this.$store.state.currentItem;
                this.initText();
                this.addData();
            },
            addData() {
                let _this = this;
                let dataValue = {
                    caseId: this.userMessage.caseId
                };
                //现病史详情
                api.ajax({
                    url: XHRList.sickDetailUrl,
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
            saveData() {
                let _this = this;
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
                    url: XHRList.sickSaveUrl,
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
            initText() {
                let _this = this;
                let dataValue = {
                    caseId: this.userMessage.caseId,
                    patientId: this.userMessage.patientId
                };
                //主诉
                api.ajax({
                    url: XHRList.mainSpeakInfo,
                    method: "POST",
                    data: dataValue,
                    beforeSend(config) {
                    },
                    done(res) {
                        let dataList = res.responseObject.responseData.dataList;
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
    @import "../../scss/library/_common-modules";
    @import "../../scss/record_common";
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
</style>
