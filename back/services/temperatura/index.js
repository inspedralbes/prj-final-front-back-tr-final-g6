// Funció per simular la lectura de la temperatura en graus Kelvin
function getTemperatureInKelvin() {
    // Simulació d'un valor de temperatura en graus Kelvin
    return (Math.random() * 100 + 273.15).toFixed(2);
}

// Registrar la temperatura cada 10 segons
function logTemperature() {
    const temperature = getTemperatureInKelvin();
    console.log(`La temperatura actual és de ${temperature} K`);
}

// Configurar la funció cada 10 segons
setInterval(logTemperature, 1000);