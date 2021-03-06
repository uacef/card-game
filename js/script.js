/**
 *  @description Variable declaration block
 */
const resetButton = document.getElementById('reset');
const starWrapper = document.getElementById('stars');
const stars = [...document.getElementsByClassName('star')];
const moves = document.getElementById('counter');
const timer = document.getElementById('timer');
const replayGame = document.getElementById('replay');
const gameRepo = document.getElementById('repo');
const gameSound = document.getElementById('gameSound');
let cards = [...document.getElementsByClassName('card')];
let cardWrapper = document.getElementsByClassName('cards')[0];
let modal = document.getElementById('modal');
let closeModal = document.getElementById('close');
let timeSummary = document.getElementById('timeSummary');
let counterSummary = document.getElementById('counterSummary');
let starsSummary = document.getElementById('starsSummary');
let firstCard; //holds the first card
let secondCard; //holds the second card
let isFlipped = false; //checks when a card is flipped or not
let matchCards = 0; //holds all the matched cards which is used to end the game
let count = 0; //holds the number of moves/counts for the card game
let timeUpdate; //holds the setTimeout for the time
let hours = 0; //holds the hours
let minutes = 0; // holds the minutes
let seconds = 0; //holds the seconds

//Set audio sound for the game.
gameSound.setAttribute('src', 'sounds/Yanni-Nightingale.mp3');
gameSound.volume = 0.15;
/**
 * @function time
 * @description updates the game timer once the player
 *              starts playing the game.
 */
function time() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
  }

  timer.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
  timeCounter();
}

/**
 * @function timeCounter
 * @description timeCounter updates the time every one second
 */
function timeCounter() {
  timeUpdate = setTimeout(time, 1000);
}

/**
 * @function reset
 * @description this resets the game and brings it to its default state
 */
function reset() {
  //clear time
  clearTimeout(timeUpdate, 1000);
  timer.textContent = `00:00:00`;
  //reset variables
  emptyVariables();
  [matchCards, count, moves.textContent] = [0, 0, `0 Move(s)`];
  [hours, minutes, seconds] = [0, 0, 0];
  //refill all stars
  for (star of stars) {
    if (star.classList = 'stared') star.classList.add('stared');
  }
  //shuffle cards
  cards = shuffleCard(cards);
  //empty the card list
  cardWrapper.innerHTML = "";
  //undo card flip
  for (card of cards) {
    cardWrapper.appendChild(card);
    card.classList.remove('open', 'match', 'notMatch');
  }
  //set the background sound back to the first track
  if(gameSound.attributes.src.nodeValue !== 'sounds/Yanni-Nightingale.mp3') gameSound.attributes.src.nodeValue = 'sounds/Yanni-Nightingale.mp3';
}

//binding the game reset button
resetButton.addEventListener('click', reset, false);

//reset game on document loaded
document.addEventListener('DOMContentLoaded', reset, false);

/**
 *@function shuffleCard
 @description this function is used to shuffle the card
 * @param {array} cardArray
 */
function shuffleCard(cardArray) {
  let currentIndex = cardArray.length;
  let shuffled;
  let temp;

  while (currentIndex != 0) {
    shuffled = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temp = cardArray[currentIndex];
    cardArray[currentIndex] = cardArray[shuffled];
    cardArray[shuffled] = temp;
  }

  return cardArray;
}

/**
 * @function showCard
 * @description this flips the card as
 *           the user clicks on them
 */
function showCard() {
  //play background sound once the card opens
  if (!gameSound.play()) {
    gameSound.play();
  }

  if (this === firstCard) return;

  if (timer.textContent === `00:00:00`) timeCounter();

  if (firstCard === undefined) {
    this.classList.add('open');
  }

  if (!isFlipped) {
    //first click
    isFlipped = true;
    firstCard = this;
    return;
  }

  //second click
  if (firstCard != undefined && secondCard === undefined) {
    secondCard = this;
  }

  //check whether the both flipped card match
  checkMatch();
}

/**
 * @function checkMatch
 * @description it checks when there is match on the opened cards
 */
function checkMatch() {
  if (firstCard.dataset.name === secondCard.dataset.name) {
    match();
  } else {
    notMatch();
  }

  //increase the count Variable
  count++;
  //update the move counter of the game
  moves.textContent = `${count} Move(s)`;
  //remove one star every five(5) counts
  removeStar();
}

/**
 * @function match
 * @description It matches cards with the same image
 */
function match() {
  //match the first card against the second card.
  firstCard.classList.add('match');
  secondCard.classList.add('match');

  //add the two matched cards to the matchCards array
  matchCards += 2;
  //Terminate the game when all the 16 cards are successfully matched.
  if (matchCards === 16) {
    gameOver();
  }

  //Reset variables' values.
  emptyVariables()
}

/**
 * @function notMatch
 * @description where there is no match on the opened cards this function is called
 */
function notMatch() {
  //Indicate that the two open cards do not match.
  firstCard.classList.add('notMatch');
  secondCard.classList.add('open', 'notMatch');

  //close them back again since they do not match
  setTimeout(() => {
    firstCard.classList.remove('open', 'notMatch');
    secondCard.classList.remove('open', 'notMatch');

    //Reset variables' values
    emptyVariables();
  }, 550);
}

/**
 * @function removeStar
 * @description this removes the a star at every five counts
 */
function removeStar() {
  [firstStar, secondStar, thirdStar, fourthStar, fifthStar] = [...stars];
  //reduce at every five count
  if (count === 5) fifthStar.classList.remove('stared');
  if (count / 2 === 5) fourthStar.classList.remove('stared');
  if (count / 3 === 5) thirdStar.classList.remove('stared');
  if (count / 4 === 5) secondCard.classList.remove('stared');
}

/**
 * @function emptyVariables
 * @description this resets all the variables
 */
function emptyVariables() {
  if (firstCard != undefined && secondCard != undefined & isFlipped != false) {
    [firstCard, secondCard, isFlipped] = [undefined, undefined, false];
  }
}

/**
 * @function gameOver
 * @description this shows when the game is over with the summary of the player's records.
 */
function gameOver() {
  clearTimeout(timeUpdate);
  timeSummary.textContent = timer.textContent;
  starsSummary.innerHTML = starWrapper.innerHTML;
  counterSummary.innerHTML = count + 1 + " Move(s)";
  modal.classList.remove('hide');
  gameSound.attributes.src.nodeValue = 'sounds/congrats.wav';
  gameSound.play();
}

modal.addEventListener('click', (evt) => {
  if (evt.target === modal) exitModal();
}, false);

closeModal.addEventListener('click', exitModal, false);

/**
 * @function exitModal
 * @description this exits the congratulatory modal and as well resets the game
 */
function exitModal() {
  modal.classList.add('hide');
  //reset game
  reset();
}

//binding the modal replay button for click event
replayGame.addEventListener('click', exitModal, false);

cards.forEach(card => card.addEventListener('click', showCard, false));