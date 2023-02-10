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
import Up from '../../assets/iconUp.png'
import Down from '../../assets/iconDown.png'
import { toast } from "react-toastify";
import { isArrayNotEmpty } from "../../tools/Helpers";
import MarketingCampaigns from "./MarketingCampaign";
import FullWidthTabs from "../../components/TabsComponent/Tabs";
import ProductRanking from "./ProductRanking";
import Logo from "../../assets/MyEmporia Logo.png";

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
    cardData: [
        {
            id: 1, title: 'Sales', amount: "RM530.50", color: "#30b566", difference: "21.5%", icon: Up,
            dateDetails: ["3/2/2023", "4/2/2023", "5/2/2023", "6/2/2023", "7/2/2023", "8/2/2023",],
            amountDetails: [100.50, 60.00, 70.50, 180.50, 50.50, 680.50],
            tooltipdetails: "Total value of paid orders over the selected time period, including sales from cancelled and return/refund orders. This value is equivalent to the final amount during checkout.",
        },
        {
            id: 2, title: 'Orders', amount: "53", color: "#30b566", difference: "21.5%", icon: Up,
            dateDetails: ["3/2/2023", "4/2/2023", "5/2/2023", "6/2/2023", "7/2/2023", "8/2/2023",],
            amountDetails: [25, 8, 7, 4, 5, 4],
            tooltipdetails: "Total number of paid orders, including cancelled or return/refund orders.",
        },
        {
            id: 3, title: 'Visitors', amount: "92", color: "#A10B0B", difference: "1.5%", icon: Down,
            dateDetails: ["3/2/2023", "4/2/2023", "5/2/2023", "6/2/2023", "7/2/2023", "8/2/2023",],
            amountDetails: [10, 20, 10, 15, 30, 7],
            tooltipdetails: "Total number of unique visitors who viewed your shop and product detail pages. Multiple views of one page by the same visitor is counted as 1 unique visitor.",
        },
        {
            id: 4, title: "Conversion Rate", amount: "57.6%", color: "#30b566", difference: "21.5%", icon: Up,
            dateDetails: ["3/2/2023", "4/2/2023", "5/2/2023", "6/2/2023", "7/2/2023", "8/2/2023",],
            amountDetails: [250, 40, 70, 26.67, 16.67, 57.14],
            tooltipdetails: "The number of unique buyers who paid orders divided by total number of unique visitors.",
        },
        {
            id: 5, title: "Cancelled Orders", amount: "10", color: "#A10B0B", difference: "1.5%", icon: Down,
            dateDetails: ["3/2/2023", "4/2/2023", "5/2/2023", "6/2/2023", "7/2/2023", "8/2/2023",],
            amountDetails: [2, 1, 0, 2, 3, 2],
            tooltipdetails: "Total number of paid orders that were cancelled. Cancelled orders are recorded based on the date they were placed, and not the date of cancellation.",
        },
        {
            id: 6, title: "Returned/Refunded Orders", amount: "0", color: "#30b566", difference: "21.5%", icon: Up,
            dateDetails: ["3/2/2023", "4/2/2023", "5/2/2023", "6/2/2023", "7/2/2023", "8/2/2023",],
            amountDetails: [0, 0, 0, 0, 0, 0],
            tooltipdetails: "Total number of paid orders that were returned/refunded, recorded based on the date these orders were paid for, and not the date of return/refund. An order is counted as returned/refunded only if all products in the same order were returned/refunded.",
        },
    ],
    graphData: [],
    headerDetail: [
        { index: 0, headerName: "By Sales", },
        { index: 1, headerName: "By Units" },
        { index: 2, headerName: "By In Cart" },
    ],
    productByType: [
        {
            typeid: 1, typeName: "Sales",
            productDetails: [
                { productID: 1, productName: "Blimax Cordless Drill 12V", productPrice: 99.00, ranking: 1, total: 792, productImg: Logo },
                { productID: 3, productName: "King's Shoes Kwd301 -N - 08", productPrice: 228.9, ranking: 2, total: 457.8, productImg: Logo },
                { productID: 4, productName: "Starweld Mig Wire 15kg", productPrice: 129, ranking: 3, total: 258, productImg: Logo },
                { productID: 2, productName: "Glove Box *50", productPrice: 34, ranking: 4, total: 204, productImg: Logo },
            ]
        },
        {
            typeid: 2, typeName: "Units",
            productDetails: [
                { productID: 1, productName: "Blimax Cordless Drill 12V", productPrice: 99.00, ranking: 1, total: 8, productImg: Logo },
                { productID: 2, productName: "Glove Box *50", productPrice: 34, ranking: 2, total: 6, productImg: Logo },
                { productID: 3, productName: "King's Shoes Kwd301 -N - 08", productPrice: 228.9, ranking: 3, total: 2, productImg: Logo },
                { productID: 4, productName: "Starweld Mig Wire 15kg", productPrice: 129, ranking: 4, total: 2, productImg: Logo },
            ]
        },
        {
            typeid: 3, typeName: "Added to Cart",
            productDetails: [
                { productID: 1, productName: "Blimax Cordless Drill 12V", productPrice: 99.00, ranking: 1, total: 2, productImg: Logo },
                { productID: 3, productName: "King's Shoes Kwd301 -N - 08", productPrice: 228.9, ranking: 2, total: 1, productImg: Logo },
                { productID: 4, productName: "Starweld Mig Wire 15kg", productPrice: 129, ranking: 3, total: 0, productImg: Logo },
                { productID: 2, productName: "Glove Box *50", productPrice: 34, ranking: 4, total: 0, productImg: Logo },
            ]
        },
    ]
}

class MerchantDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

    }

    componentDidMount() {
        if (this.state.graphData.length === 0 && isArrayNotEmpty(this.state.cardData)) {
            const selectedData = [{
                name: this.state.cardData[0].title,
                data: this.state.cardData[0].amountDetails
            }]
            this.setState({ graphData: selectedData, })
        }
    }

    componentDidUpdate(prevProps, prevState) {

    }

    handleClick(data) {
        const selectedData = {
            name: data.title,
            data: data.amountDetails
        }

        let listing = this.state.graphData
        if (isArrayNotEmpty(listing) && listing.filter((x) => x.name === data.title).length > 0) {
            listing = listing.filter((x) => x.name !== data.title)
        }
        else {
            if (listing.length < 4) {
                listing.push(selectedData)
            }
            else
                toast.info("The maximum number of metrics you can select is 4")

        }
        this.setState({ graphData: listing, })
    }


    render() {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const d = new Date();
        let day = days[d.getDay()];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let month = months[d.getMonth()];
        const get_Complete_Today = d.getDate() + " " + month + " " + d.getFullYear()

        const eventSeries = this.state.graphData

        const eventOptions = {
            chart: {
                height: 200,
                type: 'line',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: { show: false },
            },
            colors: ['#FFA701', '#E3242B', '#77B6EA', '#545454'],
            dataLabels: { enabled: false, },
            stroke: { curve: 'smooth', width: 1.5 },
            tooltip: {
                enabled: true,
                enabledOnSeries: undefined,
                shared: true,
                followCursor: false,
                intersect: false,
                inverseOrder: false,
                custom: undefined,
                fillSeriesColor: true,
                theme: true,
                style: { fontSize: '12px', },
                onDatasetHover: { highlightDataSeries: true, },
            },
            xaxis: {
                categories: this.state.cardData[0].dateDetails,
            },
        }

        const headerDetails = this.state.headerDetail.map((x) => x.headerName)
        let bodyDetail = [
            { index: 0, children: <ProductRanking data={this.state.productByType.length > 0 && this.state.productByType.filter((y) => y.typeid === 1).map((x) => x.productDetails.map((x) => x))} />, value: 0, },
            { index: 1, children: <ProductRanking data={this.state.productByType.length > 0 && this.state.productByType.filter((y) => y.typeid === 2).map((x) => x.productDetails.map((x) => x))} />, value: 1, },
            { index: 2, children: <ProductRanking data={this.state.productByType.length > 0 && this.state.productByType.filter((y) => y.typeid === 3).map((x) => x.productDetails.map((x) => x))} />, value: 2, },
        ]
        const bodyDetails = bodyDetail.map((x) => x.children)

        return (
            <Grid container spacing={2} style={{ padding: '25pt' }}>
                <Grid item xs={12} sm={12} style={{ display: 'flex', }} >
                    <Grid item xs={6} style={{ display: "flex", }}>
                        <Typography variant="h5" style={{ fontWeight: 700 }}>Welcome back, Brandon!</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography variant="h6" style={{ color: '#1f7429', }}>{day},&nbsp; {get_Complete_Today}</Typography>
                    </Grid>
                </Grid>
                <hr width="100%" style={{ marginBottom: "0.5vw" }} />
                <Grid item xs={12} sm={12}>
                    <Card elevation={3}>
                        <CardHeader title={
                            <>
                                <Typography variant="h6" style={{ fontWeight: 700 }}>To Do List</Typography>
                                <Typography variant="caption" style={{ color: "grey" }}>Important things you have to take note of</Typography>
                            </>
                        } />
                        <CardContent>
                            <Grid item container rowSpacing={2} spacing={2}>
                                <Grid item xs={12} sm={4} md={3} style={{ display: "flex", flexDirection: "column", alignItems: "center", borderRight: "1px solid grey" }}>
                                    <Typography variant="subtitle1" style={{ color: "blue", }}>0</Typography>
                                    <Typography variant="caption" style={{ color: "grey" }}>To Process Shipping</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} md={3} style={{ display: "flex", flexDirection: "column", alignItems: "center", borderRight: "1px solid grey" }}>
                                    <Typography variant="subtitle1" style={{ color: "blue", }}>0</Typography>
                                    <Typography variant="caption" style={{ color: "grey" }}>Pending cancellation</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} md={3} style={{ display: "flex", flexDirection: "column", alignItems: "center", borderRight: "1px solid grey" }}>
                                    <Typography variant="subtitle1" style={{ color: "blue", }}>0</Typography>
                                    <Typography variant="caption" style={{ color: "grey" }}>Pending Refund</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} md={3} style={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
                                    <Typography variant="subtitle1" style={{ color: "blue", }}>0</Typography>
                                    <Typography variant="caption" style={{ color: "grey" }}>Sold Out Product</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Card elevation={3}>
                        <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Key Metrics</Typography>} />
                        <CardContent>
                            <Grid item container rowSpacing={2} spacing={1}>
                                {
                                    this.state.cardData.map((x, idx) => {
                                        return (
                                            <Grid item xs={12} sm={6} md={2}>
                                                <Card onClick={() => this.handleClick(x)} style={{ cursor: "pointer" }}>
                                                    <CardContent>
                                                        <Grid style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                            <Typography variant="subtitle2" style={{ fontWeight: 700 }}>{x.title}</Typography>
                                                            <Grid >
                                                                <LightTooltip placement="top-start"
                                                                    title={x.tooltipdetails} >
                                                                    <IconButton>
                                                                        <HelpOutlineOutlinedIcon style={{ width: "80%" }} />
                                                                    </IconButton>
                                                                </LightTooltip>
                                                            </Grid>
                                                        </Grid>
                                                        <Typography variant="subtitle2" style={{ fontWeight: 600 }}>{x.amount}</Typography>
                                                        <Grid style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                                                            <Typography variant="caption" style={{ color: "grey" }}>vs previous week</Typography>
                                                            <Typography variant="caption" style={{ color: x.color, }}>
                                                                <img src={x.icon} width="20%" /> {x.difference}
                                                            </Typography>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                            <ReactApexChart options={eventOptions} series={eventSeries} type="area" height={400} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <Card elevation={3}>
                        <CardHeader title={<>
                            <Typography variant="h6" style={{ fontWeight: 700 }}>Marketing Centre</Typography>
                            <Typography variant="caption" style={{ color: "grey" }}>Marketing Tools & Nominations for Promotion</Typography>
                        </>} />
                        <CardContent>
                            <MarketingCampaigns />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <Card elevation={3}>
                        <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Product Ranking (Top 10)</Typography>} />
                        <CardContent>
                            <FullWidthTabs settings={{ Headers: headerDetails, Body: bodyDetails }} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MerchantDashboard);