<template lang="pug">
  .demo(:class="{'demo--showCodeBlock': showCodeBlock}")
    .demo__header
      .demo__header__buttons
        .demo__header__button.demo__header__button--red
        .demo__header__button.demo__header__button--yellow
        .demo__header__button.demo__header__button--green
      .demo__header__title {{ title }}
      .demo__header__actions
        .demo__header__action(v-if="toggleCode" @click="toggleCodeBlock") Código

    iframe#iframe.demo__iframe(
      src="/demo.html"
      frameborder="0"
      @load="sendDemo")

    transition(
      name="collapse"
      @before-enter="start"
      @enter="end"
      @before-leave="end"
      @leave="start")
      .demo__code(v-if="showCodeBlock")
        slot(name="code")

    #demoContent.demo__content
      slot
</template>

<script>
export default {
  props: {
    toggleCode: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showCodeBlock: this.toggleCode,
    };
  },
  methods: {
    toggleCodeBlock() {
      this.showCodeBlock = !this.showCodeBlock;
    },
    start(el) {
      el.style.height = '0';
    },
    end(el) {
      el.style.height = `${el.scrollHeight}px`;
    },

    sendDemo() {
      const iframe = this.$el.querySelector('#iframe');
      const content = this.$el.querySelector('#demoContent').textContent;

      iframe.contentWindow.postMessage(content, '*'); // eslint-disable-line
    },
  },
};
</script>

<style lang="scss">
.demo {
  @include shadow(3);

  margin: double() 0;
  border: 1px solid color(gray6);
  border-radius: $border-radius;

  &--showCodeBlock {
    .demo__header__action {
      color: color(brand);
    }
  }

  &__iframe {
    width: 100%;
  }

  &__code {
    position: relative;
    overflow: hidden;
    border-top: 1px solid color(gray6);
    transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);

    pre {
      padding-top: size(1.5);
      padding-bottom: size(1.5);
      margin-bottom: 0;
      border-radius: 0 0 $border-radius $border-radius;
    }

    pre.hasFile {
      padding-top: size(2.5) !important;

      // .line-numbers-rows {
      //   padding-top: size(2.5) !important;
      // }
    }
  }

  &__content {
    display: none;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: simple();
    padding: 0 half();
    background-color: color(gray6);
    border-radius: $border-radius $border-radius 0 0;

    &__button {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 3px;
      border-radius: 4px;

      &--red {
        background-color: color(danger);
      }
      &--yellow {
        background-color: color(warning);
      }
      &--green {
        background-color: color(success);
      }
    }

    &__title {
      font-size: font-size(small1);
      color: color(gray3);
    }

    &__action {
      font-size: font-size(small2);
      font-weight: font-weight(bold);
      text-transform: uppercase;
      cursor: pointer;

      @include hover {
        color: color(brand);
      }
    }
  }

  .line-numbers .line-numbers-rows {
    top: calc(0.8rem + #{simple()}) !important;
  }
}
</style>
