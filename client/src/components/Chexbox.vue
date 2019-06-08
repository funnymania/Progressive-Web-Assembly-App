<template>
  <table>
    <tbody>
      <tr v-for="entry in supportedGroups">
        <td v-for="key in columns">{{entry[key]}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "Chexbox",
  props: {
    supportedGroups: Array
  }
};

// TODO: chunk supportedGroups into sets of three, and insert each
// set as a row into the grid.
</script>

<style lang="scss">
.chex-grid {
  display: grid;
  grid-template-columns: 15% 15% 15%;
  border: 1px white;
}
</style>
