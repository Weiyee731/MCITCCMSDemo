import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { Card, CardContent, CardHeader, Grid, Typography, } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[5],
        fontSize: 14,
        padding: '0.5vw',
    },
}));

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

const INITIAL_STATE = {
    openModal: false,
    openFullScreenModal: false,
    statisticData: [
        { title: "Nett Profit", amount: "RM 73,700", iconImg: 'https://img.icons8.com/ios/50/null/economic-improvement.png' },
        { title: "Expenditure", amount: "RM 32,000", iconImg: 'https://img.icons8.com/external-ddara-lineal-ddara/64/null/external-Expenditure-investment-ddara-lineal-ddara.png' },
        { title: "Operation Profit", amount: "RM 20,200", iconImg: "https://img.icons8.com/ios/50/null/total-sales-1.png" },
    ],
}

class MerchantDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }



    render() {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const d = new Date();
        let day = days[d.getDay()];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let month = months[d.getMonth()];
        const get_Complete_Today = d.getDate() + " " + month + " " + d.getFullYear()


        return (
            <Grid container spacing={1} style={{ padding: '25pt' }}>
                <Grid item xs={12} sm={12} style={{ display: 'flex', }} >
                    <Grid item xs={6} style={{ display: "flex", }}>
                        <Typography variant="h5" style={{ fontWeight: 700 }}>Welcome back, Brandon!</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography variant="h6" style={{ color: '#1f7429', }}>{day},&nbsp; {get_Complete_Today}</Typography>
                    </Grid>
                </Grid>
                <hr width="100%" style={{ marginBottom: "1.5vw" }} />
                <Grid item xs={12} sm={12}>
                    <Card elevation={3}>
                        <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Key Metrics</Typography>} />
                        <CardContent>
                            <Grid item container rowSpacing={2} spacing={1}>
                                {/* {
                                        this.state.statisticData.filter((y) => y.key === this.state.key).map((x) => {
                                            return ( */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card elevation={2}>
                                        <CardHeader title={
                                            <Grid style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <Typography variant="subtitle1" style={{ fontWeight: 700 }}>Sales</Typography>
                                                <Grid >
                                                    <LightTooltip placement="top-start"
                                                        title="Total value of paid orders over the selected time period, 
                                                        including sales from cancelled and return/refund orders. This value is equivalent to the final amount during checkout." >
                                                        <IconButton>
                                                            <HelpOutlineOutlinedIcon style={{ width: "80%" }} />
                                                        </IconButton>
                                                    </LightTooltip>
                                                </Grid>
                                            </Grid>
                                        } />
                                        <CardContent>
                                            <Typography variant="subtitle1" style={{ fontWeight: 700 }}>RM 40.00</Typography>
                                            <Typography variant="subtitle1" style={{ fontWeight: 700 }}>RM 40.00</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card elevation={2}>
                                        <CardHeader title={
                                            <Grid style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <Typography variant="subtitle1" style={{ fontWeight: 700 }}>Sales</Typography>
                                                <Grid >
                                                    <LightTooltip placement="top-start"
                                                        title="Total value of paid orders over the selected time period, 
                                                        including sales from cancelled and return/refund orders. This value is equivalent to the final amount during checkout." >
                                                        <IconButton>
                                                            <HelpOutlineOutlinedIcon style={{ width: "80%" }} />
                                                        </IconButton>
                                                    </LightTooltip>
                                                </Grid>
                                            </Grid>
                                        } />
                                        <CardContent>
                                            ssss
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card elevation={2}>
                                        <CardHeader title={
                                            <Grid style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <Typography variant="subtitle1" style={{ fontWeight: 700 }}>Sales</Typography>
                                                <Grid >
                                                    <LightTooltip placement="top-start"
                                                        title="Total value of paid orders over the selected time period, 
                                                        including sales from cancelled and return/refund orders. This value is equivalent to the final amount during checkout." >
                                                        <IconButton>
                                                            <HelpOutlineOutlinedIcon style={{ width: "80%" }} />
                                                        </IconButton>
                                                    </LightTooltip>
                                                </Grid>
                                            </Grid>
                                        } />
                                        <CardContent>
                                            ssss
                                        </CardContent>
                                    </Card>
                                </Grid>
                                {/* )
                                        })
                                    } */}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MerchantDashboard);