<template>
  <tag-linkage-base v-bind="$props" :list="list" @handleOver="handleOver" @handleClose="handleClose" @handleWheel="handleWheel" :ref="(el) => el && (target = el)"></tag-linkage-base>
</template>

<script>
import { toRefs, reactive } from "vue";
import { provList, cityList, areaList } from "./js/data";

export default {
  name: "LinkageAddr",
  emits: ["handleClose"],
  props: {
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
    let list = [provList, cityList, areaList];
    let prov = provList.find((item) => item.val === props.initVal[0]);
    if (prov) {
      list[1] = prov.children;
      list[2] = prov.children[0].children;
      let city = list[1].find((item) => item.val === props.initVal[1]);
      if (city) {
        list[2] = city.children;
      }
    }

    let vm = reactive({ list, target: null, lastVal: [] });

    vm.handleOver = ({ flag, which, meta }) => {
      if (!flag) return;

      if (which === 0 && meta[0].code !== vm.lastVal[0]) {
        vm.list[1] = meta[0].children;
        vm.list[2] = meta[0].children[0].children;
        vm.target.handleInit([null, vm.list[1][0].val, vm.list[2][0].val]);
      } else if (which === 1 && meta[1].code !== vm.lastVal[1]) {
        vm.list[2] = meta[1].children;
        vm.target.handleInit([null, null, vm.list[2][0].val]);
      }
      vm.lastVal = meta.map(({ code }) => code);
    };

    vm.handleWheel = ({ flag, which, meta, index }) => {
      if (!flag) return;

      if (which === 0) {
        vm.list[1] = vm.list[which][index].children;
        vm.list[2] = vm.list[1][0].children;
        vm.target.handleInit([vm.list[which][index].val, vm.list[1][0].val, vm.list[2][0].val]);
      } else if (which === 1) {
        vm.list[2] = vm.list[which][index].children;
        vm.target.handleInit([null, vm.list[which][index].val, vm.list[2][0].val]);
      } else if (which === 2) {
        vm.target.handleInit([null, null, vm.list[which][index].val]);
      }
    };

    vm.handleClose = (args) => emit("handleClose", args);

    return { ...toRefs(vm) };
  },
};
</script>
