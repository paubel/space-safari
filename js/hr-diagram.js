const chartElement = document.querySelector('#hr-chart');

if (chartElement && window.d3) {
  const d3 = window.d3;
  const chart = d3.select(chartElement);
  const chartWrap = document.querySelector('.hr-chart-wrap');
  const tooltip = document.querySelector('#hr-tooltip');
  const count = document.querySelector('#hr-count');
  const errorMessage = document.querySelector('#hr-error');
  const searchInput = document.querySelector('#hr-search');
  const typeFilter = document.querySelector('#hr-type-filter');
  const sizeMode = document.querySelector('#hr-size-mode');
  const distanceInput = document.querySelector('#hr-distance');
  const distanceValue = document.querySelector('#hr-distance-value');
  const labelsInput = document.querySelector('#hr-labels');
  const resetButton = document.querySelector('#hr-reset');

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

  const distanceStops = [25, 100, 500, 2500, Infinity];
  const temperatureStops = [2500, 3500, 5000, 6000, 7500, 10000, 20000, 40000];
  const temperatureColors = ['#ff6045', '#ff8b55', '#ffc56b', '#fff1b0', '#f1f4ff', '#d5e4ff', '#a9c8ff', '#7aa7ff'];
  const colorScale = d3.scaleLinear().domain(temperatureStops).range(temperatureColors).clamp(true);
  const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
  const integerFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

  let stars = [];
  let filteredStars = [];
  let selectedStar = null;
  let dimensions = { width: 900, height: 690 };

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

  function currentDistanceLimit() {
    return distanceStops[Number(distanceInput.value) - 1];
  }

  function updateDistanceLabel() {
    const limit = currentDistanceLimit();
    distanceValue.textContent = Number.isFinite(limit) ? `${integerFormat.format(limit)} ly` : 'All distances';
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const chosenType = typeFilter.value;
    const limit = currentDistanceLimit();

    filteredStars = stars.filter(star => {
      const nameMatches = !query || (star.name || '').toLowerCase().includes(query);
      const typeMatches = chosenType === 'all' || (star.type || '').toLowerCase() === chosenType;
      const distanceMatches = !Number.isFinite(limit) || !finite(star.distance) || Number(star.distance) <= limit;
      return nameMatches && typeMatches && distanceMatches;
    });

    updateDistanceLabel();
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
    typeFilter.value = 'all';
    sizeMode.value = 'radius';
    distanceInput.value = '5';
    labelsInput.checked = false;
    applyFilters();
    const sun = stars.find(star => /^(sol|sun)$/i.test(star.name || ''));
    if (sun) selectStar(sun);
  }

  [searchInput, typeFilter, distanceInput].forEach(control => control.addEventListener('input', applyFilters));
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
      reset();
      requestAnimationFrame(() => requestAnimationFrame(applyFilters));
    })
    .catch(error => {
      console.error('Could not load the H–R catalogue.', error);
      count.textContent = 'Catalogue unavailable';
      errorMessage.hidden = false;
    });
}
