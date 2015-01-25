'use strict';

/* Directives */

phonecatApp.directive('body', function($timeout,$location) {
        
	return {
	  	
		restrict : 'AEC', 
	    compile: function(elem,attrs) {
	      //do optional DOM transformation here

	      return function(scope,elem,attrs) {
	        //linking function here

		        var target;
		        var title;
				var path;

				jQuery('#menu').on('click','a', function(event) {

				    

					target = $(this);		        

					if (target.hasClass('mm-subopen'))
					{
				        target = target.siblings().first();
				        angular.element(target).trigger('click');
						        
				    }
				    else if (target.hasClass('mm-subclose'))
				    {
						
				        var parentUL = target.closest('ul').attr('id');
			            target = jQuery('a[href=#'+parentUL+']','#menu').siblings().first();
			            angular.element(target).trigger('click');
        
				    }
				});
	      	};
	    }
    };
});



phonecatApp.directive('body', function($timeout,$location) {
        
	return {
	  	
		restrict : 'AEC', 
	    compile: function(elem,attrs) {
	      //do optional DOM transformation here

	      return function(scope,elem,attrs) {
	        //linking function here

		        
				jQuery('body').on('click','span', function(event) {

				
		        if(jQuery(event.target).hasClass('aaaa')){
		        	
		        	var target = jQuery(event.target);
					//console.log('you clicked me!', target);

					//do something with target

		        }
		        
						        
				    

				});
	      	};
	    }
    };
});



phonecatApp.directive('username', function ($q, $timeout) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var usernames = ['Jim', 'John', 'Jill', 'Jackie'];

            ctrl.$asyncValidators.username = function (modelValue, viewValue) {

                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty model valid
                    return $q.when();
                }

                var def = $q.defer();

                $timeout(function () {
                    // Mock a delayed response
                    if (usernames.indexOf(modelValue) === -1) {
                        // The username is available
                        def.resolve();
                    } else {
                        def.reject();
                    }

                }, 2000);

                return def.promise;
            };
        }
    };
});



