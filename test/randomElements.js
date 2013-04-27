// JUST A TEST FILE FOR CREATING THE RANDOM ELEMENTS FOR TEST PURPOSES
// FOR AN EXAMPLE ON HOW TO USE THE PLUGIN SEE "index.html"

function _getRandomElement() {
    var random = Math.random() * 10
        ,$document = $(document)
        ,hue = 'rgb(' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ')'
        ,$element;
    if (random < 4) {
        $element = $(document.createElement('div'));
    }
    else if (random < 7) {
        $element = $(document.createElement('a'));
    }
    else if (random <= 10) {
        $element = $(document.createElement('p'));
    }
    $element.css({
        backgroundColor: hue,
        top: Math.random() * ($document.height() - 150),
        left: Math.random() * ($document.width()- 150)
    });

    return $element;
}

$(function(){
    var $wrapper = $("#wrapper"),
        i = 0;
    while (i < 20) {
        $wrapper.append(_getRandomElement().data("id", i));
        i++;
    }
});