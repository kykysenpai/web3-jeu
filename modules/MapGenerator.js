const fs = require("fs");

var map = { "height":0,
    "layers":[
       {
        "data":[],
        "height":0,
        "name":"Pacman",
        "opacity":1,
        "type":"tilelayer",
        "visible":true,
        "width":0,
        "x":0,
        "y":0
       }],
"orientation":"orthogonal",
"properties":
   {

   },
"tileheight":16,
"tilesets":[
       {
        "firstgid":1,
        "image":"pacman-tiles.png",
        "imageheight":48,
        "imagewidth":256,
        "margin":0,
        "name":"pacman-tiles",
        "properties":
           {

           },
        "spacing":0,
        "tileheight":16,
        "tilewidth":16
       }],
"tilewidth":16,
"version":1,
"width":0
};

var max = 50;
var min = 25;
var height = Math.floor((Math.random()*(max-min))+min);
var width = 2*height;
var cHG = 1;
var cHD = 5;
var cBG = 20;
var cBD = 24;
var mD = 10;
var mG = 6;
var mT = 2;
var mB = 21;
var dalle = 14;
var element = [3,4,8,9,10,11,12,13,15,16,17,18,19,22,23,25]
var data = [];
for(var i = 0; i<height*width-1;i++){
    if(i === 0){
        data.push(cHG);
    }
    else if(i === width -1){
        data.push(cHD);
    }
    else if(i === (height*width)-width){
        data.push(cBG);
    }
    else if(i<width){
        data.push(mT);
    }
    else if(i>(height*width)-width){
        data.push(mB);
    }
    else{
        if(i%width === 0){
            data.push(mG);
        }
        else if(i%width+1 === width){
            data.push(mD);
        }
        else{
            var randDalle = Math.floor((Math.random()*50))
            if(i%randDalle === 0){
                var randElem = element[Math.floor((Math.random()*element.length))];
                data.push(randElem);
            }else{
                data.push(dalle);
            }
            //add algo random
        }
    }
}
data.push(cBD);

map.height = height;
map.width = width;

map.layers[0].data = data;
map.layers[0].height = height;
map.layers[0].width = width;

var json = JSON.stringify(map);

fs.writeFile('../www/assets/random-map.json',json,'utf8');
