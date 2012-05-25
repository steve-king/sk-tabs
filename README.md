#SK TABS
--------------------------------------------------

Simple(ish) jQuery tabbing plugin. I struggled to find a solution out there that could handle standard show/hide tabs and ajax requests at the same time, so I wrote this.

In your tabs, use page anchors:

		<a href="#pane1">Tab 1</a> 
		
or real urls: 

		<a href="http://example.com/ajaxcontent.html">Ajax tab</a> 

- the plugin will decide whether to show existing page content or make an ajax request.

The plugin converts AJAX tabs to standard show/hide ones once content is retrieved, ensuring that only one http request is made per AJAX tab.

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
		onAjaxComplete : function(pluginData){} // Callback function - runs on completion of AJAX request.


