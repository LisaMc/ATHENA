sttrApp.addEvent(window, "load", function() {
	
	/* scroll the webpage to hide the address bar */
	setTimeout(function(){window.scrollTo(0,0);})	
	
	sttrApp.adjustBodyPosition();
	sttrApp.equallySpaceGlobalNav();
	
	$(window).resize(function() {
		sttrApp.adjustBodyPosition();
		//sttrApp.resetMobileMenus();
		sttrApp.equallySpaceGlobalNav();
	});

    /* set up the click events for the utility nav's sitesearch function */
	sttrApp.setupClickEventsUtilitySitesearch();
	
	/* set up click events for the mobile menu button */
    sttrApp.setupClickEventsMobileMenu();

    /* set up click events for global nav on tablets and such */
   	//sttrApp.setupClickEventsGlobalNav();

	
});

