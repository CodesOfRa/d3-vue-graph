<template>
  <svg width="1100" height="1100">
    <g transform="translate(590,460)">
      <g class="links">
        <line
          v-for="d in links"
          :key="d.index+'link'"
          :id="d.index"
          :x1="d.source.x"
          :y1="d.source.y"
          :x2="d.target.x"
          :y2="d.target.y"
          :stroke="calculateLinkColour(d)"
          :stroke-width="calculateLinkWidth(d)"
        />
      </g>
      <g class="nodes" v-for="(d,index) in nodes" :key="index+'node'">
        <g :transform="calculateNodePosition(d)" text-anchor="middle">
          <text
            text-anchor="middle"
            :translate="calculateNodePosition(d)"
            v-show="yearLabel(d)"
          >{{d.name}}</text>
        </g>
        <circle
          :cx="d.x"
          :cy="d.y"
          :r="calculateR(d.name)"
          :fill="calculateColour(d)"
          @click="selectedNode(d)"
        />
      </g>
    </g>
  </svg>
</template>
<script>
import * as d3 from "d3";
import textures from "textures";
export default {
  props: ["data"],
  data: function() {
    return {
      dataTree: this.data,
      nodes: [],
      links: [],
      layout: null,
      nodesColour: ["#FF9163", "#FD6B6B", "#FF63FF", "#EB576F", "#FBD157"],
      linksColour: ["green", "orange"],
      r: [3, 6, 25],
      i: 0,
      t: textures.lines().thicker()
    };
  },
  mounted() {
    this.layout = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(function(d) {
          return d.index;
        })
      )
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(-75)
          .distanceMax([230])
      )
      .force("center", d3.forceCenter(15, 15));
  },
  watch: {
    data(newData) {
      var relations = [];
      var data = newData;
      this.filterChildren(data);
      this.createLinks(data, relations);
      relations.map((d, index) => {
        this.links.push({
          index: index,
          source: this.nodes[d[0]],
          target: this.nodes[d[1]]
        });
      });
      this.layout
        .nodes(this.nodes)
        .on("tick", () => {
          this.$forceUpdate();
        })
        .force("link")
        .links(this.links)
        .distance(40)
        .strength(0.3);
    }
  },
  methods: {
    filterChildren(data) {
      if (data.children) {
        data.children.map(this.filterChildren);
      }
      if (!data.id) {
        data.id = ++this.i;
      }
      this.nodes.push(data);
    },
    createLinks(data, relations) {
      if (data.children) {
        var id = this.nodes.findIndex(d => d.id === data.id);
        data.children.map(data => {
          //if it has children it means it has links
          if (data) {
            var index = this.nodes.findIndex(d => d.name === data.name);
            relations.push([id, index]);
            if (data.children) {
              this.createLinks(data, relations);
            }
          }
        });
      }
    },
    calculateR: function(name) {
      if (name === "OutOfMyLens") {
        return 3;
      } else if ([2015, 2016, 2017, 2018, 2019].includes(name)) {
        return 25;
      }
      return 6;
    },
    calculateColour: function(d) {
      if (d.name === "OutOfMyLens") {
        return "grey";
      } else if (d.hasOwnProperty("numComments")) {
        if (d.total >= 1000 && d.total < 3000) {
          return "#FD6B6B";
        }

        if (d.total > 5000) return "#FF63FF";
        if (d.total > 3000 && d.total < 5000) return "#EB579F";

        if (d.total < 1000) return "#FF9163";
      } else {
        return "#fbd157";
      }
      // return texture.url()
    },
    calculateLinkColour: function(d) {
      if (d.source.name !== "OutOfMyLens") {
        return "#FFB04D";
      } else {
        return "#36BF6D";
      }
    },
    calculateLinkWidth: function(d) {
      if (d.source.name !== "OutOfMyLens") {
        return 1;
      } else {
        return 3;
      }
    },
    selectedNode(d) {
      this.$emit("onNodeSelection", d);
    },
    yearLabel(d) {
      if ([2015, 2016, 2017, 2018, 2019].includes(d.name)) {
        return true;
      } else {
        return false;
      }
    },
    calculateNodePosition(d) {
      // console.log("____");
      return `translate(${d.x},${d.y})`;
    }
  }
};
</script>
<style>
</style>


