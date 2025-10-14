// ============================================
// 🎮 JUEGO DE MEMORIA - PRÁCTICA DE JAVASCRIPT
// ============================================
// PASO 1: DECLARAR VARIABLES GLOBALES
// ============================================
// TODO: Declara las siguientes variables:
// 1.1 Array con 8 emojis diferentes para las cartas
const emojis = ['🐀','🎃','🦀','🧀','🍙','🧠','🌙','☀️']
// 1.2 Variables de estado del juego
let cards = [] // Array que contendrá todas las cartas
let flippedCards = [] // Array para las cartas volteadas (máximo 2)
let matchedPairs = 0 // Contador de pares encontrados
let moves = 0 // Contador de movimientos
let canFlip = true // Bandera para controlar si se pueden
// voltear cartas

// PASO 2: FUNCIÓN PRINCIPAL - INICIALIZAR EL JUEGO
// ============================================
function initGame() {
 const gameContainer = document.createElement('div')
 gameContainer.id = 'game-container'
 document.body.appendChild(gameContainer)
 createHeader(gameContainer)
 createGameBoard(gameContainer)
 createButtons(gameContainer)
 createModal()
 startNewGame()
}

// PASO 3: CREAR EL HEADER CON TÍTULO Y ESTADÍSTICAS
// ============================================
function createHeader(container) {
 const header = document.createElement('div')
 header.className = 'game-header'
 const h1 = document.createElement('h1')
 h1.textContent = '🧠 Juego de Memoria'
 const stats = document.createElement('div')
 stats.className = 'stats'
 const movesItem = document.createElement('div')
 movesItem.className = 'stat-item'
 movesItem.innerHTML = 'Movimientos: <span id="moves">0</span>'
 const pairsItem = document.createElement('div')
 pairsItem.className = 'stat-item'
 pairsItem.innerHTML = 'Pares: <span id="pairs">0/8</span>'
 stats.appendChild(movesItem)
 stats.appendChild(pairsItem)
 header.appendChild(h1)
 header.appendChild(stats)
 container.appendChild(header)
}

// PASO 4: CREAR EL TABLERO DE JUEGO
// ============================================
function createGameBoard(container) {
 const board = document.createElement('div')
 board.className = 'game-board'
 board.id = 'game-board'
 container.appendChild(board)
}

// PASO 5: CREAR BOTONES DE CONTROL
// ============================================
function createButtons(container) {
 const div = document.createElement('div')
 div.className = 'buttons'
 const btn = document.createElement('button')
 btn.type = 'button'
 btn.textContent = '🔄 Reiniciar'
 btn.addEventListener('click', startNewGame)
 div.appendChild(btn)
 container.appendChild(div)
}

// PASO 6: CREAR MODAL DE VICTORIA
// ============================================
function createModal() {
 const modal = document.createElement('div')
 modal.className = 'modal'
 modal.id = 'victory-modal'
 const modalContent = document.createElement('div')
 modalContent.className = 'modal-content'
 const h2 = document.createElement('h2')
 h2.textContent = '🎉 ¡Felicidades!'
 const p1 = document.createElement('p')
 p1.textContent = 'Has completado el juego'
 const p2 = document.createElement('p')
 p2.id = 'final-moves'
 p2.textContent = ''
 const btnClose = document.createElement('button')
 btnClose.type = 'button'
 btnClose.textContent = 'Cerrar'
 btnClose.addEventListener('click', closeModal)
 const btnPlayAgain = document.createElement('button')
 btnPlayAgain.type = 'button'
 btnPlayAgain.textContent = 'Jugar de nuevo'
 btnPlayAgain.style.marginLeft = '10px'
 btnPlayAgain.addEventListener('click', function() {
   closeModal()
   startNewGame()
 })
 modalContent.appendChild(h2)
 modalContent.appendChild(p1)
 modalContent.appendChild(p2)
 modalContent.appendChild(btnClose)
 modalContent.appendChild(btnPlayAgain)
 modal.appendChild(modalContent)
 document.body.appendChild(modal)
}

// PASO 7: INICIAR NUEVO JUEGO
// ============================================
function startNewGame() {
 moves = 0
 matchedPairs = 0
 flippedCards = []
 canFlip = true
 updateStats()
 cards = createCards()
 shuffleCards(cards)
 renderBoard()
 const modal = document.getElementById('victory-modal')
 if (modal) modal.classList.remove('show')
}

