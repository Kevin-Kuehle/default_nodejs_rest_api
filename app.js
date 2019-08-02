const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
	{ id: 1, name: 'course 1' },
	{ id: 2, name: 'course 2' },
	{ id: 3, name: 'course 3' },
];

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
	res.send(courses);
});

app.post('/api/courses', (req, res) => {
	const schema = {
		name: Joi.string().min(3).required(),
	};

	Joi.validate(req.body, schema);

	if (!req.body.name || req.body.name.length < 3) {
		res.status(400).send(' Fehler in der Eingabe!!!');
		return;
	}

	const course = {
		id: courses.length + 1,
		name: req.body.name,
	};
	courses.push(course);
	res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
	const course = courses.find((c) => c.id === parseInt(req.params.id));
	if (!course) res.status(404).send('Der Kurs wurde nicht mit der ID gefunden.');
	res.send(course);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Wir hören auf den Port ${port}`));
