<template>
    <section @click = 'closeSelect()'>
        <section class="config-suggestion-box" v-if="maskerShow" v-show="!$store.state.previewShow">
            <i class="icon-close window-close" @click="closeWindow"></i>
            <header class="config-suggestion-title">
                <button class="config-suggestion-back" @click="goBackCheck()"><i class="icon-leftArrow"></i><span>上一步</span></button>
                <article>
                    <h2>自定义建议</h2>
                    <p>可通过下列标签选择建议类型</p>
                </article>
                <button class="jump-box-add-term" :class="{'icon-suggestion-preview-gray':isLight,'forbid':isLight,'icon-suggestion-preview':!isLight}" @click="previewSuggest">
                    <span>预览</span></button>
                <button class="jump-box-add-send" :class="{'forbid':isLight}" @click="submitStatus&&sendSuggest()"><span>发送</span></button>
            </header>
            <section class="config-suggestion-inner scrollTop">
                <nav class="config-suggestion-tabsBox">
                    <ul class="config-suggestion-tabs">
                        <li class="config-suggestion-tabs-item" :class="{'active':cutNum==index}" v-for="(item,index) in tabList"
                            @click="cutNum = index;FirstIndex = -1 ;secondIndex = -1 ;ThirdIndex =-1 ;FourIndex = -1">{{item}}
                        </li>

                    </ul>
                </nav>
                <section class="config-suggestion-viewers">
                    <section class="config-suggestion-item recommendDoctor" v-show="cutNum == 0">
                        <!--匹配医生和全部医生-->
                        <nav class="mate-and-all">
                            <ul>
                                <li :class="{'on':docCutNum == index}" v-for="(item,index) in docTabList" @click="docCutNum = index">{{item}}</li>
                            </ul>
                        </nav>
                        <!--搜索医生-->
                        <section class="doc-filter-search-box" v-show="docCutNum==1">
                            <ul class="doc-filter-box" :class="{'quHighly':!viewMore}">
                                <li :class="{'on':tagCutNum == index}" v-for="(item,index) in tagTabList"
                                    @click="getAllDocCustomer({tag:item,type:'filter',num:0,value:1,cutNum:index})">
                                    {{getTagName(item)}}
                                </li>
                            </ul>
                            <a href="javascript:;" class="viewMoreBox" @click="viewMore = !viewMore">
                                <button class="viewMore" :class="{'rotate':viewMore}"></button>
                            </a>
                            <div class="doc-search-box">
                                <input type="text" placeholder="医院、医生、医生擅长" class="doc-search" maxlength="20" v-model="docSearchValue" :class="{on:docSearchValue.trim().length>0}">
                                <dignosi-address   :provinceFlag.sync="provinceFlag" :dataListInfo.sync="addressResult" :dataBack.sync="addressResult"></dignosi-address><select class="doc-type" v-model="doctorType">
                                <option value="">类型不限</option>
                                <option value="1">权威医生</option>
                                <option value="0">轻问诊医生</option>
                            </select><select class="doc-type" v-model="onlineState">
                                <option value="">状态不限</option>
                                <option value="1">在线</option>
                            </select>
                                <button class="doc-search-btn on"  :class="{on:docSearchValue.trim().length>0}" @click="getAllDocCustomer({type:'search',num:0,value:1})">搜索</button>
                            </div>
                        </section>
                        <!--全选按钮-->
                        <button class="config-suggestion-select icon-select-small" :class="{'active':matchDoc.matchDocState}" v-if="matchDoc.matchDocList.length>0&&docCutNum==0"
                                @click="matchDocAllChecked(matchDoc.matchDocList,'match')"><span>全选</span></button>
                        <button class="config-suggestion-select icon-select-small" :class="{'active':allDoc.allDocState}" v-if="allDoc.allDocList.length>0&&docCutNum==1"
                                @click="matchDocAllChecked(allDoc.allDocList,'all')"><span>全选</span></button>
                        <!--推荐医生最外层-->
                        <section class="doctor-message-box">
                            <section class="doctor-message doctor-message-mate" v-show="docCutNum==0">
                                <template v-if="matchDoc.matchDocList.length>0">
                                    <section class='doctor-message-item icon-select-big' :class="{'active':docList.isChecked}" v-for="(docList,index) in matchDoc.matchDocList"
                                             @click.stop="changeCheckedState(docList,index,'match')">
                                        <figure class="doctor-message-img"><img :src="docList.logoUrl?docList.logoUrl:'/static/img/img00/common/default_logo.png'"></figure>
                                        <figcaption class="doctor-message-content">
                                            <header class="doctor-message-content-head">
                                                <h4>{{docList.fullName}}</h4>
                                                <!--<p class="rate">匹配度{{docList.suitability}}%</p>-->
                                                <p class="rate">{{docList.doctorType==1?'权威医生':'轻问诊医生'}}</p>
                                                <span class="netstat" :class="{'rest':docList.adviceStatus != 1}">{{docList.adviceStatus == 1 ? '在线' : '不接诊'}}</span>
                                                <figure class="doctor-message-tags">
                                                    <span class="tags" v-if="docList.isTop==1">全国TOP10骨科医院</span>
                                                    <span class="tags" v-if="docList.isNearest==1">距离最近</span>
                                                    <span class="tags" v-if="docList.isFreeTimes==1" style="background: #FFF1D4;color: #EB9E00;">首次问诊免费</span>
                                                </figure>
                                            </header>
                                            <article class="doctor-message-hospital">
                                                <span class="hos-address">{{docList.province?docList.province:""}}  {{docList.city?docList.city:""}}  {{docList.district?docList.district:""}}</span>
                                                <span class="hospital">{{docList.company ? docList.company : ""}}</span>
                                                <span class="medical">{{docList.medicalTitle}}</span>
                                            </article>
                                            <article class="administrator-message" v-if="docList.remarksContent">
                                                管理员备注：<span>{{docList.remarksContent}}</span>
                                            </article>
                                            <article class="doctor-message-goodAt" v-if="docList.illnessNameList.length>0 || docList.operationNameList.length>0">
                                                擅长：<span :class="{'on':matchCurrentIndex == index}">{{docList.illnessNameList + docList.operationNameList}}</span>
                                            </article>
                                            <a href="javascript:;" class="viewMoreBox" @click.stop="matchCurrent(index,$event)" v-if="(docList.illnessNameList.replace(/[^\u4e00-\u9fa5]/gi,'').length + docList.operationNameList.replace(/[^\u4e00-\u9fa5]/gi,'').length)>30">{{matchCurrentIndex == index?'收起':'展开'}}</a>
                                            <article class="doctor-message-num">
                                                <span class="price" v-if="docList.generalPrice.length>0"><i style="color: #F23E34;">¥{{docList.generalPrice}}</i>/{{docList.generalTimes}}次起</span>
                                                <span class="lastNum" v-if="docList.adviceNum>0">仅剩<i style="color: #00BEAF;">{{docList.adviceNum}}</i>个名额</span>
                                            </article>
                                        </figcaption>
                                    </section>
                                </template>
                                <p class="no-mate-doc" v-else>未找到最匹配医生,请切换至全部医生进行选择</p>
                            </section>
                            <section class="doctor-message doctor-message-all" v-show="docCutNum==1">
                                <section class="doctor-message-page-box">
                                    <section class='doctor-message-item icon-select-big' :class="{'active':docList.isChecked}" v-for="(docList,index) in allDoc.allDocList"
                                             @click="changeCheckedState(docList,index,'all')">
                                        <figure class="doctor-message-img"><img :src="docList.logoUrl?docList.logoUrl:'/static/img/img00/common/default_logo.png'"></figure>
                                        <figcaption class="doctor-message-content">
                                            <header class="doctor-message-content-head">
                                                <h4>{{docList.fullName}}</h4>
                                                <!--<p class="rate">匹配度{{docList.suitability}}%</p>-->
                                                <p class="rate">{{docList.doctorType==1?'权威医生':'轻问诊医生'}}</p>
                                                <span class="netstat" :class="{'rest':docList.adviceStatus != 1}">{{docList.adviceStatus == 1 ? '在线' : '不接诊'}}</span>
                                                <figure class="doctor-message-tags">
                                                    <span ></span>
                                                    <span class="tags" v-if="docList.isTop==1">全国TOP10骨科医院</span>
                                                    <span class="tags" v-if="docList.isNearest==1">距离最近</span>
                                                    <span class="tags" v-if="docList.isFreeTimes==1" style="background: #FFF1D4;color: #EB9E00;">首次问诊免费</span>
                                                </figure>
                                            </header>
                                            <article class="doctor-message-hospital">
                                                <span class="hos-address">{{docList.province?docList.province:""}}  {{docList.city?docList.city:""}}  {{docList.district?docList.district:""}}</span>
                                                <span class="hospital">{{docList.company ? docList.company : ''}}</span>
                                                <span class="medical">{{docList.medicalTitle}}</span>
                                            </article>
                                            <article class="administrator-message" v-if="docList.remarksContent">
                                                管理员备注：<span>{{docList.remarksContent}}</span>
                                            </article>
                                            <article class="doctor-message-goodAt" v-if="docList.illnessNameList.length>0 || docList.operationNameList.length>0">
                                                擅长：<span v-html="docList.illnessNameList + docList.operationNameList" :class="{'on':allCurrentIndex == index}"></span>
                                            </article>
                                            <a href="javascript:;" class="viewMoreBox" @click.stop="allCurrent(index,$event)" v-if="(docList.illnessNameList.replace(/[^\u4e00-\u9fa5]/gi,'').length + docList.operationNameList.replace(/[^\u4e00-\u9fa5]/gi,'').length)>30">{{allCurrentIndex == index?'收起':'展开'}}</a>
                                            <article class="doctor-message-num">
                                                <span class="price" v-if="docList.generalPrice.length>0"><i style="color: #F23E34;">¥{{docList.generalPrice}}</i>/{{docList.generalTimes}}次起</span>
                                                <span class="lastNum" v-if="docList.adviceNum>0">仅剩<i style="color: #00BEAF;">{{docList.adviceNum}}</i>个名额</span>
                                            </article>
                                        </figcaption>
                                    </section>
                                    <p class="no-mate-doc" v-if="noDocData">没有找到相应的结果</p>
                                </section>
                                <div class="page-container"
                                     v-if="allDoc.totalCount>allDoc.pageNum&&allDoc.allDocList.length>0">
                                    <div class="pagination pager">
                                        <ul class="pages">
                                            <li class="pgNext" :class="{'pgEmpty':allDoc.pageIndex == 1}"
                                                @click="getAllDocCustomer({num:0,value:1})">首页
                                            </li>
                                            <li class="pgNext" :class="{'pgEmpty':allDoc.pageIndex == 1}"
                                                @click="getAllDocCustomer({num:allDoc.pageArr.indexOf(allDoc.pageIndex)-1,value:allDoc.pageArr[allDoc.pageArr.indexOf(allDoc.pageIndex)-1]})">上一页
                                            </li>
                                            <li class="page-number" :class="{'pgCurrent':allDoc.pageIndex == item}"
                                                v-for="(item,index) in allDoc.pageArr" @click="getAllDocCustomer({num:index,value:item})">{{item}}
                                            </li>
                                            <li class="pgNext"
                                                :class="{'pgEmpty':allDoc.pageIndex == Math.ceil(allDoc.totalCount/allDoc.pageNum)}"
                                                @click="getAllDocCustomer({num:allDoc.pageArr.indexOf(allDoc.pageIndex)+1,value:allDoc.pageArr[allDoc.pageArr.indexOf(allDoc.pageIndex)+1]})">下一页
                                            </li>
                                            <li class="pgNext"
                                                :class="{'pgEmpty':allDoc.pageIndex == Math.ceil(allDoc.totalCount/allDoc.pageNum)}"
                                                @click="getAllDocCustomer({num:Math.ceil(allDoc.totalCount/allDoc.pageNum)-1,value:Math.ceil(allDoc.totalCount/allDoc.pageNum)})">
                                                末页
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </section>
                    <section class="config-suggestion-item teachingKnowledge" v-show="cutNum == 1">
                        <section class="check-project">
                            <section class="check-project-list">
                                <article class="check-project-item" v-for="(oneItem,oneIndex) in teachingKnowledgeList"
                                         @click.stop="showNext('FirstIndex',oneIndex)">
                                    <span :class="{'icon-downArrow-big':oneItem.children.length>0,'selected':FirstIndex == oneIndex}">{{oneItem.knowledgeName}}</span>
                                    <section class="check-project-second-box" :class="{'active':FirstIndex == oneIndex}"
                                             v-if="oneItem.children.length>0">
                                        <section class='check-project-second-item check-project-second-title'
                                                 :class="{'icon-downArrow':twoItem.children.length>0,'selected':SecondIndex == twoIndex}"
                                                 v-for="(twoItem,twoIndex) in oneItem.children"
                                                 @click.stop="showNext('SecondIndex',twoIndex)">
                                            <span>{{twoItem.knowledgeName}}</span>
                                            <section class="check-project-second-box" v-if="twoItem.children.length>0"
                                                     :class="{'active':SecondIndex == twoIndex}">
                                                <section class="check-project-second-item select-element"
                                                         :class="{'icon-downArrow':threeItem.children.length>0,'active':threeItem.isChecked}"
                                                         v-for="(threeItem,threeIndex) in twoItem.children"
                                                         @click.stop="selectData(threeItem,1)">
                                                    <i class="icon-select-big"></i>
                                                    <span>{{threeItem.knowledgeName}}</span>
                                                    <i class="icon-detail"
                                                       @click.stop="knowledgeId=threeItem.knowledgeId;configShow = false;teachingDetailsShow=true"><span>详情</span></i>
                                                    <section class="check-project-second-box"
                                                             v-if="threeItem.children.length>0">
                                                        <section class="check-project-second-item select-element"
                                                                 :class="{'icon-downArrow':fourItem.children.length>0,'active':fourItem.isChecked}"
                                                                 v-for="(fourItem,fourIndex) in threeItem.children"
                                                                 @click.stop="selectData(fourItem,1)">
                                                            <i class="icon-select-big"></i>
                                                            <span>{{fourItem.knowledgeName}}</span>
                                                            <i class="icon-detail"
                                                               @click.stop="knowledgeId=threeItem.knowledgeId;configShow = false;teachingDetailsShow=true"><span>详情</span></i>
                                                        </section>
                                                    </section>
                                                </section>
                                            </section>
                                        </section>
                                    </section>
                                </article>
                            </section>
                        </section>
                    </section>
                    <section class="config-suggestion-item disposeSuggest" v-show="cutNum == 2">
                        <section class="check-project">
                            <section class="check-project-list">
                                <article class="check-project-item" v-for="(oneItem,oneIndex) in disposeSuggestList"
                                         @click.stop="showNext('FirstIndex',oneIndex)">
                                    <span :class="{'icon-downArrow-big':oneItem.children.length>0,'selected':FirstIndex == oneIndex}">{{oneItem.treatmentName}}</span>
                                    <section class="check-project-second-box" :class="{'active':FirstIndex == oneIndex}"
                                             v-if="oneItem.children.length>0">
                                        <section class='check-project-second-item check-project-second-title'
                                                 :class="{'icon-downArrow':twoItem.children.length>0,'selected':SecondIndex == twoIndex}"
                                                 v-for="(twoItem,twoIndex) in oneItem.children"
                                                 @click.stop="showNext('SecondIndex',twoIndex)">
                                            <span>{{twoItem.treatmentName}}</span>
                                            <section class="check-project-second-box" v-if="twoItem.children.length>0"
                                                     :class="{'active':SecondIndex == twoIndex}">
                                                <section
                                                        :class="{'icon-downArrow':threeItem.children.length>0,'selected':ThirdIndex == threeIndex,'active':threeItem.isChecked}"
                                                        class="check-project-second-item select-element"
                                                        v-for="(threeItem,threeIndex) in twoItem.children"
                                                        @click.stop="showNext('ThirdIndex',threeIndex)">
                                                    <i class="icon-select-big"
                                                       @click.stop="selectData(threeItem,2)"></i>
                                                    <span>{{threeItem.treatmentName}}</span>
                                                    <section class="check-project-second-box"
                                                             v-if="threeItem.children.length>0"
                                                             :class="{'active':ThirdIndex == twoIndex}">
                                                        <section class="check-project-second-item select-element"
                                                                 :class="{'icon-downArrow':fourItem.children.length>0,'selected':FourIndex == fourIndex,'select-disabled':!fourItem.isSelected,'active':fourItem.isChecked}"
                                                                 v-for="(fourItem,fourIndex) in threeItem.children">
                                                            <i class="icon-select-big"
                                                               @click.stop="fourItem.isSelected&&selectData(fourItem,2)"></i>
                                                            <span>{{fourItem.treatmentName}}</span>
                                                        </section>
                                                    </section>
                                                </section>
                                            </section>
                                        </section>
                                    </section>
                                </article>
                            </section>
                        </section>
                    </section>
                    <section class="config-suggestion-item examineSuggest" v-show="cutNum == 3">
                        <section class="check-project">
                            <section class="check-project-list">
                                <article class="check-project-item" v-for="(oneItem,oneIndex) in examineSuggestList"
                                         @click.stop="showNext('FirstIndex',oneIndex)">
                                    <span :class="{'icon-downArrow-big':oneItem.children.length>0,'selected':FirstIndex == oneIndex}">{{oneItem.nodeName}}</span>
                                    <section class="check-project-second-box" :class="{'active':FirstIndex == oneIndex}"
                                             v-if="oneItem.children.length>0">
                                        <section class='check-project-second-item check-project-second-title'
                                                 :class="{'icon-downArrow':twoItem.children.length>0,'selected':SecondIndex == twoIndex}"
                                                 v-for="(twoItem,twoIndex) in oneItem.children"
                                                 @click.stop="showNext('SecondIndex',twoIndex)">
                                            <span>{{twoItem.nodeName}}</span>
                                            <section class="check-project-second-box" v-if="twoItem.children.length>0"
                                                     :class="{'active':SecondIndex == twoIndex}">
                                                <section
                                                        :class="{'icon-downArrow':threeItem.children.length>0,'selected':ThirdIndex == threeIndex,'active':threeItem.isChecked}"
                                                        class="check-project-second-item select-element"
                                                        v-for="(threeItem,threeIndex) in twoItem.children"
                                                        @click.stop="showNext('ThirdIndex',threeIndex)">
                                                    <i class="icon-select-big"
                                                       @click.stop="selectData(threeItem,3)"></i>
                                                    <span>{{threeItem.nodeName}}</span>
                                                    <section class="check-project-second-box"
                                                             v-if="threeItem.children.length>0"
                                                             :class="{'active':ThirdIndex == twoIndex}">
                                                        <section class="check-project-second-item select-element"
                                                                 :class="{'icon-downArrow':fourItem.children.length>0,'selected':FourIndex == fourIndex,'select-disabled':!fourItem.isSelected,'active':fourItem.isChecked}"
                                                                 v-for="(fourItem,fourIndex) in threeItem.children">
                                                            <i class="icon-select-big"
                                                               @click.stop="fourItem.isSelected&&selectData(fourItem,3)"></i>
                                                            <span>{{fourItem.nodeName}}</span>
                                                        </section>
                                                    </section>
                                                </section>
                                            </section>
                                        </section>
                                    </section>
                                </article>
                            </section>
                        </section>
                    </section>
                    <section class="config-suggestion-item testSuggest" v-show="cutNum == 4">
                        <section class="check-project">
                            <section class="check-project-list">
                                <article class="check-project-item" v-for="(oneItem,oneIndex) in testSuggestList"
                                         @click.stop="showNext('FirstIndex',oneIndex)">
                                    <span :class="{'icon-downArrow-big':oneItem.children.length>0,'selected':FirstIndex == oneIndex}">{{oneItem.inspectionName}}</span>
                                    <section class="check-project-second-box" :class="{'active':FirstIndex == oneIndex}"
                                             v-if="oneItem.children.length>0">
                                        <section class='check-project-second-item check-project-second-title'
                                                 :class="{'icon-downArrow':twoItem.children.length>0,'selected':SecondIndex == twoIndex}"
                                                 v-for="(twoItem,twoIndex) in oneItem.children"
                                                 @click.stop="showNext('SecondIndex',twoIndex)">
                                            <span>{{twoItem.inspectionName}}</span>
                                            <section class="check-project-second-box" v-if="twoItem.children.length>0"
                                                     :class="{'active':SecondIndex == twoIndex}">
                                                <section
                                                        :class="{'icon-downArrow':threeItem.children.length>0,'selected':ThirdIndex == threeIndex,'active':threeItem.isChecked}"
                                                        class="check-project-second-item select-element"
                                                        v-for="(threeItem,threeIndex) in twoItem.children"
                                                        @click.stop="showNext('ThirdIndex',threeIndex)">
                                                    <i class="icon-select-big"
                                                       @click.stop="selectData(threeItem,4)"></i>
                                                    <span>{{threeItem.inspectionName}}</span>
                                                    <section class="check-project-second-box"
                                                             v-if="threeItem.children.length>0"
                                                             :class="{'active':ThirdIndex == twoIndex}">
                                                        <section class="check-project-second-item select-element"
                                                                 :class="{'icon-downArrow':fourItem.children.length>0,'selected':FourIndex == fourIndex,'select-disabled':!fourItem.isSelected,'active':fourItem.isChecked}"
                                                                 v-for="(fourItem,fourIndex) in threeItem.children">
                                                            <i class="icon-select-big"
                                                               @click.stop="fourItem.isSelected&&selectData(fourItem,4)"></i>
                                                            <span>{{fourItem.inspectionName}}</span>
                                                        </section>
                                                    </section>
                                                </section>
                                            </section>
                                        </section>
                                    </section>
                                </article>
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        </section>
        <teachingDetail :knowledgeId="knowledgeId" :knowledgeShow.sync="teachingDetailsShow" v-if="teachingDetailsShow" @goBack="teachingGoBack"></teachingDetail>
    </section>
</template>
<script type="text/ecmascript-6">
    import ajax from "../../common/js/ajax";
    import teachingDetail from "./teachingDetails";
    import store from "../../store/store";
    import dignosiAddress  from '@/common/dignosiAddress'
    import releasePatient from "@/base/releasePatient";   //改变患者状态

    const XHRList = {
        getTagData: "/call/comm/data/tag/v1/getMapList/",//专业列表
        filterSearchDocMessage:"/call/customer/auth/v1/getMatchCustomerList/",//筛选搜索推荐医生
        getTeachingKnowledge:"/call/comm/data/knowledge/v1/getMapList/",//患教知识
        getDisposeSuggest:"/call/comm/data/treatment/v1/getMapList/",//处置建议
        getExamineSuggest:"/call/comm/data/check/v1/getMapList/",//检查建议
        getTestSuggest:"/call/comm/data/inspection/v1/getMapList/",//检验建议


        saveData: "/call/patient/case/diagnosis/v1/create/",//保存初步诊断
        savePreviewSuggest:"/call/patient/recovery/advice/v1/create/",//保存初诊建议
        saveRecommendDoc:"/call/patient/recommend/v1/create/",//保存初诊医生

    };
    export default{
        data(){
            return {
                docSearchValue: "",
                configShow: true,
                FirstIndex: -1,
                SecondIndex: -1,
                ThirdIndex: -1,
                FourIndex: -1,
                isActive: false,
                viewMore: false,
                isLight: true,
                submitStatus:true,
                cutNum: 0,
                docCutNum: 0,
                tagCutNum: 0,
                tabList: ["推荐医生", "患教知识", "处置建议", "检查建议", "检验建议"],
                docTabList: ["匹配医生", "全部医生"],
                tagTabList: [
                    {
                        platformId: "1",
                        id: "",
                        tagName: "全部"
                    }
                ],
                matchDoc: {
                    matchDocList: [],
                    matchDocState: false
                },
                allDoc: {
                    allDocList: [],
                    allDocState: false,
                    totalCount: 0,
                    pageNum: 20,
                    pageIndex: 1,
                    pageResult: 0,
                    pageArr:[],
                },
                noDocData: false,
                searchTagName: "",
                teachingKnowledgeList: [],
                teachingDetailsShow: false,
                knowledgeId: "",
                disposeSuggestList: [],
                examineSuggestList: [],
                testSuggestList: [],
                previewDiagnoseSuggest: {
                    diagnoseResult: {},
                    doctorList: [],
                    teachingList: [],
                    disposeList: [],
                    examineList: [],
                    testList: []
                },
                previewShow: false,
                addressResult: {
                    provinceId: '',
                    provinceName: '',
                    cityId: '',
                    cityName: '',
                    districtId: '',
                    districtName: ''
                },
                doctorType:'',
                onlineState:1,
                matchCurrentIndex:-1,
                allCurrentIndex:-1,
                provinceFlag:false
            }
        },
        mounted(){
            this.getTargetList();
            this.getMatchDocCustomer();
            this.getAllDocCustomer({num: 0,value:1},"1");
            this.getFourList({
                url: XHRList.getTeachingKnowledge,
                listName: "teachingKnowledgeList"
            });
            this.getFourList({
                url: XHRList.getDisposeSuggest,
                listName: "disposeSuggestList"
            });
            this.getFourList({
                url: XHRList.getExamineSuggest,
                listName: "examineSuggestList"
            });
            this.getFourList({
                url: XHRList.getTestSuggest,
                listName: "testSuggestList"
            });
        },
        methods: {
            //DOM渲染
            getTargetList(){
                let that = this;
                this.previewDiagnoseSuggest.diagnoseResult = this.checkData;
                ajax({
                    url: XHRList.getTagData,
                    method: 'POST',
                    data: {
                        isValid: 1,
                        firstResult: 0,
                        maxResult: 999,
                        treeLevel: "2"
                    },
                    done(data){
                        if (data.responseObject.responseData) {
                            data.responseObject.responseData.data_list.forEach(function (key, value) {
                                that.tagTabList.push(key);
                            })
                        }
                    }
                })
            },
            getTagName(obj){
                if (obj.platformId == 2) {
                    return "手外-" + obj.tagName
                } else {
                    return obj.tagName
                }
            },
            getFourList(obj){
                let that = this
                store.commit("startLoading");
                ajax({
                    url: obj.url,
                    method: 'POST',
                    data: {
                        isValid: 1,
                        firstResult: 0,
                        maxResult: 9999
                    },
                    done(data){
                        if (data.responseObject.responseData) {
                            let dataList = that.setCheckedState(data.responseObject.responseData.dataList);
                            that[obj.listName] = dataList;
                            store.commit("stopLoading");
                        }
                    }
                })
            },
            getMatchDocCustomer(){
                let that = this;
                store.commit("startLoading");
                //匹配医生
                ajax({
                    url: XHRList.filterSearchDocMessage,
                    method: 'POST',
                    data: {
                        isMatch: "1",
                        isValid: "1",
                        customerId: that.$store.state.userId,
                        firstResult: 0,
                        maxResult: 9999,
                        degreeType: that.checkData.degreeType,
                        illnessId: that.checkData.illnessId,
                        areasExpertise: that.checkData.majorId,
                        patientId: that.$store.state.patientId,
                        logoUseFlag: 3,
                    },
                    done(data){
                        console.log(data);
                        if (data.responseObject.responseData && data.responseObject.responseData.dataList) {
                            let dataList = that.setCheckedState(data.responseObject.responseData.dataList);
                            that.matchDoc.matchDocList = dataList;
                            store.commit("stopLoading");
                        }
                    }
                })
            },
            getAllDocCustomer(obj,isInit){
                console.log(obj)
                if(obj.value == "•••") return false;
                store.commit("startLoading");
                let that = this;
                let searchAreasExpertise = "";
                that.allDoc.pageResult = (obj.value-1) * that.allDoc.pageNum;
                that.allDoc.pageIndex = obj.value;
                if (obj.type == "filter") {
                    this.tagCutNum = obj.cutNum;
                    this.searchTagName = obj.tag.tagName;
                    this.docSearchValue = "";
                }
                if (this.searchTagName == "全部") {
                    searchAreasExpertise = "";
                } else if (this.searchTagName.indexOf("&") != -1) {
                    searchAreasExpertise = this.searchTagName.replace(/&/g, ",");
                } else {
                    searchAreasExpertise = this.searchTagName;
                }
                let data = {
                    isMatch: "0",
                    isValid: "1",
                    logoUseFlag: "3",
                    firstResult: that.allDoc.pageResult,
                    maxResult: that.allDoc.pageNum,
                    illnessId: that.checkData.illnessId,
                    areasExpertise: that.checkData.majorName.indexOf("&") == -1 ? that.checkData.majorName : that.checkData.majorName.replace(/&/g, ","),
                    patientId: that.$store.state.patientId,
                    searchParam: that.docSearchValue.trim(),
                    searchAreasExpertise: searchAreasExpertise,
                    degreeType: that.checkData.degreeType,

                };
                // if(obj.type=='search'){
                if (this.addressResult.provinceId){
                    data.searchRegion = this.addressResult.provinceId ;
                }
//                    if(this.addressResult.districtId){
//                        data.searchRegion = this.addressResult.districtId ;
//                    }
//                    else if (this.addressResult.provinceId){
//                        data.searchRegion = this.addressResult.provinceId ;
//                    }else if(this.addressResult.cityId){
//                        data.searchRegion = this.addressResult.cityId ;
//                    }
                if(that.doctorType){
                    data.searchDoctorType = that.doctorType;
                }
                if(that.onlineState){
                    data.searchOnlineState = that.onlineState;
                }

                //   }
                //全部医生首页
                ajax({
                    url: XHRList.filterSearchDocMessage,
                    method: 'POST',
                    data: data,
                    done(data){
                        if (data.responseObject.responseData && data.responseObject.responseData.dataList) {
                            let dataList = that.setCheckedState(data.responseObject.responseData.dataList);
                            if (obj.type == "search") {
                                //高亮搜索关键字
                                let lightWord = that.docSearchValue.trim().replace(/\s+/g, ' ').split(" ");
                                if(lightWord.length>0){
                                    lightWord.forEach(function (value) {
                                        let _lightWord = new RegExp("(" + value + ")", "g");
                                        dataList.forEach(function (element) {
                                            if(element.illnessNameList.length>0){
                                                element.illnessNameList = element.illnessNameList.replace(_lightWord, "<span class='high-light-search-text'>" + value + "</span>");
                                            }
                                            if(element.operationNameList.length>0){
                                                element.operationNameList = element.operationNameList.replace(_lightWord,"<span class='high-light-search-text'>"+value+"</span>");
                                            }
                                        })
                                    });
                                }
                            }
                            that.allDoc.allDocList = that.isChosenTheDoc(dataList);
                            that.allDoc.allDocState = false;
                            that.allDoc.totalCount = data.responseObject.responseData.totalCount;
//                            that.previewDiagnoseSuggest.doctorList = [];
                            that.noDocData = false;
                            that.matchCurrentIndex = -1;
                            that.allCurrentIndex = -1;
                        } else {
                            that.allDoc.allDocList = [];
//                            that.previewDiagnoseSuggest.doctorList = [];
                            that.noDocData = true;
                            that.matchCurrentIndex = -1;
                            that.allCurrentIndex = -1;
                        }
                        document.querySelector(".scrollTop").scrollTop = 0;
                        that.pages(isInit,obj.num,obj.value);
                        store.commit("stopLoading");
                    }
                });
            },
            pages(init,clickNum,clickValue){
                let that =this;
                let pagesLength = Math.ceil(that.allDoc.totalCount / that.allDoc.pageNum);
                //初始化
                if(init == 1){
                    if(pagesLength>10){
                        that.allDoc.pageArr = [1,2,3,4,5,"•••",pagesLength-2,pagesLength-1,pagesLength];
                    }else{
                        for (let i = 1; i <= Math.ceil(pagesLength); i++) {
                            that.allDoc.pageArr.push(i);
                        }
                    }
                }else{
                    let ellipsis = "•••",ellipsisNum;
                    if(pagesLength>10){
                        //点击首页、末页
                        if(clickValue == 1 || clickValue == Math.ceil(that.allDoc.totalCount/that.allDoc.pageNum)){
                            that.allDoc.pageArr = [1,2,3,4,5,"•••",pagesLength-2,pagesLength-1,pagesLength];
                            return false;
                        }
                        //确定"•••"的位置
                        that.allDoc.pageArr.forEach(function (value,key) {
                            if(ellipsis == value){
                                ellipsisNum = key;
                            }
                        });
                        //添加删除"•••"，如果"•••"两边数字差小于3，删除"•••"，否则添加"•••"；
//                        if(clickNum == ellipsisNum-1 && that.allDoc.pageArr[ellipsisNum+1] - that.allDoc.pageArr[clickNum] <=3){
//                            let addThreeNum = that.allDoc.pageArr[clickNum];
//                            that.allDoc.pageArr.splice(ellipsisNum,1,addThreeNum+1,addThreeNum+2);
//                            return false;
//                        }else if(clickNum == ellipsisNum+1 && that.allDoc.pageArr[clickNum] - that.allDoc.pageArr[ellipsisNum-1] <=3){
//                            let reduceThreeNum = that.allDoc.pageArr[clickNum];
//                            that.allDoc.pageArr.splice(ellipsisNum,1,reduceThreeNum-1,reduceThreeNum-2);
//                            return false;
//                        }else if(pagesLength){}
                        //改变数值
                        if(ellipsisNum){

                            let rightNum = Number(that.allDoc.pageArr[ellipsisNum-1]) +1,
                                leftNum = Number(that.allDoc.pageArr[ellipsisNum+1]) -1;
                            if(clickNum == ellipsisNum-1){
                                that.allDoc.pageArr.splice(ellipsisNum,0,rightNum);
                                that.allDoc.pageArr.splice(0,1);
                            }else if(clickNum == 0 && Number(that.allDoc.pageArr[0]) != 1){
                                that.allDoc.pageArr.unshift(Number(that.allDoc.pageArr[0])-1);
                                that.allDoc.pageArr.splice(ellipsisNum,1);
                            }else if(clickNum == ellipsisNum +1){
                                that.allDoc.pageArr.splice(ellipsisNum+1,0,leftNum);
                                that.allDoc.pageArr.splice(that.allDoc.pageArr.length-1,1);
                            }else if(clickNum == that.allDoc.pageArr.length-1 && Number(that.allDoc.pageArr[that.allDoc.pageArr.length-1] != pagesLength)){
                                that.allDoc.pageArr.push(Number(that.allDoc.pageArr[that.allDoc.pageArr.length-1])+1);
                                that.allDoc.pageArr.splice(ellipsisNum,1);
                            }


                            if(that.allDoc.pageArr[ellipsisNum+1] - that.allDoc.pageArr[clickNum] ==1 || that.allDoc.pageArr[clickNum] - that.allDoc.pageArr[ellipsisNum-1] ==1){
                                that.allDoc.pageArr.splice(ellipsisNum,1);
                            }
                        }else{
                            if(clickNum == 0){
                                that.allDoc.pageArr.splice(4,1,ellipsis);
                                that.allDoc.pageArr.unshift(Number(that.allDoc.pageArr[0])-1);
                            }else if(clickNum == 7){
                                that.allDoc.pageArr.splice(5,1,ellipsis);
                                that.allDoc.pageArr.push(Number(that.allDoc.pageArr[that.allDoc.pageArr.length-1])+1);
                            }
                        }
                    }else{
                        that.allDoc.pageArr = [];
                        for (let i = 1; i <= Math.ceil(pagesLength); i++) {
                            that.allDoc.pageArr.push(i);
                        }
                    }
                }
                //  console.log(that.allDoc.pageArr)
            },
            //推荐医生---复选、全选、筛选、分页
            setCheckedState(arr){
                arr.forEach(function (key, value) {
                    key.isChecked = false;
                    if (key.children && key.children.length > 0) {
                        key.children.forEach(function (element) {
                            element.isChecked = false;
                            if (element.children && element.children.length > 0) {
                                element.children.forEach(function (elem) {
                                    elem.isChecked = false;
                                    elem.isSelected = true;
                                    if (elem.children && elem.children.length > 0) {
                                        elem.children.forEach(function (el) {
                                            el.isChecked = false;
                                            el.isSelected = true;
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
                return arr;
            },
            matchDocAllChecked(arr, type){
                let that = this;
                if (type == "match") {
                    this.matchDoc.matchDocState = !(this.matchDoc.matchDocState);
                } else {
                    this.allDoc.allDocState = !(this.allDoc.allDocState);
                }
//                arr.forEach(function (key, value) {
//                    key.isChecked = !(key.isChecked)
//                })
                if ((this.matchDoc.matchDocState && type == "match") || (this.allDoc.allDocState && type == "all")) {
                    arr.forEach(function (key, value) {
                        key.isChecked = true
                        let docId = key.customerId, flag = true;
                        that.previewDiagnoseSuggest.doctorList.forEach(function (element, index) {
                            if (element.customerId == docId) {
                                flag = false;
                                console.log("该医生已被选");
                            }
                        })
                        if (flag) {
                            that.previewDiagnoseSuggest.doctorList.push(key);
                            console.log("该医生已添加");
                        }
                    })
                } else {
                    arr.forEach(function (key, value) {
                        key.isChecked = false;
                        let docId = key.customerId;
                        that.previewDiagnoseSuggest.doctorList.forEach(function (element, index) {
                            if (element.customerId == docId) {
                                that.previewDiagnoseSuggest.doctorList.splice(index, 1);
                                console.log("该医生已删除");
                                return false;
                            }
                        })
                    })
                }
            },
            changeCheckedState(list, index, type){
                let flag = true, that = this;
                if (type == "match") {
                    this.matchDoc.matchDocList[index].isChecked = !(this.matchDoc.matchDocList[index].isChecked);
                } else {
                    this.allDoc.allDocList[index].isChecked = !(this.allDoc.allDocList[index].isChecked);
                }
                if ((type == "match"&&this.matchDoc.matchDocList.length > 0 && this.matchDoc.matchDocList[index].isChecked) || (type == "all"&&this.allDoc.allDocList.length > 0&&this.allDoc.allDocList[index].isChecked)) {
                    this.previewDiagnoseSuggest.doctorList.forEach(function (key, value) {
                        if (list.customerId == key.customerId) {
                            flag = false;
                            console.log("该医生已被选");
                        }
                    })
                } else {
                    this.previewDiagnoseSuggest.doctorList.forEach(function (key, value) {
                        if (list.customerId == key.customerId) {
                            that.previewDiagnoseSuggest.doctorList.splice(value, 1);
                            console.log("该医生已删除");
                            return false;
                        }
                    })
                }
                ;
                if ((type == "match"&&this.matchDoc.matchDocList.length > 0 && flag && this.matchDoc.matchDocList[index].isChecked) || (type == "all"&&flag &&this.allDoc.allDocList[index].isChecked)) {
                    this.previewDiagnoseSuggest.doctorList.push(list);
                    console.log("该匹配医生已添加");
                }
                this.matchDocChecked(type);
            },
            matchDocChecked(type){
                let matchDocChecked = 0, allDocChecked = 0;
                if (type == "match") {
                    this.matchDoc.matchDocList.forEach(function (key, value) {
                        if (key.isChecked) {
                            matchDocChecked++
                        }
                    });
                    if (matchDocChecked == this.matchDoc.matchDocList.length) {
                        this.matchDoc.matchDocState = true;
                    } else {
                        this.matchDoc.matchDocState = false;
                    }
                } else if (type == "all") {
                    this.allDoc.allDocList.forEach(function (key, value) {
                        if (key.isChecked) {
                            allDocChecked++
                        }
                    });
                    if (allDocChecked == this.allDoc.allDocList.length) {
                        this.allDoc.allDocState = true;
                    } else {
                        this.allDoc.allDocState = false;
                    }
                }
            },
            //验证是否已选中该医生
            isChosenTheDoc(docList){
                let that = this;
                docList.forEach((value)=>{
                    let docId = value.customerId;
                    that.previewDiagnoseSuggest.doctorList.forEach((v)=>{
                        if(v.customerId == docId){
                            value.isChecked = true;
                            return false;
                        }
                    })
                })
                return docList;
            },
            //四大建议
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
            selectData(item, type){
                let that = this;
                item.isChecked = !item.isChecked;
                if (type == 1) {
                    this.addFourSuggest(item, "teachingList", "knowledgeId");
                } else if (type == 2) {
                    this.addFourSuggest(item, "disposeList", "treatmentId");
                } else if (type == 3) {
                    this.addFourSuggest(item, "examineList", "nodeId");
                } else if (type == 4) {
                    this.addFourSuggest(item, "testList", "inspectionId");
                }
                if (item.children && item.children.length > 0) {
                    item.children.forEach(function (key) {
                        key.isSelected = !key.isSelected;
                        key.isChecked = false;
                        if (type == 1) {
                            that.addFourSuggest(key, "teachingList", "knowledgeId");
                        } else if (type == 2) {
                            that.addFourSuggest(key, "disposeList", "treatmentId");
                        } else if (type == 3) {
                            that.addFourSuggest(key, "examineList", "nodeId");
                        } else if (type == 4) {
                            that.addFourSuggest(key, "testList", "inspectionId");
                        }
                    });
                }
                ;
            },
            addFourSuggest(obj, suggestName, typeId){
                let that = this, flag = true;
                if (obj.isChecked) {
                    this.previewDiagnoseSuggest[suggestName].forEach(function (key) {
                        if (obj[typeId] == key[typeId]) {
                            flag = false;
                            console.log("该选项已被选");
                        }
                    })
                } else {
                    this.previewDiagnoseSuggest[suggestName].forEach(function (key, value) {
                        if (obj[typeId] == key[typeId]) {
                            that.previewDiagnoseSuggest[suggestName].splice(value, 1);
                            console.log("该选项已删除");
                            return false;
                        }
                    })
                }
                ;
                if (flag && obj.isChecked) {
                    this.previewDiagnoseSuggest[suggestName].push(obj);
                    console.log("该选项已添加");
                }
            },
            //患教知识详情
            teachingGoBack(isBack){
                if (isBack) {
                    this.configShow = true;
                }
            },
            closeWindow(){
                this.$emit('maskerShow', false)
                this.$emit('closeWindow', true)
            },
            goBackCheck(){
                this.configShow = false;
                this.$emit("goBackCheck", true);
            },
            //预览和发送初诊建议
            previewSuggest(){
                if (!this.isLight) {
                    store.commit("setPreviewType", 1);
                    store.commit("setPreviewData", this.previewDiagnoseSuggest);
                    store.commit("setPreviewShow", true);
                }
            },
            closePreview(){
                store.commit("setPreviewShow", false);
                store.commit("setPreviewId", "");
                store.commit("setPreviewType", -1);
                store.commit("setPreviewData", {
                    diagnoseResult: {},
                    doctorList: [],
                    teachingList: [],
                    disposeList: [],
                    examineList: [],
                    testList: []
                })
            },
            sendSuggest(){
                let that = this;
                this.submitStatus = false;
                if (!this.isLight) {
                    let recommendCustomerList = [], recoveryAdviceList = [],docNames = [];
                    //推荐医生
                    if (this.previewDiagnoseSuggest.doctorList.length > 0) {
                        this.previewDiagnoseSuggest.doctorList.forEach(function (key) {
                            let recommendCause = '';
                            if (key.isTop == 1 && key.isNearest == 1) {
                                recommendCause = 2
                            } else if (key.isTop == 1) {
                                recommendCause = 1
                            } else {
                                recommendCause = 0
                            }
                            recommendCustomerList.push({
                                recommendType: 1,
                                recommendId: key.customerId,
                                recommendCause: recommendCause
                            })
                            docNames.push({
                                fullName:key.fullName,
                                company:key.company?key.company:'',
                                medicalTitle:key.medicalTitle
                            })
                        })
                    };
                    //患教知识
                    if (this.previewDiagnoseSuggest.teachingList.length > 0) {
                        this.previewDiagnoseSuggest.teachingList.forEach(function (key) {
                            recoveryAdviceList.push({
                                adviceType: 3,
                                adviceId: key.knowledgeId
                            })
                        })
                    };
                    //处置建议
                    if (this.previewDiagnoseSuggest.disposeList.length > 0) {
                        this.previewDiagnoseSuggest.disposeList.forEach(function (key) {
                            recoveryAdviceList.push({
                                adviceType: 0,
                                adviceId: key.treatmentId
                            })
                        })
                    };
                    //检查建议
                    if (this.previewDiagnoseSuggest.examineList.length > 0) {
                        this.previewDiagnoseSuggest.examineList.forEach(function (key) {
                            recoveryAdviceList.push({
                                adviceType: 1,
                                adviceId: key.nodeId
                            })
                        })
                    };
                    //检验建议
                    if (this.previewDiagnoseSuggest.testList.length > 0) {
                        this.previewDiagnoseSuggest.testList.forEach(function (key) {
                            recoveryAdviceList.push({
                                adviceType: 2,
                                adviceId: key.inspectionId
                            })
                        })
                    };
                    ajax({
                        url: XHRList.saveData,
                        method: 'POST',
                        data: that.checkData,
                        done(data){
                            if (data.responseObject.responseStatus) {
                                console.log("初步诊断保存成功");
                                that.closeWindow();
                                let diagnosisId = data.responseObject.responsePk;
                                new Promise((resolve, reject)=>{
                                    if (recommendCustomerList.length > 0) {
                                        //推荐医生保存
                                        ajax({
                                            url: XHRList.saveRecommendDoc,
                                            method: 'POST',
                                            data: {
                                                caseId: that.$store.state.caseId,
                                                patientId: that.$store.state.patientId,
                                                customerId: that.$store.state.userId,
                                                recommendCustomerList: JSON.stringify(recommendCustomerList),
                                                diagnosisId: diagnosisId,
                                                type: 1
                                            },
                                            done(data){
                                                if(data.responseObject.responseStatus){
                                                    console.log("推荐医生保存成功");
                                                    resolve("保存成功")
                                                }else{
                                                    reject("保存失败")
                                                }
                                            }
                                        })
                                    };
                                    if (recoveryAdviceList.length > 0) {
                                        //四大建议保存
                                        ajax({
                                            url: XHRList.savePreviewSuggest,
                                            method: 'POST',
                                            data: {
                                                caseId: that.$store.state.caseId,
                                                patientId: that.$store.state.patientId,
                                                customerId: that.$store.state.userId,
                                                recoveryAdviceList: JSON.stringify(recoveryAdviceList),
                                                diagnosisId: diagnosisId,
                                                type: 1
                                            },
                                            done(data){
                                                if(data.responseObject.responseStatus){
                                                    console.log("四大建议保存成功");
                                                    resolve("保存成功")
                                                }else{
                                                    reject("保存失败")
                                                }
                                            }
                                        })
                                    };
                                }).then((res)=>{

                                    if (that.previewDiagnoseSuggest.examineList.length > 0||that.previewDiagnoseSuggest.testList.length > 0){
                                        console.log("1");
                                        releasePatient({
                                            customerId: that.$store.state.userId,
                                            consultationId: that.$store.state.currentItem.consultationId,
                                            consultationState:9
                                        }).then(res => {
                                            let currentItem = that.$store.state.currentItem;
                                            currentItem.consultationState = 9;
                                            that.$store.commit('setCurrentItem',currentItem);
                                        })
                                    }else{
                                        console.log("2");
                                        releasePatient({
                                            customerId: that.$store.state.userId,
                                            consultationId: that.$store.state.currentItem.consultationId,
                                            consultationState:10
                                        }).then(res => {
                                            let currentItem = that.$store.state.currentItem;
                                            currentItem.consultationState = 10;
                                            that.$store.commit('setCurrentItem',currentItem);
                                        })
                                    }
                                    console.log(res);
                                    //发送IM
                                    let  inquiryResult = that.$store.state.currentItem,
                                        caseMajorName = that.checkData.majorName,
                                        caseIllnessName = (that.checkData.illnessName=="暂不确定"?"":that.checkData.illnessName),
                                        caseOperationName = (that.checkData.operationName=="暂不确定"?"":that.checkData.operationName);
                                    inquiryResult.diagnosisContent = caseMajorName+' '+caseIllnessName+' '+caseOperationName;
//                                inquiryResult.docNames = docNames.length>0?docNames.substring(0,docNames.length-1):docNames;
//                                console.log(inquiryResult);
                                    store.commit('setCurrentItem',inquiryResult);



                                    let nowTime = new Date(),
                                        createTime = (nowTime.getFullYear() + '.' + (nowTime.getMonth() + 1 < 10 ? "0" + (nowTime.getMonth() + 1) : nowTime.getMonth() + 1) + '.' + (nowTime.getDate() < 10 ? "0" + nowTime.getDate() : nowTime.getDate())).replace(/-/g, ".");
                                    that.closePreview();
                                    store.commit("previewSuggestionSender", {
                                        flag: true,
                                        data: {
                                            "illnessName": that.checkData.illnessName ? that.checkData.illnessName : "暂不确定",
                                            "customerId": that.$store.state.userId,
                                            "caseId": that.$store.state.caseId,
                                            "patientName": that.$store.state.patientName,
                                            "createTime": createTime,
                                            "diagnosisId": diagnosisId,
                                            "docNames": docNames
                                        }
                                    });
                                    console.log("发送IM成功");
                                }).catch((err)=>{
                                    console.log(err);
                                })
                            }
                        }
                    })
                }
            },
            matchCurrent(index){
                if(this.matchCurrentIndex == index){
                    this.matchCurrentIndex = -1;
                }else{
                    this.matchCurrentIndex = index ;
                }


            },
            allCurrent(index){
                if(this.allCurrentIndex == index){
                    this.allCurrentIndex = -1;
                }else{
                    this.allCurrentIndex = index ;
                }


            },
            closeSelect(ev){
                this.provinceFlag = false;
            }
        },
        computed: {},
        watch: {
            previewDiagnoseSuggest: {
                handler(){
                    if (this.previewDiagnoseSuggest.doctorList.length > 0 || this.previewDiagnoseSuggest.teachingList.length > 0 || this.previewDiagnoseSuggest.disposeList.length > 0 || this.previewDiagnoseSuggest.examineList.length > 0 || this.previewDiagnoseSuggest.testList.length > 0) {
                        this.isLight = false;
                    } else {
                        this.isLight = true;
                    }
                },
                deep: true
            }
        },
        components: {
            teachingDetail,
            dignosiAddress
        },
        props: {
            maskerShow: {
                type: Boolean
            },
            checkData: {
                type: Object
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "../../scss/base";

    .config-suggestion {
        .config-suggestion-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            background-color: #fff;
            .config-suggestion-title {
                position: relative;
                padding: 20px 40px;
                background: #D9DFEC;
                text-align: center;
                color: #222;
                font-size: 18px;
                & > article {
                    h2 {
                        font-size: 18px;
                        color: #222;
                    }
                    p {
                        color: #6b748c;
                        font-size: 13px;
                        margin-top: 8px;
                    }
                }
                .jump-box-add-term {
                    padding: 7px 15px;
                    background-color: #fff;
                    border-radius: 4px;
                    position: absolute;
                    top: 50%;
                    right: 130px;
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
                .jump-box-add-send {
                    padding: 7px 25px;
                    background-color: #7A8EC1;
                    color: #ffffff;
                    border-radius: 4px;
                    position: absolute;
                    right: 40px;
                    top: 50%;
                    cursor: pointer;
                    transform: translateY(-50%);
                    &.forbid {
                        background: #ECEFF6;
                        color: #CCCCCC;
                    }
                }
            }
            .window-close {
                position: absolute;
                right: -34px;
                cursor: pointer;
            }
            .config-suggestion-inner {
                overflow-y: scroll;
                height: 520px;
            }

            .config-suggestion-item {
                margin-bottom: 0;
                margin-top: 20px;
            }
            .check-project-item {
                position: relative;
            }
        }
    }

    .config-suggestion-item {
        margin: 40px 0;
        box-sizing: border-box;
        &-title {
            font-size: 17px;
            color: #555;
            padding: 0 40px;
            margin: 20px 0;
            & > span {
                display: inline-block;
                vertical-align: middle;
                margin-left: 4px;
                font-weight: bold;
            }
            &:before {
                content: '';
                display: inline-block;
                vertical-align: middle;
                width: 2px;
                height: 12px;
                background-color: #7A8EC1;

            }
        }
    }

    .patient-message {
        padding: 20px 40px;
        &-img {
            @include circle(88px);
            display: inline-block;
            vertical-align: top;
            & > img {
                @include circle(88px);
                vertical-align: top;
            }
        }
        &-content {
            display: inline-block;
            vertical-align: top;
            margin-left: 20px;
            width: 80%;
            & > h3 {
                font-size: 22px;
                color: #222222;
            }
            .disease-base-msg {
                margin-top: 28px;
                margin-bottom: 20px;
                span {
                    vertical-align: middle;
                }
                & > article {
                    display: inline-block;
                    vertical-align: top;
                    line-height: 1.5;
                    font-size: 16px;
                    color: #555;
                    width: 93%;
                    li {
                        display: inline;
                        &:after {
                            display: inline-block;
                            content: '';
                            width: 1px;
                            height: 16px;
                            vertical-align: middle;
                            background: #ededed;
                            margin: 0 20px;
                        }
                        &:first-child {
                            padding-left: 0;
                        }
                        &:last-child:after {
                            display: none;
                        }
                    }
                }
            }
            .time {
                font-size: 14px;
                color: #939BAB;
                & > span {
                    vertical-align: middle;
                }
            }
        }
    }

    .check-project {
        &-title {
            margin: 40px 0 20px 0;
            font-size: 15px;
            color: #555555;
            padding-left: 40px;
        }
        &-item {
            position: relative;
            font-size: 16px;
            color: #222;
            padding: 18px 0 18px 40px;
            cursor: pointer;
            //&:hover > span {
            //  color: #7a8ec1;
            //}
            &.isHasOption {
                padding: 10px 0 10px 45px;
                color: #808080;
            }
            &.icon-upArrow {
                color: #7A8EC1;
            }
            &.icon-upArrow-big {
                color: #7A8EC1;
            }
        }
        &-content {
            background: #F9F9F9;
            padding-left: 16px;
            display: none;
        }
        &-content.on {
            display: block;
        }

        .icon-downArrow-big {
            &:after {
                position: absolute;
                right: 40px;

            }
        }
        .icon-downArrow {
            position: relative;
            &:after {
                position: absolute;
                right: 40px;
            }
        }

        .icon-upArrow-big {
            position: relative;
            &:after {
                position: absolute;
                right: 40px;

            }
        }
        .icon-upArrow {
            position: relative;
            &:after {
                position: absolute;
                right: 40px;
            }
        }
    }

    .setting-form-item-sex-selector {
        font-size: 0;
        display: inline-block;
        vertical-align: bottom;
        .setting-form-item-sex {
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
            font-size: 14px;
            margin-right: 12px;
            & > span {
                display: inline-block;
                vertical-align: middle;
            }
        }
        .sex-selector {
            display: inline-block;
            vertical-align: middle;
            @include circle(15px, #f4f6fb);
            margin-right: 15px;
            &-on {
                background-color: #4fc8d5;
            }
        }

    }

    .setting-form-btn {
        padding-left: 90px;
        width: 100%;
        box-sizing: border-box;
        & > button {
            width: 100%;
        }
    }

    .icon-select-normal {
        & > span {
            vertical-align: middle;
            padding-left: 8px;

        }
        .icon-choice {
            display: inline-block;
            &:before {
                content: '';
                display: inline-block;
                vertical-align: middle;
                width: 14px;
                height: 14px;
                background: url("../../assets/img00/check/choose_sel_small.png");
                background-size: 100% 100%;
            }
            &.active {
                &:before {
                    background: url("../../assets/img00/check/choose_nor_small.png");
                }
            }
        }

        &.disable {
            color: #ccc !important;
        }
    }

    .check-result-content {
        padding: 40px;
        box-sizing: border-box;
        min-height: 400px;
        .check-result-info {
            font-size: 16px;
            color: #222222;
            letter-spacing: 0;
            line-height: 16px;
            ul {

                li {
                    margin-bottom: 40px;

                }
            }

        }
    }

    .btn-group {
        padding: 0 40px 40px;
        box-sizing: border-box;
    }

    .config-suggestion-tips-text {
        margin: 60px 0 50px;
        text-align: center;
        font-size: 14px;
        color: #AAA;
    }

    .config-suggestion-back {
        position: absolute;
        left: 40px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        & > span {
            font-size: 16px;
            color: #555555;
            vertical-align: middle;
            margin-left: 5px;
        }
    }

    .check-project-result-inner {
        display: none;
    }

    .config-suggestion-tabsBox {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }

    .config-suggestion-tabs {
        display: flex;
        border: 1px solid #E1E2E7;
        border-radius: 4px;
        box-sizing: border-box;
        overflow: hidden;
        &-item {
            padding: 10px 20px;
            background-color: #fff;
            box-sizing: border-box;
            border-right: 1px solid #E1E2E7;
            cursor: pointer;
            color: #808080;
            font-size: 14px;
            &:nth-last-child(1) {
                border-right: none;
            }
            &.active {
                color: #fff;
                background: #7A8EC1;
            }
        }
    }

    .config-suggestion-select {
        font-size: 0;
        padding-left: 40px;
        cursor: pointer;
        & > span {
            font-size: 16px;
            color: #909090;
            vertical-align: middle;
            line-height: 16px;
        }
        &.active {
            &.icon-select-small:before {
                background: url("../../assets/img00/check/choose_nor_small.png") no-repeat;
            }
        }
    }

    .doctor-message-item {
        cursor: pointer;
        position: relative;
        .doctor-message-img {
            margin-left: 30px;
        }
        &.icon-select-big:before {
            position: absolute;
            top: 50%;
            transform: translateY(-50%)

        }
    }

    .config-suggestion-search {
        margin-right: 40px;
        & > div {
            float: right;
            position: relative;
            & > input {
                border: 1px solid #ECEFF6;
                border-radius: 4px;
                padding: 10px 14px;
                width: 370px;
            }
        }
    }

    .icon-downArrow-big {
        &:after {
            position: absolute;
            right: 40px;
            transition: all 0.2s linear;
        }
        &.selected {
            color: #7a8ec1;
            &:after {
                transform: rotate(180deg);
            }
            & > span {
                color: #7a8ec1;
            }
        }
    }

    .check-project-second-box {
        padding-left: 56px;
        margin-left: -40px;
        background: #F9F9F9;
        overflow: hidden;
        margin-top: 14px;
        display: none;
        &.active {
            display: block;
        }
        .icon-downArrow {
            &:after {
                position: absolute;
                right: 40px;
                top: 4px;
                transition: all 0.2s linear;
            }
            &.selected {
                &:after {
                    transform: rotate(180deg);
                }
                & > span {
                    color: #7a8ec1;
                }
            }
        }
        .check-project-second-item {
            margin: 20px 0;
            position: relative;

            & > span {
                vertical-align: middle;
                z-index: 2;
                background: #f9f9f9;
                position: relative;
                padding-right: 14px;
            }
            &.select-element {
                font-size: 14px;
                color: #808080;
                .icon-detail {
                    position: absolute;
                    right: 40px;
                    & > span {
                        font-size: 13px;
                        color: #939BAB;
                    }
                }
                &.active {
                    & > .icon-select-big:before {
                        background: url(../../assets/img00/check/choose_nor_small.png) no-repeat;
                    }

                    .select-element {
                        font-size: 13px;
                        span {
                            color: #ccc;
                        }
                        cursor: default;
                    }
                }
            }
        }
    }

    .doctor-message {
        .no-mate-doc {
            margin-top: 130px;
            text-align: center;
            font-size: 14px;
            color: #AAAAAA;
        }
    }

    .doc-filter-search-box {
        position: relative;
        margin: 16px 40px 35px;
        padding: 12px 17px;
        background: #F9F9F9;
        border-radius: 4px;
        &.hide {
            display: none;
        }
        .doc-filter-box {
            @include clearfix();
            height: auto;
            margin-bottom: 12px;
            &.quHighly {
                height: 50px;
                overflow: hidden;
            }
            li {
                float: left;
                cursor: pointer;
                margin-right: 5px;
                padding: 12px 11px;
                color: #999999;
                font-size: 15px;
                &.on {
                    background: #E2E7F2;
                    color: #7A8EC1;
                    border-radius: 4px;
                }
            }
        }
        .viewMoreBox {
            cursor: pointer;
            display: block;
            width: 18px;
            height: 18px;
            position: absolute;
            right: 10px;
            top: 23px;
            z-index: 2;
            .viewMore {
                cursor: pointer;
                display: inline-block;
                vertical-align: middle;
                width: 18px;
                height: 4px;
                background: url("../../assets/img00/check/dot_more.png") no-repeat;
                background-size: 100% 100%;
                &.rotate {
                    transform: rotate(90deg);
                }
            }
        }
        .doc-search-box {
            @include clearfix();
            .doc-search {
                float: left;
                width: 200px;
                height: 26px;
                padding-right: 30px;
                /*margin-right: 16px;*/
                border: 1px solid #E3E3E3;
                border-radius: 4px;
                text-indent: 10px;
                background: url("../../assets/img00/check/search_gray.png") 97% center no-repeat #fff;
                font-size: 13px;
                color: #555555;
                &.on {
                    border: 1px solid #B2BDD8;
                    background: url("../../assets/img00/check/search_blue.png") 97% center no-repeat #fff;
                }
            }
            .doc-search-btn {
                /*float: left;*/
                display:inline-block;
                width: 52px;
                line-height: 26px;
                text-align: center;
                color: #BDBDBD;
                font-size: 12px;
                background: #EDEDED;
                border-radius: 4px;
                &.on {
                    cursor: pointer;
                    background: #E2E7F2;
                    color: #7A8EC1;
                }
            }
            .doc-type {
                margin-left: 9px;
                width: 116px;
                height: 28px;
                background: #FFFFFF;
                border: 1px solid #E2E2E2;
                border-radius: 4px;
            }
            .userlist-sortType{
                height:28px;
                width:116px;
                margin-left:9px;
                line-height: 28px;
                padding:0 5px;
                box-sizing: border-box;

                .icon-downArrow{
                    &:after{
                        margin:0;
                        padding:0;
                    }
                }
            }
        }
    }

    .mate-and-all {
        margin-top: 30px;
        font-size: 16px;
        color: #AAAAAA;
        text-align: center;
        li {
            cursor: pointer;
            display: inline-block;
            padding: 0 15px;
            &.on {
                color: #7A8EC1;
            }
        }
    }

    .doctor-message-item {
        display: flex;
        padding: 30px 40px;
        //&:hover{
        //  box-shadow: 0px 0px 10px 0px rgba(179,205,199,0.35);
        //}
        &.active {
            &:before {
                background: url(../../assets/img00/check/choose_nor_small.png) no-repeat;
            }
        }
    }

    .doctor-message-img {
        @include circle(50px);
        flex-shrink: 0;
        margin-right: 16px;
        & > img {
            width: 100%;
            height: 100%;
            vertical-align: top;
            border-radius: 50%;
        }
    }

    .doctor-message-content {
        width: 100%;
        position: relative;
        .high-light-search-text {
            display:inline;
            color: #252525;
            font-weight: bold;
        }
    }

    .doctor-message-content-head {
        font-size: 0;
        & > h4 {
            font-size: 18px;
            display: inline-block;
            vertical-align: middle;
            color: #222222;
            margin-right: 18px;
            max-width: 365px;
            line-height: 1.2;
        }

        & > .rate {
            font-size: 15px;
            color: #555555;
            display: inline-block;
            vertical-align: middle;
        }
        & > .netstat {
            font-size: 15px;
            color: #00BEAF;
            display: inline-block;
            vertical-align: middle;
            margin: 0 14px;
            &.rest {
                color: #cccccc;
            }
        }
        .doctor-message-tags {
            display: inline-block;
            vertical-align: middle;
            .tags {
                background: #EEF6FF;
                border-radius: 2px;
                font-size: 12px;
                color: #8DAED9;
                display: inline-block;
                padding: 4px 8px;
                vertical-align: middle;
                margin-right: 8px;
            }
        }
    }

    .doctor-message-hospital {
        font-size: 14px;
        color: #555;
        margin-top: 10px;
        margin-bottom: 16px;
        .medical, .hospital {
            margin-right: 16px;
        }
    }

    .doctor-message-goodAt {
        margin: 16px 0 0 0;
        color: #909090;
        font-size: 14px;
        max-width: 500px;
        line-height: 1.5;
        span{
            display:inline-block;
            width:400px;
            height:20px;
            overflow: hidden;
            vertical-align: top;
            &.on{
                height:auto;
            }
        }
    }
    .administrator-message{
        margin: 16px 0 0 0;
        color: #000;
        font-size: 14px;
        max-width: 500px;
        line-height: 1.5;
        font-weight: 600;
        span{
            display:inline-block;
            width:400px;
            vertical-align: top;
            &.on{
                height:auto;
            }
        }
    }


    .viewMoreBox {
        width:430px;
        cursor: pointer;
        display: block;
        font-size: 14px;
        color: #6B748C;
        text-align:right;
    }

    .doctor-message-num {
        margin: 16px 0;
        font-size: 0;
        & > span {
            margin-right: 40px;

        }
        & > .price {
            font-size: 14px;
            color: #909090;
            em {
                color: #F23E34;
                font-style: normal;
                font-weight: bolder;
            }
        }
        & > .askNum {
            color: #909090;
            font-size: 14px;

        }
        & > .lastNum {
            font-size: 14px;
            color: #909090;
            em {
                color: #00BEAF;
                font-style: normal;
                font-weight: bold;
            }
        }
    }

    .doctor-message-consult {
        border: 1px solid #A1AFD3;
        border-radius: 4px;
        height: 30px;
        padding: 0 17px;
        font-size: 13px;
        color: #7A8EC1;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -15px;
        cursor: pointer;
    }

    //分页
    .page-container {
        padding-bottom: 30px;
        .pagination {
            height: 36px;
            margin-top: 45px;
            padding: 0;
            .pages {
                text-align: center;
            }
            .pgEmpty {
                color: #eee;
                cursor: default;
            }
            .pgNext {
                width: 50px;
            }
            li {
                display: inline-block;
                width: 36px;
                height: 36px;
                line-height: 36px;
                margin-right: 8px;
                text-align: center;
                color: grey;
                background-color: #fff;
                font-size: 14px;
                overflow: hidden;
                padding: 0;
                cursor: pointer;
            }
            .pgCurrent {
                height: 36px;
                width: 36px;
                background: #3d84c6;
                color: #fff;
            }
        }
    }
</style>
