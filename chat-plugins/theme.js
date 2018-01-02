'use strict';

function song(fren) {
	let song = Db("music").get([fren, 'link']);
	let title = Db("music").get([fren, 'title']);
	if (!Db("music").has(fren)) return '';
	return '<acronym title="' + title + '"><br /><audio src="' + song + '" controls="" style="width:100%;"></audio></acronym>';
}

exports.commands = {
	music: {
		add: "set",
		give: "set",
		set: function (target, room, user) {
			if (!this.can('ban')) return false;
			let parts = target.split(',');
			let targ = parts[0].toLowerCase().trim();
			if (!parts[2]) return this.errorReply('/musichelp');
			let link = parts[1].trim();
			let title = parts[2].trim();
			Db("music").set([targ, 'link'], link);
			Db("music").set([targ, 'title'], title);
			this.sendReply(`${targ}'s song has been set to: `);
			this.parse(`/theme ${targ}`);
		},

		take: "delete",
		remove: "delete",
		delete: function (target, room, user) {
			if (!this.can('ban')) return false;
			let targ = target.toLowerCase();
			if (!target) return this.parse('/musichelp');
			if (!Db("music").has(targ)) return this.errorReply('This user does not have any music on their theme.');
			Db("music").delete(targ);
			return this.sendReply('This user\'s theme music has been deleted.');
		},

		'': 'help',
		help: function (target, room, user) {
			this.parse('/musichelp');
		},
	},
	musichelp: [
		"/music set [user], [link], [title of song] - Sets a user's theme music.",
		"/music take [user] - Removes a user's theme music.",
	],

	'!theme': true,
	theme: function (target, room, user) {
		target = toId(target);
		if (!target) target = user.name;
		if (target.length > 18) return this.errorReply("Usernames cannot exceed 18 characters.");
		if (!this.runBroadcast()) return;
		let self = this;
		let targetUser = Users.get(target);
		let username = (targetUser ? targetUser.name : target);
		let userid = (targetUser ? targetUser.userid : toId(target));
		if (userid) {
			showTheme();
		}

		function showTheme() {
			Economy.readMoney(toId(username), money => {
				let theme = ``;
				theme += `&nbsp;${song(toId(username))}`;
				theme += `&nbsp;</div>`;
				theme += `<br clear="all">`;
				self.sendReplyBox(theme);
			});
		}
	},
};
