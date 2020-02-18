<template lang="pug">
  .dynamic-component
</template>

<script>
import Vue from 'vue';
import DemoUtils from './demo.utils';

export default {
  methods: {
    async getContent(event) {
      if (!event.data || typeof event.data !== 'string' || event.data.startsWith('setImmediate')) return;

      // Compilo el código recibido para poder crear el componente
      const content = decodeURIComponent(event.data);
      const { script, css } = await DemoUtils.getVueDetail(content);

      // Añado el css a la vista
      if (css) {
        const style = document.createElement('style');
        style.innerHTML = css;
        document.body.appendChild(style);
      }

      // Genero el componente y lo añado a la vista
      const appNode = this.$el;
      const Comp = Vue.extend(script);
      const app = new Comp().$mount();
      appNode.appendChild(app.$el);

      // Actualizo el tamaño del iframe al contenido
      this.resize();
    },

    resize() {
      const doc = this.$el.ownerDocument;
      const win = doc.defaultView;
      const contentHeight = document.body.scrollHeight;
      win.frameElement.style.height = `${contentHeight}px`;
    },
  },

  created() {
    window.addEventListener('message', this.getContent, false);
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600');

html {
  font-family: 'Source Sans Pro', Helvetica Neue, Arial, sans-serif;
  font-style: normal;
  font-weight: 400;
  line-height: 1.6rem;
  color: #3b4c54;
}

.dynamic-component {
  display: flex;
  align-items: center;
  justify-content: center;
  // height: 100vh;
  padding: 3.2rem 1.6rem;
}

.demo__subtitle {
  margin-bottom: 0.4rem;
  // font-family: font-family(base);
  font-size: 0.73rem;
  font-weight: 700;
  color: #9da6aa;
  text-transform: uppercase;
}
</style>
