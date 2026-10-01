const chartElement = document.querySelector('#hr-chart');

if (chartElement && window.d3) {
  const d3 = window.d3;
  const chart = d3.select(chartElement);
  const chartWrap = document.querySelector('.hr-chart-wrap');
  const tooltip = document.querySelector('#hr-tooltip');
  const count = document.querySelector('#hr-count');
  const errorMessage = document.querySelector('#hr-error');
  const searchInput = document.querySelector('#hr-search');
  const sizeMode = document.querySelector('#hr-size-mode');
  const labelsInput = document.querySelector('#hr-labels');
  const resetButton = document.querySelector('#hr-reset');
  const advancedPanel = document.querySelector('#hr-advanced-panel');
  const advancedToggle = document.querySelector('#hr-advanced-toggle');
  const advancedStatus = document.querySelector('#hr-advanced-status');
  const typeButtons = [...document.querySelectorAll('#hr-type-chips button')];
  const spectralButtons = [...document.querySelectorAll('#hr-spectral-chips button')];
  const clearTypes = document.querySelector('#hr-clear-types');
  const clearSpectral = document.querySelector('#hr-clear-spectral');
  const selectTypes = document.querySelector('#hr-select-types');
  const selectSpectral = document.querySelector('#hr-select-spectral');
  const constellationSearch = document.querySelector('#hr-constellation-search');
  const constellationList = document.querySelector('#hr-constellation-list');
  const clearConstellations = document.querySelector('#hr-clear-constellations');

  const ranges = {
    temperature: {
      min: document.querySelector('#hr-temp-min'), max: document.querySelector('#hr-temp-max'),
      output: document.querySelector('#hr-temp-output'), defaults: [2500, 40000]
    },
    distance: {
      min: document.querySelector('#hr-distance-min'), max: document.querySelector('#hr-distance-max'),
      output: document.querySelector('#hr-distance-output'), defaults: [0, 4.5]
    },
    magnitude: {
      min: document.querySelector('#hr-mag-min'), max: document.querySelector('#hr-mag-max'),
      output: document.querySelector('#hr-mag-output'), defaults: [-27, 28]
    },
    radius: {
      min: document.querySelector('#hr-radius-min'), max: document.querySelector('#hr-radius-max'),
      output: document.querySelector('#hr-radius-output'), defaults: [-2.25, 3.25]
    }
  };

  const details = {
    name: document.querySelector('#hr-star-name'),
    summary: document.querySelector('#hr-star-summary'),
    type: document.querySelector('#hr-star-type'),
    spectral: document.querySelector('#hr-star-spectral'),
    temperature: document.querySelector('#hr-star-temperature'),
    luminosity: document.querySelector('#hr-star-luminosity'),
    radius: document.querySelector('#hr-star-radius'),
    distance: document.querySelector('#hr-star-distance-detail'),
    constellation: document.querySelector('#hr-star-constellation')
  };

  const temperatureStops = [2500, 3500, 5000, 6000, 7500, 10000, 20000, 40000];
  const temperatureColors = ['#ff6045', '#ff8b55', '#ffc56b', '#fff1b0', '#f1f4ff', '#d5e4ff', '#a9c8ff', '#7aa7ff'];
  const colorScale = d3.scaleLinear().domain(temperatureStops).range(temperatureColors).clamp(true);
  const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
  const integerFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

  let stars = [];
  let filteredStars = [];
  let selectedStar = null;
  let dimensions = { width: 900, height: 690 };
  let constellations = [];
  let activeTypes = new Set(typeButtons.map(button => button.dataset.value));
  let activeSpectral = new Set(spectralButtons.map(button => button.dataset.value));
  let activeConstellations = new Set();

  advancedPanel.open = false;

  function finite(value) {
    return value !== null && value !== '' && Number.isFinite(Number(value));
  }

  function formatScientific(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 'Unknown';
    if (numeric === 0) return '0';
    if (Math.abs(numeric) >= 10000 || Math.abs(numeric) < 0.01) return numeric.toExponential(2);
    return numberFormat.format(numeric);
  }

  function typeLabel(value) {
    if (!value) return 'Unknown';
    return value.replace(/\b\w/g, character => character.toUpperCase());
  }

  function summaryFor(star) {
    const spectral = star.spectralClass ? `${star.spectralClass} ` : '';
    const location = star.constellation ? ` in ${star.constellation}` : '';
    return `${spectral}${typeLabel(star.type).toLowerCase()}${location}.`;
  }

  function selectStar(star) {
    selectedStar = star;
    details.name.textContent = star.name || 'Unnamed star';
    details.summary.textContent = summaryFor(star);
    details.type.textContent = typeLabel(star.type);
    details.spectral.textContent = star.spectralClass || 'Unknown';
    details.temperature.textContent = finite(star.temperature) ? `${integerFormat.format(star.temperature)} K` : 'Unknown';
    details.luminosity.textContent = finite(star.luminosity) ? `${formatScientific(star.luminosity)} L☉` : 'Unknown';
    details.radius.textContent = finite(star.radius) ? `${formatScientific(star.radius)} R☉` : 'Unknown';
    details.distance.textContent = finite(star.distance) ? (Number(star.distance) === 0 ? 'Earth’s star' : `${integerFormat.format(star.distance)} ly`) : 'Unknown';
    details.constellation.textContent = star.constellation || 'Not applicable';
    chart.selectAll('.hr-star').classed('is-selected', datum => datum === star);
  }

  function showTooltip(event, star) {
    tooltip.hidden = false;
    tooltip.innerHTML = `<strong>${star.name}</strong><span>${typeLabel(star.type)} · ${star.spectralClass || 'No spectral class'}</span><br>${integerFormat.format(star.temperature)} K · ${formatScientific(star.luminosity)} L☉`;
    const wrapRect = chartWrap.getBoundingClientRect();
    const left = Math.min(event.clientX - wrapRect.left + 14, wrapRect.width - tooltip.offsetWidth - 12);
    const top = Math.max(10, Math.min(event.clientY - wrapRect.top - tooltip.offsetHeight - 12, wrapRect.height - tooltip.offsetHeight - 10));
    tooltip.style.left = `${Math.max(10, left)}px`;
    tooltip.style.top = `${top}px`;
  }

  function hideTooltip() {
    tooltip.hidden = true;
  }

  function declutterLabels(selection) {
    const occupied = [];
    selection.each(function () {
      const box = this.getBBox();
      const padded = { x: box.x - 3, y: box.y - 2, width: box.width + 6, height: box.height + 4 };
      const overlaps = occupied.some(previous => !(
        padded.x + padded.width < previous.x ||
        padded.x > previous.x + previous.width ||
        padded.y + padded.height < previous.y ||
        padded.y > previous.y + previous.height
      ));
      this.style.display = overlaps ? 'none' : null;
      if (!overlaps) occupied.push(padded);
    });
  }

  function rangeValues(name) {
    const range = ranges[name];
    const first = Number(range.min.value);
    const second = Number(range.max.value);
    return [Math.min(first, second), Math.max(first, second)];
  }

  function isDefaultRange(name) {
    const values = rangeValues(name);
    return values[0] === ranges[name].defaults[0] && values[1] === ranges[name].defaults[1];
  }

  function updateRangeDisplay(name) {
    const range = ranges[name];
    const values = rangeValues(name);
    const domainMin = Number(range.min.min);
    const domainMax = Number(range.min.max);
    const start = ((values[0] - domainMin) / (domainMax - domainMin)) * 100;
    const end = ((values[1] - domainMin) / (domainMax - domainMin)) * 100;
    const wrapper = range.min.closest('.hr-dual-range');
    wrapper.style.setProperty('--range-start', `${start}%`);
    wrapper.style.setProperty('--range-end', `${end}%`);

    if (name === 'temperature') {
      range.output.textContent = `${integerFormat.format(values[0])}–${integerFormat.format(values[1])} K`;
    } else if (name === 'distance') {
      const minimum = values[0] === 0 ? 0 : Math.round(10 ** values[0]);
      const maximum = Math.round(10 ** values[1]);
      range.output.textContent = `${integerFormat.format(minimum)}–${integerFormat.format(maximum)} ly`;
    } else if (name === 'magnitude') {
      range.output.textContent = `${values[0].toFixed(1).replace('-', '−')}–${values[1].toFixed(1).replace('-', '−')}`;
    } else {
      const minimum = 10 ** values[0];
      const maximum = 10 ** values[1];
      range.output.textContent = `${formatScientific(minimum)}–${formatScientific(maximum)} R☉`;
    }
  }

  function updateAdvancedStatus() {
    let activeCount = Object.keys(ranges).filter(name => !isDefaultRange(name)).length;
    if (activeTypes.size !== typeButtons.length) activeCount++;
    if (activeSpectral.size !== spectralButtons.length) activeCount++;
    if (activeConstellations.size) activeCount++;
    advancedStatus.textContent = activeCount
      ? `${activeCount} advanced filter${activeCount === 1 ? '' : 's'} active`
      : 'Optional · currently showing all stars';
  }

  function renderConstellations(query = '') {
    const needle = query.trim().toLowerCase();
    const visible = constellations.filter(item => item.name.toLowerCase().includes(needle));
    constellationList.replaceChildren(...visible.map(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.value = item.name;
      button.setAttribute('aria-pressed', String(activeConstellations.has(item.name)));
      const name = document.createElement('span');
      name.textContent = item.name;
      const total = document.createElement('span');
      total.textContent = item.count;
      button.append(name, total);
      button.addEventListener('click', () => {
        if (activeConstellations.has(item.name)) activeConstellations.delete(item.name);
        else activeConstellations.add(item.name);
        renderConstellations(constellationSearch.value);
        applyFilters();
      });
      return button;
    }));
  }

  function buildConstellations() {
    const counts = d3.rollup(stars.filter(star => star.constellation), values => values.length, star => star.constellation);
    constellations = [...counts].map(([name, total]) => ({ name, count: total }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    renderConstellations();
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const temperature = rangeValues('temperature');
    const distanceLog = rangeValues('distance');
    const magnitude = rangeValues('magnitude');
    const radiusLog = rangeValues('radius');
    const distance = [distanceLog[0] === 0 ? 0 : 10 ** distanceLog[0], 10 ** distanceLog[1]];
    const radius = [10 ** radiusLog[0], 10 ** radiusLog[1]];

    filteredStars = stars.filter(star => {
      const nameMatches = !query || (star.name || '').toLowerCase().includes(query);
      const typeMatches = activeTypes.has((star.type || '').toLowerCase());
      const spectralClass = (star.spectralClass || '').charAt(0).toUpperCase();
      const spectralMatches = activeSpectral.has(spectralClass);
      const constellationMatches = !activeConstellations.size || activeConstellations.has(star.constellation);
      const temperatureMatches = Number(star.temperature) >= temperature[0] && Number(star.temperature) <= temperature[1];
      const distanceMatches = Number(star.distance) >= distance[0] && Number(star.distance) <= distance[1];
      const magnitudeMatches = !finite(star.apparentMagnitude)
        ? isDefaultRange('magnitude')
        : Number(star.apparentMagnitude) >= magnitude[0] && Number(star.apparentMagnitude) <= magnitude[1];
      const radiusMatches = !finite(star.radius)
        ? isDefaultRange('radius')
        : Number(star.radius) >= radius[0] && Number(star.radius) <= radius[1];
      return nameMatches && typeMatches && spectralMatches && constellationMatches && temperatureMatches && distanceMatches && magnitudeMatches && radiusMatches;
    });

    Object.keys(ranges).forEach(updateRangeDisplay);
    updateAdvancedStatus();
    count.textContent = `${filteredStars.length} of ${stars.length} stars shown`;
    draw();

    if (query && filteredStars.length === 1) selectStar(filteredStars[0]);
  }

  function luminosityTick(value) {
    if (value >= 1000000) return `${value / 1000000}M`;
    if (value >= 1000) return `${value / 1000}k`;
    if (value >= 1) return numberFormat.format(value);
    return value.toString();
  }

  function draw() {
    if (!stars.length) return;

    const width = Math.max(320, chartElement.getBoundingClientRect().width || dimensions.width);
    const height = Math.max(520, chartElement.getBoundingClientRect().height || dimensions.height);
    dimensions = { width, height };
    const compact = width < 620;
    const margin = compact
      ? { top: 38, right: 18, bottom: 68, left: 67 }
      : { top: 46, right: 34, bottom: 72, left: 82 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    chart.attr('viewBox', `0 0 ${width} ${height}`);
    chart.selectAll('*:not(title):not(desc)').remove();

    const x = d3.scaleLog().domain([40000, 2500]).range([margin.left, width - margin.right]).clamp(true);
    const y = d3.scaleLog().domain([0.00004, 8000000]).range([height - margin.bottom, margin.top]).clamp(true);
    const radius = d3.scaleSqrt().domain([0.01, 1708]).range([2.6, compact ? 11 : 16]).clamp(true);
    const xTicks = compact ? [30000, 10000, 6000, 4000, 3000] : [40000, 20000, 10000, 7500, 6000, 5000, 4000, 3000, 2500];
    const yTicks = [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000, 100000, 1000000];

    chart.append('rect')
      .attr('class', 'hr-plot-frame')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', innerWidth)
      .attr('height', innerHeight);

    chart.append('g')
      .attr('class', 'hr-grid')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(xTicks).tickSize(-innerHeight).tickFormat(() => ''));

    chart.append('g')
      .attr('class', 'hr-grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickValues(yTicks).tickSize(-innerWidth).tickFormat(() => ''));

    chart.append('g')
      .attr('class', 'hr-axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(xTicks).tickFormat(value => compact && value >= 10000 ? `${value / 1000}k` : integerFormat.format(value)));

    chart.append('g')
      .attr('class', 'hr-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickValues(yTicks).tickFormat(luminosityTick));

    chart.append('text')
      .attr('class', 'hr-axis-title')
      .attr('x', margin.left + innerWidth / 2)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .text('Surface temperature (K) · hotter to cooler →');

    chart.append('text')
      .attr('class', 'hr-axis-title')
      .attr('transform', `translate(20,${margin.top + innerHeight / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text('Luminosity (Sun = 1)');

    const mainSequence = [
      [35000, 500000], [20000, 12000], [10000, 80], [7500, 8], [5800, 1], [4500, 0.13], [3200, 0.004], [2700, 0.0002]
    ];
    chart.append('path')
      .datum(mainSequence)
      .attr('class', 'hr-region-path')
      .attr('d', d3.line().x(point => x(point[0])).y(point => y(point[1])).curve(d3.curveBasis));

    if (!compact) {
      const regions = [
        ['SUPERGIANTS', 14500, 1500000],
        ['GIANTS', 4300, 800],
        ['MAIN SEQUENCE', 7900, 1.6],
        ['WHITE DWARFS', 18000, 0.006]
      ];
      chart.append('g').selectAll('text').data(regions).join('text')
        .attr('class', 'hr-region-label')
        .attr('x', item => x(item[1]))
        .attr('y', item => y(item[2]))
        .attr('text-anchor', 'middle')
        .text(item => item[0]);
    }

    const starLayer = chart.append('g').attr('aria-label', 'Stars');
    const circles = starLayer.selectAll('circle')
      .data(filteredStars, star => star.name)
      .join('circle')
      .attr('class', 'hr-star')
      .classed('is-selected', star => star === selectedStar)
      .attr('cx', star => x(star.temperature))
      .attr('cy', star => y(star.luminosity))
      .attr('r', star => sizeMode.value === 'equal' ? 4.2 : (finite(star.radius) ? radius(Math.max(0.01, star.radius)) : 3.5))
      .attr('fill', star => colorScale(star.temperature))
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', star => `${star.name}, ${typeLabel(star.type)}, ${integerFormat.format(star.temperature)} kelvin`)
      .on('pointerenter pointermove', showTooltip)
      .on('pointerleave', hideTooltip)
      .on('click', (event, star) => selectStar(star))
      .on('focus', (event, star) => selectStar(star))
      .on('keydown', (event, star) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectStar(star);
        }
      });

    circles.append('title').text(star => `${star.name}: ${integerFormat.format(star.temperature)} K, ${formatScientific(star.luminosity)} L☉`);

    const sun = filteredStars.find(star => /^(sol|sun)$/i.test(star.name || ''));
    if (sun) {
      chart.append('circle')
        .attr('class', 'hr-sun-ring')
        .attr('cx', x(sun.temperature))
        .attr('cy', y(sun.luminosity))
        .attr('r', (sizeMode.value === 'equal' ? 4.2 : radius(1)) + 6);
    }

    if (labelsInput.checked) {
      const labelData = [...filteredStars]
        .sort((a, b) => (a.name === selectedStar?.name ? -1 : b.luminosity - a.luminosity));
      const labels = chart.append('g').selectAll('text')
        .data(labelData, star => star.name)
        .join('text')
        .attr('class', 'hr-star-label')
        .attr('x', star => x(star.temperature) + 7)
        .attr('y', star => y(star.luminosity) - 5)
        .text(star => star.name);
      declutterLabels(labels);
    }
  }

  function reset() {
    searchInput.value = '';
    sizeMode.value = 'radius';
    labelsInput.checked = false;
    Object.values(ranges).forEach(range => {
      range.min.value = range.defaults[0];
      range.max.value = range.defaults[1];
    });
    activeTypes = new Set(typeButtons.map(button => button.dataset.value));
    activeSpectral = new Set(spectralButtons.map(button => button.dataset.value));
    activeConstellations.clear();
    typeButtons.forEach(button => button.setAttribute('aria-pressed', 'true'));
    spectralButtons.forEach(button => button.setAttribute('aria-pressed', 'true'));
    constellationSearch.value = '';
    renderConstellations();
    applyFilters();
    const sun = stars.find(star => /^(sol|sun)$/i.test(star.name || ''));
    if (sun) selectStar(sun);
  }

  searchInput.addEventListener('input', applyFilters);
  Object.values(ranges).forEach(range => {
    range.min.addEventListener('input', applyFilters);
    range.max.addEventListener('input', applyFilters);
  });
  typeButtons.forEach(button => button.addEventListener('click', () => {
    const value = button.dataset.value;
    if (activeTypes.has(value)) activeTypes.delete(value);
    else activeTypes.add(value);
    button.setAttribute('aria-pressed', String(activeTypes.has(value)));
    applyFilters();
  }));
  spectralButtons.forEach(button => button.addEventListener('click', () => {
    const value = button.dataset.value;
    if (activeSpectral.has(value)) activeSpectral.delete(value);
    else activeSpectral.add(value);
    button.setAttribute('aria-pressed', String(activeSpectral.has(value)));
    applyFilters();
  }));
  clearTypes.addEventListener('click', () => {
    activeTypes.clear();
    typeButtons.forEach(button => button.setAttribute('aria-pressed', 'false'));
    applyFilters();
  });
  selectTypes.addEventListener('click', () => {
    activeTypes = new Set(typeButtons.map(button => button.dataset.value));
    typeButtons.forEach(button => button.setAttribute('aria-pressed', 'true'));
    applyFilters();
  });
  clearSpectral.addEventListener('click', () => {
    activeSpectral.clear();
    spectralButtons.forEach(button => button.setAttribute('aria-pressed', 'false'));
    applyFilters();
  });
  selectSpectral.addEventListener('click', () => {
    activeSpectral = new Set(spectralButtons.map(button => button.dataset.value));
    spectralButtons.forEach(button => button.setAttribute('aria-pressed', 'true'));
    applyFilters();
  });
  constellationSearch.addEventListener('input', () => renderConstellations(constellationSearch.value));
  clearConstellations.addEventListener('click', () => {
    activeConstellations.clear();
    renderConstellations(constellationSearch.value);
    applyFilters();
  });
  advancedToggle.addEventListener('click', () => {
    advancedPanel.open = !advancedPanel.open;
  });
  advancedPanel.addEventListener('toggle', () => {
    advancedToggle.setAttribute('aria-expanded', String(advancedPanel.open));
    advancedToggle.querySelector('span').textContent = advancedPanel.open ? '↑' : '↓';
  });
  sizeMode.addEventListener('change', draw);
  labelsInput.addEventListener('change', draw);
  resetButton.addEventListener('click', reset);
  window.addEventListener('pageshow', () => {
    requestAnimationFrame(() => {
      if (stars.length) applyFilters();
    });
  });

  const resizeObserver = new ResizeObserver(() => requestAnimationFrame(draw));
  resizeObserver.observe(chartWrap);

  d3.json('data/hr-diagram/stars.json')
    .then(data => {
      stars = data.filter(star => finite(star.temperature) && finite(star.luminosity) && Number(star.temperature) > 0 && Number(star.luminosity) > 0);
      buildConstellations();
      reset();
      requestAnimationFrame(() => requestAnimationFrame(applyFilters));
    })
    .catch(error => {
      console.error('Could not load the H–R catalogue.', error);
      count.textContent = 'Catalogue unavailable';
      errorMessage.hidden = false;
    });
}
