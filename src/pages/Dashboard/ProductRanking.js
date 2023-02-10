import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { Typography, Grid } from "@mui/material";

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

const INITIAL_STATE = {

}

class ProductRanking extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
    }

    render() {
        const data = this.props.data[0]

        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} style={{ height: '29vh', overflowX: 'hidden', }} >
                    <Grid item>
                        <Grid item container spacing={2}>
                            {
                                data.map((product) => {
                                    return (
                                        <>
                                            <Grid item xs={1} sm={1} md={1} style={{ display: "flex", justifyContent: "center" }}>
                                                <Typography variant="subtitle2" style={{ fontWeight: "bold", }}>{product.ranking}</Typography>
                                            </Grid>
                                            <Grid item xs={2} sm={2} md={2} style={{ display: "flex", justifyContent: "center" }}>
                                                <img src={product.productImg} width="80%" style={{ objectFit: "contain" }} />
                                            </Grid>
                                            <Grid item xs={7} sm={7} md={7}>
                                                <Typography variant="subtitle2" style={{ fontWeight: "bold", }}>{product.productName}</Typography>
                                                <Typography variant="caption" style={{ color: "grey" }}>RM {product.productPrice}</Typography>
                                            </Grid>
                                            <Grid item xs={2} sm={2} md={2}>
                                                <Typography variant="subtitle2" style={{ fontWeight: "bold", display: "flex", justifyContent: "center" }}>{product.total}</Typography>
                                            </Grid>
                                        </>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductRanking);