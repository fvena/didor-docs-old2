<script>
import DemoInstance from '@/services/demo.service';

export default {
  render(h) {
    return h('iframe', {
      on: {
        load: this.renderChildren,
        resize: () => {
          // Resize action
        },
      },
      class: {
        demo: true,
      },
      attrs: {
        src: '/demo.html',
        frameborder: 0,
        resize: this.resize,
      },
    });
  },
  beforeUpdate() {
    // freezing to prevent unnessessary Reactifiation of vNodes
    this.iApp.children = Object.freeze(this.$slots.default);
  },
  methods: {
    renderChildren() {
      const children = this.$slots.default;
      const body = this.$el.contentDocument.body;
      const el = document.createElement('DIV'); // we will mount or nested app to this element
      body.appendChild(el);

      const iApp = DemoInstance.new(children);

      iApp.$mount(el); // mount into iframe

      this.iApp = iApp; // cache instance for later updates
    },
    resize() {
      // Resize action
    },
  },
};
</script>

<style lang="scss" scoped>
.demo {
  width: 100%;
  padding: 25px;
  margin: simple() 0;
  border: 1px solid color(border);
  border-radius: $border-radius;

  > * {
    margin: 0;
  }
}
</style>
