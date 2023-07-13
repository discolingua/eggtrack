const item = document.querySelector('.item');
const boxes = document.querySelectorAll('.box');
const basket = document.querySelector('.basketBox');
const eggBox = document.querySelector('.eggBox');
const scoreId = document.querySelector('.scoreBoard');

var score = 0;


boxes.forEach(box => {
    box.addEventListener('dragenter', dragEnter);
    box.addEventListener('dragover', dragOver);
    box.addEventListener('dragleave', dragLeave);
    box.addEventListener('drop', drop);
});

item.addEventListener('dragstart', dragStart);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);
}

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e) {
    e.target.classList.remove('drag-over');

    const id=e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);

    e.target.appendChild(draggable);

    draggable.classList.remove('hide');

    if (e.target.classList.contains('eggBox')) {

        console.log("egg box");
        eggBox.removeChild(item);
        basket.appendChild(item);
        score += 1;

        var scoreMeter = "00000000000" + score;
        scoreId.innerHTML = scoreMeter;


    }
}