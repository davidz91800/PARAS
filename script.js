// Get all collapsible card headers
const collapsibleCardHeaders = document.querySelectorAll('.card .card-header:not(.no-collapse)');

// Add click event for individual card toggling
collapsibleCardHeaders.forEach(header => {
    header.addEventListener('click', () => {
        header.classList.toggle('collapsed');
        updateToggleButtonText(); // Update button text after a single card is toggled
    });
});

const dom = {
    inputs: document.querySelectorAll('.container input, .container select'),
    fetchWeatherBtn: document.getElementById('fetch-weather-btn'),
    toggleAllBtn: document.getElementById('toggle-all-btn'), // New button
    coords: document.getElementById('coords'),
    forecastDate: document.getElementById('forecast-date'),
    forecastTime: document.getElementById('forecast-time'),
    weatherResults: document.getElementById('weather-results'),
    weatherResultsContent: document.getElementById('weather-results-content'),
    totalPersonnel: document.getElementById('total-personnel'),
    aircraftType: document.getElementById('aircraft-type'),
    jumperType: document.getElementById('jumper-type'),
    centerSeats: document.getElementById('center-seats'),
    securityLevel: document.getElementById('security-level'),
    parachuteType: document.getElementById('parachute-type'),
    visualRefs: document.getElementById('visual-refs'),
    dzLength: document.getElementById('dz-length'),
    dropHeight: document.getElementById('drop-height'),
    dzAltitude: document.getElementById('dz-altitude'),
    dropAxis: document.getElementById('drop-axis'),
    windDir: document.getElementById('wind-direction'),
    windSpeed: document.getElementById('wind-speed'),
    cadence: document.getElementById('cadence'),
    densityAltitudeDetail: document.getElementById('density-altitude-detail'),
    tasDetail: document.getElementById('tas-detail'),
    longWindDetail: document.getElementById('long-wind-detail'),
    groundSpeedDetail: document.getElementById('ground-speed-detail'),
    dzCapacityFormula: document.getElementById('dz-capacity-formula'),
    usableLengthDetail: document.getElementById('usable-length-detail'),
    hInFormulaDetail: document.getElementById('h-in-formula-detail'),
    vInFormulaDetail: document.getElementById('v-in-formula-detail'),
    cInFormulaDetail: document.getElementById('c-in-formula-detail'),
    parasPerDoorDetail: document.getElementById('paras-per-door-detail'),
    theoreticalCapacityDetail: document.getElementById('theoretical-capacity-detail'),
    aircraftCapacityDetail: document.getElementById('aircraft-capacity-detail'),
    validationAlerts: document.getElementById('validation-alerts'),
    validationAlerts2: document.getElementById('validation-alerts-2'),
    requiredPasses: document.getElementById('required-passes'),
    totalPersonnelRecap: document.getElementById('total-personnel-recap'),
    maxParasPerPass: document.getElementById('max-paras-per-pass')
};

const METERS_TO_FEET = 3.28084;
const heightLimits = { EPI: {'1':{min:400,max:700},'2':{min:300,max:Infinity},'3':{min:125,max:Infinity},'4':{min:125,max:Infinity}}, EPC: {'1':{min:400,max:600},'2':{min:300,max:600},'3':{min:200,max:600},'4':{min:200,max:600}} };
const windLimits = { EPC: { '3': { noVisuals: { cross: 5, long: 5 } } } };
const aircraftCapacity = { 'C130J-30': {'NON-EQUIPPED': {'true': 88},'EQUIPPED': {'true': 52, 'false': 52}}, 'KC130J': {'NON-EQUIPPED': {'true': 68},'EQUIPPED': {'true': 48, 'false': 36}} };

function updateToggleButtonText() {
    const isAnyCardOpen = Array.from(collapsibleCardHeaders).some(header => !header.classList.contains('collapsed'));
    dom.toggleAllBtn.textContent = isAnyCardOpen ? 'Tout rétracter' : 'Tout étendre';
}

function toggleAllCards() {
    const shouldCollapse = Array.from(collapsibleCardHeaders).some(header => !header.classList.contains('collapsed'));

    collapsibleCardHeaders.forEach(header => {
        if (shouldCollapse) {
            header.classList.add('collapsed');
        } else {
            header.classList.remove('collapsed');
        }
    });
    updateToggleButtonText();
}


function setupInitialDateTime() {
    const now = new Date();
    dom.forecastDate.value = now.toISOString().split('T')[0];
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    dom.forecastTime.value = `${hours}:${minutes}`;
}

function parseCoords(coordString) {
    const regex = /([NS])\s*(\d{1,2})°\s*(\d{2}\.\d+)\s*([EW])\s*(\d{1,3})°\s*(\d{2}\.\d+)/i;
    const match = coordString.trim().match(regex);
    if (!match) return null;
    let lat = parseFloat(match[2]) + (parseFloat(match[3]) / 60);
    if (match[1].toUpperCase() === 'S') lat = -lat;
    let lon = parseFloat(match[5]) + (parseFloat(match[6]) / 60);
    if (match[4].toUpperCase() === 'W') lon = -lon;
    return { lat, lon };
}

