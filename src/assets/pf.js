export const pf = {
  extractName (item, index) {
    console.log('extracting names from individual info...')
    var str = item.toString().replace('/', '')
    const pid = str.substring(str.indexOf('"', 1), str.indexOf('@', 1))
    const pname = str.substring(str.indexOf('NAME', 1) + 5, str.indexOf('/', 1))
    var member = { id: pid, name: pname }
    // console.log('adding { id: ' + pid + ' name: ' + pname + ' } to names')
    this.names.push(member)
  },
  filterParents (famBlock) {
    console.log('extracting parent Id(s) from family composition info...')
    return (famBlock.toString().indexOf('HUSB') > 0 || famBlock.toString().indexOf('WIFE') > 0)
  },
  filterChildren (famBlock) {
    console.log('extracting parent Id(s) from family composition info...')
    return famBlock.toString().indexOf('CHIL') > 0
  },
  filterFamilyInfo (gedBlock) {
    console.log('extracting family composition information...')
    return gedBlock.toString().indexOf('@ FAM') > 0
  },
  filterPersonInfo (gedBlock) {
    console.log('extracting individual(s) information...')
    return gedBlock.toString().indexOf('INDI') > 0
  }
}
