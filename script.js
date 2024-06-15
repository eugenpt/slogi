function onBodyLoad(){
    console.log('LOAD')

      const switchElement = document.getElementById('verticalSwitch');
      switchElement.addEventListener('click', () => {
        switchElement.classList.toggle('on');
      });

    blink(' ')

    WORD = makeOKLines('Гарри и Рон спасли Джинни из Тайной комнаты.');


    initWords();

    onTypeChange();
}


KEEP = 0;

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
    'Пред': ALL_SENTENCES,
    'Ист.': ALL_STORIES,
};

}

CUR_STORY = null;
CUR_STORY_PART_J = null;

function _(s){
    if(s[0]=='#'){
        return document.getElementById(s.slice(1));
    }else if(s[0]=='.'){
        return [...document.getElementsByClassName(s.slice(1))];
    } else {
        return [...document.getElementsByTagName(s)];
    }
}

function sentenceToWords(sent){
    return makeOKLines(sent);
    return sent.split(' ').join('\n');
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


function genNextStory(){
    CUR_STORY = randElt(WbyLevel[getLevel()]).map(x=>x);
    CUR_STORY.push('Конец.')
    CUR_STORY_PART_J = 0;
    return sentenceToWords(CUR_STORY[CUR_STORY_PART_J]);
}

function genRandomWord(){
    if (isTypeNumbers()) {
        return genRandomNumber(getLevel());
    } else {
        if (getLevel() == 'Ист.'){
            if((CUR_STORY===null) || (CUR_STORY_PART_J == CUR_STORY.length-1)){
                return genNextStory();
            } else {
                CUR_STORY_PART_J++;
                return sentenceToWords(CUR_STORY[CUR_STORY_PART_J]);
            }
            
        }
        var w = randElt(WbyLevel[getLevel()])
        if (getLevel() == 'Пред')
            return sentenceToWords(w);
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

function reset_cur_story(){
    CUR_STORY = null;
    CUR_STORY_PART_J = null;
}

function onLevelChange(){
    reset_cur_story();
    LAST_VALUES[getType()] = getLevel();

    _('#btnNextStory').style.display = (getLevel() == 'Ист.')?'':'none';
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
    blink(WORD);
    return;
    if(KEEP){
        show(WORD);
    }else{
        blink(getSize());
    }
}

function show(stuff){
    _('#h1').style.fontSize = getSize()+'vh';
    _('#h1').innerText = stuff;
}

BLINK_Timeout = null;
function blink(stuff){
    clearTimeout(BLINK_Timeout);
    show(stuff);
    if(KEEP==0)
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
        getLevelSelect().value = LAST_VALUES[getType()];
    }
    onLevelChange();
}


function onDarkChange(){
    if(_('#cbDark').checked){
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

function onKeepChange(){
    if(_('#cbKeep').checked){
        KEEP = 1;
        show(WORD);
        clearTimeout(BLINK_Timeout);
        _('#sliderTime').disabled=true;
        _('#repeat').style.display='none'
    } else {
        KEEP = 0;
        clearH1();
        _('#sliderTime').disabled=false;
        _('#repeat').style.display=''
    }
}


function onFontChange(){
    const h1 = _('#h1');
    h1.classList.toggle('myfont');
    _('#leftUpperSwitch').classList.toggle('blue');

    WORD = makeOKLines(WORD);
    if(_('#cbKeep').checked){
        show(WORD);
    }
}


function debugCheckCoef(coef){
    WORD = makeOKLines(WORD, coef);
    show(WORD);
}

function squareness(sent, coef){
    const h = sent.length;
    let COEF = (coef?coef:0.4);//(_('#cbFont').checked?1:0.6));
    console.log(COEF);
    const w = Math.max(...sent.map(x=>x.length)) * COEF;
    return Math.max(h,w) / Math.min(h,w);
}

function makeOKLines(sent, coef){
    if (typeof sent === 'string') {
        if(sent.indexOf(' ')<0){
            return sent;
        } else {
            sent = sent.split('\n').join(' ').split(' ');
        }
    } else if (Array.isArray(sent)) {
        if (sent.length<=3){
            return sent;
        }
    } else {
        return '???';
    }   


    while(true){
        let add_l = Math.min(...sent.map(x=>x.length));
        for(var j in sent){
            if(sent[j].length!=add_l)
                continue;

            new_sent = sent.slice();

            
            
            if((j>0) && ((j==sent.length-1) || ( new_sent[1*j-1].length < new_sent[1*j+1].length ))) {
                new_sent[j-1] += ' '+new_sent[j];
            }else if(j<sent.length-1) {
                new_sent[1*j+1] = new_sent[j]+' '+new_sent[1*j+1];
            } else 
                return sent.join('\n');


            new_sent.splice(j, 1);

            break

        }
        if(squareness(sent, coef) > squareness(new_sent, coef)){
            sent = new_sent;
        }else{
            break;
        }
    }

    

    return sent.join('\n');
}



//


function fontClass(fontmode){
    return 'font'+fontmode;
}

FONTMODE=0;
function onUpperSwitchClick(){
    let new_FONTMODE = (FONTMODE==4)?0:FONTMODE+1;

    _('.'+fontClass(FONTMODE)).forEach(e=>e.classList.add(fontClass(new_FONTMODE)));
    _('.'+fontClass(FONTMODE)).forEach(e=>e.classList.remove(fontClass(FONTMODE)));

    FONTMODE = new_FONTMODE;
    console.log(FONTMODE);
}

//


function nextStory(){
    WORD = genNextStory();
    blink(WORD);
}