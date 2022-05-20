<template>
  <div class="results">
    <div :class="[lexico ? 'correct' : '', 'card']">
      <p>Léxico</p>
    </div>
    <div :class="[sintatico ? 'correct' : '', 'card']"><p>Sintático</p></div>
    <div :class="[tautologico ? 'correct' : '', 'card']">
      <p>Tautológico</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lexico: Boolean,
    sintatico: Boolean,
    tautologico: Boolean,
  },
};
</script>

<style scoped lang="scss">
.results {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .card {
    width: 200px;
    height: 200px;
    margin: 10px;
    background-color: #560000;
    color: #fff;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      font-size: 20px;
      font-weight: 700;
    }
  }
  .card.correct {
    background-color: #275617;
  }
}
@media (max-width: 750px) {
  .results {
    flex-direction: column;
  }
}
</style>
