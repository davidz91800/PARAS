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
    toggleAllBtn: document.getElementById('toggle-all-btn'),
    coords: document.getElementById('coords'),
    forecastDate: document.getElementById('forecast-date'),
    forecastTime: document.getElementById('forecast-time'),
    weatherResults: document.getElementById('weather-results'),
    weatherResultsContent: document.getElementById('weather-results-content'),
    totalPersonnel: document.getElementById('total-personnel'),
    jumperMass: document.getElementById('jumper-mass'),
    totalMassDisplay: document.getElementById('total-mass-display'),
    aircraftType: document.getElementById('aircraft-type'),
    jumperType: document.getElementById('jumper-type'),
    centerSeats: document.getElementById('center-seats'),
    timeOfDay: document.getElementById('time-of-day'),
    securityLevel: document.getElementById('security-level'),
    parachuteType: document.getElementById('parachute-type'),
    exitType: document.getElementById('exit-type'),
    visualRefs: document.getElementById('visual-refs'),
    dzLengthM: document.getElementById('dz-length-m'),
    dzLengthYds: document.getElementById('dz-length-yds'),
    dzWidthM: document.getElementById('dz-width-m'),
    dzWidthYds: document.getElementById('dz-width-yds'),
    dropHeightM: document.getElementById('drop-height-m'),
    dropHeightFt: document.getElementById('drop-height-ft'),
    dzAltitudeM: document.getElementById('dz-altitude-m'),
    dzAltitudeFt: document.getElementById('dz-altitude-ft'),
    dropAxis: document.getElementById('drop-axis'),
    windDir: document.getElementById('wind-direction'),
    windSpeed: document.getElementById('wind-speed'),
    groundWindDir: document.getElementById('ground-wind-direction'),
    groundWindSpeed: document.getElementById('ground-wind-speed'),
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
    globalAlertsContainer: document.getElementById('global-alerts-container'),
    requiredPasses: document.getElementById('required-passes'),
    totalPersonnelRecapPasses: document.getElementById('total-personnel-recap-passes'),
    maxParasPerPass: document.getElementById('max-paras-per-pass'),
    takeoffsBox: document.getElementById('takeoffs-box'),
    requiredTakeoffs: document.getElementById('required-takeoffs'),
    aircraftCapacityRecap: document.getElementById('aircraft-capacity-recap'),
    windLimitBox: document.getElementById('wind-limit-box'),
    windLimitValue: document.getElementById('wind-limit-value'),
    windLimitReason: document.getElementById('wind-limit-reason'),
    parachuteParamsBox: document.getElementById('parachute-params-box'),
    parachuteParamsContent: document.getElementById('parachute-params-content'),
    paramsMassRecapDisplay: document.getElementById('params-mass-recap-display')
};

const METERS_TO_FEET = 3.28084;
const METERS_TO_YARDS = 1.09361;
const KG_TO_LBS = 2.20462;
const MS_TO_KNOTS = 1.94384;

const heightLimits = { EPI: {'1':{min:400,max:700},'2':{min:300,max:Infinity},'3':{min:125,max:Infinity},'4':{min:125,max:Infinity}}, EPC: {'1':{min:400,max:600},'2':{min:300,max:600},'3':{min:200,max:600},'4':{min:200,max:600}} };
const windLimits = { EPC: { '3': { noVisuals: { cross: 5, long: 5 } } } };
const aircraftCapacity = { 'C130J-30': {'NON-EQUIPPED': {'true': 88},'EQUIPPED': {'true': 52, 'false': 52}}, 'KC130J': {'NON-EQUIPPED': {'true': 68},'EQUIPPED': {'true': 48, 'false': 36}} };

const epcWindLimits = {
    '1': { day: { '400': 6 }, night: { '400': 5 } },
    '2': { day: { '300': 8 }, night: { '300': 7 } },
    '3': { day: { '300': 9, '200': 7 }, night: { '300': 7, '200': 6 } },
    '4': { day: { '300': 10, '200': 9, '80': 7 }, night: { '300': 8, '200': 7, '80': 6 } }
};

