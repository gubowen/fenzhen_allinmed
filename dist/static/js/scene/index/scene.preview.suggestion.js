/**
 * @Desc：初诊建议预览
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang/jukun on 2017/3/15
 */
define([
	"text!checkSuggestionTemplate",
	"toJSON",
	"searchSuggestion"
],function (template,toJSON,searchSuggestion) {
   var container={
       init:function(obj){
           var t = this;
           t.previewTemplate=template;
           t.templateUrl();
           t.addHtml(obj);
	       t.previewSended();
       },
	   config:{

	   },
       XHRList:{
           getPreviewSuggest:"/call/patient/case/diagnosis/v1/getMapById/",//预览初诊建议
	       getRecommendDoctor:"/call/patient/recommend/v1/getMapList/"//预览推荐医生
           //savePreviewSuggest:"/call/patient/recovery/advice/v1/create/"//保存初诊建议
       },
       templateList:{
	       //患者信息
	       initialDiagnoseHtml:function(){
		       var date = new Date(),
			       caseTime = date.getFullYear()+'年'+(date.getMonth()+1<10?"0"+(date.getMonth()+1):date.getMonth()+1)+'月'+(date.getDate()<10?"0"+date.getDate():date.getDate())+'日';
		       var html= '<figure class="patient-message-img">'+
			       '<img src="'+$(".userlist-mainList-item.active").attr("data-logo")+'" alt="">'+
			       '</figure>'+
			       '<figcaption class="patient-message-content">'+
			       '<h3>'+$(".userlist-mainList-item.active").attr("data-name")+'</h3>'+
			       '<article class="disease-base-msg icon-disease-message">'+
			       '<article>'+
			       '<ul class="majorIllnessOperation" data-majorname="'+searchSuggestion.sendData.majorName+'" data-illnessname="'+searchSuggestion.sendData.illnessName+'" data-operationname="'+searchSuggestion.sendData.operationName+'">'+
			       (function(){
				       return '<li><span>患病专科：</span><span>'+searchSuggestion.sendData.majorName+'</span></li>'+
					       (function(){
						       if(searchSuggestion.sendData.illnessName == "" || searchSuggestion.sendData.illnessName == "暂不确定"){
							       return '';
						       }else{
							       return '<li><span>所患疾病：</span><span class="caseIllnessName">'+searchSuggestion.sendData.illnessName+'</span></li>'
						       }
					       })()+
					       (function(){
						       if(searchSuggestion.sendData.operationName=="" || searchSuggestion.sendData.operationName=="暂不确定"){
							       return '';
						       }else{
							       return '<li><span>手术建议：</span><span class="operationSuggestName">'+searchSuggestion.sendData.operationName+'</span></li>';
						       }
					       })()
			       })()+
			       '</ul>'+
			       '</article>'+
			       '</article>'+
			       '<p class="time icon-disease-time"><span>'+caseTime+'</span></p>'+
			       '</figcaption>'
		       return html;
	       },
	       //推荐医生
	       recommendDoctorHtml:function(data){
		       var realData = data;

		       var html = '<section class="doctor-message-item">'+
			       '<figure class="doctor-message-img">'+
			       '<img src="'+(realData.logoUrl?realData.logoUrl:'/image/img00/common/default_logo@3x.png' ) +'" alt="">'+
			       '</figure>'+
			       '<figcaption class="doctor-message-content">'+
			       '<header class="doctor-message-content-head">'+
			       '<h4>' + realData.fullName + '</h4>'+
			       '<span class="netstat">'+(parseInt(realData.adviceStatus)===1?'在线':'休息')+'</span>'+
			       '<figure class="doctor-message-tags">'+
			       (parseInt(realData.isTop) === 1 ? '<span class="tags">全国TOP10骨科医院</span>' : '') +
			       (parseInt(realData.isNearest) === 1 ? '<span class="tags">距离最近</span>' : '') +
                   (parseInt(realData.isFreeTimes) !== 0 ? '<span class="tags" style="background: #FFF1D4;color: #EB9E00;">首次问诊免费</span>' : '') +
			       '</figure>'+
			       '</header>'+
			       '<article class="doctor-message-hospital">'+
			       '<span class="hos-ddress">'+(realData.province?(realData.province + '&nbsp'):"") + (realData.city?(realData.city+ '&nbsp'):"") + (realData.district?realData.district:"") +'</span>'+
			       '<span class="hospital">'+realData.company +'</span>'+
			       '<span class="medical">'+realData.medicalTitle +'</span>'+
			       '</article>'+
			       '<article class="doctor-message-goodAt">擅长:' + realData.illnessNameList +'</article>'+
			       '<article class="doctor-message-num">'+
			       '<span class="price"><em>¥' + realData.generalPrice + '</em>/' + realData.generalTimes + '次起</span>'+
			       '<span class="lastNum">仅剩<em>' + realData.adviceNum + '</em>个名额</span>'+
			       '</article>'+
			       '<button class="doctor-message-consult">立即咨询</button>'+
			       '</figcaption>'+
			       '</section>'
		       return html;
	       },
	       //检查检验、处置建议、药物建议、手术建议
	       commonHtml:function(controller){
		       var html = '<article class="check-project-item">'+$(controller).children("span").text()+'</article>';
		       return html;
	       },
	       //患教知识
	       teachingKnowledgeHtml:function(controller){
		       var html = '<section class="disease-teach-item">'+
			       '<figcaption class="disease-teach-content">'+
			       '<h4>'+$(controller).children("span").text()+'</h4>'+
			       //'<article></article>'+
			       //'<p class="release-time">发表于<span>'+$(controller).children("span").data("time")+'</span></p>'+
			       '</figcaption>'+
			       '</section>';
		       return html;
	       },
	       //底部提示
	       bottomHint:function(){
		       return '<footer class="check-suggestion-tips-text"><span>温馨提示：由于不能面诊，医生无法全面了解病情，初诊建议仅供参考，如有需要您可预约医生进行面诊。</span></footer>'
	       }
       },
       templateUrl:function () {
           $("[data-template='tpl-inner']").append(this.previewTemplate);
           $(".check-suggestion").show();
           setTimeout(function () {
               $(".check-suggestion").addClass("on");
           });
           $(".config-suggestion").removeClass("on");

       },
       addHtml:function(obj){
           var t = this;

	       $(".patient-message").append(t.templateList.initialDiagnoseHtml());
	       //推荐医生
	       if($(".doctor-message-item.active").length>0){
		       $(".result_recommendDoctor").show();
		       $.each(obj.data,function(index,element){
			       $(".result_recommendDoctor .doctor-message").append(t.templateList.recommendDoctorHtml(element)).show();
		       });
	       }
	       //检查检验
	       if($(".examineSuggest .select-element.active").length>0 || $(".testSuggest .select-element.active").length>0){
		       $(".examineSuggest .select-element.active,.testSuggest .select-element.active").each(function(index,element){
			       $(".result_examineTestSuggest").show();
			       $(".result_examineTestSuggest .check-project-list").append(t.templateList.commonHtml(element));
		       })
	       }
	       //患教知识
	       if($(".teachingKnowledge .select-element.active").length>0){
		       $(".teachingKnowledge .select-element.active").each(function(index,element){
			       $(".result_teachingKnowledge").show();
			       $(".result_teachingKnowledge .disease-teach-box").append(t.templateList.teachingKnowledgeHtml(element));
		       })
	       }
	       //处置建议
	       if($(".disposeSuggest .select-element.active").length>0){
		       $(".disposeSuggest .select-element.active").each(function(index,element){
			       $(".result_disposeSuggest").show();
			       $(".result_disposeSuggest .check-project-list").append(t.templateList.commonHtml(element))
		       })
	       }
	       //手术建议
	       if(searchSuggestion.sendData.operationName){
		       $(".result_operationSuggest").show().find(".check-project-list").append('<article class="check-project-item">'+searchSuggestion.sendData.operationName+'</article>')
	       }
	       $(".check-suggestion .check-suggestion-inner").append(t.templateList.bottomHint());
	       t.closePreview();
       },
       closePreview:function () {
           $(".btn-border-small-pvw").on("click",function(){
               $(".check-suggestion").remove();
               $(".config-suggestion").show().addClass("on");
           })
	       $(".window-close").on("click",function(){
		       $(".check-suggestion").remove();
		       $(".infoBox-tips").addClass("show");
		       $(".mask-background").show();
	       })
       },
	   clickPreviewFirstVisitSuggest:function(id){
		   var t = this;
		   $("[data-template='tpl-inner']").append(template);
		   $(".btn-border-small-pvw,.btn-primary-small-pvw").remove();
           $(".check-suggestion").show().find(".window-close").show();
		   setTimeout(function () {
               $(".check-suggestion").addClass("on")
           });

		   $.ajax({
		       url: t.XHRList.getPreviewSuggest,
		       dataType: 'json',
			   //async: false,
			   type:'post',
		       timeout: 10000,
		       data: {
		           paramJson: $.toJSON({
		               caseId:localStorage.getItem('caseId'),
			           diagnosisId:id,
		               isValid:1,
		               firstResult:0,
		               maxResult:1,
		               sortType:1
		           })
		       },
			   beforeSend:function(){
				   common.loading.show();
			   },
		       success:function(data){
		           if(data.responseObject.responseData.dataList){
		               var items = data.responseObject.responseData.dataList[0],fvHtml = '';
		               if(items.caseDiagnosis.createTime){
		                   var caseTime = items.caseDiagnosis.createTime.split(" ")[0],
		                       _caseTime =caseTime.split('-')[0] + '年' + caseTime.split('-')[1] + '月' + caseTime.split('-')[2] + '日'
		               }
		               fvHtml = '<section class="check-suggestion-item">'+
		                   '<header class="check-suggestion-item-title">'+
		                   '<span>初步诊断</span>'+
		                   '</header>'+
		                   '<section class="patient-message">'+
		                   '<figure class="patient-message-img">'+
		                   '<img src="'+$(".userlist-mainList-item.active").attr("data-logo")+'" alt="">'+
		                   '</figure>'+
		                   '<figcaption class="patient-message-content">'+
		                   '<h3>'+$(".userlist-mainList-item.active").attr("data-name")+'</h3>'+
		                   '<article class="disease-base-msg icon-disease-message">'+
		                   '<article>'+
			               '<ul>'+
			               (function(){
				               return '<li><span>患病专科：</span><span>'+items.caseDiagnosis.majorName+'</span></li>'+
					               (function(){
						               if(items.caseDiagnosis.illnessName == "" || items.caseDiagnosis.illnessName == "暂不确定"){
							               return '';
						               }else{
							               return '<li><span>所患疾病：</span><span class="caseIllnessName">'+items.caseDiagnosis.illnessName+'</span></li>'
						               }
					               })()+
					               (function(){
						               if(items.caseDiagnosis.operationName=="" || items.caseDiagnosis.operationName=="暂不确定"){
							               return '';
						               }else{
							               return '<li><span>手术建议：</span><span>'+items.caseDiagnosis.operationName+'</span></li>';
						               }
					               })()
			               })()+
			               '</ul>'+
		                   '</article>'+
		                   '</article>'+
		                   '<p class="time icon-disease-time" data-time="'+caseTime.replace(/-/g,".")+'"><span>'+_caseTime+'</span></p>'+
		                   '</figcaption>'+
		                   '</section>'+
		                   '</section>'+
		                   '<section class="check-suggestion-item result_recommendDoctor" style="display:none;">'+
		                   '<header class="check-suggestion-item-title">'+
		                   '<span>推荐医生</span>'+
		                   '</header>'+
		                   '<header class="check-project-title">'+
		                   '<span>以下医生最擅长解决您的问题。</span>'+
		                   '</header>'+
		                   '<section class="doctor-message">'+
		                   '</section>'+
		                   '</section>'+
		                   (function(){
		                        if((items.checkList&&items.checkList.length>0) || (items.inspectionList&&items.inspectionList.length>0)){
		                            var checkInspectHtml = '<section class="check-suggestion-item result_examineTestSuggest">'+
		                                '<header class="check-suggestion-item-title">'+
		                                '<span>建议检查/检验</span>'+
		                                '</header>'+
		                                '<header class="check-project-title">'+
		                                '<span>您还可进行以下检查，并上传检查资料，唯医会诊将为您定制更详细建议。</span>'+
		                                '</header>'+
		                                '<section class="check-project">'+
		                                '<section class="check-project-list">'+
		                                (function(){
		                                    var htmlList='';
		                                    if(items.checkList.length>0){
		                                        $.each(items.checkList,function(index,element){
		                                            htmlList += '<article class="check-project-item">'+element.checkName+'</article>'
		                                        })
		                                    }
		                                    if(items.inspectionList.length>0){
		                                        $.each(items.inspectionList,function(inde,elemen){
		                                            htmlList += '<article class="check-project-item">'+elemen.inspectionName+'</article>'
		                                        })
		                                    }
		                                    return htmlList
		                                })()+
		                                '</section>'+
		                                '</section>'+
		                                '</section>'
		                            return checkInspectHtml
		                        }else{
		                            return '';
		                        }
		                   })()+
		                   (function(){
		                       if(items.knowledgeList&&items.knowledgeList.length>0){
		                           var knowledgeHtml = '<section class="check-suggestion-item result_examineTestSuggest">'+
		                               '<header class="check-suggestion-item-title">'+
		                               '<span>患教知识</span>'+
		                               '</header>'+
		                               '<section class="disease-teach-box">'+
		                               (function(){
		                                   var htmlList='';
		                                   $.each(items.knowledgeList,function(index,element){
		                                       var isHasPic = '';
		                                       if(element.knowledgeAttUrl){
		                                           isHasPic = '<figure class="disease-teach-img"><img src="'+element.knowledgeAttUrl+'"></figure>'
		                                       }
		                                       htmlList += '<section class="disease-teach-item">'+
		                                           isHasPic+
		                                           '<figcaption class="disease-teach-content">'+
		                                           '<h4>'+element.knowledgeName+'</h4>'+
		                                           //'<p class="release-time">发表于<span>'+element.createTime.split(" ")[0].replace(".","-")+'</span></p>'+
		                                           '</figcaption>'+
		                                           '</section>'
		                                   });
		                                   return htmlList
		                               })()+
		                               '</section>'+
		                               '</section>';
		                           return knowledgeHtml
		                       }else{
		                           return '';
		                       }
		                   })()+
		                   (function(){
		                       if(items.treatmentList&&items.treatmentList.length>0){
		                           var treatmentHtml = '<section class="check-suggestion-item result_disposeSuggest">'+
		                               '<header class="check-suggestion-item-title">'+
		                               '<span>处置建议</span>'+
		                               '</header>'+
		                               '<header class="check-project-title">'+
		                               '<span>请在医生指导下合理进行，咨询医生</span>'+
		                               '</header>'+
		                               '<section class="check-project">'+
		                               '<section class="check-project-list">'+
		                               (function(){
		                                   var htmlList='';
		                                   $.each(items.treatmentList,function(index,element){
		                                       htmlList += '<article class="check-project-item">'+element.treatmentName+'</article>'
		                                   });
		                                   return htmlList
		                               })()+
		                               '</section>'+
		                               '</section>'+
		                               '</section>';
		                           return treatmentHtml
		                       }else{
		                           return '';
		                       }
		                   })()+
		                   '<footer class="check-suggestion-tips-text">'+
		                   '<span>温馨提示：由于不能面诊，医生无法全面了解病情，初诊建议仅供参考，如有需要您可预约医生进行面诊。</span>'+
		                   '</footer>';
		               $(".check-suggestion .check-suggestion-inner").html(fvHtml);
			           t.getRecommendDoctor(id);
			           common.loading.hide();
			           t.closePreview();
		           }else{

		           }
		       }
		   })
	   },
	   getRecommendDoctor:function(id) {
		   var t = this;
		   var recommendHtml = '';
		   $.ajax({
			   url: t.XHRList.getRecommendDoctor,
			   dataType: 'json',
			   async: false,
			   type:'post',
			   timeout: 10000,
			   data: {
				   paramJson: $.toJSON({
					   diagnosisId: id,
					   isValid: 1,
					   firstResult: 0,
					   maxResult: 9999,
					   sortType: 1,
					   caseId:localStorage.getItem("caseId")
				   })
			   },
			   success: function (data) {
				   if(data.responseObject.responseData.dataList){
                       $(".result_recommendDoctor").show();
					   var items = data.responseObject.responseData.dataList;
					   $.each(items,function(index,element){
						   //recommendHtml += t.templateList.recommendDoctorHtml(element,"1");
						   $(".result_recommendDoctor .doctor-message").show().append(t.templateList.recommendDoctorHtml(element));
					   })
				   }
			   }
		   });
		   //return recommendHtml;
	   },
	   //展示初诊建议
	   previewSended:function () {
		   var t = this;
		   $(".main-inner").off("click").on("click",".preview-suggestion-content",function () {
			   var id = $(this).attr("data-id");
			   $(".infoBox-tips").removeClass("show");
			   $(".mask-background").hide();
			   t.clickPreviewFirstVisitSuggest(id);
		   })
	   }
   };
   return container;
});