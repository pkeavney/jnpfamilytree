<template>
  <div id="app">
    <div id="gedcom-file-load">
      <input type="file" id="file" @change="upload">
      <button @click="parse">Load</button>
    </div>
    <div/>

<!--     <div id="loadProgress">
      <div id="progressBar" v-bind:style="{ width: loadStat + '%'}"></div>
    </div>
 -->
    <div id="tree-graph">
      <treeGraph/>
      <!-- {{ loadStat }} -->
      <!-- {{ roots }} -->
      {{ roots.toString().replace(',', '\r\n') }}
      <!-- <svg></svg> -->
    </div>

    <div id="seed-pick">
      <label>Select a seed from the list below:</label>
      <br/><br/>
      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Search: </label><input type="text" v-model="nameFilter">
      <ul class="list">
        <li v-for="name in filteredNames" :key="name.id" @click="seedSelected(name)">{{name.name}}</li>
      </ul>
    </div>

    <div id="seed-display">
      <br/>
      <div id="seed">
        <label>Seed: </label><p style="margin-left: auto;">{{ seed.name }}</p>
      </div>
      <!-- <br/> -->
      <div id="spouse">
        <!-- <pre>{{ spouses }}</pre> -->
        <label>Spouse: </label><p style="margin-left: auto;" v-if="spouses.length===1" @change="spouseSelected(spouses[0])">{{ spouses[0].name }}</p>
        <ul style="margin-left: auto; margin-top: 0;" class="list" v-if="spouses.length>1">
          <li v-for="spouse in spouses" :key="spouse.id" @click="spouseSelected(spouse)">{{spouse.name}}</li>
        </ul>
      </div>
    </div>

    <div/>

  </div>
</template>

<script>
//import TreeGraph from './components/TreeGraph'
import treeGraph from './assets/rootsys.svg'

function Family (idx, mother, father, marrDate, children) {
  this.id = idx,
  this.mother = mother,
  this.father = father,
  this.marriageDate = marrDate,
  this.children = children,
  this.parents = [father, mother]
}

function Person (idx, name, dob, dDate, familyId) {
  this.id = idx,
  this.name = name,
  this.dob = dob,
  this.dDate = dDate,
  this.familyId = familyId
}

