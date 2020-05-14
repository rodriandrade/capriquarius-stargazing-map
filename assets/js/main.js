let markersAll = []; //array con todos los markers
let infoWindows = []; //array con todas las infoWindow

//Inicializo el mapa (callback en script google api en index.html)
window.initMap = () => {
    const maimo = { lat: -34.610490, lng: -58.440860 }; //esto es maimo!
    const map = new google.maps.Map(
        document.getElementById('map'),
        {
            zoom: 2, //Zoom
            center: maimo, //Centrado de mapa
            styles: styles, //Estilos de mapa, los agrego en index.html mapaStyles.js
            streetViewControl: false, //Desactivo el street view (chaboncito)
            fullscreenControl: false, //Desactivo el boton de fullscreeen
            mapTypeControlOptions: { //Desactivo los tipos de terreno del mapa (satellite y terrain)
                mapTypeIds: []
            },
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER //ubico los controles de zoom
            }
        });
        //Agrego el zoom máximo y mínimo que se pueden hacer
        map.setOptions({ minZoom: 3, maxZoom: 17 });
    fetchMarkers(map) //Llamammos a la función que trae el json de markers

    //FILTROS
    //Traigo elementos del DOM
    const handleFilterPark = document.querySelector('.park');
    const handleFilterObservatory = document.querySelector('.observatory');
    const handleFilterLights = document.querySelector('.lights');
    const handleFilterReserve = document.querySelector('.reserve');
    const handleFilterRecreational = document.querySelector('.recreational');
    const handleResetButton = document.querySelector('.reset');
    // Dropdown
    const countryFilter = document.querySelector('.countriesSelector');
    const sideNav = document.querySelector('.search-box');
    const openSideNav= document.querySelector('#control');
    const defaultSelectorValue = document.querySelector('#default');

    let panelState = true;

    //Eventos de click de los filtros
    handleFilterPark.addEventListener('click', (e) => {
        e.preventDefault();
        addMarkerFiltered('National Park');
        defaultSelectorValue.selected = true;
    })
    handleFilterObservatory.addEventListener('click', (e) => {
        e.preventDefault();
        addMarkerFiltered('Observatory');
        defaultSelectorValue.selected = true;
    })
    handleFilterLights.addEventListener('click', (e) => {
        e.preventDefault();
        addMarkerFiltered('Northern Lights');
        defaultSelectorValue.selected = true;
    })
    handleFilterReserve.addEventListener('click', (e) => {
        e.preventDefault();
        addMarkerFiltered('Nature Reserve');
        defaultSelectorValue.selected = true;
    })
    handleFilterRecreational.addEventListener('click', (e) => {
        e.preventDefault();
        addMarkerFiltered('Recreational Area');
        defaultSelectorValue.selected = true;
    })
    handleResetButton.addEventListener('click', (e) => {
        e.preventDefault();
        markersAll.forEach(marker=>{
            marker.setMap(map);
        });
        defaultSelectorValue.selected = true;
    })

    // Filtro para los paises
    countryFilter.addEventListener('change', (e) => {
        e.preventDefault();
        console.log(countryFilter.value);
        addMarkerFilteredByCountry(countryFilter.value);
    })

    // Agrega los markers filtrados por país
    const addMarkerFilteredByCountry = (country) => {
        console.log('clicked beer');
        markersAll.forEach((marker) => {
            //console.log(marker)
            marker.setMap(null); //Quita todos los markers del mapa
        })
        const filterByCountry = markersAll.filter((markerItem) => markerItem.country === country)
        filterByCountry.forEach((marker) => {
            marker.setMap(map);
        })
    }

    //Agrego los markers filtrados según filtro (markerType)
    const addMarkerFiltered = (markerType) => {
        console.log('clicked beer');
        markersAll.forEach((marker) => {
            //console.log(marker)
            marker.setMap(null); //Quita todos los markers del mapa
        })
        const markerFiltered = markersAll.filter((markerItem) => markerItem.customInfo === markerType)
        markerFiltered.forEach((marker) => {
            marker.setMap(map);
        })
    }

    // Abrir y cerrar panel
    openSideNav.addEventListener('click', () => {
        if(panelState == true){
            openSideNav.classList.add('moveSideNav');
            sideNav.classList.add('openSideNav');
            panelState = false;
        }else{
            openSideNav.classList.remove('moveSideNav');
            sideNav.classList.remove('openSideNav');
            panelState = true;
        }
    });

}

