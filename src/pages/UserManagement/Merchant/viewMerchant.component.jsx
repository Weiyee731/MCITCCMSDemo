import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { GitAction } from "../../../store/action/gitAction";
// import "../../app/App.scss";
// import "react-table/react-table.css";
import MerchantDetails from "./merchantDetails.component";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from '@mui/icons-material/Delete';
// import SearchBox from "../../components/SearchBox/SearchBox";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import Tab from '@material-ui/core/Tab';
// import TabPanel from '@mui/core/TabPanel';
// import TabContext from "@mui/core/TabContext";

import { TabContext, TabPanel } from '@material-ui/lab';
import Button from '@mui/material/Button';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import TableComponents from "../../../components/TableComponents/TableComponents";
import SearchBar from "../../../components/SearchBar/SearchBar"


function mapStateToProps(state) {
  return {
    // allpromocodes: state.counterReducer["promoCodes"],
    // allstocks: state.counterReducer["products"],
    allmerchants: state.counterReducer["merchant"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // CallGetPromoCode: () => dispatch(GitAction.CallGetPromoCode()),
    // CallDeletePromoCode: (promoCodeData) =>
    //   dispatch(GitAction.CallDeletePromoCode(promoCodeData)),
    // CallAllProductsByProductStatus: (prodData) =>
    //   dispatch(GitAction.CallAllProductsByProductStatus(prodData)),
    CallMerchants: (prodData) => dispatch(GitAction.CallMerchants(prodData)),
  };
}

class ViewMerchantsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredProduct: [],
      isFiltered: false,
      status: "",
      tabvalue: "0",
      searchKeywords: "",
      isdetailsShown: false,

      userId: "",
      name: "",
      companyContactNo: "",
      firstName: "",
      lastName: "",
      companyDescription: "",
      companyWebsite: "",
      companyAddressLine1: "",
      companyAddressLine2: "",
      companyPoscode: "",
      companyCity: "",
      companyState: "",
      UserStatus: "",
    };

    this.props.CallMerchants({
      type: "Status",
      typeValue: "-",
      USERID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
      userRoleID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID : 0,
      productPage: 999,
      page: 1,
      ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
    });
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange = (event, newValue) => {
    this.setState({ tabvalue: newValue });
  }

  renderTableRows = (data, index) => {
    return (
      <>
        <TableCell align="left"> {data.FirstName + " " + data.LastName} </TableCell>
        <TableCell align="left"> {data.ShopName} </TableCell>
        <TableCell align="left"> {data.UserContactNo} </TableCell>
        <TableCell align="left"> {data.ShopCity} </TableCell>
        <TableCell align="left"> {data.ShopState} </TableCell>
      </>
    )
  }


  searchSpace = (value) => {
    this.setState({ searchKeywords: value })
    this.state.filteredProduct.splice(0, this.state.filteredProduct.length)

    let DataSet = this.props.allmerchants.length > 0 ? this.props.allmerchants : []

    DataSet.length > 0 && DataSet.filter((searchedItem) =>
      searchedItem.UserContactNo !== null && searchedItem.UserContactNo.includes(
        value
      )
    ).map((filteredItem) => {
      this.state.filteredProduct.push(filteredItem);
    })

    DataSet.length > 0 && DataSet.filter((searchedItem) =>
      searchedItem.ShopName !== null && searchedItem.ShopName.toLowerCase().includes(
        value.toLowerCase()
      )
    ).map((filteredItem) => {
      this.state.filteredProduct.push(filteredItem);
    })

    DataSet.length > 0 && DataSet.filter((searchedItem) => (searchedItem.FirstName + " " + searchedItem.LastName).toLowerCase()
      .includes(value.toLowerCase())).map((filteredItem) => {
        this.state.filteredProduct.push(filteredItem);
      })

    let removeDeplicate = this.state.filteredProduct.filter((ele, ind) => ind === this.state.filteredProduct.findIndex(elem => elem.UserID === ele.UserID))
    this.setState({ isFiltered: true, filteredProduct: removeDeplicate })
  }

  onTableRowClick = (event, row) => {
    // return (
    //   window.location = url.inventoryProduct(row.ProductID)
    // )

    this.setState({
      userId: row.UserID,
      name: row.ShopName,
      companyContactNo: row.UserContactNo,
      firstName: row.FirstName,
      lastName: row.LastName,
      companyDescription: row.ShopDescription,
      companyWebsite: row.CompanyWebsite,
      companyAddressLine1: row.CompanyAddressLine1,
      companyAddressLine2: row.CompanyAddressLine2,
      companyPoscode: row.ShopPoscode,
      companyCity: row.ShopCity,
      companyState: row.ShopState,
      UserStatus: row.Userstatus,
      isdetailsShown: false,
    });

    if (this.state.isdetailsShown) {
      this.setState({
        isdetailsShown: false,
      });
    } else {
      this.setState({
        isdetailsShown: true,
      });
    }
  }

  render() {

    const DataList = this.props.allmerchants.length > 0 ? this.props.allmerchants : []

    const tableHeadCells = [
      {
        id: "FirstName",
        numeric: false,
        disablePadding: true,
        label: "Representative Name",
      },
      {
        id: "CompanyName",
        numeric: false,
        disablePadding: true,
        label: "Shop Name",
      },
      {
        id: "CompanyContactNo",
        numeric: false,
        disablePadding: false,
        label: "Contact No.",
      },
      { id: "CompanyCity", numeric: false, disablePadding: false, label: "City" },
      {
        id: "CompanyState",
        numeric: false,
        disablePadding: false,
        label: "State",
      },
    ];

    const divStyle = {
      width: "100%",
      margin: "auto",
      padding: "1%",
      marginTop: "15px",
    };

    const setDetailsShown = (value) => {
      this.setState({
        isdetailsShown: value,
      });
    };



    const TableDataListing = (status) => {
      return (
        <TableComponents
          // table settings 
          tableTopLeft={<h3 style={{ fontWeight: 600 }}>Merchants List</h3>}
          tableOptions={{
            dense: true,                // optional, default is false
            tableOrderBy: 'asc',        // optional, default is asc
            sortingIndex: "UserID",        // require, it must the same as the desired table header
            stickyTableHeader: false,    // optional, default is true
          }}

          paginationOptions={[5, 10, 25, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
          tableHeaders={tableHeadCells}        //required
          tableRows={{
            renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
            checkbox: false,                          // optional, by default is true
            checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
            onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
          }}
          selectedIndexKey={"UserID"}                    // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
          Data={
            this.state.isFiltered === false ?
              DataList.length > 0 && DataList.filter((x) => x.Userstatus === status)
              :
              this.state.filteredProduct.length > 0 && this.state.filteredProduct.filter((x) => x.Userstatus === status)
          }                                 // required, the data that listing in the table
          onSelectRow={(e) => this.setState({ selectedListID: e })}
          onSelectAllRows={(e) => this.setState({ selectedListID: e })}
          onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row
        />
      )
    }

    return (
      <div style={{ width: "100%" }}>

        <div style={{ margin: "2%" }}>
          {
            this.state.isdetailsShown === true ?
              <MerchantDetails
                data={this.state}
                data2={this.props}
                history={this.props.history}
                setDetailsShown={setDetailsShown}
              /> :
              <>
                <div className="col-md-12 col-12 m-auto" >
                  <SearchBar
                    id=""
                    placeholder="Search By Representive Name, Shop Name and Contact..."
                    buttonOnClick={() => this.onSearch("", "")}
                    onChange={(e) => this.searchSpace(e.target.value)}
                    className="searchbar-input mb-auto"
                    disableButton={this.state.isDataFetching}
                    tooltipText="Search with current data"
                    value={this.state.searchKeywords}
                  />
                </div>
                <TabContext value={this.state.tabvalue}>
                  <Tabs
                    // value={this.state.tabvalue}
                    value={this.state.tabvalue}
                    onChange={this.handleTabChange}
                  >
                    <Tab value="0" label="Approved Merchant" />
                    <Tab label="Pending Merchant" value="1" />
                    <Tab label="Rejected Merchant" value="2" />
                    <Tab label="Terminated Merchant" value="3" />
                  </Tabs>

                  <TabPanel value="0" index={0}>
                    <Paper style={divStyle}>
                      {TableDataListing("Endorsed")}
                    </Paper>
                  </TabPanel>

                  <TabPanel value="1" index={1}>
                    <Paper style={divStyle}>
                      {TableDataListing("Pending")}
                    </Paper>
                  </TabPanel>

                  <TabPanel value="2" index={2}>
                    <Paper style={divStyle}>
                      {TableDataListing("Rejected")}
                    </Paper>
                  </TabPanel>
                  <TabPanel value="3" index={3}>
                    <Paper style={divStyle}>
                      {TableDataListing("Terminate")}
                    </Paper>
                  </TabPanel>
                </TabContext>
              </>
          }

        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewMerchantsComponent);
