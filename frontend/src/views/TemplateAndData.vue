<template>
    <div>
        <quill-editor
        :value="value"
        @input="onInput"
        />
    </div>
</template>
<script>
import Vue from "vue";
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.snow.css";
Vue.use(VueQuillEditor);
export default {
  name: "RichTextEditor",

  props: {
    value: {
      type: String,
      default: "",
    },
  },

  methods: {
    onInput(content) {
      this.$emit("input", content); 
    },
  },
};
</script>