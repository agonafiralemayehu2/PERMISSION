let cols, rows;
let scl = 40;
let w = 2000;
let h = 1600;
let flying = 0;
let terrain = [];
let backgroundColor;
let colorTheme = "heatmap";

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	cols = w / scl;
	rows = h / scl;

	for (let x = 0; x < cols; x++) {
		terrain[x] = [];
		for (let y = 0; y < rows; y++) {
			terrain[x][y] = 0;
		}
	}

	backgroundColor = color(135, 206, 235); // Sky blue in RGB

	// Add event listeners for controls
	document.getElementById("scale").addEventListener("input", updateScale);
	document.getElementById("speed").addEventListener("input", updateSpeed);
	document.getElementById("height").addEventListener("input", updateHeight);
	document
		.getElementById("background-color")
		.addEventListener("input", updateBackgroundColor);
	document
		.getElementById("color-theme")
		.addEventListener("change", updateColorTheme);

	// Add event listener for toggle button
	document
		.getElementById("toggle-controls")
		.addEventListener("click", toggleControls);

	// Set the initial background color input value
	document.getElementById("background-color").value = "#87CEEB";
}

function draw() {
	flying -= parseFloat(document.getElementById("speed").value);
	let yoff = flying;
	for (let y = 0; y < rows; y++) {
		let xoff = 0;
		for (let x = 0; x < cols; x++) {
			terrain[x][y] = map(
				noise(xoff, yoff),
				0,
				1,
				-100,
				parseFloat(document.getElementById("height").value)
			);
			xoff += 0.2;
		}
		yoff += 0.2;
	}

	background(backgroundColor);
	translate(0, 50);
	rotateX(PI / 3);

	translate(-w / 2, -h / 2);
	for (let y = 0; y < rows - 1; y++) {
		beginShape(TRIANGLE_STRIP);
		for (let x = 0; x < cols; x++) {
			let height = terrain[x][y];
			let terrainColor = getTerrainColor(height);
			fill(terrainColor);
			vertex(x * scl, y * scl, height);
			vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
		}
		endShape();
	}
}

function getTerrainColor(height) {
	let normalizedHeight = map(
		height,
		-100,
		parseFloat(document.getElementById("height").value),
		0,
		1
	);

	switch (colorTheme) {
		case "heatmap":
			return getHeatmapColor(normalizedHeight);
		case "rainbow":
			return getRainbowColor(normalizedHeight);
		case "monochrome":
			return getMonochromeColor(normalizedHeight);
		case "red":
			return color(255 * normalizedHeight, 0, 0);
		case "green":
			return color(0, 255 * normalizedHeight, 0);
		case "blue":
			return color(0, 0, 255 * normalizedHeight);
		case "temperature":
			return getTemperatureColor(normalizedHeight);
		case "viridis":
			return getViridisColor(normalizedHeight);
		case "magma":
			return getMagmaColor(normalizedHeight);
		case "heat":
			return getHeatColor(normalizedHeight);
		case "brewer-ygb":
			return getBrewerYGBColor(normalizedHeight);
		default:
			return color(200);
	}
}

function getHeatmapColor(normalizedHeight) {
	let c1 = color(0, 0, 255); // Blue for lowest
	let c2 = color(0, 255, 255); // Cyan
	let c3 = color(0, 255, 0); // Green
	let c4 = color(255, 255, 0); // Yellow
	let c5 = color(255, 0, 0); // Red for highest

	if (normalizedHeight < 0.25) {
		return lerpColor(c1, c2, normalizedHeight * 4);
	} else if (normalizedHeight < 0.5) {
		return lerpColor(c2, c3, (normalizedHeight - 0.25) * 4);
	} else if (normalizedHeight < 0.75) {
		return lerpColor(c3, c4, (normalizedHeight - 0.5) * 4);
	} else {
		return lerpColor(c4, c5, (normalizedHeight - 0.75) * 4);
	}
}

function getRainbowColor(normalizedHeight) {
	return color(normalizedHeight * 360, 100, 100);
}

function getMonochromeColor(normalizedHeight) {
	return color(normalizedHeight * 255);
}

function getTemperatureColor(normalizedHeight) {
	let cold = color(0, 0, 255); // Blue for cold
	let warm = color(255, 0, 0); // Red for warm
	return lerpColor(cold, warm, normalizedHeight);
}

function getViridisColor(normalizedHeight) {
	let c1 = color(68, 1, 84); // Dark purple
	let c2 = color(72, 40, 120); // Purple
	let c3 = color(62, 74, 137); // Blue
	let c4 = color(49, 104, 142); // Light blue
	let c5 = color(38, 130, 142); // Teal
	let c6 = color(31, 158, 137); // Green
	let c7 = color(53, 183, 121); // Light green
	let c8 = color(109, 205, 89); // Yellow-green
	let c9 = color(180, 222, 44); // Yellow
	let c10 = color(253, 231, 37); // Bright yellow

	if (normalizedHeight < 0.1) return lerpColor(c1, c2, normalizedHeight * 10);
	if (normalizedHeight < 0.2)
		return lerpColor(c2, c3, (normalizedHeight - 0.1) * 10);
	if (normalizedHeight < 0.3)
		return lerpColor(c3, c4, (normalizedHeight - 0.2) * 10);
	if (normalizedHeight < 0.4)
		return lerpColor(c4, c5, (normalizedHeight - 0.3) * 10);
	if (normalizedHeight < 0.5)
		return lerpColor(c5, c6, (normalizedHeight - 0.4) * 10);
	if (normalizedHeight < 0.6)
		return lerpColor(c6, c7, (normalizedHeight - 0.5) * 10);
	if (normalizedHeight < 0.7)
		return lerpColor(c7, c8, (normalizedHeight - 0.6) * 10);
	if (normalizedHeight < 0.8)
		return lerpColor(c8, c9, (normalizedHeight - 0.7) * 10);
	return lerpColor(c9, c10, (normalizedHeight - 0.8) * 5);
}

function getMagmaColor(normalizedHeight) {
	let c1 = color(0, 0, 4); // Black
	let c2 = color(40, 0, 41); // Dark purple
	let c3 = color(87, 15, 109); // Purple
	let c4 = color(135, 26, 137); // Magenta
	let c5 = color(184, 55, 121); // Pink
	let c6 = color(231, 104, 93); // Light pink
	let c7 = color(251, 180, 185); // Very light pink

	if (normalizedHeight < 0.16) return lerpColor(c1, c2, normalizedHeight * 6.25);
	if (normalizedHeight < 0.33)
		return lerpColor(c2, c3, (normalizedHeight - 0.16) * 5.88);
	if (normalizedHeight < 0.5)
		return lerpColor(c3, c4, (normalizedHeight - 0.33) * 5.88);
	if (normalizedHeight < 0.66)
		return lerpColor(c4, c5, (normalizedHeight - 0.5) * 6.25);
	if (normalizedHeight < 0.83)
		return lerpColor(c5, c6, (normalizedHeight - 0.66) * 5.88);
	return lerpColor(c6, c7, (normalizedHeight - 0.83) * 5.88);
}

function getHeatColor(normalizedHeight) {
	let c1 = color(0, 0, 0); // Black
	let c2 = color(128, 0, 0); // Dark red
	let c3 = color(255, 0, 0); // Red
	let c4 = color(255, 128, 0); // Orange
	let c5 = color(255, 255, 0); // Yellow
	let c6 = color(255, 255, 255); // White

	if (normalizedHeight < 0.2) return lerpColor(c1, c2, normalizedHeight * 5);
	if (normalizedHeight < 0.4)
		return lerpColor(c2, c3, (normalizedHeight - 0.2) * 5);
	if (normalizedHeight < 0.6)
		return lerpColor(c3, c4, (normalizedHeight - 0.4) * 5);
	if (normalizedHeight < 0.8)
		return lerpColor(c4, c5, (normalizedHeight - 0.6) * 5);
	return lerpColor(c5, c6, (normalizedHeight - 0.8) * 5);
}

function getBrewerYGBColor(normalizedHeight) {
	let c1 = color(8, 29, 88); // Dark blue
	let c2 = color(37, 52, 148); // Blue
	let c3 = color(34, 94, 168); // Light blue
	let c4 = color(29, 145, 192); // Cyan
	let c5 = color(65, 182, 196); // Light cyan
	let c6 = color(127, 205, 187); // Teal
	let c7 = color(199, 233, 180); // Light green
	let c8 = color(237, 248, 177); // Yellow-green
	let c9 = color(255, 255, 217); // Light yellow

	if (normalizedHeight < 0.125) return lerpColor(c1, c2, normalizedHeight * 8);
	if (normalizedHeight < 0.25)
		return lerpColor(c2, c3, (normalizedHeight - 0.125) * 8);
	if (normalizedHeight < 0.375)
		return lerpColor(c3, c4, (normalizedHeight - 0.25) * 8);
	if (normalizedHeight < 0.5)
		return lerpColor(c4, c5, (normalizedHeight - 0.375) * 8);
	if (normalizedHeight < 0.625)
		return lerpColor(c5, c6, (normalizedHeight - 0.5) * 8);
	if (normalizedHeight < 0.75)
		return lerpColor(c6, c7, (normalizedHeight - 0.625) * 8);
	if (normalizedHeight < 0.875)
		return lerpColor(c7, c8, (normalizedHeight - 0.75) * 8);
	return lerpColor(c8, c9, (normalizedHeight - 0.875) * 8);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function updateScale() {
	scl = parseInt(document.getElementById("scale").value);
	cols = w / scl;
	rows = h / scl;
	terrain = [];
	for (let x = 0; x < cols; x++) {
		terrain[x] = [];
		for (let y = 0; y < rows; y++) {
			terrain[x][y] = 0;
		}
	}
}

function updateSpeed() {
	// Speed is updated directly in the draw loop
}

function updateHeight() {
	// Height is updated directly in the draw loop
}

function updateBackgroundColor() {
	backgroundColor = color(document.getElementById("background-color").value);
}

function updateColorTheme() {
	colorTheme = document.getElementById("color-theme").value;
}

function toggleControls() {
	const controls = document.getElementById("controls");
	const toggleButton = document.getElementById("toggle-controls");
	if (controls.style.display === "none" || controls.style.display === "") {
		controls.style.display = "block";
		toggleButton.innerHTML = "☰ Hide Configurations";
	} else {
		controls.style.display = "none";
		toggleButton.innerHTML = "☰ Configurations";
	}
}
