/**
 * @Desc：点击查看大图
 * @Params：{Object}
 *             {
 *             domIdList:[],  //指定元素内容的img为数据源
 *             ajaxOptions:{},  //ajax为数据源时的配置项
 *             topSwiperOptions:{}, //头部swiper配置项
 *             bottomSwiperOptions:{}, //底部swiper配置项
 *             closeCallBack:function(){} //关闭按钮回调
 *             },
 *             swiperToggle:".detials_doc", //需要隐藏显示的同级元素
 *              imgClickCallBack:function {} //为每个图片增加点击回调函数
 * @Return：no
 * @Usage: picShow.init({
     *             domIdList:[],
     *             topSwiperOptions:{},
     *             bottomSwiperOptions:{}
 *                      })
 *Notify:domIdList和ajaxOptions指定传其一.
 *       不想要被计算在的img添加样式 notShow会被自动排除
 * Depend:  *  jquery.js
 *             swiper.jquery.min.js
 *             swiper-3.3.1.min.css
 *            showBigImg.css
 * Created by 王宁 on 2017/3/2
 */
var options=[];
var i=0;
(function ($) {
    var bigPicShow = {
        init: function (options) {
            this.options = options;
            /*
             * 未设置isInit 为false,则默认未true
             * */
            this.options.bottomSwiperOptions.isInit != false && (this.options.bottomSwiperOptions.isInit = true);
            this.options.topSwiperOptions.isInit != false && (this.options.topSwiperOptions.isInit = true);
            /**
             * 判断是否传递了 swiperList,没传递去dom获取,获取了直接添加
             * 当前用于ajax传值
             * */
            if (options.swiperList) {
                this.addSwiperDom(options.swiperList, options.index || 0);
                this.addBindClose(window.scrollY)
            } else {
                /*当前用于从dom中取值
                * */
                options.domIdList && this.addByDom(options);
            }

        },
        addByDom: function (options) {
            var _this = this;
            var str = "";



            /*拼接swiperDom结构*/
            var swiperDom = '<div id="EV-swiper">';
            if (this.options.topSwiperOptions.isInit) {
                swiperDom += '<div class="swiper-container gallery-top';
                if (!_this.options.bottomSwiperOptions.isInit) {
                    swiperDom += " only-top-swiper";
                }
                swiperDom += '"><div class="swiper-wrapper">' +
                    //  swiperList+
                    '      </div>' +
                    //'      <div class="swiper-button-next  swiper-left-gray"></div>' +
                    //'      <div class="swiper-button-prev  swiper-right-gray"></div>' +
                    '      <div class="swiper-pagination EV-gallery-top"></div>' +
                    '      </div>';
            }
            /**
             * 底部swiper列是否需要初始化,不需要则不添加dom结构
             * */
            if (this.options.bottomSwiperOptions.isInit) {
                swiperDom += '<div class="swiper-container gallery-thumbs"><div class="swiper-wrapper">' +
                    '      </div>' +
                    '      <!-- Add Pagination -->' +
                    '      <div class="swiper-pagination EV-gallery-thumbs"></div>' +
                    '      </div>';
            }

            swiperDom += '<div class="closeBtn"></div>' +
                '      <div class="swiper-button-next  swiper-left-gray"></div>' +
                '      <div class="swiper-button-prev  swiper-right-gray"></div>' +
                '</div>';

            // $("body").append(this.options.swiperDom || swiperDom);
            var swiperDom = this.options.swiperDom || swiperDom;

            /**
             * 按数组传递多个指定class || ID
             * */
            $(options.domIdList).each(function (index, listImg) {
                /**
                 * 页面内存在多个指定父元素的class时,再循环一次
                 * */
                var _imgIndex = -1;
                if ($(options.domIdList).length > 0 || listIMg.find("img")) {
                    _imgIndex = index ;
                }
                $(listImg).each(function (index, element) {

                    /**
                     * 为每个img绑定事件
                     * */

                    $(element).find("img:not(.notShow)").each(function (index, ele) {
                        //为每个图片绑定对应索引
                        $(ele).data("index", _imgIndex + index);
                        str += '<div class="swiper-slide" style="margin-right:10px;"><img src=' + ele.src.replace(/_t_\d{3}_\d{3}/, "") + ' /></div>';


                        // 如果没有绑定到img上，绑定到每个img上
                        /* 是否需要初始化底部swiper*/
                        if(!$(this).data("swiperDom") || !$(this).data("bottomSwiperInit")){
                            $(this).data({"swiperDom":swiperDom,"bottomSwiperInit":_this.options.bottomSwiperOptions.isInit});
                        }



                        $(ele).on("click", function (event) {
                            var index = $(this).data("index");
                            /**
                             * 为每个图片添加点击回调事件
                             * */
                            typeof options.imgClickCallBack == "function" && options.imgClickCallBack(index, ele);

                            /*如果有EV-Swiper则删除*/

                            if ($("#EV-swiper").length) {
                                $("#EV-swiper").remove();
                                $('video,.video-js').css('opacity', 1);
                            }

                            if($(this).data("swiperDom")){
                                $("body").append( $(this).data("swiperDom"));
                            }else{
                                $(this).data("swiperDom",swiperDom);
                                $("body").append(_this.options.swiperDom || swiperDom);
                            }

                            $('video,.video-js').css('opacity', 0);//隐藏视频元素


                            $('.swiper-wrapper').append(str);
                            //swiper初始化

                            _this.swiperInit(index,$(this));

                            _this.addBindClose();
                        });
                    });
                })
            });
        },
        /**
         * 拼接swiper结构并初始化 当前用于ajax传入 list结构
         * */
        addSwiperDom: function (swiperList, index) {
            var swiperDom = '<div id="EV-swiper">';
            if (this.options.topSwiperOptions.isInit) {
                swiperDom += '<div class="swiper-container gallery-top';
                if (!this.options.bottomSwiperOptions.isInit) {
                    swiperDom += " only-top-swiper";
                }
                swiperDom += '"><div class="swiper-wrapper">' +
                    //  swiperList+
                    '      </div>' +
                    //'      <div class="swiper-button-next  swiper-left-gray"></div>' +
                    //'      <div class="swiper-button-prev  swiper-right-gray"></div>' +
                    '      <div class="swiper-pagination EV-gallery-top"></div>' +
                    '      </div>';
            }
            /**
             * 底部swiper列是否需要初始化,不需要则不添加dom结构
             * */

            if (this.options.bottomSwiperOptions.isInit) {
                swiperDom += '<div class="swiper-container gallery-thumbs"><div class="swiper-wrapper">' +
                    '      </div>' +
                    '      <!-- Add Pagination -->' +
                    '      <div class="swiper-pagination EV-gallery-thumbs"></div>' +
                    '      </div>';
            }

            swiperDom += '<div class="closeBtn"></div>' ;
            if (this.options.bottomSwiperOptions.isInit) {
                swiperDom +=  ' <div class="swiper-button-next  swiper-left-gray"></div>' +
                              ' <div class="swiper-button-prev  swiper-right-gray"></div>' ;
            }
            swiperDom += '</div>';

            // $("body").append(this.options.swiperDom || swiperDom);

            $("body").append(this.options.swiperDom || swiperDom);

            $('video,.video-js').css('opacity', 0);//隐藏视频元素
            $('.swiper-wrapper').append(swiperList);
            //swiper初始化

            this.swiperInit(index);

        },
        /**
         * 绑定关闭事件
         * */
        addBindClose: function () {
            $("#EV-swiper .closeBtn").on("click", function () {
                /**
                 * 移除EV-swiper
                 * */
                $("#EV-swiper").remove();
                $(".centerTip").remove();
                $('video,.video-js').css('opacity', 1);//显示视频元素
                /**
                 *  关闭后回调事件
                 * */
                typeof this.options.closeCallBack == "function" && this.options.closeCallBack();

            }.bind(this));

        },
        //旋转功能（需配置css）
        addRotate: function () {
            var current = 0;
            $('.rotate-button').off().on('click', function () {
                //console.log($('img', '.swiper-slide-active'));
                current = (current + 90) % 360;
                $('.swiper-slide-active')[0].style.transform = 'rotate(' + current + 'deg)';
            });
            $('.swiper-button-next').on('click', function () {
                $('.swiper-slide-active').prev()[0].style.transform = 'rotate(0deg)';
                current = 0;
            });
            $('.swiper-button-prev').on('click', function () {
                $('.swiper-slide-active').next()[0].style.transform = 'rotate(0deg)';
                current = 0;
            })

        },
        //放大功能（需配置css）
        addScale: function () {
            var Dragging = function (validateHandler) { //参数为验证点击区域是否为可移动区域，如果是返回欲移动元素，负责返回null
                var draggingObj = null; //dragging Dialog
                var diffX = 0;
                var diffY = 0;

                function mouseHandler(e) {
                    switch (e.type) {
                        case 'mousedown':
                            draggingObj = validateHandler(e);//验证是否为可点击移动区域
                            if (draggingObj != null) {
                                e.preventDefault();
                                diffX = e.clientX - draggingObj.offsetLeft;
                                diffY = e.clientY - draggingObj.offsetTop;
                            }
                            break;

                        case 'mousemove':
                            if (draggingObj) {
                                e.preventDefault();
                                draggingObj.style.left = (e.clientX - diffX) + 'px';
                                draggingObj.style.top = (e.clientY - diffY) + 'px';
                            }
                            break;

                        case 'mouseup':
                            draggingObj = null;
                            diffX = 0;
                            diffY = 0;
                            break;
                    }
                }

                return {
                    enable: function () {
                        document.addEventListener('mousedown', mouseHandler);
                        document.addEventListener('mousemove', mouseHandler);
                        document.addEventListener('mouseup', mouseHandler);
                    },
                    disable: function () {
                        document.removeEventListener('mousedown', mouseHandler);
                        document.removeEventListener('mousemove', mouseHandler);
                        document.removeEventListener('mouseup', mouseHandler);
                    }
                }
            };

            function getDraggingDialog(e) {
                var target = e.target;
                if (target && target.className.indexOf('img-scale-center') != -1) {
                    return target;
                }

            }

            $('.magnify-button').off().on('click', function () {

                if ($(this).hasClass("img-scale")) {
                    $("img", ".swiper-slide-active").eq(0).css({
                        maxWidth: "100%",
                        maxHeight: "100%",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%) scale(1)"
                    });
                    // $(".swiper-slide-active").unbind("mousedown").unbind("mousemove");
                    $(".swiper-slide-active").find("img").removeClass("img-scale-center");
                    $(this).removeClass("img-scale");
                } else {
                    $(this).addClass("img-scale");
                    $("img", ".swiper-slide-active").eq(0).css({
                        maxWidth: "100%",
                        maxHeight: "100%",
                        height: "auto",
                        transform: "translate(-50%,-50%) scale(2)",
                        "transform-origin": "50% 50%"
                    })
                    ;
                    // Main();
                    $(".swiper-slide-active").find("img").addClass("img-scale-center");
                    Dragging(getDraggingDialog).enable();
                }
            });
        },

        swiperInit: function (index,bottomSwiperOptionsIsInit) {
            var defaultTop = {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                spaceBetween: 10,
                touchRatio: 1,
                initialSlide: index,
                pagination: '.EV-gallery-top',
                paginationType: 'fraction',
                observer: true,
                updateOnImagesReady: true,
                /**
                 * 添加默认点击图片关闭大图模式
                 * 左右滑块也会触发该方法,故做判断
                 * */
                onTap: function (swiper, event) {
                    //if(event.target.className.indexOf("swiper-slide")!=-1){
                    $("#EV-swiper").remove();
                    $('video,.video-js').css('opacity', 1);  //显示视频元素
                    //}
                }
            };
            /**
             * 判断是否需要初始化 和 是否存在对应的元素
             * */

            var galleryTop = this.options.topSwiperOptions.isInit && ( $('.EV-gallery-top').length ? new Swiper('.gallery-top', $.extend({}, defaultTop, this.options.topSwiperOptions)) : "");
            var defaultBottom = {
                initialSlide: index,   //初始化时的索引
                spaceBetween: 10,       //活动块居中
                centeredSlides: true,   //，活动块会居中，
                slidesPerView: 'auto',  // 设置slider容器能够同时显示的slides数量(carousel模式)。
                                        // 可以设置为number或者 'auto'则自动根据slides的宽度来设定数量。
                touchRatio: 1,          //触摸距离与slide滑动距离的比率。
                slideToClickedSlide: true, //设置为true则点击slide会过渡到这个slide。
                observer: true, //当改变swiper的样式（例如隐藏/显示）或者修改swiper的子元素时，自动初始化swiper。
                pagination: '.EV-gallery-thumbs' ///分页器容器的css选择器或HTML标签
            };

            /*
            * 判断图片对象上是否有绑定对应的bottomSwiperInit
            * */
                // var bottomSwiperOptionsIsInitNow = (bottomSwiperOptionsIsInit&& bottomSwiperOptionsIsInit.data("bottomSwiperInit") )|| this.options.bottomSwiperOptions.isInit;

                var bottomSwiperOptionsIsInitNow = (bottomSwiperOptionsIsInit&& bottomSwiperOptionsIsInit.data("bottomSwiperInit")!= undefined )?  bottomSwiperOptionsIsInit.data("bottomSwiperInit") :this.options.bottomSwiperOptions.isInit;
                /**
             * 判断是否需要初始化 和 是否存在对应的元素
             * */

            var galleryThumbs = bottomSwiperOptionsIsInitNow && ($('.gallery-thumbs').length ? new Swiper('.gallery-thumbs', $.extend({}, defaultBottom, this.options.bottomSwiperOptions)) : "");
            /**
             * 判断两个实例 都在后,增加双向控制
             * */
            if (galleryTop && galleryThumbs) {
                galleryTop.params.control = galleryThumbs;
                galleryThumbs.params.control = galleryTop;
            }

        }

    };

    $.fn.extend({
        photoGallery: function (options) {

            var defaults = {
                //放大比例
                ratio: 1.25,
                //右下角略缩图宽度
                scalePicWidth: 120,
                //右下角略缩图高度
                scalePicHeight: 120
            };
            var o = $.extend(defaults, options);

            var $bigPic = $(this);
            var $bigger = $(".bigger-button");
            var $smaller = $(".smaller-button");
            var $rotate = $(".rotate-button");
            var $down = $(".download-button");

            var $image = '';                        //目标图片
            var imageWidth = '';                    //初始宽度
            var imageHeight = '';                   //初始高度
            var imgRatio = '';                       //图片比例

            var minPercent = '';                    //缩放最小值
            var MaxPercent = '';                    //缩放最大值

            var w = '';                             //缩放后尺寸
            var h = '';

            var isVertical = false;                    //旋转

            var $scalePic = '';                     //略缩图
            var scalePicWidth = o.scalePicWidth;    //略缩图宽度
            var scalePicHeight = o.scalePicHeight;  //略缩图高度

            var $scaleImage = "";                   //略缩图图片
            var $demoPicArea = '';                  //略缩图显示框


            var winWidth = '';                      //窗口尺寸
            var winHeight = '';
            var dragX = '';                         //拖拽X轴
            var dragY = '';                         //拖拽Y轴

            init();

            $bigger.off().on('click', function () {
                biggerImage();

            });

            $smaller.off().on('click', function () {
                smallerImage();
            });

            $rotate.off().on('click', function () {
                rotatePic();
            });

            $down.off().on('click', function () {
                var obj = {
                    header: '请选择保存位置',
                    content: '<div class="tip-btn J-tip-check">检查资料</div><div class="tip-btn J-tip-patients">患病处照片</div>',
                    callback: function () {
                        $(".J-tip-check").on('click', function () {
                            downPic(0);
                        });
                        $(".J-tip-patients").on('click', function () {
                            downPic(1);
                        })
                    }
                };

                centerTip(obj);
            });

            //初始化函数
            function init() {
                //-------------参数初始化--------------------
                $image = options.obj.find("img").eq(0);
                createScalePic();
                $scalePic = options.obj.find(".scalePic");
                $scaleImage = $scalePic.find("img");
                isVertical = false;       //旋转初始化
                minPercent = 10;
                MaxPercent = 500;
                //-------------------------------------------
                imageWidth = $image.width();
                imageHeight = $image.height();
                // imageWidth = $image.eq(0)[0].naturalWidth;
                // imageHeight = $image.eq(0)[0].naturalHeight;
                imgRatio = imageWidth / imageHeight;    //比例
                $scalePic.css({width: o.scalePicWidth, height: o.scalePicHeight});
                winWidth = options.obj.outerWidth();
                winHeight = options.obj.outerHeight();

                if (imageWidth / winWidth > imageHeight / winHeight) {
                    $image.css({
                        width: winWidth,
                        //  height: "auto",
                        maxWidth: "none",
                        maxHeight: "none"
                    }).removeClass("rotate0 rotate90 rotate180 rotate270")
                } else {
                    $image.css({
                        //  width: "auto",
                        height: winHeight,
                        maxWidth: "none",
                        maxHeight: "none"
                    }).removeClass("rotate0 rotate90 rotate180 rotate270")
                }


                setImagePosition();
            }

            //放大图片
            function biggerImage() {
                var w = $image.width();
                var h = $image.height();
                var nextW = w * o.ratio;
                var nextH = h * o.ratio;
                var percent = (nextW / imageWidth * 100).toFixed(0);

                if (percent > MaxPercent) {
                    nextW = imageWidth * MaxPercent / 100;
                    nextH = imageHeight * MaxPercent / 100;
                    percent = MaxPercent;
                }


                $image.width(nextW).height(nextH);
                showPercent(percent);
                setImagePosition();
                showScalePic(nextW, nextH);
            }

            //缩小图片
            function smallerImage() {
                var w = $image.width();
                var h = $image.height();

                var nextW = w / o.ratio;
                var nextH = h / o.ratio;
                var percent = (nextW / imageWidth * 100).toFixed(0);

                if (percent < minPercent) {
                    nextW = imageWidth * minPercent / 100;
                    nextH = imageHeight * minPercent / 100;
                    percent = minPercent;
                }


                $image.width(nextW).height(nextH);
                setImagePosition();
                showPercent(percent);
                showScalePic(nextW, nextH);
            }

            //设置图片位置
            function setImagePosition() {
                var w = $image.width();
                var h = $image.height();
                var wW = options.obj.outerWidth();
                var wH = options.obj.outerHeight();

                var left = (wW - w ) / 2;
                var top = (wH - h ) / 2;
                $image.css({left: left + 'px', top: top + 'px'});
            }

            //显示百分比
            function showPercent(percent) {
                $bigPic.find(".percentTip").remove();

                var PTTemplate = '<div class="percentTip">' + percent + '%</div>';
              //  $(PTTemplate).appendTo($bigPic).fadeOut(1500);

            }

            //生成略缩图
            function createScalePic() {
                var scaleImage = '' +
                    '<div class="scalePic">' +
                    '<div class="demoPic"> ' +
                    '<img src="' + $image.attr("src") + '"/>' +
                    '<div class="demoPicArea"><span></span></div>' +
                    '</div>' +
                    '</div>';
                $(".scalePic").remove();
                $bigPic.append(scaleImage);
                $demoPicArea = $(".demoPicArea", $bigPic);
            }

            //显示略缩图
            function showScalePic(nextW, nextH) {

                if (isVertical) nextW = [nextH, nextH = nextW][0];
                if (nextW > parseInt($bigPic[0].clientWidth) || nextH > parseInt($bigPic[0].clientHeight)) {
                    $scalePic.show();
                    setScalePic()
                } else {
                    $scalePic.hide();
                }
            }

            //设置略缩图
            function setScalePic() {
                var sw = $scalePic.find("img")[0].width;
                var sh = $scalePic.find("img")[0].height;


                w = $image.width();
                h = $image.height();
                var imf = $image.offset();

                var big = $bigPic.offset();
                var bigleft = big.left;
                var bigtop = big.top;


                var imfl = imf.left - bigleft;
                var imft = imf.top - bigtop;

                var aWidth = '';
                var aHeight = '';
                var aLeft = '';
                var aTop = '';


                if (isVertical) {
                    sw = [sh, sh = sw][0];
                    w = [h, h = w][0];
                    //winWidth = [winHeight, winHeight = winWidth][0];
                    //     // console.log(winWidth, winHeight);
                }

                // 遮罩宽度 = 略缩图宽 / （图片宽度/ 窗口宽度）
                aWidth = sw / (w / winWidth);
                if (w < winWidth) aWidth = sw;
                aHeight = sh / (h / winHeight);
                if (h < winHeight) aHeight = sh;

                //  （小窗口 - 略缩图遮罩）/2 +  - 大图left  * 小图宽度 / 大图宽度
                aLeft = (o.scalePicWidth - sw) / 2 + -imfl * sw / w;
                if (w < winWidth) aLeft = (o.scalePicWidth - sw) / 2;

                aTop = (o.scalePicHeight - sh) / 2 + -imft * sh / h;
                if (h < winHeight) aTop = (o.scalePicHeight - sh) / 2;


                $demoPicArea.css({
                    width: aWidth,
                    height: aHeight,
                    top: aTop,
                    left: aLeft
                });

            }

            //旋转图片
            function rotatePic() {
                var rotateClass = false;
                if (typeof $image.attr("class") != "undefined") {
                    rotateClass = $image.attr("class").match(/(rotate)(\d*)/);
                }
                if (rotateClass) {
                    var nextDeg = (rotateClass[2] * 1 + 90) % 360;
                    $image.removeClass(rotateClass[0]).addClass("rotate" + nextDeg);
                    $scaleImage.removeClass(rotateClass[0]).addClass("rotate" + nextDeg);
                    resizeImg(nextDeg);
                    resizeScalePic(nextDeg);
                    isVertical = nextDeg == 90 || nextDeg == 270;
                } else {
                    $image.addClass("rotate90");
                    $scaleImage.addClass("rotate90");
                    resizeImg("90");
                    resizeScalePic("90");
                    isVertical = true;
                }
            }

            //重置图片宽高
            function resizeImg(rotateDeg) {
                var _winWidth = options.obj.width();
                var _winHeight = options.obj.height();
                var width = imageWidth, height = imageHeight;
                if (rotateDeg == '90' || rotateDeg == '270') {
                    _winWidth = [_winHeight, _winHeight = _winWidth][0];
                    width = imageHeight;
                    height = imageWidth;
                }

                // width = Math.max(imageWidth, _winWidth);
                // height = Math.max(imageHeight, _winHeight);
                //如果
                //debugger;
                if (imageWidth / imageHeight > _winWidth / _winHeight) {
                    width = _winWidth;
                    height = "auto";
                } else {
                    height = _winHeight;
                    width = "auto";
                }

                $image.css({
                    width: width,
                    height: height
                });
                setImagePosition();
            }

            //重置略缩图宽高
            function resizeScalePic(rotateDeg) {
                if (rotateDeg == '90' || rotateDeg == '270') {
                    scalePicWidth = [scalePicHeight, scalePicWidth = scalePicHeight][0];
                }

                $scalePic.css({
                    width: scalePicWidth,
                    height: scalePicHeight
                });
                $scalePic.hide();
            }

            //大图拖拽
            $bigPic.find("img").on("mouseover", function (e) {

            }).on("mouseenter", function (e) {
                dragX = -1;
            }).on('mouseout', function (e) {

            }).on("mousedown", function (e) {
                dragX = e.pageX || e.clientX;
                dragY = e.pageY || e.clientY;
                e.stopPropagation();
                e.preventDefault();
            }).on("mousemove", function (e) {
                if (dragX > 0) {
                    var nextDragX = e.pageX || e.clientX;
                    var nextDragY = e.pageY || e.clientY;
                    var o = $image.offset();
                    var left = o.left + (nextDragX - dragX);
                    var top = o.top + (nextDragY - dragY);


                    var w = $image.width();
                    var h = $image.height();


                    var big = $bigPic.offset();
                    var bigleft = big.left;
                    var bigtop = big.top;


                    if (isVertical) {
                        w = [h, h = w][0];
                    }

                    if (w > winWidth) {
                        if (left > bigleft) {
                            left = bigleft;
                        } else if (left < winWidth + bigleft - w) {
                            left = winWidth + bigleft - w;
                        }
                    } else {
                        left = o.left;
                    }

                    if (h > winHeight) {
                        if (top > bigtop) {
                            top = bigtop;
                        } else if (top < winHeight + bigtop - h) {
                            top = winHeight + bigtop - h;
                        }
                    } else {
                        top = o.top;
                    }

                    $image.offset({
                        left: left,
                        top: top
                    });
                    dragX = nextDragX;
                    dragY = nextDragY;
                    setScalePic(); //设置缩略图
                }
            }).on("mouseup", function (e) {
                dragX = -1;
            });

            //保存图片
            function downPic(caseNum) {
                var src = $image.attr("src");
                var caseCategoryId,caseAttSource;
                if(caseNum == 0){
                    caseCategoryId = 1;
                    caseAttSource = 5;
                }else{
                    caseCategoryId = 12;
                    caseAttSource = 6;
                }
                $(".centerTip").remove();
                $.ajax({
                    url: "/call/customer/patient/case/attachment/create/",
                    type: 'POST',
                    data: {
                        paramJson: $.toJSON({
                            caseId: localStorage.getItem("caseId"),
                            extName: "jpg",
                            fileContent: src,
                            caseCategoryId: caseCategoryId,
                            caseAttSource: caseAttSource
                        })
                    },
                    dataType: "json",
                    beforeSend: function () {
                        //common.loading.show();
                    },
                    success: function (data) {
                        if (data.responseObject.responseData && data.responseObject.responseData.url.length > 0) {
                            //common.loading.hide();


                            var htmlResult = '<div class="tip-save-result">' +
                                '<div ><img src="/image/img00/employee/picture_success.png"/></div>' +
                                '<div class="text">保存成功</div>' +
                                '</div>';
                            $("body").append(htmlResult);
                            $(".tip-save-result").addClass("on");
                            setTimeout(
                                function () {
                                    $(".tip-save-result").remove();
                                }, 2000
                            );
                            require("medicalRecord").getMajorCheck();
                        }
                    },
                    fail: function () {
                        var htmlResult = '<div class="tip-save-result">' +
                            '<div ><img src="/image/img00/employee/picture_fail.png"/></div>' +
                            '<div class="text">保存失败</div>' +
                            '</div>';
                        $("body").append(htmlResult);
                        $(".tip-save-result").addClass("on");
                        setTimeout(
                            function () {
                                $(".tip-save-result").remove();
                            }, 2000
                        )
                    }
                })

            }

            function centerTip(obj) {
                if ($('.centerTip').length > 0) {
                    $('.centerTip').remove();
                }
                var Tip = "<div class='centerTip'>" +
                    "<div class='tip-head'>" + obj.header + "</div>" +
                    "<div class='tip-content'>" + obj.content + "</div>" +
                    "<div class='tip-close'></div>" +
                    "</div>";
                $('body').append(Tip);
                if (typeof  obj.callback != "undefined") {
                    obj.callback();
                }
                $(".tip-close").on("click", function () {
                    $('.centerTip').remove();
                })
            }

            return this;
        }
    });

    $.extend({
        openPhotoGallery: function (obj) {
            var that = this;
           // console.log("启动查看大图！");
            $(obj).find("img").load(function(){
              //  console.log("图片加载完成:load");
                var $img = $(obj).find("img");
                var imgUrl = $img[0].src;
                if (!imgUrl) return;
                that.initGallery(obj);
            });
            if( $(obj).find("img")[0].complete){
              //  console.log("图片加载完成:complete = true");
                var $img = $(obj).find("img");
                var imgUrl = $img[0].src;
                if (!imgUrl) return;
                that.initGallery(obj);
            }
        },
        initGallery: function (obj) {
            obj.photoGallery({
                obj: obj
            });
        },
        bigPicShow:function(option){
            bigPicShow.init(option);
        }
    });
    // return bigPicShow;
})(jQuery);
