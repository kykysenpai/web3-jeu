const fs = require("fs");

var max = 50;
var min = 25;
var height = 30; //Math.floor((Math.random() * (max - min)) + min);
var width = 2 * height;
var dalle = 5;
var brique = 1;

//rajoute une brique dans la map
var pushBrique = function(map, i) {
	map.push(1 + 2 * (data[i - 1] % 5 != 0) + (map[i - width] % 5 != 0));
	map[i - 1] += 5;
	map[i - width] += 10;
}
//remplis les tuiles de type "dalle" apd la coordonnee x,y
var floodMap = function(x, y, map) {
	var tileStack = [
		[x, y]
	];
	while (tileStack.length) {
		newPos = tileStack.pop();
		//console.log(newPos);
		x = newPos[0];
		y = newPos[1];

		tilePosition = x + y * width;
		while (y-- && map[tilePosition] % 5 == 0 && map[tilePosition] < 25) {
			tilePosition -= width;
		}
		left = false;
		right = false;
		y++;
		tilePosition += width;
		while (y++ < height && map[tilePosition] % 5 == 0 && map[tilePosition] < 25) {
			map[tilePosition] = 25;
			if (x > 0) {
				if (map[tilePosition - 1] % 5 == 0) {
					if (!left) {
						left = true;
						tileStack.push([x - 1, y]);
					}
				} else {
					left = false;
				}
			}
			if (x < width - 1) {
				if (map[tilePosition + 1] % 5 == 0) {
					if (!right) {
						right = true;
						tileStack.push([x + 1, y]);
					}
				} else {
					right = false;
				}
			}
			tilePosition += width;
		}


	}
}

//Retire la matière inutile à gauche et à droite
var cutWidth = function(map, width, height) {
	newWidth = width;
	cutLeft = false;
	cutRight = false;
	while (!cutLeft) {
		for (i = 0; i++; i < height && !cutLeft) {
			if (map[i + 1] == 25) {
				cutLeft = true;
			}
		}
		if (!cutLeft) {
			for (i = height; i--; i > -1) {
				map = map.splice(i + 1, 1);
			}
			newWidth--;
		}
	}
	while (!cutRight) {
		for (i = 0; i++; i < height && !cutRight) {
			if (map[i + newWidth - 2] == 25) {
				cutRight = true;
			}
		}
		if (!cutRight) {
			for (i = height; i--; i > -1) {
				map = map.splice(i + newWidth - 2, 1);
			}
			newWidth--;
		}
	}
	return newWidth;
}


//Retire la matière inutile en haut et en bas
var cutHeight = function(map, width, height) {
	newHeight = height;
	cutBottom = false;
	cutTop = false;
	while (!cutBottom) {
		for (i = 0; i++; i < width && !cutBottom) {
			if (map[width + i] == 25) {
				cutBottom = true;
			}
		}
		if (!cutBottom) {
			map = map.splice(width, width);
			newHeight--;
		}
	}
	while (!cutTop) {
		for (i = 0; i++; i < width && !cutTop) {
			if (map[((newHeight - 1) * width) + i] == 25) {
				cutTop = true;
			}
		}
		if (!cutTop) {
			map = map.splice((newHeight - 1) * width, width);
			newHeight--;
		}
	}
	return newHeight;
}

//remplace la tuile en i par une brique
var fill = function(map, i) {
	value = map[i];
	if (value < 25) {
		map[i] = 1 + 2 * (map[i - 1] % 5 != 0) + (map[i - width] % 5 != 0);
		map[i - 1] += 5;
		map[i - width] += 10;
	}
}

var map = {
	"height": 0,
	"layers": [{
		"data": [],
		"height": 0,
		"name": "Pacman",
		"opacity": 1,
		"type": "tilelayer",
		"visible": true,
		"width": 0,
		"x": 0,
		"y": 0
	}],
	"orientation": "orthogonal",
	"properties": {

	},
	"tileheight": 16,
	"tilesets": [{
		"firstgid": 1,
		"image": "tiles.png",
		"imageheight": 137,
		"imagewidth": 86,
		"margin": 1,
		"name": "tiles",
		"properties": {

		},
		"spacing": 1,
		"tileheight": 16,
		"tilewidth": 16
	}],
	"tilewidth": 16,
	"version": 1,
	"width": 0
};