const epiWindLimits = {
    '1': { day: 6, night: 5 },
    '2': { day: 7, night: 6 },
    '3': { day: 8, night: 6 },
    '4': { day: 12, night: 8 }
};

const parachuteParams = {
    EPI: {
        default: { 
            ftt: [[176.4, 3.5], [286.6, 3.4]],
            vertDist: [[176.4, 164.0], [286.6, 196.9]],
            fallConst: [[176.4, 4.0], [286.6, 4.1]],
            decelQuo: [[176.4, 2.5], [286.6, 2.4]],
            deployedRate: [[176.4, 13.8], [286.6, 17.4]],
            exitTime: [[176.4, 1.0], [286.6, 1.0]],
            stabilizationTime: [[176.4, 6.5], [286.6, 6.5]]
        }
    },
    EPC: {
        doors: {
            ftt: [[176.4, 3.0], [220.5, 3.1], [286.6, 3.2], [363.8, 3.7]],
            vertDist: [[176.4, 131.2], [220.5, 164.0], [286.6, 157.5], [363.8, 150.9]],
            fallConst: [[176.4, 3.6], [220.5, 3.7], [286.6, 3.6], [363.8, 3.7]],
            decelQuo: [[176.4, 2.0], [220.5, 2.0], [286.6, 2.2], [363.8, 2.2]],
            deployedRate: [[176.4, 13.8], [220.5, 16.4], [286.6, 17.4], [363.8, 19.7]],
            exitTime: [[176.4, 1.0], [220.5, 1.0], [286.6, 1.0], [363.8, 1.5]],
            stabilizationTime: [[176.4, 5.6], [220.5, 5.7], [286.6, 5.8], [363.8, 5.9]]
        },
        ramp: {
            ftt: [[220.5, 3.4], [286.6, 3.5], [363.8, 4.1]],
            vertDist: [[220.5, 196.9], [286.6, 190.3], [363.8, 180.4]],
            fallConst: [[220.5, 4.6], [286.6, 4.1], [363.8, 3.4]],
            decelQuo: [[220.5, 2.4], [286.6, 2.5], [363.8, 2.6]],
            deployedRate: [[220.5, 16.4], [286.6, 17.4], [363.8, 19.7]],
            exitTime: [[220.5, 1.0], [286.6, 1.0], [363.8, 1.5]],
            stabilizationTime: [[220.5, 7.0], [286.6, 6.6], [363.8, 6.0]]
        }
    }
};

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
        
        dom.dzAltitudeM.value = Math.round(groundAltitudeM);
        syncDzAltitude('m');
        dom.windDir.value = Math.round(altWindDir);
        dom.windSpeed.value = Math.round(altWindSpeedKt);
        dom.groundWindDir.value = Math.round(groundWindDir);
        dom.groundWindSpeed.value = Math.round(groundWindSpeedKt);
        
        dom.weatherResultsContent.innerHTML = `<p><span>Vent Altitude (appliqué) :</span> <strong>${Math.round(altWindDir)}° / ${Math.round(altWindSpeedKt)} kt</strong></p><p><span>Vent Sol (appliqué) :</span> <strong>${Math.round(groundWindDir)}° / ${Math.round(groundWindSpeedKt)} kt</strong></p><p><span>QNH :</span> <strong>${qnh.toFixed(1)} hPa</strong></p><p><span>Altitude Terrain (appliquée) :</span> <strong>${dom.dzAltitudeM.value} m / ${dom.dzAltitudeFt.value} ft</strong></p>`;
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

function interpolate(targetX, points) {
    points.sort((a, b) => a[0] - b[0]);

    if (targetX <= points[0][0]) {
        return points[0][1];
    }
    if (targetX >= points[points.length - 1][0]) {
        return points[points.length - 1][1];
    }

    for (let i = 0; i < points.length - 1; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[i + 1];

        if (targetX >= x1 && targetX <= x2) {
            const slope = (y2 - y1) / (x2 - x1);
            return y1 + slope * (targetX - x1);
        }
    }
    return points[points.length - 1][1]; 
}

