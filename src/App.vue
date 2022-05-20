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
* {
  margin: 0;
  overflow-x: hidden;
}
#app {
  background: url(assets/background.svg) repeat left top;
  background-size: 250px;
  width: 100vw;
  min-height: 106vh;
  overflow-x: hidden;
  background-color: #0e4a57;
  display: flex;
  flex-direction: row;
  justify-content: center;
  #contentArea {
    overflow: hidden;
    width: 80vw;
    background-color: white;
    border-radius: 5px;
    margin-top: 3vh;
    margin-bottom: 3vh;
    max-width: 1800px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
      rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
  }
}
@media (max-width: 800px) {
  #contentArea {
    width: 95vw !important;
  }
}
</style>
