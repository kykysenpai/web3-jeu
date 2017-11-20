const fs = require("fs");



var create = function(size) {

	//rajoute une brique dans la map
	var pushBrique = function(map, i) {
		width = map.width;
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

	//cree les zones de depart
	var spawn = function(map, spawnSize) {
		for (i = 0; i < spawnSize; i++) {
			for (j = 0; j < spawnSize; j++) {
				map[1 + i + (1 + j) * width2] = 25; // spawn pacmen
				map[width2 - i - 2 + (height2 - j - 2) * width2] = 25; // spawn phantoms
			}
		}
		//connexion horizontal pacmen
		unConnected = true;
		z = spawnSize + 1;
		while (unConnected) {
			if (map[z + spawnSize / 2 * width2] == 25) {
				unConnected = false;
			}
			map[z + spawnSize / 2 * width2] = 25;
			map[z + (spawnSize / 2 + 1) * width2] = 25;
			z++;
		}

		//connexion verticale pacmen
		unConnected = true;
		z = spawnSize + 1;
		while (unConnected) {
			if (map[spawnSize / 2 + z * width2] == 25) {
				unConnected = false;
			}
			map[spawnSize / 2 + z * width2] = 25;
			map[(spawnSize / 2 + 1) + z * width2] = 25;
			z++;
		}

		//connexion horizontal phantoms
		unConnected = true;
		z = width2 - spawnSize - 2;
		h = height2 - spawnSize / 2 - 2;
		while (unConnected) {
			if (map[z + h * width2] == 25) {
				unConnected = false;
			}
			map[z + h * width2] = 25;
			map[z + (h + 1) * width2] = 25;
			z--;
		}

		//connexion vertical phantoms
		unConnected = true;
		z = height2 - spawnSize - 2;
		h = width2 - spawnSize / 2 - 2;
		while (unConnected) {
			if (map[h + z * width2] == 25) {
				unConnected = false;
			}
			map[h + z * width2] = 25;
			map[(h + 1) + z * width2] = 25;
			z--;
		}

	}

	//remplace la tuile en i par une brique
	var fill = function(map, i, width) {
		value = map[i];
		if (value < 25) {
			map[i] = 1 + 2 * (map[i - 1] % 5 != 0) + (map[i - width] % 5 != 0);
			map[i - 1] += 5;
			map[i - width] += 10;
		}
	}


	var max = 50;
	var min = 25;
	var height;
	var spwanSize

	if (size == 'small') {
		height = 16;
		spawnSize = 2;
	} else if (size == 'medium') {
		height = 30;
		spawnSize = 4;
	} else if (size == 'large') {
		height = 44;
		spawnSize = 6;
	} else {
		console.log('entree invalide');
		return;
	}

	var width = 2 * height;
	var dalle = 5;
	var brique = 1;
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
		} else if (i > width * (height - 1)) {
			data.push(brique);
		} else {
			var randDalle = Math.floor((Math.random() * 10)) + 3 * (data[i - 1] % 5 != 0) + 3 * (data[i - width] % 5 != 0) - 7 * (data[i - 1] % 5 != 0 && data[i - width] % 5 != 0);
			if (randDalle > 7) {
				data.push(brique);
			} else {
				data.push(dalle)
			}
		}




	}
	var randX = 0;
	var randY = 0;
	while (data[randX + width * randY] % 5 != 0) {
		randX = Math.floor((Math.random() * width));
		randY = Math.floor((Math.random() * height));
	}

	floodMap(randX, randY, data);

	var left = 0;
	var right = 0;
	var top = 0;
	var bottom = 0;
	cutLeft = false;
	cutRight = false;

	while (!cutLeft) {
		for (i = 0; i < height && !cutLeft; i++) {

			if (data[i * width + 1 + left] === 25) {
				cutLeft = true;
			}
		}
		if (!cutLeft) {
			left++;
		}
	}

	while (!cutRight) {
		for (i = 0; i < height && !cutRight; i++) {

			if (data[i * width + width - 2 - right] === 25) {
				cutRight = true;
			}
		}
		if (!cutRight) {
			right++;
		}
	}




	cutBottom = false;
	cutTop = false;
	while (!cutBottom) {
		for (i = 0; i < width && !cutBottom; i++) {
			if (data[bottom * width + width + i] === 25) {
				cutBottom = true;
			}
		}
		if (!cutBottom) {
			bottom++;
		}
	}
	while (!cutTop) {
		for (i = 0; i < width && !cutTop; i++) {
			if (data[((height - 2 - top) * width) + i] === 25) {
				cutTop = true;
			}
		}
		if (!cutTop) {
			top++;
		}
	}

	var data2 = [];


	var bottomLimit = bottom * width;
	var topLimit = (height - top) * width;
	var leftLimit = left;
	var rightLimit = width - right;
	for (var i in data) {
		if (i < bottomLimit) {} else if (i >= topLimit) {} else if (i % width < leftLimit) {} else if (i % width >= rightLimit) {} else {
			data2.push(data[i]);
		}
	}

	var height2 = height - top - bottom
	var width2 = width - left - right;

	if (height2 < 0.75 * height || width2 < 0.75 * width) {
		console.log('trop petit');
		create(size);
		return;
	}

	for (x = 1; x < width; x++) {
		for (y = 1; y < height; y++) {
			fill(data, x + y * width, width);
		}
	}


	map.height = height;
	map.width = width;

	map.layers[0].data = data;
	map.layers[0].height = height;
	map.layers[0].width = width;

	var json = JSON.stringify(map);
	console.log("end");
	fs.writeFileSync(__dirname + '/../www/assets/random-map.json', json, 'utf8');



	spawn(data2, spawnSize);

	for (x = 0; x < width2; x++) {
		for (y = 0; y < height2; y++) {
			fill(data2, x + y * width2, width2);
		}
	}

	console.log("totalsize2 = " + data2.length);


	map.height = height2;
	map.width = width2;

	map.layers[0].data = data2;
	map.layers[0].height = height2;
	map.layers[0].width = width2;





	var json = JSON.stringify(map);
	console.log("end");
	var nameFile = __dirname + '/../www/assets/random-map-' + size + '.json';
	fs.writeFileSync(nameFile, json, 'utf8');
}

create('small');
create('medium');
create('large');
