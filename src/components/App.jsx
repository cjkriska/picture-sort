import React from "react";
import { useEffect } from "react";
import Header from "./Header";

function App() {

  // Global
  let refImg;
  let c;
  let ctx;
  let mappedArray = [];
  let stopSort = false;





  // Paints Canvas with Milo
  function paintMilo() {
    refImg = document.getElementById("milo-image");
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    
    let ratio = Math.min(1000/refImg.width, 400/refImg.height);
  
    refImg.width = refImg.width*ratio;
    refImg.height = refImg.height*ratio;

    c.width = refImg.width;
    c.height = refImg.height;
    ctx.drawImage(refImg, 0, 0, c.width, c.height);

  }

  // Paint your own Image - URL
  function paintCustom() {
    let source = document.getElementById("urlInput").value;
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    refImg = new Image();
    if (/^([\w]+\:)?\/\//.test(source)) {
      refImg.crossOrigin = "anonymous";
    }
    refImg.src = source;
    refImg.onload = function() {
      // Resizes image to smaller, keeps aspect ratio
      let ratio = Math.min(1000/refImg.width, 400/refImg.height);
      refImg.width = refImg.width*ratio;
      refImg.height = refImg.height*ratio;

      c.width = refImg.width;
      c.height = refImg.height;
      ctx.drawImage(refImg, 0, 0, c.width, c.height);
    }
  }
  // Image URL Button Click
  function clickImageURL() {
    let imgInput = document.getElementById("inp");
    if(imgInput.style.display === "inline") {
      imgInput.style.display = "none";
    } else {
      imgInput.style.display = "inline";
    }

  }

  // Paint your own Image - Upload
  useEffect(() => {

    let imgInput = document.getElementById("uploadInput");
    imgInput.addEventListener("change", function(e) {
      if(e.target.files) {
        let imageFile = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = function(e) {
          refImg = new Image();
          refImg.src = e.target.result;
          refImg.onload = function(ev) {
            c = document.getElementById("myCanvas");
            ctx = c.getContext("2d");

            let ratio = Math.min(1000/refImg.width, 400/refImg.height);
            refImg.width = refImg.width*ratio;
            refImg.height = refImg.height*ratio;
            c.width = refImg.width;
            c.height = refImg.height;

            ctx.drawImage(refImg, 0, 0, c.width, c.height);
          }
        }
      }
    });

  });
  // Upload Button Click
  function clickFileUpload() {
    document.getElementById("uploadInput").click();
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
    if(ctx) {
      let rows = dataToArray(ctx.getImageData(0, 0, c.width, c.height).data);
      let randInts = randomArray(rows.length);
      for (let i = 0; i < rows.length; i++) {
        randRows.push(rows[randInts[i]]);
      }
      let randImgData = arrayToData(randRows);

      ctx.putImageData(randImgData, 0, 0);

      // Maps random rows to integers to be sorted
      let j = 0;
      mappedArray = [];
      randInts.map(function (num) {
        mappedArray.push([num, randRows[j]]);
        j++;
      });

      console.log(mappedArray);

      document.querySelector(".sorts").style.display = "inline";

    } else {
      alert("Oops! Please upload image to sort!");
    }

  }

  // Clears Canvas
  function clearCanvas() {
    if(ctx) {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx = null;
    }
    mappedArray = [];
    document.querySelector(".sorts").style.display = "none";
  }

  // Stops Sorting
  async function stopSorting() {
    stopSort = true;
    await sleep(100);
    stopSort = false;
  }
  
  // Creates a random array of integers 0 through specified number
  function randomArray(num) {
    let array = [];
    for (let i = 0; i < num; i++) {
      array.push(i);
    }
    let currentIndex = num;
    let temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
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

  // Debugging function
  function logCurrentMappedArray() {
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
        
        if(j%10 === 0) {
          await sleep(1);
          renderCanvas();
        }
        if(stopSort) {
          return;
        }
      }
    }

  }

  // Selection Sort
  async function selectionSort() { 
    let n = mappedArray.length;
    for(let i=0; i < n; i++) {
        let min = i;
        for(let j=i; j < n; j++){
            if(mappedArray[j][0] < mappedArray[min][0]) {
                min = j; 
            }

            if(stopSort) {
              return;
            }

         }
         if (min != i) {
             let temp = mappedArray[i]; 
             mappedArray[i] = mappedArray[min];
             mappedArray[min] = temp;
             await sleep(100);
             renderCanvas();
        }
    }
}

  // Insertion Sort
  async function insertionSort() {
    for (let i = 1; i < mappedArray.length; i++) {
      let key = mappedArray[i];
      let j = i - 1;
      while (j >= 0 && mappedArray[j][0] > key[0]) {
        mappedArray[j + 1] = mappedArray[j];
        j = j - 1;


        if(stopSort) {
          return;
        }

      }
      mappedArray[j + 1] = key;
      await sleep(1);
      renderCanvas();
    }
  }






  // Merge Sort - 1
  // Idea: Find a way to remember where each sliced array starts in the entire mappedArray
  // so you can continuously change mappedArray values and render them
  function mergeSort(array) {
    if(array.length <= 1) {
      return array;
    }

    const mid = Math.floor(array.length / 2);
    const left = array.slice(0, mid);
    const right = array.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
  }
  // Idea: Merge needs a way to know where it is in mappedArray
  function merge(left, right) {

    let resultArray = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while(leftIndex < left.length && rightIndex < right.length) {
      if(left[leftIndex][0] < right[rightIndex][0]) {
        resultArray.push(left[leftIndex]);
        leftIndex++;
      } else {
        resultArray.push(right[rightIndex]);
        rightIndex++;
      }
      
    }
    
    resultArray = resultArray.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    return resultArray;
  }




  // MERGE SORT - 2
  async function mergeSort2(array, l, r) {
      if(l < r) {
        let m = l + Math.floor((r-l) / 2);
        mergeSort2(array, l, m);
        mergeSort2(array, m+1, r);
        await sleep(1000*Math.sqrt(r-l));
        renderCanvas();
        merge2(array, l, m, r);
      }
    }
    function merge2(array, start, mid, end) {
      let start2 = mid + 1;
      if(array[mid][0] <= array[start2][0]) {
        return;
      }
  
      while(start <= mid && start2 <= end) {
        if(array[start][0] <= array[start2][0]) {
          start++;
        } else {
          let value = array[start2];
          let index = start2;
          while(index != start) {
            array[index] = array[index-1];
            index--;
            
          }
          array[start] = value;
  
          start++;
          mid++;
          start2++;
        }
      }
  
    }



  // Merge Sort - 3
  async function mergeSort3(array, l, r) {
    let length = r - l;
    if(length < 2) {
      return array;
    }
    let m = l + Math.floor(length / 2);
    mergeSort3(array, l, m);
    mergeSort3(array, m, r);
    await sleep(500*Math.sqrt(r-l));
    renderCanvas();
    merge3(array, l, m, r);

  }
  function merge3(array, left, mid, right) {
    let result = [];
    let l = left;
    let r = mid;
    while(l < mid && r < right) {
      if(array[l][0] < array[r][0]) {
        result.push(array[l++]);
      } else {
        result.push(array[r++]);
      }
    }
    result = result.concat(array.slice(l, mid)).concat(array.slice(r, right));
    for(let i=0; i < right-left; i++) {
      array[left+i] = result[i];
    }
  }

  

  // Merge Sort Visual
  async function mergeSortVisual() {
    await mergeSort3(mappedArray, 0, mappedArray.length-1);
    await sleep(1000);
    renderCanvas();
  }


  // -----------------------------------------------------------------------------
  // -----------------------------------------------------------------------------



  // Render Page
  return (
    <div className="App">
      <Header/>
      <div className="main container">
        <div className="row">

          <div className="upload-pic-section col-2 vh-100">
            <button onClick={clickImageURL} className="btn btn-dark" type="button">Image URL</button>
            <div id="inp">
              <input id="urlInput" type="text" placeholder="Enter URL" className="form-control" />
              <button onClick={paintCustom} className="btn btn-outline-light" id="submitURL">Go</button>
            </div>
            <input id="uploadInput" type="file" accept="image/*" className="form-control"/>
            <button onClick={clickFileUpload} className="btn btn-dark">Upload Image</button>
            <button onClick={paintMilo} className="btn btn-dark">Milo</button>
            <img id="milo-image" src="milo3.jpg" alt=""/>
          </div>

          <div className="sorting-section col-10">
            <button onClick={randomize} className="btn btn-dark">Randomize</button>
            <div className="sorts">
              <button onClick={insertionSort} className="btn btn-dark">Insertion Sort</button>
              <button onClick={bubbleSort} className="btn btn-dark">Bubble Sort</button>
              <button onClick={selectionSort} className="btn btn-dark">Selection Sort</button>
              <button onClick={mergeSortVisual} className="btn btn-dark">Merge Sort</button>
              <button onClick={stopSorting} className="btn btn-outline-dark">Stop Sorting</button>
            </div>
            <button onClick={clearCanvas} className="btn btn-outline-dark">Clear</button>

            {/* Debugging */}
            {/* <button onClick={logCurrentMappedArray} className="btn btn-light">Log Current Mapped Array</button> */}
            
            <canvas id="myCanvas" />
          </div>

        </div>






      </div>
    </div>
  );
}

export default App;