function calculateEpcWindLimit(securityLevel, dropHeight, timeOfDay) {
    const levelLimits = epcWindLimits[securityLevel];
    if (!levelLimits) { return { limit: null, reason: `Niveau de sécurité ${securityLevel} non géré pour le calcul de vent EPC.` }; }
    const timeLimits = levelLimits[timeOfDay];
    if (!timeLimits) { return { limit: null, reason: `Condition ${timeOfDay} non gérée.` }; }
    const heightBrackets = Object.keys(timeLimits).map(Number).sort((a, b) => b - a);
    for (const bracket of heightBrackets) {
        if (dropHeight >= bracket) {
            const limit = timeLimits[bracket];
            if (limit) {
                const reason = `<strong>${timeOfDay === 'day' ? 'Jour' : 'Nuit'}</strong> - Niveau <strong>${securityLevel}</strong> - H: <strong>${Math.round(dropHeight)}m</strong>`;
                return { limit, reason };
            }
            break;
        }
    }
    return { limit: null, reason: `Hauteur de largage (${Math.round(dropHeight)}m) non autorisée pour Niveau ${securityLevel} / ${timeOfDay === 'day' ? 'Jour' : 'Nuit'}.` };
}

function calculateEpiWindLimit(securityLevel, timeOfDay) {
    const levelLimits = epiWindLimits[securityLevel];
    if (!levelLimits) { return { limit: null, reason: `Niveau de sécurité ${securityLevel} non géré pour le calcul de vent EPI.` }; }
    const limit = levelLimits[timeOfDay];
    if (limit) {
        const reason = `<strong>${timeOfDay === 'day' ? 'Jour' : 'Nuit'}</strong> - Niveau <strong>${securityLevel}</strong>`;
        return { limit, reason };
    }
    return { limit: null, reason: `Condition non autorisée pour Niveau ${securityLevel} / ${timeOfDay === 'day' ? 'Jour' : 'Nuit'}.` };
}

