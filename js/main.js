$(document).ready(function() {

    const classList = document.querySelector('html').classList;
    if (classList.contains('desktop') || classList.contains('television') || device.tablet()) {
        $("body").vegas({
            slides: [
                {src: "/img/slide1.jpg"},
                {src: "/img/slide2.jpg"},
                {src: "/img/slide3.jpg"},
            ],
            animation: 'kenburns',
            transition: 'fade'
        });
    } else {
        document.body.classList.add('body-background');
    }

    if (device.ios()) {
        const itemsClasses = document.querySelector('#items').classList;
        itemsClasses.remove('transparent');
        itemsClasses.add('primary');
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    $(window).scroll(function() {
        const nav = $('.navbar');
        if (nav.offset().top > 50) {
            nav.addClass('show-nav-bg');
        } else {
            nav.removeClass('show-nav-bg');
            nav.addClass('hide-nav-bg');
        }
    });

    window.sr = ScrollReveal();
    sr.reveal('nav', { delay: 600, duration: 1000 });
    sr.reveal('.logo', { delay: 600, duration: 1000 });
    sr.reveal('#title', { delay: 600, duration: 1000 });
    sr.reveal('#description', { delay: 600, duration: 1000 });
    sr.reveal('#umbrella', { duration: 1000 });
    sr.reveal('#battery', { duration: 1000 });
    sr.reveal('#bag', { duration: 1000 });

    $('.navbar-nav > li >a').on('click', function(){
        $('.navbar-collapse').collapse('hide');
    });
});


const baseUrl = "http://localhost:8080";
const iconTemplate = '<i class="fas fa-<<>>"></i>';

function initMap() {
    const DUSSELDORF = {lat: 51.231492, lng: 6.782071};
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: DUSSELDORF
    });
    const geocoder = new google.maps.Geocoder();

    fetch(`${baseUrl}/location`)
        .then(locations => locations.json())
        .then(locations => {
            locations.forEach(location => {
                const position = new google.maps.LatLng(location.lat, location.lng);
                const marker = new google.maps.Marker({position: position, map: map});
                tuneMarker(marker, map, geocoder, location.items);
            })
        })
        .catch(err => console.log(err));
}

function tuneMarker(marker, map, geocoder, items) {
    const infoWindow = new google.maps.InfoWindow();
    geocoder.geocode({'location': marker.position}, (results, status) => {
        if (status === 'OK') {
            infoWindow.setContent(`${results[0].formatted_address}<br>${drawIcons(items)}`);
        }
    });

    marker.addListener('mouseover', () => {
        infoWindow.open(map, marker);
    });

    marker.addListener('mouseout', () => {
        infoWindow.close(map, marker);
    });
}

function drawIcons(items) {
    items = items.map(item => {
        if (item === 'battery') { return 'battery-empty' } else if (item === 'bag') { return 'shopping-bag '} else { return 'umbrella' }
    });
    return items.map(item => iconTemplate.replace('<<>>', item)).join('');
}