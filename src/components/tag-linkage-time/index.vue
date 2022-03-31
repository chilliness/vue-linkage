<template>
  <tag-linkage-base v-bind="$props" @handleOver="handleOver" @handleClose="handleClose"></tag-linkage-base>
</template>

<script>
import { toRefs, reactive } from "vue";

export default {
  name: "LinkageTime",
  emits: ["handleClose", "handleOver"],
  props: {
    list: {
      type: Array,
      default() {
        let hList = [...Array(24).keys()].map((item, index) => ({
          val: String(index).padStart(2, 0),
        }));
        let nList = [...Array(60).keys()].map((item, index) => ({
          val: String(index).padStart(2, 0),
        }));
        return [hList, nList, nList];
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
    let vm = reactive({});

    vm.handleOver = (args) => emit("handleOver", args);

    vm.handleClose = (args) => emit("handleClose", args);

    return { ...toRefs(vm) };
  },
};
</script>
