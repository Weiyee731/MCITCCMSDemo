import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { Card, CardContent, CardHeader, Grid, Typography, } from "@mui/material";
import Logo from "../../assets/MyEmporia Logo.png";
import ReactApexChart from "react-apexcharts";
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';
import MarketingCampaigns from "./MarketingCampaign";
import moment from 'moment';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '4px 5px 4px 25px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

function mapStateToProps(state) {
    return {
        maindashboard: state.counterReducer["maindashboard"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallMainDashboard: (prodData) => dispatch(GitAction.CallMainDashboard(prodData)),
    };
}

const INITIAL_STATE = {
    openModal: false,
    openFullScreenModal: false,
    statisticData: [
        { title: "Nett Profit", amount: "RM 73,700", iconImg: 'https://img.icons8.com/ios/50/null/economic-improvement.png' },
        { title: "Expenditure", amount: "RM 32,000", iconImg: 'https://img.icons8.com/external-ddara-lineal-ddara/64/null/external-Expenditure-investment-ddara-lineal-ddara.png' },
        { title: "Operation Profit", amount: "RM 20,200", iconImg: "https://img.icons8.com/ios/50/null/total-sales-1.png" },
        { title: "Revenue", amount: "RM 93,900", iconImg: 'https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/null/external-revenue-investment-kiranshastry-lineal-kiranshastry.png' },
    ],
    saleBreakdownOverallly: [
        { id: 1, title: "Nett Profit", amount: 36 },
        { id: 2, title: "Shipping", amount: 6 },
        { id: 3, title: "Tax", amount: 2 },
        { id: 4, title: "Cost", amount: 3 },
        { id: 5, title: "Others", amount: 2.6 },
    ],
    year: '2023',
    yealySaleDummy: [
        {
            year: '2023',
            items: [
                { saleType: "Total Income", month: "Jan", amount: 28 },
                { saleType: "Total Income", month: "Feb", amount: 29 },
                { saleType: "Total Income", month: "Mar", amount: 33 },
                { saleType: "Total Income", month: "Apr", amount: 36 },
                { saleType: "Total Income", month: "May", amount: 32 },
                { saleType: "Total Income", month: "Jun", amount: 32 },
                { saleType: "Total Expenses", month: "Jan", amount: 12 },
                { saleType: "Total Expenses", month: "Feb", amount: 11 },
                { saleType: "Total Expenses", month: "Mar", amount: 14 },
                { saleType: "Total Expenses", month: "Apr", amount: 18 },
                { saleType: "Total Expenses", month: "May", amount: 17 },
                { saleType: "Total Expenses", month: "Jun", amount: 13 },]
        },
        {
            year: '2022',
            items: [
                { saleType: "Total Income", month: "Jan", amount: 30 },
                { saleType: "Total Income", month: "Feb", amount: 40 },
                { saleType: "Total Income", month: "Mar", amount: 33 },
                { saleType: "Total Income", month: "Apr", amount: 36 },
                { saleType: "Total Income", month: "May", amount: 29 },
                { saleType: "Total Income", month: "Jun", amount: 28 },
                { saleType: "Total Expenses", month: "Jan", amount: 25 },
                { saleType: "Total Expenses", month: "Feb", amount: 35 },
                { saleType: "Total Expenses", month: "Mar", amount: 30 },
                { saleType: "Total Expenses", month: "Apr", amount: 25 },
                { saleType: "Total Expenses", month: "May", amount: 28 },
                { saleType: "Total Expenses", month: "Jun", amount: 26 },]
        },
    ],
    latestProducts: [
        { id: 1, productName: "Daewoo 20v Cordless Rotary Hammer - Dalrh003", productPrice: 334.00, productImage: Logo },
        { id: 2, productName: "King's Shoes Kwd301 -N - 08", productPrice: 228.90, productImage: Logo },
        { id: 3, productName: "Starweld Mig Wire 15kg - 0.8mm 1.0mm 1.5mm", productPrice: 129.00, productImage: Logo },
        { id: 4, productName: "Blimax 12v Cordless Drill", productPrice: 99.00, productImage: Logo },
        { id: 5, productName: "King's Shoes Kws200 - N - 11", productPrice: 225.30, productImage: Logo },
    ],
    bestMerchants: [
        { id: 1, merchantName: "Brandon Kho", merchantShop: "Pending SDN. BHD", merchantProfile: 'https://img.icons8.com/bubbles/50/null/gemologist-male.png', productName: "Daewoo 20v Cordless Rotary Hammer - Dalrh003", },
        { id: 2, merchantName: "Edmund Wong", merchantShop: "Beauty Olive SDN. BHD", merchantProfile: 'https://img.icons8.com/bubbles/50/null/user.png', productName: "King's Shoes Kwd301 -N - 08", },
        { id: 3, merchantName: "Mr. Tsai", merchantShop: "Cahaya Hardware SDN. BHD", merchantProfile: 'https://img.icons8.com/bubbles/50/null/gemologist-male.png', productName: "Starweld Mig Wire 15kg - 0.8mm 1.0mm 1.5mm", },
        { id: 4, merchantName: "Mr. Alan", merchantShop: "Myemporia SDN. BHD", merchantProfile: 'https://img.icons8.com/bubbles/50/null/name.png', productName: "Blimax 12v Cordless Drill", },
        { id: 5, merchantName: "Mr. Jeffery", merchantShop: "Suria Industrial SDN. BHD", merchantProfile: 'https://img.icons8.com/bubbles/50/null/name.png', productName: "King's Shoes Kws200 - N - 11", },
    ],
}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

    }

    componentDidMount() {
        this.props.CallMainDashboard()
    }

    componentDidUpdate(prevProps, prevState) {

    }

    handleChange(event) {
        this.setState({ year: event.target.value });
    };

    render() {
        // console.log(this.props.maindashboard)
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const d = new Date();
        let day = days[d.getDay()];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let month = months[d.getMonth()];
        const get_Complete_Today = d.getDate() + " " + month + " " + d.getFullYear();


        const bestMerchants = this.props.maindashboard[0] !== undefined && JSON.parse(this.props.maindashboard[0].BestMerchant)
        const latestProducts = this.props.maindashboard[0] !== undefined && JSON.parse(this.props.maindashboard[0].LatestProducts)
        const yearlySalesSeriesData = this.props.maindashboard[0] !== undefined &&
            JSON.parse(this.props.maindashboard[0].SalesByYear).filter((y) => y.TransactionYear == this.state.year).map((x) => x.OrderTotalPaidAmount)
        const yearlySalesMonthlyData = this.props.maindashboard[0] !== undefined &&
            JSON.parse(this.props.maindashboard[0].SalesByYear).filter((y) => y.TransactionYear == this.state.year).map((x) => x.TransactionMonth)

        // const dbYearData = []
        // const dbYearlySaleYearData = this.props.maindashboard[0] !== undefined &&
        //     JSON.parse(this.props.maindashboard[0].SalesByYear).map((x) => {
        //         // !dbYearData.map((y) => y.includes(x.TransactionYear)) ? 
        //         //     dbYearData.push(x.TransactionYear)
        //         //     : ""
        //     })
        // console.log(dbYearlySaleYearData)


        const SalesBreakdownoptions = {
            chart: {
                width: 250,
                type: 'donut',
                // foreColor: "white",
            },
            plotOptions: {
                pie: {
                    // offsetY: 20,
                    startAngle: -90,
                    endAngle: 270,
                },
            },
            labels: this.state.saleBreakdownOverallly.map((x) => x.title),
            dataLabels: {
                enabled: false,
            },
            fill: {
                type: 'gradient',
            },
            legend: {
                formatter: function (val, opts) {
                    return val + " - " + opts.w.globals.series[opts.seriesIndex] + "K"
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 250
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
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
                style: { fontSize: '10px', },
                onDatasetHover: { highlightDataSeries: false, },
                y: { formatter: function (val) { return val + "K" } },
                fixed: { enabled: false, position: 'topRight', offsetX: 0, offsetY: 0, },
            },
        }

        const SalesBreakdownseries = this.state.saleBreakdownOverallly.map((x) => x.amount)

        const saleBreakdownSeries = [{
            name: "Nett Profit",
            data: [2, 3, 3.5, 5, 6.07, 3.3, 9.73, 4, 6, 5, 4, 3.35, 8.75, 1, 9]
        }, {
            name: "Shipping",
            data: [0.2, 0.8, 0.9, 1, 1.2, 0.6, 0.7, 0.4, 0.3, 2, 1.5, 1.3, 1, 2.4, 3]
        }, {
            name: "Tax",
            data: [0.2, 0.8, 0.9, 1, 1.2, 0.6, 0.7, 0.4, 0.3, 2, 1.5, 1.3, 1, 2.4, 2]
        }, {
            name: "Cost",
            data: [0.2, 0.8, 0.9, 1, 1.2, 0.6, 0.7, 0.4, 0.3, 2, 1.5, 1.3, 1, 2.4, 1]
        }, {
            name: "Others",
            data: [0.2, 0.2, 0.2, 0.3, 0.1, 0.1, 0.2, 0.3, 0, 0.2, 0, 0.3, 0.4, 0, 0.1]
        }]

        const saleBreakdownOptions = {
            chart: {
                type: 'bar',
                height: 300,
                stacked: true,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        position: 'top', // top, center, bottom
                    },
                    toolbar: { show: false },
                    // columnWidth: '40vw',
                }
            },
            xaxis: {
                categories: ['17 Jan 23', '18 Jan 23', '19 Jan 23', '20 Jan 23', '21 Jan 23', '22 Jan 23', '23 Jan 23', '24 Jan 23', '25 Jan 23', '26 Jan 23', '27 Jan 23', '28 Jan 23', '29 Jan 23', '30 Jan 23', '31 Jan 23',],
                labels: {
                    formatter: function (val) {
                        return val
                        // + "K"
                    }
                }
            },
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
                style: { fontSize: '10px', },
                onDatasetHover: { highlightDataSeries: false, },
                y: { formatter: function (val) { return val + "K" } },
                fixed: { enabled: false, position: 'topRight', offsetX: 0, offsetY: 0, },
            },
            fill: { opacity: 1 },
            legend: {
                show: false,
                // position: 'bottom',
                // horizontalAlign: 'left',
                // offsetX: 40 
            },
        }

        const selectedData = this.state.yealySaleDummy.filter((x) => x.year === this.state.year).map((y) => y)
        const yearlySaleoptions = {
            chart: {
                height: 200,
                type: 'line',
                // foreColor: "white",
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
            colors: [
                '#FFA701',
                '#E3242B',
                // '#77B6EA',
                // '#545454'
            ],
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
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            xaxis: {
                categories: yearlySalesMonthlyData,
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
            }
        }

        const yearlySaleseries = [
            {
                name: "Total Sale Income",
                data: yearlySalesSeriesData
            },
            // {
            //     name: "Total Expenses",
            //     data: selectedData[0].items.filter((z) => z.saleType === "Total Expenses").map((data) => data.amount)
            // }
        ]

        const productCategorySaleSeries = [44, 33, 54, 45]
        const productCategorySaleOptions = {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: ['Power Tools', 'Babies & Toys', 'Health & Beauty', 'Home & Lifestyle'],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'left'
                    }
                }
            }]
        }

        const transactionSeries = [{
            name: 'In purchasing',
            data: [44, 55, 57, 56, 61, 58,]
        }, {
            name: 'Payment Confirm',
            data: [74, 74, 74, 74, 74, 74,]
        }, {
            name: 'In Shipping',
            data: [35, 41, 36, 26, 45, 48,]
        }]

        const transactionOptions = {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' },
            },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2, colors: ['transparent'] },
            xaxis: {
                categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',],
            },
            fill: { opacity: 1 },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val
                        // "$ " + "K" + " thousands"
                    }
                }
            }
        }

        const eventSeries = [{
            name: 'Sessions',
            type: 'column',
            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
        }, {
            name: 'Shopping Cart',
            type: 'area',
            data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
        }, {
            name: 'Purchases',
            type: 'line',
            data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
        }]

        const eventOptions = {
            chart: {
                height: 350,
                type: 'line',
                stacked: false,
                toolbar: { show: false },
            },
            stroke: {
                width: [0, 2, 3],
                curve: 'smooth'
            },
            plotOptions: {
                bar: {
                    columnWidth: '40%'
                }
            },

            fill: {
                opacity: [0.85, 0.25, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100]
                }
            },
            labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003',
                '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'
            ],
            xaxis: {
                type: 'datetime'
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(0)
                            // + " points";
                        }
                        return y;

                    }
                }
            }
        }

        return (
            <Grid container spacing={1} style={{ padding: '25pt' }}>
                <Grid item xs={12} sm={12} style={{ display: 'flex', }} >
                    <Grid item xs={6} style={{ display: "flex", }}>
                        <Typography variant="h5" style={{ fontWeight: 700 }}>Welcome back, Admin!</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography variant="h6" style={{ color: '#1f7429', }}>{day},&nbsp; {get_Complete_Today}</Typography>
                    </Grid>
                </Grid>
                <hr width="100%" />
                <Grid container spacing={2}>
                    <Grid item container xs={12} sm={12} md={7} rowSpacing={2} >
                        <Grid item xs={12} style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                            <Grid item xs={12} sm={3} md={3}>
                                <img src={Logo} width="85%" />
                            </Grid>
                            <Grid item xs={12} sm={9} md={9}>
                                <Card elevation={3}>
                                    <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Monthly Statistic Overview</Typography>} />
                                    <CardContent>
                                        <Grid container spacing={8}>
                                            {
                                                this.state.statisticData.filter((y) => y.key === this.state.key).map((x) => {
                                                    return (
                                                        <Grid item xs={6} sm={6} md={3} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                            <Grid>
                                                                <img src={x.iconImg} width="35vw" height="35vw" />
                                                            </Grid>
                                                            <Grid>
                                                                <Typography style={{ fontSize: "0.82vw", fontWeight: "700" }}>{x.title}</Typography>
                                                            </Grid>
                                                            <Grid>
                                                                <Typography style={{ fontSize: "0.82vw" }}>{x.amount}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Grid item container xs={12} spacing={3} style={{ display: "flex", alignItems: "center" }}>
                            <Grid item xs={12}>
                                <Card elevation={3}>
                                    <CardHeader
                                        title={
                                            <Grid item xs={12} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                <Typography variant="h6" style={{ fontWeight: 700 }}>Yearly Sales</Typography>
                                                <FormControl sx={{ m: 0.5 }} variant="outlined">
                                                    <NativeSelect
                                                        id="demo-customized-select-native"
                                                        value={this.state.year}
                                                        onChange={(e) => this.handleChange(e)}
                                                        input={<BootstrapInput />}
                                                    >
                                                        <option value={2021}>2021</option>
                                                        <option value={2022}>2022</option>
                                                        <option value={2023}>2023</option>
                                                    </NativeSelect>
                                                </FormControl>
                                            </Grid>
                                        }
                                    />
                                    <CardContent>
                                        <ReactApexChart options={yearlySaleoptions} series={yearlySaleseries} type="area" height={290} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Grid item container xs={12} spacing={3} style={{ display: "flex", alignItems: "center" }}>
                            <Grid item xs={12} sm={12} md={6}>
                                <Card elevation={3}>
                                    <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Product Category Sales</Typography>} />
                                    <CardContent>
                                        <ReactApexChart options={productCategorySaleOptions} series={productCategorySaleSeries} type="pie" height={270} />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6}>
                                <Card elevation={3}>
                                    <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Sales Events</Typography>} />
                                    <CardContent>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <ReactApexChart options={eventOptions} series={eventSeries} type="line" height={200} />
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={3} xs={12} >
                            <Grid item xs={12} sm={6} md={6}>
                                <Card elevation={3}>
                                    <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Best Merchant</Typography>} />
                                    <CardContent >
                                        <Grid item xs={12} sm={12} md={12} style={{ height: '24vh', overflowX: 'hidden', }} >
                                            <Grid item>
                                                <Grid item container spacing={2}>
                                                    {
                                                        bestMerchants.length > 0 && bestMerchants.map((merchant) => {
                                                            return (
                                                                <>
                                                                    <Grid item xs={12} sm={2} md={2} style={{ display: "flex", justifyContent: "center" }}>
                                                                        <img src={merchant.merchantProfile === undefined ? 'https://img.icons8.com/bubbles/50/null/gemologist-male.png' : merchant.merchantProfile} width="80%" style={{ objectFit: "contain" }} />
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={5} md={5}>
                                                                        <Typography variant="subtitle2" style={{ fontWeight: "bold", }}>{merchant.FirstName !== null ? merchant.FirstName : "Anonymous"}</Typography>
                                                                        {/* <Typography variant="caption" style={{ color: "grey" }}>{merchant.FirstName !== null ? merchant.FirstName : "Anonymous"}</Typography> */}
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={5} md={5}>
                                                                        <Typography variant="caption" style={{ fontWeight: "bold", }}>{merchant.NumberOfTransaction}</Typography>
                                                                    </Grid>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Card elevation={3}>
                                    <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Latest Products</Typography>} />
                                    <CardContent >
                                        <Grid item xs={12} sm={12} md={12} style={{ height: '24vh', overflowX: 'hidden', }} >
                                            <Grid item>
                                                <Grid item container spacing={2}>
                                                    {
                                                        latestProducts.length > 0 && latestProducts.map((product) => {
                                                            return (
                                                                <>
                                                                    <Grid item xs={4} sm={4} md={4} style={{ display: "flex", justifyContent: "center" }}>
                                                                        <img src={product.productImage === undefined ? Logo : product.productImage} width="60%" style={{ objectFit: "contain" }} />
                                                                    </Grid>
                                                                    <Grid item xs={7} sm={7} md={7}>
                                                                        <Typography variant="subtitle2" style={{ fontWeight: "bold", }}>{product.ProductName}</Typography>
                                                                        <Typography variant="subtitle2" style={{ color: "grey" }}>RM {product.ProductVariationPrice}</Typography>
                                                                    </Grid>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container rowSpacing={3} xs={12} sm={12} md={5} >
                        <Grid item xs={12} sm={12} md={12} >
                            <Card elevation={3}>
                                <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Sales Breakdown</Typography>} />
                                <CardContent>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <ReactApexChart options={SalesBreakdownoptions} series={SalesBreakdownseries} type="donut" height={210} />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <ReactApexChart options={saleBreakdownOptions} series={saleBreakdownSeries} type="bar" height={290} />
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} >
                            <Card elevation={3}>
                                <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Transaction Overview</Typography>} />
                                <CardContent>
                                    <ReactApexChart options={transactionOptions} series={transactionSeries} type="bar" height={200} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} >
                            <Card elevation={3} style={{ height: "35vh" }}>
                                <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Marketing Campaigns</Typography>} />
                                <CardContent>
                                    <MarketingCampaigns />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);