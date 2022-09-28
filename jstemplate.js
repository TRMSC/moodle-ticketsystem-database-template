/* Ticketsystem v.1.0 - Copyright (C) 2022, TRMSC - https://trmsc1.wordpress.com/ */
/* GNU General Public Licence 3.0 - http://www.gnu.de/documents/gpl-3.0.en.html */

/**
 * @event
 * @listens load
 * @description wait until jquery is loaded and go on with the checkSite function
 * @see https://github.com/TRMSC/moodle-editor-inline-codes/blob/main/jquery%20in%20moodle.html
 */
window.addEventListener( 'load', function( event ) {
    let jquery_load_check_interval = setInterval( function() {
        if ( window.jQuery ) {
            // open main function for checking the current page
            checkSite(); 
            clearInterval( jquery_load_check_interval );
        } else {
            console.log( 'jQuery in Moodle: new try to load jquery...' );
        }
    }, 150);
}, false );

/**
 * @function checkSite
 * @description main function for checking current page after jquery is loaded
 */
function checkSite() { 
    // check current page and go on with the appropriate function
    let site = document.getElementsByTagName('body')[0].id;
    switch (site) {
        case 'page-mod-data-edit':
            reviseEdit();
            break;
        case 'page-mod-data-view':
            reviseList();
            break;
    }
}

/**
 * @function reviseEdit
 * @description function for the edit page
 */
function reviseEdit() {
    // find url for going back and create link 
    let backHref = $('.mdl-align .btn-secondary').attr('href');
    addBacklink(backHref);
    // revise terms
    $('#region-main h2:first-of-type').text('Neues Ticket');    
    $('.btn[name="saveandadd"]').val('Speichern und weiteres Ticket hinzufügen');
    // select open status for new tickets
    let emptyState = $('option:first-of-type').attr('selected')
    if (emptyState !== undefined) {
        $('option:first-of-type').attr('selected', false);
        $('option[value="offen"]').attr('selected', 'selected');
    }
    // check role and show feedback when write permissions detected
    let adminControl = $('.navbar .custom-control-input').length;
    if (adminControl > 0) {
        $('.adminonly').css('display', 'inherit');
    }
}

/**
 * @function reviseList
 * @description function for the list page
 */
function reviseList() {
    // find url for going back and create link 
    let backHref = $('.urlselect option:first-of-type').val().split('&')[0]; 
    backHref = '/moodle' + backHref;
    addBacklink(backHref);
    // revise terms
    $('.tertiary-navigation .btn-primary[type="submit"]').text('Ticket hinzufügen');
    // create dummy elements for revising appearance of the search area
    let placeholder1 = document.createElement('div');
    placeholder1.style.width = '100%';
    $('label[for="pref_sortby"]').before(placeholder1);
    let placeholder2 = document.createElement('div');
    placeholder2.style.width = '100%';
    $('#advancedcheckbox').before(placeholder2);
    // hide search area
    (function() {
        const hiddenSearchContainer = 
            '<details>' +
                '<summary class="btn btn-secondary btn-sm" id="hiddenSearchSummary">Suche</summary>' +
                '<div id="hidden-search"></div>' +
            '</details>';
        $('#options').css('display', 'inherit');
        $('#options').before(hiddenSearchContainer);
        let hiddenSearch = $('#hidden-search');
        let options = $('#options');
        hiddenSearch.append(options);
    })();
    // check feedback and create rounded pills if available
    (function() {
        $('.status-container').each(function() {
            let check = $(this).find('.feedback').text();
            if (check !== "") {
                $(this).find('.rounded-circle').css('display', 'inherit');
            }
        });
    })();
}

/**
 * @function addBacklink
 * @description function for creating a backlink on several pages
 */
function addBacklink(backHref) {
    // create backlink for the current page
    const backLink =
        '<a href="' + backHref + '">zur Übersicht</a>';
    let backContainer = document.createElement('div');
    backContainer.innerHTML = backLink;
    $('.back-container').html(backContainer);
}
