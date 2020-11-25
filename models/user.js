const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
}, {
	timestamps: true
});
UserSchema.pre("save", function (next) {
	// store reference
	const user = this;
	if (user._password === undefined) {
			return next();
	}
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
			if (err) console.log(err);
			// hash the password using our new salt
			bcrypt.hash(user._password, salt, function (err, hash) {
					if (err) console.log(err);
					user.hashed_password = hash;
					next();
			});
	});
});
UserSchema.methods.validPassword = function (password) {
		return (password === this.password)
};

module.exports = mongoose.model("User", UserSchema);