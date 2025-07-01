let modoVermelho = false;

const inputKeys = document.querySelectorAll('.key-input')

const buttonStart = document.querySelector('button')
const badResult = document.querySelector('.bad_result')
const good_result = document.querySelector('.good_result')
const containerChallenge = document.querySelector('.container_challenge')
const progBar = document.querySelector('.current_bar')

const wrongMoveSound = new Audio('./assets/sound/wrong_move_sound.mp3');
const keyPressSound = new Audio('./assets/sound/key_press_sound.mp3');
wrongMoveSound.volume = 0.70
keyPressSound.volume = 0.40

window.addEventListener('keydown', handleEventKey)
buttonStart.addEventListener('click', startStopGame)

const TIME_CHALLENGE = 6 //seconds
const QUANTITY_TIMES = 3 //times
const LETTERS = ['A', 'S', 'D', 'Q', 'W', 'E']
const currentSequence = []
const userInput = []
let isStart = false;
let currentPositionTyping = 0;
let currentTimer = 0;
let currentProgBar = 100
let timerId = null;

function timerBar() {
  timerId = setInterval(() => {
    if (currentProgBar < 0) {
      clearInterval(timerId)
      badResult.style.display = 'flex';
      containerChallenge.style.display = 'none';
      document.body.classList.add('alerta-vermelho');
      modoVermelho = true; // <-- Ativa vermelho só aqui!
      isStart = false
      buttonStart.classList = 'button-start';
      buttonStart.textContent = 'Start'

      currentSequence.length = 0 //empty array
      userInput.length = 0 //empty array
      resetChallenge()
      inputKeys.forEach(key => key.classList.remove('key-input-right'))

      //Empty the key display
      inputKeys.forEach((key, index) => {
        key.textContent = ''
      })
    }
    if (currentProgBar > 30 && currentProgBar < 60) {
      progBar.style.backgroundColor = '#F58002'
    }
    if (currentProgBar <= 30) {
      progBar.style.backgroundColor = '#FF3E24'
    }

    currentProgBar = currentProgBar - 1;
    progBar.style.width = `${currentProgBar}%`
  }, 53)
}

function getRandomLetter(arr) {
  const min = 0
  const max = arr.length - 1;
  const randomNumber = Math.floor(Math.random() * (max - min + 1) + min)

  return arr[randomNumber]
}

function startStopGame() {
  document.body.classList.remove('alerta-vermelho');
  isStart = !isStart
  buttonStart.classList = (isStart) ? 'button-stop' : 'button-start';
  buttonStart.textContent = (isStart) ? 'Stop' : 'Start'

  if (isStart) {
    badResult.style.display = 'none'
    good_result.style.display = 'none'
    containerChallenge.style.display = 'grid'
    currentSequence.push(...getCodeSequence())
    resetChallenge()
    timerBar()
    inputKeys[0].classList.add('current_key')

    //Fill the key display
    inputKeys.forEach((key, index) => {
      key.textContent = currentSequence[index]
    })
  }

  else {
    currentSequence.length = 0 //empty array
    userInput.length = 0 //empty array
    resetChallenge()
    inputKeys.forEach(key => key.classList.remove('key-input-right'))

    //Empty the key display
    inputKeys.forEach((key, index) => {
      key.textContent = ''
    })
  }

}

function getCodeSequence() {
  return codeSequenceArray = new Array(8).fill().map(() => getRandomLetter(LETTERS))
}

function resetChallenge() {
  progBar.style.backgroundColor = '#a3ef52'
  currentProgBar = 100
  progBar.style.width = '100%'
  currentPositionTyping = 0
  clearInterval(timerId)
  inputKeys.forEach(e => e.classList.remove('current_key'))
}

