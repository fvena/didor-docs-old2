<template lang="pug">
  .demo
    .demo__title(v-if="title")
      .demo__title__wrapper {{ title }}
    .demo__content(:class="{'demo__content--padding': padding}")
      slot
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    padding: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.demo {
  margin-bottom: 1.6rem;
}

.demo__title {
  padding: 0.8rem 0.8rem 0;
  margin-bottom: 0.8rem;
  // font-family: font-family(base);
  font-size: 0.85rem;
  font-weight: 700;
  color: #3b4c54;
  text-transform: uppercase;
}

.demo__title__wrapper {
  border-bottom: 1px solid #e7ebee;
}

.demo__content--padding {
  padding: 0 0.8rem;
}
</style>
