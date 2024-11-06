//initialise socket
let socket = io();

//declare variable to store timeout Id
let timeoutId;

//declare variables for d3
let myRed = Math.random() * 256 | 0;
let myGreen = Math.random() * 256 | 0;
let myBlue = Math.random() * 256 | 0;
let myAlpha = Math.random() * 256 | 0;
let range = Math.random() * 900 | 700;
let charge = -140;

var width = 2400,
    circleSize,	
    height = 1800,
    τ = 1080 * Math.PI,
    maxLength = 60,
    maxLength2 = maxLength * maxLength;


var sliderValue = Math.random() * 2 | 0.1;    

//declare container for slider
const container = document.getElementById('sliderContainer');

//declare arrays for each phoneme
let phonemeList = [];
let dataArray = [];

// console.log('Range:'+range);
// console.log('Range:'+charge);

socket.on('connect', () => {
  // console.log("Connected");
});



//use Fetch method to get the phoneme data. Phoneme data is stored in json format.
fetch('/phonemes.json')
  .then(response => response.json())
  .then(data => {
    data.forEach((phoneme, index) => {
      dataArray[index] = 1;
      createSlider(phoneme, index); //this function dynanimcally creates a slider for each phoneme
    });
  })
  .catch(error => console.error('error in loading phoneme data:', error));



//Function to dynamically create one slider for each phoneme

function createSlider(phoneme, index) {

  //For each phoneme, 
  //create a slider wrapper 
  const sliderWrapper = document.createElement('div');
  //create a label
  const label = document.createElement('label');
  //create a sample word
  const sampleWord = document.createElement('sampleword');
  //create slider input
  const slider = document.createElement('input');


  //assign css classes so we can style it
  sliderWrapper.className = 'slider-wrapper';
  label.className = 'phoneme-label';
  sampleWord.className = 'sample-word';

  label.textContent = phoneme.label;
  sampleWord.textContent = `Example: ${phoneme.sampleword}`;



  //settings for each slider
  slider.type = 'range';
  slider.min = '0.1';
  slider.max = '5';
  slider.step = '0.1';
  slider.value = '1';
  slider.setAttribute('id', phoneme.id);

  //console.log(phoneme.id);
  if (!phoneme.id) {
    console.error(`Phoneme ID is missing for phoneme at index ${index}.`);
    return; // skip creating this slider if ID is missing
  }
  //each phoneme and slider has its own id. helps us identify 


  //append child elements to the wrapper
  sliderWrapper.appendChild(label);
  sliderWrapper.appendChild(sampleWord);
  sliderWrapper.appendChild(slider);
  sliderContainer.appendChild(sliderWrapper);


  //Event listener for slider value on the page
  slider.addEventListener('input', () => {
    const duration = slider.value;

    
    //update dataArray based on slider input
    dataArray[index] = parseFloat(duration);
    //console.log(dataArray[index])

    //console.log('slider input: ${slider}');
    playSound(phoneme.file, duration);

    //socket listens for changes and emits
    socket.emit('sliderChange', { id: phoneme.id, duration });
  });

}


function playSound(phonemeFile, duration) {
  //use find method. p is predicate, it runs through the array and searches for the elements in ascending order. It then returns the value of the element.
  //Int8Array.find(predicate: (value: number, index: number, obj: Int8Array) => boolean, thisArg?: any): number | undefined
  // const phonemeData = phonemeList.find(p => p.id === phoneme.Id);
  // if (!phonemeData) return;

  // const duration = document.getElementById(phonemeId).value;
  // console.log(duration);

  const audio = new Audio(`/sounds/${phonemeFile}`);
  //console.log(`attempt to play sound: ${phonemeFile} with duration: ${duration}`);
  audio.playbackRate = 1 / duration; // adjust playback rate
  //console.log(`playback rate: ${audio.playbackRate}`);

  audio.addEventListener('canplaythrough', () => {
    //console.log(`Sound ${phonemeFile} is okay to play`);
    audio.play();
  });

  audio.addEventListener('error', (e) => {
    //console.error(`Error loading audio file: ${phonemeFile}`, e);

  });

  audio.addEventListener('play', () => {
    //console.log(`Playing sound: ${phonemeFile} at speed: ${audio.playbackRate}`);

  });

}


socket.on('message-share', (data) => {
   console.log(data);
  ticked(data);
  
  τ = dataArray[0] * Math.PI,
//maxLength = dataArray[10] * 1.1;

  force.resume();



 });


socket.on('updateSoundDuration', (data) => {
  //console.log("data received:", data);
 
  //console.log(`this is the data we're receiving: ${JSON.stringify(data)}`);
  const slider = document.getElementById(data.id);

  if (slider) {
    
    //console.log(`${slider.value}`);
    slider.value = data.duration;

    sliderValue = slider.value;

    circleSize = Math.random() * sliderValue * 4.3;
    console.log(circleSize);


    //console.log(`${slider.value}`);
    updateSoundDuration(data.duration);
  } else {
    console.warn(`Slider for phoneme ID ${data.id} not found.`);
  }

});


phonemeList.forEach(createSlider);

function updateSoundDuration(duration) {
  //console.log(`updated duration for ${data.id}: ${duration}`);
  // const slider = document.getElementById(data.id);

}




var nodes = d3.range(range).map(function () {
  return {
    x: Math.random() * width,
    y: Math.random() * height - 650
  };
});

var force = d3.layout.force()
  .size([width, height])
  .nodes(nodes.slice())
  .charge(function (d, i) { return i ? charge : -100; })
  .on("tick", ticked)
  .start();


var voronoi = d3.geom.voronoi()
  .x(function (d) { return d.x; })
  .y(function (d) { return d.y; });

var root = nodes.shift();

root.fixed = true;

var canvas = d3.select(".chart").append("canvas")
  .attr("width", width)
  .attr("height", height)
  .on("mousemove" in document ? "touchmove" : "mousemove", moved);

var context = canvas.node().getContext("2d");

function moved() {
  var p1 = d3.mouse(this);
  root.px = p1[0];
  root.py = p1[1];
  circleSize = Math.random() * 1;
  force.resume();


  let mouseData = {
    x: root.px,
    y: root.py,
    r: myRed,
    g: myGreen,
    b: myBlue,
    a: myAlpha,
    d: circleSize || 5,
    ra: range,
    ch: charge,
    v: dataArray[0]
  }
  socket.emit('sliderChange', mouseData);

}

function ticked(obj) {

  range = obj.ra;
  charge = obj.ch;

  var links = voronoi.links(nodes);

  //context.clearRect(1500, 1500, width, height);

  context.beginPath();
  for (var i = 0, n = links.length; i < n; ++i) {
    var link = links[i],
      dx = link.source.x - link.target.x,
      dy = link.source.y - link.target.y;
    if (dx * dx + dy * dy < maxLength2) {
      context.moveTo(link.source.x, link.source.y);
      context.lineTo(link.target.x, link.target.y);
    }
  }

  context.lineWidth = 0.1;
context.strokeStyle = `rgba(${myRed},${myGreen},${myBlue},${myAlpha})`;
context.stroke();

  context.beginPath();
  for (var i = 0, n = nodes.length; i < n; ++i) {
    var node = nodes[i];
    context.moveTo(node.x, node.y);
    context.arc(node.x, node.y, circleSize, 0, τ);
  }
  context.lineWidth = sliderValue * 0.1;
  context.strokeStyle = `rgb(${obj.r},${obj.g},${obj.b})`;
  context.stroke();
  context.fillStyle = `rgb(${obj.r},${obj.g},${obj.b})`;
  context.fill();
}
