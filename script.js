document.addEventListener('DOMContentLoaded', () => {
    // Sélection de tous les éléments du DOM
    const inputs = document.querySelectorAll('#inputs-section input');
    
    // Éléments d'entrée
    const dzLengthEl = document.getElementById('dz-length');
    const dropHeightEl = document.getElementById('drop-height');
    const dzAltitudeEl = document.getElementById('dz-altitude');
    const dropAxisEl = document.getElementById('drop-axis');
    const iasEl = document.getElementById('ias');
    const windDirectionEl = document.getElementById('wind-direction');
    const windSpeedEl = document.getElementById('wind-speed');
    const cadenceEl = document.getElementById('cadence');

    // Éléments de sortie (résultats)
    const totalParasEl = document.getElementById('total-paras');
    const parasPerDoorEl = document.getElementById('paras-per-door');
    const errorMessageEl = document.getElementById('error-message');

    // Éléments de sortie (détails)
    const tasResultEl = document.getElementById('tas-result');
    const windComponentResultEl = document.getElementById('wind-component-result');
    const groundSpeedKtResultEl = document.getElementById('ground-speed-kt-result');
    const groundSpeedMsResultEl = document.getElementById('ground-speed-ms-result');

    // Ajoute un écouteur d'événement sur chaque champ d'entrée
    inputs.forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Fonction de calcul principale
    function calculate() {
        // 1. Récupérer et convertir les valeurs des entrées
        const L = parseFloat(dzLengthEl.value) || 0;       // Longueur DZ (m)
        const H = parseFloat(dropHeightEl.value) || 0;       // Hauteur largage (m)
        const dzAltitude = parseFloat(dzAltitudeEl.value) || 0; // Altitude DZ (ft)
        const dropAxis = parseFloat(dropAxisEl.value) || 0;     // Axe de largage (deg)
        const ias = parseFloat(iasEl.value) || 0;           // Vitesse indiquée (kt)
        const windDir = parseFloat(windDirectionEl.value) || 0; // Direction du vent (deg)
        const windSpeed = parseFloat(windSpeedEl.value) || 0;   // Force du vent (kt)
        const C = parseFloat(cadenceEl.value) || 0;         // Cadence (paras/sec)

        // Réinitialiser les messages d'erreur
        errorMessageEl.textContent = '';

        // 2. Calcul de la Vitesse Vraie (TAS - True Airspeed)
        // Règle de base : TAS augmente de ~2% par 1000 ft d'altitude-densité.
        // On approxime avec l'altitude de largage MSL.
        const dropAltitudeMSL = dzAltitude + (H * 3.28084); // Altitude largage en pieds MSL
        const tas = ias * (1 + 0.02 * (dropAltitudeMSL / 1000));
        
        // 3. Calcul de la composante de vent (face/arrière)
        // La composante de vent est négative pour un vent arrière (tailwind)
        const angleDifference = (windDir - dropAxis) * (Math.PI / 180); // Convertir en radians
        const windComponent = windSpeed * Math.cos(angleDifference); // Vent de face est positif

        // 4. Calcul de la Vitesse Sol (V - Ground Speed)
        const groundSpeedKt = tas - windComponent;
        if (groundSpeedKt <= 0) {
            displayError("Vitesse sol négative ou nulle. Impossible de larguer.");
            return;
        }
        const V = groundSpeedKt * 0.514444; // Conversion kt en m/s

        // 5. Calcul du nombre de parachutistes (N)
        // Vérification de la condition L > H
        if (L <= H) {
            displayError("La longueur de la DZ (L) doit être supérieure à la hauteur de largage (H).");
            return;
        }

        let N = 0;
        if (V > 0 && C > 0) {
            N = ((L - H) / V) * C + 1;
        }
        
        const N_perDoor = Math.floor(N); // On ne peut larguer qu'un para entier
        const totalParas = N_perDoor * 2; // Pour un C-130J à 2 portes

        // 6. Affichage des résultats
        displayResults({
            totalParas,
            N_perDoor,
            tas,
            windComponent,
            groundSpeedKt,
            V
        });
    }

    function displayResults(data) {
        totalParasEl.textContent = data.totalParas;
        parasPerDoorEl.textContent = data.N_perDoor;
        
        tasResultEl.textContent = `${data.tas.toFixed(1)} kt`;
        windComponentResultEl.textContent = `${data.windComponent.toFixed(1)} kt (${data.windComponent > 0 ? 'face' : 'arrière'})`;
        groundSpeedKtResultEl.textContent = `${data.groundSpeedKt.toFixed(1)} kt`;
        groundSpeedMsResultEl.textContent = `${data.V.toFixed(1)} m/s`;
    }

    function displayError(message) {
        // Réinitialiser les affichages
        totalParasEl.textContent = '!!';
        parasPerDoorEl.textContent = '--';
        tasResultEl.textContent = '-- kt';
        windComponentResultEl.textContent = '-- kt';
        groundSpeedKtResultEl.textContent = '-- kt';
        groundSpeedMsResultEl.textContent = '-- m/s';
        
        // Afficher le message d'erreur
        errorMessageEl.textContent = message;
    }
    
    // Lancer un premier calcul au chargement de la page
    calculate();
});