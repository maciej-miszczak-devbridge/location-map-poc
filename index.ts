/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let map: google.maps.Map;

async function initMap(): Promise<void> {
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
          scaledSize: new google.maps.Size(2, 2)
        }
      },
      "1": {
        rasterIcon: {
          url: "covered_location.png",
          scaledSize: new google.maps.Size(3, 3)
        }
      },
      "2": {
        rasterIcon: {
          url: "covered_location.png",
          scaledSize: new google.maps.Size(6, 6)
        }
      },
      "3": {
        rasterIcon: {
          url: "covered_location.png",
          scaledSize: new google.maps.Size(9, 9)
        }
      },
      "4": {
        rasterIcon: {
          url: "covered_location.png",
          scaledSize: new google.maps.Size(12, 12)
        }
      }
    },
    false: {
      "0": {
        rasterIcon: {
          url: "uncovered_location.png",
          scaledSize: new google.maps.Size(2, 2)
        }
      },
      "1": {
        rasterIcon: {
          url: "uncovered_location.png",
          scaledSize: new google.maps.Size(3, 3)
        }
      },
      "2": {
        rasterIcon: {
          url: "uncovered_location.png",
          scaledSize: new google.maps.Size(6, 6)
        }
      },
      "3": {
        rasterIcon: {
          url: "uncovered_location.png",
          scaledSize: new google.maps.Size(9, 9)
        }
      },
      "4": {
        rasterIcon: {
          url: "uncovered_location.png",
          scaledSize: new google.maps.Size(12, 12)
        }
      }
    }
  };

  function getRandom(min, max) {
    return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
  }

  function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  const locationsNumberParameter = new URLSearchParams(
    window.location.search
  ).get("number_of_locations");

  const locationsNumber = parseInt(
    locationsNumberParameter == null ? "600" : locationsNumberParameter,
    10
  );

  const organizationId = new URLSearchParams(window.location.search).get(
    "organization_id"
  );

  var locationMarkers: google.maps.Marker[] = [];
  var locationClusterMarkers: google.maps.Marker[] = [];

  class StateData {
    public locationCount: number;
    constructor(public latitude: number, public longitude: number) {
      this.locationCount = 0;
    }
  }

  const states: Record<string, StateData> = {
    AL: new StateData(32.834722, -86.633333),
    AK: new StateData(64.731667, -152.47),
    AZ: new StateData(34.566667, -111.856111),
    AR: new StateData(34.742222, -92.285833),
    CA: new StateData(37.166111, -119.449444),
    CO: new StateData(39, -105.545167),
    CT: new StateData(41.81, -72.73),
    DE: new StateData(38.98, -75.511667),
    DC: new StateData(38.904167, -77.016111),
    FL: new StateData(28.681389, -82.46),
    GA: new StateData(32.662111, -83.438306),
    HI: new StateData(20.86774, -156.61706),
    ID: new StateData(44.269722, -114.734444),
    IL: new StateData(39.739306, -89.503639),
    IN: new StateData(39.766028, -86.441278),
    IA: new StateData(42.037778, -93.466389),
    KS: new StateData(38.466667, -98.766667),
    KY: new StateData(37.62, -84.87),
    LA: new StateData(31, -92),
    ME: new StateData(45.253333, -69.233333),
    MD: new StateData(39, -77),
    MA: new StateData(42.377117, -71.925258),
    MI: new StateData(44.34, -85.58),
    MN: new StateData(46.49, -94.07),
    MO: new StateData(38.22, -92.43),
    MS: new StateData(32.75, -89.52),
    MT: new StateData(47.064444, -109.666944),
    NE: new StateData(41.525, -99.861667),
    NV: new StateData(39.95, -117.03),
    NH: new StateData(43.52, -71.42),
    NJ: new StateData(40.07, -74.558333),
    NM: new StateData(34.438056, -106.112222),
    NY: new StateData(42.91, -75.67),
    NC: new StateData(35.7, -79.26),
    ND: new StateData(47.58, -100.34),
    OH: new StateData(40.304444, -82.695556),
    OK: new StateData(35.48, -97.53),
    OR: new StateData(44.13, -120.36),
    PA: new StateData(40.91, -77.82),
    RI: new StateData(41.671667, -71.576667),
    SC: new StateData(33.836944, -80.925),
    SD: new StateData(44.39, -99.99),
    TN: new StateData(35.84, -86.42),
    TX: new StateData(31.391533, -99.17065),
    UT: new StateData(39.308056, -111.638889),
    VT: new StateData(44.27, -72.62),
    VA: new StateData(37.57, -78.53),
    WA: new StateData(47.88, -120.64),
    WV: new StateData(38.7, -80.73),
    WI: new StateData(44.437778, -90.130186),
    WY: new StateData(43, -107.545167)
  };

  const stateKeys = Object.keys(states);

  if (organizationId === null) {
    for (let i = 0; i < locationsNumber; i++) {
      const state = stateKeys[getRandomInt(0, stateKeys.length - 1)];

      if (states[state].locationCount === undefined) {
        states[state].locationCount = 1;
      } else {
        states[state].locationCount += 1;
      }
      let latitude = states[state].latitude + getRandom(-1, 1);
      let longitude = states[state].longitude + getRandom(-1, 1);
      let covered = Math.random() < 0.5;
      let size = getRandomInt(0, 3);
      let data =
        "R12: $ <b>xxxxx</b><br/>Covered<br/>Street<br/>City, state<br/>View Location";

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        icon: icons[covered.toString()][size].rasterIcon,
        map: map,
        visible: false,
        optimized: true,
        state: state
      });
      locationMarkers.push(marker);
      const infowindow = new google.maps.InfoWindow({
        content: data
      });
      google.maps.event.addListener(marker, "click", function () {
        infowindow.open(map, marker);
      });
    }
    if (locationsNumber >= 10000) {
      for (const state in states) {
        const markerPosition = new google.maps.LatLng(
          states[state].latitude,
          states[state].longitude
        );
        var marker = new google.maps.Marker({
          position: markerPosition,
          icon: {
            anchor: new google.maps.Point(33, 33),
            url: "covered_cluster.png"
          },
          label: states[state].locationCount.toString(),
          map: map,
          // optimized: true
          state: state
        });
        locationClusterMarkers.push(marker);
        google.maps.event.addListener(marker, "click", function () {
          map.setCenter(markerPosition);
          map.setZoom(8);
          locationClusterMarkers.forEach((marker) => marker.setVisible(false));
          locationMarkers.forEach((marker) => {
            if (marker.state === state) {
              marker.setVisible(true);
            }
          });
        });
      }
    } else {
      locationMarkers.forEach((marker) => marker.setVisible(true));
    }
  } else {
    const response = await window.fetch(
      `https://localhost/customer/customer-api/api-intelligence/v1/organizations/${organizationId}`,
      {
        method: "GET"
      }
    );

    const { data, errors } = await response.json();
    if (response.ok) {
      const locations = data?.locations;
      if (locations) {
        locations.array.forEach((location) => {
          console.log(
            `Location ${location.id}: ${location.latitude}, ${location.longitude}`
          );
        });
      } else {
        return Promise.reject(new Error(`No locations`));
      }
    } else {
      const error = new Error(
        errors?.map((e) => e.message).join("\n") ?? "unknown"
      );
      return Promise.reject(error);
    }
  }

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
  map.addListener("zoom_changed", () => {
    if (map.getZoom() < 7) {
      locationMarkers.forEach((marker) => marker.setVisible(false));
      locationClusterMarkers.forEach((marker) => marker.setVisible(true));
    }
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
