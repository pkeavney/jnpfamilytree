<template>
  <div id="tree-graph">
    <!-- draw tree here -->
    INSERT TREE
    <treeGraph/>
  </div>
</template>

<script>
//  import d3 from 'd3'
import treeGraph from '../assets/G2.svg'

export default {
  name: 'tree-graph',
  components: {
    treeGraph
  }
}
</script>

<!-- <style scoped>
  #tree-graph {
    grid-column: 3 / span 1 ;
    grid-row: 1 / span 4 ;
    border: 2px solid gray;
    overflow: scroll;
  }
</style>
 -->