//Función de asincrónica que trae los markers
const fetchMarkers = async (map) => { 
    try {
        const response = await fetch('https://stargazing-map-api-rest.now.sh/locations');
        const json = await response.json();
        json.forEach(marker => {
            addMarker(map, marker);
        });
        //console.log(markersAll)
    } catch (error) {
        console.log(error);
    }
}

//Función de agregado de un marker
const addMarker = (map, marker) => { 
    //Destructuring de la info del marker
    const { lat, lng, name, country, img, link, description, type } = marker;

    //Armo la infowindow
    const contentString = `
    <div class='thisWindowHook'>
        <div class='imgCont'>
            <img src="${img}">
        </div>
        <div class='infoPlace'>
            <h2>${name}</h2>
            <h3>${type}</h3>
            <a href="${link}" target="_blank">Website</a>
        </div>
    </div>`;
    
    const infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    //Agrega la infoWindow al array
    infoWindows.push(infowindow);

    //Iconos
    const icons = {
        'National Park': '/assets/images/park.png',
        'Observatory': '/assets/images/space.png',
        'Northern Lights': '/assets/images/lights.png',
        'Nature Reserve': '/assets/images/nature.png',
        'Recreational Area': '/assets/images/recreational.png',

    }
    //Agrego el marker
    const markerItem = new google.maps.Marker(
        {
            position: { lat: parseFloat(lat), lng: parseFloat(lng) },
            icon: icons[type],
            map: map,
            customInfo: type,
            country: country,
            animation: google.maps.Animation.DROP
        }
    );
    markerItem.setMap(map);

    //Styling map with jQuery
    
    const styleWindow = () =>{ 
        const infoWindowEdit = $('.thisWindowHook').parent().parent().parent();
            infoWindowEdit.css({
                'background-color': '#00002ad1',
                'color' : '#ffffff',
                'padding': '0',
                'margin' : '0',
                'width' : '370px'
            });
            infoWindowEdit.children().css({
                'width' : '100%',
                'overflow' : 'hidden',
                'padding-bottom' : '10px'
            })
        }
        
        
    //Agrego evento de click en el marker, abre infowindow y cierra los demás
        
    markerItem.addListener('click', function () {
        infoWindows.forEach(infowindow => {
            infowindow.close();
        })
        infowindow.open(map, markerItem);
            styleWindow();
            locationInfo(marker);
        });
            
    //Agrego mi nuevo marker (objeto marker, no json marker, a mi array para filtros)
    markersAll.push(markerItem);
}

//Función que muestra la información del marker en el panel 
const locationInfo = (marker) =>{
    const { lat, lng, name, country, img, link, description, type } = marker;
    const filters = document.querySelector('#filtersMenu');
    const info = document.querySelector('#locationInfo');

    filters.classList.add('hide');
    info.classList.remove('hide');

    info.innerHTML = `
    <div id="back" class="button backBtn">
        <img id="backBtn" class="arrow" src="assets/images/left-arrow-01.svg">
    </div>
    
    <div class='imgCont'>
        <img src="${img}">
    </div>
    <div class='infoPlace'>
        <h2 id="placeTitle">${name}</h2>
        <div id="filterWeather">
            <h3 id="weatherConditionSub" class="subtitle">Weather condition</h3>
            <div id="selectHour">
                <select id="pickHour" onchange="showData(${lat}, ${lng})">
                    <option value="0" selected>00:00hs</option>
                    <option value="1">03:00hs</option>
                    <option value="2">06:00hs</option>
                    <option value="3">09:00hs</option>
                    <option value="4">12:00hs</option>
                    <option value="5">15:00hs</option>
                    <option value="6">18:00hs</option>
                    <option value="7">21:00hs</option>
                </select>
            </div>
        </div>
        <div id="weatherCondition">
            <img src="assets/images/loading.gif" width="70px">
        </div>
        <h3 class="subtitle" id="desc">Description</h3>
        <p id="placeDescription">${description}</p>
        <a href="${link}" target="_blank" id="placeLink">Website</a>
    </div>
   

    `;

    const back = document.querySelector('#back');

    back.addEventListener('click', () => {
        filters.classList.remove('hide');
        info.classList.add('hide');
    });

    showData(lat,lng);
}

