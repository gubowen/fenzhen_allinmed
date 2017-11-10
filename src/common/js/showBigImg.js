import jQuery from 'jquery'
import JSON from '@/common/js/jquery.json-2.4'
(function ($) {
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
      console.log("!!!!");
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
                console.log("成功！");
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
          //   require("medicalRecord").getMajorCheck();
           }
        },
        fail: function () {
            console.log("失败！");
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
      $('.show-big-img').append(Tip);
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
      console.log("启动查看大图！");
      console.log( $(obj).find("img"));
        // $(obj).find("img").load(function(){
        //     console.log("图片加载完成:load");
        //     var $img = $(obj).find("img");
        //     var imgUrl = $img[0].src;
        //     if (!imgUrl) return;
        //     that.initGallery(obj);
        // });
      // var $img = $(obj).find("img");
      // var imgUrl = $img[0].src;
      // if (!imgUrl) return;
      // that.initGallery(obj);
   // console.log( $(obj).find("img")[0]);
      var  aa = setInterval(fn,50);
      function fn(){
          if( $(obj).find("img")[0].complete){
              console.log("图片加载完成:complete = true");
              var $img = $(obj).find("img");
              var imgUrl = $img[0].src;
              if (!imgUrl) return;
              that.initGallery(obj);
              clearInterval(aa);
          }else{
              console.log("complete = false");
          }
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

})(jQuery);
