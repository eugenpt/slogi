function onBodyLoad(){
	console.log('LOAD')

	blink(' ')

	initWords();

	onTypeChange();
}



SOGL = 'ЙЦКНГШЩЗФВПРЛДЖХЧСМТБ'
GLAS = 'УЕЫАОЭЯИЮ'

GLAS_d = {};
[...GLAS].forEach(function(c){
	GLAS_d[c] = 1;
	GLAS_d[c.toLowerCase()]=1;
})

function nSyll(word){
	return [...word].filter((c)=>GLAS_d[c]==1).length;
}

function initWords(){
WbyNS = {}
for(var w of ALL_WORDS){
	var n = nSyll(w);
	if (WbyNS[n]){
		WbyNS[n].push(w);
	}else{
		WbyNS[n] = [w]
	}
}

WbyLevel = {
	0 : genAllSlogi(),
	1 : WbyNS[1].concat(
			WbyNS[2]
		).filter(w=>w.length<=3),
	2: WbyNS[1].concat(WbyNS[2]).filter(w=>w.length==4),
	3: WbyNS[2].filter(w=>w.length>4)
			   .concat(WbyNS[3])
			   .filter(w=>w.length<=6)
				,
	'X': WbyNS[2].filter(w=>w.length>4)
				 .concat(WbyNS[3])
				 .filter(w=>w.length>6)
				 .concat(WbyNS[4])
				 .concat(WbyNS[5])
				 .concat(WbyNS[6]),
	'ВСЕ': ALL_WORDS,
};

}

function _(s){
	if(s[0]=='#'){
		return document.getElementById(s.slice(1));
	}else if(s[0]=='.'){
		return document.getElementsByClassName(s.slice(1));
	} else {
		return document.getElementsByTagName(s);
	}
}


function randElt(arr){
	return arr[Math.floor(Math.random()*arr.length)]
}

function genRandomNumber(len){
	return [...Array(1*len).keys()].map((_)=>Math.floor(Math.random()*10)).join('')
}

function capitalize(s){
	return s[0].toUpperCase()+s.slice(1).toLowerCase();
}

function genRandomWord(){
	if (isTypeNumbers()) {
		return genRandomNumber(getLevel());
	} else {
		var w = randElt(WbyLevel[getLevel()])
		return randElt(
			[w.toLowerCase(), w.toUpperCase(), capitalize(w)
		]);
	}
	return (
		(Math.random() < 0.5)
		?randElt(SOGL) + randElt(GLAS)
		:randElt(GLAS) + randElt(SOGL)
	)
	return 'ПА' // enough for the first round
}

function genAllSlogi(){
	var R = [];
	[...SOGL].forEach(function(sogl){
		[...GLAS].forEach(function(glas){
			R.push(sogl+glas);
			R.push(glas+sogl);
		})
	})
	return R;
}

LAST_VALUES = {}

function onLevelChange(){
	LAST_VALUES[getType()] = getLevel();
}

function getRandomWord(n_syll){
	if(n_syll==null){
		return randElt(n_syll);
	}
}

function clearH1(){
	_('#h1').innerHTML = '&nbsp;';
}

function onSizeChange(){
	blink(getSize())
}

BLINK_Timeout = null;
function blink(stuff){
	clearTimeout(BLINK_Timeout);
	_('#h1').style.fontSize = getSize()+'vh';
	_('#h1').innerText = stuff;
	BLINK_Timeout = setTimeout(clearH1, getTime());
}

function onTimeChange(){
	blink(getTime())
}

function getSize(){
	return _('#sliderSize').value;
}
function getTime(){
	return _('#sliderTime').value;
}

WORD = 'ПА';

function onGo(){
	WORD = genRandomWord();
	onRepeat();
}

function onRepeat(){
	blink(WORD);
}

///

function isTypeNumbers(){
	return getType() =='числа';
}

function changeType(){
	_('#typediv').innerHTML = isTypeNumbers()?'слова':'числа';
	onTypeChange();
}

function getType(){
	return _('#typediv').innerHTML
}

function getLevelSelect(){
	return _('#level');
}

function clearLevels(){
	getLevelSelect().innerHTML = '';
}

function fillLevels(levels){
	levelSelect = getLevelSelect();
	clearLevels();
	levels.forEach(function(level){ 
		levelSelect.innerHTML += '<option value="'+level+'">'+level+'</option>';
	});
}

function getLevel(){
	return getLevelSelect().value;
}

function onTypeChange(){
	var levels = [1,2,3,4,5,6,7,8,9,10];

	if (isTypeNumbers()) {
		levels = [1,2,3,4,5,6,7,8,9,10];
	} else {
		levels = Object.keys(WbyLevel)
	}

	fillLevels(levels);

	if (LAST_VALUES[getType()]) {
		getLevelSelect().value = LAST_VALUES[getType()]
	}
}