var data = [1];
for (var i = 1; i < height * width; i++) {

	if (i < width) {
		data.push(3);
		data[i - 1] += 5;
	} else if (i % width === 0) {
		data.push(2);
		data[i - width] += 10;
	} else if (i % width === width - 1) {
		data.push(brique);
		//pushBrique(data, i);
	} else if (i > width * (height - 1)) {
		data.push(brique);
		//pushBrique(data, i);
	} else {
		var randDalle = Math.floor((Math.random() * 10)) + 3 * (data[i - 1] % 5 != 0) + 3 * (data[i - width] % 5 != 0) - 7 * (data[i - 1] % 5 != 0 && data[i - width] % 5 != 0);
		if (randDalle > 7) {
			data.push(brique);
			//pushBrique(data, i);
		} else {
			data.push(dalle)
		}
	}




}
var randX = 0;
var randY = 0;
while (data[randX + width * randY] % 5 != 0) {
	//console.log(data[randX + width * randY] + ";" + randX + ";" + randY);
	randX = Math.floor((Math.random() * width));
	randY = Math.floor((Math.random() * height));
}
//console.log("pre flood")
floodMap(randX, randY, data);
//console.log("post flood")

/*
var countCut = 0;
cutLeft = false;
cutRight = false;
console.log("left")
while(!cutLeft){
    //console.log("left "+countCut);
    for(i = 0; i<height && !cutLeft; i++){
        if(countCut<3 && i < 4){
            console.log((i*width+1+countCut) +" : " +data[i*width+1+countCut]);
        }
        if(data[i*width+1+countCut] == 25){
            cutLeft = true;
        }
    }
    if(!cutLeft){
        countCut++;
    }
}

console.log(data[58]);
for(i = height; i>-1; i--){
    data.splice(i*width+1,countCut);
}
width-=countCut;
countCut = 0;
console.log("right " +width);
while(!cutRight){
    //console.log("right "+countCut);
    for(i = 0; i<height && !cutRight; i++){
        if(countCut<3 && i < 4){
            console.log((i*width+width-2-countCut)+" : "+data[i*width+width-2-countCut]);
        }
        if(data[i*width+width-2-countCut] == 25){
            cutRight = true;
        }
    }
    if(!cutRight){
        countCut++;
    }
}

for(i = height; i>-1; i--){
    data.splice(i*width+width-2,1);
}
width-=countCut;




cutBottom = false;
cutTop = false;
countCut = 0;
while(!cutBottom){
    //console.log("bottom "+countCut);
    for(i = 0; i < width && !cutBottom; i++){
        if(data[width+i] == 25){
            cutBottom = true;
        }
    }
    if(!cutBottom){
        countCut++;
    }
}
data.splice(width, countCut*width);
height-=countCut;
countCut = 0;
while(!cutTop){
    //console.log("top "+countCut);
    for(i = 0; i < width && !cutTop; i++){
        if(data[((height - 2-countCut) * width) + i] == 25){
            cutTop = true;
        }
    }
    if(!cutTop){
        countCut++;
    }
}

data.splice((height - 1) * width, width*countCut);
height-=countCut;



//width = cutWidth(map, width, height);
//height = cutHeight(map, width, height);



*/

for (x = 1; x < width; x++) {
	for (y = 1; y < height; y++) {
		fill(data, x + y * width);
	}
}


map.height = height;
map.width = width;

map.layers[0].data = data;
map.layers[0].height = height;
map.layers[0].width = width;





var json = JSON.stringify(map);
//console.log("end");
fs.writeFileSync(__dirname + '/../www/assets/random-map.json', json, 'utf8');
console.log("random-map file written");
