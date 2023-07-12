import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  gameOver = false;
  gameMessage: string = '';
  board: Array<string | null> = Array(9).fill(null);
  currentPlayer: string = 'X';
  winner: string | null = null;
  

  makeMove(index: number): void {
    if (!this.board[index] && !this.winner) {
      this.board[index] = this.currentPlayer;
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      this.checkWinner();
      this.makeComputerMove();
    }
  }

  makeComputerMove(): void {
    if (!this.winner && this.board.includes(null)) {
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * 9);
      } while (this.board[randomIndex] !== null);
  
      setTimeout(() => {
        this.board[randomIndex] = this.currentPlayer;
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.checkWinner();
      }, 500); // Delay to make it look like Computer is "thinking" (optional)
    }
  }
  
  checkWinner(): void {
    // Implement the logic to check for a winning condition
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const combos of winningCombos) {
      const [a, b, c] = combos;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.winner = this.board[a];
        this.gameOver = true;
        break;
      }
    }

    if (this.winner) {
      this.gameMessage = this.winner === 'X' ? 'You Win!' : 'You Lose!';
    } else if (!this.winner && !this.board.includes(null)) {
      this.gameMessage = "It's a Tie!";
      this.gameOver = true;
    } 
  }

  resetGame(): void {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.gameOver = false;
    this.gameMessage = ''
  }

}
