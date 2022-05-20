<template>
  <div id="inputFormula">
    <p>
      Informe sua <span> Formula Proposicional </span> e veja o resultado dos
      provadores!
    </p>
    <form @submit="submitFormula" class="forms">
      <input
        type="text"
        v-model="formula"
        placeholder="Ex: (A → B) ∧ (B → A)"
        class="texto"
      />
      <div class="btns">
        <button type="button" @click="addToFormula('∼')" class="addChar grow">
          ∼
        </button>
        <button type="button" @click="addToFormula('∧')" class="addChar grow">
          ∧
        </button>
        <button type="button" @click="addToFormula('v')" class="addChar grow">
          v
        </button>
        <button type="button" @click="addToFormula('→')" class="addChar grow">
          →
        </button>
        <button type="button" @click="addToFormula('↔')" class="addChar grow">
          ↔
        </button>
      </div>
      <input type="submit" value="Ver Resultados" class="button grow" />
    </form>
    <loading v-if="loading" />
    <display-result
      :lexico="lexico"
      :sintatico="sintatico"
      :tautologico="tautologico"
      v-if="display"
    />
  </div>
</template>

<script>
import displayResult from "./displayResult.vue";
import AnalisarLexicalmente from "../utils/AnalisarLexicalmente";
import AnalisarSintaticamente from "../utils/AnalisarSintaticamente";
import Loading from "./loading.vue";
export default {
  components: { displayResult, Loading },
  data: function () {
    return {
      formula: "",
      lexico: false,
      sintatico: false,
      tautologico: false,
      display: false,
      loading: false,
    };
  },
  methods: {
    submitFormula(e) {
      e.preventDefault();
      console.log("Começando a analisar a formula: " + this.formula);
      this.display = false;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.display = true;
      }, 1500);

      this.lexico = AnalisarLexicalmente(this.formula);

      if (!this.lexico) {
        //se não é lexico tambem não é sintatico nem tautologico
        this.sintatico = false;
        this.tautologico = false;
      } else {
        this.sintatico = AnalisarSintaticamente(this.formula);
      }
    },
    analiseSintaticamente() {
      return true;
    },
    addToFormula(valor) {
      this.formula += valor;
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Koulen&display=swap");
#inputFormula {
  margin: 150px 0;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .forms {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .addChar {
      width: 30px;
      height: 30px;
      margin: 10px;
    }
    .texto,
    .button,
    .btns .addChar {
      height: 30px;
      border: none;
      box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
      border-radius: 5px;
      margin-bottom: 25px;
    }
    .texto {
      font-size: 17px;
      font-weight: 200;
      padding-left: 10px;
      width: 80%;
      max-width: 400px;
      outline: none;
    }
    .button {
      font-size: 20px;
      height: 35px;
      width: 50%;
      max-width: 200px;
      font-weight: 500;
      background: #0e4a57;
      color: white;
    }
  }
  p {
    text-align: center;
    font-size: 20px;
    max-width: 350px;
    font-weight: 500;
    margin-bottom: 20px;
    span {
      font-family: "Koulen", cursive;
    }
  }
}
.grow {
  transition: all 0.2s ease-in-out;
}
.grow:hover {
  transform: scale(1.1);
}
</style>
