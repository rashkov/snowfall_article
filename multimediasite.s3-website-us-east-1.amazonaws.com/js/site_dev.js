$(document).ready( site_init );

function site_init(){

  // ----------------------------------------------------------
  // If you're not in IE (or IE version is less than 5) then:
  // ie === undefined
  // If you're in IE (>=5) then you can determine which version:
  // ie === 7; // IE7
  // Thus, to detect IE:
  // if (ie) {}
  // And to detect the version:
  // ie === 6 // IE6
  // ie > 7 // IE8, IE9, IE10 ...
  // ie < 9 // Anything less than IE9
  // ----------------------------------------------------------
  var ie = (function(){
      var undef,rv = -1; // Return value assumes failure.
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf('MSIE ');
      var trident = ua.indexOf('Trident/');

      if (msie > 0) {
          // IE 10 or older => return version number
          rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      } else if (trident > 0) {
          // IE 11 (or newer) => return version number
          var rvNum = ua.indexOf('rv:');
          rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
      }

      return ((rv > -1) ? rv : undef);
  }());

  var isMobile = function() {
    return /iPad|iPod|iPhone|Android/.test(navigator.userAgent) || document.location.hash == "#ipad";
  };

  var isPhone = function() {
    return isMobile() && window.innerWidth < 768;
  };

  if (isMobile() || ie <= 8) { // Mobile & IE 8 site
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    $('div#video-section').remove();
    if(!ie){
      $('div#top-image-container').html( $('script#top_image_template').html() );
    }
    $('img#top-image')
      .css('opacity', 1)
      .css('max-width', window.innerWidth)
      .css('height', 'inherit');
    return;
  } else { // Desktop site
    $('body').css('background', 'none repeat scroll 0% 0% rgb(1, 1, 1)');
    $('#video-section').html( $('script#videos_template').html() );
    $('div#top-image-container').html( $('script#top_image_template').html() );
  }

  // Initialize stellar.js parallax effect
  // Activate by adding data-stellar-ratio or data-stellar-background-ratio to
  // HTML markup. http://markdalgleish.com/projects/stellar.js/
  $.stellar();

  // quick an dirty way to calculate the distance from the top of the page to
  // the end of the video section / start of the article.
  var article_offset = $('.article').position().top;

  $(window).on('resize', position_video_container );

  // Waypoint triggers when the selected element hits the top of the screen,
  // plus or minus the offset. It can accept negative offsets. 

  // Transition from video 1 to video 2
  $('.article').waypoint(function( direction ){
    if( direction === "down" ){
      $('.video1').animate({ 'opacity': 0 });
      $('.video2').animate({ 'opacity': 1 });
    }
    else if( direction === "up" ){
      $('.video1').animate({ 'opacity': 1 });
      $('.video2').animate({ 'opacity': 0 });
    }
  }, {offset: article_offset / 2 + 30}); /**
                                          * article offset divided by two is equal to one
                                          * screen, or one slide. Offset by 30 so
                                          * that the slide changes when hitting page down
                                          * keyboard key
                                          **/

  // Transition from videos to article
  $('.article').waypoint(function( direction ){
    var videos = $('.videos'),
        body = $('body'),
        article = $(this);

    if( direction === "down" ){
      videos.animate({'opacity': 0});
      body.animate({backgroundColor: 'white'});
      article.find('img').animate({opacity:1});
    }
    else if( direction === "up" ){
      article.find('img').animate({opacity:0});
      videos.animate({'opacity': 1});
      body.animate({backgroundColor: 'black'}, 150);
    }

  }, {offset: 60});

  // Crawl text to disappear near the top of the screen
  $('.vanish').waypoint({
    handler: function( direction ){
      if( direction === 'down' ){
        $(this).animate({opacity: 0});
      }
      else if( direction === 'up' ){
        $(this).animate({opacity: 1});
      }
    },
    offset: function(){
      var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      return h / 6;
    }
  });

  // Crawl text to appear near the top of the bottom of the screen
  $('.vanish').waypoint({
    handler: function( direction ){
      if( direction === 'down' ){
        $(this).animate({opacity: 1});
      }
      else if( direction === 'up' ){
        $(this).animate({opacity: 0});
      }
    },
    offset: function(){
      var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      return h * 5 / 6;
    }
  });

  position_video_container();

}

function position_video_container(){
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  $('video').each(function( index, video ){
    var video_height = $( video ).height();
    $( video ).css('top', ((h - video_height)/2) + 'px');
  });
}
