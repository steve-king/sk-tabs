SK TABS
--------------------------------------------------

Simple(ish) jQuery tabbing plugin. I struggled to find a solution out there that could handle standard show/hide tabs and ajax requests at the same time, so I wrote this.

Specify an id (e.g. "#myDiv") or a url for your tab link href. The plugin will detect this and either show the relevant content on click or make an ajax request.

Once content has been retrieved via an ajax request, the plugin stores the content, and won't make any further requests for the same content.

##Markup:

		<div id="my_container">
			<ul class="tabs">
				<li><a href="#pane1">Tab 1</li>
				<li><a href="#pane2">Tab 2</li>
				<li><a href="http://example.com/ajaxcontent.html">Tab 3</li>
			</ul>
	
			<div class="panes">
				<div id="#pane1">Pane 1 content</div>
				<div id="#pane2>Pane 2 content</div>
			</div>
		</div>

##jQuery:

		$('#my_container').skTabs();

##Default options
		useLocationHash : false,                // Optional url hackable tabs 
		showLoader : true,                      // Show loading div during ajax requests
		loaderClass : 'skTabsLoader',           // Specify a custom loader class name here
		onAjaxComplete : function(pluginData){} // Custom callback function on completion of Ajax request.


