<template>
  <div class="home">
    <el-row>
      <el-col :span="3">
      <pms-sider></pms-sider>
      </el-col>
      <el-col :span="3" v-show="this.$route.path!='/infobasic' && this.$route.path!='/infoResourceDetail'" class="el-col-tree">
        <pms-tree></pms-tree>
      </el-col>
      <el-col :span="this.$route.path==='/infobasic' || this.$route.path==='/infoResourceDetail' ? 21 : 18">
        <pms-header></pms-header>
        <div class="content" id="printHtml">
          <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import pmsHeader from '@/components/common/header/Index'
import pmsSider from '@/components/common/sider/Index'
import pmsTree from '@/components/common/tree/Index'
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Your homedex'
    }
  },
  components: {
    pmsHeader: pmsHeader,
    pmsSider: pmsSider,
    pmsTree: pmsTree
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
}

.home{
  height: 100%;
}
.el-row{
  height: 100%;
}
.el-col-tree{
  height: 100%;
  background-color: #f0f0f0;
}
.el-col {
  height: 100%;
}
.content{
  background: none repeat scroll 0 0 #fff;
  /*position: absolute;
  left: 250px;
  right: 0;
  top: 60px;
  bottom: 0;
  width: auto;*/
  padding: 0 20px;
  height: 100%;
}
.content-bread{
  position: absolute;
  top: 14px;
  font-size: 16px;
}
</style>
