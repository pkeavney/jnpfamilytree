<template>
  <div id="seed-selector" v-on:chg="chg()">
    <div id="search-4-name">
      Search Names: <br/>
<!--       First: <input type="search" @keyup="filterNames('F')">
      Last: <input type="search" @keyup="filterNames('L')">
 -->
    </div>
    <br/>
    <p> {{ names }} </p>
    <ol id="seed-list">
      <li v-for="name in names" :key="name.id">{{name.name}}</li>
    </ol>
<!--       <ol id="spouse-list">
        <li v-for="name in names" :key="name.id">{{name.name}}</li>
      </ol>
    -->
  </div>
</template>

<script>
// import { bus } from '../main'

export default {
  name: 'seed-selector',
  props: [ 'names' ],
  data () {
    return {
      seeds: []
    }
  },
  methods: {
    chg (event) {
      console.log('something changed!!!')
      this.names = event.data
    }
  },
  // filters: {
  // },
  // methods: {
  //   filterNames (evt, name) {
  //     console.log('Filter ' + name + ' names on ')
  //   },
  //   setSeed (evt) {
  //     console.log('Set seed to ')
  //   },
  //   setSeedSpouse (evt) {
  //     console.log('Set seed spouse to ')
  //   }
  // },
  created () {
    console.log('seed-selector created event..')
  },
  mounted () {
    console.log('seed-selector mounted event..')
    this.seeds = this.names
  },
  updated () {
    console.log('seed-selector updated event..')
  }
}
</script>

<!-- <style scoped>
  #seed-selector {
    display: grid;
    grid-template-columns: 1fr 1fr 3fr;
    grid-template-rows: 1fr 2fr 3fr;
    grid-gap: 2px;
    padding: 5px;
    border: 2px solid gray;
  }

  #search-4-name {
    grid-column: 1 / span 2 ;
    grid-row: 1 / span 1 ;
    grid-gap: 5px;
    font-size: .8em;
    padding: 5px;
  }

  #list-names {
    grid-column: 1 / span 1 ;
    grid-row: 2 / span 3 ;
    background-color: rgb(255, 255, 255);
    border: 2px solid gray;
    overflow: scroll;
    cursor: pointer;
  }

  #seed-list {
    grid-column: 1 / span 1 ;
    grid-row: 2 / span 3 ;
    background-color: rgb(255, 255, 255);
    padding: 1px;
    border: 2px solid gray;
    overflow: scroll;
    cursor: pointer;
  }

  #spouse-list {
    grid-column: 2 / span 1 ;
    grid-row: 2 / span 1 ;
    background-color: rgb(255, 255, 255);
    padding: 1px;
    border: 2px solid gray;
    overflow: scroll;
    cursor: pointer;
  }

  ol, ul {
    list-style-type: none;
    background-color: rgb(255, 255, 255);
    padding: 1px;
    border: 2px solid gray;
    overflow: scroll;
    cursor: pointer;
  }

  li {
    display: block;
    padding: .1em;
    font-size: .6em;
  }
</style> -->