// PASO 8: CREAR ARRAY DE CARTAS
// ============================================
function createCards() {
 const duplicated = [...emojis, ...emojis]
 const arr = duplicated.map((emoji, index) => {
   return {
     id: index + '-' + emoji,
     emoji: emoji,
     flipped: false,
     matched: false
   }
 })
 return arr
}

// PASO 9: MEZCLAR CARTAS (Algoritmo de Fisher-Yates)
// ============================================
function shuffleCards(array) {
 for (let i = array.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [array[i], array[j]] = [array[j], array[i]];
 }
}

// PASO 10: RENDERIZAR EL TABLERO
// ============================================
function renderBoard() {
 const board = document.getElementById('game-board')
 board.innerHTML = ''
 cards.forEach(card => {
   const cardEl = document.createElement('div')
   cardEl.className = 'card'
   cardEl.setAttribute('data-id', card.id)
   if (card.flipped) cardEl.classList.add('flipped')
   if (card.matched) cardEl.classList.add('matched')
   cardEl.textContent = card.flipped || card.matched ? card.emoji : ''
   cardEl.addEventListener('click', function() {
     flipCard(card.id)
   })
   board.appendChild(cardEl)
 })
}

// PASO 11: VOLTEAR UNA CARTA
// ============================================
function flipCard(cardId) {
 if (!canFlip) return
 if (flippedCards.length === 2) return
 const card = cards.find(c => c.id === cardId)
 if (!card) return
 if (card.flipped || card.matched) return
 card.flipped = true
 flippedCards.push(card)
 const el = document.querySelector(`.card[data-id="${card.id}"]`)
 if (el) {
   el.classList.add('flipped')
   el.textContent = card.emoji
 }
 if (flippedCards.length === 2) {
   moves++
   updateStats()
   checkMatch()
 }
}

// PASO 12: VERIFICAR SI HAY COINCIDENCIA
// ============================================
function checkMatch() {
 canFlip = false
 const [card1, card2] = flippedCards
 if (!card1 || !card2) {
   canFlip = true
   return
 }
 if (card1.emoji === card2.emoji) {
   setTimeout(() => {
     card1.matched = true
     card2.matched = true
     const el1 = document.querySelector(`.card[data-id="${card1.id}"]`)
     const el2 = document.querySelector(`.card[data-id="${card2.id}"]`)
     if (el1) {
       el1.classList.add('matched')
       el1.classList.remove('flipped')
       el1.textContent = card1.emoji
     }
     if (el2) {
       el2.classList.add('matched')
       el2.classList.remove('flipped')
       el2.textContent = card2.emoji
     }
     matchedPairs++
     flippedCards = []
     updateStats()
     canFlip = true
     if (matchedPairs === emojis.length) {
       showVictory()
     }
   }, 500)
 } else {
   setTimeout(() => {
     card1.flipped = false
     card2.flipped = false
     const el1 = document.querySelector(`.card[data-id="${card1.id}"]`)
     const el2 = document.querySelector(`.card[data-id="${card2.id}"]`)
     if (el1) {
       el1.classList.remove('flipped')
       el1.textContent = ''
     }
     if (el2) {
       el2.classList.remove('flipped')
       el2.textContent = ''
     }
     flippedCards = []
     canFlip = true
   }, 1000)
 }
}

// PASO 13: ACTUALIZAR ESTADÍSTICAS
// ============================================
function updateStats() {
 const movesEl = document.getElementById('moves')
 const pairsEl = document.getElementById('pairs')
 if (movesEl) movesEl.textContent = moves.toString()
 if (pairsEl) pairsEl.textContent = `${matchedPairs}/${emojis.length}`
}

// PASO 14: MOSTRAR MODAL DE VICTORIA
// ============================================
function showVictory() {
 const modal = document.getElementById('victory-modal')
 const finalMoves = document.getElementById('final-moves')
 if (finalMoves) finalMoves.textContent = `Lo completaste en ${moves} movimientos`
 if (modal) modal.classList.add('show')
}

// PASO 15: CERRAR MODAL
// ============================================
function closeModal() {
 const modal = document.getElementById('victory-modal')
 if (modal) modal.classList.remove('show')
}

// PASO 16: INICIAR EL JUEGO AL CARGAR LA PÁGINA
// ============================================
if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', initGame)
} else {
 initGame()
}
