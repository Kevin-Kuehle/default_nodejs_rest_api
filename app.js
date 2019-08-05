const Joi = require('joi');
const express = require('express');
const app = express();
const Fs = require('fs');

app.use(express.json());

// Database Init
let dbFile = 'db.json';
let rawData = Fs.readFileSync(dbFile);
const dbData = JSON.parse(rawData);

const apiURL = '/api';
const port = process.env.PORT || 3000;

// Get default response
app.get('/', (req, res) => {
	res.send('Hello World');
});

// Get all Data
app.get(apiURL, (req, res) => {
	res.send(dbData);
});

// Get single Data
app.get(`${apiURL}/:id`, (req, res) => {
	const data = dbData.find((value) => value.id === parseInt(req.params.id));

	if (!data)
		return res.status(404).send('Der Kurs wurde nicht mit der ID gefunden.');
	res.send(data);
});

// add Data
app.post(apiURL, (req, res) => {
	const { error } = validateRequestData(req.body);

	if (error) return res.status(400).send(error.details[0].message);

	const course = {
		id: dbData.length + 1,
		name: req.body.name,
	};
	dbData.push(course);

	Fs.writeFile(dbFile, JSON.stringify(dbData), function(err) {
		if (err) throw err;
	});

	res.send(course);
});

// change Data
app.put(`${apiURL}/:id`, (req, res) => {
	const data = dbData.find((c) => c.id === parseInt(req.params.id));

	if (!data)
		return res.status(404).send('Der Kurs wurde nicht mit der ID gefunden.');

	const { error } = validateRequestData(req.body);

	if (error) return res.status(400).send(error.details[0].message);

	console.log(typeof data);

	// TODO: Daten in die db.json schreiben.

	data.name = req.body.name;
	res.send(data);
});

// delete Data
app.delete(`${apiURL}/:id`, (req, res) => {
	const course = dbData.find((c) => c.id === parseInt(req.params.id));
	if (!course)
		return res.status(404).send('Der Kurs wurde nicht mit der ID gefunden.');

	const index = dbData.indexOf(dbData);
	dbData.splice(index, 1);
	res.send(course);
});

function validateRequestData(data) {
	const schema = {
		name: Joi.string().min(3).required(),
	};

	return Joi.validate(data, schema);
}

// PORT
app.listen(port, () => console.log(`Wir hören auf den Port ${port}`));
