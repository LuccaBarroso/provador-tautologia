<template>
  <div class="results">
    <div class="card"><p>Lexico</p></div>
    <div class="card"><p>Sintatico</p></div>
    <div class="card"><p>Tautologico</p></div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.results {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px;

  .card {
    width: 200px;
    height: 200px;
    margin: 10px;
    background-color: red;
  }
}
</style>
