exports.run = (arg, by, room) => {
    let text =
        '<marquee scrollamount = "15">';
    for (let i = 0; i < 13; i++) {
        text += '	<img src = "https://play.pokemonshowdown.com/sprites/ani/diglett.gif" class = "fa fa-spin" width = "43" height = "35">';
    }
    //D I G L E T T in emoji
    text +=
        '	<img src="https://images.emojiterra.com/twitter/v11/512px/1f1e9.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1ee.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1ec.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1f1.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1ea.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1f9.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1f9.png" class="fa fa-spin" width="43" height="35"> \
		</marquee> \
		<center> \
			<span style = "font-size: 0.9em">Moves Like Diglett | Eye of the Diglett | I\'ll Make a Diglett Out of You</span> \
		</center> \
		<center> \
			Click the Diglett -&gt;\
			<a href="https://youtu.be/6Zwu8i4bPV4"><img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/578a8319-92b6-4d81-9d5f-d6914e6535a0/d5o541m-54dae5d4-710c-44d4-a898-71ea71d7bd28.jpg" width="85" height="100"></a> \
			<a href="https://youtu.be/8LYwT9Nf1Ic"><img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/578a8319-92b6-4d81-9d5f-d6914e6535a0/d5o541m-54dae5d4-710c-44d4-a898-71ea71d7bd28.jpg" width="85" height="100"></a> \
			<a href="https://youtu.be/uzdvnB8SJV8"><img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/578a8319-92b6-4d81-9d5f-d6914e6535a0/d5o541m-54dae5d4-710c-44d4-a898-71ea71d7bd28.jpg" width="85" height="100"></a> \
			&lt;- Click the Diglett \
		</center> \
		<marquee scrollamount = "15"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1e9.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1ee.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1ec.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1f1.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1ea.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1f9.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1f9.png" class="fa fa-spin" width="43" height="35"> \
		';
    for (let i = 0; i < 13; i++) {
        text += '	<img src = "https://play.pokemonshowdown.com/sprites/ani-back/diglett.gif" class = "fa fa-spin" width = "43" height = "35">';
    }
    text +=
        '</marquee>';
    this.say(room, "/addhtmlbox " + text);
};

module.exports.config = {
    aliases: []
};