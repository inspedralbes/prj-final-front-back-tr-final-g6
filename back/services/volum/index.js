// Funció per simular la lectura del volum en decibels
function getVolumeInDecibels() {
    // Simulació d'un valor de volum en decibels
    return Math.floor(Math.random() * 100);
}

// Funció per registrar el volum cada 10 segons
function logVolume() {
    const volume = getVolumeInDecibels();
    console.log(`El volum actual és de ${volume} dB`);
}

// Configurar l'interval per executar la funció cada 10 segons
setInterval(logVolume, 1000);