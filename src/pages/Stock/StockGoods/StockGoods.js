import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { browserHistory } from "react-router";
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import TableComponents from "../../../components/TableComponents/TableComponents";
import { Button } from "@mui/material";

function mapStateToProps(state) {
    return {
        foods: state.counterReducer["foods"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallTesting: () => dispatch(GitAction.CallTesting()),
    };
}

const headCells = [
    {
        id: 'name',
        align: 'left',
        disablePadding: false,
        label: 'Dessert ',
    },
    {
        id: 'calories',
        align: 'center',
        disablePadding: false,
        label: 'Calories',
    },
    {
        id: 'fat',
        align: 'center',
        disablePadding: false,
        label: 'Fat (g)',
    },
    {
        id: 'carbs',
        align: 'center',
        disablePadding: false,
        label: 'Carbs (g)',
    },
    {
        id: 'protein',
        align: 'center',
        disablePadding: false,
        label: 'Protein (g)',
    },
];

function createData(pid, name, calories, fat, carbs, protein) {
    return {
        pid,
        name,
        calories,
        fat,
        carbs,
        protein,
    };
}

const rows = [
    createData(1, 'Cupcake', 305, 3.7, 67, 4.3),
    createData(2, 'Donut', 452, 25.0, 51, 4.9),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0),
    createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
    createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
    createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
    createData(9, 'KitKat', 518, 26.0, 65, 7.0),
    createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
    createData(11, 'Marshmallow', 318, 0, 81, 2.0),
    createData(12, 'Nougat', 360, 19.0, 9, 37.0),
    createData(13, 'Oreo', 437, 18.0, 63, 4.0),
];


const INITIAL_STATE = {

}

class StockGoods extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell
                    component="th"
                    id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                    padding="normal"
                >
                    {data.name}
                </TableCell>
                <TableCell align="center">{data.calories}</TableCell>
                <TableCell align="center">{data.fat}</TableCell>
                <TableCell align="center">{data.carbs}</TableCell>
                <TableCell align="center">{data.protein}</TableCell>
            </>
        )
    }

    renderTableActionButton = () => {
        return (
            <div className="d-flex">
                <Tooltip sx={{ marginLeft: 5 }} title="Add New Items">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Buton">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </div>
        )
    }

    onTableRowClick = (event, row) => {
        console.log(row)
    }

    onAddButtonClick = (item) => {
        console.log('add button')
    }

    onDeleteButtonClick = (items) => {
        console.log('delete button')
        console.log(items)
    }

    render() {
        return (
            <div>
                <h1>StockGoods</h1>
                <div className="w-100 container-fluid">
                    <TableComponents
                        // detailed documentations is in this component js file. Please refer.
                        tableTopLeft={<h3 style={{ fontWeight: 600 }}>Table Name</h3>} 
                        tableTopRight={<Button>OnClick</Button>}
                        tableOptions={{
                            dense: true,               
                            tableOrderBy: 'asc',      
                            sortingIndex: "fat",       
                            stickyTableHeader: false,    
                            stickyTableHeight: 300,   
                            elevation: 1
                        }}
                        paginationOptions={[5, 100, 250, { label: 'All', value: -1 }]}
                        tableHeaders={headCells}   
                        tableRows={{
                            renderTableRows: this.renderTableRows,  
                            checkbox: true,                         
                            checkboxColor: "primary",                
                            onRowClickSelect: false                 
                        }}
                        Data={rows}                                
                        onSelectRow={(e) => console.log(e)}
                        onSelectAllRows={(e) => console.log(e)}
                        onTableRowClick={this.onTableRowClick}      
                        SelectionActionButtons={<Button onClick={() => alert('hi')}>SelectionActionButtons</Button>}   
                    />
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockGoods);