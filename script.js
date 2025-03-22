document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const paletteContainer = document.getElementById('paletteContainer');
    const generateBtn = document.getElementById('generateBtn');
    const saveBtn = document.getElementById('saveBtn');
    const colorCountSelect = document.getElementById('colorCount');
    const paletteTypeSelect = document.getElementById('paletteType');
    const toast = document.getElementById('toast');
    const themeToggle = document.getElementById('themeToggle');

    // Check for dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '🌙';
    }

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        themeToggle.textContent = isDarkMode ? '🌙' : '☀️';
    });

    // Generate initial palette
    generatePalette();

    // Load saved palettes
    loadSavedPalettes();

    // Event listeners
    generateBtn.addEventListener('click', generatePalette);
    saveBtn.addEventListener('click', saveCurrentPalette);

    // Add event listeners for dynamic option changes
    colorCountSelect.addEventListener('change', generatePalette);
    paletteTypeSelect.addEventListener('change', generatePalette);

    // Helper Functions
    function generatePalette() {
        const colorCount = parseInt(colorCountSelect.value);
        const paletteType = paletteTypeSelect.value;

        const colors = generateColors(colorCount, paletteType);
        renderPalette(colors, paletteType, true);
    }

    function generateColors(count, type) {
        let colors = [];

        switch (type) {
            case 'random':
                for (let i = 0; i < count; i++) {
                    colors.push(getRandomColor());
                }
                break;

            case 'monochromatic':
                const baseHue = Math.floor(Math.random() * 360);
                for (let i = 0; i < count; i++) {
                    const saturation = 70 + Math.random() * 30;
                    const lightness = 35 + (i * (50 / count));
                    colors.push(hslToHex(baseHue, saturation, lightness));
                }
                break;

            case 'analogous':
                const hue = Math.floor(Math.random() * 360);
                const hueStep = 30 / (count - 1);
                for (let i = 0; i < count; i++) {
                    const h = (hue + i * hueStep) % 360;
                    const s = 70 + Math.random() * 20;
                    const l = 50 + Math.random() * 10;
                    colors.push(hslToHex(h, s, l));
                }
                break;

            case 'complementary':
                const baseH = Math.floor(Math.random() * 360);
                const complementH = (baseH + 180) % 360;

                // Generate colors around the base hue
                const baseCount = Math.ceil(count / 2);
                for (let i = 0; i < baseCount; i++) {
                    const h = (baseH - 10 + i * 20 / baseCount) % 360;
                    const s = 70 + Math.random() * 20;
                    const l = 50 + Math.random() * 10;
                    colors.push(hslToHex(h, s, l));
                }

                // Generate colors around the complementary hue
                for (let i = 0; i < count - baseCount; i++) {
                    const h = (complementH - 10 + i * 20 / (count - baseCount)) % 360;
                    const s = 70 + Math.random() * 20;
                    const l = 50 + Math.random() * 10;
                    colors.push(hslToHex(h, s, l));
                }
                break;

            case 'triadic':
                const triadicH = Math.floor(Math.random() * 360);
                const colorsPerSection = Math.ceil(count / 3);

                // Generate three color sections 120° apart
                for (let section = 0; section < 3; section++) {
                    const sectionH = (triadicH + section * 120) % 360;
                    const sectionCount = Math.min(colorsPerSection, count - colors.length);

                    for (let i = 0; i < sectionCount; i++) {
                        const h = (sectionH - 10 + i * 20 / sectionCount) % 360;
                        const s = 70 + Math.random() * 20;
                        const l = 50 + Math.random() * 10;
                        colors.push(hslToHex(h, s, l));
                    }
                }
                break;

            case 'tetradic':
                const tetraH = Math.floor(Math.random() * 360);
                const colorsPerQuad = Math.ceil(count / 4);

                // Generate four color sections 90° apart
                for (let quad = 0; quad < 4; quad++) {
                    const quadH = (tetraH + quad * 90) % 360;
                    const quadCount = Math.min(colorsPerQuad, count - colors.length);

                    for (let i = 0; i < quadCount; i++) {
                        const h = (quadH - 5 + i * 10 / quadCount) % 360;
                        const s = 70 + Math.random() * 20;
                        const l = 50 + Math.random() * 10;
                        colors.push(hslToHex(h, s, l));
                    }
                }
                break;

            case 'pastel':
                for (let i = 0; i < count; i++) {
                    const h = Math.floor(Math.random() * 360);
                    const s = 25 + Math.random() * 35;
                    const l = 80 + Math.random() * 10;
                    colors.push(hslToHex(h, s, l));
                }
                break;

            case 'earthy':
                const earthyHues = [25, 40, 60, 90, 120, 150, 180];
                for (let i = 0; i < count; i++) {
                    const h = earthyHues[Math.floor(Math.random() * earthyHues.length)];
                    const s = 30 + Math.random() * 40;
                    const l = 30 + Math.random() * 40;
                    colors.push(hslToHex(h, s, l));
                }
                break;

            case 'gradient':
                const startH = Math.floor(Math.random() * 360);
                const endH = (startH + 30 + Math.floor(Math.random() * 60)) % 360;
                const startS = 70 + Math.random() * 20;
                const endS = 70 + Math.random() * 20;
                const startL = 40 + Math.random() * 20;
                const endL = 40 + Math.random() * 20;

                for (let i = 0; i < count; i++) {
                    const ratio = i / (count - 1);
                    const h = startH + ratio * ((endH - startH + 360) % 360);
                    const s = startS + ratio * (endS - startS);
                    const l = startL + ratio * (endL - startL);
                    colors.push(hslToHex(h, s, l));
                }
                break;
        }

        return colors;
    }

    function renderPalette(colors, type, isCurrent = false, name = '') {
        // Create new palette element
        const palette = document.createElement('div');
        palette.className = 'palette';
        if (isCurrent) {
            palette.id = 'currentPalette';
        } else {
            // Store palette data as a dataset attribute
            palette.dataset.colors = JSON.stringify(colors);
            palette.dataset.type = type;
            if (name) {
                palette.dataset.name = name;
            }
        }

        // Create color blocks
        const paletteColors = document.createElement('div');
        paletteColors.className = 'palette-colors';

        colors.forEach(color => {
            const colorBlock = document.createElement('div');
            colorBlock.className = 'color-block';
            colorBlock.style.backgroundColor = color;
            colorBlock.setAttribute('data-color', color);
            colorBlock.addEventListener('click', copyColorToClipboard);
            paletteColors.appendChild(colorBlock);
        });

        // Create palette info
        const paletteInfo = document.createElement('div');
        paletteInfo.className = 'palette-info';

        // Create palette name section
        const paletteName = document.createElement('div');
        paletteName.className = 'palette-name';

        if (isCurrent) {
            // For current palette, just show type info
            paletteName.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} • ${colors.length} colors`;
        } else {
            // For saved palettes, add editable name
            const nameDisplay = document.createElement('h3');
            nameDisplay.className = 'name-display';
            nameDisplay.textContent = name || `${type.charAt(0).toUpperCase() + type.slice(1)} Palette`;
            nameDisplay.addEventListener('click', function() {
                startEditName(palette);
            });

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.className = 'name-input';
            nameInput.value = nameDisplay.textContent;
            nameInput.style.display = 'none';

            nameInput.addEventListener('blur', function() {
                savePaletteName(palette, this.value);
            });

            nameInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    this.blur();
                }
            });

            paletteName.appendChild(nameDisplay);
            paletteName.appendChild(nameInput);

            // Add edit icon
            const editIcon = document.createElement('button');
            editIcon.className = 'edit-name-btn';
            editIcon.innerHTML = '✏️';
            editIcon.title = 'Edit palette name';
            editIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                startEditName(palette);
            });

            paletteName.appendChild(editIcon);
        }

        // Add palette type info
        const paletteType = document.createElement('div');
        paletteType.className = 'palette-type';
        paletteType.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} • ${colors.length} colors`;

        const paletteActions = document.createElement('div');
        paletteActions.className = 'palette-actions';

        if (!isCurrent) {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deletePalette(palette));
            paletteActions.appendChild(deleteBtn);
        }

        paletteInfo.appendChild(paletteName);
        if (isCurrent) {
            paletteInfo.appendChild(paletteType);
        }
        paletteInfo.appendChild(paletteActions);

        // Create color info
        const colorInfo = document.createElement('div');
        colorInfo.className = 'color-info';

        colors.forEach(color => {
            const colorDetails = document.createElement('div');
            colorDetails.className = 'color-details';

            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            colorSwatch.style.backgroundColor = color;

            const colorHex = document.createElement('span');
            colorHex.textContent = color.toUpperCase();

            colorDetails.appendChild(colorSwatch);
            colorDetails.appendChild(colorHex);
            colorInfo.appendChild(colorDetails);
        });

        // Assemble palette
        palette.appendChild(paletteColors);
        palette.appendChild(paletteInfo);
        palette.appendChild(colorInfo);

        // Add to container
        if (isCurrent) {
            const current = document.getElementById('currentPalette');
            if (current) {
                paletteContainer.replaceChild(palette, current);
            } else {
                paletteContainer.insertBefore(palette, paletteContainer.firstChild);
            }
        } else {
            paletteContainer.appendChild(palette);
        }

        return palette;
    }

    function startEditName(palette) {
        const nameDisplay = palette.querySelector('.name-display');
        const nameInput = palette.querySelector('.name-input');

        if (nameDisplay && nameInput) {
            nameDisplay.style.display = 'none';
            nameInput.style.display = 'block';
            nameInput.focus();
            nameInput.select();
        }
    }

    function savePaletteName(palette, newName) {
        const nameDisplay = palette.querySelector('.name-display');
        const nameInput = palette.querySelector('.name-input');

        // Trim the name and use default if empty
        const trimmedName = newName.trim();
        const finalName = trimmedName || `${palette.dataset.type.charAt(0).toUpperCase() + palette.dataset.type.slice(1)} Palette`;

        // Update display
        nameDisplay.textContent = finalName;
        nameDisplay.style.display = 'block';
        nameInput.style.display = 'none';

        // Update dataset
        palette.dataset.name = finalName;

        // Update in localStorage
        updatePaletteInStorage(palette);

        showToast('Palette renamed!');
    }

    function updatePaletteInStorage(palette) {
        const colors = JSON.parse(palette.dataset.colors);
        const type = palette.dataset.type;
        const name = palette.dataset.name;

        const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');

        // Find this palette in storage
        for (let i = 0; i < savedPalettes.length; i++) {
            if (arraysEqual(savedPalettes[i].colors, colors)) {
                // Update name
                savedPalettes[i].name = name;
                localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
                break;
            }
        }
    }

    function copyColorToClipboard(e) {
        const color = e.target.getAttribute('data-color');
        navigator.clipboard.writeText(color)
            .then(() => showToast(`${color} copied to clipboard!`))
            .catch(err => console.error('Failed to copy color: ', err));
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function isPaletteAlreadySaved(colors) {
        const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');

        // Check if the exact colors already exist in any saved palette
        return savedPalettes.some(palette => {
            // First check if the arrays are the same length
            if (palette.colors.length !== colors.length) return false;

            // Check if every color in the current palette exists in the saved palette
            // and if they appear in the same order
            return arraysEqual(palette.colors, colors);
        });
    }

    function saveCurrentPalette() {
        const currentPalette = document.getElementById('currentPalette');
        if (!currentPalette) return;

        const colorBlocks = currentPalette.querySelectorAll('.color-block');
        const colors = Array.from(colorBlocks).map(block => block.getAttribute('data-color'));

        // Check if this palette already exists
        if (isPaletteAlreadySaved(colors)) {
            showToast('This palette is already saved!');
            return;
        }

        const type = paletteTypeSelect.value;
        // Generate default name based on type
        const name = `${type.charAt(0).toUpperCase() + type.slice(1)} Palette`;

        // Save to local storage
        const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
        savedPalettes.push({
            colors,
            type,
            name,
            timestamp: Date.now()
        });
        localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));

        // Check if empty state exists and remove it
        const emptyState = document.querySelector('.no-palettes');
        if (emptyState) {
            paletteContainer.removeChild(emptyState);
        }

        // Render the saved palette
        renderPalette(colors, type, false, name);

        showToast('Palette saved!');
    }

    function loadSavedPalettes() {
        const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');

        if (savedPalettes.length === 0) {
            showEmptyState();
            return;
        }

        // Sort by newest first
        savedPalettes.sort((a, b) => b.timestamp - a.timestamp);

        savedPalettes.forEach(palette => {
            renderPalette(palette.colors, palette.type, false, palette.name);
        });
    }

    function showEmptyState() {
        // First check if empty state already exists
        if (document.querySelector('.no-palettes')) {
            return;
        }

        const emptyState = document.createElement('div');
        emptyState.className = 'no-palettes';
        emptyState.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <h3>No saved palettes yet</h3>
            <p>Generate a palette you like, then click "Save Current Palette" to add it to your collection.</p>
        `;
        paletteContainer.appendChild(emptyState);
    }

    function deletePalette(paletteElement) {
        // Get colors from the palette
        const colors = JSON.parse(paletteElement.dataset.colors);

        // Remove from DOM
        paletteContainer.removeChild(paletteElement);

        // Remove from localStorage
        const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
        const updatedPalettes = savedPalettes.filter(palette => !arraysEqual(palette.colors, colors));
        localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));

        // Show empty state if needed
        if (updatedPalettes.length === 0 && !document.querySelector('.no-palettes')) {
            showEmptyState();
        }

        showToast('Palette deleted!');
    }

    // Utility functions
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
});