/**
 * profile.js
 * Displays to users a profile of a given user.
 * For order's sake:
 * - vip, dev, customtitle, friendcode, and profile were placed in here.
 * Updated and restyled by Mystifi; main profile restyle goes out to panpawn/jd/other contributors.
 **/
'use strict';

let geoip = require('geoip-lite-country');

// fill in '' with the server IP
let serverIp = Config.serverIp;

function showTitle(userid) {
	userid = toId(userid);
	if (Db('titles').has(userid)) {
		return '<font color="' + Db('titles').get(userid)[1] +
			'">(<strong>' + Db('titles').get(userid)[0] + '</strong>)</font>';
	}
	return '';
}

function showBadges(user) {
	if (Db('userBadges').has(toId(user))) {
		let badges = Db('userBadges').get(toId(user));
		let css = 'border:none;background:none;padding:0;';
		if (typeof badges !== 'undefined' && badges !== null) {
			let output = '<td><div style="float: right; background: rgba(69, 76, 80, 0.4); text-align: center; border-radius: 12px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2) inset; margin: 0px 3px;">';
			output += ' <table style="' + css + '"> <tr>';
			for (let i = 0; i < badges.length; i++) {
				if (i !== 0 && i % 4 === 0) output += '</tr> <tr>';
				output += '<td><button style="' + css + '" name="send" value="/badges info, ' + badges[i] + '">' +
				'<img src="' + Db('badgeData').get(badges[i])[1] + '" height="16" width="16" alt="' + badges[i] + '" title="' + badges[i] + '" >' + '</button></td>';
			}
			output += '</tr> </table></div></td>';
			return output;
		}
	}
	return '';
}

