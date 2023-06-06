'use strict'
let number = document.getElementById('input-num');
let startButton = document.getElementById('start');
let speed = document.getElementById('speed-select');
let n = 0;
let num_boards = [0, 2, 1, 1, 3, 11, 5, 41, 93, 353];
const queenIcon = '<i class="fas fa-chess-queen" style="color:#000"></i>';
let q, Board = 0;

let nowState = {};

class nQueen{
    constructor(n){
        this.n = n;
        this.state = Object.assign({},nowState);
    }

    startFunc = async(n) => {
        Board = 0;
        this.state[`${Board}`] = {};
        await q.solve(Board, 0, n);
        await q.resetColor(Board, n);
    }

    waitTime = async() => {
        await new Promise((done) => setTimeout(() => done(), 100));
    }

    solve = async(board, r, n) => {
        if(r == n){
            Board++;
            let table = document.getElementById(`table-${Board}`);
            for(let m = 0; m < n; ++m){
                let row = table.firstChild.childNodes[m];
                row.getElementsByTagName("td")[this.state[board][m]].innerHTML = queenIcon;
            }
            this.state[Board] = this.state[board];
            return;
        }
        for(let c = 0; c < n; c++){
            await q.waitTime();
            await q.resetColor(board, n);
            if(await q.isValid(board, r, c, n)){
                await q.waitTime();
                await q.resetColor(board, n);
                let table = document.getElementById(`table-${board}`);
                let row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[c].innerHTML = queenIcon;
                this.state[board][r] = c;
                if(await q.solve(board, r+1, n))
                    await q.resetColor(board, n);
                // }
                await q.waitTime();
                board = Board;
                table = document.getElementById(`table-${board}`);
                row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[c].innerHTML = "";
                delete this.state[`${board}`][`${r}`];
            }
        }
    }
    
    resetColor = async(board, n) => {
        // console.log('Inside resetColor');
        // console.log(board);
        const table = document.getElementById(`table-${board}`);
        for(let i = 0; i < n; i++){
            const row = table.firstChild.childNodes[i];
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

    isValid = async(board, r, c, n) => {
        const table = document.getElementById(`table-${board}`);
        const row = table.firstChild.childNodes[r];
        const col = row.getElementsByTagName("td")[c];
        col.innerHTML = queenIcon;
        await q.waitTime();
        
        let dupRow, dupCol;
        dupRow = r-1;
        while(dupRow >= 0){
            const checkRow = table.firstChild.childNodes[dupRow];
            const checkCol = checkRow.getElementsByTagName("td")[c];

            if(checkCol.innerHTML == queenIcon){
                checkCol.style.backgroundColor = "red";
                col.innerHTML = "";
                return false;
            }

            checkCol.style.backgroundColor = "blue";
            await q.waitTime();
            dupRow--;
        }

        dupRow = r-1;
        dupCol = c-1;
        while(dupRow >= 0 && dupCol >= 0){
            const checkRow = table.firstChild.childNodes[dupRow];
            const checkCol = checkRow.getElementsByTagName("td")[dupCol];

            if(checkCol.innerHTML == queenIcon){
                checkCol.style.backgroundColor = "red";
                col.innerHTML = "";
                return false;
            }

            checkCol.style.backgroundColor = "blue";
            await q.waitTime();
            dupRow--;
            dupCol--;
        }

        dupRow = r-1;
        dupCol = c+1;
        while(dupRow >= 0 && dupCol < n){
            const checkRow = table.firstChild.childNodes[dupRow];
            const checkCol = checkRow.getElementsByTagName("td")[dupCol];

            if(checkCol.innerHTML == queenIcon){
                checkCol.style.backgroundColor = "red";
                col.innerHTML = "";
                return false;
            }

            checkCol.style.backgroundColor = "blue";
            await q.waitTime();
            dupRow--;
            dupCol++;
        }

        // await q.resetColor();
        return true;
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
    for(let i = 0; i < num_boards[n]; i++){
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
    await q.startFunc(n);
}
