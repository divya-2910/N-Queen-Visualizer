let number = document.getElementById("input-num");
let slider = document.getElementById("speed-select");
let startButton = document.getElementById("start");
const queenIcon = '<i class="fas fa-chess-queen" id = "queen-icon"></i>';
const num_boards = [0, 2, 1, 1, 3, 11, 5, 41, 93, 353];
let no_of_queen_text = document.getElementById("no-of-arrangements");
let chessBoards = document.getElementById("chess-boards");
let n = number.value;

let Board = 0;
let nowState = {};
let q;

class chessQueen{
    constructor(n){
        this.state = Object.assign({},nowState);
        this.arrangements = num_boards[n];
        this.speed = slider*10;
        this.uuid = [];
        this.n = n;
    }

    startFunc = async() => {
        Board = 0;
        this.state[`${Board}`] = {};
        number.disabled = true;
        // await q.solve(0, n, Board);
        await q.resetBoard(Board);
        number.disabled = false;
    }

    resetBoard = async(i) => {
        console.log('Inside resetBoard(i)')
        for(let j = 0; j < n; j++){
            let table = document.getElementById(`board-${i}`);
            let row = table.firstChild.childNodes[j];
            for(let k = 0; k < n; k++){
                let cell = row.getElementsByTagName("td")[k];
                if( j%2 ==0 ){
                    (j+k)%2 == 0 ? cell.style.backgroundColor = "black" : cell.style.backgroundColor = "gray";
                }
                else{
                    (j+k)%2 == 0 ? cell.style.backgroundColor = "gray" : cell.style.backgroundColor = "black";
                }
                cell.style.border = "0.3px solid #373f51";
            }

        }
    }

    waitFunc = async() => {
        await new Promise((done) => setTimeout(() => done(), 400));
    }

    isValid = async(temp, r, c, n) => {
        let table = getElementById(`board-${temp}`);
        let row = table.firstChild.childNodes[r];
        let col = row.getElementsByTagName("td")[c];
        col.innerHTML = queenIcon;

        await q.waitFunc();
        console.log('Inside is Valid')
        let dupRow = r;
        let dupCol = c;
        dupCol--;

        while(dupCol >= 0){
            let curRow = table.firstChild.childNodes[dupRow];
            let curCol = curRow.getElementsByTagName("td")[dupCol];
            if(curCol.value == queenIcon){
                
                col.style.backgroundColor = "red";
                col.innerHTML = "";
                return false;
            }
            curCol.style.backgroundColor = "pink";
            await q.waitFunc();
            dupCol--;
        }

        dupRow--;
        dupCol = c-1;

        while(dupCol >= 0 && dupRow >= 0){
            let curRow = table.firstChild.childNodes[dupRow];
            let curCol = curRow.getElementsByTagName("td")[dupCol];
            if(curCol.value == queenIcon){
                col.style.backgroundColor = "red";
                col.innerHTML = "";
                return false;
            }
            curCol.style.backgroundColor = "pink";
            await q.waitFunc();
            dupCol--;
            dupRow--;
        }

        dupRow = r+1;
        dupCol = c-1;

        while(dupCol >= 0 && dupRow < n){
            let curRow = table.firstChild.childNodes[dupRow];
            let curCol = curRow.getElementsByTagName("td")[dupCol];
            if(curCol.value == queenIcon){
                col.style.backgroundColor = "red";
                col.innerHTML = "";
                return false;
            }
            curCol.style.backgroundColor = "pink";
            await q.waitFunc();
            dupCol--;
            dupRow++;
        }

        return true;
    }

    solve = async(col, n, tempBoard) => {
        if(col == n){
            ++Board;
            let table = document.getElementById(`board-${Board}`);
            for (let k = 0; k < n; ++k) {
                let row = table.firstChild.childNodes[k];
                row.getElementsByTagName("td")[this.state[tempBoard][k]].innerHTML = queenIcon;
            }
            this.state[Board] = this.state[tempBoard];
            return;
        }
        for(let r = 0; r < n; r++){
            await q.waitFunc();
            await q.resetBoard(r);

            if( await q.isValid(tempBoard, r, col, n)){
                await q.waitFunc();

                let table = document.getElementById(`board-${tempBoard}`);
                let row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[col].innerHTML = queenIcon;

                this.state[tempBoard][col] = r;

                if (await q.solve(col + 1, n, tempBoard))
                    await q.clearColor(tempBoard);

                await q.waitFunc();
                tempBoard = Board;
                // console.log(this.Board)
                table = document.getElementById(`board-${tempBoard}`);
                row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[col].innerHTML = "";

                delete this.state[`${tempBoard}`][`${col}`];
                
            }
        }
    }
}

startButton.onclick = async function startDisplay(){
    n = number.value;
    q = new chessQueen(n);

    if(n > 9){
        const warn = document.createElement("p");
        warn.setAttribute("class", "queen-info");
        warn.innerHTML = `Queen value is too big!`;
        no_of_queen_text.appendChild(warn);
        number.value = "";
        return;
    }
    else if(n < 1){
        const warn = document.createElement("p");
        warn.setAttribute("class", "queen-info");
        warn.innerHTML = `Queen value is too small!`;
        no_of_queen_text.appendChild(warn);
        number.value = "";
        return;
    }

    while(chessBoards.children.length > 0){
        chessBoards.removeChild(chessBoards.firstChild);
    }

    while(no_of_queen_text.children.length > 0){
        no_of_queen_text.removeChild(no_of_queen_text.lastChild);
    }

    const para = document.createElement("p");
    para.setAttribute("class", "queen-info");
    para.innerHTML = `For ${n}x${n} board, ${num_boards[n]} arrangements are possible:`;
    no_of_queen_text.appendChild(para);

    if(chessBoards.children.length == 0){
        for(let i = 0; i < num_boards[n]; i++){
            let div = document.createElement('div');
            let board = document.createElement('table');
            div.setAttribute("id",`div-${i}`);
            board.setAttribute("id", `board-${i}`);
            board.setAttribute("class", `board-i`)
            chessBoards.appendChild(div);
            div.appendChild(board);
        }
    }

    for(let i = 0; i < num_boards[n]; i++){
        let board = document.getElementById(`board-${i}`);
        for(let j = 0; j < n; j++){
            let row = board.insertRow(j);
            row.setAttribute("id", `row-${j}`);
            for(let k = 0; k < n; k++){
                let cell = row.insertCell(k);
                if( j%2 ==0 ){
                    (j+k)%2 == 0 ? cell.style.backgroundColor = "black" : cell.style.backgroundColor = "gray";
                }
                else{
                    (j+k)%2 == 0 ? cell.style.backgroundColor = "gray" : cell.style.backgroundColor = "black";
                }
                cell.style.border = "0.3px solid #373f51";
                // cell.innerHTML = queenIcon;
            }

        }
        await q.resetBoard(i);
    }
    await q.startFunc();
};
