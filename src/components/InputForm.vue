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
        <button @click="addToFormula('∼')" class="addChar">∼</button>
        <button @click="addToFormula('∧')" class="addChar">∧</button>
        <button @click="addToFormula('v')" class="addChar">v</button>
        <button @click="addToFormula('→')" class="addChar">→</button>
        <button @click="addToFormula('↔')" class="addChar">↔</button>
      </div>
      <input type="submit" value="Ver Resultados" class="button grow" />
    </form>
    <display-result v-if="lexico != '' || lexico == false" />
  </div>
</template>

<script>
import displayResult from "./displayResult.vue";
export default {
  components: { displayResult },
  data: function () {
    return {
      formula: "",
      lexico: "",
      sintatico: "",
      tautologico: "",
    };
  },
  methods: {
    submitFormula(e) {
      e.preventDefault();

      this.lexico = "";
      this.sintatico = "";
      this.tautologico = "";

      this.lexico = this.analiseLexica();
      console.log(this.lexico);
    },
    addToFormula(valor) {
      this.formula += valor;
    },
    analiseLexica() {
      if (this.formula == "") {
        console.log("Formula está vazia");
        return false;
      }
      let acceptedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ∼∧v→↔()";
      let isValid = true;
      let invalidChar = "";
      for (let a of this.formula.replaceAll(" ", "").trim()) {
        let cur = false;
        for (let b of acceptedChars) {
          if (a == b) cur = true;
        }
        if (!cur) {
          isValid = false;
          invalidChar = a;
          break;
        }
      }
      if (isValid) {
        console.log("É Lexicalmente valido");
      } else {
        console.log("É invalido Lexicalmentte devido à (" + invalidChar + ")");
      }
      return isValid;
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Koulen&display=swap");
#inputFormula {
  min-height: 500px;
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
