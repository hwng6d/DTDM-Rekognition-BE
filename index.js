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
	accessKeyId: 'ASIA6OFSTGH275YLUO6P',
	secretAccessKey: 'EfLZEUHK7iwoTx/+n9qhS9FhF7uf4jwaguquMY5b',
	sessionToken:
		'FwoGZXIvYXdzEGQaDJmkeDBK43KsD8SxbSLPAc/ijfEx9e2HWC0Llxt5Sh07Kj6yB1pyO0LKvylUXoBfhE0LwSW+XHHpMkOG87q+CZcujZuPR1WTOPlCXLsq66FPfXk7ri03V6X8u0A9SI/XaEW4NQQ2C16TcvNu7KEhjsCq2nWIIJONNhPTq3LuZ/fMO363kHa2WniFX4cIRpOCkV+MgS5srJbytJ0lJl1JTRYWW16R0fC8e9IL6Crdc+Xr0Hg64sGd1NxIlzwgyQLEunqsi/scbO2ftycpn4dTI/yHhCy8YTkQIcFAOl3LdCiHxaKNBjItiDYaEDd8Nfb/QutLNQ9Dgq97IZwCtQyuQI3DA6109+qJc/7vSXSrAqVy0mb6',
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