function handleEventKey(event) {
  const letterInput = event.key.toUpperCase()


  if (isStart && LETTERS.includes(letterInput) && userInput.length < 8) {
    userInput.push(letterInput)

    inputKeys.forEach((e, i) => {
      if (i - 1 === currentPositionTyping) {
        e.classList.add('current_key')
      } else {
        e.classList.remove('current_key')
      }
    })

    if (userInput.every((e, i) => e === currentSequence[i])) {
      keyPressSound.play()
      inputKeys[currentPositionTyping].classList.add('key-input-right')
      currentPositionTyping++
      if (userInput.length === 8) {
        clearInterval(timerId)
        good_result.style.display = 'flex'
        containerChallenge.style.display = 'none';
        isStart = false
        buttonStart.classList = 'button-start';
        buttonStart.textContent = 'Start'

        currentSequence.length = 0 //empty array
        userInput.length = 0 //empty array
        resetChallenge()
        inputKeys.forEach(key => key.classList.remove('key-input-right'))

        //Empty the key display
        inputKeys.forEach((key, index) => {
          key.textContent = ''
        })

        // Remove fundo vermelho se estiver
        modoVermelho = false;
        document.body.classList.remove('alerta-vermelho');

        // Cria tela estilo CMD
        const consoleScreen = document.createElement('div');
        consoleScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        color: #00ff00;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1.6rem;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: none;
        align-items: flex-start;
        white-space: pre-wrap;
        z-index: 9999;
      `;
        document.body.appendChild(consoleScreen);

        const randomId = Math.floor(10000 + Math.random() * 90000);

        const lines = [
          "[OK] Inicializando sistema...",
          "[OK] Verificando conexão com servidor MIDNIGHT CLUB...",
          "[OK] Estabelecendo handshake...",
          "[OK] Acesso autorizado para ID: #${randomId}",
          "[OK] Redirecionando para o sistema..."
        ];

        let lineIndex = 0;
        let charIndex = 0;

        function typeWriter() {
          if (lineIndex < lines.length) {
            if (charIndex < lines[lineIndex].length) {
              consoleScreen.textContent += lines[lineIndex].charAt(charIndex);
              charIndex++;
              setTimeout(typeWriter, 50);
            } else {
              consoleScreen.textContent += '\n';
              lineIndex++;
              charIndex = 0;
              setTimeout(typeWriter, 500);
            }
          } else {
            setTimeout(() => {
              window.location.href = 'race.html';
            }, 1000);
          }
        }

        typeWriter();

      }
    }
    else {
      wrongMoveSound.play()
      currentPositionTyping = 0
      inputKeys.forEach(key => key.classList.remove('key-input-right'))
      inputKeys.forEach(key => key.classList.remove('current_key'))
      inputKeys[0].classList.add('current_key')
      userInput.length = 0
      currentSequence.length = 0;

      currentSequence.push(...getCodeSequence()) //get a new sequence
      inputKeys.forEach((key, index) => {
        key.textContent = currentSequence[index]
      })
    }
  }

  else {
    if (isStart) {
      wrongMoveSound.play()
      currentPositionTyping = 0
      inputKeys.forEach(key => key.classList.remove('key-input-right'))
      userInput.length = 0
      currentSequence.length = 0;

      currentSequence.push(...getCodeSequence()) //get a new sequence
      inputKeys.forEach((key, index) => {
        key.textContent = currentSequence[index]
      })
    }
  }

}

function r(from, to) {
  return ~~(Math.random() * (to - from + 1) + from);
}
function pick() {
  return arguments[r(0, arguments.length - 1)];
}
function getChar() {
  return String.fromCharCode(pick(
    r(0x3041, 0x30ff),  // Katakana
    r(0x2000, 0x206f),  // Symbols
    r(0x0020, 0x003f)   // Basic Latin
  ));
}
function loop(fn, delay) {
  let stamp = Date.now();
  function _loop() {
    if (Date.now() - stamp >= delay) {
      fn(); stamp = Date.now();
    }
    requestAnimationFrame(_loop);
  }
  requestAnimationFrame(_loop);
}

class Char {
  constructor() {
    this.element = document.createElement('span');
    this.mutate();
  }
  mutate() {
    this.element.textContent = getChar();
  }
}

class Trail {
  constructor(list = [], options) {
    this.list = list;
    this.options = Object.assign({ size: 10, offset: 0 }, options);
    this.body = [];
    this.move();
  }
  traverse(fn) {
    this.body.forEach((n, i) => {
      let last = (i === this.body.length - 1);
      if (n) fn(n, i, last);
    });
  }
  move() {
    this.body = [];
    let { offset, size } = this.options;
    for (let i = 0; i < size; ++i) {
      let item = this.list[offset + i - size + 1];
      this.body.push(item);
    }
    this.options.offset = (offset + 1) % (this.list.length + size - 1);
  }
}

class Rain {
  constructor({ target, row }) {
    this.element = document.createElement('p');
    this.build(row);
    if (target) target.appendChild(this.element);
    this.drop();
  }
  build(row = 20) {
    const root = document.createDocumentFragment();
    const chars = [];
    for (let i = 0; i < row; ++i) {
      const c = new Char();
      root.appendChild(c.element);
      chars.push(c);
      if (Math.random() < 0.5) {
        loop(() => c.mutate(), r(1000, 5000));
      }
    }
    this.trail = new Trail(chars, {
      size: r(10, 30),
      offset: r(0, 100)
    });
    this.element.appendChild(root);
  }
  drop() {
    const trail = this.trail;
    const len = trail.body.length;
    const delay = r(10, 100);
    loop(() => {
      trail.move();
      trail.traverse((c, i, last) => {
        // Use vermelho se modoVermelho, senão verde
        let cor = modoVermelho
          ? `hsl(0, 100%, ${85 / len * (i + 1)}%)`
          : `hsl(136, 100%, ${85 / len * (i + 1)}%)`;
        c.element.style = `color: ${cor};`;
        if (last) {
          c.mutate();
          let corLast = modoVermelho
            ? 'hsl(0, 100%, 85%)'
            : 'hsl(136, 100%, 85%)';
          c.element.style = `
          color: ${corLast};
          text-shadow:
            0 0 .5em #fff,
            0 0 .5em currentColor;
        `;
        }
      });
    }, delay);
  }
}

const main = document.querySelector('main');
for (let i = 0; i < 50; ++i) {
  new Rain({ target: main, row: 50 });
}

window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container_challenge');
  const buttonStart = document.querySelector('.button-start');
  container.style.display = 'none'; // Esconde ao carregar
  buttonStart.style.display = 'none'; // Esconde o botão também
  setTimeout(() => {
    container.style.display = 'grid'; // Mostra após 1.5s
    buttonStart.style.display = 'block'; // Mostra o botão após 1.5s
  }, 1500);
});
