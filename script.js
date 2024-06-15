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

function genNextStory(){
    CUR_STORY = randElt(WbyLevel[getLevel()]).map(x=>x);
    CUR_STORY.push('Конец.')
    CUR_STORY_PART_J = 0;
    return sentenceToWords(CUR_STORY[CUR_STORY_PART_J]);
}

function getRandomWord(n_syll){
    if(n_syll==null){
        return randElt(n_syll);
    }
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