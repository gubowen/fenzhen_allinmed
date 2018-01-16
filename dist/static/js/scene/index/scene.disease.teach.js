/**
 * @Desc：患教建议
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang/wangjingrong  on 2017/3/20
 */
define(["text!diseaseTeachTemplate"],function (template) {
    var container={
        init:function (obj) {
            var t = this;
            t.template=template;
            $(".disease-teach-detail").remove();
            t.templateUrl();
            t.addHtml(obj);
            t.backToLast();
        },
        templateList:{

        },
        XHRList:{
            getTeachingDetail:"/call/comm/data/knowledge/content/v1/getMapById/"
        },
        templateUrl:function () {
            $("[data-template='tpl-inner']").append(this.template);
            $(".disease-teach-detail").show();

            setTimeout(function () {
                $(".disease-teach-detail").addClass("on");
            });
        },
        addHtml:function(obj){
            var t = this;
            $.ajax({
                url: t.XHRList.getTeachingDetail,
                dataType: 'json',
                type:'post',
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        isValid:1,
                        firstResult:0,
                        maxResult:999,
                        knowledgeId:obj.knowledgeId
                    })
                },
                beforeSend:function(){
                    common.loading.show()
                },
                success:function(data){
                    if(data.responseObject.responseData.dataList){
                        var items = data.responseObject.responseData.dataList[0],
                            createTime = items.createTime.split(" ")[0];
                        var html='<header class="disease-detail-title">'+
                            '<h2>'+obj.knowledgeTitle+'</h2>'+
                            //'<article>'+
                            //'<p><span>源 /</span>唯医数据库</p>'+
                            //'<p><span>发布于：</span>'+createTime+'</p>'+
                            //'</article>'+
                            '</header>'+
                            '<section class="tc-articleMain">'+
                            items.knowledgeContent+
                            '</section>'+
                            '<footer class="disease-detail-footer">'+
                            '<p>©著作权归作者所有</p>'+
                            '</footer>';
                        $(".disease-teach-detail .disease-detail-content").html(html);
                        common.loading.hide()
                    }else{

                    }
                },
                error:function(){

                }
            })
        },
        backToLast:function () {
            $("#ev-back-suggestion").on("click",function () {
                $(".disease-teach-detail").removeClass("on");
                $(".disease-teach-detail").on("transitionend WebkitTransitionEnd",function () {
                    $(".disease-teach-detail").hide().remove();
                });

                $(".config-suggestion").show();
            })
        }

    };
   return container;
});