module.exports = {
	checkMatricula: function (matricula) {
		if (matricula.length != 7) {
			console.log("Largo incorrecto");
			return false;
		} else {
			//obtener un substring con las 3 primeras letras de la matricula
			let matriculaText = matricula.substring(0, 3);

			//iterar sobre la matricula con el fin de chequear que isalpha retorne 1 en cada caracter, esto significa que el caracter es una letra y está en mayus
			for (var i = 0; i < matriculaText.length; i++) {
				if (!matriculaText.charAt(i).match(/[A-Z]/i)) {
					return false;
				}
			}

			//obtener un substring con los 4 ultimos digitos de la matricula
			let matriculaNum = matricula.substring(3, 7);

			for (var i = 0; i < matriculaNum.length; i++) {
				if (!matriculaNum.charAt(i).match(/[0-9]/i)) {
					return false;
				} else {
					return true;
				}
			}
		}
	},
};