// Función que trae los datos de la API openweather
const fetchForecast = async (lat, lng) => {
    const proxyurl = "https://cors-anywhere.herokuapp.com/"; // Proxy que permite que se pueda hacer el fetch, tira error de CORS sin esto. 
    const url = 'http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lng+'&units=metric&appid=0e3498f3359f3fe49fd95d453c4c9a8c';
    const response = await fetch(proxyurl + url);
    const json = await response.json();
    const {list} = json;
    console.log(url);
    return list
}

// Función que muestra los datos de la API openweather
const showData = async (lat, lng) =>{ 
    const weatherData = await fetchForecast(lat, lng);
    const weatherCondition = document.querySelector('#weatherCondition');

    let cloudsAmount = [];
    let transparencySky = [];
    let temperature = [];
    let date = [];
    let time = document.querySelector('#pickHour');
    let timeValue = time.value;
    
    for(i=0;i<8;i++){
        cloudsAmount.push(weatherData[i].clouds.all);
        transparencySky.push(weatherData[i].main.humidity);
        temperature.push(weatherData[i].main.temp);
        date.push(weatherData[i].dt_txt);
    }

    /*
    for(i=0;i<weatherData.length;i++){
        date.push(weatherData[i].dt_txt);
    } */
    
    console.log(date)

    weatherCondition.innerHTML = `
    <div>
        <p class="weatherValue">${cloudsAmount[timeValue]} %</p>
        <p class="weatherData">Cloud Cover</p>
    </div>
    <div>
        <p class="weatherValue">${transparencySky[timeValue]} %</p>
        <p class="weatherData">Humidity</p>
    </div>
    <div>
        <p class="weatherValue">${temperature[timeValue]} C°</p>
        <p class="weatherData">Temperature</p>
    </div>
    `
}

/*

const fetchForecast = async (lng, lat) => {
    const response = await fetch('http://www.7timer.info/bin/astro.php?lon='+lng+'&lat='+lat+'&ac=0&unit=metric&output=json&tzshift=0');
    const json = await response.json();
    const {dataseries} = json;
    return dataseries;
}

const showData = async (lat, lng) =>{
    const weatherData = await fetchForecast(lat, lng);

    const cloudAmount = weatherData.map(({cloudcover}) => cloudcover);
    const transparencySky = weatherData.map(({transparency}) => transparency);
    const seeingSky = weatherData.map(({seeing}) => seeing);

    console.log(cloudAmount)
    console.log(transparencySky)
    console.log(seeingSky)

    const weatherCondition = document.querySelector('#weatherCondition');

    weatherCondition.innerHTML = `
    <div>
        <p class="weatherData">${cloudAmount[0]}</p>
        <p class="weatherData">Cloud Cover</p>
    </div>
    <div>
        <p class="weatherData">${transparencySky[0]}</p>
        <p class="weatherData">Transparency</p>
    </div>
    <div>
        <p class="weatherData">${seeingSky[0]}</p>
        <p class="weatherData">Seeing</p>
    </div>
    `
}

*/
        
//jQuery for dropdown
        
//search-box
    /*
    $('#myDropdown').ddslick({
        data:ddData,
        width:300,
        selectText: "Select your preferred social network",
        imagePosition:"right",
        onSelected: function(selectedData){
            //callback function: do something with selectedData;
        }   
    });
    */
        
//That's all folks!