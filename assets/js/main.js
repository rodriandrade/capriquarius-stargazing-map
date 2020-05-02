
let markersAll = []; //array con todos los markers

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
    fetchMarkers(map) //Llamammos a la función que trae el json de markers

    //FILTROS
    //Traigo elementos del DOM
    const handleFilterPark = document.querySelector('.park');
    const handleFilterObservatory = document.querySelector('.observatory');
    const handleFilterLights = document.querySelector('.lights');
    const handleFilterReserve = document.querySelector('.reserve');

    //Eventos de click de los filtros
    handleFilterPark.addEventListener('click', (e) => {
        e.preventDefault();
        addMarkerFiltered('National Park');
    })
    handleFilterObservatory.addEventListener('click', (e) => {
        e.preventDefault();
        addMarkerFiltered('Observatory');
    })
    handleFilterLights.addEventListener('click', (e) => {
        e.preventDefault();
        addMarkerFiltered('Northern Lights');
    })
    handleFilterReserve.addEventListener('click', (e) => {
        e.preventDefault();
        addMarkerFiltered('Nature Reserve');
    })

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
    const { lat, lng, name, description, type } = marker;

    //Armo la infowindow
    const contentString = `
    <div>
    <h2>${name}</h2>
    <h3>${type}</h3>
    <p>${description}</p>
    </div>`;
    const infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    //Iconos
    const icons = {
        'National Park': '/assets/images/park.png',
        'Observatory': '/assets/images/space.png',
        'Northern Lights': '/assets/images/lights.png',
        'Nature Reserve': '/assets/images/nature.png',

    }
    //Agrego el marker
    const markerItem = new google.maps.Marker(
        {
            position: { lat: lat, lng: lng },
            icon: icons[type],
            map: map,
            customInfo: type
        }
    );
    markerItem.setMap(map);
    //Agrego evento de click en el marker, abre infowindow
    markerItem.addListener('click', function () {
        infowindow.open(map, markerItem);
    });
    //Agrego mi nuevo marker (objeto marker, no json marker, a mi array para filtros)
    markersAll.push(markerItem);
}

//That's all folks!