function calculate() {
    dom.globalAlertsContainer.innerHTML = '';
    dom.windLimitBox.style.display = 'none';
    dom.parachuteParamsBox.style.display = 'none';

    const L = parseFloat(dom.dzLengthM.value) || 0;
    const l = parseFloat(dom.dzWidthM.value) || 0;
    const H = parseFloat(dom.dropHeightM.value) || 0;
    const Zt = parseFloat(dom.dzAltitudeFt.value) || 0;
    const dropAxis = parseFloat(dom.dropAxis.value) || 0;
    const ias = 125;
    
    const windSpeed = parseFloat(dom.windSpeed.value) || 0; 
    const windDir = parseFloat(dom.windDir.value) || 0;
    const groundWindSpeed = parseFloat(dom.groundWindSpeed.value) || 0;

    const C = parseFloat(dom.cadence.value) || 0;
    const totalPersonnelToDrop = parseFloat(dom.totalPersonnel.value) || 0;
    const aircraft = dom.aircraftType.value;
    const jumpers = dom.jumperType.value;
    const seats = dom.centerSeats.value;
    const securityLevel = dom.securityLevel.value;
    const parachuteType = dom.parachuteType.value;
    const exitType = dom.exitType.value;
    const hasVisualRefs = dom.visualRefs.value === 'true';
    const timeOfDay = dom.timeOfDay.value;
    const jumperMassKg = parseFloat(dom.jumperMass.value) || 0;
    const jumperMassLbs = jumperMassKg * KG_TO_LBS;

    if (hasVisualRefs === false) {
        if (l < (H + 100)) {
            displayAlert(`<strong>ALERTE LARGEUR DZ :</strong> Sans réf. visuelles, la largeur (l) doit être ≥ à la Hauteur + 100m. (Actuel: l=${l.toFixed(0)}m, Requis: ≥${(H + 100).toFixed(0)}m)`, 'alert-warning', dom.globalAlertsContainer);
        }
        if (l < 400) {
             displayAlert(`<strong>ALERTE LARGEUR DZ :</strong> Sans réf. visuelles, la largeur (l) doit être ≥ 400m. (Actuel: l=${l.toFixed(0)}m)`, 'alert-warning', dom.globalAlertsContainer);
        }
    } else {
        if (l < H) {
            displayAlert(`<strong>ALERTE LARGEUR DZ :</strong> Avec réf. visuelles, la largeur (l) doit être ≥ à la Hauteur. (Actuel: l=${l.toFixed(0)}m, Requis: ≥${H.toFixed(0)}m)`, 'alert-warning', dom.globalAlertsContainer);
        }
        if (l < 300) {
            displayAlert(`<strong>ALERTE LARGEUR DZ :</strong> Avec réf. visuelles, la largeur (l) doit être ≥ 300m. (Actuel: l=${l.toFixed(0)}m)`, 'alert-warning', dom.globalAlertsContainer);
        }
    }

    let windLimitResult = null;
    let parachuteLabel = '';

    if (parachuteType === 'EPC') {
        windLimitResult = calculateEpcWindLimit(securityLevel, H, timeOfDay);
        parachuteLabel = 'EPC';
    } else if (parachuteType === 'EPI') {
        windLimitResult = calculateEpiWindLimit(securityLevel, timeOfDay);
        parachuteLabel = 'EPI';
    }
    
    if (windLimitResult && windLimitResult.limit !== null) {
        dom.windLimitBox.style.display = 'block';
        dom.windLimitBox.querySelector('label').textContent = `Limitation Vent (${parachuteLabel})`;

        const limitInKnots = Math.floor(windLimitResult.limit * MS_TO_KNOTS);
        dom.windLimitValue.innerHTML = `${windLimitResult.limit} m/s <small>(${limitInKnots} kt)</small>`;
        dom.windLimitReason.innerHTML = windLimitResult.reason;
        
        const currentGroundWindMs = groundWindSpeed / MS_TO_KNOTS;
        if (currentGroundWindMs > windLimitResult.limit) {
            displayAlert(`<strong>ALERTE VENT:</strong> Le vent au sol (${groundWindSpeed.toFixed(0)} kt) dépasse la limite réglementaire de ${windLimitResult.limit} m/s (${limitInKnots} kt) pour ces conditions.`, 'alert-error', dom.globalAlertsContainer);
        }
    } else if (windLimitResult) {
        displayAlert(windLimitResult.reason, 'alert-error', dom.globalAlertsContainer);
    }
    
    try {
        let paramSet = parachuteParams[parachuteType];
        let params;
        if (parachuteType === 'EPI') {
            params = paramSet.default;
        } else {
            params = paramSet[exitType];
        }

        if (params) {
            const rof = interpolate(jumperMassLbs, params.deployedRate);
            const vd = interpolate(jumperMassLbs, params.vertDist);
            const fallConst = interpolate(jumperMassLbs, params.fallConst);
            const et = interpolate(jumperMassLbs, params.exitTime);
            const dq = interpolate(jumperMassLbs, params.decelQuo);
            const ftt = interpolate(jumperMassLbs, params.ftt);
            
            dom.paramsMassRecapDisplay.innerHTML = `m = ${jumperMassKg.toFixed(0)} kg = ${jumperMassLbs.toFixed(0)} lbs`;

            dom.parachuteParamsContent.innerHTML = `
                <p><strong>ROF</strong> = ${rof.toFixed(1)}</p>
                <p><strong>VD</strong> = ${vd.toFixed(1)} ft/s / <strong>TFC</strong> = ${fallConst.toFixed(1)} s</p>
                <p><strong>ET</strong> = ${et.toFixed(1)} s / <strong>DQ</strong> = ${dq.toFixed(1)} s</p>
                <p><strong>FTT</strong> = ${ftt.toFixed(1)} s</p>
            `;
            dom.parachuteParamsBox.style.display = 'block';
        }
    } catch (error) {
        console.error("Erreur lors de l'interpolation des paramètres de voile:", error);
        dom.parachuteParamsBox.style.display = 'none';
    }

    const totalMassKg = totalPersonnelToDrop * jumperMassKg;
    const totalMassLbs = totalMassKg * KG_TO_LBS;
    dom.totalMassDisplay.innerHTML = `${totalMassKg.toFixed(0)} kg / ${totalMassLbs.toFixed(0)} lbs`;

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
    
    if (groundSpeedKt <= 0) {
        displayAlert("Vitesse sol négative.", 'alert-error', dom.globalAlertsContainer);
        resetAll();
        return;
    }

    const usableLength = hasVisualRefs ? (L - H) : (L - (2 * H));
    dom.dzCapacityFormula.textContent = hasVisualRefs ? 'P = [(L - H) / V] * C + 1' : 'P = [(L - 2H) / V] * C + 1';
    dom.usableLengthDetail.textContent = `${usableLength.toFixed(0)} m`;
    dom.hInFormulaDetail.textContent = `${H.toFixed(0)} m`;
    dom.vInFormulaDetail.textContent = `${V.toFixed(1)} m/s`;
    dom.cInFormulaDetail.textContent = `${C} paras/s`;
    if (usableLength <= 0) {
        displayAlert("Longueur utile (L' = L - nH) est négative.", 'alert-error', dom.globalAlertsContainer);
        resetAll();
        return;
    }
    
    let usableDoors = 2;
    if (parachuteType === 'EPC' && H < 300) { usableDoors = 1; }

    const N_perDoor = (V > 0 && C > 0) ? (usableLength / V) * C + 1 : 0;
    const theoreticalParas = Math.floor(N_perDoor) * usableDoors;
    
    dom.parasPerDoorDetail.textContent = `${Math.floor(N_perDoor)}`;
    dom.theoreticalCapacityDetail.textContent = `${theoreticalParas} paras`;
    const maxCapacity = aircraftCapacity[aircraft]?.[jumpers]?.[seats] || Infinity;
    dom.aircraftCapacityDetail.textContent = `${maxCapacity} paras`;
    const maxParasPerPass = Math.min(theoreticalParas, maxCapacity);
    const validationMessages = validateInputs({ H, securityLevel, parachuteType, longWind, crossWind: windSpeed * Math.sin(angleDifferenceRad), hasVisualRefs });
    validationMessages.forEach(msg => displayAlert(msg.text, msg.type, dom.globalAlertsContainer));
    if (maxParasPerPass < theoreticalParas && maxCapacity !== Infinity) {
        displayAlert(`Capacité limitée par la soute (${maxCapacity} paras).`, 'alert-info', dom.globalAlertsContainer);
    }

    const requiredPasses = (maxParasPerPass > 0 && totalPersonnelToDrop > 0) ? Math.ceil(totalPersonnelToDrop / maxParasPerPass) : 0;
    dom.requiredPasses.textContent = requiredPasses;
    dom.totalPersonnelRecapPasses.textContent = totalPersonnelToDrop;
    dom.maxParasPerPass.textContent = maxParasPerPass;

    const requiredTakeoffs = (maxCapacity > 0 && totalPersonnelToDrop > 0 && maxCapacity !== Infinity) ? Math.ceil(totalPersonnelToDrop / maxCapacity) : 0;
    if (requiredTakeoffs > 1) {
        dom.takeoffsBox.style.display = 'block';
        dom.requiredTakeoffs.textContent = requiredTakeoffs;
        dom.aircraftCapacityRecap.textContent = maxCapacity;
    } else {
        dom.takeoffsBox.style.display = 'none';
    }
}

