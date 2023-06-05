'use strict'
let number = document.getElementById('input-num');
let startButton = document.getElementById('start');
let speed = document.getElementById('speed-select');
let n = 0;
let num_boards = [0, 2, 1, 1, 3, 11, 5, 41, 93, 353];
const queenIcon = '<i class="fas fa-chess-queen" style="color:#000"></i>';
let q;

class nQueen{
    constructor(n){
        this.n = n;
    }

    waitTime = async() => {
        await new Promise((done) => setTimeout(() => done(), 1500));
    }
    
    resetColor = async(board, n) => {
        console.log('Inside resetColor');
        console.log(board);
        let table = document.getElementById(`table-${board}`);
        for(let i = 0; i < n; i++){
            let row = table.firstChild.childNodes[i];
            for(let j = 0; j < n; j++){
                if((i+j)%2 == 0){
                    row.getElementsByTagName("td")[j].style.backgroundColor = "green";
                }
                else{
                    row.getElementsByTagName("td")[j].style.backgroundColor = "pink";
                }
            }
        }
        return;
    }
};

startButton.onclick = async function startDisplay(n) {
    n = number.value;
    q = new nQueen(n);
    // console.log(n);
    // console.log(speed.value);
    
    const no_of_arrangements = document.getElementById('no-of-arrangements');
    const chess_boards = document.getElementById('chess-boards');

    while(chess_boards.childElementCount > 0){
        chess_boards.removeChild(chess_boards.firstChild);
    }

    while(no_of_arrangements.childElementCount > 0){
        no_of_arrangements.removeChild(no_of_arrangements.firstChild);
    }

    let info = document.createElement('para');
    info.setAttribute("id", "queen-info");
    info.innerHTML = `For ${n}x${n} board, ${num_boards[n]-1} different arrangements are possible : `;

    no_of_arrangements.appendChild(info);

    // console.log(num_boards[n]);
    for(let i = 0; i < num_boards[n]-1; i++){
        let div = document.createElement('div');
        div.setAttribute("id",`div-${i}`);
        div.setAttribute("class","each-div");
        let table = document.createElement('table');
        table.setAttribute("id", `table-${i}`);
        table.setAttribute("class","each-board");
        for(let j = 0; j < n; j++){
            let row = table.insertRow(j);
            row.setAttribute("id",`row-${i}-${j}`);
            for(let k = 0; k < n; k++){
                let cell = row.insertCell(k);
                if((j+k)%2 == 0){
                    cell.style.backgroundColor = "green";
                }
                else{
                    cell.style.backgroundColor = "pink";
                }
                cell.style.border = "0.3px solid black";
                // cell.innerHTML = queenIcon;
            }
        }
        div.appendChild(table);
        chess_boards.appendChild(div);
        await q.waitTime();
        await q.resetColor(i, n);
    }
}
