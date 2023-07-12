import { Component } from '@angular/core';
import { Howl } from 'howler'

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
  playerWins: number = 0;
  computerWins: number = 0;
  moveSound = new Howl({ src: ['assets/sounds/orb.mp3'] ,volume: 0.5 });
  winSound = new Howl({ src: ['assets/sounds/ff7.mp3'] ,volume: 0.5});
  loseSound = new Howl({ src: ['assets/sounds/snakedeath.mp3'] ,volume: 0.5 });
  tieSound = new Howl({ src: ['assets/sounds/tryagain.mp3'] ,volume: 0.5 });
  resetSound = new Howl({ src: ['assets/sounds/cheater.mp3'] });
  

  makeMove(index: number): void {
    if (!this.board[index] && !this.winner) {
      this.board[index] = this.currentPlayer;
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      this.moveSound.play();
      this.checkWinner();
      this.makeComputerMove();
    }
  }

  makeComputerMove(): void {
    if (!this.winner && this.board.includes(null)) {
      const bestMove = this.minimax(this.board, this.currentPlayer);

      setTimeout(() => {
        this.board[bestMove.index] = this.currentPlayer;
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.checkWinner();
      }, 500); // Delay to make it look like Computer is "thinking" (optional)
    }
  }

  minimax(board: Array<string | null>, player: string): { score: number, index: number } {
    if (this.checkWin(board, 'X')) {
      return { score: -1, index: -1 };
    } else if (this.checkWin(board, 'O')) {
      return { score: 1, index: -1 };
    } else if (!board.includes(null)) {
      return { score: 0, index: -1 };
    }
  
    const moves: { score: number, index: number }[] = [];
  
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = player;
  
        const move = this.minimax(newBoard, player === 'X' ? 'O' : 'X');
        move.index = i;
        moves.push(move);
      }
    }
  
    let bestMove;
    if (player === 'O') {
      bestMove = moves.reduce((prev, current) => (current.score > prev.score ? current : prev));
    } else {
      bestMove = moves.reduce((prev, current) => (current.score < prev.score ? current : prev));
    }
  
    return bestMove;
  }
  
  checkWin(board: Array<string | null>, player: string): boolean {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
  
    for (const combos of winningCombos) {
      const [a, b, c] = combos;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c] &&
        board[a] === player
      ) {
        return true;
      }
    }
  
    return false;
  }

  checkWinner(): void {
    if (this.checkWin(this.board, 'X')) {
      this.winner = 'X';
    } else if (this.checkWin(this.board, 'O')) {
      this.winner = 'O';
    } else if (!this.board.includes(null)) {
      this.winner = 'tie';
    }
  
    if (this.winner) {
      if (this.winner === 'X') {
        this.gameMessage = 'You Win!';
        this.winSound.play()
        this.playerWins++;
      } else if (this.winner === 'O') {
        this.gameMessage = 'You Lose!';
        this.loseSound.play()
        this.computerWins++;
      } else {
        this.gameMessage = "It's a Tie!";
        this.tieSound.play()
      }
  
      this.gameOver = true;
    }
  }

  resetGame(): void {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.gameOver = false;
    this.gameMessage = '';
  }

  resetWins(): void {
    this.computerWins = 0;
    this.playerWins = 0;
    this.resetSound.play()
  }
}