<template lang="pug">
.docs(:class="{ 'docs--no-sidebar': !sidebarLinks, 'docs--show-device': deviceShow }")

  //- Sidebar
  Sidebar.docs__sidebar(
    v-if="sidebarLinks"
    :logo="logo"
    :links="sidebarLinks")

  .docs__main(ref="docsContent")
    //- Header
    Header(
      v-if="navbarLinks || github"
      :github="github"
      :links="navbarLinks")

    //- Content
    router-view

    .docs__content
      .wrapper
        .error(v-if="navbarError")
          h1 Lo sentimos, no se han podido cargar los links de las secciones.
          h2 {{ navbarError }}

        .error(v-if="!navbarError && sidebarError")
          h1 Lo sentimos, no se han podido cargar los links de esta sección.
          h2 {{ sidebarError }}

        .error(v-if="!navbarError && !sidebarError && articleError")
          h1 Lo sentimos, no se han podido cargar el artículo.
          h2 {{ articleError }}

        Article(
          v-if="article"
          :data="article")

        //- Footer
        Footer(
          v-if="sidebarLinks"
          :index="articleIndex"
          :articles="articlesList")

      Device(v-if="deviceShow")
</template>

<script>
import Sidebar from '@/components/Sidebar.component.vue';
import Header from '@/components/Header.component.vue';
import Article from '@/components/Article.component.vue';
import Footer from '@/components/Footer.component.vue';
import Device from '@/components/Device.component.vue';
import MarkdownService from '@/services/markdown.service';
import ErrorService from '@/services/error.service';
import ParamsUtil from '@/utils/params.utils';
import ArrayUtil from '@/utils/array.utils';
import LinksUtils from '../utils/links.utils';

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
      section: '',
      path: '',
      sidebarLinks: [],
      navbarLinks: [],
      article: '',
      navbarError: '',
      sidebarError: '',
      articleError: '',
      isLoadingNavbar: false,
      isLoadingSidebar: false,
      isLoadingArticle: false,
      deviceShow: false,
    };
  },

  computed: {
    /**
     * Listado con todos los links en un único nivel
     */
    articlesList() {
      if (!this.sidebarLinks.length) return [];
      return ArrayUtil.flattenList(this.sidebarLinks);
    },

    /**
     * Posición dentro del listado de artículos del árticulo seleccionado actualmente
     */
    articleIndex() {
      if (!this.articlesList.length) return 0;
      return this.articlesList.findIndex(item => item.slug === this.path);
    },
  },

  methods: {
    /**
     * Obtiene un listado con todos los links de las secciones
     */
    async getNavbarLinks(path) {
      try {
        // Inicializo valores
        this.isLoadingNavbar = true;
        this.navbarError = '';
        this.navbarLinks = [];

        if (!path) return;

        // Obtengo los datos
        const links = await MarkdownService.getLinks(path);
        this.navbarLinks = await LinksUtils.getListLinks(links);
      } catch (error) {
        const errorId = ErrorService.getErrorId(error);

        switch (errorId) {
          case 404:
            this.navbarError = 'No se ha encontrado el archivo';
            break;
          default:
            this.navbarError = 'Ocurrió algún error al intentar parsear el archivo';
            break;
        }
      } finally {
        this.isLoadingNavbar = false;
      }
    },

    /**
     * Obtiene un listado con todos los links de una sección
     */
    async getSidebarLinks(section) {
      try {
        // Inicializo valores
        this.isLoadingSidebar = true;
        this.sidebarError = '';
        this.sidebarLinks = [];

        // Obtengo los datos
        const sidebarName = window.$didor.sidebar || '_sidebar.md';
        const path = `${section}/${sidebarName}`;
        const links = await MarkdownService.getLinks(path);
        this.sidebarLinks = await LinksUtils.getListLinks(links, section);
      } catch (error) {
        const errorId = ErrorService.getErrorId(error);

        switch (errorId) {
          case 404:
            this.sidebarError = 'No se ha encontrado el archivo';
            break;
          default:
            this.sidebarError = 'Ocurrió algún error al intentar parsear el archivo';
            break;
        }
      } finally {
        this.isLoadingSidebar = false;
      }
    },

    /**
     * Obtiene el artículo seleccionado
     */
    async getArticle() {
      try {
        // Inicializo valores
        this.isLoadingArticle = true;
        this.articleError = '';
        this.article = '';
        this.deviceShow = false;

        // Obtengo los datos
        const file = this.articlesList[this.articleIndex];
        const article = await MarkdownService.getMarkdownArticle(file.link);
        this.article = article.markdown || '';
        this.deviceShow = article.data && article.data.device ? article.data.device : false;
      } catch (error) {
        const errorId = ErrorService.getErrorId(error);

        switch (errorId) {
          case 404:
            this.articleError = 'No se ha encontrado el archivo';
            break;
          default:
            this.articleError = 'Ocurrió algún error al intentar parsear el archivo';
            break;
        }
      } finally {
        this.isLoadingArticle = false;
      }
    },
  },

  async created() {
    /**
     * Obtengo la configuración del proyecto
     */
    this.logo = window.$didor.logo || null;
    this.github = window.$didor.gitRepoLink || null;

    /**
     * Obtengo las secciones, sus links y el artículo
     */
    const navbarPath = window.$didor.navbar || '_navbar.md';
    this.path = this.$route.path;
    this.section = ParamsUtil.getSection(this.path);

    await this.getNavbarLinks(navbarPath);
    await this.getSidebarLinks(this.section);
    this.getArticle(this.path);
  },

  updated() {
    this.$refs.docsContent.scrollTop = 0;
  },

  async beforeRouteUpdate(routeTo, routeFrom, next) {
    /**
     * Solo si la sección ha cambiado, obtengo sus links
     */
    const fromSection = ParamsUtil.getSection(routeFrom.path);
    const toSection = ParamsUtil.getSection(routeTo.path);

    if (fromSection !== toSection) {
      this.section = toSection;
      await this.getSidebarLinks(toSection);
    }

    /**
     * Obtengo el artículo seleccionado
     */
    this.path = routeTo.path;
    await this.getArticle(routeTo.path);

    next();
  },
};
</script>

<style lang="scss" scoped></style>
