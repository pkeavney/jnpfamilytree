<template>
  <div id="gedcom-file-loader">
    <input type="file" id="file" @change="upload">
    <!-- <br/><p>{{ gedfile }}</p>
    -->
    <br/>
    <button @click="parse">Load</button>
    <br/>
    <br/>
    <div id="preview">
      </ul>
        <li v-for="seed in seeds">{{seed.name}}</li>
      </ul>
      <!-- <pre>{{ block }}</pre> -->
<!--       <table>
        <tr>
          <td>{{ seeds }}</td>
        </tr>
        <tr>
          <td>{{ names }}</td>
        </tr>
      </table>
 -->    </div>
  </div>
</template>

<script>
import { bus } from '../main'

export default {
  name: 'gedcom-file-loader',
  // props: { seeds },
  data () {
    return {
      gedfile: '',
      content: '',
      family: [],
      person: [],
      seeds: [],
      names: [],
      block: '',
      blocks: [],
      seedOpts: []
    }
  },
  methods: {
    loaded (evt) {
      console.log('loading data...')
      var fileString = evt.target.result
      // console.log('file contents:\n' + fileString)
      this.content = fileString
    },
    upload (evt) {
      console.log('uploading Gedcom file...')
      // @TODO - check for multiple files, throwing an ERROR if TRUE
      var file = document.getElementById('file').files[0]
      if (file) {
        this.gedfile = file.name
        var reader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        reader.onload = this.loaded
      } else {
        alert('Error Reading Gedcom File')
      }
    },
    filterCrlf (item, index) {
      this.block += item.toString().replace(/\r\n/g, ' ') + '\n'
    },
    extractSeed (item, index) {
      console.log('creating list of possible seeds from parent Ids...')
      var str = item.toString()
      var beg = str.indexOf('@', 1)
      var end = str.lastIndexOf('@')
      const seedId = str.substr(beg, end).replace(/@/g, '')
      // use the seedId to get the name from names[]
      // const seedName = this.person.find(this.getName(seedId))
      var seedName = (this.names.find(function (nam) {
        // console.log('checking ' + nam.name + ' for id=' + seedId)
        if (nam.id === seedId) {
          // console.log('returning ' + nam.name)
          return nam.name
        }
      }))
      // var seedling = { id: seedId, name: seedName, spouse: '' }
      // console.log('adding { id: ' + seedId + ' name: ' + seedName + ' spouse:} to seeds')
      this.seeds.push(seedName)
    },
    extractName (item, index) {
      console.log('extracting names from individual info...')
      var str = item.toString().replace('/', '')
      var idBeg = str.indexOf('"', 1)
      var idEnd = str.indexOf('@', 1)
      var nameBeg = str.indexOf('NAME', 1) + 5
      var nameEnd = str.indexOf('/', 1)
      const pid = str.substring(idBeg, idEnd)
      const pname = str.substring(nameBeg, nameEnd)
      var member = { id: pid, name: pname }
      // console.log('adding { id: ' + pid + ' name: ' + pname + ' } to names')
      this.names.push(member)
    },
    filterParents (famBlock) {
      console.log('extracting parent Id(s) from family composition info...')
      return (famBlock.toString().indexOf('HUSB') > 0 || famBlock.toString().indexOf('WIFE') > 0)
    },
    filterFamilyInfo (gedBlock) {
      console.log('extracting family composition information...')
      return gedBlock.toString().indexOf('@ FAM') > 0
    },
    filterPersonInfo (gedBlock) {
      console.log('extracting individual(s) information...')
      return gedBlock.toString().indexOf('INDI') > 0
    },
    parse (evt) {
      console.log('parsing Gedcom file...')
      this.blocks = this.content.split('0 @')
      this.person = this.blocks.filter(this.filterPersonInfo)
      this.family = this.blocks.filter(this.filterFamilyInfo)
      console.log('found ' + this.person.length + ' persons in ' + this.family.length + ' families')
      this.seedOpts = this.family.toString().split('\r\n').filter(this.filterParents)
      this.seeds = []
      this.names = []
      this.person.forEach(this.extractName)
      this.seedOpts.forEach(this.extractSeed)
      this.block = this.seeds
      if (this.seeds.length > 0) {
        console.log('emitting seedsAvailable Event...')
        this.$emit('updat', this.seeds)
      } else {
        console.log('seedsAvailable Event not emitted...')
      }
    }
  },
  created () {
    console.log('gedcom-file-loader created event..')
    // bus.$on('parse', data => {
    // })
  },
  mounted () {
    console.log('gedcom-file-loader mounted event..')
  },
  updated () {
    console.log('gedcom-file-loader updated event..')
    this.$nextTick(function () {
      console.log('flushing Vue instance queue') // => 'updated'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #gedcom-file-loader {
    grid-column: 1 / span 2 ;
    grid-row: 1 / span 1 ;
    font-size: .8em;
    border: 2px solid gray;
  }
  #preview {
    width: 1200px;
    height: 400px;
    /*font-size: .7em;*/
    overflow: auto;
    padding: 2px;
    background-color: white;
    border: 1px black;
  }
  td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
</style>