function syncDropHeight(sourceUnit) {
    if (sourceUnit === 'm') {
        const meters = parseFloat(dom.dropHeightM.value) || 0;
        dom.dropHeightFt.value = (meters * METERS_TO_FEET).toFixed(0);
    } else if (sourceUnit === 'ft') {
        const feet = parseFloat(dom.dropHeightFt.value) || 0;
        dom.dropHeightM.value = (feet / METERS_TO_FEET).toFixed(0);
    }
    calculate();
}

function syncDzLength(sourceUnit) {
    if (sourceUnit === 'm') {
        const meters = parseFloat(dom.dzLengthM.value) || 0;
        dom.dzLengthYds.value = (meters * METERS_TO_YARDS).toFixed(0);
    } else if (sourceUnit === 'yds') {
        const yards = parseFloat(dom.dzLengthYds.value) || 0;
        dom.dzLengthM.value = (yards / METERS_TO_YARDS).toFixed(0);
    }
    calculate();
}

function syncDzWidth(sourceUnit) {
    if (sourceUnit === 'm') {
        const meters = parseFloat(dom.dzWidthM.value) || 0;
        dom.dzWidthYds.value = (meters * METERS_TO_YARDS).toFixed(0);
    } else if (sourceUnit === 'yds') {
        const yards = parseFloat(dom.dzWidthYds.value) || 0;
        dom.dzWidthM.value = (yards / METERS_TO_YARDS).toFixed(0);
    }
    calculate();
}

