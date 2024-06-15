
CUR_STORY = null;
CUR_STORY_PART_J = null;

_OPTS = {
    cursive_on: false,
    keep:false,
    fontmode:0,
    type:"слова",
    level:"0",
    time:751,
    size:7,
    dark:true,
    last_values:{},
}

function onBodyLoad(){
    console.log('LOAD')

    const switchElement = document.getElementById('verticalSwitch');
        switchElement.addEventListener('click', () => {
        switchElement.classList.toggle('on');
    });

    blink(' ')

    WORD = makeOKLines('Гарри и Рон спасли Джинни из Тайной комнаты.');


    const temp = localStorage.getItem("_OPTS");
    if(temp){
        _OPTS = JSON.parse(temp);
    }

    initWords();

    setInterfaceToOPTS();
}

function setInterfaceToOPTS(){
    if(_OPTS.cursive_on){
        _('#verticalSwitch').classList.add('on')
    }else{
        _('#verticalSwitch').classList.remove('on')
    }
    onFontChange();

    if((_('.'+fontClass(0)).length>0) && (_OPTS.fontmode!=0)){
        _('.'+fontClass(0)).forEach(e=>e.classList.add(fontClass(_OPTS.fontmode)));
        _('.'+fontClass(0)).forEach(e=>e.classList.remove(fontClass(0)));
    }

    _('#cbKeep').checked=_OPTS.keep;

    _('#typediv').innerHTML = _OPTS.type;

    _('#level').value=_OPTS.level;
    console.log(_OPTS.level)

    _('#sliderTime').value = _OPTS.time;
    _('#sliderSize').value = _OPTS.size;

    _('#cbDark').checked = _OPTS.dark;
    onDarkChange();

    onTypeChange(_OPTS.level);    
    onKeepChange();
}

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


function reset_cur_story(){
    CUR_STORY = null;
    CUR_STORY_PART_J = null;
}

function onLevelChange(){
    setOpts('level',getLevel());
    reset_cur_story();
    setOpts('last_values.'+getType(), getLevel());

    _('#btnNextStory').style.display = (getLevel() == 'Ист.')?'':'none';
}


function clearH1(){
    _('#h1').innerHTML = '&nbsp;';
}

function setOpts(key, value){
    T = _OPTS;
    key_t = key.split('.');
    for(var j=0; j<key_t.length-1 ; j++){
        if (!(key_t[j] in T)){
            T[key_t[j]] = {};
        }
        T = T[key_t[j]];
    }
    T[key_t[key_t.length-1]] = value;
    localStorage.setItem("_OPTS",JSON.stringify(_OPTS));
}

function onSizeChange(){
    setOpts('size',getSize());
    blink(WORD);
    return;
    if(_OPTS.keep){
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
    if(_OPTS.keep==0)
        BLINK_Timeout = setTimeout(clearH1, getTime());
}

function onTimeChange(){
    setOpts('time',getTime());
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

function changeType(){
    setOpts('type',isTypeNumbers()?'слова':'числа');
    onTypeChange();
}

function isTypeNumbers(){
    return getType() =='числа';
}

function getType(){
    return _OPTS.type;
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

function onTypeChange(level){
    _('#typediv').innerHTML = _OPTS.type;

    var levels = [1,2,3,4,5,6,7,8,9,10];

    if (isTypeNumbers()) {
        levels = [1,2,3,4,5,6,7,8,9,10];
    } else {
        levels = Object.keys(WbyLevel)
    }

    fillLevels(levels);

    if (level!=null) {
        getLevelSelect().value = level;
    } else if((_OPTS.last_values[getType()])&&(_OPTS.last_values[getType()]!='')) {
        getLevelSelect().value = _OPTS.last_values[getType()];
    }else{
        getLevelSelect().value = levels[0];
    }

    onLevelChange();
}


function onDarkChange(){
    setOpts('dark', _('#cbDark').checked);
    if(_OPTS.dark){
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

function onKeepChange(){
    setOpts('keep', _('#cbKeep').checked);
    if(_OPTS.keep){
        show(WORD);
        clearTimeout(BLINK_Timeout);
        _('#sliderTime').disabled=true;
        _('#repeat').style.display='none'
    } else {
        clearH1();
        _('#sliderTime').disabled=false;
        _('#repeat').style.display=''
    }
}


function onFontChange(){
    setTimeout(function(){
        setOpts('cursive_on', _('#verticalSwitch').classList.contains('on'));
        if(_OPTS.cursive_on){
            _('#h1').classList.add('myfont');
            _('#leftUpperSwitch').classList.add('blue');
        }else{
            _('#h1').classList.remove('myfont');
            _('#leftUpperSwitch').classList.remove('blue');
        }

        WORD = makeOKLines(WORD); //it can change depending on the font
        if(_('#cbKeep').checked){
            show(WORD);
        }
    },50);
}

//


function fontClass(fontmode){
    return 'font'+fontmode;
}

function onUpperSwitchClick(){
    let new_FONTMODE = (_OPTS.fontmode==4)?0:_OPTS.fontmode+1;

    _('.'+fontClass(_OPTS.fontmode)).forEach(e=>e.classList.add(fontClass(new_FONTMODE)));
    _('.'+fontClass(_OPTS.fontmode)).forEach(e=>e.classList.remove(fontClass(_OPTS.fontmode)));

    setOpts('fontmode', new_FONTMODE);
    console.log(_OPTS.fontmode);
}

//


function nextStory(){
    WORD = genNextStory();
    blink(WORD);
}