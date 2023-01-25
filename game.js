
// Write Javascript code!
const game = document.getElementById('game');
const newGameBtn = document.getElementById('newGame');
const hintBtn = document.getElementById('hint')
var dataURL
var image = new Image()
var imageArray = []
var currentImageArray = []
var hintClicked = false
const correctArray = [[0,1,2],[3,4,5],[6,7,8]]
let currentGameArray = []
function newGame (){
    game.innerHTML = `
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
<p class="text-muted m-3">LOADING ...</p>`
    newGameBtn.disabled = true
    hintBtn.disabled = true
image = new Image()
 imageArray = []
 currentImageArray = []
 hintClicked = false
 currentGameArray = []
startGame()
}
startGame()
function startGame(){
    fetch('https://picsum.photos/600').then((d)=>d.blob()).then((imageBlob)=>{
     dataURL = URL.createObjectURL(imageBlob);
     image.src = dataURL
     image.crossOrigin = "*"
     image.onload = appendImagesToArrayAndStartGame
})
}



function handleClick(clickedIndex){
    if(hintClicked){return}
    const [x,y] = searchIndex(clickedIndex)
    const [zeroX,zeroY] = searchIndex(0)
    if(((Math.abs(zeroX-x)===1 && Math.abs(zeroY-y)===0)
    ||
    (Math.abs(zeroX-x)===0 && Math.abs(zeroY-y)===1)
    )){
        const val = currentGameArray[x][y]
        currentGameArray[zeroX][zeroY] = val
        currentGameArray[x][y] = 0
        drawBoard()
        checkWin()

    }
    
}


function searchIndex(index){
    for(let i=0;i<currentGameArray.length;i++){
        for(let j=0;j<currentGameArray[i].length;j++){
            if(currentGameArray[i][j]===index){
                return [i,j]
            }
        }
    }
}


function checkWin(){
    for(let i=0;i<currentGameArray.length;i++){
        for(let j=0;j<currentGameArray.length;j++){
            if(currentGameArray[i][j] !== correctArray[i][j]){
                return
            }
        }
    }

    game.innerHTML = '<h1 class="text-warning">YOU WON !!!!</h1>'
    setTimeout(()=>{drawBoard()},2000)
    hintClicked = true
    hintBtn.disabled = true
    
}




function appendImagesToArrayAndStartGame(){
    for(let x=0;x<600;x+=200){
        for(let y=0;y<600;y+=200){
            const clipURL = getClippedRegion(image,x,y,200,200)
            imageArray.push(clipURL)
        }
    }
     imageArray = imageArray.map((url,i)=>`<img onclick="handleClick(${i})" data-i="${i}" src="${url}"/>`)
    let randomArray
    
    let arraySolvable = false
    do{
        randomArray=shuffleArray([0,1,2,3,4,5,6,7,8])
        currentGameArray = []
        for(let i=0;i<3;i++){
            currentGameArray.push(randomArray.slice(i*3,i*3+3))
        }
        arraySolvable = checkIfSolvable(currentGameArray)
        }
        while(!arraySolvable)

    
    drawBoard(currentGameArray)
    hintBtn.disabled = false
    newGameBtn.disabled = false
}

function drawBoard(){
    game.innerHTML = ''
    currentGameArray.forEach((row)=>{row.forEach(i=>{game.innerHTML+=imageArray[i]})})
}


function getClippedRegion(image, x, y, width, height) {

    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, x, y, width, height,0,0,width,height);
     return canvas.toDataURL();
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function hint(){
    hintClicked = true
    hintBtn.disabled = true

    const tmp = currentGameArray
    currentGameArray = correctArray
    drawBoard()
    setTimeout(()=>{
        currentGameArray = tmp
        drawBoard()
        hintClicked = false
        hintBtn.disabled = false
    },1000)
}
    

function getInvCount(arr)
{
    console.log(arr)
    let inv_count = 0 ;
    for(let i=0;i<2;i++){
        for(let j=i+1;j<3;j++){
         
            // Value 0 is used for empty space
            if (arr[j][i] > 0 && arr[j][i] > arr[i][j])
                inv_count += 1;
        }
     }
    return inv_count;
}
// This function returns true
// if given 8 puzzle is solvable.
function checkIfSolvable(puzzle)
{
    console.log('checking')
    console.log(puzzle)
    // Count inversions in given 8 puzzle
    let invCount = getInvCount(puzzle);
    // return true if inversion count is even.
    return (invCount % 2 == 0);
}
