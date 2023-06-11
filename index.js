const express = require("express");
const app = express();
const port = 3001;

const checkMatricula = require("./src/checkMatricula.js");

// Mocked tokens
var tokens = [
	{
		token: "tokencargauy",
		description: "Token for an admin of carga.uy",
	},
];

// Mocked balanzas
var balanzas = [
	{
		id: 1,
		direccion: "KM 100",
		createdBy: "tokencargauy",
	},
	{
		id: 2,
		direccion: "KM 200",
		createdBy: "tokencargauy",
	},
	{
		id: 3,
		direccion: "KM 300",
		createdBy: "tokencargauy",
	},
];

// Mocked pesajes
var pesajes = [
	{
		id: 1,
		vehiculoId: "ABC1234",
		balanzaId: 1,
		fecha: new Date(2023, 5, 1, 10, 30),
		peso: 1000.5,
	},
	{
		id: 2,
		vehiculoId: 2,
		balanzaId: 2,
		fecha: new Date(2023, 5, 1, 11, 15),
		peso: 1500.75,
	},
	{
		id: 3,
		vehiculoId: "ABC1234",
		balanzaId: 3,
		fecha: new Date(2023, 5, 2, 14, 45),
		peso: 800.25,
	},
];

app.use(express.json());

app.get("/checkMatricula", (req, res) => {
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
app.get("/pesajesVehiculo", (req, res) => {
	const { vehiculoId, fechaInicio, fechaFin } = req.body;
	const token = req.headers["token"];

	// Check if the token exists
	const foundToken = tokens.find(t => t.token === token);
	if (!foundToken) {
		return res.status(403).json({ message: "Invalid token" });
	}

	const parsedFechaInicio = new Date(fechaInicio);
	const parsedFechaFin = new Date(fechaFin);

	if (isNaN(parsedFechaInicio) || isNaN(parsedFechaFin)) {
		return res.status(400).json({ message: "Invalid date format" });
	}

	const filteredPesajes = pesajes.filter(pesaje => {
		return (
			pesaje.vehiculoId === vehiculoId &&
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

app.get("/balanzas", (req, res) => {
	const token = req.headers["token"];

	// Check if the token exists
	const foundToken = tokens.find(t => t.token === token);
	if (!foundToken) {
		return res.status(403).json({ message: "Invalid token" });
	}

	res.json(balanzas);
});

app.get("/balanza/:id", (req, res) => {
	const balanzaId = parseInt(req.params.id);
	const token = req.headers["token"];

	// Check if the token exists
	const foundToken = tokens.find(t => t.token === token);
	if (!foundToken) {
		return res.status(403).json({ message: "Invalid token" });
	}

	const balanza = balanzas.find(balanza => balanza.id === balanzaId);
	if (!balanza) {
		return res.status(404).json({ message: "Balanza not found" });
	}

	res.json(balanza);
});

app.post("/balanza", (req, res) => {
	const token = req.headers["token"];

	// Check if the token exists
	const foundToken = tokens.find(t => t.token === token);
	if (!foundToken) {
		return res.status(403).json({ message: "Invalid token" });
	}

	const { direccion } = req.body;

	// Generate a new id for the balanza
	const newBalanzaId = balanzas.length + 1;

	// Create the new balanza object
	const newBalanza = {
		id: newBalanzaId,
		direccion,
		createdBy: foundToken.token, // Assign the token of the authenticated user
	};

	// Add the new balanza to the list
	balanzas.push(newBalanza);

	res.json(newBalanza);
});

app.put("/balanza/:id", (req, res) => {
	const balanzaId = parseInt(req.params.id);
	const token = req.headers["token"];

	// Check if the token exists
	const foundToken = tokens.find(t => t.token === token);
	if (!foundToken) {
		return res.status(403).json({ message: "Invalid token" });
	}

	const balanza = balanzas.find(balanza => balanza.id === balanzaId);
	if (!balanza) {
		return res.status(404).json({ message: "Balanza not found" });
	}

	// Check if the user is the creator of the balanza
	if (foundToken.token !== balanza.createdBy) {
		return res.status(403).json({ message: "Access denied" });
	}

	// Update the balanza
	balanza.direccion = req.body.direccion;

	res.json({ message: "Balanza updated successfully", balanza });
});

app.delete("/balanza/:id", (req, res) => {
	const balanzaId = parseInt(req.params.id);
	const token = req.headers["token"];

	// Check if the token exists
	const foundToken = tokens.find(t => t.token === token);
	if (!foundToken) {
		return res.status(403).json({ message: "Invalid token" });
	}

	const balanzaIndex = balanzas.findIndex(balanza => balanza.id === balanzaId);
	if (balanzaIndex === -1) {
		return res.status(404).json({ message: "Balanza not found" });
	}

	const balanza = balanzas[balanzaIndex];

	// Check if the user is the creator of the balanza
	if (foundToken.token !== balanza.createdBy) {
		return res.status(403).json({ message: "Access denied" });
	}

	// Remove the balanza from the list
	balanzas.splice(balanzaIndex, 1);

	// Remove the pesaje associated with the balanza (if exists)
	pesajes = pesajes.filter(pesaje => pesaje.balanzaId !== balanzaId);

	res.json({ message: "Balanza deleted successfully" });
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
// TEST
