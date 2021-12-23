const express = require('express');
//const bodyParser = require('body-parser');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cors = require('cors');

const app = express();
app.use(cors());
// app.use(
// 	bodyParser.urlencoded({
// 		extended: false,
// 	})
// );
app.use(express.json());
//app.use(express.urlencoded());

app.post('/api/setCLI', (req, res) => {
	console.log('req.body: ', req.body);
	aws.config.credentials.accessKeyId = req.body.accessKeyId;
	console.log(
		'aws.config.credentials.accessKeyId: ',
		aws.config.credentials.accessKeyId
	);
	aws.config.credentials.secretAccessKey = req.body.secretAccessKey;
	aws.config.credentials.sessionToken = req.body.sessionToken;

	// aws.config.update({
	// 	accessKeyId: req.body.accessKeyId,
	// 	secretAccessKey: req.body.secretAccessKey,
	// 	sessionToken: req.body.sessionToken,
	// 	region: 'us-east-1',
	// 	signatureVersion: 'v4',
	// });

	// aws.config.update({
	// 	credentials: {
	// 		accessKeyId: req.body.accessKeyId,
	// 		secretAccessKey: req.body.secretAccessKey,
	// 		sessionToken: req.body.sessionToken,
	// 	},
	// 	region: 'us-east-1',
	// });

	console.log('aws config credentials: ', aws.config.credentials);

	res.status(200).json({
		status: 'success',
	});
});

// aws.config.update({
// 	accessKeyId: AWS_ACCESS_KEY_ID, //'ASIA6OFSTGH2U5MZFEIJ',
// 	secretAccessKey: AWS_SECRET_ACCESS_KEY, //'HYF9fYDGY8cGnDQOYUmfsBevQD0V0rmk0TKSQKft',
// 	sessionToken: AWS_SESSION_TOKEN,
// 	//'FwoGZXIvYXdzEEcaDJ1lMEr+qdigO2h0bSLPAeuouUrSW6Igeb3t8QrFJIYlWu8/hfGV6WUOEJTsYbxASyqcWICaTggcdcuTI7m2iEXfASZcJXEGuuwa0Kp8OLXBbLaWLwy/BuNETjWECHdqnGbJEUVvpqf5BXOK4ouNfeAYeBGpsgsL1FSztsvAqyjQNHSFxaLQBXOIPDr2bDbEb1Uiw/S5UvxrTdFDvLuIvj12SEYTkGFdeSjquA4SDs473Vh5pIvpYsndGA3r4hVB/eiHD8TLZI9LNkUR2M787v2Aledxq0S7DrxpCLA+qSiwxYyOBjItPLnZQ0vJXdbOfuabKJJ7ObY4jRqwXHsejVfKfYIxOPXSmEBXUmWWzsQn/dFa',
// 	region: 'us-east-1',
// 	signatureVersion: 'v4',
// });

const s3 = new aws.S3({ region: 'us-east-1' });
const upload = multer({
	fileFilter: (req, image, cb) => {
		//file là image
		if (
			image.mimetype === 'application/octet-stream' ||
			image.mimetype === 'video/mp4' ||
			image.mimetype === 'image/jpeg' ||
			image.mimetype === 'image/png'
		) {
			cb(null, true);
		} else {
			cb(new Error('Invalid file type'), false);
		}
	},
	storage: multerS3({
		acl: 'public-read',
		s3,
		bucket: 'imagerekognition-cloud',
		key: function (req, image, cb) {
			req.image = Date.now() + image.originalname;
			cb(null, Date.now() + image.originalname);
		},
	}),
});

const uploads3 = multer({
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype === 'application/octet-stream' ||
			file.mimetype === 'video/mp4' ||
			file.mimetype === 'image/jpeg' ||
			file.mimetype === 'image/png'
		) {
			cb(null, true);
		} else {
			cb(new Error('Invalid file type'), false);
		}
	},
	storage: multerS3({
		acl: 'public-read',
		s3,
		bucket: 'imagerekognition-cloud',
		key: function (req, file, cb) {
			req.file = Date.now() + file.originalname;
			cb(null, Date.now() + file.originalname);
		},
	}),
});

app.get('/', (req, res) => {
	res.status(200).send('Connected!');
});

app.post('/api/upload', upload.array('image', 1), (req, res) => {
	try {
		res.send({ image: req.image });
	} catch (err) {
		//console.log(err);
	}
});

app.post('/api/uploads3', uploads3.array('file', 1), (req, res) => {
	res.send({ file: req.file });
});

const rekognition = new aws.Rekognition({ region: 'us-east-1' });
app.post('/api/labels', (req, res) => {
	var params = {
		Image: {
			S3Object: {
				Bucket: 'imagerekognition-cloud',
				Name: req.body.name,
			},
		},
		MaxLabels: 5,
		MinConfidence: 80,
	};
	console.log(req.body.name);
	rekognition.detectLabels(params, function (err, data) {
		if (err) console.log(err, err.stack);
		else res.send({ data: data });
		console.log(data);
	});
});

app.post('/api/texts', (req, res) => {
	var params = {
		Image: {
			S3Object: {
				Bucket: 'imagerekognition-cloud',
				Name: req.body.name,
			},
		},
		// MaxLabels: 5,
		// MinConfidence: 80,
	};
	console.log(req.body.name);

	//detectText
	rekognition.detectText(params, (err, data) => {
		if (err) console.log(err, err.stack);
		else res.send({ data: data });
		console.log(data);
	});
});

app.post('/api/faces', (req, res) => {
	var params = {
		Image: {
			S3Object: {
				Bucket: 'imagerekognition-cloud',
				Name: req.body.name,
			},
		},
		Attributes: ['ALL'],
	};
	rekognition.detectFaces(params, (err, data) => {
		if (err) console.log(err, err.stack);
		// an error occurred
		else res.send({ data: data });
		console.log(JSON.stringify(data, null, '\t'));
	});
});

app.post('/api/celeb', (req, res) => {
	var params = {
		Image: {
			S3Object: {
				Bucket: 'imagerekognition-cloud',
				Name: req.body.name,
			},
		},
	};
	rekognition.recognizeCelebrities(params, (err, data) => {
		if (err) console.log(err, err.stack);
		// an error occurred
		else res.send({ data: data });
		console.log('celeb', data);
	});
});

app.post('/api/compare', (req, res) => {
	var params = {
		SimilarityThreshold: 90,
		SourceImage: {
			S3Object: {
				Bucket: 'imagerekognition-cloud',
				Name: req.body.name,
			},
		},
		TargetImage: {
			S3Object: {
				Bucket: 'imagerekognition-cloud',
				Name: req.body.img,
			},
		},
	};

	rekognition.compareFaces(params, (err, data) => {
		if (err) console.log(err, err.stack);
		else res.send({ data: data });
		console.log(data);
	});
});

app.listen(5000, () => {
	console.log('Server listening on port 5000!');
});
