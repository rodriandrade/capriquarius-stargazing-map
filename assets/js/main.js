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
        const response = await fetch('assets/data/markers.json');
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
    const { lat, lng, name, country, img, link, type } = marker;

    //Armo la infowindow
    const contentString = `
    <div class='thisWindowHook'>
        <div class='imgCont'>
            <img src="${img}">
        </div>
        <div class='infoPlace'>
            <h2>${name}</h2>
            <h3>${type}</h3>
            <a href="${link}" target="_blank">More information</a>
        </div>
        <button>More Information</button>
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
            position: { lat: lat, lng: lng },
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

    const locationInfo = () =>{
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
            <h2>${name}</h2>
            <h3>${type}</h3>
            <a href="${link}" target="_blank">More information</a>
        </div>

        `;

        const back = document.querySelector('#back');

        back.addEventListener('click', () => {
            filters.classList.remove('hide');
            info.classList.add('hide');
        });
    }
        
    //Agrego evento de click en el marker, abre infowindow y cierra los demás
        
    markerItem.addListener('click', function () {
        infoWindows.forEach(infowindow => {
            infowindow.close();
        })
        infowindow.open(map, markerItem);
            styleWindow();
            locationInfo();
        });
            
    //Agrego mi nuevo marker (objeto marker, no json marker, a mi array para filtros)
    markersAll.push(markerItem);
}
        
        
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