import React from "react";
import Header from "./Header";

function App() {

  let refImg;
  let c;
  let ctx;
  let testArray = [
    9,
    2,
    5,
    6,
    4,
    3,
    7,
    10,
    1,
    8
  ];

  let mappedArray = [];
  let mergedArray = [];

  function paintCanvas() {
    refImg = document.getElementById("reference-image");
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    ctx.drawImage(refImg, 0, 0);

  }

  // Converts imageData array to multidimensional array
  function dataToArray(imgData) {
    let array = [];
    for (let i = 0; i < imgData.length; i += 4) {
      let pixel = [];
      pixel.push(imgData[i]);
      pixel.push(imgData[i + 1]);
      pixel.push(imgData[i + 2]);
      pixel.push(imgData[i + 3]);
      array.push(pixel);

    }
    let rows = [];
    for (let i = 0; i < array.length; i += c.width) {
      let row = [];
      for (let j = 0; j < c.width; j++) {
        row.push(array[i + j]);
      }
      rows.push(row);
    }

    return rows;

  }
  // Converts multidimensional array to imageData array
  function arrayToData(rows) {
    let imgData = ctx.createImageData(c.width, c.height);
    let m = 0;
    // iterate through rows
    for (let i = 0; i < rows.length; i++) {
      // iterate through columns
      for (let j = 0; j < rows[i].length; j++) {
        imgData.data[m++] = rows[i][j][0];
        imgData.data[m++] = rows[i][j][1];
        imgData.data[m++] = rows[i][j][2];
        imgData.data[m++] = rows[i][j][3];
      }
    }
    return imgData;

  }

  // Randomizes Canvas
  function randomize() {
    let randRows = [];
    let rows = dataToArray(ctx.getImageData(0, 0, c.width, c.height).data);
    let randInts = randomArray(rows.length);
    for (let i = 0; i < rows.length; i++) {
      randRows.push(rows[randInts[i]]);
    }
    let randImgData = arrayToData(randRows);
    console.log(randImgData);
    ctx.putImageData(randImgData, 0, 0);

    // Maps random rows to integers to be sorted
    let j = 0;
    randInts.map(function (num) {
      mappedArray.push([num, randRows[j]]);
      j++;
    });
    console.log(mappedArray);

  }

  // -----------------------------------------------------------------------------
  // ------------------ Sorting --------------------------------------------------
  // -----------------------------------------------------------------------------
  // Bubble Sort
  async function bubbleSort() {
    let m = 0;
    for (let i = 0; i < mappedArray.length; i++) {
      for (let j = 0; j < mappedArray.length - 1; j++) {
        if (mappedArray[j][0] > mappedArray[j + 1][0]) {
          let temp = mappedArray[j];
          mappedArray[j] = mappedArray[j + 1];
          mappedArray[j + 1] = temp;
        }

        await sleep(1);
        renderCanvas();

      }
    }

  }

  // Selection Sort
  async function selectionSort() {
    for (var i = 0; i < mappedArray.length; i++) {
      var min = i;
      for (var j = i + 1; j < mappedArray.length; j++) {
        if (mappedArray[j][0] < mappedArray[min][0]) {
          min = j;
        }
        await sleep(1);
        let tempArray = mappedArray[j];
        mappedArray[j] = turnToWhite(mappedArray[j]);
        renderCanvas();
        mappedArray[j] = tempArray;
      }
      if (i !== min) {
        var temp = mappedArray[i];
        mappedArray[i] = mappedArray[min];
        mappedArray[min] = temp;
      }
    }
  }

  function turnToWhite(row) {
    for(let i=0; i < row.length; i++) {
      row[i] = [0, 0, 0, 0];
    }
    return row;
  }

  // Insertion Sort
  async function insertionSort() {
    for (let i = 1; i < mappedArray.length; i++) {
      let key = mappedArray[i];
      let j = i - 1;
      while (j >= 0 && mappedArray[j][0] > key[0]) {
        mappedArray[j + 1] = mappedArray[j];
        j = j - 1;

        await sleep(1);
        renderCanvas();

      }
      mappedArray[j + 1] = key;
    }
  }

  // Merge Sort
  function mergeSortVisual() {
    mappedArray = mergeSort(mappedArray);
    renderCanvas();
  }

  function mergeSort(array) {
    let len = array.length;
    if (len < 2) {
      mergedArray.push(array[0]);
      return array;
    }

    let mid = Math.floor(len / 2);
    let left = array.slice(0, mid);
    let right = array.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
  }
  function merge(left, right) {
    let result = [];
    let leftLength = left.length;
    let rightLength = right.length;
    let l = 0;
    let r = 0;
    while (l < leftLength && r < rightLength) {
      if (left[l][0] < right[r][0]) {
        result.push(left[l++]);
      } else {
        result.push(right[r++]);
      }
    }

    // let currentSorted = result.concat(left.slice(l)).concat(right.slice(r));
    // for(let i=0; i < currentSorted.length; i++) {   mergedArray[i] =
    // currentSorted[i]; } mappedArray = mergedArray; await sleep(1);
    // renderCanvas();
    return result
      .concat(left.slice(l))
      .concat(right.slice(r));

  }

  // Sleep
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Renders canvas with current mapped array
  function renderCanvas() {
    const sortedRows = mappedArray.map(function (num) {
      return num[1];
    });
    const imgData = arrayToData(sortedRows);
    ctx.putImageData(imgData, 0, 0);
  }

  // -----------------------------------------------------------------------------
  // -----------------
  // -----------------------------------------------------------------------------
  // - ---------------- Clears Canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, c.width, c.height);
  }

  // Creates a random array of integers 0 through specified number
  function randomArray(num) {
    let array = [];
    for (let i = 0; i < num; i++) {
      array.push(i);
    }
    let currentIndex = num;
    let temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  // Render Page
  return (
    <div className="App">
      <Header/>
      <div className="main">
        <div>
          <button onClick={paintCanvas} className="btn btn-dark">Paint on Canvas</button>
          <button onClick={clearCanvas} className="btn btn-dark">Clear Canvas</button>
          <button onClick={randomize} className="btn btn-dark">Randomize</button>
          <button onClick={bubbleSort} className="btn btn-dark">Bubble Sort</button>
          <button onClick={selectionSort} className="btn btn-dark">Selection Sort</button>
          <button onClick={insertionSort} className="btn btn-dark">Insertion Sort</button>
          <button onClick={mergeSortVisual} className="btn btn-dark">Merge Sort</button>
        </div>
        <div className="row">
          <div className="column">
            <img id="reference-image" src="milo.jpg" alt=""/>
          </div>
          <div className="column">
            <canvas id="myCanvas" width="200" height="200"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
