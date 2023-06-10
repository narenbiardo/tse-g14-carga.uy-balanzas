const express = require("express");
const app = express();
const port = 3001;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkMatricula = require("./src/checkMatricula.js");

// Secret key for signing JWTs
const secretKey = "mySecretKey";

// Registered users mocked
var users = [
	{
		username: "cargauy",
		password: "pass1234",
	},
];

// Mocked balanzas
var balanzas = [
	{
		id: 1,
		direccion: "KM 100",
		usuario: "cargauy",
	},
	{
		id: 2,
		direccion: "KM 200",
		usuario: "cargauy",
	},
	{
		id: 3,
		direccion: "KM 300",
		usuario: "cargauy",
	},
];

// Mocked pesajes
var pesajes = [
	{
		id: 1,
		vehiculoId: 1,
		balanzaId: 1,
		fecha: new Date(2023, 5, 1, 10, 30),
	},
	{
		id: 2,
		vehiculoId: 2,
		balanzaId: 2,
		fecha: new Date(2023, 5, 1, 11, 15),
	},
	{
		id: 3,
		vehiculoId: 1,
		balanzaId: 3,
		fecha: new Date(2023, 5, 2, 14, 45),
	},
];

app.use(express.json());

// Login route
app.post("/login", (req, res) => {
	const { username, password } = req.body;

	// Find the user in the registered users list
	const user = users.find(user => user.username === username);
	if (!user) {
		return res.status(401).json({ message: "Invalid username or password" });
	}

	// Verify the password
	/*
	if (!bcrypt.compareSync(password, user.password)) {
		return res.status(401).json({ message: "Invalid username or password" });
	}
	*/

	if (password !== user.password) {
		return res.status(401).json({ message: "Invalid username or password" });
	}

	// Generate a valid JWT token valid for 1 hour
	const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

	// Return the token to the client
	res.json({ token });
});

// Middleware to verify the JWT token for protected routes
function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Missing token" });
	}

	jwt.verify(token, secretKey, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid token" });
		}

		req.user = user;
		next();
	});
}

app.get("/checkMatricula", authenticateToken, (req, res) => {
	if (checkMatricula.checkMatricula(req.query.matricula.toString()) == true) {
		res.json({ verified: true, message: "The license plate is valid" });
	} else {
		res.send({
			verified: false,
			message: "The license plate does not meet Mercosur standards",
		});
	}
});

// Get pesajes for a specific vehicle between two dates
app.get("/pesajesVehiculo", authenticateToken, (req, res) => {
	const { vehiculoId, fechaInicio, fechaFin } = req.body;

	const parsedFechaInicio = new Date(fechaInicio);
	const parsedFechaFin = new Date(fechaFin);

	if (isNaN(parsedFechaInicio) || isNaN(parsedFechaFin)) {
		return res.status(400).json({ message: "Invalid date format" });
	}

	const filteredPesajes = pesajes.filter(pesaje => {
		return (
			pesaje.vehiculoId === parseInt(vehiculoId) &&
			pesaje.fecha >= parsedFechaInicio &&
			pesaje.fecha <= parsedFechaFin
		);
	});

	const result = filteredPesajes.map(pesaje => {
		const balanza = balanzas.find(balanza => balanza.id === pesaje.balanzaId);
		return {
			balanzaId: balanza.id,
			direccion: balanza.direccion,
			peso: pesaje.peso,
			fecha: pesaje.fecha,
		};
	});

	res.json(result);
});

app.get("/balanzas", authenticateToken, (req, res) => {
	res.json(balanzas);
});

app.post("/balanza", authenticateToken, (req, res) => {
	const { direccion } = req.body;
	const { username } = req.user; // Obtener el usuario del JWT

	// Generate a new id for the balanza
	const newBalanzaId = balanzas.length + 1;

	// Create the new balanza object
	const newBalanza = {
		id: newBalanzaId,
		direccion,
		usuario: username, // Asignar el usuario del JWT a la balanza
	};

	// Add the new balanza to the list
	balanzas.push(newBalanza);

	res.json(newBalanza);
});

app.put("/balanza/:id", authenticateToken, (req, res) => {
	const balanzaId = parseInt(req.params.id);
	const balanza = balanzas.find(balanza => balanza.id === balanzaId);

	// Verificar si la balanza existe
	if (!balanza) {
		return res.status(404).json({ message: "Balanza not found" });
	}

	// Verificar si el usuario actual es el creador de la balanza
	if (req.user.username !== balanza.usuario) {
		return res.status(403).json({ message: "Access denied" });
	}

	// Actualizar la dirección de la balanza
	balanza.direccion = req.body.direccion;

	res.json({ message: "Balanza updated successfully", balanza });
});

app.delete("/balanzas/:id", authenticateToken, (req, res) => {
	const balanzaId = parseInt(req.params.id);
	const balanza = balanzas.find(balanza => balanza.id === balanzaId);

	// Verificar si la balanza existe
	if (!balanza) {
		return res.status(404).json({ message: "Balanza not found" });
	}

	// Verificar si el usuario actual es el creador de la balanza
	if (req.user.username !== balanza.usuario) {
		return res.status(403).json({ message: "Access denied" });
	}

	// Eliminar el pesaje vinculado a la balanza (si existe)
	pesajes.filter(pesaje => pesaje.balanzaId !== balanzaId);

	// Eliminar la balanza
	balanzas.splice(balanzas.indexOf(balanza), 1);

	res.json({ message: "Balanza deleted successfully" });
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
