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

    iframe.demo__iframe(:src="url" frameborder="0")

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
      url: '',
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

    getGeneratedPageURL(data) {
      const getBlobURL = (code, type) => {
        const blob = new Blob([code], { type });
        return URL.createObjectURL(blob);
      };

      /* eslint-disable */
      const source = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width,initial-scale=1.0" />
            <title>Didor Demo</title>
            <script src="https://unpkg.com/vue"><\/script>
            <script src="https://unpkg.com/http-vue-loader"><\/script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.10.7/sass.sync.min.js"><\/script>
            ${data.lib && `<script src="http://localhost:${data.port}/lib_bundle.js"><\/script>`}
            <style>
              html {
                font-family: 'Source Sans Pro', Helvetica Neue, Arial, sans-serif;
                font-style: normal;
                font-weight: 400;
                line-height: 1.6rem;
                color: #3b4c54;
              }

              #my-app {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 3.2rem 1.6rem;
              }
            </style>
          </head>

          <body>
            <div id="my-app">
              <my-component></my-component>
            </div>

            <script type="text/javascript">
              httpVueLoader.httpRequest = function(code) {
                return new Promise(function(resolve, reject) {
                  resolve(code);
                });
              };

              httpVueLoader.langProcessor.scss = function(scssText) {
                return new Promise(function(resolve, reject) {
                  Sass.compile(scssText, function (result) {
                    if ( result.status === 0 ) {
                      resolve(result.text)
                    } else {
                      reject(result)
                    }
                  });
                });
              }

              Vue.component("my-component", httpVueLoader(decodeURIComponent('${data.content}')));
              Vue.config.devtools = false;
              Vue.config.productionTip = false;
              Vue.config.silent = true;

              new Vue({
                el: '#my-app',
                updated() {
                  window.frameElement.style.height = document.body.scrollHeight + 'px';
                },
              });
            <\/script>
          </body>
        </html>
      `;
      /* eslint-enable */

      return getBlobURL(source, 'text/html');
    },

    async sendDemo(lib, port) {
      const content = this.$el.querySelector('#demoContent').textContent;

      const data = {
        content,
        lib,
        port,
      };

      this.url = this.getGeneratedPageURL(data);
    },
  },

  mounted() {
    const port = window.$didor.port;
    const lib = window.$didor.lib && window.$didor.lib.components;

    this.sendDemo(lib, port);
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
