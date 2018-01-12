/* Lottery Plug-in
 * A chat plug-in for a lottery system for PS
 * This also gives out various bucks n_n
 * by: panpawn
 */
'use strict';

const moment = require('moment');
const fs = require('fs');
BH.lottery = {};

function loadLottery() {
	try {
		BH.lottery = JSON.parse(fs.readFileSync('config/lottery.json', 'utf8'));
	} catch (e) {
		console.log("Could not load lottery database.");
	}
}
setTimeout(function () { loadLottery(); }, 1000);

function saveLottery() {
	fs.writeFileSync('config/lottery.json', JSON.stringify(BH.lottery));
}
function moneyName(amount) {
	let name = " pokedollar";
	return name;
}
BH.pmall = function (message, pmName) {
	if (!pmName) pmName = 'Bunnyhole Server';
	Users.users.forEach(curUser => {
		curUser.send('|pm|' + pmName + '|' + curUser.getIdentity() + '|' + message);
	});
};

exports.commands = {
	loto: 'lottery',
	lotto: 'lottery',
	lottery: function (target, room, user) {
		let parts = target.split(',');
		for (let u in parts) parts[u] = parts[u].trim();
		if (room.id !== 'casino') return this.errorReply("You must be in Casino to use this command.");
		if (!Rooms.get('casino')) return this.errorReply("You must have the room \"Casino\" in order to use this script.");
		switch (toId(parts[0])) {
		case 'buy':
		case 'join':
			if (!BH.lottery.gameActive) return this.errorReply("The game of lottery is not currently running.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (parts[1]) {
				if (isNaN(Number(parts[1]))) return this.errorReply("The amount of tickets you buy must be a number.");
				if (~String(parts[1]).indexOf('.')) return this.errorReply("Cannot contain a decimal.");
				if (Number(parts[1]) < 1) return this.errorReply("Cannot be less than 1.");
				let bought = parts[1];
				if (bought > BH.lottery.maxTicketsPerUser) return this.errorReply("You cannot get this many lottery tickets.");
				if (bought * BH.lottery.ticketPrice > Db('currency').get(user.userid, 0)) return this.errorReply("Sorry, you do not have enough pokedollars to buy that many tickets.");
				if (BH.lottery.playerIPS.length > 1) {
					let filteredPlayerArray = BH.lottery.playerIPS.filter(function (ip) {
						return ip === user.latestIp;
					});
					if (Number(Object.keys(filteredPlayerArray).length) + Number(bought) > BH.lottery.maxTicketsPerUser) return this.errorReply("You cannot get more than " + BH.lottery.maxTicketsPerUser + " tickets for this game of lotto.");
				}
				Economy.writeMoney(toId(user.name), -bought * BH.lottery.ticketPrice);
				BH.lottery.pot = Math.round(BH.lottery.pot + (BH.lottery.ticketPrice * bought * 1.5));
				Rooms.get('casino').add("|raw|<b><font color=" + BH.Color(user.name) + ">" + user.name + "</font></b> has bought " + bought + " lottery tickets.");
				for (let x = bought; x > 0; x--) {
					BH.lottery.players.push(toId(user.name));
					BH.lottery.playerIPS.push(user.latestIp);
				}
				saveLottery();
			} else {
				const amount = Db('currency').get(user.userid, 0);
				if (amount < BH.lottery.ticketPrice) return this.errorReply('You do not have enough pokedollars to partake in this game of Lottery. You need ' + (BH.lottery.ticketPrice - amount) + moneyName(amount) + ' more.');
				if (BH.lottery.playerIPS.length > 1) {
					let filteredPlayerArray = BH.lottery.playerIPS.filter(function (ip) {
						return ip === user.latestIp;
					});
					if (filteredPlayerArray.length >= BH.lottery.maxTicketsPerUser) return this.errorReply("You cannot get more than " + BH.lottery.maxTicketsPerUser + " tickets for this game of lotto.");
				}
				Economy.writeMoney(toId(user.name), -BH.lottery.ticketPrice);
				BH.lottery.pot = Math.round(BH.lottery.pot + (BH.lottery.ticketPrice * 1.5));
				Rooms.get('casino').add("|raw|<b><font color=" + BH.Color(user.name) + ">" + user.name + "</font></b> has bought a lottery ticket.");
				BH.lottery.players.push(toId(user.name));
				BH.lottery.playerIPS.push(user.latestIp);
				saveLottery();
			}
			break;

		case 'new':
		case 'create':
			if (!this.can('ban', null, room)) return false;
			if (BH.lottery.gameActive) return this.errorReply("There is a game of Lottery already currently running.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!parts[1]) return this.errorReply("Usage: /lottery create, [ticket cost]");
			BH.lottery.maxTicketsPerUser = 10; //default max tickets per user
			BH.lottery.maxTicketPrice = 20;
			if (isNaN(Number(parts[1]))) return this.errorReply('The pot must be a number greater than 0');
			if (parts[1] > BH.lottery.maxTicketPrice) return this.errorReply("Lottery tickets cannot cost more than " + BH.lottery.maxTicketPrice + " pokedollars.");
			BH.lottery.startTime = Date.now();
			BH.lottery.ticketPrice = parts[1];
			BH.lottery.gameActive = true;
			BH.lottery.pot = 0;
			BH.lottery.players = [];
			BH.lottery.playerIPS = [];
			BH.lottery.createdBy = user.name;
			let room_notification =
					"<div class=\"broadcast-gold\"><center><b><font size=4 color=red>Lottery Game!</font></b><br />" +
					"<i><font color=gray>(Started by: " + Chat.escapeHTML(user.name) + ")</font></i><br />" +
					"A game of lottery has been started!  Cost to join is <b>" + BH.lottery.ticketPrice + "</b> Pokedollars.<br />" +
					"To buy a ticket, do <code>/lotto join</code>. (Max tickets per user: " + BH.lottery.maxTicketsPerUser + ")</center></div>";
			if (parts[2] === 'pmall') {
				if (!this.can('hotpatch')) return false;
				let loto_notification =
						"<center><font size=5 color=red><b>Lottery Game!</b></font><br />" +
						"A game of Lottery has started in <button name=\"send\" value=\"/join casino\">Casino</button>!<br />" +
						"The ticket cost to join is <b> " + BH.lottery.ticketPrice + "</b> Pokedollars.  For every ticket bought, the server automatically matches that price towards the pot.<br />" +
						"(For more information, hop in the room and do /lotto or ask for help!)</center>";
				BH.pmall('/html ' + loto_notification, '~Bunnyhole Lottery');
				Rooms.get('casino').add('|raw|' + room_notification);
			} else {
				Rooms.get('casino').add('|raw|' + room_notification);
			}
			saveLottery();
			break;

		case 'end':
			if (!this.can('ban', null, room)) return false;
			if (!BH.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			let winner = BH.lottery.players[Math.floor(Math.random() * BH.lottery.players.length)];
			let jackpot = Math.floor(100 * Math.random()) + 1;
			if (!BH.lottery.pot !== 0) {
				if (jackpot === 100) {
					Rooms.get("casino").add('|raw|<b><font size="7" color="green"><blink>JACKPOT!</blink></font></b>');
					Rooms.get("casino").add('|raw|<b><font size="4" color="' + BH.Color(winner) + '">' + winner + '</b></font><font size="4"> has won the game of lottery for <b>' + (BH.lottery.pot * 2) + '</b> pokedollars!</font>');
					Economy.writeMoney(toId(winner), BH.lottery.pot * 2);
					BH.lottery = {};
					saveLottery();
				} else {
					Economy.writeMoney(toId(winner), BH.lottery.pot);
					Rooms.get("casino").add('|raw|<b><font size="4" color="' + BH.Color(winner) + '">' + winner + '</b></font><font size="4"> has won the game of lottery for <b>' + BH.lottery.pot + '</b> pokedollars!</font>');
					BH.lottery = {};
					saveLottery();
				}
			} else if (BH.lottery.pot === 0) {
				this.add('|raw|<b><font size="4">This game has been cancelled due to a lack of players by ' + Chat.escapeHTML(toId(user.name)) + '.');
				BH.lottery = {};
				saveLottery();
			}
			this.privateModAction("(" + Chat.escapeHTML(user.name) + " has ended the game of lottery.)");
			break;

		case 'setlimit':
			if (!this.can('hotpatch')) return false;
			if (!BH.lottery.gameActive) return this.errorReply("The game of lottery is not currently running.");
			if (BH.lottery.players.length >= 1) return this.errorReply("You cannot change the limit because someone has already bought a lottery ticket.");
			if (!parts[1]) return this.errorReply("Usage: /lotto setlimit, [limit of tickets per user].");
			if (isNaN(Number(parts[1]))) return this.errorReply('The pot must be a number greater than 0');
			BH.lottery.maxTicketsPerUser = parts[1];
			saveLottery();
			this.add('|raw|<b><font size="4" color="' + BH.Color(user.name) + '">' + Chat.escapeHTML(user.name) + '</font><font size="4"> has changed the lottery ticket cap to: ' + BH.lottery.maxTicketsPerUser + '.</font></b>');
			break;

		case 'limit':
			this.sendReply("The current cap of lottery tickets per user is: " + BH.lottery.maxTicketsPerUser);
			break;

		case 'tickets':
			if (!this.runBroadcast()) return;
			if (!BH.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
			this.sendReplyBox("<div style=\"max-height: 125px; overflow-y: auto; overflow-x: hidden;\" target=\"_blank\"><b>Current tickets: (" + BH.lottery.players.length + ")</b><br /> " + BH.lottery.players + "</div>");
			break;

		case 'odds':
			if (!this.runBroadcast()) return;
			if (!BH.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
			if (!parts[1]) parts[1] = user.name;
			let chance = 0;
			if (BH.lottery.players.length > 1) {
				let filteredPlayerArray = BH.lottery.players.filter(function (username) {
					return username === toId(parts[1]);
				});
				chance = ((filteredPlayerArray.length / BH.lottery.players.length) * 100).toFixed(1);
			}
			if (chance === 0) return this.sendReplyBox("User '" + Chat.escapeHTML(parts[1]) + "' is not in the current game of lottery.  Check spelling?");
			this.sendReplyBox("<b><font color=" + BH.Color(parts[1]) + ">" + Chat.escapeHTML(parts[1]) + "</font></b> has a " + chance + "% chance of winning the game of lottery right now.");
			break;

		case 'reload':
			loadLottery();
			this.sendReply("You have reloaded the lottery database.");
			break;

		case 'status':
			if (!this.runBroadcast()) return;
			if (!BH.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
			this.sendReplyBox(
				"<div style=\"max-height: 125px; overflow-y: auto; overflow-x: hidden;\" target=\"_blank\">" +
					"<u>Lottery Game Status:</u><br />" +
					"Game started by: <b><font color=" + BH.Color(BH.lottery.createdBy) + ">" + Chat.escapeHTML(BH.lottery.createdBy) + "</font></b><br />" +
					"Pot: <b>" + BH.lottery.pot + " Pokedollars</b><br />" +
					"Ticket price: <b>" + BH.lottery.ticketPrice + " Pokedollars</b><br />" +
					"Game started: <b>" + moment(BH.lottery.startTime).fromNow() + "</b><br />" +
					"Max tickets per user: <b>" + BH.lottery.maxTicketsPerUser + "</b><br />" +
					"<b>Tickets bought (" + BH.lottery.players.length + "):</b><br />" +
					BH.lottery.players + "</div>"
			);
			break;

		case 'uptime':
			if (!this.runBroadcast()) return;
			if (!BH.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
			this.sendReplyBox("Lottery Game Uptime: <b>" + moment(BH.lottery.startTime).fromNow() + "</b>");
			break;

		case 'pot':
			if (!this.runBroadcast()) return;
			if (!BH.lottery.gameActive) return this.errorReply("There is no active game of lottery currently running.");
			this.sendReplyBox("The current lottery pot is worth: <b>" + BH.lottery.pot + "</b> pokedollars.");
			break;

		case 'obj':
			if (!this.can('hotpatch')) return false;
			this.sendReplyBox(JSON.stringify(BH.lottery)); //not sure if this needs to stringify
			break;

		default:
			if (!this.runBroadcast()) return;
			this.sendReplyBox(
				"<center><b>Lottery Commands</b><br />" +
					"<code>/lotto create, [ticket price]</code> - Starts a game of lotto with the respected ticket price. (Requires @, #, &, ~)<br />" +
					"<code>/lotto create, [ticket price], pmall</code> - Starts a game of lotto with the respected ticket price AND notifies everyone. (Requires ~)<br />" +
					"<code>/lotto join</code> OR <code>/loto buy</code> - Buys 1 ticket for the current game of lotto (no cap set as of now).<br />" +
					"<code>/lotto end</code> - Picks a winner of the lotto.  (Requires @, #, &, ~)<br />" +
					"<code>/lotto setlimit, [ticketcap]</code> - Sets the cap of tickets per user.  (Requires ~)<br />" +
					"<code>/lotto pot</code> - Shows the current pot of the game of lotto.<br />" +
					"<code>/lotto uptime</code> - Shows how long ago the game of lottery was started.<br />" +
					"<code>/lotto status</code> - Shows the current status of lottery.<br />" +
					"<code>/lotto odds, [user]</code> - Shows the odds of [user] winning the lottery.<br />" +
					"<code>/lotto tickets</code> - Shows all of the current tickets in the current game of lotto."
			);
		}
	},
};
