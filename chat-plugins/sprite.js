'use strict';

exports.commands = {
'!sprite': true,
spr: 'sprite',
    sprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/sprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/xyani-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/xyani-back/';
		else if (type === 'backshiny' || type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/xyani-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/xyani/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
			room.update();
		});
	},
    '!bwsprite': true,
    bwspr: 'bwsprite',
    bwsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/bwsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'bwshiny') url = 'http://play.pokemonshowdown.com/sprites/bwani-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/bwani-back/';
		else if (type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/bwani-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/bwani/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
			room.update();
		});
	},
	'!dppsprite': true,
	dppspr: 'dppsprite',
        dppsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/dppsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/dpp-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/dpp-back/';
		else if (type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/dpp-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/dpp/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
			room.update();
		});
	},
	'!rsesprite': true,
	rsespr: 'rsesprite',
        rsesprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/rsesprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/rse-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/rse-back/';
		else if (type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/rse-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/rse/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
			room.update();
		});
	},
	'!gscsprite': true,
	gscspr: 'gscsprite',
        gscsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/gscsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/gsc-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/gsc-back/';
		else if (type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/gsc-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/gsc/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
			room.update();
		});
	},
	'!rbysprite': true,
	rbyspr: 'rbysprite',
        rbysprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/rbysprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/rby-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/rby-back/';
		else if (type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/rby-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/rby/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
			room.update();
		});
	},
	'!greensprite': true,
	greenspr: 'greensprite',
        greensprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/greensprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url = 'http://www.pokestadium.com/img/sprites/main-series/green/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
			room.update();
		});
	},
	'!rbsprite': true,
	rbspr: 'rbsprite',
        rbsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/rbsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'gray') url = 'http://www.pokestadium.com/img/sprites/main-series/red-blue/gray/';
		else url = 'http://www.pokestadium.com/img/sprites/main-series/red-blue/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
			room.update();
		});
	},
	'!crystalsprite': true,
	crystalspr: 'crystalsprite',
        crystalsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/crystalsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://www.pokestadium.com/img/sprites/main-series/crystal/animated/shiny/';
		else url = 'http://www.pokestadium.com/img/sprites/main-series/crystal/animated/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
			room.update();
		});
	},
	'!rflgsprite': true,
	rflgspr: 'rflgsprite',
        rflgsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/rsesprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://www.pokestadium.com/img/sprites/main-series/firered-leafgreen/shiny/';
		else if (type === 'back') url = 'http://www.pokestadium.com/img/sprites/main-series/firered-leafgreen/back/';
		else if (type === 'shinyback') url = 'http://www.pokestadium.com/img/sprites/main-series/firered-leafgreen/shiny/back/';
		else url = 'http://www.pokestadium.com/img/sprites/main-series/firered-leafgreen/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
			room.update();
		});
	},
	'!emeraldsprite': true,
	emeraldspr: 'emeraldsprite',
        emeraldsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/rsesprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://www.pokestadium.com/img/sprites/main-series/emerald/animated/shiny/';
		else if (type === 'shinyback') url = 'http://www.pokestadium.com/img/sprites/main-series/emerald/animated/shiny/back/';
		else url = 'http://www.pokestadium.com/img/sprites/main-series/emerald/animated/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
			room.update();
		});
	},
	'!afdsprite': true,
	afdspr: 'afdsprite',
        afdsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/afdsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/afd-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/afd-back/';
		else if (type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/afd-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/afd/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
			room.update();
		});
	},
	'!xysprite': true,
	xyspr: 'xysprite',
        xysprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/xysprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/xydex-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/xydex/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
			room.update();
		});
	},
	'!artsprite': true,
	artspr: 'artsprite',
        artsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/artsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url = 'http://www.pokestadium.com/img/sprites/official-art/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} /*else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}*/
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
			room.update();
		});
	},
	'!model': true,
    model: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/model [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://www.pokestadium.com/img/sprites/main-series/xy/shiny/';
		else if (type === 'back') url = 'http://www.pokestadium.com/img/sprites/main-series/xy/back/';
		else url = 'http://www.pokestadium.com/img/sprites/main-series/xy/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Dex.data.Pokedex[toId(sprite)]) {
			sprite = Dex.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Dex.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Dex.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Dex.data.Pokedex[toId(correction[i])]) continue;
						if (!Dex.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Dex.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} /*else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}*/
		}
		var self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
			room.update();
		});
	},
};
