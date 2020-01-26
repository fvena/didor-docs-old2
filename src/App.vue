<template lang="pug">
  router-view
</template>

<script>
export default {
  created() {
    console.log(window.$didor.title);
    console.log('pepe');
  },
};
</script>
