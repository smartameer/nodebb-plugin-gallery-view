"use strict";
(function() {
    var modalId = 'gallery-carousel-modal',
        carouselId = 'gallery-carousel',
        laststate = 1;

    $(window).on('action:ajaxify.end', function() {
        setTimeout(initialize, 500);
    });

    $(window).on('action:topic.loaded', function() {
        setTimeout(initialize, 500);
    });

    function initialize () {
        var img = $('[component="post/content"] .img-markdown');
        if (img.length > 0) { 
            img.parents('a').each(function(k){
               $(this).addClass('thumbnail').attr('data-index', img.length - k - 1)
                   .off('click').on('click', function(event) {
                       event.preventDefault();
                       event.stopPropagation();
                       $('#'+modalId).modal('show').on('hidden.bs.modal', function (e) {
                           $('#'+carouselId).carousel('pause');
                       });
                       $('#'+carouselId).carousel(parseInt($(this).attr('data-index')));

                       if (laststate === 0) {
		           $('#'+carouselId).carousel('cycle');
                       }
                       return false;
                   });
            });
            createCarousel(img);
            attachEvents();
        }
    }

    function createCarousel (elem) {
         var imgarr = $('<div></div>').addClass('carousel-inner').attr({role: 'listbox'});
         elem.each(function(key, e) {
             var source = $(e).prop('src');
             var item = $('<div></div>').addClass('item').append(
                 $('<img />').prop('src', source)
             );
             if(key === 0) { item.addClass('active'); }
             imgarr.append(item);
         });
         var carouselPrevControl = $('<a></a>').addClass('left carousel-control').attr({href: '#'+carouselId, role: 'button', 'data-slide': 'prev'}).append(
             $('<span></span>').addClass('glyphicon glyphicon-chevron-left')
         ).off('click').on('click', function(e) {
             e.preventDefault();
             $('#'+carouselId).carousel('prev');
         });
         var carouselNextControl = $('<a></a>').addClass('right carousel-control').attr({href: '#'+carouselId, role: 'button', 'data-slide': 'next'}).append(
             $('<span></span>').addClass('glyphicon glyphicon-chevron-right')
         ).off('click').on('click', function(e) {
             e.preventDefault();
             $('#'+carouselId).carousel('next');
         });
         var carousel = $('<div></div>').addClass('carousel slide').attr({id: carouselId, 'data-interval': 2000, 'data-ride': 'carousel'}).append(imgarr, carouselPrevControl, carouselNextControl);
         var modal = $('<div></div>').addClass('modal fade').prop('tabindex', -1)
             .attr({'role':'dialog', 'id': modalId, 'data-backdrop': 'static', 'data-keyboard': true});
         modal.append(
            $('<div></div>').addClass('modal-dialog modal-lg')
               .append(
                   $('<div></div>').addClass('modal-content').append(
                       $('<div></div>').addClass("modal-header").append(
                          $('<button></button>').addClass('btn btn-default').on('click', function(e) {
                              e.stopPropagation();
                              if(laststate === 0) {
                                  $('#'+carouselId).carousel('pause');
                                  $(this).find('i').addClass('glyphicon-play').removeClass('glyphicon-pause');
                                  laststate = 1;
                              } else {
                                  $('#'+carouselId).carousel('cycle');
                                  $(this).find('i').addClass('glyphicon-pause').removeClass('glyphicon-play');
                                  laststate = 0;
                              }
                          }).append($('<i></i>').addClass('glyphicon glyphicon-play')),
                          $('<button></button>').addClass("close").attr({'data-dismiss':"modal"}).html('<span aria-hidden="true">&times;</span>')
                       ),
                       $('<div></div>').addClass('modal-body').append(carousel)
                   )
               )
         );
         if($('#'+modalId).length > 0) {
             $('#'+modalId).remove();
         }
         $(document.body).append(modal);
    }
})();
