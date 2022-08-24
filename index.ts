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

  const icons: Record<string, Record<string, { rasterIcon }>> = {
    true: {
      "0": {
        rasterIcon: {
          url: "covered_location.png",
          scaledSize: new google.maps.Size(5, 5)
        }
      },
      "1": {
        rasterIcon: {
          url: "covered_location.png",
          scaledSize: new google.maps.Size(8, 8)
        }
      },
      "2": {
        rasterIcon: {
          url: "covered_location.png",
          scaledSize: new google.maps.Size(12, 12)
        }
      },
      "3": {
        rasterIcon: {
          url: "covered_location.png",
          scaledSize: new google.maps.Size(16, 16)
        }
      },
      "4": {
        rasterIcon: {
          url: "covered_location.png",
          scaledSize: new google.maps.Size(20, 20)
        }
      }
    },
    false: {
      "0": {
        rasterIcon: {
          url: "uncovered_location.png",
          scaledSize: new google.maps.Size(5, 5)
        }
      },
      "1": {
        rasterIcon: {
          url: "uncovered_location.png",
          scaledSize: new google.maps.Size(8, 8)
        }
      },
      "2": {
        rasterIcon: {
          url: "uncovered_location.png",
          scaledSize: new google.maps.Size(12, 12)
        }
      },
      "3": {
        rasterIcon: {
          url: "uncovered_location.png",
          scaledSize: new google.maps.Size(16, 16)
        }
      },
      "4": {
        rasterIcon: {
          url: "uncovered_location.png",
          scaledSize: new google.maps.Size(20, 20)
        }
      }
    }
  };

  function getRandom(min, max) {
    return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
  }

  function getRandomInt(min, max) {
    return Math.ceil(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  var clusteredCoveredLocations = [];
  var clusteredUncoveredLocations = [];

  for (let i = 0; i < 10000; i++) {
    var latitude = getRandom(33, 47);
    var longitude = getRandom(-68, -126);
    var covered = Math.random() < 0.5;
    var size = getRandomInt(0, 4);
    var data =
      "R12: $ <b>xxxxx</b><br/>Covered<br/>Street<br/>City, state<br/>View Location";

    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      icon: icons[covered.toString()][size].rasterIcon,
      map: map
    });
    var infowindow = new google.maps.InfoWindow({
      content: data
    });
    google.maps.event.addListener(marker, "click", function () {
      infowindow.open(map, marker);
    });
    if (size < 3) {
      if (covered) {
        clusteredCoveredLocations.push(marker);
      } else {
        clusteredUncoveredLocations.push(marker);
      }
    }
  }

  const uncoveredClusterRenderer = {
    render: ({ count, position }) =>
      new google.maps.Marker({
        label: { text: String(count), color: "white", fontSize: "10px" },
        position,
        // adjust zIndex to be above other markers
        zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        icon: "uncovered_cluster.png"
      })
  };

  new MarkerClusterer({
    markers: clusteredCoveredLocations,
    map,
    renderer: uncoveredClusterRenderer
  });

  const coveredClusterRenderer = {
    render: ({ count, position }) =>
      new google.maps.Marker({
        label: { text: String(count), color: "white", fontSize: "10px" },
        position,
        // adjust zIndex to be above other markers
        zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        icon: "covered_cluster.png"
      })
  };

  new MarkerClusterer({
    markers: clusteredUncoveredLocations,
    map,
    renderer: coveredClusterRenderer
  });

  const legend = document.getElementById("legend") as HTMLElement;

  for (const key in icons[true.toString()]) {
    const icon = icons[true.toString()][key].rasterIcon;
    const threshold = icon.threshold;
    const div = document.createElement("div");

    div.innerHTML =
      '<img src="' +
      icon.url +
      '" width="' +
      icon.scaledSize.width +
      '" height="' +
      icon.scaledSize.height +
      '"/> ' +
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
