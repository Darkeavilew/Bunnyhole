'use strict';

let fs = require('fs');
let http = require('http');
const Autolinker = require('autolinker');

let regdateCache = {};

regdate: function (target, callback) {
		target = toId(target);
		if (regdateCache[target]) return callback(regdateCache[target]);
		let req = https.get('https://pokemonshowdown.com/users/' + target + '.json', res => {
			let data = '';
			res.on('data', chunk => {
				data += chunk;
			}).on('end', () => {
				try {
					data = JSON.parse(data);
				} catch (e) {
					return callback(false);
				}
				let date = data['registertime'];
				if (date !== 0 && date.toString().length < 13) {
					while (date.toString().length < 13) {
						date = Number(date.toString() + '0');
					}
				}
				if (date !== 0) {
					regdateCache[target] = date;
					saveRegdateCache();
				}
				callback((date === 0 ? false : date));
			});
		});
		req.end();
	},

// last two functions needed to make sure BH.regdate() fully works
function loadRegdateCache() {
	try {
		regdateCache = JSON.parse(fs.readFileSync('config/regdate.json', 'utf8'));
	} catch (e) {}
}
loadRegdateCache();

function saveRegdateCache() {
	fs.writeFileSync('config/regdate.json', JSON.stringify(regdateCache));
}

BH.parseMessage = function (message) {
	if (message.substr(0, 5) === "/html") {
		message = message.substr(5);
		message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>'); // italics
		message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>'); // bold
		message = message.replace(/\~\~([^< ](?:[^<]*?[^< ])?)\~\~/g, '<strike>$1</strike>'); // strikethrough
		message = message.replace(/&lt;&lt;([a-z0-9-]+)&gt;&gt;/g, '&laquo;<a href="/$1" target="_blank">$1</a>&raquo;'); // <<roomid>>
		message = Autolinker.link(message.replace(/&#x2f;/g, '/'), {stripPrefix: false, phone: false, twitter: false});
		return message;
	}
	message = Chat.escapeHTML(message).replace(/&#x2f;/g, '/');
	message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>'); // italics
	message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>'); // bold
	message = message.replace(/\~\~([^< ](?:[^<]*?[^< ])?)\~\~/g, '<strike>$1</strike>'); // strikethrough
	message = message.replace(/&lt;&lt;([a-z0-9-]+)&gt;&gt;/g, '&laquo;<a href="/$1" target="_blank">$1</a>&raquo;'); // <<roomid>>
	message = Autolinker.link(message, {stripPrefix: false, phone: false, twitter: false});
	return message;
};

BH.messageSeniorStaff = function (message, pmName, from) {
	pmName = (pmName ? pmName : '~Spark Server');
	from = (from ? ' (PM from ' + from + ')' : '');
	Users.users.forEach(curUser => {
		if (curUser.group === '~' || curUser.group === '&') {
			curUser.send('|pm|' + pmName + '|' + curUser.getIdentity() + '|' + message + from);
		}
	});
};

BH.reloadCSS = function () {
	const cssPath = 'spark'; // This should be the server id if Config.serverid doesn't exist. Ex: 'serverid'
	let options = {
		host: 'play.pokemonshowdown.com',
		port: 80,
		path: '/customcss.php?server=' + (Config.serverid || cssPath),
		method: 'GET',
	};
	http.get(options);
};

//Daily Rewards System by Lord Haji, Credit to SpacialGaze
BH.giveDailyReward = function (user) {
	if (!user) return false;
	let reward = 0, time = Date.now();
	for (let ip in user.ips) {
		let cur = Db('DailyBonus').get(ip);
		if (!cur) {
			cur = [1, Date.now()];
			Db('DailyBonus').set(ip, cur);
		}
		if (cur[0] < reward || !reward) reward = cur[0];
		if (cur[1] < time) time = cur[1];
	}
	if (Date.now() - time < 86400000) return;
	reward++;
	if (reward > 7 || Date.now() - time > 172800000) reward = 1;
	// Loop again to set the ips values
	for (let ip in user.ips) {
		Db('DailyBonus').set(ip, [reward, Date.now()]);
	}
	Economy.writeMoney(user.userid, reward);
	user.send('|popup||wide||html| <center><u><b><font size="3">Spark Daily Bonus</font></b></u><br>You have been awarded ' + reward + ' Bucks.<br>' + showDailyRewardAni(reward) + '<br>Because you have connected to the server for the past ' + (reward === 1 ? 'Day' : reward + ' Days') + '.</center>');
};

BH.randomString = function (length) {
	return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};

function showDailyRewardAni(streak) {
	let output = '';
	for (let i = 1; i <= streak; i++) {
		output += "<img src='http://i.imgur.com/ZItWCLB.png' width='16' height='16'> ";
	}
	return output;
}
