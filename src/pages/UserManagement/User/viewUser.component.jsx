import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { GitAction } from "../../../store/action/gitAction";

// Share Components
import UserDetailsComponent from "./viewUserDetails.components";
import TableComponents from "../../../components/TableComponents/TableComponents";
import SearchBar from "../../../components/SearchBar/SearchBar"
import Select from 'react-select';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { isArrayNotEmpty } from "../../../tools/Helpers";
import { toast } from "react-toastify";
import { connectableObservableDescriptor } from "rxjs/observable/ConnectableObservable";
import MerchantDetails from "../Merchant/merchantDetails.component";
import { Dataset } from "@mui/icons-material";


function mapStateToProps(state) {
    return {
        allUser: state.counterReducer["currentUser"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // CallAllUsers: () => dispatch(GitAction.CallAllUsers()),
        CallUserProfile: (prodData) => dispatch(GitAction.CallUserProfile(prodData)),
    };
}

class ViewUserComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            firstName: "",
            lastName: "",
            userContact: "",
            companyDesc: "",
            companyName: "",
            companyWebsite: "",
            companyAddressLine1: "",
            companyAddressLine2: "",
            companyPoscode: "",
            companyCity: "",
            companyState: "",

            filteredProduct: [],
            isFiltered: false,
            searchKeywords: "",
            selectedFilter: 0,
            isdetailsShown: false,
        };
    }

    componentDidMount() {
        this.props.CallUserProfile({
            TYPE: "Usertype",
            TYPEVALUE: localStorage.getItem("loginUser") !== null && JSON.parse(localStorage.getItem("loginUser"))[0].UserID !== undefined ?
                JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID
                : 0,
            USERID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
            USERROLEID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID : 0,
            LISTPERPAGE: 999,
            PAGE: 1,
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
        });
    }

    componentDidUpdate(prevProps) {
        if(prevProps.allUser !== this.props.allUser && this.props.allUser.length === 0){
            this.props.CallUserProfile({
            TYPE: "Usertype",
            TYPEVALUE: localStorage.getItem("loginUser") !== null && JSON.parse(localStorage.getItem("loginUser"))[0].UserID !== undefined ?
                JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID
                : 0,
            USERID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
            USERROLEID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID : 0,
            LISTPERPAGE: 999,
            PAGE: 1,
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
        });
        }
        
    }

    componentWillUnmount() {
        // clearImmediate(this.props.allUser)
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell align="left"> {(data.FirstName !== null && data.FirstName !== undefined ? data.FirstName : "-") + " " + (data.LastName !== null && data.LastName !== undefined ? data.LastName : "-")} </TableCell>
                <TableCell align="left"> {data.UserContactNo !== null && data.UserContactNo !== undefined ? data.UserContactNo : "-"} </TableCell>
                <TableCell align="left"> {data.UserEmailAddress !== null && data.UserEmailAddress !== undefined ? data.UserEmailAddress : "-"} </TableCell>
                <TableCell align="left"> {data.ActiveInd === 1 ? "ACTIVE" : "NON-ACTIVE"} </TableCell>
            </>
        )
    }


    searchSpace = (value, e) => {
        let DataSet = this.props.allUser.length > 0 ? this.props.allUser.filter((x)=>x.UserTypeID === 16 || x.UserTypeID === 17) : []
        this.state.filteredProduct.splice(0, this.state.filteredProduct.length)

        //filter by user type
        e.id !== null && e.id !== 0 && e.id !== undefined &&
            this.setState({ selectedFilter: { id: e.id, value: e.value, label: e.label } })
        if (parseInt(e.id) === 0){
            if (DataSet.length > 0) {
                DataSet.map((x) =>
                    this.state.filteredProduct.push(x)
                )
            }
        }
            
        else {
            if (DataSet.length > 0) {
                DataSet.filter((x) => x.UserTypeID === parseInt(e.id)).map((x) =>
                    this.state.filteredProduct.push(x)
                )
            }
        }
        //search bar
        if (value !== undefined && value !== null) {
            this.setState({ searchKeywords: value })
            DataSet.length > 0 && DataSet.filter((searchedItem) =>
                searchedItem.FirstName !== null && searchedItem.FirstName.toLowerCase().includes(
                    value.toLowerCase()
                )
            ).map((filteredItem) => {
                this.state.filteredProduct.push(filteredItem);
            })

            DataSet.length > 0 && DataSet.filter((searchedItem) =>
                searchedItem.LastName !== null && searchedItem.LastName.toLowerCase().includes(
                    value.toLowerCase()
                )
            ).map((filteredItem) => {
                this.state.filteredProduct.push(filteredItem);
            })

            DataSet.length > 0 && DataSet.filter((searchedItem) =>
                searchedItem.UserContactNo !== null && searchedItem.UserContactNo.toLowerCase().includes(
                    value.toLowerCase()
                )
            ).map((filteredItem) => {
                this.state.filteredProduct.push(filteredItem);
            })

            DataSet.length > 0 && DataSet.filter((searchedItem) =>
                searchedItem.UserEmailAddress !== null && searchedItem.UserEmailAddress.toLowerCase().includes(
                    value.toLowerCase()
                )
            ).map((filteredItem) => {
                this.state.filteredProduct.push(filteredItem);
            })
        }

        let removeDuplicate = this.state.filteredProduct.length > 0 ? this.state.filteredProduct.filter((ele, ind) => ind === this.state.filteredProduct.findIndex(elem => elem.UserID === ele.UserID)) : []
        this.setState({ isFiltered: true, filteredProduct: removeDuplicate })
    }

    onTableRowClick = (event, row) => {
        if(row.UserTypeID === 17){
            this.setState({
            name: row,
            firstName: row.FirstName,
            lastName: row.LastName,
            userTypeId: row.UserTypeID,
            userContact: row.UserContactNo,
            companyDesc: row.CompanyDescription,
            companyName: row.CompanyName,
            companyWebsite: row.CompanyWebsite,
            companyAddressLine1: row.CompanyAddressLine1,
            companyAddressLine2: row.CompanyAddressLine2,
            companyPoscode: row.CompanyPosCode,
            companyCity: row.CompanyCity,
            companyState: row.CompanyState
        });
        }else if (row.UserTypeID === 16){
            this.setState({
            userId: row.UserID,
            name: row.ShopName,
            userTypeId: row.UserTypeID,
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
            isdetailsShown: false,})
        }
        
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
        const DataList = this.props.allUser.length > 0 &&
            this.props.allUser !== undefined &&
            this.props.allUser[0].ReturnVal !== "0" ? this.props.allUser : []
console.log(this.props.allUser)

        const tableHeadCells = [
            {
                id: "Name",
                numeric: false,
                disablePadding: false,
                label: "Name",
            },
            {
                id: "UserContactNo",
                numeric: false,
                disablePadding: false,
                label: "Contact No.",
            },
            {
                id: "UserEmailAddress",
                numeric: false,
                disablePadding: false,
                label: "Email",
            },
            {
                id: "ActiveInd",
                numeric: true,
                disablePadding: false,
                label: "ACTIVE IND",
            },
        ];

        const setDetailsShown = (value) => {
            this.setState({
                isdetailsShown: value,
            });
        };

        const setFilter = (value) => {
            this.setState({
                isFiltered: value,
            });
        };

        const filterSelection =
            [
                // { id: "1", value: "Super Admin" },
                // { id: "2", value: "Shareholder" },
                // { id: "3", value: "Director" },
                // { id: "4", value: "General Manager" },
                // { id: "5", value: "Financial Manager" },
                // { id: "6", value: "Logistic Manager" },
                // { id: "7", value: "Stock Manager" },
                // { id: "8", value: "Staffs" },
                // { id: "9", value: "Staffs" },
                // { id: "10", value: "Staffs" },
                // { id: "11", value: "Staffs" },
                // { id: "12", value: "Staffs" },
                // { id: "13", value: "Staffs" },
                // { id: "14", value: "Staffs" },
                // { id: "15", value: "Supplier" },
                {id:"0", value: "All"},
                { id: "16", value: "Merchant" },
                { id: "17", value: "User" }
            ]

        return (
            <div className="container-fluid my-2">
                <div className="row">
                    {
                        this.state.isdetailsShown === true ?
                        <>
                            {this.state.userTypeId === 16 &&
                                <MerchantDetails
                                    data={this.state}
                                    data2={this.props}
                                    history={this.props.history}
                                    setDetailsShown={setDetailsShown}
                                    setfilter={setFilter}
                                />}
                            {this.state.userTypeId === 17 &&
                                <UserDetailsComponent
                                    data={this.state}
                                    setDetailsShown={setDetailsShown}
                                    setfilter={setFilter}
                                />}
                        </>
                            :
                            <>
                                <div className="col-2 d-inline-flex">
                                    <Select
                                        labelId="search-filter-category"
                                        id="search-filter-category"
                                        label="Search By"
                                        onChange={(e) => this.searchSpace(null, e)}
                                        size="small"
                                        value={this.state.selectedFilter}
                                        IconComponent={FilterListOutlinedIcon}
                                        className="col-11"
                                        placeholder="Filter By User Type"
                                        options={
                                            isArrayNotEmpty(filterSelection) && filterSelection.map((el, idx) => {
                                                return { id: el.id, value: el.value, label: el.value }
                                            })
                                        }
                                    >
                                    </Select>
                                </div>
                                <div className="col-md-10 col-10 mb-3 d-flex" >
                                    <SearchBar
                                        id=""
                                        placeholder="Enter Name, Phone and Email ..."
                                        buttonOnClick={() => this.onSearch("", "")}
                                        onChange={(e) => this.searchSpace(e.target.value, 0)}
                                        className="searchbar-input mb-auto"
                                        disableButton={this.state.isDataFetching}
                                        tooltipText="Search with current data"
                                        value={this.state.searchKeywords}
                                    />
                                </div>
                                <TableComponents
                                    tableTopLeft={<h3 style={{ fontWeight: 600 }}>User List</h3>}
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
                                            DataList.filter((x)=>x.UserTypeID === 16 || x.UserTypeID === 17) : this.state.filteredProduct
                                    }                                 // required, the data that listing in the table
                                    onSelectRow={(e) => this.setState({ selectedListID: e })}
                                    onSelectAllRows={(e) => this.setState({ selectedListID: e })}
                                    onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row
                                />
                            </>
                    }


                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewUserComponent);
