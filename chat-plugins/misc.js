/**
Bunnyhole Miscellaneous Plugins
 **/
BH.nameColor = function (name, bold) {
        return (bold ? "<b>" : "") + "<font color=" + BH.Color(name) + ">" + (Users(name) && Users(name).connected && Users.getExact(name) ? Chat.escapeHTML(Users.getExact(name).name) : Chat.escapeHTML(name)) + "</font>" + (bold ? "</b>" : "");
};
const path = require('path');
const fs = require('fs');
const moment = require('moment');

BH.tells = {};
try {
	BH.tells = JSON.parse(fs.readFileSync('config/tells.json', 'utf8'));
} catch (e) {}

const MAX_TELLS = 4;
const MAX_TELL_LENGTH = 500;
function isHoster(user) {
	if (!user) return;
	if (typeof user === 'Object') user = user.userid;
	let hoster = Db('hoster').get(toId(user));
	if (hoster === 1) return true;
	return false;
}
BH.getTells = function(target, room, user, connection) {
		target = Users.get(target);
		let tell = BH.tells[target.userid];
		if (!tell) return;
		for (let i in tell) {
			tell[i].forEach(msg => target.send('|pm| Unread Messages|' + target.getIdentity() + '|/raw ' + msg));
		}
		delete BH.tells[target.userid];
		fs.writeFileSync('config/tells.json', JSON.stringify(BH.tells));
	};
