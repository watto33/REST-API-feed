const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images');
	},
	filename: function (req, file, cb) {
		cb(
			null,
			new Date().toISOString().replace(/:/g, '-') + '--' + file.originalname
		);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/png'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(bodyParser.json());
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS,GET,POST,PUT,PATCH,DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message: message, data: data });
});

mongoose
	.connect(
		'mongodb+srv://watto:DJC@TJf55YnRXSy@node-prac-urvyj.gcp.mongodb.net/api?retryWrites=true&w=majority',
		{ useNewUrlParser: true }
	)
	.then(result => {
		app.listen(8080, () => {
			console.log('Successfully connected to PORT 8080');
		});
	})
	.catch(err => console.log(err));
