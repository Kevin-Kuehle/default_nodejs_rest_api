const Joi = require('joi');
const express = require('express');
const app = express();
const Fs = require('fs');

app.use(express.json());

// Database Settings
let dbPath = 'db.json';
let rawData = Fs.readFileSync(dbPath);
let parseData = JSON.parse(rawData);

// Port Setting
const port = process.env.PORT || 3000;

// API URL
const apiPath = '/api/courses';
console.log(parseData);

// rename "dbData" global to like your thinks
const dbData = parseData;

// Get default response
app.get('/', (req, res) => {
	res.send('Hello World');
});

// Get Data
app.get(apiPath, (req, res) => {
	res.send(dbData);
});

// Change Data
app.post(apiPath, (req, res) => {
	const { error } = validateRequestData(req.body);

	if (error) return res.status(400).send(error.details[0].message);

	const course = {
		id: dbData.length + 1,
		name: req.body.name,
	};
	dbData.push(course);
	res.send(course);
});

// change Data
app.put(`${apiPath}/:id`, (req, res) => {
	const course = dbData.find((c) => c.id === parseInt(req.params.id));

	if (!course)
		return res.status(404).send('Der Kurs wurde nicht mit der ID gefunden.');

	const { error } = validateRequestData(req.body);

	if (error) return res.status(400).send(error.details[0].message);

	course.name = req.body.name;
	res.send(course);
});

// Get single Data
app.get(`${apiPath}/:id`, (req, res) => {
	const course = dbData.find((c) => c.id === parseInt(req.params.id));
	if (!course)
		return res.status(404).send('Der Kurs wurde nicht mit der ID gefunden.');
	res.send(course);
});

// delete Data
app.delete(`${apiPath}/:id`, (req, res) => {
	const course = dbData.find((c) => c.id === parseInt(req.params.id));
	if (!course)
		return res.status(404).send('Der Kurs wurde nicht mit der ID gefunden.');

	const index = dbData.indexOf(dbData);
	dbData.splice(index, 1);
	res.send(course);
});

function validateRequestData(course) {
	const schema = {
		name: Joi.string().min(3).required(),
	};

	return Joi.validate(course, schema);
}

// PORT
app.listen(port, () => console.log(`Wir hören auf den Port ${port}`));
