window.HELP_IMPROVE_VIDEOJS = false;

var IMAGES_BASE = "./static/images/";
var NUM_SLIDE_FRAMES = {
  'reconstruction': 25,
  'mosaic': 20,
  'nexrad': 20,
  'gifs': 24,
}

var images = {
  'reconstruction': [],
  'mosaic': [],
  'nexrad': [],
  'gifs': [],
}

function preloadImages() {
  Object.keys(images).forEach((key) => {
    for (var i = 0; i < NUM_SLIDE_FRAMES[key]; i++) {
      if (key === 'gifs') {
        var path = IMAGES_BASE+ key + '/result' + String(i).padStart(2, '0') + '.gif';
      } else {
        var path = IMAGES_BASE+ key + '/frame' + String(i).padStart(2, '0') + '.jpg';
      }
      images[key][i] = new Image();
      images[key][i].src = path;
    }

      const typeInterval = setInterval(() => {
          const loaded = images[key].every(img => img.complete);
          if (loaded) {
              console.log(`${key} 加载完成：`, true);
              clearInterval(typeInterval);
              document.getElementById(`${key}-image-wrapper`).classList.remove('loading');
              document.getElementById(`${key}-image-wrapper`).classList.add('loaded');
          }
      }, 1000);
  })
}

function setSliderImage(i, type) {
  var image = images[type][i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  var id = '#'+type+'-image-wrapper';
  $(id).empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadImages();

    Object.keys(images).forEach((key) => {
      var id = '#slider-'+key;
      $(id).on('input', function(event) {
        setSliderImage(this.value, key);
      });
      setSliderImage(key === 'gifs'?7:0, key);
      $(id).prop('max', NUM_SLIDE_FRAMES[key] - 1);
    })

    bulmaSlider.attach();

})
