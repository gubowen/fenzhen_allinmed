<template>
  <!--底部区域-->
  <footer id="footer" class="main-footer">
    <span>Copyright©2017 allinmed.cn All Rights Reserved.版权所有©北京欧应信息技术有限公司</span>
    <span>京公网安备 11010502032763号</span>
    <span>京ICP备14007118号-5</span>
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
    z-index: 1;
    text-align: center;
    border-top: 1px solid #ededed;

  span {
    font-size: 13px;
    color: #aaaaaa;
  }

  }
</style>
