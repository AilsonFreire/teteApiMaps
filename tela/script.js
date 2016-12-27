var configure, divMap, drawingManager, heatmap, mapOptions, markerAdded, polygonAdded, polylineAdded, polyline, register, show, routeListener;


var MapMenu = function () {

    var currentState = new Select(this);

    this.change = function (state) {
        if (currentState.hasOwnProperty("clear")) {
            currentState.clear();
        }
        ;
        currentState = state;
        //currentState.go();
    };

    this.go = function (e) {
        currentState.go(e);
    };

};

var Select = function (drawingManager) {
    //this.mapMenu = mapMenu;

    this.go = function () {
        drawingManager.setDrawingMode(null);
        console.log("Botão Select");
    };
};

var PontoBase = function (register, drawingManager) {

    if (register.polylines.length > 0)
        register.polylines[0].setOptions({clickable: false});

    var showedMarkers = new Array();


    this.go = function (e) {

        (e) ? this.singleClick(e) : this.markerSugest();
        console.log("Ponto Base Selecionado");

    };



    this.clear = function () {
        register.clearSuggestibles();
        if (cityRectangle)
            cityRectangle.setMap(null);
    };

    var allBaseIds = register.allBaseIds;

    var clickTimeOut = null;


    this.singleClick = function (e) {
        window.clearTimeout(clickTimeOut);
        clickTimeOut = null;
        // handle single click here
        this.showMarkersInsideViewPortion(register.map);
    };

    var mapListener = function (e, pb) {
        if (!clickTimeOut) {
            clickTimeOut = window.setTimeout(function () {
                pb.singleClick(e);
                console.log("single");
            }, 400);
        }
    };

    this.markerSugest = function () {
        drawingManager.setDrawingMode(null);
        //console.log(this);

        register.map.addListener('dblclick', function (e) {
            register.clearSuggestibles();
            if (cityRectangle)
                cityRectangle.setMap(null);

            var marker = new google.maps.Marker({
                position: e.latLng,
                map: register.map,
                draggable: true

            });
            console.log("duplo clique 1" + marker);
            register.addMarker(new Marker(marker));

            window.clearTimeout(clickTimeOut);
            clickTimeOut = null;

        });

        var pb = this;

        register.map.addListener('click', function (e) {
            if (!clickTimeOut) {
                clickTimeOut = window.setTimeout(function () {
                    pb.singleClick(e);
                    console.log("single");
                }, 400);
            }
        });
    };


    this.showMarkersInsideViewPortion = function (map) {
        rectangle(map);
        this.showedMarkers = new Array();
        for (var i = 0; i < register.suggestibles.length; i++) {
            if (map.getBounds().contains(register.suggestibles[i].marker.getPosition())) {
                register.suggestibles[i].marker.setMap(register.map);
                register.suggestibles[i].map = register.map;
                this.showedMarkers.push(register.suggestibles[i].id);
            } else {
                register.suggestibles[i].marker.setMap(null);
                register.suggestibles[i].map = null;
            }
        }

    };

    this.showNearMarkers = function (latLng, dist) {
        var d;
        //console.log(d+" metros");
        //d = computeDistanceBetween(marker.position, allMarkers[0].marker.position);

        circle(latLng, dist);
        this.showedMarkers = new Array();

        for (var i = 0; i < register.suggestibles.length; i++) {
            register.suggestibles[i].marker.setMap(null);
            d = google.maps.geometry.spherical.computeDistanceBetween(latLng, register.suggestibles[i].marker.position);

            if (d < dist && ($.inArray(register.suggestibles[i].id, allBaseIds) < 0)) {
                register.suggestibles[i].marker.setMap(register.map);
                register.suggestibles[i].map = register.map;
                this.showedMarkers.push(register.suggestibles[i].id);
            }
        }


    };



    var cityCircle;
    var cityRectangle;

    function circle(latLng, radius) {

        if (cityCircle)
            cityCircle.setMap(null);

        cityCircle = new google.maps.Circle({
            strokeColor: '#300000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#100000',
            fillOpacity: 0.25,
            map: drawingManager.getMap(),
            center: latLng,
            radius: radius
        });

    }

    function rectangle(map) {

        if (cityRectangle)
            cityRectangle.setMap(null);

        cityRectangle = new google.maps.Rectangle({
            strokeColor: '#300000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#100000',
            fillOpacity: 0.25,
            map: map,
            bounds: map.getBounds(),
            clickable: false
        });

    }




};
__bind = function (fn, me) {
    return function () {
        return fn.apply(me, arguments);
    };
};
Register = (function () {

    function Register(m) {
        this.loadGlobals = __bind(this.loadGlobals, this);
        this.loadMapElements = __bind(this.loadMapElements, this);
        this.loadBasePoints = __bind(this.loadBasePoints, this);
        this.clearSuggestibles = __bind(this.clearSuggestibles, this);
        this.data = __bind(this.data, this);
        this.update = __bind(this.update, this);
        this.showGlobals = __bind(this.showGlobals, this);
        this.hideGlobals = __bind(this.hideGlobals, this);
        this.clearPolygons = __bind(this.clearPolygons, this);
        this.clearPolylines = __bind(this.clearPolylines, this);
        this.clearMarkers = __bind(this.clearMarkers, this);
        this.addPolygon = __bind(this.addPolygon, this);
        this.addPolyline = __bind(this.addPolyline, this);
        this.enableRoutePoint = __bind(this.enableRoutePoint, this);
        this.addGlobalMarker = __bind(this.addGlobalMarker, this);
        this.addSuggested = __bind(this.addSuggested, this);
        this.addMarker = __bind(this.addMarker, this);
        this.polyDistance = __bind(this.polyDistance, this);
        this.polyDistanceEvent;
        this.polyArea = __bind(this.polyArea, this);
        this.polylineMouseOver = __bind(this.polylineMouseOver, this);
        this.polylineMouseOut = __bind(this.polylineMouseOut, this);
        this.polygonMouseOver = __bind(this.polygonMouseOver, this);
        this.polygonMouseOut = __bind(this.polygonMouseOut, this);
        this.map = m;
        this.routePointEnabled = true;
        this.markers = [];
        this.polylines = [];
        this.polygons = [];
        this.globals = [];
        this.suggestibles = [];
        this.polylineDistance;
        this.polygonArea;
        this.allBaseIds = new Array();
        this.routeWindow = new google.maps.InfoWindow({
            zIndex: 5
        });
        this.areaWindow = new google.maps.InfoWindow({
            zIndex: 5
        });


    }

    Register.prototype.clearSuggestibles = function () {

        for (var i = 0; i < this.suggestibles.length; i++) {
            this.suggestibles[i].marker.setMap(null);
        }

        return this.suggestibles;
    };

    Register.prototype.addMarker = function (marker) {
        return this.markers.push(marker);
    };

    Register.prototype.polyDistance = function (polyline) {

        //if (this.polylines.length >= 0){
        console.log(google.maps.geometry.spherical.computeLength(polyline.getPath()) / 1000);
        return google.maps.geometry.spherical.computeLength(polyline.getPath()) / 1000;
        //}else{
        //console.log("aqui");
        //return 0;
        //}
    };

    Register.prototype.polyArea = function (polygon) {

        //if (this.polylines.length >= 0){
        console.log(google.maps.geometry.spherical.computeArea(polygon.getPath()));
        return google.maps.geometry.spherical.computeArea(polygon.getPath());
        //}else{
        //console.log("aqui");
        //return 0;
        //}
    };

    Register.prototype.addGlobalMarker = function (marker) {
        marker.add();
        return this.globals.push(marker);
    };

    Register.prototype.update = function () {
        var arr = [];
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].marker)
                arr.push(this.markers[i]);
        }
        this.markers = arr;

    };

    Register.prototype.addRoutePoint = function (point) {
        if (this.routePointEnabled) {
            // console.log(" point: "+point.marker.icon);
//             console.log(" map: "+point.marker.marker.getDraggable() + "|");
            console.log(" type: " + point.type + "|");
            return this.markers.push(point);
        } else {
            console.log(" There is no route yet ");
            return null;
        }

    };

    Register.prototype.addPolyline = function (polyline) {
        this.polylines.push(polyline);
        distance = this.polyDistance(this.polylines[0]);
        this.polylineDistance = parseFloat(distance).toFixed(2);
        console.log(this.polylineDistance);

//        distanceEvent = google.maps.event.addListener(this.polylines[0], 'mouseover', function (e) {
//            register.routeWindow.setContent(register.polylineDistance + " Km");
//            register.areaWindow.close();
//            register.routeWindow.setPosition(e.latLng);
//            register.routeWindow.open(register.map);
//        });

        var timeOut;

        this.polyDistanceEvent = this.polylines[0].addListener("mouseover", function (e) {
            timeOut = setTimeout(function () {
                register.routeWindow.setContent(register.polylineDistance + " Km");
                register.areaWindow.close();
                register.routeWindow.setPosition(e.latLng);
                register.routeWindow.open(register.map);
            }, 2000);


        });


        google.maps.event.addListener(this.polylines[0], 'mouseout', function () {
            clearTimeout(timeOut);
        });
        google.maps.event.addListener(this.polylines[0], 'mouseout', this.polylineMouseOut);

        if (polyline.getPath().length < 2) {
            alert("Não é permitido criar rota com um único ponto.");
            this.polylines.splice(this.polylines.length - 1, 1);
            return polyline.setMap(null);
        }
        if (this.polylines.length >= 2) {
            alert("Não é permitido adicionar mais de uma rota.");
            this.polylines.splice(this.polylines.length - 1, 1);
            return polyline.setMap(null);
        } else {
            this.routePointEnabled = true;
        }
    };

    Register.prototype.polylineMouseOut = function () {
        this.routeWindow.close();
    }

    Register.prototype.polygonMouseOut = function () {
        this.areaWindow.close();
    }

    Register.prototype.enableRoutePoint = function () {
        console.log("route point enable");
        this.routePointEnabled = true;
    };

    Register.prototype.addPolygon = function (polygon) {
        this.polygons.push(polygon);
        area = this.polyArea(this.polygons[0]);
        this.polygonArea = parseFloat(area).toFixed(2);
        console.log(this.polygonArea);
        google.maps.event.addListener(this.polygons[0], 'mouseover', function (e) {
            register.areaWindow.setContent(register.polygonArea + " m²");
            register.areaWindow.setPosition(e.latLng);
            register.areaWindow.open(register.map);
        });
        google.maps.event.addListener(this.polygons[0], 'mouseout', this.polygonMouseOut);

        if (this.polygons.length >= 2) {
            alert("Não é permitido adicionar mais de uma área.");
            this.polygons.splice(this.polygons.length - 1, 1);
            return polygon.setMap(null);
        }
    };

    Register.prototype.clearMarkers = function () {
        var _this = this;
        var arr = [];
        console.log(this.markers);
        this.markers.forEach(function (marker) {
            if (marker.marker && (marker.type !== "Route point")) {
                return marker.remove();
            } else {
                arr.push(marker);
            }
        });

        this.markers = arr;
        return true;
    };

    Register.prototype.clearRoutePoints = function () {
        var _this = this;
        var arr = [];
        this.markers.forEach(function (marker) {
            if (marker.marker && (marker.type === "Route point")) {
                return marker.remove();
            } else {
                arr.push(marker);
            }
        });

        this.markers = arr;
        return true;
    };

    Register.prototype.clearPolylines = function () {
        this.polylines.forEach(function (polyline) {
            return polyline.setMap(null);
        });
        return this.polylines.length = 0;
    };

    Register.prototype.clearPolygons = function () {
        this.polygons.forEach(function (polygon) {
            return polygon.setMap(null);
        });
        return this.polygons.length = 0;
    };

    Register.prototype.hideGlobals = function () {
        var global, _i, _len, _ref, _results;
        _ref = this.globals;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            global = _ref[_i];
            _results.push(global.marker.setMap(null));
        }
        return _results;
    };

    Register.prototype.showGlobals = function () {
        var global, _i, _len, _ref, _results;
        _ref = this.globals;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            global = _ref[_i];
            _results.push(global.marker.setMap(this.map));
        }
        return _results;
    };

    Register.prototype.data = function () {
        var marker, position;
        return {
            map: {
                center: {
                    lat: this.map.getCenter().lat(),
                    lng: this.map.getCenter().lng()
                },
                zoom: this.map.getZoom()
            },
            cardDescription: $('#card-description').val(),
            areaDescription: $('#area-description').val(),
            routeDescription: $('#rote-description').val(),
            title: $('#card-title').val(),
            routeText: $('#printed-route').val(),
            markers: (function () {
                var _i, _len, _ref, _results;
                _ref = this.markers;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    marker = _ref[_i];
                    if (marker.marker !== null) {
                        _results.push(marker.data());
                    }
                }
                return _results;
            }).call(this),
            polyline: {
                path: (function () {
                    var _i, _len, _ref, _results;
                    _ref = this.polylines[0].getPath().getArray();
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        position = _ref[_i];
                        _results.push({
                            lat: position.lat(),
                            lng: position.lng()
                        });
                    }
                    return _results;
                }).call(this)
            },
            polygon: {
                path: (function () {
                    var _i, _len, _ref, _results;
                    _ref = this.polygons[0].getPath().getArray();
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        position = _ref[_i];
                        _results.push({
                            lat: position.lat(),
                            lng: position.lng()
                        });
                    }
                    return _results;
                }).call(this)
            },
            sigilo: $('#sigilo').val()
        };
    };

    Register.prototype.changeGlobal = function (global) {

        var _base1 = {
            marker: new google.maps.Marker({
                position: global.marker.position,
                map: global.marker.getMap()
            }),
            description: global.description};
        global.marker.setMap(null);
        var base = new GlobalBase(_base1.marker, _base1.description);

        console.log(global.marker.position);
        this.addMarker(base);

        //var base = $.extend(true, {}, base1);
    };

    Register.prototype.addSuggested = function (suggested) {

        var _base1 = {
            marker: new google.maps.Marker({
                position: suggested.marker.position,
                map: suggested.marker.getMap()
            }),
            description: suggested.description
        };
        suggested.marker.setMap(null);
        var marker = new Marker(_base1.marker, _base1.description, "", "", suggested.id);

        //console.log(global.marker.position);
        this.addMarker(marker);
    };

    Register.prototype.loadGlobals = function (cardId) {
        var _this = this;
        return $.ajax({
            url: './index3.php?controle=cp_procurarCartao&json=loadGlobals',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                var d, m, _i, _len, _ref, _results;
                _ref = data.globals;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    d = _ref[_i];
                    m = new google.maps.Marker({
                        map: _this.map,
                        position: new google.maps.LatLng(d[1], d[2]),
                        draggable: true,
                        visible: true
                    });
                    //lista = loadCategories(d.idcategory);
                    _results.push(_this.globals.push(new GlobalMarker(m, d[0], _this, cardId, d[3])));
                }

                return _results;
            }
        });
    };

    Register.prototype.loadBasePoints = function () {
        var _this = this;
        $.getJSON("./index3.php?controle=cp_procurarCartao&json=loadMarkers", function (data) {
            //allMarkers = data.markers;
            var l, m, marker, p, path, po, _i, _len, _ref, _results = [];

            var _ref = data.markers;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                marker = _ref[_i];
                m = new google.maps.Marker({
                    position: new google.maps.LatLng(marker[5], marker[6]),
                    map: null,
                    draggable: true
                });

//                    console.log(marker);
                if (marker[4] === "Default") {
                    _results.push(_this.suggestibles.push(new SuggestedPoint(m, marker[2], marker[1], marker[3], marker[0], _this)));
                }
//                if (marker.type === "Default") {
//                    _results.push(_this.suggestibles.push(new SuggestedPoint(m, marker.description, marker.arrival, marker.leave, marker.id, _this)));
//                }
            }
        });
    };


    Register.prototype.loadMapElements = function (IdCard) {

    	var register = this;

        console.log(register);
        console.log(" Id: " + IdCard);

        $.getJSON("./index3.php?controle=cp_procurarCartao&json=loadCard&idCard=" + IdCard, function (data) {
            var l, m, marker, p, path, po, _i, _len, _ref;
            //console.log("Data recebida do servidor:");
            //console.log(data);

            var mapDescription = {
                card: $('#card-description'),
                area: $('#area-description'),
                rota: $('#rote-description'),
                title: $('#card-title'),
                routeText: $('#printed-route')
            };

            mapDescription.card.val(data.cardDescription);
            mapDescription.title.val(data.title);
            mapDescription.area.val(data.areaDescription);
            mapDescription.rota.val(data.routeDescription);
            mapDescription.routeText.val(data.routeText);



            //lendo os marcadores
            _ref = data.markers;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                marker = _ref[_i];
                m = new google.maps.Marker({
                    position: new google.maps.LatLng(marker.lat, marker.lng),
                    map: register.map,
                    draggable: true,
                    zIndex: 4,
                });
                //console.log("marker load type:" + marker.type);
                if (marker.type === "Route point") {
                    register.addRoutePoint(new RoutePoint(m, marker.description, marker.arrival, marker.leave));
                } else if (marker.type === "Global base") {
                    register.addMarker(new GlobalBase(m, marker.description, marker.arrival, marker.leave));
                }
                else {
                    register.addMarker(new Marker(m, marker.description, marker.arrival, marker.leave, marker.id));
                }

                register.allBaseIds.push(marker.id);
            }

            //console.log(allBaseIds);

            //termina de ler os marcadores

            path = (function () {
                var _j, _len1, _ref1, _results;
                _ref1 = data.polyline.path;
                _results = [];
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                    l = _ref1[_j];
                    _results.push(new google.maps.LatLng(l.lat, l.lng));
                }
                return _results;
            })();
            p = new google.maps.Polyline({
                path: path,
                map: register.map,
                strokeColor: 'green',
                editable: true,
                icons: [
                    {
                        icon: {
                            path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
                        },
                        offset: '10%',
                        repeat: '20%'
                    }
                ]
            });
            polylineAdded(p);
            path = (function () {
                var _j, _len1, _ref1, _results;
                _ref1 = data.polygon.path;
                _results = [];
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                    l = _ref1[_j];
                    _results.push(new google.maps.LatLng(l.lat, l.lng));
                }
                return _results;
            })();
            po = new google.maps.Polygon({
                path: path,
                map: register.map,
                draggable: true,
                editable: true,
                fillColor: 'red',
                strokeColor: 'red',
                zIndex: -10,
            });
            return polygonAdded(po);
        });

    };






    return Register;






})();

