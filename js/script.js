const listOfOperations = document.querySelectorAll('.operation .dropdown-item'),
    listOfDifficulty = document.querySelectorAll('.difficulty .dropdown-item'),
    startButton = document.querySelector('.start'),
    readyButton = document.querySelector('.send'),
    pickedOperation = document.querySelector('.picked_operation'),
    pickedDifficulty = document.querySelector('.picked_difficulty'),
    tasks = document.querySelector('.tasks_wrapper'),
    resetButton = document.querySelector('.reset');

let operation, difficulty, Oobserving = false,
    Dobserving = false,
    firstNum, secondNum, max, answers = [],
    mark = 0;

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sub(max) {
    firstNum = randInt(1, max)
    secondNum = randInt(1, max)
    if (firstNum < secondNum) sub(max);
    else return;
}

function divide(max) {
    firstNum = randInt(1, max)
    secondNum = randInt(1, max)
    if (firstNum % secondNum != 0) divide(max);
}

function getNum(f, s, operation) {
    switch (operation) {
        case '+':
            return f + s
        case '-':
            return f - s
        case '*':
            return f * s
        case '/':
            return f / s
    }
}

function drawTasks() {
    tasks.innerHTML = ``
    max = parseInt(difficulty)
    answers = [];


    for (let i = 0; i < 10; i++) {
        switch (operation) {
            case '+':
                firstNum = randInt(1, max);
                secondNum = randInt(1, max);
                break;
            case '-':
                sub(max);
                break;
            case '*':
                firstNum = randInt(1, max);
                secondNum = randInt(1, max);
                break;
            case '/':
                divide(max);
                break;
            default:
                break;
        }
        tasks.innerHTML += `
            <div class="task fs-5"><i class="ri-pencil-line"></i><span class="pattern">${firstNum} ${operation} ${secondNum} = </span>
                <input type="number" class="form-control" placeholder="Ответ" aria-label="answer" aria-describedby="addon-wrapping">
            </div>
        `
        answers.push(getNum(firstNum, secondNum, operation));
        console.log(answers)
    }
}

const callback = function(mutationsList) {
    drawTasks();
};
const observer = new MutationObserver(callback);

listOfOperations.forEach((el, i) => {
    el.onclick = (e) => {
        listOfOperations.forEach(el => {
            el.classList.contains('active') ? el.classList.remove('active') : ''
        })
        el.classList.contains('active') ? '' : el.classList.add('active')
        operation = el.dataset.value
        pickedOperation.innerHTML = `Выбранная операция: <span class="text-success">${el.textContent.slice(0, -3)}</span>`
    }
})

listOfDifficulty.forEach((el, i) => {
    el.onclick = (e) => {
        listOfDifficulty.forEach(el => {
            el.classList.contains('active') ? el.classList.remove('active') : ''
        })
        el.classList.contains('active') ? '' : el.classList.add('active')
        difficulty = el.dataset.value;
        pickedDifficulty.innerHTML = `Выбранная сложность: <span class="text-success">${el.textContent}</span>`
    }
})


startButton.onclick = () => {
    if (!operation) return pickedOperation.innerHTML = `<span class="text-danger text-capitalize">Укажите операцию.</span>`
    if (!difficulty) return pickedDifficulty.innerHTML = `<span class="text-danger text-capitalize">Укажите сложность.</span>`

    document.querySelector('.button_wrapper-start').style.display = 'none';
    document.querySelector('.button_wrapper').style.display = 'flex';
    tasks.style.display = 'grid';
    drawTasks();
    if (!Oobserving) {
        document.querySelectorAll('.operation a').forEach(el => {
            observer.observe(el, { attributes: true });
        })
        Oobserving = true;
    }
    if (!Dobserving) {
        document.querySelectorAll('.difficulty a').forEach(el => {
            observer.observe(el, { attributes: true });
        })
        Dobserving = true;
    }
}


readyButton.onclick = () => {
    document.querySelectorAll('[aria-label="answer"]').forEach((el, i) => {
        el.classList.remove('alert-danger')
        el.classList.remove('alert-success')
        if (el.parentNode.style.display != 'none' && el.value) {
            if (el.value == answers[i]) {
                el.classList.add('alert-success');
                mark++;
            } else if (!el.classList.contains('alert-danger')) {
                el.classList.add('alert-danger')
            }
        } else if (!el.classList.contains('alert-danger')) {
            el.classList.add('alert-danger')
        }
    })
    setTimeout(() => { tasks.style.opacity = '0' }, 500)
    setTimeout(() => {
        tasks.style.display = 'none'
        if (mark > 5) {
            document.querySelector('.done.alert-success').style.display = 'block';
            document.querySelector('.done.alert-success').innerHTML = `Успешно!<br>Ваша оценка: ${mark}`;
        } else {
            document.querySelector('.done.alert-danger').style.display = 'block';
            document.querySelector('.done.alert-danger').innerHTML = `Не расстраивайтесь!<br>Ваша оценка: ${mark}`;
        }
        document.querySelector('.button_wrapper').style.display = 'none'
        document.querySelector('.button_wrapper-reset').style.display = 'flex'
    }, 2000);
}
resetButton.onclick = () => {
    document.querySelector('.button_wrapper').style.display = 'flex'
    document.querySelector('.button_wrapper-reset').style.display = 'none'
    document.querySelector('.done.alert-success').style.display = 'none'
    document.querySelector('.done.alert-danger').style.display = 'none'
    tasks.style.opacity = '1';
    startButton.click();
}