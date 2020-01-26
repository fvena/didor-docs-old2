<template lang="pug">
  .dynamic-component
    v-runtime-template(:template="content" v-if="content")
    component(:is="component")
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template';

export default {
  components: {
    VRuntimeTemplate,
  },

  data() {
    return {
      component: window.name,
      content: '',
    };
  },
  methods: {
    // addEventListener support for IE8
    bindEvent(element, eventName, eventHandler) {
      if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
      } else if (element.attachEvent) {
        element.attachEvent(`on${eventName}`, eventHandler);
      }
    },
  },
  created() {
    this.bindEvent(window, 'message', e => {
      if (!e.data || typeof e.data !== 'string') return;
      this.content = e.data;
    });
  },
};
</script>

<style lang="scss">
.dynamic-component {
  padding: simple();
}

.demo__subtitle {
  margin-bottom: quarter();
  font-family: font-family(base);
  font-size: font-size(small2);
  font-weight: font-weight(bold);
  color: color(gray4);
  text-transform: uppercase;
}
</style>
