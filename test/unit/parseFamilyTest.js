
var data = ["0 @F3@ FAM \r\n1 HUSB @P11@\r\n1 WIFE @P10@\r\n1 CHIL @P16@\r\n2 _FREL Natural\r\n2 _MREL Natural\r\n1 CHIL @P17@\r\n2 _FREL Natural\r\n2 _MREL Natural\r\n"]

data.replace("0 @", "")
    .replace("@ FAM \\r\\n1 HUSB @P", ": {'father': 'p")
    .replace("1 WIFE"," 'mother': ")
    .replace("1 CHIL", " 'children':[1 CHIL")
    .replace(/1 CHIL @P/g, "{'id': 'p")
    .replace(/\\r\\n2 _/g, "', '")
    .replace(/REL /g, "': '")
    .replace(/@\\r\\n/g, "',")
    .replace(/\\r\\n{/g, "'}, {")
    .replace(/ @P/g, " 'p")
    .replace(/@'/g, "'")
    .replace("\\r\\n", "'}]}")

    fam2json(item, index) {
      console.log('converting family string to json...')
      var famstr = item.replace("0 @", "").replace("@ FAM \\r\\n1 HUSB @P", ": {'father': 'p").replace("1 WIFE"," 'mother': ").replace("1 CHIL", " 'children':[1 CHIL").replace(/1 CHIL @P/g, "{'id': 'p").replace(/\\r\\n2 _/g, "', '").replace(/REL /g, "': '").replace(/@\\r\\n/g, "',").replace(/\\r\\n{/g, "'}, {").replace(/ @P/g, " 'p").replace(/@'/g, "'").replace("\\r\\n", "'}]}")
      this.fams.push(famstr)
    },

var family = data.toString().replace(/ @P/g, ':P').replace(/@/g, '')
// -> "0 F3 FAM \r\n1 HUSB:P11\r\n1 WIFE:P10\r\n1 CHIL:P16\r\n2 _FREL Natural\r\n2 _MREL Natural\r\n1 CHIL:P17\r\n2 _FREL Natural\r\n2 _MREL Natural\r\n"

var parents = family.toString().split('\r\n').filter(filterParents)
// -> ["0 F3 FAM ","1 HUSB:P11","1 WIFE:P10","1 CHIL:P16","2 _FREL Natural","2 _MREL Natural","1 CHIL:P17","2 _FREL Natural","2 _MREL Natural"]

var filterParents = function (famBlock) {
  return (famBlock.toString().indexOf('HUSB') > 0 || famBlock.toString().indexOf('WIFE') > 0)
}  // -> [1 HUSB:P11, 1 WIFE:P10]

var parent = parents.forEach(getParent)

getParent (item, index) {
  var str = item.toString()
  var beg = str.indexOf('@', 1)
  var end = str.lastIndexOf('@')
  const parentId = str.substr(beg, end).replace(/@/g, '')
  var parentName = (names.find(function (nam) {
    if (nam.id === parentId) {
      return nam.name
    }
  }))
  parent.push(seedName)
}

var familyUnit = {};

var parseFamily = function() {
  var family = fam.split('\r\n')
  var xId = family.find(getX).replace('1 WIFE ', '').replace(/@/g, '')
  var yId = family.find(getY).replace('1 HUSB ', '').replace(/@/g, '')
  var oIds = family.filter(getChildren).forEach(getId)
    familyUnit = { x: xId, y: yId, offSpring: oIds }
}

function getX(lin) { return lin.toString().indexOf('WIFE') > 0 }
function getY(lin) { return lin.toString().indexOf('HUSB') > 0 }
function getChildren(lin) { return lin.toString().indexOf('CHIL') > 0 }
function getId(item, index) { var res = item.toString().replace('1 CHIL ', '').replace(/@/g, '') }
