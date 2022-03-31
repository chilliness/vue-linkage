<template>
  <div class="linkageBase fixed frow" @touchmove.stop.prevent>
    <div class="content-box flex">
      <div class="handle-box frow">
        <span class="btn btn-cancel frow" @click="handleClose(0)">{{ textCancel }}</span>
        <span class="flex"></span>
        <span class="btn btn-confirm frow" @click="handleClose(1)">{{ textConfirm }}</span>
      </div>
      <div
        class="items-box"
        :style="{
          height: `${height}px`,
          '--width': `${100 / list.length}%`,
          '--height': `${height / 3}px`,
        }"
      >
        <div class="list-box" :class="{ freeze: ![-1, i].includes(which) }" v-for="(item, i) in list" :key="i" :ref="(el) => el && (elList[i] = el)" @touchstart="handleStart(i, $event)" @touchmove="handleMove" @touchend="handleEnd(i)" @wheel="handleWheel(i, $event)">
          <div class="item-box frowc" v-for="(item1, i1) in item" :key="i1">
            <span class="item elps">{{ item1.val }}</span>
          </div>
        </div>
        <div class="line-box frow">
          <span class="line frow" v-for="(item, i) in list" :key="i"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs, reactive, onMounted } from "vue";
import { css, MTween } from "./js/MTween.js";

export default {
  name: "LinkageBase",
  props: {
    list: {
      type: Array,
      default() {
        return [[{ val: "苹果" }, { val: "香蕉" }, { val: "西瓜" }, { val: "樱桃" }]];
      },
    },
    initVal: {
      type: Array,
      default() {
        return [];
      },
    },
    height: {
      type: Number,
      default: 180,
    },
    isLinkage: {
      type: Boolean,
      default: false,
    },
    textCancel: {
      type: String,
      default: "取消",
    },
    textConfirm: {
      type: String,
      default: "确认",
    },
  },
  setup(props, { emit }) {
    let touch = {
      el: {},
      dir: "",
      diffY: 0,
      pageY: 0,
      oldVal: 0,
      init: false,
      maxHeight: 0,
      stepTouch: 300,
      stepWheel: 500,
      lastTouchTime: 0,
      lastWheelTime: 0,
      height: props.height / 3,
    };

    let vm = reactive({ elList: [], result: {}, which: -1 });

    vm.handleStart = (i, { changedTouches }) => {
      let now = Date.now();
      if (now - touch.lastTouchTime < touch.stepTouch) {
        return (touch.init = false);
      }

      vm.which = i;
      touch.init = true;
      touch.diffY = 0;
      touch.el = vm.elList[i];
      touch.lastTouchTime = now;
      touch.pageY = changedTouches[0].pageY;
      touch.oldVal = css(touch.el, "translateY");
      touch.height = css(touch.el.children[0], "height");
      touch.maxHeight = css(touch.el, "height") - touch.height * 3;
    };

    vm.handleMove = ({ changedTouches }) => {
      if (!touch.init) return;

      touch.diffY = changedTouches[0].pageY - touch.pageY;
      touch.dir = touch.diffY < 0 ? "up" : "down";
      css(touch.el, "translateY", touch.oldVal + touch.diffY);
    };

    vm.handleEnd = (i) => {
      if (!touch.init) return;

      touch.init = false;

      let { el, diffY, oldVal, height, maxHeight } = touch;
      let translateY = css(el, "translateY");
      translateY -= translateY % height;

      // 超过每项高度的1/3才滑动，否则还原位置
      if (Math.abs(diffY) < height / 3) {
        translateY = oldVal;
      }

      if (translateY > 0) {
        translateY = 0;
      } else if (translateY < -maxHeight) {
        translateY = -maxHeight;
      }

      MTween({
        el,
        time: 100,
        type: "easeOut",
        target: { translateY },
        callBack: () => vm.handleResult(false, i),
      });
    };

    vm.handleWheel = (which, { wheelDelta }) => {
      let now = Date.now();
      let val = Math.abs(wheelDelta);
      let diff = now - touch.lastWheelTime;
      if (val > 100 && val % 10 === 0 && diff > touch.stepWheel) {
        touch.lastWheelTime = now;
        let { keys, index, meta, flag, dir, res } = vm.result;
        dir = wheelDelta < 0 ? +1 : -1;
        index = keys[which] + dir;
        index = Math.max(0, index);
        index = Math.min(props.list[which].length - 1, index);
        if (flag && !props.isLinkage) {
          let arr = props.list.map((item, i) => which === i && item[index].val);
          vm.handleInit(arr);
        }
        res = { flag, dir, which, index, meta, _: "flag-是否正常,dir-滚动方向,which-操作索引,index-数据索引,meta-最终数据" };
        emit("handleWheel", res);
      }
    };

    vm.handleResult = (isInit = false, which = -1) => {
      let keys = [];
      let meta = vm.elList.map((item, index) => {
        let val = Math.abs(css(item, "translateY") / touch.height);
        keys.push(val);
        return props.list[index][val];
      });
      vm.result = {
        meta,
        keys,
        which,
        btn: -1,
        flag: !meta.includes(undefined),
        _: "flag-是否正常,keys-最终索引,meta-最终数据,btn-点击按钮,which-操作索引",
      };

      clearTimeout(vm.handleResult.setTimer);
      vm.handleResult.setTimer = setTimeout(() => {
        vm.which = -1;
        emit("handleOver", vm.result);
        isInit && emit("handleInit", vm.result);
      }, 30);
    };

    vm.handleClose = (btn) => emit("handleClose", { ...vm.result, btn });

    vm.handleInit = (target, fn = () => {}, isInit = false) => {
      if (!target.length) return vm.handleResult(false);
      target.forEach((item, index) => {
        let el = vm.elList[index];
        let list = props.list[index] ?? [];
        let where = list.findIndex(({ val }) => val === item);
        if (el && where > -1) {
          MTween({
            el,
            time: 100,
            type: "easeOut",
            target: { translateY: -where * touch.height },
            callBack: () => {
              fn && fn();
              vm.handleResult(true);
            },
          });
        }
      });
    };

    onMounted(() => vm.handleInit(props.initVal, null, true));

    return { ...toRefs(vm) };
  },
};
</script>

<style lang="scss" scoped>
.fixed {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.frow {
  display: flex;
  align-items: center;
}

.fcol {
  @extend .frow;
  flex-direction: column;
}

.frowc {
  @extend .frow;
  justify-content: center;
  align-items: center;
}

.fcolc {
  @extend .frowc;
  @extend .fcol;
}

.flex {
  flex: 1;
}

.elps {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
.linkageBase {
  z-index: 999;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.2);
  .content-box {
    padding-bottom: 30px;
    background: #fff;
    .handle-box {
      border-bottom: 1px solid #ccc;
      .btn {
        height: 40px;
        padding: 0 15px;
        cursor: pointer;
      }
    }
    .items-box {
      position: relative;
      overflow: hidden;
      user-select: none;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        pointer-events: none;
        background: linear-gradient(0deg, #fff, rgba(255, 255, 255, 0), #fff);
      }
      .list-box {
        display: inline-block;
        vertical-align: top;
        width: var(--width);
        padding: var(--height) 10px;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        .item-box {
          height: var(--height);
        }
        &.freeze {
          pointer-events: none;
        }
      }
      .line-box {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        justify-content: space-evenly;
        pointer-events: none;
        .line {
          width: var(--width);
          height: var(--height);
          &:nth-of-type(n + 2) {
            &::after {
              content: "";
              width: 1px;
              height: 50%;
              border-left: 1px solid #ccc;
            }
          }
        }
      }
    }
  }
}
</style>
