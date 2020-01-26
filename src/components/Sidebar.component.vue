<template lang="pug">
  .sidebar
    //- Logo
    router-link(:to="{name: 'home'}")
      img.custom-logo(:src="logo" v-if="logo")
      Didor(v-else)

    //- Menu
    nav.sidebar__nav(v-if="links")
      //- Level 1
      ul
        li(v-for="(level1, key1) in links" :key="key1")
          router-link(:to="level1.slug" v-if="level1.link") {{ level1.title }}
          p(v-else) {{ level1.title }}

          //- Level 2
          ul(v-if="level1.childNodes")
            li(v-for="(level2, key2) in level1.childNodes" :key="key2")
              router-link(:to="level2.slug" v-if="level2.link") {{ level2.title }}
              p(v-else) {{ level2.title }}

              //- Level 3
              ul(v-if="level2.childNodes")
                li(v-for="(level3, key3) in level2.childNodes" :key="key3")
                  router-link(:to="level3.slug") {{ level3.title }}
</template>

<script>
import Didor from '@/components/Didor.component.vue';

export default {
  components: {
    Didor,
  },

  props: {
    logo: {
      type: String,
      default: '',
    },
    links: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.custom-logo {
  display: block;
  height: 100px;
  margin: 0 auto double();
  cursor: pointer;
}

.sidebar__nav {
  li {
    margin: 0;
    list-style: none;
  }

  li > p,
  li > p > a {
    display: block;
    margin-bottom: 0;
    font-size: font-size(small1);
    font-weight: font-weight(bold);
    color: color(gray2);
    text-transform: uppercase;

    &.router-link-active {
      color: color(brand);

      @include hover {
        color: color(brand-darker);
      }
    }
  }

  li > p > a {
    @include hover {
      color: color(brand);
    }
  }

  li > a {
    display: block;
    font-size: font-size(small1);
    color: color(gray3);

    @include hover {
      color: color(brand);
    }

    &.router-link-active {
      color: color(brand);

      @include hover {
        color: color(brand-darker);
      }
    }
  }

  li > p > a,
  li > ul {
    margin-bottom: half();
  }

  li > ul {
    padding-top: quarter();
    border-top: 1px solid color(border);
  }

  li > ul > li > p {
    font-size: font-size(small2);
    color: color(gray4);
    opacity: 0.7;
  }

  li > ul > li > ul {
    padding-top: 0;
    border-top: none;
  }
}

@include media(portrait) {
  .custom-logo {
    height: 80px;
  }
}
</style>
