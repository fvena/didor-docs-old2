<template lang="pug">
  .header(:class="{'header--github': github}")
    //- Navigation header
    nav.header__nav(v-if="links.length > 0")
      //- level 1
      ul
        li(v-for="(level1, key1) in links" :key="key1")
          router-link(:to="level1.slug" v-if="level1.slug") {{ level1.title }}
          p(v-else) {{ level1.title }}

          //- level 2
          ul(v-if="level1.childNodes")
            li(v-for="(level2, key2) in level1.childNodes" :key="key2")
              router-link(:to="level2.slug") {{ level2.title }}

    //- Github Link
    Github-Octo(v-if="github" :githubUrl="github")
</template>

<script>
import GithubOcto from '@/components/GithubOcto.component.vue';

export default {
  components: {
    GithubOcto,
  },
  props: {
    links: {
      type: Array,
      required: false,
    },
    github: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
$header-height: triple();
$header-height-media: double();
$sidebar-width: 240px;
$sidebar-width-large: 300px;

.header {
  height: $header-height;
}

.header--github {
  padding-right: $header-height;
}

.header.header--toggle-sidebar {
  .sidebar-toggle {
    left: 0;
  }
}

.sidebar-toggle {
  position: fixed;
  top: 0;
  left: $sidebar-width;
  z-index: 10;
  width: double();
  height: $header-height;
  line-height: $header-height;
  text-align: center;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.9);
  border: 0;
  outline: none;
  transition: 0.5s cubic-bezier(0.91, 0.06, 0.47, 1.05) left;

  @include hover {
    color: color(brand);
  }

  &::before {
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    width: 0;
    height: 100%;
    content: '';
    background-color: rgba(255, 255, 255, 0.9);
    transition: 0.5s cubic-bezier(0.91, 0.06, 0.47, 1.05) width;
  }
}

.sidebar-toggle-button {
  position: relative;
  z-index: 1;
  display: inline-block;
  vertical-align: middle;
}

.sidebar-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  margin-bottom: 4px;
  background-color: color(brand);
}

.header__nav {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;

  li {
    position: relative;
    margin: 0;
    list-style: none;

    a {
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
  }

  > ul {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0;

    > li > p,
    > li > a {
      height: $header-height;
      padding: 0 half();
      line-height: $header-height;
      color: color(gray3);
      cursor: pointer;
    }

    > li:last-of-type p,
    > li:last-of-type a {
      padding-right: half();
    }

    > li {
      @include hover {
        ul {
          display: block;
        }
      }
    }

    > li ul {
      position: absolute;
      top: double() + quarter();
      right: 0;
      z-index: $z-index-dropdown;
      display: none;
      min-width: 100%;
      max-height: calc(100vh - #{double()});
      padding: half() 0;
      overflow-y: auto;
      text-align: left;
      background-color: #ffffff;
      border: 1px solid color(border);
      border-bottom-color: color(border);
      border-radius: $border-radius;
    }

    > li ul li {
      min-width: 100%;
      font-size: font-size(small1);
      white-space: nowrap;

      a {
        width: max-content;
        padding: 0 half();
        cursor: pointer;
      }
    }
  }
}

@include media(screen) {
  .sidebar-toggle {
    left: $sidebar-width-large;
  }
}

@include media(portrait) {
  .header {
    height: $header-height-media;
  }

  .header--github {
    padding-right: $header-height-media;
  }

  .sidebar-toggle {
    left: 0;
    height: $header-height-media;
    line-height: $header-height-media;
  }

  .header__nav {
    > ul {
      > li > p,
      > li > a {
        height: $header-height-media;
        line-height: $header-height-media;
      }
    }
  }

  .header.header--toggle-sidebar {
    .sidebar-toggle {
      left: $sidebar-width-large;
    }
  }
}

@include media(palm) {
  .header__nav {
    display: none;
  }

  .github-octo {
    display: none;
  }
}
</style>
