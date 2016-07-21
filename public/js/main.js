"use strict";
(function() {
    var modalId = '#gallery-carousel-modal',
        carouselId = '#gallery-carousel';

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
                       $(modalId).modal('show').on('hidden.bs.modal', function (e) {
                           $(carouselId).carousel('pause');
                       });
                       $(carouselId).carousel(parseInt($(this).attr('data-index')));
                       $(carouselId).carousel('cycle');
                       return false;
                   });
            });
            createCarousel(img);
            attachEvents();
        }
    }

    function createCarousel (elem) {
         var imgarr = $('<div></div>').addClass('carousel-inner').attr({id: 'gallery-carousel', role: 'listbox', 'data-interval': 2000, 'data-ride': 'carousel'});
         elem.each(function(key, e) {
             var source = $(e).prop('src');
             var item = $('<div></div>').addClass('item').append(
                 $('<img />').prop('src', source)
             );
             if(key === 0) { item.addClass('active'); }
             imgarr.append(item);
         });

         var carousel = $('<div></div>').addClass('modal fade').prop('tabindex', -1)
             .attr({'role':'dialog', 'id': 'gallery-carousel-modal', 'data-backdrop': 'static', 'data-keyboard': true});
         carousel.append(
            $('<div></div>').addClass('modal-dialog modal-lg')
               .append(
                   $('<div></div>').addClass('modal-content').append(
                       $('<div></div>').addClass("modal-header").append($('<button></button>').addClass("close").attr({'data-dismiss':"modal"}).html('<span aria-hidden="true">&times;</span>')),
                       $('<div></div>').addClass('modal-body').append(imgarr),
                       $('<div></div>').addClass('modal-footer').append($('<div></div>').addClass('btn-group').append(
                           $('<button></button>').addClass('btn btn-default').on('click', function(e) {e.stopPropagation(); $(carouselId).carousel('prev');})
                               .append($('<i></i>').addClass('glyphicon glyphicon-chevron-left'), 'Previous'),
                           $('<button></button>').addClass('btn btn-default play').on('click', function(e) {
                                e.stopPropagation();
                                if($(this).hasClass('play')) {
                                    $(carouselId).carousel('pause');
                                    $(this).removeClass('play').find('i').addClass('glyphicon-play').removeClass('glyphicon-pause');
                                } else {
                                    $(carouselId).carousel('cycle');
                                    $(this).addClass('play').find('i').addClass('glyphicon-pause').removeClass('glyphicon-play');
                                }
                           }).append($('<i></i>').addClass('glyphicon glyphicon-pause')),
                           $('<button></button>').addClass('btn btn-default').on('click', function(e) {e.stopPropagation(); $(carouselId).carousel('next');})
                               .append('Next', $('<i></i>').addClass('glyphicon glyphicon-chevron-right'))
                       ))
                   )
               )
         );
         if($(modalId).length > 0) {
             $(modalId).remove();
         }
         $(document.body).append(carousel);
    }
})();
