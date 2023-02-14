import React, { Component } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import TableComponents from "../../components/TableComponents/TableComponents";
import TableCell from '@mui/material/TableCell';
import Switch from '@mui/material/Switch';
import { Button } from "@mui/material";

import Decrease from '../../assets/decrease.png';
import Increase from '../../assets/increase.png';


function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

const headCells = [
    {
        id: 'campaigns',
        align: 'left',
        disablePadding: false,
        label: 'Campaigns',
    },
    {
        id: 'growth',
        align: 'center',
        disablePadding: false,
        label: 'Growth',
    },
    {
        id: 'charges',
        align: 'center',
        disablePadding: false,
        label: 'Charges',
    },
    {
        id: 'status',
        align: 'center',
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'action',
        align: 'center',
        disablePadding: false,
        label: 'Action',
    },
];

const INITIAL_STATE = {
    dummyMarket: [
        { campaignID: 1, campaignsImg: "https://img.freepik.com/free-vector/paper-style-chinese-new-year-background_52683-80047.jpg?w=2000", campaigns: "CNY Promotion", graph: Increase, growth: "13%", charges: "500", status: "ACTIVE", isActive: true, color: "green" },
        { campaignID: 2, campaignsImg: "https://media.istockphoto.com/vectors/holiday-aidilfitri-eid-mubarak-greeting-card-3d-gold-crescent-moon-vector-id1310937830?k=20&m=1310937830&s=612x612&w=0&h=grdwErCjJg_ab8SoR5-zJlHYiZX1mw0j4hiVGUxJbp8=", campaigns: "Hari Raya Promotion", graph: Decrease, growth: "15.5%", charges: "600", status: "ACTIVE", isActive: true, color: "green" },
        { campaignID: 3, campaignsImg: "https://3.bp.blogspot.com/-tASPCxphbu4/Tecnh7eCQAI/AAAAAAAAC-s/KDuKt4e-dWA/s1600/a1.jpg", campaigns: "Gawai Promotion", graph: Increase, growth: "70%", charges: "600", status: "CLOSED", isActive: false, color: "red" },
        { campaignID: 4, campaignsImg: "https://us.123rf.com/450wm/artlana/artlana1805/artlana180500132/101608402-malaysia-independence-day-background-with-grunge-painted-flag-of-malaysia-hari-merdeka-holiday-templ.jpg?ver=6", campaigns: "Malaysia Independence Day Promotion", graph: Decrease, growth: "10%", charges: "300", status: "CLOSED", isActive: false, color: "red" },
        { campaignID: 5, campaignsImg: "https://pbs.twimg.com/media/E61XglHUYAUoBHX.jpg", campaigns: "Sarawak Day Promotion", graph: Increase, growth: "80%", charges: "1,000", status: "ACTIVE", isActive: true, color: "green" },
        { campaignID: 6, campaignsImg: "https://media.istockphoto.com/vectors/happy-malaysia-day-vector-id822135186", campaigns: "Malaysia Day Promotion", graph: Decrease, growth: "30%", charges: "700", status: "CLOSED", isActive: false, color: "red" },
        { campaignID: 7, campaignsImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl1_TMqkQOIZzS8Uz60deAvjIbq_OGEKRdlg&usqp=CAU", campaigns: "Deepavali Promotion", graph: Decrease, growth: "10%", charges: "200", status: "CLOSED", isActive: false, color: "red" },
        { campaignID: 8, campaignsImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6OfGIkzA3Qd4V1O5CotPQU-XjpeqQkZPKrTdHJj698Rn1SU3C6Y85adj-yNYfoiSg7B8&usqp=CAU", campaigns: "Christmas Promotion", graph: Increase, growth: "70%", charges: "800", status: "ACTIVE", isActive: true, color: "green" },
        { campaignID: 9, campaignsImg: "https://www.wordzz.com/wp-content/uploads/2018/12/Happy-new-year-hd.jpg", campaigns: "New Year Promotion", graph: Increase, growth: "60%", charges: "400", status: "ACTIVE", isActive: true, color: "green" },
    ],
};


class MarketingCampaigns extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) { }

    handleChange() {

    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell
                    component="th"
                    // id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                    padding="normal"
                >
                    <img src={data.campaignsImg} width={25} />
                    <div><Typography variant="subtitle" style={{ color: "black" }}>{data.campaigns}</Typography></div>
                </TableCell>
                <TableCell align="center" style={{ color: data.color }}>
                    <img src={data.graph} width={20} />
                    <Typography variant="subtitle" >{data.growth}</Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography variant="subtitle" style={{ color: "black" }}>{data.charges}</Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography variant="subtitle" style={{ color: data.color }}>{data.status}</Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography variant="subtitle" >
                        <Switch
                            checked={data.isActive}
                            onChange={() => { this.setState({ isActive: !data.isActive }) }}
                        />
                    </Typography>
                </TableCell>
            </>
        )
    }

    onTableRowClick(event, row) {
        console.log(event, row)
    }

    render() {
        return (
            <div >
                {/* <Card sx={{ borderRadius: 4, height: "25vh", overflowY: "scroll", marginTop: "0.5vw" }}> */}
                <TableComponents
                    tableTopLeft= "empty"
                    // {
                    //     <>
                    //         <h5 variant="title" style={{ marginTop: "1vw", fontSize: "0.92vw", fontWeight: "bold", }} >Marketing Campaigns</h5>
                    //         <div className="row mt-2 mb-2" >
                    //             <div className="col-4 mt-1">
                    //                 <div style={{ display: "flex", flexDirection: "row" }}>
                    //                     <img src={Increase} width={30} />
                    //                     <div style={{ display: "flex", flexDirection: "column" }}>
                    //                         <div>
                    //                             <Typography variant="subtitle" >1,000</Typography>
                    //                             <span style={{ textAlign: "center", fontSize: "0.62vw", padding: "0.25vw", fontWeight: "bold", color: "green" }}>(+80.0%)</span>
                    //                         </div>
                    //                         <div>
                    //                             <Typography variant="subtitle2" >1 January 2023</Typography>
                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //             </div>
                    //             <div className="col-4 mt-1">
                    //                 <div style={{ display: "flex", flexDirection: "row" }}>
                    //                     <img src={Decrease} width={30} />
                    //                     <div style={{ display: "flex", flexDirection: "column" }}>
                    //                         <div>
                    //                             <Typography variant="subtitle" >200</Typography>
                    //                             <span style={{ textAlign: "center", fontSize: "0.62vw", padding: "0.25vw", fontWeight: "bold", color: "red" }}>(-10.0%)</span>
                    //                         </div>
                    //                         <div>
                    //                             <Typography variant="subtitle2" >16 December 2022</Typography>
                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //             </div>
                    //             <div className="col-4 mt-1" style={{ display: "flex", justifyContent: "flex-end" }}>
                    //                 <Button variant='contained' color="primary" onClick="#">
                    //                     View Report
                    //                 </Button>
                    //             </div>
                    //         </div>
                    //     </>
                    // }
                    tableTopRight={
                        <>
                            {/* <NotificationsIcon
                                    onClick={(e) => this.handleNotification(e)}
                                    style={{ cursor: "pointer" }} /> */}
                        </>
                    }
                    tableOptions={{
                        dense: true,
                        tableOrderBy: 'asc',
                        sortingIndex: "",
                        stickyTableHeader: true,
                        stickyTableHeight: 300,
                        elevation: 0,
                    }}
                    // paginationOptions={[5, 10, 20, { label: 'All', value: -1 }]}
                    tableHeaders={headCells}
                    tableRows={{
                        renderTableRows: this.renderTableRows,
                        checkbox: false,
                        checkboxColor: "primary",
                        onRowClickSelect: false,
                    }}
                    Data={
                        this.state.dummyMarket
                    }
                    onSelectRow={(e) => console.log(e)}
                    onSelectAllRows={(e) => console.log(e)}
                    onTableRowClick={this.onTableRowClick}
                    // SelectionActionButtons={<Button onClick={() => alert('hi')}>SelectionActionButtons</Button>}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
                    SelectionExtraInfo={<div>Hi</div>}
                />
                {/* </Card> */}
            </div >
        );
    }
}

export default MarketingCampaigns;
