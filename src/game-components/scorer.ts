export default class Scorer {

    highScore: number;

    currentScore: number = 0;

    coinsCollected: number = 0;

    constructor() {
        this.highScore = this.getHighScore();
    }

    incrementScore() {
        this.currentScore++;

        this._checkHighScore();
    }

    incrementCoinCount() {
        this.coinsCollected++;
    }

    resetScore() {
        this.currentScore = 0;
        this.coinsCollected = 0;
    }

    setHighScore() {
        localStorage.setItem('highscore', this.currentScore.toString());

        this.highScore = this.currentScore;
    }

    _checkHighScore() {
        let score = localStorage.getItem('highscore') || "0";

        if (score && this.currentScore >= parseInt(score)) {
            this.setHighScore();
        }
    }

    getHighScore() {
        let score = localStorage.getItem('highscore');

        if (score) return parseInt(score);

        return 0;
    }
}