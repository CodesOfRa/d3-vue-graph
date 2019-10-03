<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <div>
      <tree :data="treeData" @onNodeSelection="selectedNode" />
    </div>

    <div>
      <h1 href="https://github.com/CodesOfRa/d3-vue-graph">My Instagram</h1>
      <div v-for="(colour,index) in nodesColour" :key="colour" class="legendColourItem">
        <div :style="{background:colour}" class="legendColour"></div>
        <span>{{legendValues[index]}}</span>
      </div>
      <div v-if="selected" class="details">
        <span>Total:{{selected.total}}</span>
        <img :src="selected.src" />
      </div>
    </div>
  </div>
</template>

<script>
var testing = {};
import Tree from "./components/Tree.vue";
import json from "./assets/data.json";
import * as d3 from "d3";
export default {
  name: "app",
  components: {
    Tree
  },
  data: function() {
    return {
      json,
      treeData: [],
      data: null,
      testing: testing,
      succes: false,
      nodesColour: ["#FF9163", "#FD6B6B", "#EB576F", "#FF63FF", "#FBD157"],
      legendValues: [
        "< 1000",
        ">=1000 & < 3000",
        ">=3000 & <5000",
        ">5000",
        "Years"
      ],
      selected: null
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let data = await d3.json("../data.json").finally(() => {
        this.succes = true;
      });
      // .then(data => (this.succes = true), reason => (this.succes = false));
      this.treeData = data;
      // this.data.push(data);

      //prepare data for d3 layout
    },
    selectedNode: function(data) {
      this.selected = data;
      // return data;
    }
  }
};
</script>

<style>
.home {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  display: flex;
}
.legendColour {
  width: 30px;
  height: 30px;
}
.legendColourItem {
  display: flex;
}
.details {
  display: flex;
  flex-flow: column;
  margin: 1rem 0rem;
  font-size: 2rem;
  font-weight: 500;
}
.details > img {
  height: 200px;
  border: 7px solid #fd6b6b;
}
</style>