async function fetchWeather() {
    const parsedCoords = parseCoords(dom.coords.value);
    const date = dom.forecastDate.value;
    const time = dom.forecastTime.value;
    if (!parsedCoords) { alert("Format de coordonnées invalide. Utilisez par exemple : N48°51.46 E002°21.11"); return; }
    if (!date || !time) { alert("Veuillez remplir la date et l'heure."); return; }
    const hour = parseInt(time.split(':')[0]);

    dom.fetchWeatherBtn.textContent = "Chargement...";
    dom.fetchWeatherBtn.disabled = true;

    const hourlyParams = "pressure_msl,windspeed_10m,winddirection_10m,windspeed_950hPa,winddirection_950hPa";
    const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${parsedCoords.lat.toFixed(4)}&longitude=${parsedCoords.lon.toFixed(4)}&hourly=${hourlyParams}&start_date=${date}&end_date=${date}&timezone=UTC`;
    
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        if (!response.ok) throw new Error(data.reason || `Erreur réseau: ${response.status}`);

        const timeIndex = data.hourly.time.findIndex(t => new Date(t).getUTCHours() === hour);
        if (timeIndex === -1) throw new Error("Aucune donnée disponible pour cette heure.");

        const KPH_TO_KNOTS = 1 / 1.852;
        const qnh = data.hourly.pressure_msl[timeIndex];
        const groundAltitudeM = data.elevation;
        const groundWindDir = data.hourly.winddirection_10m[timeIndex];
        const groundWindSpeedKt = data.hourly.windspeed_10m[timeIndex] * KPH_TO_KNOTS;
        const altWindDir = data.hourly.winddirection_950hPa[timeIndex];
        const altWindSpeedKt = data.hourly.windspeed_950hPa[timeIndex] * KPH_TO_KNOTS;

        dom.dzAltitude.value = Math.round(groundAltitudeM * METERS_TO_FEET);
        dom.windDir.value = Math.round(altWindDir);
        dom.windSpeed.value = Math.round(altWindSpeedKt);
        
        dom.weatherResultsContent.innerHTML = `
            <p><span>Vent 1000ft (appliqué) :</span> <strong>${Math.round(altWindDir)}° / ${Math.round(altWindSpeedKt)} kt</strong></p>
            <p><span>Vent Sol :</span> <strong>${Math.round(groundWindDir)}° / ${Math.round(groundWindSpeedKt)} kt</strong></p>
            <p><span>QNH :</span> <strong>${qnh.toFixed(1)} hPa</strong></p>
            <p><span>Altitude Terrain (appliquée) :</span> <strong>${Math.round(groundAltitudeM * METERS_TO_FEET)} ft</strong></p>
        `;
        dom.weatherResults.style.display = 'block';
        
        calculate();
    } catch (error) {
        alert(`Erreur Météo : ${error.message}`);
        console.error(error);
        dom.weatherResults.style.display = 'none';
    } finally {
        dom.fetchWeatherBtn.textContent = "Obtenir et Appliquer la Météo";
        dom.fetchWeatherBtn.disabled = false;
    }
}

function calculate() {
    dom.validationAlerts.innerHTML = '';
    if(dom.validationAlerts2) dom.validationAlerts2.innerHTML = '';

    const L = parseFloat(dom.dzLength.value) || 0; const H = parseFloat(dom.dropHeight.value) || 0; const Zt = parseFloat(dom.dzAltitude.value) || 0;
    const dropAxis = parseFloat(dom.dropAxis.value) || 0; const ias = 125;
    const windDir = parseFloat(dom.windDir.value) || 0; const windSpeed = parseFloat(dom.windSpeed.value) || 0;
    const C = parseFloat(dom.cadence.value) || 0; const totalPersonnelToDrop = parseFloat(dom.totalPersonnel.value) || 0;
    const aircraft = dom.aircraftType.value; const jumpers = dom.jumperType.value; const seats = dom.centerSeats.value;
    const securityLevel = dom.securityLevel.value; const parachuteType = dom.parachuteType.value; const hasVisualRefs = dom.visualRefs.value === 'true';

    const H_ft = H * METERS_TO_FEET;
    const dropAltitudeMSL = Zt + H_ft;
    const tas = ias * (1 + 0.02 * (dropAltitudeMSL / 1000));
    const angleDifferenceRad = (windDir - dropAxis) * (Math.PI / 180);
    const longWind = windSpeed * Math.cos(angleDifferenceRad);
    const groundSpeedKt = tas - longWind;
    const V = groundSpeedKt * 0.514444;
    dom.densityAltitudeDetail.textContent = `${dropAltitudeMSL.toFixed(0)} ft`;
    dom.tasDetail.textContent = `${tas.toFixed(1)} kt`;
    dom.longWindDetail.textContent = `${longWind.toFixed(1)} kt (${longWind >= 0 ? 'Face' : 'Arr.'})`;
    dom.groundSpeedDetail.textContent = `${groundSpeedKt.toFixed(1)} kt / ${V.toFixed(1)} m/s`;
    if (groundSpeedKt <= 0) { displayAlert("Vitesse sol négative.", 'alert-error', dom.validationAlerts); resetAll(); return; }

    const usableLength = hasVisualRefs ? (L - H) : (L - (2 * H));
    dom.dzCapacityFormula.textContent = hasVisualRefs ? 'P = [(L - H) / V] * C + 1' : 'P = [(L - 2H) / V] * C + 1';
    dom.usableLengthDetail.textContent = `${usableLength.toFixed(0)} m`;
    dom.hInFormulaDetail.textContent = `${H.toFixed(0)} m`;
    dom.vInFormulaDetail.textContent = `${V.toFixed(1)} m/s`;
    dom.cInFormulaDetail.textContent = `${C} paras/s`;
    if (usableLength <= 0) { displayAlert("Longueur utile (L' = L - nH) est négative.", 'alert-error', dom.validationAlerts); resetAll(); return; }
    const N_perDoor = (V > 0 && C > 0) ? (usableLength / V) * C + 1 : 0;
    const theoreticalParas = Math.floor(N_perDoor) * 2;
    dom.parasPerDoorDetail.textContent = `${Math.floor(N_perDoor)}`;
    
    dom.theoreticalCapacityDetail.textContent = `${theoreticalParas} paras`;
    const maxCapacity = aircraftCapacity[aircraft]?.[jumpers]?.[seats] || Infinity;
    dom.aircraftCapacityDetail.textContent = `${maxCapacity} paras`;
    const maxParasPerPass = Math.min(theoreticalParas, maxCapacity);
    const validationMessages = validateInputs({ H, securityLevel, parachuteType, longWind, crossWind: windSpeed * Math.sin(angleDifferenceRad), hasVisualRefs });
    validationMessages.forEach(msg => displayAlert(msg.text, msg.type, dom.validationAlerts2));
    if (maxParasPerPass < theoreticalParas && maxCapacity !== Infinity) {
        displayAlert(`Capacité limitée par la soute (${maxCapacity} paras).`, 'alert-info', dom.validationAlerts2);
    }

    const requiredPasses = (maxParasPerPass > 0 && totalPersonnelToDrop > 0) ? Math.ceil(totalPersonnelToDrop / maxParasPerPass) : 0;
    dom.requiredPasses.textContent = requiredPasses;
    dom.totalPersonnelRecap.textContent = totalPersonnelToDrop;
    dom.maxParasPerPass.textContent = maxParasPerPass;
}

function validateInputs({ H, securityLevel, parachuteType, longWind, crossWind, hasVisualRefs }) {
    const messages = [];
    const hLimits = heightLimits[parachuteType]?.[securityLevel];
    if (hLimits) {
        if (H < hLimits.min) messages.push({text: `ALERTE HAUTEUR: ${H}m < min ${hLimits.min}m.`, type: 'alert-warning'});
        if (H > hLimits.max) messages.push({text: `ALERTE HAUTEUR: ${H}m > max ${hLimits.max}m.`, type: 'alert-warning'});
    }
    const wLimits = windLimits[parachuteType]?.[securityLevel]?.noVisuals;
    if (wLimits && !hasVisualRefs) {
        const KT_TO_MS = 0.514444;
        if (Math.abs(longWind * KT_TO_MS) > wLimits.long) messages.push({text: `ALERTE VENT: Comp. Long. > ${wLimits.long} m/s.`, type: 'alert-warning'});
        if (Math.abs(crossWind * KT_TO_MS) > wLimits.cross) messages.push({text: `ALERTE VENT: Comp. Trav. > ${wLimits.cross} m/s.`, type: 'alert-warning'});
    }
    return messages;
}

function displayAlert(message, type, targetElement) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.625-1.096 2.13-1.096 2.755 0l5.483 9.626c.626 1.096-.148 2.525-1.378 2.525H4.152c-1.23 0-2.003-1.43-1.377-2.525l5.482-9.626ZM10 14a.75.75 0 01-.75-.75V10.5a.75.75 0 011.5 0v2.75a.75.75 0 01-.75.75zm0 2.5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>`;
    alertDiv.innerHTML = `${icon}<div>${message}</div>`;
    targetElement.appendChild(alertDiv);
}

function resetAll() {
    dom.requiredPasses.textContent = '--';
    dom.maxParasPerPass.textContent = '--';
}

dom.toggleAllBtn.addEventListener('click', toggleAllCards);
setupInitialDateTime();
dom.inputs.forEach(input => input.addEventListener('input', calculate));
dom.fetchWeatherBtn.addEventListener('click', fetchWeather);
updateToggleButtonText();
calculate();