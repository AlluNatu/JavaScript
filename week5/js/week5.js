async function load_map() {
    let url = 'https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326';
    const response = await fetch(url)
    const mapJSON = await response.json();


    let urlPositive = 'https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f';
    const responsePositive = await fetch(urlPositive)
    const migrationJSONPositive = await responsePositive.json();

    
    let urlnegative = 'https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e';
    const responsenegative = await fetch(urlnegative)
    const migrationJSONnegative = await responsenegative.json();
    
    initMap(mapJSON, migrationJSONPositive, migrationJSONnegative)
}

const initMap = (data, Positive, Negative) => {
    let map = L.map('map', {
        minZoom: -4,
    })

    let geoJson = L.geoJSON(data, {
        onEachFeature: (feature, layer) => getFeature(feature, layer, Positive, Negative),
        style: (feature) => getStyle(feature, Positive, Negative),
        weight: 2
    }).addTo(map)

    let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: -3,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    map.fitBounds(geoJson.getBounds())
}

const getFeature = (feature, layer, Positive, Negative) => {

    let IDENTIFIRE = "KU"+feature.properties.kunta
    let meow = Positive.dataset.dimension.Tuloalue.category.index[IDENTIFIRE]
    let nengative = Negative.dataset.value[meow]
    let ponsitive = Positive.dataset.value[meow]

    if (!feature.properties.nimi) return;
    const name = feature.properties.nimi

    popup = `
            <b>Municipality:</b> ${name}<br>
            <b>Positive migration:</b> ${ponsitive}<br>
            <b>Negative migration:</b> ${nengative}
        `

    layer.bindTooltip(name)
    layer.bindPopup(popup)
}

const getStyle = (feature, Positive, Negative) => {
    let hue = 0;

    let IDENTIFIRE = "KU"+feature.properties.kunta
    let index = Positive.dataset.dimension.Tuloalue.category.index[IDENTIFIRE]
    let nengative = Negative.dataset.value[index]
    let ponsitive = Positive.dataset.value[index]

    if (nengative > 0 && ponsitive > 0) {
        hue = Math.min((Math.pow(ponsitive / nengative, 3) * 60), 120)
    }

    return {
        color: `hsl(${hue}, 75%, 50%)`
    }
}

load_map()