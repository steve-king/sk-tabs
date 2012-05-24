/* 
* skTabs 
* Version 1.0
* tabType : 'normal' or 'ajax'
* showLoader: true / false (for ajax mode) 
* useLocationHash : true/false
* Usage: $('.my_container').skTabs();

Normal Markup:

<div class="my_container">
	<ul class="tabs">
		<li><a href="#pane1">Tab 1</li>
		<li><a href="#pane2">Tab 2</li>
	</ul>
	
	<div class="panes">
		<div id="#pane1">Pane 1 content</div>
		<div id="#pane2>Pane 2 content</div>
	</div>
</div>

Ajax markup:

	<div class="my_container">
	<ul class="tabs">
		<li><a href="http://example.com">Tab 1</li>
		<li><a href="http://example2.com">Tab 2</li>
	</ul>
	
	<div class="panes"><!-- Empty --></div>
</div>

*/ 
(function($) {

    $.skTabs = function(element, options) {
				
				// Plugin defaults
        var defaults = {
            showLoader : false,
            loaderClass : 'skTabsLoader',
            ajaxContentClass : 'skAjaxContent',
            useLocationHash : false
        }

        var plugin = this;

        plugin.settings = {};
        plugin.loader_is_appended = false;
        plugin.ajax_content = {};
        plugin.ajax_is_appended = false;
				
        var $element = $(element),
             element = element,
             elementId = $element.attr('id'),
            $tabs = $element.children('.tabs'),
            $panes = $element.children('.panes');
        
        plugin.init = function() {
            
            plugin.settings = $.extend({}, defaults, options);
            
            // Show first tab
 	          showFirstTab(); 
	            
            // Bind click event
            $tabs.find('a').click(function(){
							
														
            	var href = $(this).attr('href'),
            			text = '#'+$.trim($(this).text().toLowerCase());
            			text = text.replace(' ', '_');
            	
            	// Update hash
            	if(plugin.settings.useLocationHash == true){
            		if(href.substring(0,1) == '#'){
	            		window.location.hash = href;
	            	} else {
	            		window.location.hash = text;
	            	}
            	}
            	
            	
            	// Change tab active class
            	$tabs.find('a').removeClass('active');
            	$(this).addClass('active');
            	
							switchTab(href);
							return false;
            });
        } // END plugin.init()
        
        var showFirstTab = function(){
        		
        		$panes.children().hide();
            var href;
            
            
            if(window.location.hash == '' || plugin.settings.useLocationHash == false){
             	
             	// No hash found, or useLocationHash is turned off. Show the first pane
							href = $tabs.find('li:first-child a').attr('href');
							$tabs.find('li:first-child a').addClass('active');
							switchTab(href);
							
            } else {
            	
            	// Show pane which matches url hash
            	if($tabs.find('li a[href="'+window.location.hash+'"]').length > 0){
            		$tabs.find('li a[href="'+window.location.hash+'"]').addClass('active');
            		href = window.location.hash;
            		switchTab(href);
            	} else {
            	
            		// Match not found. Check link text
            		// To do - Check data-label attr first and use that if available
            		$tabs.find('a').each(function(){
	        				var text = '#'+$.trim($(this).text().toLowerCase());
	        				text = text.replace(' ', '_');
	        				if(text == window.location.hash){
	        					href = $(this).attr('href');
	        					$(this).addClass('active');
	        					switchTab(href);
	        				}
	        			});
            	}
            	
            }
            
        } // END showFirstTab()
        
        var switchTab = function(href){
        	
        	//alert('Switching tab '+href+' '+$element.attr('id'));
        	        	
        	// Check if url is a hash or a real one
        	if(href.substring(0, 1) == '#'){
        		// Normal Show/Hide tab
        		$panes.children().hide();
            $panes.find(href).show();
            
        	} else {
        		        		
        		// Ajax Tab
        		$panes.children().hide();
        		
        		// The first time this runs we should inject a loading div
        		if(!plugin.loader_is_appended && plugin.settings.showLoader == true){
        			$element.append('<div class="'+plugin.settings.loaderClass+'"></div>');
        			plugin.loader_is_appended = true;
        		}
        		
        		// The first time this runs we should inject an ajax content container
        		if(!plugin.ajax_is_appended){
        			$panes.append('<div class="'+plugin.settings.ajaxContentClass+'"></div>');
        			plugin.ajax_is_appended = true;
        		} else {
        			$panes.find('.'+plugin.settings.ajaxContentClass).empty();
        		}
        		
        		// Has this content previously been loaded? 
        		if(plugin.ajax_content[href]){ 
        			
        			// If so get it from the ajax_content object
        			$panes.find('.'+plugin.settings.ajaxContentClass).html(plugin.ajax_content[href]).show();
        			//console.log('cached content');
        		
        		} else { 
        			// Ajax request
        			$element.find('.'+plugin.settings.loaderClass).show();// Show loader div
        			//console.log('ajax content');
        			$.ajax({
	            	url : href,
	            	success : function(data, textStatus, jqXHR){
	            		$element.find('.'+plugin.settings.loaderClass).hide();
	            		$panes.find('.'+plugin.settings.ajaxContentClass).html(data).show();
	            		plugin.ajax_content[href] = data;
	            		//console.log(plugin.ajax_content);
	            	}
	            });
        		}
        		
        	}
        } // END switchTab()
        
        plugin.init();
    }

    $.fn.skTabs = function(options) {

        return this.each(function() {
            if (undefined == $(this).data('skTabs')) {
                var plugin = new $.skTabs(this, options);
                $(this).data('skTabs', plugin);
            }
        });

    }

})(jQuery);