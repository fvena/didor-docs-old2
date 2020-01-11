<template lang="pug">
.docs(:class="{ 'docs--no-sidebar': !links, 'docs--show-device': deviceShow }")

  //- Sidebar
  Sidebar.docs__sidebar(
    v-if="links"
    :logo="logo"
    :section="section"
    :links="links")

  .docs__main(ref="docsContent")
    //- Header
    Header(
      v-if="sections || github"
      :sections="sections"
      :github="github")

    //- Content
    router-view

    .docs__content
      .wrapper
        Article(
          v-if="content"
          :data="content")

        //- Footer
        Footer(
          v-if="links"
          :links="links"
          :article="article"
          :section="section")

      Device(v-if="deviceShow")
</template>

<script>
import Sidebar from '@/components/Sidebar.component.vue';
import Header from '@/components/Header.component.vue';
import Article from '@/components/Article.component.vue';
import Footer from '@/components/Footer.component.vue';
import Device from '@/components/Device.component.vue';
import JsonService from '@/services/json.service';
import MarkdownService from '@/services/markdown.service';
import ParamsUtil from '@/utils/params.utils';

export default {
  components: {
    Sidebar,
    Header,
    Article,
    Footer,
    Device,
  },

  data() {
    return {
      logo: null,
      github: null,
      links: [],
      article: null,
      section: null,
      sections: null,
      content: null,
      deviceShow: false,
    };
  },

  methods: {
    /**
     * Obtiene un listado con todos los links de las secciones
     */
    getNavbarLinks() {
      const path = 'sections.json';

      return JsonService.getFile(path);
    },

    /**
     * Obtiene un listado con todos los links de una sección
     */
    getSidevarLinks(section) {
      const path = `${section}/sidebar.json`;

      return JsonService.getFile(path);
    },

    async getArticle(params) {
      const path = `${params.section}${params.article}.md`;
      const article = await MarkdownService.getMarkdownArticle(path);
      this.content = article.markdown;
      this.deviceShow = article.data && article.data.device ? article.data.device : false;
    },
  },

  /**
   * Get links the first time that component is loaded
   */
  async created() {
    const params = ParamsUtil.getArticlePath(this.$route.path);

    this.article = params.article;
    this.section = params.section;
    this.logo = window.$didor.logo || null;
    this.github = window.$didor.gitRepoLink || null;
    this.sections = await this.getNavbarLinks();
    this.links = await this.getSidevarLinks(this.section);

    this.getArticle(params);
  },

  updated() {
    this.$refs.docsContent.scrollTop = 0;
  },

  /**
   * Get links only when route update and the section is different
   */
  async beforeRouteUpdate(routeTo, routeFrom, next) {
    const fromParams = ParamsUtil.getArticlePath(routeFrom.path);
    const toParams = ParamsUtil.getArticlePath(routeTo.path);

    if (fromParams.section !== toParams.section) {
      this.section = toParams.section;
      this.links = await this.getSidevarLinks(toParams.section);
    }

    this.article = toParams.article;
    await this.getArticle(toParams);
    next();
  },
};
</script>

<style lang="scss" scoped></style>
