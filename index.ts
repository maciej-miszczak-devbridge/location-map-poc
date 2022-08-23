/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarkerClusterer } from "@googlemaps/markerclusterer";

let map: google.maps.Map;

function initMap(): void {
  const center = new google.maps.LatLng(40, -93);
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: center,
    zoom: 5,
    streetViewControl: false
  });

  class Location implements google.maps.Symbol {
    threshold: number;
    path: string;
    fillColor: string;
    fillOpacity: number;
    strokeWeight: number;
    rotation: number;
    scale: number;
    anchor: google.maps.Point;
    constructor(threshold: number, fillColor: string, scale: number) {
      const radius = 5;
      this.threshold = threshold;
      this.path = `M 0, 0
        m -${radius}, 0
        a ${radius},${radius} 0 1,0 ${radius * 2},0
        a ${radius},${radius} 0 1,0 -${radius * 2},0`;
      this.fillColor = fillColor;
      this.fillOpacity = 1;
      this.strokeWeight = 0;
      this.rotation = 0;
      this.scale = scale;
      this.anchor = new google.maps.Point(0, 0);
    }
  }

  const coveredColor = "red";
  const uncoveredColor = "DimGray";

  const icons: Record<string, Record<string, { icon: Location }>> = {
    true: {
      "0": {
        icon: new Location(0, coveredColor, 1)
      },
      "1": {
        icon: new Location(1000000, coveredColor, 1.5)
      },
      "2": {
        icon: new Location(2000000, coveredColor, 2)
      },
      "3": {
        icon: new Location(3000000, coveredColor, 2.5)
      },
      "4": {
        icon: new Location(3987456, coveredColor, 3)
      }
    },
    false: {
      "0": {
        icon: new Location(0, uncoveredColor, 1)
      },
      "1": {
        icon: new Location(1000000, uncoveredColor, 1.5)
      },
      "2": {
        icon: new Location(2000000, uncoveredColor, 2)
      },
      "3": {
        icon: new Location(3000000, uncoveredColor, 2.5)
      },
      "4": {
        icon: new Location(3987456, uncoveredColor, 3)
      }
    }
  };

  const locations = [
    {
      position: new google.maps.LatLng(43.3953, -84.5378),
      covered: false,
      size: "0"
    },
    {
      position: new google.maps.LatLng(37.3943, -107.6955),
      covered: true,
      size: "1"
    },
    {
      position: new google.maps.LatLng(33.91747, -118.22912),
      covered: true,
      size: "1"
    },
    {
      position: new google.maps.LatLng(40.9191, -115.22907),
      covered: false,
      size: "0"
    },
    {
      position: new google.maps.LatLng(34.91725, -115.23011),
      covered: true,
      size: "1"
    },
    {
      position: new google.maps.LatLng(35.91872, -113.23089),
      covered: false,
      size: "0"
    },
    {
      position: new google.maps.LatLng(42.91784, -100.23094),
      covered: false,
      size: "0"
    },
    {
      position: new google.maps.LatLng(45.91682, -89.23149),
      covered: true,
      size: "1"
    },
    {
      position: new google.maps.LatLng(37.9179, -93.23463),
      covered: true,
      size: "1"
    },
    {
      position: new google.maps.LatLng(41.91666, -75.23468),
      covered: true,
      size: "2"
    },
    {
      position: new google.maps.LatLng(30.916988, -83.23364),
      covered: true,
      size: "2"
    },
    {
      position: new google.maps.LatLng(35.9166, -87.2287),
      covered: true,
      size: "1"
    },
    {
      position: new google.maps.LatLng(40.9163, -92.2293),
      covered: false,
      size: "0"
    },
    {
      position: new google.maps.LatLng(41.9166, -85.2282),
      covered: true,
      size: "1"
    },
    {
      position: new google.maps.LatLng(36.9195, -110.2311),
      covered: true,
      size: "2"
    },
    {
      position: new google.maps.LatLng(33.916, -85.2328),
      covered: true,
      size: "3"
    },
    {
      position: new google.maps.LatLng(33.918, -95.2344),
      covered: true,
      size: "4"
    },
    {
      position: new google.maps.LatLng(47.9181, -98.2346),
      covered: true,
      size: "3"
    },
    {
      position: new google.maps.LatLng(46.9172, -110.2334),
      covered: true,
      size: "3"
    },
    {
      position: new google.maps.LatLng(33.9172, -99.2334),
      covered: true,
      size: "3"
    }
  ];

  // for (let i = 0; i < locations.length; i++) {
  //   const marker = new google.maps.Marker({
  //     position: locations[i].position,
  //     icon: icons[locations[i].covered.toString()][locations[i].size].icon,
  //     map: map
  //   });
  //   var data =
  //     "R12: $ <b>xxxxx</b><br/>Covered<br/>Street<br/>City, state<br/>View Location";
  //   var infowindow = new google.maps.InfoWindow({
  //     content: data
  //   });
  //   google.maps.event.addListener(marker, "click", function () {
  //     infowindow.open(map, marker);
  //   });
  // }

  function getRandom(min, max) {
    return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
  }

  function getRandomInt(min, max) {
    return Math.ceil(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  var markers = [];

  for (let i = 0; i < 1000; i++) {
    var latitude = getRandom(33, 47);
    var longitude = getRandom(-68, -126);
    var covered = Math.random() < 0.5;
    var size = getRandomInt(0, 4);
    var data =
      "R12: $ <b>xxxxx</b><br/>Covered<br/>Street<br/>City, state<br/>View Location";

    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      icon: icons[covered.toString()][size].icon,
      map: map
    });
    var infowindow = new google.maps.InfoWindow({
      content: data
    });
    google.maps.event.addListener(marker, "click", function () {
      infowindow.open(map, marker);
    });
    if (size < 3) {
      markers.push(marker);
    }
  }

  new MarkerClusterer({ markers, map });

  const legend = document.getElementById("legend") as HTMLElement;

  for (const key in icons[true.toString()]) {
    const icon = icons[true.toString()][key].icon;
    const threshold = icon.threshold;
    const path = icon.path;
    const div = document.createElement("div");

    div.innerHTML =
      '<svg height="20" width="20"><path d="' +
      path +
      '"/></svg> ' +
      "$ " +
      threshold;

    legend.appendChild(div);
  }

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
  map.setOptions({
    styles: [
      {
        featureType: "administrative.country",
        elementType: "geometry.fill",
        stylers: [{ visibility: "on" }]
      },
      {
        featureType: "administrative.country",
        elementType: "geometry.stroke",
        stylers: [{ color: "#bdc5c9" }, { visibility: "on" }, { weight: 3 }]
      },
      {
        featureType: "administrative.country",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "administrative.land_parcel",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "administrative.locality",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "administrative.neighborhood",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "administrative.province",
        stylers: [{ color: "#a19430" }, { visibility: "on" }]
      },
      {
        featureType: "administrative.province",
        elementType: "geometry.fill",
        stylers: [{ color: "#bc346a" }, { visibility: "off" }]
      },
      {
        featureType: "administrative.province",
        elementType: "geometry.stroke",
        stylers: [{ color: "#bdc5c9" }, { weight: 3 }]
      },
      {
        featureType: "administrative.province",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      },
      { featureType: "landscape", stylers: [{ visibility: "on" }] },
      {
        featureType: "landscape.man_made",
        stylers: [{ color: "#bc346a" }, { visibility: "off" }]
      },
      {
        featureType: "landscape.natural",
        stylers: [{ color: "#ffffff" }, { visibility: "on" }]
      },
      { featureType: "poi", stylers: [{ visibility: "off" }] },
      { featureType: "road", stylers: [{ visibility: "off" }] },
      { featureType: "transit", stylers: [{ visibility: "off" }] },
      { featureType: "water", stylers: [{ color: "#BDC5C9" }] },
      {
        featureType: "water",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