export default {
  name: 'App',
  components: {
    treeGraph,
//    'tree-graph': treeGraph
  },
  data () {
    return {
      gedfile: '',
      content: '',
      families: [],
      parents: [],
      names: [],
      nameFilter: '',
      entities: 0,
      // loadStat: 0,
      roots: [],
      spouses: [],
      seedSpouse: '',
      seed: ''
    }
  },
  computed: {
    filteredNames: function () {
      return this.names.filter((name) => {
        return name.name.match(this.nameFilter)
      })
    },
    loadStat: function () {
      while (this.entities > 0) {
        return Math.round(this.entities / (this.names.length + this.families.length))
      }
      return this.entities > 0 ? Math.round(this.entities / (this.names.length + this.families.length)) : 0
    }
  },
  // watch: {
  //   families: function () {
  //     this.loadStat = Math.round(this.entities / (this.names.length + this.families.length))
  //     console.log(this.loadStat + '% loaded')
  //   },
  //   names: function () {
  //     this.loadStat = Math.round(this.entities / (this.names.length + this.families.length))
  //     console.log(this.loadStat + '% loaded')
  //   }
  // },
  methods: {
    loaded (evt) {
      console.log('loading data...')
      var fileString = evt.target.result
      // console.log('file contents:\n' + fileString)
      this.content = fileString
    },
    upload (evt) {
      this.names = []
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
    getFamilyRoots (src, lvl, ind) {
      console.log(lvl + ' - ' + ind.name + '(' + ind.id + ') - ' + (ind.familyId === '' ? 'END' : ind.familyId))
      if (ind.familyId !== '') {
        const family = this.families.find(function (f) { return ind.familyId === f.id })
        if (family !== undefined) {
          console.log('parents: ' + family.parents)
          const mother = this.names.find(function (x) { return family.mother === x.id })
          if (mother !== undefined) { this.getFamilyRoots(src, lvl + 1, mother) }
          const father = this.names.find(function (y) { return family.father === y.id })
          if (father !== undefined) { this.getFamilyRoots(src, lvl + 1, father) }
        }
      }
      var c = Math.pow(2, lvl)
      this.roots.push(src + '-L' + lvl + '-' + c + '    ' + ind.name)
    },
    getSpouses (ind) {
      console.log('searching families for spouses of ' + ind.name + '(' + ind.id + ')')
      const fams = this.families.filter(function (f) { return f.parents.includes(ind.id) })
      console.log('Found ' + fams.length + ' families')
      var spouseList = []
      if (fams !== undefined && fams.length > 0) {
        var spouseId
        fams.forEach(function (fam) {
          const parents = fam.parents
          spouseId = parents.filter(function (p) {
            console.log('Parents: ' + p)
            return p !== ind.id
          })
          spouseList.push(spouseId.toString())
        })
      }
      this.spouses = this.names.filter(function (n) { return spouseList.includes(n.id) })
    },
    seedSelected (val) {
      console.log(val.name + ' selected as seed')
      this.seed = val
      this.nameFilter = ''
      this.roots = []
      this.getFamilyRoots('S1', 0, this.seed)
      this.roots.sort()
      this.getSpouses(this.seed)
    },
    spouseSelected (val) {
      console.log(val.name + ' selected')
      this.seedSpouse = val
      this.getFamilyRoots('S2', 0, this.seedSpouse)
      this.roots.sort()
    },
    extractInfo (item, index) {
      var itemStr = item.toString()
      const pid = itemStr.substring(itemStr.indexOf('"', 1), itemStr.indexOf('@', 1))
      const xname = itemStr.split('\r\n').filter(this.getName).toString().replace(/1 NAME/g, '').replace(/\//, '')
      const pname = xname.substr(1, xname.indexOf('/') - 1)
      const fam = itemStr.split('\r\n').filter(this.getFam).toString().replace('1 FAMC', '').replace(/@/, '')
      const famId = fam.substr(1, fam.indexOf('@') - 1)
      const dates = itemStr.replace(/\r\n2 DATE/g, '')
      const birth = dates.split('\r\n').filter(this.getBirth).toString().substr(-4, 4)
      const death = dates.split('\r\n').filter(this.getDeath).toString().substr(-4, 4)
      var member = new Person(pid, pname, birth, death, famId)
      console.log(pname + ' loaded...')
      this.names.push(member)
    },
    getName (pdata) {
      const str = pdata.toString()
      return (str.indexOf(' NAME ') > 0 && str.lastIndexOf('/') === pdata.length - 1)
    },
    parseFamily (item, index) {
      var itemStr = item.toString()
      const fid = itemStr.substr(0, itemStr.indexOf('@', 0))
      const yid = itemStr.split('\r\n').filter(this.getY).toString().replace('1 HUSB ', '').replace(/@/g, '')
      const xid = itemStr.split('\r\n').filter(this.getX).toString().replace('1 WIFE ', '').replace(/@/g, '')
      const mdt = itemStr.replace(/\r\n2 DATE/g, '').split('\r\n').filter(this.getMarriage).toString().substr(-4, 4)
      const children = itemStr.split('\r\n').filter(this.getChild).toString().replace(/1 CHIL /g, '').replace(/@/g, '').split(',')
      var fam = new Family(fid, xid, yid, mdt, children)
      this.families.push(fam)
    },
    extractName (item, index) {
      // console.log('extracting names from ' + item.toString())
      var str = item.toString().replace('/', '')
      const pid = str.substring(str.indexOf('"', 1), str.indexOf('@', 1))
      const pname = str.substring(str.indexOf('NAME', 1) + 5, str.indexOf('/', 1))
      var member = { id: pid, name: pname }
      console.log('adding { id: ' + pid + ' name: ' + pname + ' } to names')
      this.names.push(member)
    },
    getFam (pdata) {
      return pdata.toString().indexOf('FAMC') > 0
    },
    getX (pdata) {
      // console.log('filtering names...')
      return pdata.toString().indexOf('WIFE') > 0
    },
    getY (pdata) {
      // console.log('filtering names...')
      return pdata.toString().indexOf('HUSB') > 0
    },
    getMarriage (pdata) {
      // console.log('filtering birth dates...')
      return pdata.toString().indexOf('MARR') > 0
    },
    getBirth (pdata) {
      // console.log('filtering birth dates...')
      return pdata.toString().indexOf('BIRT') > 0
    },
    getDeath (pdata) {
      // console.log('filtering death dates...')
      return pdata.toString().indexOf('DEAT') > 0
    },
    filterParents (fam) {
      console.log('extracting parent Id(s) from family composition info...')
      return (fam.toString().indexOf('HUSB') > 0 || fam.toString().indexOf('WIFE') > 0)
    },
    getChild (fam) {
      console.log('extracting parent Id(s) from family composition info...')
      return fam.toString().indexOf('CHIL') > 0
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
      var person = this.blocks.filter(this.filterPersonInfo)
      var family = this.blocks.filter(this.filterFamilyInfo)
      // .toString().replace(/ @P/g, ':P').replace(/@/g, '')
      this.entities = person.length + family.length
      console.log('found ' + person.length + ' persons in ' + family.length + ' families')
      // var parents = family.toString().split('\r\n').filter(this.filterParents)
      // console.log('parents: ' + parents)
      // var children = family.toString().split('\r\n').filter(this.getChild)
      this.names = []
      this.families = []
      family.forEach(this.parseFamily)
      person.forEach(this.extractInfo)
      console.log('*******************************************')
      this.entities = 0
    },
    created () {
      console.log('App.vue created event..')
    },
    mounted () {
      console.log('App.vue mounted event..')
    },
    updated () {
      console.log('App.vue updated event..')
    }
  }
}
</script>

<style src="./style.css"></style>
