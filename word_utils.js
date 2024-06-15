SOGL = 'ЙЦКНГШЩЗФВПРЛДЖХЧСМТБ'
GLAS = 'УЕЫАОЭЯИЮ'

GLAS_d = {};
[...GLAS].forEach(function(c){
    GLAS_d[c] = 1;
    GLAS_d[c.toLowerCase()]=1;
})

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

function nSyll(word){
    return [...word].filter((c)=>GLAS_d[c]==1).length;
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

