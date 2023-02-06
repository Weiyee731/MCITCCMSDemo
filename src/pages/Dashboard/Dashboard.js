import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { browserHistory } from "react-router";
import SearchBar from "../../components/SearchBar/SearchBar";
import Button from "@mui/material/Button";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { Card, CardContent, CardHeader, Grid, Typography, Avatar, Box } from "@mui/material";
import Logo from "../../assets/logos/logo.png";
import ReactApexChart from "react-apexcharts";
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';
import MarketingCampaigns from "./MarketingCampaign";

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
}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    handleChange(event) {
        this.setState({ year: event.target.value });
    };

    render() {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const d = new Date();
        let day = days[d.getDay()];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let month = months[d.getMonth()];
        const get_Complete_Today = d.getDate() + " " + month + " " + d.getFullYear()

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
            }]
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
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        position: 'top', // top, center, bottom
                    },
                    toolbar: {
                        show: false
                    },
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
                categories: selectedData[0].items.filter((z) => z.saleType === "Total Income").map((data) => data.month),
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
            }
        }

        const yearlySaleseries = [
            {
                name: "Total Income",
                data: selectedData[0].items.filter((z) => z.saleType === "Total Income").map((data) => data.amount)
            },
            {
                name: "Total Expenses",
                data: selectedData[0].items.filter((z) => z.saleType === "Total Expenses").map((data) => data.amount)
            }
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
                        position: 'bottom'
                    }
                }
            }]
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
                                <img src={Logo} width="100%" />
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
                                                    {/* <InputLabel htmlFor="demo-customized-select-native">Year</InputLabel> */}
                                                    <NativeSelect
                                                        id="demo-customized-select-native"
                                                        value={this.state.year}
                                                        onChange={(e) => this.handleChange(e)}
                                                        input={<BootstrapInput />}
                                                    >
                                                        <option aria-label="None" value="" />
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
                            <Grid item xs={12} sm={6} md={6}>
                                <Card elevation={3}>
                                    <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Product Category Sales</Typography>} />
                                    <CardContent>
                                        <ReactApexChart options={productCategorySaleOptions} series={productCategorySaleSeries} type="pie" height={300} />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Card elevation={3}>
                                    <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Monthly Sales</Typography>} />
                                    <CardContent>
                                        <ReactApexChart options={SalesBreakdownoptions} series={SalesBreakdownseries} type="donut" height={300} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={3} xs={12} >
                            <Grid item xs={12} sm={6} md={6}>
                                <Card elevation={3}>
                                    <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Monthly Best Merchant</Typography>} />
                                    <CardContent>
                                        <ReactApexChart options={SalesBreakdownoptions} series={SalesBreakdownseries} type="donut" height={300} />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Card elevation={3}>
                                    <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Latest Products</Typography>} />
                                    <CardContent>
                                        <ReactApexChart options={SalesBreakdownoptions} series={SalesBreakdownseries} type="donut" height={300} />
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
                                        <ReactApexChart options={SalesBreakdownoptions} series={SalesBreakdownseries} type="donut" height={200} />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <ReactApexChart options={saleBreakdownOptions} series={saleBreakdownSeries} type="bar" height={280} />
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} >
                            <Card elevation={3}>
                                <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Inventory Management</Typography>} />
                                <CardContent>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <ReactApexChart options={SalesBreakdownoptions} series={SalesBreakdownseries} type="donut" height={210} />
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} >
                            <Card elevation={3}>
                                <CardHeader title={<Typography variant="h6" style={{ fontWeight: 700 }}>Marketing Campaigns</Typography>} />
                                <CardContent>
                                    <Grid item xs={12} sm={12} md={12} style={{ height:'25vh', overflowX: 'hidden',}} >
                                        <MarketingCampaigns />
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>


                {/* <SearchBar
                    label="search"
                    placeholder="Enter Member No, Tracking No or Container No to search"
                    buttonOnClick={() => this.onSearch("", "")}
                    onChange={() => { }}
                    className="searchbar-input"
                    disableButton={this.state.isDataFetching}
                    tooltipText="Search with current data"
                    value={this.state.searchKeywords}
                    variant="standard"
                    hideButton={true}
                />

                <div className="w-100 d-flex">
                    <Button onClick={() => this.setState({ openModal: true })}>Toggle Modal</Button>
                    <Button onClick={() => this.setState({ openFullScreenModal: true })}>Toggle Full Screen Modal</Button>
                </div>
                <ModalComponent
                    open={this.state.openModal}
                    fullScreen={false}
                    maxWidth={"sm"}
                    title={"Modal Title"}
                    draggable={true}
                    handleOnClose={() => this.setState({ openModal: false })}
                    DialogActionsButton={
                        <div className="d-flex">
                            <Button className="ml-auto">Something</Button>
                        </div>
                    }
                >
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lacus vestibulum sed arcu non odio euismod lacinia at quis. Aliquam vestibulum morbi blandit cursus risus at ultrices. Morbi tristique senectus et netus. Nec dui nunc mattis enim ut tellus elementum sagittis. Donec enim diam vulputate ut pharetra sit amet. Sit amet consectetur adipiscing elit pellentesque habitant morbi tristique. Ut tristique et egestas quis ipsum. Fermentum leo vel orci porta non pulvinar neque laoreet. Ultrices in iaculis nunc sed. Purus non enim praesent elementum facilisis. Orci a scelerisque purus semper eget. Dignissim sodales ut eu sem. Adipiscing commodo elit at imperdiet dui accumsan sit amet nulla. Tempus egestas sed sed risus pretium quam vulputate. Tristique senectus et netus et malesuada fames ac. Libero nunc consequat interdum varius. Nec tincidunt praesent semper feugiat nibh sed pulvinar proin gravida.

                        Urna condimentum mattis pellentesque id nibh tortor id. Facilisis sed odio morbi quis commodo odio aenean sed. Dapibus ultrices in iaculis nunc sed augue. Massa placerat duis ultricies lacus sed turpis tincidunt id aliquet. Dolor sit amet consectetur adipiscing elit pellentesque. Lectus proin nibh nisl condimentum id venenatis a. Convallis a cras semper auctor neque vitae. Libero nunc consequat interdum varius sit amet mattis. Feugiat pretium nibh ipsum consequat nisl. Non consectetur a erat nam at lectus urna. Vel turpis nunc eget lorem dolor. Hac habitasse platea dictumst quisque sagittis purus. Porta non pulvinar neque laoreet suspendisse. Tincidunt augue interdum velit euismod in pellentesque massa placerat duis. Pellentesque massa placerat duis ultricies lacus sed. Enim ut sem viverra aliquet eget sit amet tellus. Ultricies leo integer malesuada nunc.

                        Sit amet venenatis urna cursus eget nunc scelerisque viverra. Amet consectetur adipiscing elit duis tristique. Ut consequat semper viverra nam libero justo laoreet. Nunc vel risus commodo viverra maecenas accumsan. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. Sem nulla pharetra diam sit amet. Integer enim neque volutpat ac tincidunt vitae semper quis. A erat nam at lectus urna duis convallis convallis tellus. Libero nunc consequat interdum varius sit amet mattis. Faucibus interdum posuere lorem ipsum dolor sit. Sed risus ultricies tristique nulla. Purus in mollis nunc sed id semper risus in hendrerit. Ultrices tincidunt arcu non sodales neque sodales ut etiam. Elementum eu facilisis sed odio morbi quis commodo. Nam aliquam sem et tortor consequat id porta nibh venenatis. Eu mi bibendum neque egestas congue quisque egestas diam.

                        Pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis. Nibh tellus molestie nunc non blandit. In iaculis nunc sed augue lacus viverra. Vel orci porta non pulvinar. Est sit amet facilisis magna etiam tempor orci eu. Mattis aliquam faucibus purus in. Dignissim cras tincidunt lobortis feugiat vivamus. Morbi tincidunt ornare massa eget egestas purus viverra. Vitae sapien pellentesque habitant morbi tristique senectus et netus et. Sed euismod nisi porta lorem mollis aliquam.

                        Tellus orci ac auctor augue. Feugiat sed lectus vestibulum mattis ullamcorper. Urna neque viverra justo nec ultrices dui sapien. Semper auctor neque vitae tempus quam. Mattis aliquam faucibus purus in. Posuere lorem ipsum dolor sit amet consectetur. Sit amet nisl suscipit adipiscing bibendum est ultricies integer quis. Neque sodales ut etiam sit amet nisl purus in. Volutpat ac tincidunt vitae semper quis lectus nulla at. Lacus sed viverra tellus in. Id consectetur purus ut faucibus pulvinar elementum integer enim. Dui ut ornare lectus sit amet. Euismod lacinia at quis risus sed vulputate odio ut enim. Molestie a iaculis at erat pellentesque adipiscing commodo. Sed sed risus pretium quam.

                        Neque viverra justo nec ultrices dui sapien eget mi proin. Non tellus orci ac auctor augue. Ultrices mi tempus imperdiet nulla malesuada pellentesque. Et tortor at risus viverra adipiscing at. Dictum non consectetur a erat nam. Mattis pellentesque id nibh tortor. Feugiat pretium nibh ipsum consequat nisl vel pretium lectus quam. Sagittis vitae et leo duis ut diam quam. Augue neque gravida in fermentum et. Penatibus et magnis dis parturient montes nascetur ridiculus mus mauris. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Donec ultrices tincidunt arcu non sodales.

                        Fames ac turpis egestas integer eget. Euismod nisi porta lorem mollis. Velit ut tortor pretium viverra suspendisse potenti. Tempus egestas sed sed risus pretium quam vulputate dignissim. Pretium fusce id velit ut. Ultricies mi eget mauris pharetra et ultrices neque ornare. At consectetur lorem donec massa sapien faucibus et. At erat pellentesque adipiscing commodo. Nisl vel pretium lectus quam id leo in vitae turpis. Vivamus arcu felis bibendum ut tristique et egestas. Fames ac turpis egestas maecenas. Euismod nisi porta lorem mollis. Sed libero enim sed faucibus turpis in eu mi bibendum. Quisque non tellus orci ac auctor augue. Dui ut ornare lectus sit amet. In nisl nisi scelerisque eu ultrices vitae auctor eu.

                        Tempor commodo ullamcorper a lacus. Nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet. Nam at lectus urna duis. Blandit turpis cursus in hac habitasse platea. Suspendisse ultrices gravida dictum fusce ut. Phasellus vestibulum lorem sed risus. Morbi tempus iaculis urna id. Velit laoreet id donec ultrices tincidunt. Consequat ac felis donec et odio pellentesque. Mattis aliquam faucibus purus in massa tempor nec feugiat. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere.

                        Maecenas sed enim ut sem viverra aliquet eget sit amet. Penatibus et magnis dis parturient. Malesuada nunc vel risus commodo viverra maecenas. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis. Ut eu sem integer vitae justo eget magna fermentum iaculis. Enim eu turpis egestas pretium aenean pharetra magna ac placerat. Bibendum est ultricies integer quis auctor elit. Urna duis convallis convallis tellus id interdum velit laoreet. Sed elementum tempus egestas sed sed risus pretium. Gravida neque convallis a cras semper auctor. Maecenas accumsan lacus vel facilisis volutpat est velit egestas. Nunc faucibus a pellentesque sit. Donec et odio pellentesque diam. Consectetur adipiscing elit duis tristique sollicitudin nibh. Et malesuada fames ac turpis egestas maecenas. Pellentesque pulvinar pellentesque habitant morbi tristique senectus et netus et.

                        Consequat interdum varius sit amet. Turpis massa tincidunt dui ut ornare. Cras fermentum odio eu feugiat. Lacinia quis vel eros donec. Feugiat in ante metus dictum at tempor commodo ullamcorper a. Vel facilisis volutpat est velit egestas dui id ornare. Elementum nisi quis eleifend quam adipiscing vitae proin. Nisi porta lorem mollis aliquam ut. Sagittis vitae et leo duis ut diam quam. Laoreet suspendisse interdum consectetur libero id faucibus nisl. Fringilla est ullamcorper eget nulla. Volutpat diam ut venenatis tellus in metus vulputate. Consectetur a erat nam at lectus urna. Leo duis ut diam quam nulla porttitor massa id neque. Donec adipiscing tristique risus nec feugiat. Egestas maecenas pharetra convallis posuere morbi leo. Morbi tristique senectus et netus et malesuada. Dui faucibus in ornare quam viverra orci sagittis eu volutpat. Erat velit scelerisque in dictum non consectetur a.
                    </div>
                </ModalComponent>
                <ModalComponent
                    open={this.state.openFullScreenModal}
                    fullScreen={true}
                    maxWidth={"sm"}
                    title={"Modal Title"}
                    draggable={true}
                    handleOnClose={() => this.setState({ openFullScreenModal: false })}
                    DialogActionsButton={
                        <div className="d-flex">
                            <Button onClick={() => this.setState({ openFullScreenModal: false })} className="ml-auto">Something</Button>
                        </div>
                    }
                >
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lacus vestibulum sed arcu non odio euismod lacinia at quis. Aliquam vestibulum morbi blandit cursus risus at ultrices. Morbi tristique senectus et netus. Nec dui nunc mattis enim ut tellus elementum sagittis. Donec enim diam vulputate ut pharetra sit amet. Sit amet consectetur adipiscing elit pellentesque habitant morbi tristique. Ut tristique et egestas quis ipsum. Fermentum leo vel orci porta non pulvinar neque laoreet. Ultrices in iaculis nunc sed. Purus non enim praesent elementum facilisis. Orci a scelerisque purus semper eget. Dignissim sodales ut eu sem. Adipiscing commodo elit at imperdiet dui accumsan sit amet nulla. Tempus egestas sed sed risus pretium quam vulputate. Tristique senectus et netus et malesuada fames ac. Libero nunc consequat interdum varius. Nec tincidunt praesent semper feugiat nibh sed pulvinar proin gravida.

                        Urna condimentum mattis pellentesque id nibh tortor id. Facilisis sed odio morbi quis commodo odio aenean sed. Dapibus ultrices in iaculis nunc sed augue. Massa placerat duis ultricies lacus sed turpis tincidunt id aliquet. Dolor sit amet consectetur adipiscing elit pellentesque. Lectus proin nibh nisl condimentum id venenatis a. Convallis a cras semper auctor neque vitae. Libero nunc consequat interdum varius sit amet mattis. Feugiat pretium nibh ipsum consequat nisl. Non consectetur a erat nam at lectus urna. Vel turpis nunc eget lorem dolor. Hac habitasse platea dictumst quisque sagittis purus. Porta non pulvinar neque laoreet suspendisse. Tincidunt augue interdum velit euismod in pellentesque massa placerat duis. Pellentesque massa placerat duis ultricies lacus sed. Enim ut sem viverra aliquet eget sit amet tellus. Ultricies leo integer malesuada nunc.

                        Sit amet venenatis urna cursus eget nunc scelerisque viverra. Amet consectetur adipiscing elit duis tristique. Ut consequat semper viverra nam libero justo laoreet. Nunc vel risus commodo viverra maecenas accumsan. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. Sem nulla pharetra diam sit amet. Integer enim neque volutpat ac tincidunt vitae semper quis. A erat nam at lectus urna duis convallis convallis tellus. Libero nunc consequat interdum varius sit amet mattis. Faucibus interdum posuere lorem ipsum dolor sit. Sed risus ultricies tristique nulla. Purus in mollis nunc sed id semper risus in hendrerit. Ultrices tincidunt arcu non sodales neque sodales ut etiam. Elementum eu facilisis sed odio morbi quis commodo. Nam aliquam sem et tortor consequat id porta nibh venenatis. Eu mi bibendum neque egestas congue quisque egestas diam.

                        Pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis. Nibh tellus molestie nunc non blandit. In iaculis nunc sed augue lacus viverra. Vel orci porta non pulvinar. Est sit amet facilisis magna etiam tempor orci eu. Mattis aliquam faucibus purus in. Dignissim cras tincidunt lobortis feugiat vivamus. Morbi tincidunt ornare massa eget egestas purus viverra. Vitae sapien pellentesque habitant morbi tristique senectus et netus et. Sed euismod nisi porta lorem mollis aliquam.

                        Tellus orci ac auctor augue. Feugiat sed lectus vestibulum mattis ullamcorper. Urna neque viverra justo nec ultrices dui sapien. Semper auctor neque vitae tempus quam. Mattis aliquam faucibus purus in. Posuere lorem ipsum dolor sit amet consectetur. Sit amet nisl suscipit adipiscing bibendum est ultricies integer quis. Neque sodales ut etiam sit amet nisl purus in. Volutpat ac tincidunt vitae semper quis lectus nulla at. Lacus sed viverra tellus in. Id consectetur purus ut faucibus pulvinar elementum integer enim. Dui ut ornare lectus sit amet. Euismod lacinia at quis risus sed vulputate odio ut enim. Molestie a iaculis at erat pellentesque adipiscing commodo. Sed sed risus pretium quam.

                        Neque viverra justo nec ultrices dui sapien eget mi proin. Non tellus orci ac auctor augue. Ultrices mi tempus imperdiet nulla malesuada pellentesque. Et tortor at risus viverra adipiscing at. Dictum non consectetur a erat nam. Mattis pellentesque id nibh tortor. Feugiat pretium nibh ipsum consequat nisl vel pretium lectus quam. Sagittis vitae et leo duis ut diam quam. Augue neque gravida in fermentum et. Penatibus et magnis dis parturient montes nascetur ridiculus mus mauris. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Donec ultrices tincidunt arcu non sodales.

                        Fames ac turpis egestas integer eget. Euismod nisi porta lorem mollis. Velit ut tortor pretium viverra suspendisse potenti. Tempus egestas sed sed risus pretium quam vulputate dignissim. Pretium fusce id velit ut. Ultricies mi eget mauris pharetra et ultrices neque ornare. At consectetur lorem donec massa sapien faucibus et. At erat pellentesque adipiscing commodo. Nisl vel pretium lectus quam id leo in vitae turpis. Vivamus arcu felis bibendum ut tristique et egestas. Fames ac turpis egestas maecenas. Euismod nisi porta lorem mollis. Sed libero enim sed faucibus turpis in eu mi bibendum. Quisque non tellus orci ac auctor augue. Dui ut ornare lectus sit amet. In nisl nisi scelerisque eu ultrices vitae auctor eu.

                        Tempor commodo ullamcorper a lacus. Nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet. Nam at lectus urna duis. Blandit turpis cursus in hac habitasse platea. Suspendisse ultrices gravida dictum fusce ut. Phasellus vestibulum lorem sed risus. Morbi tempus iaculis urna id. Velit laoreet id donec ultrices tincidunt. Consequat ac felis donec et odio pellentesque. Mattis aliquam faucibus purus in massa tempor nec feugiat. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere.

                        Maecenas sed enim ut sem viverra aliquet eget sit amet. Penatibus et magnis dis parturient. Malesuada nunc vel risus commodo viverra maecenas. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis. Ut eu sem integer vitae justo eget magna fermentum iaculis. Enim eu turpis egestas pretium aenean pharetra magna ac placerat. Bibendum est ultricies integer quis auctor elit. Urna duis convallis convallis tellus id interdum velit laoreet. Sed elementum tempus egestas sed sed risus pretium. Gravida neque convallis a cras semper auctor. Maecenas accumsan lacus vel facilisis volutpat est velit egestas. Nunc faucibus a pellentesque sit. Donec et odio pellentesque diam. Consectetur adipiscing elit duis tristique sollicitudin nibh. Et malesuada fames ac turpis egestas maecenas. Pellentesque pulvinar pellentesque habitant morbi tristique senectus et netus et.

                        Consequat interdum varius sit amet. Turpis massa tincidunt dui ut ornare. Cras fermentum odio eu feugiat. Lacinia quis vel eros donec. Feugiat in ante metus dictum at tempor commodo ullamcorper a. Vel facilisis volutpat est velit egestas dui id ornare. Elementum nisi quis eleifend quam adipiscing vitae proin. Nisi porta lorem mollis aliquam ut. Sagittis vitae et leo duis ut diam quam. Laoreet suspendisse interdum consectetur libero id faucibus nisl. Fringilla est ullamcorper eget nulla. Volutpat diam ut venenatis tellus in metus vulputate. Consectetur a erat nam at lectus urna. Leo duis ut diam quam nulla porttitor massa id neque. Donec adipiscing tristique risus nec feugiat. Egestas maecenas pharetra convallis posuere morbi leo. Morbi tristique senectus et netus et malesuada. Dui faucibus in ornare quam viverra orci sagittis eu volutpat. Erat velit scelerisque in dictum non consectetur a.
                    </div>
                </ModalComponent> */}
            </Grid>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);