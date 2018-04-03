
persons=["0 @P12@ INDI \r\n1 SEX F\r\n1 BIRT \r\n2 DATE About 1919\r\n2 PLAC Sayre, Bradford, Pennsylvania, USA\r\n1 DEAT \r\n2 DATE About 1922\r\n2 PLAC Sayre, Bradford, Pennsylvania, USA\r\n1 NAME Shirley /McAnany/\r\n1 FAMC @F1@",
"0 @P13@ INDI \r\n1 NAME Mary Francis /Shirley/\r\n1 SEX F\r\n1 FAMC @F6@\r\n1 FAMS @F2@",
"0 @P14@ INDI\r\n1 SEX M\r\n\r\n1 NAME John Thomas /Eagleton/\r\n1 FAMS @F2@",
"0 @P15@ INDI\r\n1 SEX M\r\n1 NAME Gottfried /Shirley/\r\n1 FAMS @F6@"]

id = persons.toString().split('\r\n').filter(getPersons).forEach(getPersonId)
name = persons.toString().split('\r\n').filter(getPersons).forEach(getPersonName);

function getPersons(dat) {
  return dat.toString().indexOf('INDI') > 0;
}

function getPersonId(item, index) {
  var beg = item.indexOf('@P', 1);
  var end = item.lastIndexOf('@');
    var res = item.substring(beg, end).replace('@','id:');
    demoP.innerHTML = demoP.innerHTML + res + "<br>"; 
}

function getPersonName(item, index) {
  var res = item.toString().replace('1 NAME ', '').replace(/\//g, '');
    demoP.innerHTML = demoP.innerHTML + res + "<br>"; 
}
