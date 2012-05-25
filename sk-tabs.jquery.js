/* 
* skTabs 
* Version 1.0
* Usage: $('#my_container').skTabs();
*/ 
(function($) {

    $.skTabs = function(element, options) {
				
				// Plugin defaults
        var defaults = {
        		animate : false,
        		showFirstTab : false,
        		useLocationHash : false,
            showLoader : true,
            loaderClass : 'skTabsLoader',
            onAjaxComplete : function(){}
        }
				
				// Public vars
        var plugin = this;
        plugin.settings = {};
        plugin.loader_appended = false;
        plugin.currentPane;
				
				// Private vars
        var $element = $(element),
            element = element,
            elementId = $element.attr('id'),
            $tabs = $element.find('.tabs').not('#'+elementId+' .panes .tabs'),
            $panes = $element.children('.panes').not('#'+elementId+' .panes .panes');
        
        
        plugin.init = function() {
            
            plugin.settings = $.extend({}, defaults, options); // Extend defaults with any options passed
            
            console.log(plugin.settings.showFirstTab+' '+elementId);
            //console.log(plugin.settings.useLocationHash+' '+elementId);
            
            // Show first tab
            if(plugin.settings.showFirstTab == true){
            	//console.log('showFirstab '+elementId);
 	          	showFirstTab();
 	          } 
	            
            // Bind click event
            $tabs.find('a').click(function(){
							
							if( !($(this).parent().hasClass('disabled')) ){
	            			
	            	var tabInfo = getTabInfo($(this));		
	            	
	            	// Update hash
	            	if(plugin.settings.useLocationHash == true){
	            		if(tabInfo.href.substring(0,1) == '#'){
		            		window.location.hash = tabInfo.href;
		            	} else {
		            		window.location.hash = tabInfo.text;
		            	}
	            	}
	            	
	            	// Change tab active class
	            	$tabs.find('li').removeClass('active');
	            	$(this).parent().addClass('active');
	            	
	            	// Switch content pane
								switchPane(tabInfo.href, tabInfo.text);
							}
            	return false;
            });
        } // END plugin.init()
        
        var showFirstTab = function(){
        		
        		$panes.children().hide();
            var tabInfo;
            
            // No hash found, or useLocationHash is turned off. Show the first pane	
            if(window.location.hash == '' || plugin.settings.useLocationHash == false){
             				
							$tabs.find('li:first-child').addClass('active');
							tabInfo = getTabInfo($tabs.find('li:first-child a'));
							switchPane(tabInfo.href, tabInfo.text);
							
            } else {
            // Show pane which matches url hash
            	
            	if($tabs.find('li a[href="'+window.location.hash+'"]').length > 0){
            		
            		$tabs.find('li a[href="'+window.location.hash+'"]').parent().addClass('active');
            		tabInfo = getTabInfo($tabs.find('li a[href="'+window.location.hash+'"]'));
            		switchPane(window.location.hash, tabInfo.text);
            		
            	} else {
            	// Match not found. Check link text
            	
            		// To do - Check data-label attr first and use that if available
            		$tabs.find('a').each(function(){
	        					        				
	        				tabInfo = getTabInfo($(this));
	        				
	        				if('#'+tabInfo.text == window.location.hash){
	        					tabInfo.href = $(this).attr('href');
	        					$(this).parent().addClass('active');
	        					switchPane(tabInfo.href, tabInfo.text);
	        				}
	        			});
            	}
            	
            }
            
        } // END showFirstTab()
        
        var getTabInfo = function(clickedElement){
        		
        		var tabInfo = {}, text;
        		
        		if(clickedElement.attr('data-label')){
        			text = clickedElement.attr('data-label');
        		} else {
        			text = $.trim(clickedElement.text().toLowerCase());
        			text = text.replace(' ', '_');
        		}
        		
        		tabInfo.text = text;
        		tabInfo.href = clickedElement.attr('href');
        		return tabInfo;
        }
        
        var switchPane = function(href, text){
        	
        	if(plugin.settings.animate == true){
        		$panes.height($panes.height());
        	}
        	
        	$panes.children().hide();
        	        	        	
        	// Check if url is a hash or a real one
        	if(href.substring(0, 1) == '#'){
        		
        		// Normal Show/Hide tab
            plugin.currentPane = $panes.find(href);
            
            showPane();
            
        	} else {
        		// Ajax tab
        		        		
        		
        		if(plugin.settings.showLoader == true){
        			showLoader();
        		}
        		
    
      			// Ajax request      			
      			$.ajax({
            	url : href,
            	success : function(data, textStatus, jqXHR){
            		
            		$element.find('.'+plugin.settings.loaderClass).hide();	            		
            		$panes.append('<div id="'+text+'">'+data+'</div>');
            		plugin.currentPane = $('#'+text);
            		$tabs.find('a[href="'+href+'"]').attr('href', '#'+text);
            		
            		if(!(plugin.currentPane.is(':visible'))){
            			showPane();
            		}
            		
            			            		
            		// Callback function
            		plugin.settings.onAjaxComplete.call(this, plugin);
            	}
            });
        		
        	}
        } // END switchPane()
        
        var showPane = function(){
        		
        		if(plugin.settings.animate == true){
        			plugin.currentPane.css({'visibility' : 'hidden'}).show();
	            $panes.animate({'height' : plugin.currentPane.outerHeight()+'px'}, function(){
	            	plugin.currentPane.css({'visibility' : 'visible'});
	            });
        		} else {
        			plugin.currentPane.show();
        		}
        }
        
        var showLoader = function(){
        			// Show loading div. Append as HTML if this is the first time
        		
      			if(!plugin.loader_appended){
      				$panes.append('<div class="'+plugin.settings.loaderClass+'" style="visibility:hidden; display:none;"></div>');
      				plugin.loader_appended = true;
      			}
      			
      			var $loader = $element.find('.'+plugin.settings.loaderClass);
        		
        		$loader.show();
        		
        		var loaderHeight = $loader.outerHeight();
        		if(plugin.settings.animate == true && $panes.outerHeight() < loaderHeight){
        	
      				$panes.animate({'height' : loaderHeight+'px'}, 'fast', function(){
      					 $loader.css({'visibility' : 'visible'});
      				});
        		} else {
        			$loader.css({'visibility' : 'visible'});
        		}        			
        		
        		
        }
        
        // PUBLIC METHODS
        plugin.hideAll = function() {
        	$tabs.find('li').removeClass('active');
        	
        	if(plugin.settings.animate == true){
        		$panes.css({'height' : 'auto'});
        	}
          $panes.children().slideUp();
        }
        
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