const messages = [
    "has used explosion!",
    "was swallowed up by the earth!",
    "was abducted by aliens.",
    "has left the building.",
    "got lost in the woods!",
    "went to praise a Magikarp",
    "was killed by a Magikarp",
    "magically disappeared",
    "was put to sleep by a jigglypuff",
    "entered zen mode",
    "kicked his modem in error",
];
 exports.commands = {
	hoster: {
        	add: function (target, room, user, userid) {
			if (!this.userid == 'darknightz' || 'fairyserena') return this.errorReply('This command can only be used by DarkNightz or Fairy Serena');
			let hoster = toId(target);
			if (!hoster) return this.parse('/hoster');
			if (isHoster(hoster)) return this.errorReply(hoster + ' is already a vip.');
			Db('hoster').set(hoster, 1);
			this.sendReply(hoster + ' has been granted with vip status.');
		},
	       	remove: function (target, room, user) {
			let userid = user.userid;    	
			if (!isHoster(userid)) return false;
			let hoster = toId(target);
			if (!hoster) return this.parse('/hoster');
			if (!isHoster(hoster)) return this.errorReply(hoster + ' is not a vip.');
			Db('hoster').delete(hoster);
			this.sendReply(hoster + '\'s vip status has been taken.');
		},
			list: function (target, room, user) {
			let userid = user.userid;    	
			if (!isHoster(userid)) return false;
			if (!Object.keys(Db('hoster').object()).length) return this.errorReply('There seems to be no user with vip status.');
			user.popup('|html|<center><b><u>Super Administrators.</u></b></center>' + '<br /><br />' + Object.keys(Db('hoster').object()).join('</strong><br />'));
		},
		    '': function(target,room,user) {
		  	if (!this.can('hotpatch')) return false;
		  	this.sendReplyBox('<strong>Hoster Commands:</strong><br>' +
		  	'<li><em>&mdash; add</em> - Adds a user to the list of server hosters.</li>' +
		  	'<li><em>&mdash; remove</em> - Removes a user from the list of hosters.</li>' +
		  	'<li><em>&mdash; list</em> - Shows the list of server hosters.</li>'
		  	);
		    },
	},
	
  	d: 'poof',
	cpoof: 'poof',
	poof: function (target, room, user) {
		if (Config.poofOff) return this.sendReply("Poof is currently disabled.");
		if (target && !this.can('broadcast')) return false;
		if (room.id !== 'lobby') return false;
		let message = target || messages[Math.floor(Math.random() * messages.length)];
		if (message.indexOf('{{user}}') < 0) {
			message = '{{user}} ' + message;
		}
		message = message.replace(/{{user}}/g, user.name);
		if (!this.canTalk(message)) return false;

		let colour = '#' + [1, 1, 1].map(function () {
			let part = Math.floor(Math.random() * 0xaa);
			return (part < 0x10 ? '0' : '') + part.toString(16);
		}).join('');

		room.addRaw('<center><strong><font color="' + colour + '">~~ ' + Chat.escapeHTML(message) + ' ~~</font></strong></center>');
		user.disconnectAll();
	},

	poofoff: 'nopoof',
	nopoof: function () {
		if (!this.can('poofoff')) return false;
		Config.poofOff = true;
		return this.sendReply("Poof is now disabled.");
	},

	poofon: function () {
		if (!this.can('poofoff')) return false;
		Config.poofOff = false;
		return this.sendReply("Poof is now enabled.");
	},
	 
	credit: 'credits',
	credits: function (target, room, user) {
		let popup = "|html|" + "<font size=5><u><b>Bunnyhole Server Credits</b></u></font><br />" +
			"<br />" +
			"<u><b>Server Maintainers:</u></b><br />" +
			"- " + BH.nameColor('Fairy Serena', true) + " (Owner, Sysop)<br />" +
			"- " + BH.nameColor('DarkNightz', true) + " (Development, Sysop)<br />" +
			"<br />" +
			"<u><b>Special Thanks:</b></u><br />" +
			"- Our Staff Members<br />" +
			"- Our Regular Users<br />";
		user.popup(popup);
	},
	 
	'!tell': true,
	 tell: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help tell');
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (Users.ShadowBan.checkBanned(user)) return;
		target = this.splitTarget(target);
		if (this.targetUsername === 'unreadmessages') return this.errorReply("This is the server offline chat system.");
		let targetUser = this.targetUsername;
		let id = toId(targetUser);
		if (id === user.userid || (Users(id) && Users(id).userid === user.userid)) return this.sendReply('You can\'t send a message to yourself!');
		if (Users(id) && Users(id).connected) return this.sendReply('User ' + Users(id).name + ' is currently online. PM them instead.');
		if (!id || !target) return this.parse('/help tell');
		if (target.length > MAX_TELL_LENGTH) return this.errorReply("You may not send a tell longer than " + MAX_TELL_LENGTH + " characters.");

		if (BH.tells[id]) {
			if (!user.can('hotpatch')) {
				let names = Object.keys(user.prevNames).concat(user.userid);
				for (let i in names) {
					let name = names[i];
					if (BH.tells[id][name] && BH.tells[id][name].length >= MAX_TELLS) return this.sendReply('You may only leave ' + MAX_TELLS + ' messages for a user at a time. Please wait until ' + targetUser + ' comes online and views them before sending more.');
				}
			}
		} else {
			BH.tells[id] = {};
		}

		let tell = BH.tells[id][user.userid];
		let userSymbol = (Users.usergroups[user.userid] ? Users.usergroups[user.userid].substr(0, 1) : "");
		let msg = '<small>[' + moment().format("HH:mm:ss") + ']</small> ' + userSymbol + '<strong class="username"><span style = "color:' + BH.Color(user.userid) + '">' + user.name + ':</span></strong> ' + Chat.escapeHTML(target);
		if (tell) {
			BH.tells[id][user.userid].push(msg);
		} else {
			BH.tells[id][user.userid] = [msg];
		}

		fs.writeFileSync('config/tells.json', JSON.stringify(BH.tells));
				if (this.message.startsWith(`/tell`)) {
		user.send('|pm| ' + this.targetUsername + '|' + this.user.getIdentity() + '|/raw ' + '<small>[' + moment().format("HH:mm:ss") + ']</small>' + userSymbol + '<strong class="username"><span style = "color:' + BH.Color(user.userid) + '">' + user.name + ':</span></strong> ' + Chat.escapeHTML(target));
		
			return;
		}
	},
	tellhelp: ['/tell [user], [message] - Leaves a message for an offline user for them to see when they log on next.'],
	
	'!authlist': true,
