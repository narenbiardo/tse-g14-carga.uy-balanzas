const express = require("express");
const app = express();
const port = 3000;

const checkMatricula = require("./src/checkMatricula.js");

app.get("/hello", (req, res) => {
	res.send("Hello World!");
});

app.get("/checkMatricula", (req, res) => {
	if (checkMatricula.checkMatricula(req.query.matricula.toString()) == true) {
		res.json({ verified: true, message: "La matrícula es correcta" });
	} else {
		res.send({
			verified: false,
			message: "La matrícula no cumple con los estándares del Mercosur",
		});
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
