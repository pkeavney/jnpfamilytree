
var fam = "0 @F3@ FAM\r\n1 HUSB @P11@\r\n1 WIFE @P10@\r\n1 CHIL @P16@\r\n2 _FREL Natural\r\n2 _MREL Natural\r\n1 CHIL @P17@\r\n2 _FREL Natural\r\n2 _MREL Natural";

childrenId = fam.split('\r\n').filter(getChildren).forEach(getId)

function getChildren(pid) {
	return pid.toString().indexOf('CHIL') > 0;
}

function getId(item, index) {
	var res = item.toString().replace('1 CHIL ', '').replace(/@/g, '');
    demoP.innerHTML = demoP.innerHTML + res + "<br>"; 
}