exports.commands = {
	title: 'customtitle',
	customtitle: {
		set: 'give',
		give: function (target, room, user) {
			if (!this.can('ban')) return false;
			target = target.split(',');
			if (!target || target.length < 3) return this.parse('/help', true);
			let userid = toId(target[0]);
			let targetUser = Users.getExact(userid);
			let title = target[1].trim();
			if (Db('titles').has(userid) && Db('titlecolors').has(userid)) {
				return this.errorReply(userid + " already has a custom title.");
			}
			let color = target[2].trim();
			if (color.charAt(0) !== '#') return this.errorReply("The color needs to be a hex starting with '#'.");
			Db('titles').set(userid, [title, color]);
			if (Users.get(targetUser)) {
				Users(targetUser).popup(
					'|html|You have received a custom title from ' + BH.nameColor(user.name, true) + '.' +
					'<br />Title: ' + showTitle(toId(targetUser)) +
					'<br />Title Hex Color: ' + color
				);
			}
			this.privateModAction(user.name + " set a custom title to " + userid + "'s profile.");
			Monitor.log(user.name + " set a custom title to " + userid + "'s profile.");
			return this.sendReply("Title '" + title + "' and color '" + color + "' for " + userid + "'s custom title have been set.");
		},

		delete: 'remove',
		take: 'remove',
		remove: function (target, room, user) {
			if (!this.can('ban')) return false;
			if (!target) return this.parse('/help', true);
			let userid = toId(target);
			if (!Db('titles').has(userid) && !Db('titlecolors').has(userid)) {
				return this.errorReply(userid + " does not have a custom title set.");
			}
			Db('titlecolors').delete(userid);
			Db('titles').delete(userid);
			if (Users.get(userid)) {
				Users(userid).popup(
					'|html|' + BH.nameColor(user.name, true) + " has removed your custom title."
				);
			}
			this.privateModAction(user.name + " removed " + userid + "'s custom title.");
			Monitor.log(user.name + " removed " + userid + "'s custom title.");
			return this.sendReply(userid + "'s custom title and title color were removed from the server memory.");
		},

		'': 'help',
		help: function (target, room, user) {
			if (!user.autoconfirmed) return this.errorReply("You need to be autoconfirmed to use this command.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!this.runBroadcast()) return;
			return this.sendReplyBox(
				'<center><code>/customtitle</code> commands<br />' +
				'All commands are nestled under the namespace <code>customtitle</code>.</center>' +
				'<hr width="100%">' +
				'- <code>[set|give] [username], [title], [hex color]</code>: Sets a user\'s custom title. Requires: & ~' +
				'- <code>[take|remove|delete] [username]</code>: Removes a user\'s custom title and erases it from the server. Requires: & ~'
			);
		},
	},
	fc: 'friendcode',
	friendcode: {
		add: 'set',
		set: function (target, room, user) {
			if (room.battle) return this.errorReply("Please use this command outside of battle rooms.");
			if (!user.autoconfirmed) return this.errorReply("You must be autoconfirmed to use this command.");
			if (!target) return this.parse('/help', true);
			let fc = target;
			fc = fc.replace(/-/g, '');
			fc = fc.replace(/ /g, '');
			if (isNaN(fc)) {
				return this.errorReply("Your friend code needs to contain only numerical characters.");
			}
			if (fc.length < 12) return this.errorReply("Your friend code needs to be 12 digits long.");
			fc = fc.slice(0, 4) + '-' + fc.slice(4, 8) + '-' + fc.slice(8, 12);
			Db('friendcode').set(toId(user), fc);
			return this.sendReply("Your friend code: " + fc + " has been saved to the server.");
		},

		remove: 'delete',
		delete: function (target, room, user) {
			if (room.battle) return this.errorReply("Please use this command outside of battle rooms.");
			if (!user.autoconfirmed) return this.errorReply("You must be autoconfirmed to use this command.");
			if (!target) {
				if (!Db('friendcode').has(toId(user))) return this.errorReply("Your friend code isn't set.");
				Db('friendcode').delete(toId(user));
				return this.sendReply("Your friend code has been deleted from the server.");
			} else {
				if (!this.can('lock')) return false;
				let userid = toId(target);
				if (!Db('friendcode').has(userid)) return this.errorReply(userid + " hasn't set a friend code.");
				Db('friendcode').delete(userid);
				return this.sendReply(userid + "'s friend code has been deleted from the server.");
			}
		},

		'': 'help',
		help: function (target, room, user) {
			if (room.battle) return this.errorReply("Please use this command outside of battle rooms.");
			if (!user.autoconfirmed) return this.errorReply("You must be autoconfirmed to use this command.");
			return this.sendReplyBox(
				'<center><code>/friendcode</code> commands<br />' +
				'All commands are nestled under the namespace <code>friendcode</code>.</center>' +
				'<hr width="100%">' +
				'<code>[add|set] [code]</code>: Sets your friend code. Must be in the format 111111111111, 1111 1111 1111, or 1111-1111-1111.' +
				'<br />' +
				'<code>[remove|delete]</code>: Removes your friend code. Global staff can include <code>[username]</code> to delete a user\'s friend code.' +
				'<br />' +
				'<code>help</code>: Displays this help command.'
			);
		},
	},

	favoritetype: 'type',
	type: {
		add: "set",
		set: function (target, room, user) {
			if (!target) return this.parse("/help type");
			let type = Dex.getType(target);
			if (!type.exists) return this.errorReply('Not a type. Check your spelling?');
			Db("type").set(user.userid, toId(type));
			return this.sendReply("You have successfully set your Favorite Type onto your profile.");
		},

		del: "delete",
		remove: "delete",
		delete: function (target, room, user) {
			if (!Db('type').has(user.userid)) return this.errorReply("Your Favorite Type hasn't been set.");
			Db('type').delete(user.userid);
			return this.sendReply("Your Favorite Type has been deleted from your profile.");
		},

		"": "help",
		help: function (target, room, user) {
			this.parse('/help type');
		},
	},
	typehelp: [
		"/type set [type] - Sets your Favorite Type.",
		"/type delete - Removes your Favorite Type.",
	],

	home: 'hometown',
	hometown: {
		add: "set",
		set: function (target, room, user) {
			let type = target.toLowerCase();
			if (!type) return this.parse("/help hometown");
			if (!['accumulatown', 'ambrettetown', 'anistarcity', 'anvilletown', 'aquacordetown', 'aspertiacity', 'azaleatown', 'blackcity', 'blackthorncity', 'camphriertown', 'canalave city', 'castelia city', 'celadon city', 'celestic town', 'cerulean city', 'cherrygrove city', 'cianwood city', 'cinnabar island', 'coumarine city', 'couriway town', 'cyllage city', 'dendemille town', 'dewford town', 'driftveil city', 'ecruteak city', 'eterna city', 'ever grande city', 'fallarbor town', 'fight area', 'five island', 'floaroma town', 'floccesy town', 'fortree city', 'four island', 'frontier access', 'fuchsia city', 'geosenge town', 'goldenrod city', 'hau\'oli city', 'heahea city', 'hearthome city', 'humilau city', 'icirrus city', 'iki town', 'jubilife city', 'kiloude city', 'konikoni city', 'lacunosa town', 'lavaridge town', 'lavender town', 'laverre city', 'lentimas town', 'littleroot town', 'lilycove city', 'lumiose city', 'mahogany town', 'malie city', 'mauville city', 'mistralton city', 'mossdeep city', 'nacrene city', 'new bark town', 'nimbasa city', 'nuvema town', 'oldale town', 'olivine city', 'one island', 'opelucid city', 'oreburgh city', 'pacifidlog town', 'pallet town', 'paniola town', 'pastoria city', 'petalburg city', 'pewter city', 'po town', 'resort area', 'rustboro city', 'safari zone gate', 'saffron city', 'sandgem town', 'santalune city', 'seafolk village', 'seven island', 'shalour city', 'six island', 'slateport city', 'snowbelle city', 'snowpoint city', 'solaceon town', 'sootopolis city', 'striaton city', 'sunyshore city', 'survival area', 'tapu village', 'three island', 'twinleaf town', 'two island', 'undella town', 'vaniville town', 'veilstone city', 'verdanturf town', 'vermilion city', 'violet city', 'virbank city', 'viridian city', 'white forest', 'agate village', 'gateon port', 'phenac city', 'pyrite town', 'the under', 'white city'].includes(type)) return this.sendReply('Valid hometowns are:Anistar City.');
			Db('hometown').set(user.userid, type);
			return this.sendReply("You have successfully set your Hometown onto your profile.");
		},

		del: "delete",
		remove: "delete",
		delete: function (target, room, user) {
			if (!Db('hometown').has(user.userid)) return this.errorReply("Your Hometown hasn't been set.");
			Db('hometown').delete(user.userid);
			return this.sendReply("Your Favorite Hometown has been deleted from your profile.");
		},

		"": "help",
		help: function (target, room, user) {
			this.parse('/help hometown');
		},
	},
	hometownhelp: [
		"/hometown set [town] - Sets your Hometown.",
		"/hometown delete - Removes your Hometown.",
	],

	pteam: 'profileteam',
	profileteam: {
		add: 'set',
		set: function (target, room, user) {
			if (!Db('hasteam').has(user.userid)) return this.errorReply('You don\'t have access to edit your team.');
			if (!target) return this.parse('/profileteam help');
			let parts = target.split(',');
			let mon = parts[1].trim();
			let slot = parts[0];
			if (!parts[1]) return this.parse('/profileteam help');
			let acceptable = ['one', 'two', 'three', 'four', 'five', 'six'];
			if (!acceptable.includes(slot)) return this.parse('/profileteam help');
			if (slot === 'one' || slot === 'two' || slot === 'three' || slot === 'four' || slot === 'five' || slot === 'six') {
				Db('teams').set([user.userid, slot], mon);
				this.sendReply('You have added this pokemon to your team.');
			}
		},

		give: function (target, room, user) {
			if (!this.can('ban')) return false;
			if (!target) return this.parse('/profileteam help');
			if (!Db('hasteam').has(user)) return this.errorReply('This user already has the ability to set their team.');
			let targetId = toId(target);
			Db('hasteam').set(targetId, 1);
			this.sendReply(target + ' has been given the ability to set their team.');
			Users(target).popup('You have been given the ability to set your profile team.');
		},

		take: function (target, room, user) {
			if (!this.can('ban')) return false;
			if (!target) return this.parse('/profileteam help');
			if (!Db('hasteam').has(user)) return this.errorReply('This user does not have the ability to set their team.');
			Db('hasteam').delete(user);
			return this.sendReply('This user has had their ability to change their team away.');
		},

		'': 'help',
		help: function (target, room, user) {
			if (!this.runBroadcast()) return;
			this.sendReplyBox(
				'<center><strong>Profile Team Commands</strong><br />' +
				'All commands are nestled under namespace <code>pteam</code></center><br />' +
				'<hr width="100%">' +
				'<code>add (slot), (dex number)</code>: The dex number must be the actual dex number of the pokemon you want.<br />' +
				'Slot - we mean what slot you want the pokemon to be. valid entries for this are: one, two, three, four, five, six.<br />' +
				'Chosing the right slot is crucial because if you chose a slot that already has a pokemon, it will overwrite that data and replace it. This can be used to replace / reorder what pokemon go where.<br />' +
				'If the Pokemon is in the first 99 Pokemon, do 0(number), and for Megas do (dex number)-m, -mx for mega , -my for mega Y.<br>' +
				'If the Pokemon is an alolan form use (dex number)-a. Also for therian use (dex number)-s.<br>' +
				'For example: Mega Venusaur would be 003-m<br />' +
				'<code>give</code>: Global staff can give user\'s ability to set their own team.<br />' +
				'<code>take</code>: Global staff can take user\'s ability to set their own team.<br />' +
				'<code>help</code>: Displays this command.'
			);
		},
	},

	bg: 'background',
	background: {
		set: 'setbg',
		setbackground: 'setbg',
		setbg: function (target, room, user) {
			if (!this.can('broadcast')) return false;
			let parts = target.split(',');
			if (!parts[1]) return this.parse('/backgroundhelp');
			let targ = parts[0].toLowerCase().trim();
			let link = parts[1].trim();
			Db('backgrounds').set(targ, link);
			this.sendReply('This user\'s background has been set to : ');
			this.parse('/profile ' + targ);
		},

		removebg: 'deletebg',
		remove: 'deletebg',
		deletebackground: 'deletebg',
		takebg: 'deletebg',
		take: 'deletebg',
		delete: 'deletebg',
		deletebg: function (target, room, user) {
			if (!this.can('broadcast')) return false;
			let targ = target.toLowerCase();
			if (!target) return this.parse('/backgroundhelp');
			if (!Db('backgrounds').has(targ)) return this.errorReply('This user does not have a custom background.');
			Db('backgrounds').delete(targ);
			return this.sendReply('This user\'s background has been deleted.');
		},

		'': 'help',
		help: function (target, room, user) {
			this.parse("/backgroundhelp");
		},
	},
	backgroundhelp: [
		"/bg set [user], [link] - Sets the user's profile background.",
		"/bg delete [user] - Removes the user's profile background.",
	],

	pokemon: {
		add: "set",
		set: function (target, room, user) {
			if (!target) return this.parse("/pokemonhelp");
			let pkmn = Dex.getTemplate(target);
			if (!pkmn.exists) return this.errorReply('Not a Pokemon. Check your spelling?');
			Db('pokemon').set(user.userid, pkmn.species);
			return this.sendReply("You have successfully set your Pokemon onto your profile.");
		},

		del: "delete",
		remove: "delete",
		delete: function (target, room, user) {
			if (!Db('pokemon').has(user.userid)) return this.errorReply("Your favorite Pokemon hasn't been set.");
			Db('pokemon').delete(user.userid);
			return this.sendReply("Your favorite Pokemon has been deleted from your profile.");
		},

		"": "help",
		help: function (target, room, user) {
			this.parse('/pokemonhelp');
		},
	},
	pokemonhelp: [
		"/pokemon set [Pokemon] - Sets your Favorite Pokemon.",
		"/pokemon delete - Removes your Favorite Pokemon.",
	],

	natures: "nature",
	nature: {
		add: "set",
		set: function (target, room, user) {
			if (!target) this.parse("/naturehelp");
			let nature = Dex.getNature(target);
			if (!nature.exists) return this.errorReply("This is not a nature. Check your spelling?");
			Db('nature').set(user.userid, nature.name);
			return this.sendReply("You have successfully set your nature onto your profile.");
		},

		del: "delete",
		take: "delete",
		remove: "delete",
		delete: function (target, room, user) {
			if (!Db('nature').has(user.userid)) return this.errorReply("Your nature has not been set.");
			Db('nature').delete(user.userid);
			return this.sendReply("Your nature has been deleted from your profile.");
		},

		"": "help",
		help: function (target, room, user) {
			this.parse("/naturehelp");
		},
	},
	naturehelp: [
		"/nature set [nature] - Sets your Profile Nature.",
		"/nature delete - Removes your Profile Nature.",
	],

	'!profile': true,
	profile: function (target, room, user) {
		target = toId(target);
		if (!target) target = user.name;
		if (target.length > 18) return this.errorReply("Usernames cannot exceed 18 characters.");
		if (!this.runBroadcast()) return;
		let self = this;
		let targetUser = Users.get(target);
		let username = (targetUser ? targetUser.name : target);
		let userid = (targetUser ? targetUser.userid : toId(target));
		let avatar = (targetUser ? (isNaN(targetUser.avatar) ? "http://" + serverIp + ":" + Config.port + "/avatars/" + targetUser.avatar : "http://play.pokemonshowdown.com/sprites/trainers/" + targetUser.avatar + ".png") : (Config.customavatars[userid] ? "http://" + serverIp + ":" + Config.port + "/avatars/" + Config.customavatars[userid] : "http://play.pokemonshowdown.com/sprites/trainers/1.png"));
		if (targetUser && targetUser.avatar[0] === '#') avatar = 'http://play.pokemonshowdown.com/sprites/trainers/' + targetUser.avatar.substr(1) + '.png';
		if (userid) {
			showProfile();
		}

		function getFlag(userid) {
			let ip = (Users(userid) ? geoip.lookup(Users(userid).latestIp) : false);
			if (!ip || ip === null) return '';
			return '<img src="http://flags.fmcdn.net/data/flags/normal/' + ip.country.toLowerCase() + '.png" alt="' + ip.country + '" title="' + ip.country + '" width="20" height="10">';
		}

		function showTeam(user) {
			let teamcss = 'float:center;border:none;background:none;';

			let noSprite = '<img src=http://play.pokemonshowdown.com/sprites/bwicons/0.png>';
			let one = Db('teams').get([user, 'one']);
			let two = Db('teams').get([user, 'two']);
			let three = Db('teams').get([user, 'three']);
			let four = Db('teams').get([user, 'four']);
			let five = Db('teams').get([user, 'five']);
			let six = Db('teams').get([user, 'six']);
			if (!Db('teams').has(user)) return '<div style="' + teamcss + '" >' + noSprite + noSprite + noSprite + noSprite + noSprite + noSprite + '</div>';

			function iconize(link) {
				return '<button id="kek" style="background:transparent;border:none;"><img src="https://serebii.net/pokedex-sm/icon/' + link + '.png"></button>';
			}

			let teamDisplay = '<center><div style="' + teamcss + '">';
			if (Db('teams').has([user, 'one'])) {
				teamDisplay += iconize(one);
			} else {
				teamDisplay += noSprite;
			}
			if (Db('teams').has([user, 'two'])) {
				teamDisplay += iconize(two);
			} else {
				teamDisplay += noSprite;
			}
			if (Db('teams').has([user, 'three'])) {
				teamDisplay += iconize(three);
			} else {
				teamDisplay += noSprite;
			}
			if (Db('teams').has([user, 'four'])) {
				teamDisplay += iconize(four);
			} else {
				teamDisplay += noSprite;
			}
			if (Db('teams').has([user, 'five'])) {
				teamDisplay += iconize(five);
			} else {
				teamDisplay += noSprite;
			}
			if (Db('teams').has([user, 'six'])) {
				teamDisplay += iconize(six);
			} else {
				teamDisplay += noSprite;
			}

			teamDisplay += '</div></center>';
			return teamDisplay;
		}

		function background(buddy) {
			let bg = Db('backgrounds').get(buddy);
			if (!Db('backgrounds').has(buddy)) return '<div>';
			return '<div style="background:url(' + bg + '); background-size: 100% 100%">';
		}

		function showProfile() {
			Economy.readMoney(toId(username), money => {
				let profile = '';
				profile += background(toId(username)) + showBadges(toId(username));
				profile += '<img src="' + avatar + '" height="80" width="80" align="left">';
				profile += '&nbsp;<font color="#24678d"><strong>Name:</strong></font> ' + BH.nameColor(username, true) + '&nbsp;' + getFlag(toId(username)) + ' ' + showTitle(username) + '<br />';
				if (Db('hometown').has(toId(username))) {
					profile += '&nbsp;<font color="#24678d"><strong>Hometown:</strong></font> ' + Db('hometown').get(toId(username)) + '<br />';
				}
				if (Db('pokemon').has(toId(username))) {
					profile += '&nbsp;<font color="#24678d"><strong>Favorite Pokemon:</strong></font> ' + Db('pokemon').get(toId(username)) + '<br />';
				}
				if (Db('type').has(toId(username))) {
					profile += '&nbsp;<font color="#24678d"><strong>Favorite Type:</strong></font> <img src="https://www.serebii.net/pokedex-bw/type/' + Db('type').get(toId(username)) + '.gif"><br />';
				}
				if (Db('nature').has(toId(username))) {
					profile += '&nbsp;<font color="#24678d"><strong>Nature:</strong></font> ' + Db('nature').get(toId(username)) + '<br />';
				}
				if (Db('friendcode').has(toId(username))) {
					profile += '&nbsp;<font color="#24678d"><strong>Friend Code:</strong></font> ' + Db('friendcode').get(toId(username)) + '<br />';
				}
				profile += '&nbsp;' + showTeam(toId(username)) + '<br />';
				profile += '&nbsp;</div>';
				profile += '<br clear="all">';
				self.sendReplyBox(profile);
			});
		}
	},

	profilehelp: [
		"/profile [user] - Shows a user's profile. Defaults to yourself.",
		"/pteam give [user] - Gives a user access to edit their profile team. Requires + or higher.",
		"/pteam add [slot], [dex # of the Pokemon] - Adds a Pokemon onto your profile team. Requires profile edit access.",
		"/pteam take [user] - Revokes a user's access to edit their profile team. Requires + or higher.",
		"/type set [type] - Set your favorite type.",
		"/type delete - Delete your favorite type.",
		"/nature set [nature] - Set your nature.",
		"/nature delete - Delete your nature.",
		"/bg set [user], [link] - Sets the user's profile background. Requires + or higher.",
		"/bg delete [user] - Removes the user's profile background. Requires + or higher.",
		"/fc set [friend code] - Sets your Friend Code.",
		"/fc delete [friend code] - Removes your Friend Code.",
	],
};
