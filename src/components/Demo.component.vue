<template lang="pug">
  .demo
    iframe#iframe.demo__iframe(
      src="/demo.html"
      frameborder="0"
      scrolling="no"
      @resize="resize"
      @load="sendDemo")
    #demoContent.demo__content
      slot
</template>

<script>
export default {
  methods: {
    sendDemo() {
      const iframe = this.$el.querySelector('#iframe');
      const content = this.$el.querySelector('#demoContent').innerHTML;

      // Hay que añadir un div que envuelva todo y haga de único nodo padre
      iframe.contentWindow.postMessage(`<div>${content}</div>`, '*');
      this.resize();
    },

    resize() {
      setTimeout(() => {
        const iframe = this.$el.querySelector('#iframe');
        iframe.style.height = `${iframe.contentWindow.document.body.scrollHeight}px`;
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
.demo {
  &__iframe {
    width: 100%;
    margin: simple() 0;
    border: 1px solid color(border);
    border-radius: $border-radius;
  }

  &__content {
    display: none;
  }
}
</style>
