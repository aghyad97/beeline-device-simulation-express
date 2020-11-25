const mongoose = require("mongoose");

var AngleSchema = new mongoose.Schema({
	angle: {
		type: String,
		required: true
	},
}, {
	timestamps: true
});


module.exports = mongoose.model("AngleSchema", AngleSchema);