<template>
  <div id="app">
    <div id="contentArea">
      <input-form />
    </div>
  </div>
</template>

<script>
import InputForm from "./components/InputForm.vue";

export default {
  components: { InputForm },
  name: "App",
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,200;8..144,400;8..144,500&display=swap");
* {
  font-family: "Roboto Flex", sans-serif;
  margin: 0;
  overflow-x: hidden;
}
#app {
  background: url(assets/background.svg) repeat left top;
  background-size: 250px;
  background-color: #0e4a57;
  // 560000 vermelho
  // 275617 verde

  width: 100vw;
  min-height: 100vh;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  #contentArea {
    transition: height 2s ease-in-out;
    width: 80vw;
    background-color: white;
    border-radius: 5px;
    max-width: 1400px;
    margin: 50px 0;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
      rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
  }
}
@media (max-width: 800px) {
  #contentArea {
    width: 90vw !important;
  }
}
</style>
