<template>
  <div class="linkageBase-wrap" :class="{hide: !isShow}">
    <div class="holder-box" @click="handleCancel"></div>
    <div class="main-box">
      <div class="btn-bar">
        <div class="btn btn-cancel" @click="handleCancel">{{cancelText}}</div>
        <div class="btn btn-submit" @click="handleConfirm">{{confirmText}}</div>
      </div>
      <div class="list-outer">
        <div class="list-inner">
          <div class="list-box" :style="{width: 100 / list.length + '%'}" v-for="(item, index) in list" :key="index" @touchstart="handleStart(index, $event)" @touchmove="handleMove" @touchend="handleEnd" @touchcancel="handleEnd" ref="listBox">
            <div class="item-box" :data-val="_item.val" v-for="(_item, _index) in item" :key="index + '-' +_index">{{_item.val}}</div>
          </div>
        </div>
        <div class="line-box">
          <div class="line" v-for="(item, index) in list" :key="index"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { css, MTween } from './js/m.Tween.js';
let touch = { lastTime: 0, interval: 300 };

export default {
  name: 'LinkageBase',
  props: {
    list: {
      type: Array,
      default() {
        return [
          [{ val: '苹果' }, { val: '香蕉' }, { val: '西瓜' }, { val: '樱桃' }]
        ];
      }
    },
    initVal: {
      type: Array,
      default() {
        return [];
      }
    },
    linkageVal: {
      type: Array,
      default() {
        return [];
      }
    },
    isShow: {
      type: Boolean,
      required: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    }
  },
  mounted() {
    this.$nextTick(this.handleInitPos);
  },
  methods: {
    handleInitPos() {
      if (!this.initVal.length) {
        return;
      }

      let aPos = [];
      this.list.map((item, index) => {
        aPos.push(item.findIndex(item => item.val === this.initVal[index]));
      });

      if (aPos.includes(-1)) {
        return console.log(this.initVal, '初始化失败，请核对数据有效性');
      }

      let timerOut = setTimeout(() => {
        clearTimeout(timerOut);
        this.$refs.listBox.forEach((item, index) => {
          let val = -css(item.children[0], 'height') * aPos[index];
          css(item, 'translateY', val);
        });

        this.$emit('init', { index: aPos, _: 'index-初始化索引' });
      }, 60);
    },
    handleCssPos() {
      if (!this.linkageVal.length) {
        return;
      }

      let aPos = [];
      this.list.map((item, index) => {
        aPos.push(item.findIndex(item => item.val === this.linkageVal[index]));
      });

      this.$refs.listBox.forEach((item, index) => {
        let val = aPos[index];
        if (val !== -1) {
          css(item, 'translateY', -css(item.children[0], 'height') * val);
        }
      });
    },
    handleStart(elIndex, e) {
      let now = +new Date();
      if (now - touch.lastTime < touch.interval) {
        return (touch.init = false);
      }

      touch.init = true;
      touch.lastTime = now;
      touch.elIndex = elIndex;
      touch.el = this.$refs.listBox[elIndex];
      touch.diffY = 0;
      touch.startY = e.changedTouches[0].pageY;
      touch.oldVal = css(touch.el, 'translateY');
    },
    handleMove(e) {
      if (!touch.init) {
        return;
      }

      touch.diffY = e.changedTouches[0].pageY - touch.startY;
      touch.dir = touch.diffY < 0 ? 'up' : 'down';
      css(touch.el, 'translateY', touch.oldVal + touch.diffY);
    },
    handleEnd() {
      if (!touch.init) {
        return;
      }

      let el = touch.el;
      let height = css(el.children[0], 'height');
      let maxHeight = height * (el.children.length - 1);
      let targetY = css(el, 'translateY');

      if (touch.dir === 'up') {
        targetY -= (targetY % height) + height;
      } else {
        targetY -= targetY % height;
      }

      // 超过每项高度的1/3才滑动，否则还原位置
      if (Math.abs(touch.diffY) < height / 3) {
        targetY = touch.oldVal;
      }

      if (targetY > 0) {
        targetY = 0;
      } else if (targetY < -maxHeight) {
        targetY = -maxHeight;
      }
      MTween({
        el,
        target: { translateY: targetY },
        type: 'easeOut',
        time: 100,
        callBack: () => this.$emit('over', this.handleResult(touch.elIndex))
      });
    },
    handleResult(elIndex = -1) {
      let obj = {
        bool: true,
        index: [],
        meta: [],
        val: [],
        _: 'bool-是否正常,index-最终索引,meta-最终数据,val-最终结果'
      };

      this.$refs.listBox.forEach((item, index) => {
        let msg = '警告:心急吃不了热豆腐';
        let children = item.children;
        let nowIndex = Math.abs(
          css(item, 'translateY') / css(children[0], 'height')
        );
        if (children[nowIndex]) {
          obj.index.push(nowIndex);
          obj.meta.push(this.list[index][nowIndex]);
          obj.val.push(children[nowIndex].dataset.val);
        } else {
          obj.index.push(msg);
          obj.meta.push(msg);
          obj.val.push(msg);
          obj.bool = false;
        }
      });

      if (elIndex !== -1) {
        obj.which = elIndex;
        obj._ =
          'bool-是否正常,index-联动前索引,meta-联动前数据,val-联动前结果,which-联动前操作列索引';
      }
      return obj;
    },
    handleConfirm() {
      this.$emit('confirm', this.handleResult());
    },
    handleCancel() {
      this.$emit('cancel', this.handleResult());
    },
    handlePrevent(e) {
      e.preventDefault();
    }
  },
  watch: {
    isShow(val) {
      let type = val ? 'addEventListener' : 'removeEventListener';
      document[type]('touchmove', this.handlePrevent, { passive: false });
    },
    linkageVal() {
      this.$nextTick(this.handleCssPos);
    }
  }
};
</script>

<style lang="scss" scoped>
// $height 控制滚动区高度，建议为3的整数倍
// $fontSize控制字体大小
// $linearGradient控制渐变区域
$height: 150px;
$fontSize: 14px;
$linearGradient: linear-gradient(
  to bottom,
  #fff,
  rgba(255, 255, 255, 0.8),
  rgba(255, 255, 255, 0),
  rgba(255, 255, 255, 0.8),
  #fff
);

.linkageBase-wrap {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  flex-flow: column;
  font-size: $fontSize;
  user-select: none;
  &.hide {
    display: none;
  }
  .holder-box {
    flex: 1;
    background: rgba(0, 0, 0, 0.3);
  }
  .main-box {
    background: #fff;
    .btn-bar {
      display: flex;
      justify-content: space-between;
      .btn {
        display: flex;
        align-items: center;
        height: 46px;
        padding: 0 15px;
      }
    }
    .list-outer {
      position: relative;
      border-top: 1px solid #ccc;
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        pointer-events: none;
        background: $linearGradient;
      }
      .list-inner {
        position: relative;
        z-index: 1;
        display: flex;
        justify-content: space-around;
        height: $height;
        overflow: hidden;
        .list-box {
          &:before,
          &:after {
            content: '';
            display: block;
            height: $height / 3;
          }
          .item-box {
            height: $height / 3;
            line-height: $height / 3;
            text-align: center;
            padding: 0 10px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
      .line-box {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: flex;
        .line {
          flex: 1;
          height: 100%;
          &:nth-child(n + 2) {
            border-left: 1px solid rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }
}
</style>
