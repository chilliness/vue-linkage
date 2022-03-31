<template>
  <tag-linkage-base v-bind="$props" :list="list" @handleOver="handleOver" @handleClose="handleClose" @handleWheel="handleWheel" :ref="(el) => el && (target = el)"></tag-linkage-base>
</template>

<script>
import { toRefs, reactive } from "vue";

export default {
  name: "LinkageDate",
  emits: ["handleClose"],
  props: {
    range: {
      type: Object,
      default() {
        return { min: -5, max: 5 };
      },
    },
    initVal: {
      type: Array,
      default() {
        let oDate = new Date();
        let Y = String(oDate.getFullYear());
        let M = String(oDate.getMonth() + 1).padStart(2, 0);
        let D = String(oDate.getDate()).padStart(2, 0);
        return [Y, M, D];
      },
    },
    height: {
      type: Number,
      default: 180,
    },
    isLinkage: {
      type: Boolean,
      default: true,
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
    let [year, yearList] = [new Date().getFullYear(), []];
    for (let i = props.range.min; i <= props.range.max; i++) {
      yearList.push({ val: String(year + i) });
    }
    let monthList = [...Array(12).keys()].map((item, index) => ({
      val: String(index + 1).padStart(2, 0),
    }));
    let dateList = [...Array(31).keys()].map((item, index) => ({
      val: String(index + 1).padStart(2, 0),
    }));

    let list = [yearList, monthList, dateList];
    let [Y, M] = [props.initVal[0], props.initVal[1]];
    if (props.initVal.length && Y && M) {
      list[2] = dateList.slice(0, new Date(Y, M, 0).getDate());
    }

    let vm = reactive({ list, target: null });

    vm.handleOver = ({ flag, which, meta }) => {
      if (flag && [0, 1].includes(which)) {
        let max = new Date(meta[0].val, meta[1].val, 0).getDate();
        vm.list.splice(2, 1, dateList.slice(0, max));
        if (meta[2].val >= max) {
          vm.target.handleInit([null, null, String(max)]);
        }
      }
    };

    vm.handleWheel = ({ flag, which, meta, index }) => {
      if (!flag) return;

      meta[which] = vm.list[which][index];
      if ([0, 1].includes(which)) {
        let max = new Date(meta[0].val, meta[1].val, 0).getDate();
        vm.list.splice(2, 1, dateList.slice(0, max));
        if (meta[2].val >= max) {
          meta[2] = { val: String(max) };
        }
      }
      vm.target.handleInit(meta.map(({ val }) => val));
    };

    vm.handleClose = (args) => emit("handleClose", args);

    return { ...toRefs(vm) };
  },
};
</script>
