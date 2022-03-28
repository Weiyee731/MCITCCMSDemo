import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { GitAction } from "../../store/action/gitAction";
import "../../app/App.scss";
import PromotionDetailsComponent from "./promotionDetails.component";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Logo from "../../assets/logos/logo.png";
import TableComponents from "../../components/TableComponents/TableComponents";
import SearchBar from "../../components/SearchBar/SearchBar"

import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/Add';
import { convertDateTimeToDDMMYY } from "../../tools/Helpers";

function mapStateToProps(state) {
    return {
        allpromo: state.counterReducer["promotions"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallViewPromotion: (promoData) =>
            dispatch(GitAction.CallViewPromotion(promoData)),
        CallDeletePromotion: (promoData) =>
            dispatch(GitAction.CallDeletePromotion(promoData)),
    };
}


class ViewProductPromotionComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isdetailsShown: false,
            selectedListID: [],
            isFiltered: false,
            searchKeywords: "",
            filteredProduct: [],

            PromotionID: "",
            PromotionTitle: "",
            BeginDate: "",
            EndDate: "",
            PromotionDesc: "",
            PromotionDetail: "",
            DiscountPercentage: "",
        };
        this.props.CallViewPromotion({ Ind: 0, ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID });
  
        // this.props.CallViewPromotion({ Ind: this.state.promotionStatus, ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID });
    }


    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell align="left"> {data.PromotionTitle}  </TableCell>
                <TableCell align="left">  {convertDateTimeToDDMMYY(data.BeginDate)} </TableCell>
                <TableCell align="left">   {convertDateTimeToDDMMYY(data.EndDate)}</TableCell>
                <TableCell align="left"> {data.PromotionDesc} </TableCell>
                <TableCell align="left">
                    {data.PromotionDetail
                        ? JSON.parse(
                            data.PromotionDetail
                        ).map((product) => (
                            <p>{product.ProductName}</p>
                        ))
                        : null}
                </TableCell>
            </>
        )
    }

    onTableRowClick = (event, row) => {
        this.setState({
            PromotionID: row.PromotionID,
            PromotionTitle: row.PromotionTitle,
            BeginDate: row.BeginDate,
            EndDate: row.EndDate,
            PromotionDesc: row.PromotionDesc,
            PromotionDetail: row.PromotionDetail,
            DiscountPercentage: row.DiscountPercentage,
        });

        if (this.state.isdetailsShown) {
            this.setState({ isdetailsShown: false, });
        } else {
            this.setState({ isdetailsShown: true, });
        }
    }

    onDelete = () => {
        let IDs = []
        this.state.selectedListID.length > 0 && this.state.selectedListID.map((row) => {
            IDs.push(row.PromotionID)
        })
        this.props.CallDeletePromotion({
            PromotionID: IDs,
            // UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID
        })
    }

    searchSpace = (value) => {
        this.setState({ searchKeywords: value })
        this.state.filteredProduct.splice(0, this.state.filteredProduct.length)
        let DataSet = this.props.allpromo

        DataSet.length > 0 && DataSet.filter((searchedItem) =>
            searchedItem.PromotionTitle !== null && searchedItem.PromotionTitle.toLowerCase().includes(
                value.toLowerCase()
            )
        ).map((filteredItem) => {
            this.state.filteredProduct.push(filteredItem);
        })
        this.setState({ isFiltered: true })
    }


    render() {
        const tableHeadCells = [
            {
                id: "PromotionTitle",
                numeric: false,
                disablePadding: false,
                label: "Promotion Title",
            },
            {
                id: "BeginDate",
                numeric: false,
                disablePadding: false,
                label: "Start Date",
            },
            { id: "EndDate", numeric: false, disablePadding: false, label: "End Date" },
            {
                id: "PromotionDesc",
                numeric: false,
                disablePadding: false,
                label: "Description",
            },
            {
                id: "SelectedProduct",
                numeric: false,
                disablePadding: false,
                label: "Product",
            },
        ];

        const renderButtonOnTableTopRight = () => {
            return (
                <div className="d-flex">
                    <Tooltip title="Create new Promotion">
                        <IconButton size="medium" sx={{ border: "2px solid #0074ea", color: "#0074ea", marginRight: 1 }}>
                            <Link className="nav-link" to={"/addPromotion"}>
                                <GroupAddIcon />
                            </Link>
                        </IconButton>
                    </Tooltip>
                </div>
            )
        }
        return (
            <div className="container-fluid my-2">
                <div className="row">
                    {this.state.isdetailsShown ? (
                        <PromotionDetailsComponent data={this.state} data2={this.props} />
                    ) :
                        (
                            <>
                                <div className="col-md-12 col-12 mb-3 d-flex" >
                                    <SearchBar
                                        id=""
                                        placeholder="Search by promotion title..."
                                        buttonOnClick={() => this.onSearch("", "")}
                                        onChange={(e) => this.searchSpace(e.target.value)}
                                        className="searchbar-input mb-auto"
                                        disableButton={this.state.isDataFetching}
                                        tooltipText="Search with current data"
                                        value={this.state.searchKeywords}
                                    />
                                </div>
                                < TableComponents
                                    // table settings 
                                    tableTopLeft={<h3 style={{ fontWeight: 600 }}>Promotion List</h3>}
                                    tableTopRight={renderButtonOnTableTopRight()}
                                    tableOptions={{
                                        dense: true,
                                        tableOrderBy: 'asc',
                                        sortingIndex: "PromotionID",
                                        stickyTableHeader: true,
                                    }}
                                    paginationOptions={[8, 15, 20, { label: 'All', value: -1 }]}
                                    tableHeaders={tableHeadCells}
                                    tableRows={{
                                        renderTableRows: this.renderTableRows,
                                        checkbox: true,
                                        checkboxColor: "primary",
                                        onRowClickSelect: false
                                    }}
                                    selectedIndexKey={"ProductID"}

                                    Data={this.state.isFiltered === false ? this.props.allpromo !== undefined && this.props.allpromo.length > 0 && this.props.allpromo[0].ReturnVal === '0' ? [] : this.props.allpromo
                                        : this.state.filteredProduct
                                    }
                                    onSelectRow={(e) => this.setState({ selectedListID: e })}
                                    onSelectAllRows={(e) => this.setState({ selectedListID: e })}
                                    onTableRowClick={this.onTableRowClick}
                                    SelectionActionButtons={
                                        <Tooltip title="Delete">
                                            <IconButton aria-label="delete" onClick={() => { this.onDelete() }}   >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                />
                            </>

                        )}
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewProductPromotionComponent);
