angular.module('gz.directives').directive('map', function($filter, $window, dataFactory) {
  // www.tnoda.com/blog/2013-12-07
  return {
    restrict: 'E'
    ,scope: {
      industryid: '=' // bi-directional data-binding
    }
    ,link: function(scope, element, attrs) {
      var  aWindow       = angular.element($window)
          ,currentWidth  = aWindow[0].innerWidth
          ,currentHeight = aWindow[0].innerHeight
          ,width         = 950
          ,ratio         = 500 / 950; // height = 500

      var projection = d3.geo
                         .mercator()
                         .scale(150)
                         .translate([width / 2, (width * ratio) / 1.41]);

      var path = d3.geo
                   .path()
                   .pointRadius(2)
                   .projection(projection);

      var svgRoot = d3.select(element[0])
                      .append('svg')
                        .attr('width', currentWidth)
                        .attr('height', currentHeight)
                        .attr('preserveAspectRatio', 'xMidYMid')
                        .attr('viewBox', '0 0 ' + currentWidth + ' ' + currentHeight);

      var translate = {
         'width': (currentWidth / 2) - (width / 2)
        ,'height': (currentHeight / 2) - ((width * ratio) / 2)
      };
      var svg = svgRoot.append('g')
                       .attr('transform', 'translate(' + translate.width + ',' + translate.height + ')')
                       .attr('width', width)
                       .attr('height', width * ratio);

      // Draw country map.
      dataFactory.getCountryTopoJSON().then(function(countries){
        svg.append('g')
           .attr('class', 'countries')
           .selectAll('path')
           .data(topojson.feature(countries, countries.objects.countries).features)
           .enter()
           .append('path')
           .attr('id', function(d,i) {
             return d.id;
           })
           .attr('class', 'country')
           .attr('d', path);
      });

      // Monitor the bound data.
      scope.$watch('industryid', function(data) {
        scope.industryid = data;
        return scope.colorMap(data);
      });

      // On window resize, re-render d3 canvas.
      // Only watching for width changes.
      aWindow.bind('resize', function() { return scope.$apply(); });
      scope.$watch(function(){
        return aWindow[0].innerWidth;
      }, function(){
        return scope.colorMap(scope.industryid);
      });

      scope.colorMap = function(data) {
        dataFactory.getIndustryDataByID(scope.industryid).then(function(data){
          svg.selectAll('path.country')
             .attr('class', function(d,i) {
               var c = 'country';
               if (typeof data.total_fans[d.id] !== 'undefined') {
                 c += ' t-' + data.total_fans[d.id];
               }
               else {
                 c += ' t-0';
               }

               return c;
             });
        });
      };
    }
  };
});
