'use strict';

exports.commands = {
	serverrules: 'bunnyholerules',
	bunnyholerules: function (target, room, user) {
		this.popupReply("|html|" + "<font size=4><b>Bunnyhole Server Rules:</b></font><br />" +
					"<br />" +
					"<b>1.</b> No sex. Don't discuss anything sexually explicit, not even in private messages, not even if you're both adults.<br />" +
					"<br />" +
					"<b>2.</b> Moderators have discretion to punish any behaviour they deem inappropriate, whether or not it's on this list.<br />" +
					"<br />" +
					"<b>3.</b> Do not spam, flame, or troll. This includes advertising, raiding, asking questions with one-word answers in the lobby, and flooding the chat such as by copy/pasting logs in the lobby.<br />" +
					"<br />" +
					"<b>4.</b> No minimodding: don't mod if it's not your job. Don't tell people they'll be muted, don't ask for people to be muted, and don't talk about whether or not people should be muted. This applies to bans and other punishments, too.<br />" +
					"<br />" +
					"<b>5.</b> Spam is not permitted this included but not limited to server links, 18+ links, etc.<br />" +
					"<br />" +
					"<b>6.</b> Usernames may not directly reference sexual activity, or be excessively disgusting.<br />" +
					"<br />" +
					"<b>7.</b> Please treat everyone with respect this included staff and regular users.<br />" +
					"<br />" +
					"<b>8.</b> Do not flood chats with spam that has no purpose.<br />" +
					"<br />" +
					"<i>Please follow these rules to make the server a friendly and enjoyable place to be. Breaking any rules will result in punishment.</i><br />");
	},

	houserules: 'casinorules',
	casinorules: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			'<center><u><b><font size="5">Casino Games</font></b></u></center>' +
			'<b><u>Dice</u></b><br />' +
			'PvP Roll dice against someone else. Winner takes all.<br />' +
			'Commands: /startdice # /joindice /enddice <br />' +
			'<button style="border-radius: 5px ; border: 2px inset black ; background-color: #0a6c03 ; border: 2px inset #000000 ; font-weight: bold ; color: #ffffff ; border-radius: 7px ; padding: 3px" name="send" value=/startdice">Start Dice (1)</button> | <button style="border-radius: 5px ; border: 2px inset black ; background-color: #0a6c03 ; border: 2px inset #000000 ; font-weight: bold ; color: #ffffff ; border-radius: 7px ; padding: 3px" name="send" value="/enddice">End Dice</button><br />' +
			'<br />' +
			'<b><u>Wheel of Misfortune</u></b><br />' +
			'PvP A player hosts a wheel & the other spins it. Negative = Spinner wins, Positive = Host wins.<br />' +
			'Commands: /wheel help /wheel list <br />' +
			'<button style="border-radius: 5px ; border: 2px inset black ; background-color: #0a6c03 ; border: 2px inset #000000 ; font-weight: bold ; color: #ffffff ; border-radius: 7px ; padding: 3px" name="send" value="/wheel help">Wheel Info</button> | <button style="border-radius: 5px ; border: 2px inset black ; background-color: #0a6c03 ; border: 2px inset #000000 ; font-weight: bold ; color: #ffffff ; border-radius: 7px ; padding: 3px" name="send" value="/wheel list">Wheel List</button> | <button style="border-radius: 5px ; border: 2px inset black ; background-color: #0a6c03 ; border: 2px inset #000000 ; font-weight: bold ; color: #ffffff ; border-radius: 7px ; padding: 3px" name="send" value="/wheel create scrubs,1">Host Wheel o\' Scrubs</button><br />' +
			'<br />' +
			'<b><u>Slots</u></b><br />' +
			'PvE Spin the slots at a chance to win various prizes. Cost: 3<br />' +
			'Commands: /slots /slots start<br />' +
			'<button style="border-radius: 5px ; border: 2px inset black ; background-color: #0a6c03 ; border: 2px inset #000000 ; font-weight: bold ; color: #ffffff ; border-radius: 7px ; padding: 3px" name="send" value=/slots">Slots Info</button> | <button style="border-radius: 5px ; border: 2px inset black ; background-color: #0a6c03 ; border: 2px inset #000000 ; font-weight: bold ; color: #ffffff ; border-radius: 7px ; padding: 3px" name="send" value="/slots start">Spin Slots</button><br />' +
			'<br />' +
			'<b><u>Blackjack</u></b><br />' +
			'P, P, PvE Try to get closer to 21 than the dealer without going over. Hit to get an extra card or stay.<br />' +
			'Commands: /blackjack join /blackjack hit /blackjack stay <br />' +
			'<button style="border-radius: 5px ; border: 2px inset black ; background-color: #0a6c03 ; border: 2px inset #000000 ; font-weight: bold ; color: #ffffff ; border-radius: 7px ; padding: 3px" name="send" value=/blackjack">Blackjack Info</button> | <button style="border-radius: 5px ; border: 2px inset black ; background-color: #0a6c03 ; border: 2px inset #000000 ; font-weight: bold ; color: #ffffff ; border-radius: 7px ; padding: 3px" name="send" value="/blackjack join">Join Blackjack</button><br />' +
			'<br />' +
			'<b><u>Lotto</u></b><br />' +
			'PvPvP Buy a ticket to join the lottery drawing. <br />' +
			'Commands: /lotto /lotto status /lotto join<br />' +
			'<button style="border-radius: 5px ; border: 2px inset black ; background-color: #0a6c03 ; border: 2px inset #000000 ; font-weight: bold ; color: #ffffff ; border-radius: 7px ; padding: 3px" name="send" value=/lotto">Lotto Info</button> | <button style="border-radius: 5px ; border: 2px inset black ; background-color: #0a6c03 ; border: 2px inset #000000 ; font-weight: bold ; color: #ffffff ; border-radius: 7px ; padding: 3px" name="send" value="/lotto status">Lotto Status</button> | <button style="border-radius: 5px ; border: 2px inset black ; background-color: #0a6c03 ; border: 2px inset #000000 ; font-weight: bold ; color: #ffffff ; border-radius: 7px ; padding: 3px" name="send" value="/lotto Join">Buy Ticket</button><br />' +
			'<br />' +
			'<center><u><b>Informational Buttons</b></u><br />' +
			'<button name="send" value= "/roomshop" style="width: 100px ; border: 1px solid black ; -moz-border-radius: 2px ; border-radius: 3px ; font-size: 11px ; font-family: &quot;verdana&quot; , sans-serif ; padding: 3px 3px 3px 3px ; display: inline-block ; font-weight: bold ; color: #ffffff ; background-color: #CF2727 ; background-image: -o-linear-gradient(top , #9C1C1E, #CF2727) ; background-image: linear-gradient(to bottom , #9C1C1E, #CF2727)">Room Shop</button> | <button name="send" value= "/richestusers" style="width: 100px ; border: 1px solid black ; -moz-border-radius: 2px ; border-radius: 3px ; font-size: 11px ; font-family: &quot;verdana&quot; , sans-serif ; padding: 3px 3px 3px 3px ; display: inline-block ; font-weight: bold ; color: #ffffff ; background-color: #CF2727 ; background-image: -o-linear-gradient(top , #9C1C1E, #CF2727) ; background-image: linear-gradient(to bottom , #9C1C1E, #CF2727)">Richest Users</button>' +
			'</center>'
		);
	},

	'!discord': true,
	discord: function (target, room, user) {
		        if (!this.runBroadcast()) return;
		        this.sendReplyBox('Join our server discord by clicking <a href="https://discord.gg/KeeKb2P">here</a>.');
	},
	/*Bunnyhole Gifs*/
	'!hmm': true,
	hmm: function (target, room, user) {
		if (!this.runBroadcast()) return;
		return this.sendReply('|raw|<center><img src="https://i.imgur.com/5pPDucQ.gif" width="300" height="169"></center>');
	},
	'!kicks': true,
	kicks: function (target, room, user) {
		if (!this.runBroadcast()) return;
		return this.sendReply('|raw|<center><img src="https://i.imgur.com/rL3brvH.gif" width="300" height="169"></center>');
	},
	'!nekochan': true,
	nekochan: function (target, room, user) {
		if (!this.runBroadcast()) return;
		return this.sendReply('|raw|<center><img src="https://i.imgur.com/er6fBG0.gif" width="300" height="169"></center>');
	},
	'!nono': true,
	nono: function (target, room, user) {
		if (!this.runBroadcast()) return;
		return this.sendReply('|raw|<center><img src="https://i.imgur.com/NbAHKSD.gif" width="300" height="169"></center>');
	},
	'!dafuck': true,
	dafuck: function (target, room, user) {
		if (!this.runBroadcast()) return;
		return this.sendReply('|raw|<center><img src="https://i.imgur.com/cVhyNfL.gif" width="300" height="169"></center>');
	},
	'!buddies': true,
	buddies: function (target, room, user) {
		if (!this.runBroadcast()) return;
		return this.sendReply('|raw|<center><img src="https://i.imgur.com/HJ1Jz5e.gif" width="300" height="169"></center>');
	},
	'!hehe': true,
	hehe: function (target, room, user) {
		if (!this.runBroadcast()) return;
		return this.sendReply('|raw|<center><img src="https://i.imgur.com/JZHXoJu.gif" width="300" height="169"></center>');
	},
	'!tea': true,
	tea: function (target, room, user) {
		if (!this.runBroadcast()) return;
		return this.sendReply('|raw|<center><img src="https://i.imgur.com/e5hei6e.gif" width="300" height="169"></center>');
	},
	'!cri': true,
	cri: function (target, room, user) {
		if (!this.runBroadcast()) return;
		return this.sendReply('|raw|<center><img src="https://i.imgur.com/foMOnVb.gif" width="300" height="169"></center>');
	},
	'!smile': true,
	smile: function (target, room, user) {
		if (!this.runBroadcast()) return;
		return this.sendReply('|raw|<center><img src="https://i.imgur.com/TJruUuJ.gif" width="300" height="169"></center>');
	},
	'!giflist': true,
	giflist: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			"<strong>List of Server Gifs</strong><br />" +
			"- /hmm<br />" +
			"- /kicks<br />" +
			"- /nekochan<br />" +
			"- /nono<br />" +
			"- /dafuck<br />" +
			"- /buddies<br />" +
			"- /hehe<br />" +
			"- /tea<br />" +
			"- /cri<br />" +
			"- /smile<br />" +
			"</div>"
		);
	},
};