function createMap() {
		
	alert('teste');
//	$(function () {
	    console.log("Version 4");
	    var directionsService = new google.maps.DirectionsService;
	    var allMarkers = new Array();
	    //register.allBaseIds = new Array();
	    var route_clicks = 0;
	    var clicks_on_map = 0;

	    divMap = document.getElementById("map");
	    console.log(divMap);

	    drawingManager = new google.maps.drawing.DrawingManager({
	        drawingMode: null,
	        drawingControl: false,
	        drawingControlOptions: {
	            position: google.maps.ControlPosition.BOTTOM_LEFT,
	            drawingModes: [google.maps.drawing.OverlayType.MARKER, google.maps.drawing.OverlayType.POLYLINE, google.maps.drawing.OverlayType.POLYGON]
	        },
	        markerOptions: {
	            draggable: true

	        },
	        polylineOptions: {
	            editable: true,
	            strokeColor: 'green',
	            clickable: true,
	            icons: [
	                {
	                    icon: {
	                        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
	                    },
	                    offset: '10%',
	                    repeat: '20%'
	                }
	            ]
	        },
	        polygonOptions: {
	            draggable: true,
	            editable: true,
	            fillColor: 'red',
	            strokeColor: 'red',
	            zIndex: -10,
	            clickable: false
	        }
	    });
	    configure = function (options) {
	        var map;
	        map = new google.maps.Map(divMap, options);
	        drawingManager.setMap(map);
	        return map;
	    };

	    console.log(map);
	    var mapMenu = new MapMenu();


	    $('.drawing-control').click(function () {
	        var typ;

	        google.maps.event.clearInstanceListeners(register.map);
	        drawingManager.setDrawingMode(null);
	        //clearSuggestibles();

	        $('.drawing-control').removeClass('selected');
	        drawingManager.markerOptions.icon = null;
	        typ = $(this).data('type');
	        try {
	            google.maps.event.removeListener(polyline_start);
	            google.maps.event.removeListener(click_on_map);
	        }
	        catch (err) {
	        }
	        ;
	        if (typ === 'g') {
	            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
	        } else if (typ === 'r') {

	            mapMenu.change(new Rota());
	            route_clicks++;
	            draw_route();
	        } else if (typ === 'pr') {
	            draw_route_point();
	        } else if (typ === 'm') {
	            mapMenu.change(new PontoBase(register, drawingManager));
	            mapMenu.go();
	        } else if (typ === 'a') {
	            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
	        } else {
	            mapMenu.change(new Select(drawingManager));

	        }
	        return $(this).addClass('selected');
	    });



	    function draw_route() {

	        if (route_clicks < 2 && is_any_route() < 1) {
	            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);


	            //clicks_on_map=0;
	            polyline_start = google.maps.event.addDomListener(divMap, 'click', function () {
	                clicks_on_map++;
	                if (clicks_on_map === 1) {
	                    console.log(console.log(clicks_on_map));
	                    toggle_buttons(["#select", "#marker", "#pRoute", "#global", "#route", "#area"], true);
	                }
	                ;


	            });
	            click_on_map = google.maps.event.addDomListener(divMap, 'click', function () {
	                var polyline_length = 0;
	                try {
	                    polyline_length = register.polylines[0].getPath().length;
	                } catch (err) {
	                }
	                ;
	                if (polyline_length > 1) {
	                    toggle_buttons(["#select", "#route"], false);
	                    document.getElementById("route").childNodes[0].nodeValue = "Concluir Rota";
	                    google.maps.event.removeListener(click_on_map);

	                }
	            });
	            if (is_any_route() < 1) {
	                route_clicks = 0;
	            }
	            ;
	        } else if (is_any_route() < 1) {
	            alert("Não há rotas no mapa");
	            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
	        } else {
	            if (confirm('Concluir rota?')) {

	                document.getElementById("route").childNodes[0].nodeValue = "Rota";
	                toggle_buttons(["#route"], true);
	                toggle_buttons(["#marker", "#pRoute", "#global", "#area"], false);
	                register.polylines[0].setEditable(false);
	                routeListener = register.polylines[0].addListener('click', function (e) {
	                    console.log("Route click");
	                    draw_on_route(e);
	                });

	                $("#select").click();
	                drawingManager.setDrawingMode(null);


	            }
	            ;
	        }
	    }


	    function draw_on_route(e) {
//	        var marker = new google.maps.Marker({
//	            position: e.latLng,
//	            map: drawingManager.getMap()
//	        });
	        mapMenu.go(e);
	        //register.addRoutePoint(new RoutePoint(marker));
	    }
	    ;

	    function toggle_buttons(buttons, on_off) {
	        for (i = 0; i < buttons.length; i++) {
	            $(buttons[i]).prop("disabled", on_off);
	        }

	    }


	    function draw_route_point() {
	        if (is_any_route()) {
	            if (typeof routeListener === 'undefined') {
	                routeListener = register.polylines[0].addListener('click', function (e) {
	                    console.log("Route click");
	                    draw_on_route(e);
	                });
	            }
	            mapMenu.change(new PontoDeRota(register));
	        } else {
	            alert("Não há rotas no mapa.");
	            $('#pRoute').removeClass('selected');
	            return null;
	        }
	    }

	    function is_any_route() {
	        return register.polylines.length;
	    }

	    $('#globals').click(function () {
	        if ($(this).data('hide') === 'y') {
	            register.hideGlobals();
	            return $(this).data('hide', 'n');
	        } else {
	            register.showGlobals();
	            return $(this).data('hide', 'y');
	        }
	    });

	    if (divMap) {
	        google.maps.visualRefresh = true;
	        mapOptions = {
	            center: new google.maps.LatLng(-1.4558333333, -48.5027777778),
	            zoom: 15,
	            disableDoubleClickZoom: true,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        };

	        register = new Register(configure(mapOptions));

	        markerAdded = function (marker) {
	            //console.log("entrou nomarkerADD");
	            if ($('.drawing-control.selected').data('type') === 'm') {
	                return register.addMarker(new Marker(marker));
	            } else if ($('.drawing-control.selected').data('type') === 'g') {
	                return register.addGlobalMarker(new GlobalMarker(marker, "", register));
	            }
	        };
	        polylineAdded = function (polyline) {
	            //console.log("entrou polylineAdded");
	            return register.addPolyline(polyline);
	        };
	        polygonAdded = function (polygon) {
	            return register.addPolygon(polygon);
	        };
	        google.maps.event.addListener(drawingManager, 'markercomplete', markerAdded);
	        google.maps.event.addListener(drawingManager, 'polylinecomplete', polylineAdded);
	        google.maps.event.addListener(drawingManager, 'polygoncomplete', polygonAdded);

	        register.clearMarkers();
	        $('#clear-markers').click(function () {
	            if (confirm('Remover marcadores?')) {
	                return register.clearMarkers();
	            }
	        });
	        $('#clear-route-points').click(function () {
	            if (confirm('Remover pontos de rota?')) {
	                return register.clearRoutePoints();
	            }
	        });
	        register.clearPolylines();
	        $('#clear-polyline').click(function () {
	            if (confirm('Remover rota?')) {
	                document.getElementById("route").childNodes[0].nodeValue = "Rota";
	                toggle_buttons(["#select", "#marker", "#pRoute", "#global", "#area", "#route"], false);
	                route_clicks = 0;
	                clicks_on_map = 0;
	                $("#select").click();
	                try {
	                    google.maps.event.removeListener(polyline_start);
	                    google.maps.event.removeListener(click_on_map);
	                }
	                catch (err) {
	                }
	                ;
	                return register.clearPolylines();
	            }
	        });
	        register.clearPolygons();
	        $('#clear-polygon').click(function () {
	            if (confirm('Remover área?')) {
	                return register.clearPolygons();
	            }
	        });


	        /*
	         $(function () {
	         $(".data").datepicker({
	         monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
	         dateFormat: 'dd-mm-yy',
	         dayNamesMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
	         });
	         });*/


	        $('.dropdown-menu li a ').on('click', function () {
	            var id, dataIncio, dataFim;
	            id = $(this).attr('id');

	            dataInicio = $("#dataInicio").val();
	            dataFim = $("#dataFim").val();

	            return $('#heatmap').data('url', 'path/your-url.php?id=' + id + '&data1=' + dataInicio + '&data2=' + dataFim);
	        });



	        $('#save-map').click(function () {
	            var confirmMessage = 'Salvar cartão?';
	            if (!titleChanged) {
	                alert("Título do cartão precisa ser alterado");
	                return false;
	            }
	            if (!checkFormFields())
	                return false;
	            var data = register.data();
	            sendCardData(data, confirmMessage);
	        });


	        $('#update-map').click(function () {
	            var confirmMessage = 'Atualizar cartão?';
	            var data = register.data();
	            data.update = true;
	            data.idCard = getIdCard();
	            console.log(data);
	            if (!checkFormFields())
	                return false;
	            sendCardData(data, confirmMessage);
	        });

	        $('#print-pb').click(function printPb() {
	            var geocoder = new google.maps.Geocoder;
	            //var table = "";
	            document.getElementById("markers-table").innerHTML = "<tbody>";
	            var n = 0;
	            var index = [];
	            for (i = 0; i < register.markers.length; i++) {
	                if (register.markers[i].type === "Default" || register.markers[i].type === "Global base") {
	                    var input = register.markers[i].marker.position;
	                    index.push(i);
	                    //var latlngStr = input.split(',', 2);
	                    //var latlng = {lat: input.lat, lng: input.lng};
	                    console.log(input);
	                    console.log(register.markers[i].type);
	                    geocoder.geocode({'location': input}, function (results, status) {
	                        if (status === google.maps.GeocoderStatus.OK) {
	                            if (results[0]) {
	                                n += 1;
	                                //table += "<tr><td>" + n + "</td><td>" + results[1].formatted_address + "</td>";
	                                document.getElementById("markers-table").innerHTML += "<tr><td>" + n + "</td><td>" + results[0].formatted_address + "</td><td>" + register.markers[index.shift()].description + "</td></tr>";
//	                        console.log(index.shift());
	                            } else {
	                                window.alert('Nenhum resultado encontrado');
	                            }
	                        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
	                            setTimeout(function () {
	                                geocoder.geocode({'location': input});
	                            }, 200);
	                        } else {
	                            window.alert('Geocoder falhou devido a: ' + status);
	                        }
	                    });
	                }
	                document.getElementById("markers-table").innerHTML += "</tbody>";
	            }
	        });

	        $('#print-route').click(function () {

	            //showMarkersTable();
	            var polyline = register.polylines[0].getPath();
	            var waypts = [];
	            var origin = polyline.getAt(0);
	            var destination = polyline.getAt(polyline.getLength() - 1);
	            var path = polyline.getArray();
	            console.log(path);
	            for (i = 1; i < path.length - 1; i++) {
	                waypts.push({
	                    location: path[i],
	                    stopover: false
	                });
	            }
	            ;
	            directionsService.route({
	                origin: origin,
	                destination: destination,
	                waypoints: waypts,
	                optimizeWaypoints: false,
	                travelMode: google.maps.TravelMode.WALKING
	            }, function (response, status) {
	                if (status === google.maps.DirectionsStatus.OK) {
	                    //directionsDisplay.setDirections(response);
	                    var route = response.routes[0];
	                    var routeText = "";
	                    //var routeText = "Início: " + origin + "<br>";
	                    for (var i = 0; i < route.legs[0].steps.length; i++) {
	                        routeText += route.legs[0].steps[i].instructions + ". ";
	                        console.log(route.legs[0].steps[i].instructions);
	                    }
	                    //routeText += "Fim: " + destination;
	                    var StrippedString = routeText.replace(/(<([^>]+)>)/ig, "");
	                    console.log(StrippedString);
	                    document.getElementById("printed-route").value = StrippedString;
	                } else {
	                    window.alert('Serviço de dire��es falhou devido a: ' + status);
	                }
	            });




	        });

	        $('#print').click(function () {
	            var id = getIdCard();
	            console.log("entrou");
	            window.open("./index2.php?controle=cp_procurarCartao&mode=print&idCard=" + id, '_blank');
	            $("#print-pb").click();
	        });


	        function sendCardData(data, confirmMessage) {
	            if (confirm(confirmMessage)) {
	                console.log(data);
	                return $.ajax({
//	                    url: './save-cartao/',
	                    url: './index3.php?controle=cp_cadastrarCartao&mode=persist',
	                    cache: false,
	                    type: 'post',
	                    dataType: 'json',
	                    data: data,
	                    beforeSend: function (xhr, settings) {
	                        if (!csrfSafeMethod(settings.type)) {
	                            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
	                        }
	                        return jQuery.blockUI({
	                            message: 'Salvando cartão, aguarde...',
	                            css: {
	                                border: 'none',
	                                padding: '15px',
	                                backgroundColor: '#000',
	                                '-webkit-border-radius': '10px',
	                                '-moz-border-radius': '10px',
	                                opacity: .5,
	                                color: '#fff'
	                            }
	                        });
	                    },
	                    success: function (data) {
	                        jQuery.unblockUI();
	                        alert("Cartão salvo com sucesso.");
	                        return window.top.location.href = END_PROCURAR_CARTAO;
	                    }
	                });
	            }
	        }



	        //console.log(allMarkers);

	        register.loadBasePoints();
	        register.loadGlobals(getIdCard());

	        if (getIdCard()) {
	            register.loadMapElements(getIdCard());
	        }
	        //Final do if(divMap)    
	    }
	    return $('.span2 a').css({
	        display: 'block'
	    });

//	});
};

function loadTheMap(){
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1qCeTpnDCkDd1veNtsBUe2BEpw-o4c4s&callback=createMap&libraries=drawing,visualization,geometry&amp;sensor=false&amp;language=pt&amp;region=BR';
	document.body.appendChild(script);
};

//window.onload = loadTheMap;
