import React, { Component } from "react";
import {
    Map,
    GoogleApiWrapper,
    InfoWindow,
    Marker,
    Polygon,
} from "google-maps-react";
import { toast } from "react-toastify";
export class GoogleMaps extends Component {

    constructor(props) {
        super(props);
        // this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    state = {
        showingInfoWindow: true,
        activeMarker: {},
        selectedPlace: {},
        center: { lng: this.props.longitude, lat: this.props.latitude },
        markerLabel: this.props.markerLabel,
        width: this.props.width,
        height: this.props.height,
        markers: [],
        id: [],
        counter: 0,
        path: new window.google.maps.MVCArray(),
        LocationToBeSent: null,
    };

    render() {

        const poly = new window.google.maps.Polygon({
            strokeWeight: 2,
            fillColor: "#5555FF",
        });

        console.log("POLY112345", poly)
        var id;

        const onMapClicked = (props, map, e) => {
            console.log("mapmap", map)
            var marker = new window.google.maps.Marker({
                position: { lat: e.latLng.lat(), lng: e.latLng.lng() },
                map: map,
                draggable: true,
                key: this.state.counter.toString(),
            });
            id = marker.__gm_id;
            this.setState({
                markers: [...this.state.markers, marker],
            });
            // toast.success(this.state.markers.map((marker) => marker.key));
            window.google.maps.event.addListener(marker, "rightclick", function (
                point
            ) {
                onMarkerClick(marker);
            });
            window.google.maps.event.addListener(marker, "drag", function (evt) {
                // toast.success(marker.position.lat() + "  " + marker.position.lng());
                handleDrag(marker, map);
            });
            if (this.state.counter === 0) {
                // toast.success("ran once");
                poly.setPaths(new window.google.maps.MVCArray([this.state.path]));
                poly.setMap(map);

                this.state.path.insertAt(this.state.path.length, {
                    lat: e.latLng.lat,
                    lng: e.latLng.lng,
                });
            } else {

                // toast.success("ran again");
                this.state.path.setAt(this.state.path.length, {
                    lat: e.latLng.lat,
                    lng: e.latLng.lng,
                });

                // toast.success("lat: " + e.latLng.lat(),
                //     "lng: " + e.latLng.lng() + " path: " + this.state.path.length);
            }

            this.setState({ counter: this.state.counter + 1 });
            if (this.state.markers.length > 0) {
                this.setState({
                    LocationToBeSent:
                        "POLYGON((" +
                        this.state.markers.map(
                            (marker) => marker.position.lng() + " " + marker.position.lat()
                        ) +
                        "," +
                        this.state.markers[0].position.lng() +
                        " " +
                        this.state.markers[0].position.lat() +
                        "))",
                });
            } else {
                this.setState({
                    LocationToBeSent: "",
                });
            }

            this.props.setValue(this.state.LocationToBeSent);
        }


        const onMarkerClick = (markerss) => {
            var newList = this.state.markers;
            this.state.markers.map((marker, i) => {
                if (marker.key === markerss.key) {
                    this.state.path.removeAt(i);
                }
            });
            newList = newList.filter(
                (markersKept) => markersKept.key !== markerss.key
            );
            this.setState({
                markers: newList,
            });

            // toast.success("key used: " + markerss.key + "path length: " + this.state.path.length);
            markerss.setMap(null);
            if (this.state.markers.length > 0) {
                this.setState({
                    LocationToBeSent:
                        "POLYGON((" +
                        this.state.markers.map(
                            (marker) => marker.position.lng() + " " + marker.position.lat()
                        ) +
                        "," +
                        this.state.markers[0].position.lng() +
                        " " +
                        this.state.markers[0].position.lat() +
                        "))",
                });
            } else {
                this.setState({
                    LocationToBeSent: "",
                });
            }
            this.props.setValue(this.state.LocationToBeSent);
            // toast.success(this.state.LocationToBeSent);
        };

        const handleDrag = (markerToBeUsed, mapToBeUsed) => {
            this.state.markers.map((marker, i) => {
                if (marker.key === markerToBeUsed.key) {
                    this.state.path.removeAt(i);
                    this.state.path.insertAt(i, {
                        lat: markerToBeUsed.position.lat,
                        lng: markerToBeUsed.position.lng,
                    });
                }
            });
            //   this.state.path.removeAt(markerToBeUsed.key);

            poly.setMap(mapToBeUsed);
            if (this.state.markers.length > 0) {
                this.setState({
                    LocationToBeSent:
                        "POLYGON((" +
                        this.state.markers.map(
                            (marker) => marker.position.lng() + " " + marker.position.lat()
                        ) +
                        "," +
                        this.state.markers[0].position.lng() +
                        " " +
                        this.state.markers[0].position.lat() +
                        "))",
                });
            } else {
                this.setState({
                    LocationToBeSent: "",
                });
            }

            this.props.setValue(this.state.LocationToBeSent);
            // toast.success(this.state.LocationToBeSent);
        };

        return (
            <div>
                {console.log("POLY112345", this.props.polypath)}
                {console.log("this.state MAP", this.state)}
                <Map
                    onClick={this.props.toView === undefined && onMapClicked}
                    google={this.props.google}
                    zoom={this.props.zoom ? this.props.zoom : 16}
                    style={{
                        width: this.state.width * 0.8,
                        height: this.state.height * 0.7,
                    }}
                    initialCenter={
                        this.state.center.lng && this.state.center.lat
                            ? this.state.center
                            : { lng: 110.43083708589963, lat: 1.5902418730321481 }
                    }
                    containerStyle={{
                        width: "100%",
                        height: "90%",
                        minHeight: "300px",
                        position: "relative",
                    }}
                >
                    {console.log("CHECKING", this.state)}
                    {this.props.polypath !== undefined && this.props.polypath.map((POLY) => {
                        return (
                            <Polygon
                                path={POLY.ShoplotCoordinate}
                                key={1}
                                editable={this.props.toView === undefined ? true : false}
                                options={{
                                    strokeColor: "#FF0000",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 3,
                                    fillColor: "#FF0000",
                                    fillOpacity: 0.35,
                                }}
                            />
                        );
                    })}
                    <InfoWindow
                        visible={this.state.showingInfoWindow}
                        onClose={this.onClose}
                    >
                        <div>
                            <h4>{this.state.selectedPlace.name}</h4>
                        </div>
                    </InfoWindow>
                </Map>
            </div>

        )
    }
}
export default GoogleApiWrapper({
    apiKey: "AIzaSyBtEc6iXwj2A_A-ft-GagAqEmJA4pYgidE",
})(GoogleMaps);
