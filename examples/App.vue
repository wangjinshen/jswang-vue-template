<template>
  <div id="app">
    <div class="warp">
      <Case @caseData="oncaseData"></Case>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    oncaseData (data) {
      console.log(data);
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.warp{
  width: 1000px;
  margin:  0  auto;
}
</style>
