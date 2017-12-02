'use strict';

function clearRoom(room) {
	let len = (room.log && room.log.length) || 0;
	let users = [];
	while (len--) {
		room.log[len] = '';
	}
	for (let u in room.users) {
		users.push(u);
		Users(u).leaveRoom(room, Users(u).connections[0]);
	}
	len = users.length;
	setTimeout(() => {
		while (len--) {
			Users(users[len]).joinRoom(room, Users(users[len]).connections[0]);
		}
	}, 1000);
}

function getLinkId(msg) {
	msg = msg.split(' ');
	for (let i = 0; i < msg.length; i++) {
		if ((/youtu\.be/i).test(msg[i])) {
			let temp = msg[i].split('/');
			return temp[temp.length - 1];
		} else if ((/youtube\.com/i).test(msg[i])) {
			return msg[i].substring(msg[i].indexOf("=") + 1).replace(".", "");
		}
	}
}

exports.commands = {
	gclearall: 'globalclearall',
	globalclearall: function (target, room, user) {
		if (!this.can('gdeclare')) return false;

		Rooms.rooms.forEach(room => clearRoom(room));
		Users.users.forEach(user => user.popup('All rooms have been cleared.'));
		this.privateModCommand(`(${user.name} used /globalclearall.)`);
	},

	'!youtube': true,
	yt: 'youtube',
	youtube: function (target, room, user) {
		if (!this.runBroadcast()) return false;
		if (!target) return false;
		let params_spl = target.split(' '), g = ' ';
		for (let i = 0; i < params_spl.length; i++) {
			g += '+' + params_spl[i];
		}
		g = g.substr(1);

		let reqOpts = {
			hostname: 'www.googleapis.com',
			method: 'GET',
			path: '/youtube/v3/search?part=snippet&q=' + g + '&type=video&key=AIzaSyA4fgl5OuqrgLE1B7v8IWYr3rdpTGkTmns',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		let self = this;
		let data = '';
		let req = require('https').request(reqOpts, function (res) {
			res.on('data', function (chunk) {
				data += chunk;
			});
			res.on('end', function (chunk) {
				let d = JSON.parse(data);
				if (d.pageInfo.totalResults === 0) {
					room.add('No videos found');
					room.update();
					return false;
				}
				let id = getLinkId(target);
				const image = '<button style="background: none; border: none;"><img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg?custom=true&w=168&h=94&stc=true&jpg444=true&jpgq=90&sp=68&sigh=tbq7TDTjFXD_0RtlFUMGz-k3JiQ" height="180" width="180"></button>';
				self.sendReplyBox('<center>' + image + '<br><a href="https://www.youtube.com/watch?v=' + d.items[0].id.videoId + '"><b> ' + d.items[0].snippet.title + '</b></center>');
				room.update();
			});
		});
		req.end();
	},

	dm: 'daymute',
	daymute: function (target, room, user, connection, cmd) {
		if (!target) return this.errorReply("Usage: /dm [user], [reason].");
		if (!this.canTalk()) return this.sendReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		if (target.length > 300) {
			return this.sendReply("The reason is too long. It cannot exceed 300 characters.");
		}

		let muteDuration = 24 * 60 * 60 * 1000;
		if (!this.can('mute', targetUser, room)) return false;
		let canBeMutedFurther = ((room.getMuteTime(targetUser) || 0) <= (muteDuration * 5 / 6));
		if ((room.isMuted(targetUser) && !canBeMutedFurther) || targetUser.locked || !targetUser.connected) {
			let problem = " but was already " + (!targetUser.connected ? "offline" : targetUser.locked ? "locked" : "muted");
			if (!target) {
				return this.privateModCommand("(" + targetUser.name + " would be muted by " + user.name + problem + ".)");
			}
			return this.addModCommand("" + targetUser.name + " would be muted by " + user.name + problem + "." + (target ? " (" + target + ")" : ""));
		}

		if (targetUser in room.users) targetUser.popup("|modal|" + user.name + " has muted you in " + room.id + " for 24 hours. " + target);
		this.addModCommand("" + targetUser.name + " was muted by " + user.name + " for 24 hours." + (target ? " (" + target + ")" : ""));
		if (targetUser.autoconfirmed && targetUser.autoconfirmed !== targetUser.userid) this.privateModCommand("(" + targetUser.name + "'s ac account: " + targetUser.autoconfirmed + ")");
		this.add('|unlink|' + toId(this.inputUsername));

		room.mute(targetUser, muteDuration, false);
	},
	
	masspm: 'pmall',
	pmall: function (target, room, user) {
		if (!this.can('pmall')) return false;
		if (!target) return this.parse('/help pmall');

		let pmName = '~Bunnyhole Server';
		Users.users.forEach(curUser => {
			let message = '|pm|' + pmName + '|' + curUser.getIdentity() + '|' + target;
			curUser.send(message);
		});
	},
	pmallhelp: ["/pmall [message]."],

	staffpm: 'pmallstaff',
	pmstaff: 'pmallstaff',
	pmallstaff: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target) return this.parse('/help pmallstaff');

		let pmName = '~Bunnyhole Server';

		Users.users.forEach(curUser => {
			if (!curUser.isStaff) return;
			let message = '|pm|' + pmName + '|' + curUser.getIdentity() + '|' + target;
			curUser.send(message);
		});
	},
	pmallstaffhelp: ["/pmallstaff [message]"],

	pmroom: 'rmall',
	roompm: 'rmall',
	rmall: function (target, room, user) {
		if (!this.can('declare', null, room)) return this.errorReply("/rmall - Access denied.");
		if (!target) return this.sendReply("/rmall [message] - Sends a pm to all users in the room.");
		target = target.replace(/<(?:.|\n)*?>/gm, '');

		let pmName = '~Spark Server';

		for (let i in room.users) {
			let message = '|pm|' + pmName + '|' + room.users[i].getIdentity() + '| ' + target;
			room.users[i].send(message);
		}
		this.privateModCommand('(' + Chat.escapeHTML(user.name) + ' mass room PM\'ed: ' + target + ')');
	},

	seen: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse('/help seen');
		let targetUser = Users.get(target);
		if (targetUser && targetUser.connected) return this.sendReplyBox(BH.nameColor(targetUser.name, true) + " is <b><font color='limegreen'>Currently Online</b></font>.");
		target = Chat.escapeHTML(target);
		let seen = Db('seen').get(toId(target));
		if (!seen) return this.sendReplyBox(BH.nameColor(target, true) + " has <b><font color='red'>never been online</font></b> on this server.");
		this.sendReplyBox(BH.nameColor(target, true) + " was last seen <b>" + Chat.toDurationString(Date.now() - seen, {precision: true}) + "</b> ago.");
	},
	seenhelp: ["/seen - Shows when the user last connected on the server."],
	
	regdate: function (target, room, user, connection) {
		if (!target) target = user.name;
		target = toId(target);
		if (target.length < 1 || target.length > 19) {
			return this.sendReply("Usernames can not be less than one character or longer than 19 characters. (Current length: " + target.length + ".)");
		}
		if (!this.runBroadcast()) return;
		BH.regdate(target, date => {
			if (date) {
				this.sendReplyBox(regdateReply(date));
			}
		});

		function regdateReply(date) {
			if (date === 0) {
				return BH.nameColor(target, true) + " <b><font color='red'>is not registered.</font></b>";
			} else {
				let d = new Date(date);
				let MonthNames = ["January", "February", "March", "April", "May", "June",
					"July", "August", "September", "October", "November", "December",
				];
				let DayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				return BH.nameColor(target, true) + " was registered on <b>" + DayNames[d.getUTCDay()] + ", " + MonthNames[d.getUTCMonth()] + ' ' + d.getUTCDate() + ", " + d.getUTCFullYear() + "</b> at <b>" + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + " UTC.</b>";
			}
			//room.update();
		}
	},
	regdatehelp: ["/regdate - Gets the regdate (register date) of a username."],
	
	reddeclare: 'declare',
	greendeclare: 'declare',
	declare: function (target, room, user, connection, cmd, message) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;
		if (!this.canTalk()) return;

		let color = 'blue';
		switch (cmd) {
		case 'reddeclare':
			color = 'red';
			break;
		case 'greendeclare':
			color = 'green';
			break;
		}
		this.add('|raw|<div class="broadcast-' + color + '"><b>' + Chat.escapeHTML(target) + '</b></div>');
		this.logModCommand(user.name + " declared " + target);
	},
	declarehelp: ["/declare [message] - Anonymously announces a message. Requires: # * & ~"],

	redhtmldeclare: 'htmldeclare',
	greenhtmldeclare: 'htmldeclare',
	htmldeclare: function (target, room, user, connection, cmd, message) {
		if (!target) return this.parse('/help htmldeclare');
		if (!this.can('gdeclare', null, room)) return false;
		if (!this.canTalk()) return;
		target = this.canHTML(target);
		if (!target) return;

		let color = 'blue';
		switch (cmd) {
		case 'redhtmldeclare':
			color = 'red';
			break;
		case 'greenhtmldeclare':
			color = 'green';
			break;
		}
		this.add('|raw|<div class="broadcast-' + color + '">' + target + '</div>');
		this.logModCommand(user.name + " declared " + target);
	},
	htmldeclarehelp: ["/htmldeclare [message] - Anonymously announces a message using safe HTML. Requires: ~"],
	
	redglobaldeclare: 'globaldeclare',
	greenglobaldeclare: 'globaldeclare',
	redgdeclare: 'globaldeclare',
	greengdeclare: 'globaldeclare',
	gdeclare: 'globaldeclare',
	globaldeclare: function (target, room, user, connection, cmd, message) {
		if (!target) return this.parse('/help globaldeclare');
		if (!this.can('gdeclare')) return false;
		target = this.canHTML(target);
		if (!target) return;

		let color = 'blue';
		switch (cmd) {
		case 'redglobaldeclare':
		case 'redgdeclare':
			color = 'red';
			break;
		case 'greenglobaldeclare':
		case 'greengdeclare':
			color = 'green';
			break;
		}
		Rooms.rooms.forEach((curRoom, id) => {
			if (id !== 'global') curRoom.addRaw('<div class="broadcast-' + color + '">' + target + '</div>').update();
		});
		this.logModCommand(user.name + " globally declared " + target);
	},
	globaldeclarehelp: ["/globaldeclare [message] - Anonymously announces a message to every room on the server. Requires: ~"],
	
	redchatdeclare: 'chatdeclare',
	greenchatdeclare: 'chatdeclare',
	redcdeclare: 'chatdeclare',
	greencdeclare: 'chatdeclare',
	cdeclare: 'chatdeclare',
	chatdeclare: function (target, room, user, connection, cmd, message) {
		if (!target) return this.parse('/help chatdeclare');
		if (!this.can('gdeclare')) return false;
		target = this.canHTML(target);
		if (!target) return;

		let color = 'blue';
		switch (cmd) {
		case 'reddeclare':
			color = 'red';
			break;
		case 'greendeclare':
			color = 'green';
			break;
		}
		Rooms.rooms.forEach((curRoom, id) => {
			if (id !== 'global' && curRoom.type !== 'battle') curRoom.addRaw('<div class="broadcast-' + color + '">' + target + '</div>').update();
		});
		this.logModCommand(user.name + " globally declared (chat level) " + target);
	},
	chatdeclarehelp: ["/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: ~"],

	htmlgdeclare: 'htmlglobaldeclare',
	htmlglobaldeclare: function (target, room, user) {
		if (!target) return this.parse('/help htmlglobaldeclare');
		if (!this.can('gdeclare')) return false;
		target = this.canHTML(target);
		if (!target) return;

		Rooms.rooms.forEach((curRoom, id) => {
			if (id !== 'global') curRoom.addRaw(`<div class="broadcast-blue"><b>${target}</b></div>`).update();
		});
		Users.users.forEach(u => {
			if (u.connected) u.send(`|pm|~|${u.group}${u.name}|/raw <div class="broadcast-blue"><b>${target}</b></div>`);
		});
		this.logModCommand(`${user.name} HTML-declared: ${target}`);
	},
	htmlglobaldeclarehelp: ["/htmlglobaldeclare [message] - Anonymously announces a message using safe HTML to every room on the server. Requires: ~"],

	fj: 'forcejoin',
	forcejoin: function (target, room, user) {
		if (!user.can('root')) return false;
		if (!target) return this.parse('/help forcejoin');
		let parts = target.split(',');
		if (!parts[0] || !parts[1]) return this.parse('/help forcejoin');
		let userid = toId(parts[0]);
		let roomid = toId(parts[1]);
		if (!Users.get(userid)) return this.sendReply("User not found.");
		if (!Rooms.get(roomid)) return this.sendReply("Room not found.");
		Users.get(userid).joinRoom(roomid);
	},
	forcejoinhelp: ["/forcejoin [target], [room] - Forces a user to join a room"],

	hide: 'hideauth',
	hideauth: function (target, room, user) {
		if (!this.can('lock')) return false;
		let tar = ' ';
		if (target) {
			target = target.trim();
			if (Config.groupsranking.indexOf(target) > -1 && target !== '#') {
				if (Config.groupsranking.indexOf(target) <= Config.groupsranking.indexOf(user.group)) {
					tar = target;
				} else {
					this.sendReply('The group symbol you have tried to use is of a higher authority than you have access to. Defaulting to \'' + tar + 'instead.');
				}
			} else {
				this.sendReply('You are now hiding your auth symbol as \'' + tar + '\'.');
			}
		}
		user.getIdentity = function (roomid) {
			return tar + this.name;
		};
		user.updateIdentity();
		return this.sendReply("You are now hiding your auth as ' " + tar + "'.");
	},
	hidehelp: ["/hide - Hides user's global rank. Requires: & ~"],

	show: 'showauth',
	showauth: function (target, room, user) {
		if (!this.can('lock')) return false;
		delete user.getIdentity;
		user.updateIdentity();
		return this.sendReply("You are now showing your authority!");
	},
	showhelp: ["/show - Displays user's global rank. Requires: & ~"],

};