staff: 'authlist',
	stafflist: 'authlist',
	auth: 'authlist',
	authlist: function(target, room, user, connection) {
		let ignoreUsers = ['deltaskiez'];
		fs.readFile('config/usergroups.csv', 'utf8', function(err, data) {
			let staff = {
				"admins": [],
				"leaders": [],
				"bots": [],
				"mods": [],
				"drivers": [],
				"voices": [],
			};
			let row = ('' + data).split('\n');
			for (let i = row.length; i > -1; i--) {
				if (!row[i]) continue;
				let rank = row[i].split(',')[1].replace("\r", '');
				let person = row[i].split(',')[0];
				function formatName (name) {
					if (Users.getExact(name) && Users(name).connected) {
						return '<i><b><font style="color:' + BH.Color(Users.getExact(name).name) + '">' + (Users.getExact(name).name) + '</font><b></i>';
					} else {
						return '<font style="color:' + BH.Color(name) + '">' + (name) + '</font>';
					}
				}
				let personId = toId(person);
				switch (rank) {
					case '~':
						if (~ignoreUsers.indexOf(personId)) break;
						staff['admins'].push(formatName(person));
						break;
					case '&':
						if (~ignoreUsers.indexOf(personId)) break;
						staff['leaders'].push(formatName(person));
						break;	
					case '*':
						if (~ignoreUsers.indexOf(personId)) break;
						staff['bots'].push(formatName(person));
						break;
					case '@':
						if (~ignoreUsers.indexOf(personId)) break;
						staff['mods'].push(formatName(person));
						break;
					case '%':
						if (~ignoreUsers.indexOf(personId)) break;
						staff['drivers'].push(formatName(person));
						break;
					case '+':
						if (~ignoreUsers.indexOf(personId)) break;
						staff['voices'].push(formatName(person));
						break;
					default:
						continue;
				}
			}
			connection.popup('|html|' +
				'<h3>Bunnyhole Server Authorities</h3>' +
				'<b><u>~Administrators' +  ' (' + staff['admins'].length + ')</u></b>:<br />' + staff['admins'].join(', ') +
				'<br /><b><u>&Leaders' +  ' (' + staff['leaders'].length + ')</u></b>:<br />' + staff['leaders'].join(', ') +
				'<br /><b><u>*Bots (' + staff['bots'].length + ')</u></b>:<br />' + staff['bots'].join(', ') +
				'<br /><b><u>@Moderators (' + staff['mods'].length + ')</u></b>:<br />' + staff['mods'].join(', ') +
				'<br /><b><u>%Drivers (' + staff['drivers'].length + ')</u></b>:<br />' + staff['drivers'].join(', ') +
				'<br /><b><u>+Voices (' + staff['voices'].length + ')</u></b>:<br />' + staff['voices'].join(', ') +
				'<br /><br />(<b>Bold</b> / <i>italic</i> = currently online)'
			);
		});
	},

	rf: 'roomfounder',
	roomfounder: function (target, room, user) {
		if (!room.chatRoomData) return this.sendReply("/roomfounder - This room isn't designed for per-room moderation to be added.");
		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");
		if (!this.can('declare')) return false;
		if (room.isPersonal) return this.sendReply("You can't do this in personal rooms.");
		if (!room.auth) room.auth = room.chatRoomData.auth = {};
		if (!room.leagueauth) room.leagueauth = room.chatRoomData.leagueauth = {};
		let name = targetUser.name;
		room.auth[targetUser.userid] = '#';
		room.founder = targetUser.userid;
		this.addModCommand(name + ' was appointed to Room Founder by ' + user.name + '.');
		room.onUpdateIdentity(targetUser);
		room.chatRoomData.founder = room.founder;
		Rooms.global.writeChatRoomData();
	},

	roomdefounder: 'deroomfounder',
	deroomfounder: function (target, room, user) {
		if (!room.auth) return this.sendReply("/roomdefounder - This room isn't designed for per-room moderation");
		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let name = this.targetUsername;
		let userid = toId(name);
		if (room.isPersonal) return this.sendReply("You can't do this in personal rooms.");
		if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");
		if (room.auth[userid] !== '#') return this.sendReply("User '" + name + "' is not a room founder.");
		if (!this.can('declare')) return false;
		delete room.auth[userid];
		delete room.founder;
		this.sendReply(name + ' was demoted from Room Founder by ' + user.name + '.');
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) Rooms.global.writeChatRoomData();
	},

	 rl: 'roomleader',
	roomleader: function (target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomleader - This room isn't designed for per-room moderation to be added");
		}
		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");

		if (!room.founder) return this.sendReply('The room needs a room founder before it can have a room leader.');
		if (room.founder !== user.userid && !this.can('makeroom')) return this.sendReply('/roomleader - Access denied.');

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		let name = targetUser.name;

		room.auth[targetUser.userid] = '&';
		this.addModCommand("" + name + " was appointed Room Leader by " + user.name + ".");
		room.onUpdateIdentity(targetUser);
		Rooms.global.writeChatRoomData();
	},

	roomdeleader: 'deroomleader',
	deroomleader: function (target, room, user) {
		if (!room.auth) {
			return this.sendReply("/deroomleader - This room isn't designed for per-room moderation");
		}
		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let name = this.targetUsername;
		let userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");

		if (room.auth[userid] !== '&') return this.sendReply("User '" + name + "' is not a room leader.");
		if (!room.founder || user.userid !== room.founder && !this.can('makeroom', null, room)) return false;

		delete room.auth[userid];
		this.sendReply("(" + name + " is no longer Room Leader.)");
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	'!errorlog': true,
	errorlog: function (target, room, user, connection) {
		if (!this.can('hotpatch')) return;
		target = toId(target);
		let numLines = 1000;
		let matching = true;
		if (target.match(/\d/g) && !isNaN(target)) {
			numLines = Number(target);
			matching = false;
		}
		let topMsg = "Displaying the last " + numLines + " lines of transactions:\n";
		let file = path.join('logs/errors.txt');
		fs.exists(file, function (exists) {
			if (!exists) return connection.popup("There are no errors.");
			fs.readFile(file, 'utf8', function (err, data) {
				data = data.split('\n');
				if (target && matching) {
					data = data.filter(function (line) {
						return line.toLowerCase().indexOf(target.toLowerCase()) >= 0;
					});
				}
				connection.popup('|wide|' + topMsg + data.slice(-(numLines + 1)).join('\n'));
			});
		});
	},
	image: 'showimage',
	showimage: function (target, room, user) {
		if (!target) return this.errorReply('Use: /image link, size');
		if (!this.can('mute', room)) return false;

		let targets = target.split(',');
		if (targets.length !== 2) {
			room.add('|raw|<center><img src="' + Chat.escapeHTML(targets[0]) + '" alt="" width="50%"/><br /><small><em>(Image shown by: <b><font color="' + BH.Color(user.name) + '">' + user.name +  '</font></em></b>)</small>');
		} else {
			room.add('|raw|<center><img src="' + Chat.escapeHTML(targets[0]) + '" alt="" width="' + toId(targets[1]) + '%"/><br /><small><em>(Image shown by: <b><font color="' + BH.Color(user.name) + '">' + user.name +  '</font></em></b>)</small>');
		}
	},
	
		cssedit: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {return this.sendReply("/cssedit - Access denied.");}
		let fsscript = require('fs');
		if (!target) {
			if (!fsscript.existsSync('config/custom.css')) return this.sendReply("custom.css does not exist.");
			return this.sendReply("|raw|<div class=\"infobox\"><div class=\"infobox-limited\">" + fsscript.readFileSync('config/custom.css').toString() + "</div></div>");
		}
		fsscript.writeFileSync('config/custom.css', target.toString());
		this.sendReply("custom.css successfully edited.");
	},
	
	destroymodlog: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {return this.sendReply("/destroymodlog - Access denied.");}
		let logPath = 'logs/modlog/';
		if (Chat.modlog && Chat.modlog[room.id]) {
			Chat.modlog[room.id].close();
			delete Chat.modlog[room.id];
		}
		try {
			fs.unlinkSync(logPath + "modlog_" + room.id + ".txt");
			this.addModCommand(user.name + " has destroyed the modlog for this room." + (target ? ('(' + target + ')') : ''));
		} catch (e) {
			this.sendReply("The modlog for this room cannot be destroyed.");
		}
	},

	disableintroscroll: function (target, room, user) {
		if (!this.can('roomowner')) return false;
		if (!target) return this.errorReply("No Room Specified");
		target = toId(target);
		if (!Rooms(target)) return this.errorReply(`${target} is not a room`);
		if (Db('disabledScrolls').has(target)) return this.errorReply(`${Rooms(target).title} has roomintro scroll disabled.`);
		Db('disabledScrolls').set(target, true);
		Monitor.adminlog(user.name + ` has disabled the roomintro scroll bar for ${Rooms(target).title}.`);
	},

	disableintroscrollhelp: ["/disableintroscroll [room] - Disables scroll bar preset in the room's roomintro."],
	enableintroscroll: function (target, room, user) {
		if (!this.can('roomowner')) return false;
		if (!target) return this.errorReply("No Room Specified");
		target = toId(target);
		if (!Rooms(target)) return this.errorReply(`${target} is not a room`);
		if (!Db('disabledScrolls').has(target)) return this.errorReply(`${Rooms(target).title} has roomintro scroll enabled.`);
		Db('disabledScrolls').delete(target);
		Monitor.adminlog(user.name + ` has enabled the roomintro scroll bar for ${Rooms(target).title}.`);
	},
	enableintroscrollhelp: ["/enableintroscroll [room] - Enables scroll bar preset in the room's roomintro."],

	rk: 'kick',
	roomkick: 'kick',
	kick: function (target, room, user) {
		if (!target) return;
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		if (!room.users[targetUser.userid]) {
			return this.sendReply("User " + this.targetUsername + " is not in the room " + room.id + ".");
		}
		if (!this.can('kick', targetUser, room)) return false;
		let msg = "kicked from room " + room.id + " by " + user.name + (target ? " (" + target + ")" : "") + ".";
		this.addModCommand("" + targetUser.name + " was " + msg);
		targetUser.popup("You have been " + msg);
		targetUser.leaveRoom(room);
	},

	bonus: 'dailybonus',
	checkbonus: 'dailybonus',
	dailybonus: function (target, room, user) {
		let obj = Db('DailyBonus').get(user.latestIp, [1, Date.now()]);
		let nextBonus = Date.now() - obj[1];
		if ((86400000 - nextBonus) <= 0) return BH.giveDailyReward(user);
		return this.sendReply('Your next bonus is ' + obj[0] + ' ' + (obj[0] === 1 ? moneyName : moneyPlural) + ' in ' + Chat.toDurationString(Math.abs(86400000 - nextBonus)));
	},
	roomlist: function (target, room, user) {
		let header = ['<b><font color="#1aff1a" size="2">Total users connected: ' + Rooms.global.userCount + '</font></b><br />'],
			official = ['<b><font color="#ff9900" size="2"><u>Official Rooms:</u></font></b><br />'],
			nonOfficial = ['<hr><b><u><font color="#005ce6" size="2">Public Rooms:</font></u></b><br />'],
			privateRoom = ['<hr><b><u><font color="#ff0066" size="2">Private Rooms:</font></u></b><br />'],
			groupChats = ['<hr><b><u><font color="#00b386" size="2">Group Chats:</font></u></b><br />'],
			battleRooms = ['<hr><b><u><font color="#cc0000" size="2">Battle Rooms:</font></u></b><br />'];

		let rooms = [];

		Rooms.rooms.forEach(curRoom => {
			if (curRoom.id !== 'global') rooms.push(curRoom.id);
		});

		rooms.sort();

		for (let u in rooms) {
			let curRoom = Rooms(rooms[u]);
			if (curRoom.type === 'battle') {
				battleRooms.push('<a href="/' + curRoom.id + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
			}
			if (curRoom.type === 'chat') {
				if (curRoom.isPersonal) {
					groupChats.push('<a href="/' + curRoom.id + '" class="ilink">' + curRoom.id + '</a> (' + curRoom.userCount + ')');
					continue;
				}
				if (curRoom.isOfficial) {
					official.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
					continue;
				}
				if (curRoom.isPrivate) {
					privateRoom.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
					continue;
				}
			}
			if (curRoom.type !== 'battle') nonOfficial.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + curRoom.title + '</a> (' + curRoom.userCount + ')');
		}

		if (!user.can('roomowner')) return this.sendReplyBox(header + official.join(' ') + nonOfficial.join(' '));
		this.sendReplyBox(header + official.join(' ') + nonOfficial.join(' ') + privateRoom.join(' ') + (groupChats.length > 1 ? groupChats.join(' ') : '') + (battleRooms.length > 1 ? battleRooms.join(' ') : ''));
	},
};
