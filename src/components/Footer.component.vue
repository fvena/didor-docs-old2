<template lang="pug">
  .footer
    //- Prev link
    .pagination-item.pagination-item--previous
      router-link(:to="prevArticle.slug" v-if="prevArticle")
        .pagination-item-label
          svg.icon(width="10" height="16" viewBox="0 0 10 16")
            polyline(fill="none" vector-effect="non-scaling-stroke" points="8,2 2,8 8,14")
          span Anterior
        .pagination-item-title {{ prevArticle.title }}

    //- Next link
    .pagination-item.pagination-item--next
      router-link(:to="nextArticle.slug" v-if="nextArticle")
        .pagination-item-label
          span Siguiente
          svg(width="10" height="16" viewBox="0 0 10 16")
            polyline(fill="none" vector-effect="non-scaling-stroke" points="2,2 8,8 2,14")
        .pagination-item-title {{ nextArticle.title }}
</template>

<script>
export default {
  props: {
    prevArticle: {
      type: Object,
      default: () => {},
    },
    nextArticle: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: triple();
  overflow: hidden;
  border-top: 1px solid color(border);
}

.pagination-item {
  margin-top: simple();

  &:not(:last-child) a .pagination-item-label,
  &:not(:last-child) a .pagination-item-title {
    opacity: 0.3;
    transition: all 0.2s;
  }

  @include hover {
    a .pagination-item-label {
      opacity: 1;
    }

    a .pagination-item-title {
      text-decoration: underline;
      opacity: 1;
    }
  }
}

.pagination-item--previous {
  svg {
    margin-right: 0.5em;
  }
}

.pagination-item--next {
  text-align: right;

  svg {
    margin-left: 0.5em;
  }
}

.pagination-item-label {
  margin-bottom: -0.2rem;
  font-size: font-size(small1);
  color: color(gray4);
  opacity: 1;

  > * {
    line-height: 1;
    vertical-align: middle;
  }

  svg {
    width: auto;
    height: 0.8em;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1px;
  }
}

.pagination-item-title {
  font-size: font-size(h3);
  color: color(gray2);
  opacity: 1;
}
</style>
