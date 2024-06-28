class Card {
    constructor(name, img) {
        this.name = name;
        this.img = img;
        this.isFlipped = false;
        this.element = this.#createCardElement();
    }

    toggleFlip() {
        console.log(this.isFlipped)
        if(this.isFlipped==false){
            this.isFlipped=true
        }else{
            this.isFlipped=false
        }
        if(this.isFlipped){
            this.#flip()
        }else{
            this.#unflip()
        }
        console.log(this.isFlipped)
    }

    matches(otherCard){
        if(this.name == otherCard.name){
            console.log("Son iguales")
            return true
        }
        else{
            return false
        }
    }

    #createCardElement() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("cell");
        cardElement.innerHTML = `
          <div class="card" data-name="${this.name}">
              <div class="card-inner">
                  <div class="card-front"></div>
                  <div class="card-back">
                      <img src="${this.img}" alt="${this.name}">
                  </div>
              </div>
          </div>
      `;
        return cardElement;
    }

    #flip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.add("flipped");
    }

    #unflip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.remove("flipped");
    }
}

class Board {
    constructor(cards) {
        this.cards = cards;
        this.fixedGridElement = document.querySelector(".fixed-grid");
        this.gameBoardElement = document.getElementById("game-board");
    }

    #calculateColumns() {
        const numCards = this.cards.length;
        let columns = Math.floor(numCards / 2);

        columns = Math.max(2, Math.min(columns, 12));

        if (columns % 2 !== 0) {
            columns = columns === 11 ? 12 : columns - 1;
        }

        return columns;
    }
    shuffleCards(){
        this.cards=this.cards.sort(() => Math.random() - 0.5)
    }

    reset(){
        console.log("Reset desde board")
        this.flipDownAllCards()
        this.render()
    }

    flipDownAllCards(){
        for(var i=0;i<this.cards.length;i++){
            if(this.cards[i].isFlipped)
                this.cards[i].toggleFlip()
        }
    }

    #setGridColumns() {
        const columns = this.#calculateColumns();
        this.fixedGridElement.className = `fixed-grid has-${columns}-cols`;
    }

    render() {
        this.shuffleCards()
        console.log(this.cards)
        this.#setGridColumns();
        this.gameBoardElement.innerHTML = "";
        this.cards.forEach((card) => {
            card.element
                .querySelector(".card")
                .addEventListener("click", () => this.onCardClicked(card));
            this.gameBoardElement.appendChild(card.element);
        });
    }

    onCardClicked(card) {
        if (this.onCardClick) {
            this.onCardClick(card);
        }
    }
}

class MemoryGame {
    constructor(board, flipDuration = 500) {
        this.board = board;
        this.flippedCards = [];
        this.matchedCards = [];
        this.puntuacion=0;
        this.puntuacion_elemento=document.getElementById("puntuacion");
        if (flipDuration < 350 || isNaN(flipDuration) || flipDuration > 3000) {
            flipDuration = 350;
            alert(
                "La duración de la animación debe estar entre 350 y 3000 ms, se ha establecido a 350 ms"
            );
        }
        this.flipDuration = flipDuration;
        this.board.onCardClick = this.#handleCardClick.bind(this);
        this.board.reset();
    }

    #handleCardClick(card) {
        
        console.log(card)
        if (this.flippedCards.length < 2 && !card.isFlipped) {
            card.toggleFlip();
            this.flippedCards.push(card);

            if (this.flippedCards.length === 2) {
                this.aumentarPuntuacion()
                setTimeout(() => this.checkForMatch(), this.flipDuration);
            }
        }
    }

    aumentarPuntuacion(){
        this.puntuacion=this.puntuacion+1
        this.puntuacion_elemento.textContent=`${this.puntuacion} movimientos`
    }

    resetearPuntuacion(){
        this.puntuacion=0
        this.puntuacion_elemento.textContent=`${this.puntuacion} movimientos`
    }

    checkForMatch(){
        if(this.flippedCards[0].matches(this.flippedCards[1])){
            console.log("son iguales")
            this.matchedCards.push(this.flippedCards[0])
            this.matchedCards.push(this.flippedCards[1])
        }
        else{
            console.log("NO son iguales")
            this.flippedCards.map((f)=>{
                f.toggleFlip()
            })
        }
        this.flippedCards=[]
    }
    resetGame(){
        console.log("Reset desde memory game")
        this.flippedCards=[]
        this.matchedCards=[]
        this.resetearPuntuacion()
        this.board.reset()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cardsData = [
        { name: "Python", img: "./img/Python.svg" },
        { name: "JavaScript", img: "./img/JS.svg" },
        { name: "Java", img: "./img/Java.svg" },
        { name: "CSharp", img: "./img/CSharp.svg" },
        { name: "Go", img: "./img/Go.svg" },
        { name: "Ruby", img: "./img/Ruby.svg" },
    ];

    const cards = cardsData.flatMap((data) => [
        new Card(data.name, data.img),
        new Card(data.name, data.img),
    ]);
    console.log(cards)
    const board = new Board(cards);
    const memoryGame = new MemoryGame(board, 1000);

    document.getElementById("restart-button").addEventListener("click", () => {
        memoryGame.resetGame();
    });
});
