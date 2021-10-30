import React, { Component } from "react";
import CircularProgress from '@mui/material/CircularProgress';

class LoadingPanel extends Component {
    render() {
        const stylesheet = {
            displayLoadingPanel: {
                width: "100%",
                height: "100%",
                zIndex: "1000",
                backgroundColor: "white",
                display: "flex",
                position: "absolute",
                top: "0",
                left: "0",
            },
            loadingObject: {
                width: "100%",
                height: "100%",
                display: "flex"
            },
            centerObject: {
                margin: "auto"
            },

        }

        return (
            <div style={stylesheet.displayLoadingPanel}>
                <div style={stylesheet.loadingObject}>
                    <CircularProgress color="primary" style={stylesheet.centerObject} />
                </div>
            </div>
        );
    }
}

export default LoadingPanel;