<template>
  <div id="indexlayout">
    <layout-index-left />
    <div id="indexlayout-right" :class="{'fiexd-header': siteFiexdHeader}">
        <layout-index-right-top />
        <div class="indexlayout-right-main" >
          <app-main />
          <layout-index-right-footer />
        </div>
    </div>  
  </div>  
</template>
<script>
/** 
 * Index 框架
 * @author LiQingSong
 */
import { mapGetters } from 'vuex';
import AppMain from '../components/AppMain';
import LayoutIndexLeft from './LayoutIndexLeft';
import LayoutIndexRightTop from './LayoutIndexRightTop';
import LayoutIndexRightFooter from './LayoutIndexRightFooter';
export default {
  name: 'LayoutIndex',
  components: {
    AppMain,
    LayoutIndexLeft,
    LayoutIndexRightTop,
    LayoutIndexRightFooter
  },
  computed: {
    ...mapGetters([
      'siteFiexdHeader'
    ])
  },
  mounted() { 
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/variables.scss";
#indexlayout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
#indexlayout-right {
  position: relative;
  flex: 1;
  overflow: auto;
  background-color: $mainBgColor;
  &.fiexd-header{
    display: flex;
    flex-direction: column;
    .indexlayout-right-main {
      flex: 1;
      overflow: auto;
    }
  }

}
</style>