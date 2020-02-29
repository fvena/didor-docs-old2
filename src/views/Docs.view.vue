<template lang="pug">
.docs(:class="{ 'docs--no-sidebar': !sidebarLinks.length, 'docs--show-device': deviceShow }")

  //- Sidebar Area
  Sidebar.docs__sidebar(
    :logo="logo"
    :links="sidebarLinks")

  .docs__main(ref="docsContent")
    //- Header Area
    Header(
      v-if="navbarLinks || github"
      :github="github"
      :links="navbarLinks")

    .docs__content
      .wrapper
        //- .error(v-if="error")
        //-   h1 Lo sentimos, no se han podido cargar los links de las secciones.
        //-   h2 {{ error }}
        //- Content Area

        Article(
          v-if="content"
          :data="content")

        //- Footer Area
        Footer(
          v-if="sidebarLinks.length && article"
          :prevArticle="article.prev"
          :nextArticle="article.next")

      Device(
        v-if="deviceShow"
        :component="component")
</template>

<script>
import Sidebar from '@/components/Sidebar.component.vue';
import Header from '@/components/Header.component.vue';
import Article from '@/components/Article.component.vue';
import Footer from '@/components/Footer.component.vue';
import Device from '@/components/Device.component.vue';
import FileService from '@/services/file.service';
import ParamsUtil from '@/utils/params.utils';
import ArrayUtil from '@/utils/array.utils';

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
      logo: '',
      github: '',
      defaultPath: '',
      navbarPath: '',
      sidebarPath: '',
      section: null,
      article: null,
      sidebarLinks: [],
      navbarLinks: [],
      content: '',
      component: '/Button.demo.vue',
      // error: '',
      // isLoading: false,
      deviceShow: false,
    };
  },

  methods: {
    /**
     * Obtiene los datos para mostrar la documentación
     *
     * @params {String} routeTo - Ruta de destino
     * @params {String} routeFrom - Ruta de origen
     */
    async getData(routeTo, routeFrom) {
      /**
       * Si no se especifica ninguna ruta y tengo un artículo por defecto
       * redirijo a dicho artículo
       */
      if (routeTo === '/' && this.defaultPath) {
        this.$router.push(this.defaultPath);
        return;
      }

      /**
       * Cuando tenemos secciones y no se especifica ninguna ruta, redirecciono a la primera sección
       * El listado 'this.navbarLinks' puede contener una estructura anidada
       * para asegurarme que obtengo el primer link, lo busco en una estructura plana
       */
      if (routeTo === '/' && ArrayUtil.checkArray(this.navbarLinks)) {
        const flatNavbarLinks = ArrayUtil.flattenList(this.navbarLinks);
        const firstSection = flatNavbarLinks[0].slug;
        this.$router.push(firstSection);
        return;
      }

      /**
       * Si la sección ha cambiado, obtenemos la nueva sección y el sidebar
       */
      const fromSection = ParamsUtil.getSection(routeFrom);
      const toSection = ParamsUtil.getSection(routeTo);

      if (fromSection !== toSection) {
        /**
         * Si la sección ha cambiado, inicializo los valores
         */
        this.section = null;
        this.sidebarLinks = [];

        /**
         * Si tenemos secciones, busco la sección actual
         */
        if (ArrayUtil.checkArray(this.navbarLinks)) {
          const section = await ArrayUtil.searchItemBySlug(this.navbarLinks, toSection);
          this.section = section.current;
        }

        /**
         * Compruebo si la sección actual es un archivo o un directorio
         * si es un directorio, intento obtener el listado de artículos
         */
        const sectionIsFolder = this.section && this.section.link.slice(-3) !== '.md';

        if (sectionIsFolder) {
          const sidebarPath = `${this.section.link}/${this.sidebarPath}`;
          const sectionSlug = this.section.slug;
          this.sidebarLinks = await FileService.getLinks(sidebarPath, sectionSlug);
        }
      }

      /**
       * Si tenemos un listado de artículos, busco el artículo actual
       */
      this.article = null;
      this.content = '';
      this.deviceShow = false;

      if (ArrayUtil.checkArray(this.sidebarLinks)) {
        /**
         * Cuando no se especifica ninguna ruta o la ruta es una sección,
         * redirecciono al primer artículo de la sección
         * El listado 'this.sidebarLinks' puede contener una estructura anidada
         * para asegurarme que obtengo el primer link, lo busco en una estructura plana
         */
        if (routeTo === '/' || (this.section && this.section.slug === routeTo)) {
          const flatSidebarLinks = ArrayUtil.flattenList(this.sidebarLinks);
          const firstArticle = flatSidebarLinks[0].slug;
          this.$router.push(firstArticle);
          return;
        }

        this.article = await ArrayUtil.searchItemBySlug(this.sidebarLinks, routeTo);
      }

      /**
       * Obtenemos el contenido del árticulo y los datos
       */
      const link = this.article ? this.article.current.link : this.section ? this.section.link : '';
      const content = link ? await FileService.getArticle(link) : null;
      const title = this.article ? this.article.current.title : this.section.title;
      this.content = content && content.render ? content.render : '';
      this.deviceShow = content && content.data && content.data.device ? content.data.device : false;

      document.title = `${window.$didor.title} - ${title}`;
    },
  },

  async created() {
    /**
     * Obtengo la configuración del proyecto
     */
    this.logo = window.$didor.logo || '';
    this.github = window.$didor.gitRepoLink || '';
    this.defaultPath = window.$didor.defaultPath || '';
    this.navbarPath = window.$didor.navbar || '_navbar.md';
    this.sidebarPath = window.$didor.sidebar || '_sidebar.md';

    document.title = window.$didor.title;

    /**
     * Intento obtener los links de la secciones
     */
    this.navbarLinks = await FileService.getLinks(this.navbarPath);

    /**
     * Obtengo los datos de la ruta
     */
    this.getData(this.$route.path);
  },

  async beforeRouteUpdate(routeTo, routeFrom, next) {
    /**
     * Por defecto, si la ruta de destino apunta a una sección y no a un artículo
     * redirijo al primer artículo de dicha sección.
     * El problema es que si estoy en el primer artículo de la sección,
     * y pulso en algún enlace que apunte a la sección,
     * al intentar ir a la misma ruta en la que me encuentro se genera un error.
     * Para evitarlo, compruebo cuando se dá el caso y evito que la redirección.
     */

    /**
     * Cuando tenemos secciones:
     * Si la ruta de destino apunta a la sección actual,
     * compruebo si la ruta de ORIGEN coincide con el primer artículo de la sección,
     * en cuyo caso no debo realizar la redirección.
     */
    const sectionSlug = this.section ? this.section.slug : '/';

    if (this.sidebarLinks && routeTo.path === sectionSlug) {
      const flatSidebarLinks = ArrayUtil.flattenList(this.sidebarLinks);
      const firstSection = flatSidebarLinks[0].slug;
      if (routeFrom.path === firstSection) return;
    }

    /**
     * Cuando no tenemos secciones y tenemos un listado de artículos:
     * Si la ruta de destino apunta a la raíz, se cargará por defecto el primer artículo,
     * compruebo si la ruta de ORIGEN coincide con el primer artículo de la sección,
     * en cuyo caso no debo realizar la redirección.
     */
    if (!this.sidebarLinks && this.navbarLinks && routeTo.path === '/') {
      const flatNavbarLinks = ArrayUtil.flattenList(this.navbarLinks);
      const firstArticle = flatNavbarLinks[0].slug;
      if (routeFrom.path === firstArticle) return;
    }

    /**
     * Obtengo los datos de la nueva ruta
     */
    await this.getData(routeTo.path, routeFrom.path);

    next();
  },
};
</script>

<style lang="scss" scoped></style>
