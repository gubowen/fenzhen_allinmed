<template>
  <!--底部区域-->
  <footer id="footer" class="main-footer">
    <span>Copyright©2017 allinmed.cn All Rights Reserved.版权所有©银川唯医互联网骨科医院有限公司</span>
    <span>宁公网安备 64010402000685号 宁ICP备17001413号-1</span>
    <span>互联网药品信息服务 证书编号： (宁)-非经营性-2017-0005</span>
  </footer>
</template>

<script>
  export  default{
    name:'footer'
  }
</script>

<style lang="scss" scoped="" type="text/css"  rel="stylesheet/scss">
  @import "./scss/base.scss";
  .main-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    height: 40px;
    line-height: 40px;
    z-index: 6;
    text-align: center;
    border-top: 1px solid #ededed;

  span {
    font-size: 13px;
    color: #aaaaaa;
  }

  }
</style>
