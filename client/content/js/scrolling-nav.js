function openDropdown(className) {
  let isOpen = false;
  $('.' + className).children('li').each(function() {
    if ($(this).attr('class')) {
      isOpen = true;
    }
  });

  if (isOpen) {
    $('#' + className).addClass('open');
  } else {
    $('#' + className).removeClass('open');
  }
}

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
  const sections = ['auth', 'users', 'clients', 'campaigns', 'sources', 'records'];
  sections.forEach(openDropdown);
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
  $('a.page-scroll').bind('click', function(event) {
    let $anchor = $(this);
    $('html, body').stop().animate(
      {
        scrollTop: $($anchor.attr('href')).offset().top,
      },
      1500,
      'easeInOutExpo'
    );
    event.preventDefault();
  });
});
