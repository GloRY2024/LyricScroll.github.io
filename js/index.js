/**
 * parse lyrics
 * return a list
 * each element in the list -> {time : , words: lyrics}
 * [{}] 
 */
function parseLrc(){
    var lines = lrc.split('\n');
    var result = [];
    for (var i  = 0; i < lines.length; i++){
        var str = lines[i].split(']');
        var timeStr = str[0].substring(1);
        var obj = {
            time: parseTime(timeStr),
            words: str[1],
        };
        result.push(obj);
    };

    return result;

}


function parseTime(timeStr){
    var parts = timeStr.split(':');
    return +parts[0] * 60 + +parts[1];
}


//acquire necessary DOM
var doms = {
    audio:document.querySelector('audio'),
    container: document.querySelector(".container"),
    ul: document.querySelector('.container ul'),
    
};


/**
 * compute the index in the lrclist in which the lyric should be highlighted at the current time
 */
function findIndex(){
    var curTime = doms.audio.currentTime;
    for (var i = 0; i < lrcList.length; i++){
        if(lrcList[i].time + 0.11 >= curTime){
            return i - 1; // it is okay to return -1 when idx == 0
        }
    }

    return lrcList.length - 1; // return the last lyrics when we are at the end
}

//compute lrcList
var lrcList = parseLrc();


//Rendering

/**
 * making lrc li
 */
function createLrcElements(){
    var frag = document.createDocumentFragment(); //create a empty fragment. update the fragment then add it to the dom once at the end
    for (var i = 0; i < lrcList.length; i++){
        var li = document.createElement('li');
        li.textContent = lrcList[i].words;
        frag.appendChild(li);
    }

    doms.ul.appendChild(frag);
}

createLrcElements();

var containerHeight = doms.container.clientHeight;

var liHeight = doms.ul.children[0].clientHeight;

var ulHeight = doms.ul.clientHeight;

var maxOffset = doms.ul.clientHeight - containerHeight;


function setOffset(){
    var index = findIndex();

    var offset = liHeight*index + liHeight / 2 - containerHeight / 2;
    if (offset < 0){
        offset = 0;
    }

    if (offset > maxOffset){
        offset = maxOffset;
    }
    // console.log(offset);
    
    doms.ul.style.transform = `translateY(-${offset}px)`;
    var li = doms.ul.querySelector('.active')
    if (li){
        li.classList.remove('active');
    }

    if (index >= 0){
        doms.ul.children[index].classList.add('active');
    }

}
doms.audio.addEventListener('timeupdate', setOffset);

setOffset();