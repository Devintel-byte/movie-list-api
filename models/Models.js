const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
	title: { type: String, required: true },
	publishedYear: { type: Number, required: true },
	poster: { type: String }, // This type holds the URL to upload poster image
});

module.exports = mongoose.model('Movie', movieSchema);
