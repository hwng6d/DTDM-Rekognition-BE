const express = require('express');
const bodyParser = require('body-parser');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

aws.config.update({
	accessKeyId: 'ASIA6OFSTGH2S3QSNGXK',
	secretAccessKey: 'yfYrRFP0QPMFNXPUWzTTgDLd+RInH9IJuCFIXBCe',
	sessionToken:
		'FwoGZXIvYXdzEE8aDAFpDxp9azfwqPYPBSLPAer+ZFWi/JnBhLOPBm/FNW7rxDayglNJp038S5iwPUrkqj94l2i/r+FyJE1lUxIa1ssrV7RfabDESqdZBjkMwdUPs96ABJFlGkmOfUTx6tSxanLWXVNMyCRvfJlIO3KpGMXsk7dka5VgN4iFGxEf1IadMSRms7SQHoAqI8y8sokzg85RuBDN/5j1VD/t78Y9OZq+vgMHHUhcaI6W/9DkObsBAMC7BcCExSDS/R0s7gJ9sLn0H8XIptVOzNZ3Hmcv1NOgmTBIyElFtXq5EQcu6CiV8J2NBjItFg+YgbitbqTa+SqKjjNdyQgxwAN6zq0r5lAIbIo7V+ARO3yvi0bS75JLropE',
	region: 'us-east-1',
	signatureVersion: 'v4',
});

const s3 = new aws.S3();
const upload = multer({
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

app.post('/api/upload', upload.array('file', 1), (req, res) => {
	res.send({ file: req.file });
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
app.post('/api/uploads3', uploads3.array('file', 1), (req, res) => {
	res.send({ file: req.file });
});

const rekognition = new aws.Rekognition();
// rekognition.detectLabels(params, function (err, data) {
//     if(err) console.log(err,err.stack);
//     else console.log(data);
// });
app.post('/api/data', (req, res) => {
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

app.post('/api/text', (req, res) => {
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

app.listen(5000, () => {
	console.log('Server listening on port 5000!');
});
