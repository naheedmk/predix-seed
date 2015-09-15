define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';


    // Controller definition
    controllers.controller('DashboardsCtrl', ['$scope', '$log', 'PredixAssetService', 'PredixViewService', function ($scope, $log, PredixAssetService, PredixViewService) {

        PredixAssetService.getAssetsByParentId(null).then(function (initialContext) {
            $scope.initialContexts = initialContext;
        }, function (message) {
            $log.error(message);
        });

        $scope.decks = [];
        $scope.selectedDeck = null;//$scope.decks[0].url;'/api/views/decks/1?filter[include][cards]';

        // callback for when the Open button is clicked
        $scope.openContext = function (contextDetails) {

            // need to clean up the context details so it doesn't have the infinite parent/children cycle,
            // which causes problems later (can't interpolate: {{context}} TypeError: Converting circular structure to JSON)
            var newContext = angular.copy(contextDetails);
            newContext.children = [];
            newContext.parent = [];

            $scope.context = newContext;

            console.log(newContext);

            //Tag string can be classification from contextDetails
            PredixViewService.getDecksByTags(newContext.classification) // gets all decks for this context
                .then(function (decks) {
                    decks.forEach(function (deck) {
                        $scope.decks.push({name: deck.title, url: '/api/decks/' + deck.id + '?filter[include][cards]'});
                    });
                });

            $scope.$digest();
        };

        $scope.getChildren = function (parentId, options) {
            return PredixAssetService.getAssetsByParentId(parentId, options);
        };

        $scope.handlers = {
            itemOpenHandler: $scope.openContext,
            getChildren: $scope.getChildren
            // (optional) click handler: itemClickHandler: $scope.clickHandler
        };
    }]);
});
