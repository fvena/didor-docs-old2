import Vue from 'vue';
// import Didor from '../../public/packages';

// Vue.use(Didor);

const DemoInstance = {
  new(element) {
    return new Vue({
      name: 'iApp',
      // freezing to prevent unnessessary Reactifiation of vNodes
      data: { children: Object.freeze(element) },
      render(h) {
        return h(
          'div',
          { class: { 'demo-container': true }, style: { overflow: 'hidden' } },
          this.children // eslint-disable-line
        );
      },
      methods: {
        log() {
          const doc = this.$el.ownerDocument;
          const win = doc.defaultView;
          const contentHeight = this.$el.offsetHeight;
          const paddingIframe = 55;
          win.frameElement.style.height = `${contentHeight + paddingIframe}px`;
        },
      },
      mounted() {
        this.$nextTick(() => {
          const doc = this.$el.ownerDocument;
          const win = doc.defaultView;

          win.addEventListener('resize', this.log());
        });
        this.log();
      },
      beforeDestroy() {
        const doc = this.$el.ownerDocument;
        const win = doc.defaultView;
        win.removeEventListener('resize', this.log);
      },
    });
  },
};

export default DemoInstance;
