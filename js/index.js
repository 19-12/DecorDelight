
  const brandSwiper = new Swiper('.brandSwiper', {
    slidesPerView: 'auto',
    spaceBetween: 50,
    speed: 3000, // Slow smooth scroll
    freeMode: true,
    freeModeMomentum: false,
    loop: false, // ← Important to prevent jump
    autoplay: {
      delay: 0,
      disableOnInteraction: false
    }
  });

  // Pause on hover
  const swiperContainer = document.querySelector('.brandSwiper');
  swiperContainer.addEventListener('mouseenter', () => brandSwiper.autoplay.stop());
  swiperContainer.addEventListener('mouseleave', () => brandSwiper.autoplay.start());


  new Swiper('.testimonialSwiper', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    effect: 'fade',
    fadeEffect: { crossFade: true },
  });




new Swiper('.card-wrapper', {
    slidesPerView: 3,
    loop: true,
    spaceBetween: 25,

     autoplay: {
        delay: 3000, // 3 seconds between slides
        disableOnInteraction: false, // keeps autoplay even after user interaction
    },

    // Pagination bullets
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // Responsive breakpoints
   breakpoints: {
    0: {
        slidesPerView: 1
    },
    768: {
        slidesPerView: 2
    },
    1024: {
        slidesPerView: 3
    },
 
    }
});




new Swiper('.card-wrapper-new', {
    slidesPerView: 4,
    loop: true,
    spaceBetween: 20,

     autoplay: {
        delay: 3000, // 3 seconds between slides
        disableOnInteraction: false, // keeps autoplay even after user interaction
    },

    // Pagination bullets
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // Responsive breakpoints
   breakpoints: {
    0: {
        slidesPerView: 1
    },
    768: {
        slidesPerView: 2
    },
    844: {
        slidesPerView: 3
    },

    1024: {
        slidesPerView: 4
    },
 
    }
});


  function changeImage(element) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = element.src;
  }



 $('.owl-carousel').owlCarousel({
  loop: true,
  items: 1, // ADD THIS LINE
  margin: 10,
  dots: false,
  nav: true,
  mouseDrag: false,
  autoplay: true,
  animateOut: 'slideOutUp',
  animateIn: 'fadeIn',
  lazyLoad: true,
  responsive: {
    0: { items: 1 },
    500: { items: 1 },
    800: { items: 1 }
  }
});



  window.addEventListener('scroll', function () {
    const nav = document.getElementById('top-nav');
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });


  const tabs = document.querySelectorAll('#productTabs button');
  const products = document.querySelectorAll('.product-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });
    });
  });



function openVideoPopup() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('popupVideo');
  modal.style.display = 'block';
  video.currentTime = 0;
  video.play();
}

function closeVideoPopup() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('popupVideo');
  modal.style.display = 'none';
  video.pause();
}

