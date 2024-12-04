const Movie = require('../models/Models');
const path = require('path');
const fs = require('fs');

// Create a movie
exports.createMovie = async (req, res) => {
	try {
		const { title, publishedYear } = req.body;
		const posterPath = req.file ? req.file.path : null;
		const newMovie = new Movie({ title, publishedYear, poster: posterPath });
		await newMovie.save();
		res.status(201).json(newMovie);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get All Movies
exports.getMovies = async (req, res) => {
	try {
		const movies = await Movie.find();
		res.status(200).json(movies);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get a Single Movie
exports.getMovieById = async (req, res) => {
	try {
		const movie = await Movie.findById(req.params.id);
		if (!movie) return res.status(404).json({ message: 'Movie not found' });
		res.status(200).json(movie);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update a Movie
exports.updateMovie = async (req, res) => {
	try {
		const { title, publishedYear } = req.body;
		const updateData = {};

		// Update for title and publishedYear
		if (title) updateData.title = title;
		if (publishedYear) updateData.publishedYear = publishedYear;

		// Handles poster file/image update
		if (req.file) {
			// function to remove old poster to avoid file bloat
			const movie = await Movie.findById(req.params.id);
			if (movie && movie.poster) {
				fs.unlink(movie.poster, (err) => {
					if (err) console.error('Failed to delete old poster:', err);
				});
			}
			updateData.poster = req.file.path;
		}

		// Update the movie with the new data
		const updateMovie = await Movie.findByIdAndUpdate(
			req.params.id,
			updateData,
			{ new: true, runValidators: true }
		);

		if (!updateMovie) {
			return res.status(404).json({ message: 'Movie not found' });
		}

		res.status(200).json(updateMovie);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
	try {
		const movie = await Movie.findByIdAndDelete(req.params.id);
		if (!movie) return res.status(404).json({ message: 'Movie not found' });
		res.status(200).json({ message: 'Movie deleted' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