function syncDzAltitude(sourceUnit) {
    if (sourceUnit === 'm') {
        const meters = parseFloat(dom.dzAltitudeM.value) || 0;
        dom.dzAltitudeFt.value = (meters * METERS_TO_FEET).toFixed(0);
    } else if (sourceUnit === 'ft') {
        const feet = parseFloat(dom.dzAltitudeFt.value) || 0;
        dom.dzAltitudeM.value = (feet / METERS_TO_FEET).toFixed(0);
    }
    calculate();
}

function validateInputs({ H, securityLevel, parachuteType, longWind, crossWind, hasVisualRefs }) {
    const messages = [];
    if (securityLevel === '1') {
        messages.push({ text: `Niveau de sécurité 1 : L'utilisation d'un "Wind Dummy" (para test) est obligatoire.`, type: 'alert-info' });
    }
    if (parachuteType === 'EPC' && H < 300) {
        messages.push({ text: `Hauteur < 300m avec EPC : Le largage n'est possible que par une seule porte. La capacité/passe a été ajustée.`, type: 'alert-warning' });
    }
    const hLimits = heightLimits[parachuteType]?.[securityLevel];
    if (hLimits) {
        if (H < hLimits.min) messages.push({ text: `ALERTE HAUTEUR: ${H}m < min ${hLimits.min}m.`, type: 'alert-error' });
        if (H > hLimits.max) messages.push({ text: `ALERTE HAUTEUR: ${H}m > max ${hLimits.max}m.`, type: 'alert-error' });
    }
    const wLimits = windLimits[parachuteType]?.[securityLevel]?.noVisuals;
    if (wLimits && !hasVisualRefs) {
        const KT_TO_MS = 0.514444;
        if (Math.abs(longWind * KT_TO_MS) > wLimits.long) messages.push({ text: `ALERTE VENT: Comp. Long. > ${wLimits.long} m/s.`, type: 'alert-warning' });
        if (Math.abs(crossWind * KT_TO_MS) > wLimits.cross) messages.push({ text: `ALERTE VENT: Comp. Trav. > ${wLimits.cross} m/s.`, type: 'alert-warning' });
    }
    return messages;
}

function displayAlert(message, type, targetElement) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    let icon;
    if (type === 'alert-info') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15h.506a.75.75 0 0 0 0-1.5h-.506a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" /></svg>`;
    } else {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>`;
    }
    alertDiv.innerHTML = `${icon}<div>${message}</div>`;
    targetElement.appendChild(alertDiv);
}

function resetAll() {
    dom.requiredPasses.textContent = '--';
    dom.maxParasPerPass.textContent = '--';
    dom.takeoffsBox.style.display = 'none';
    dom.requiredTakeoffs.textContent = '--';
}

// Event listeners
dom.toggleAllBtn.addEventListener('click', toggleAllCards);
setupInitialDateTime();
dom.inputs.forEach(input => input.addEventListener('input', calculate));
dom.fetchWeatherBtn.addEventListener('click', fetchWeather);
dom.dropHeightM.addEventListener('input', () => syncDropHeight('m'));
dom.dropHeightFt.addEventListener('input', () => syncDropHeight('ft'));
dom.dzLengthM.addEventListener('input', () => syncDzLength('m'));
dom.dzLengthYds.addEventListener('input', () => syncDzLength('yds'));
dom.dzAltitudeM.addEventListener('input', () => syncDzAltitude('m'));
dom.dzAltitudeFt.addEventListener('input', () => syncDzAltitude('ft'));
dom.dzWidthM.addEventListener('input', () => syncDzWidth('m'));
dom.dzWidthYds.addEventListener('input', () => syncDzWidth('yds'));

// Initialisation
updateToggleButtonText();
syncDropHeight('m');
syncDzLength('m');
syncDzWidth('m');
syncDzAltitude('m');
calculate();