import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Card,
    CardContent,
    Table,
    TableRow,
    TableCell,
    CardHeader,
    TableBody,
    Button,
    FormHelperText,
} from "@mui/material";
import { GitAction } from "../../store/action/gitAction";
import TextField from "@mui/material/TextField";
import Dropzone from "react-dropzone";
// import { browserHistory } from "react-router";
function mapStateToProps(state) {
    return {
        allgridstorages: state.counterReducer["gridstorage"],
        salesOrders: state.counterReducer["salesOrders"],

    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallSendSalesOrder: (orderData) =>
            dispatch(GitAction.CallSendSalesOrder(orderData)),
        CallResetSalesOrder: () => dispatch(GitAction.CallResetSalesOrder()),
    };
}

class SupplierResponseComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ProductPurchaseOrderID: this.props.data.ProductPurchaseOrderID,
            remark: "",
            file: [],
            fileInfo: [],
            counter2: 0,
            notEnoughFiles: false,
            salesOrderNo: "",
            isSubmit: false,
        };
    }

    handleChange = (data, e) => {
        if (data == "remark") {
            this.setState({
                remark: e.target.value,
            });
        } else if (data == "salesOrder") {
            this.setState({
                salesOrderNo: e.target.value,
            });
        }
    };

    handleDrop = (data, acceptedFiles) => {
        this.setState((state) => {
            const file = state.file.concat(acceptedFiles.map((file) => file));
            const fileInfo = state.fileInfo.concat(
                acceptedFiles.map((file) => file.name)
            );
            // const url = state.url.concat(
            //   acceptedFiles.map((file) => URL.createObjectURL(file))
            // );
            return {
                file,
                fileInfo,
                // url,
            };
        });
    };

    onDelete = (index, data) => {
        var newList2 = this.state.file;
        this.state.file.map((file, i) => {
            var valueToBeUsed2 = parseInt(index);

            if (i === valueToBeUsed2) {
                newList2 = newList2.filter((file2) => file !== file2);
                this.setState({
                    counter2: this.state.file.counter2 + 1,
                });
            }
        });
        this.setState({
            file: newList2.map((file3) => file3),
            fileInfo: newList2.map((file3) => file3.name),
            // url: newList2.map((file3) => URL.createObjectURL(file3)),
        });
    };

    submitSalesOrder = () => {
        if (this.state.file.length > 1) {
            alert("Only one file is allowed.");
        } else if (this.state.file.length == 0) {
            alert("Sales Order File is Empty.");
        } else if (this.state.salesOrderNo == "") {
            alert("Sales Order Number is empty.");
        } else {
            const dataToSend = {
                remark: this.state.remark,
                salesOrderNo: this.state.salesOrderNo,
                ProductPurchaseOrderID: this.state.ProductPurchaseOrderID,
                file: this.state.file[0],
            };
            this.props.CallSendSalesOrder(dataToSend);
            this.setState({ isSubmit: true })
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.salesOrders !== undefined && this.props.salesOrders.length > 0 && this.state.isSubmit === true) {
            if (this.props.salesOrders[0].PRODUCTPURCHASEORDERID !== undefined) {
                this.props.CallResetSalesOrder()
                // browserHistory.push("/ecommerceCMSDev/viewPurchaseOrderList")
                // window.location.reload(false);
            }
        }
    }

    render() {
        const changeBackground = (e) => {
            e.target.style.background = "#a31702";
            e.target.style.color = "#fff";
        };
        const changeBackground2 = (e) => {
            e.target.style.background = "#fff";
            e.target.style.color = "#a31702";
        };

        const back = () => {
            window.location.reload(false);
        };
        return (
            <div>
                <h2 style={{ margin: "10px" }}>Sales Order Submission</h2>
                <Button onClick={back}>
                    <i class="fas fa-chevron-left"></i>Back
                </Button>
                <Card style={{ width: "80%", margin: "0 auto" }}>
                    <CardContent>
                        <h5>Sales Order Number</h5>
                        <TextField
                            style={{ width: "100%", margin: "5px" }}
                            id="outlined-multiline-static"
                            label="Sales Order Number"
                            value={this.state.salesOrderNo}
                            onChange={this.handleChange.bind(this, "salesOrder")}
                            variant="outlined"
                        />
                        <FormHelperText style={{ textAlign: "right" }}>
                            {" "}
                            Required*
                        </FormHelperText>
                        <h5>Remarks</h5>
                        <TextField
                            style={{ width: "100%", margin: "5px" }}
                            id="outlined-multiline-static"
                            label="Remarks"
                            multiline
                            rows={8}
                            value={this.state.remark}
                            onChange={this.handleChange.bind(this, "remark")}
                            variant="outlined"
                        />
                        <h5 style={{ margin: "10px" }}>Sales Order File</h5>
                        <Dropzone
                            onDrop={this.handleDrop.bind(this, "")}
                            multiple
                            accept=".pdf, .doc, .docx"
                        >
                            {({
                                getRootProps,
                                getInputProps,
                                isDragActive,
                                isDragAccept,
                                isDragReject,
                            }) => (
                                <div
                                    {...getRootProps({
                                        className: "dropzone",
                                    })}
                                    style={{
                                        background: "#f0f0f0",
                                        padding: "20px",
                                        margin: "0px auto",
                                        marginTop: "5px",
                                        borderStyle: "dashed",
                                        borderColor: isDragActive
                                            ? isDragReject
                                                ? "#fc5447"
                                                : "#a0d100"
                                            : "#b8b8b8",
                                        borderWidth: "2px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                        selfAlign: "center",
                                        width: "90%",
                                        height: "auto",
                                        color: isDragActive
                                            ? isDragReject
                                                ? "#a31702"
                                                : "#507500"
                                            : "#828282",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    <p>
                                        {isDragActive
                                            ? isDragReject
                                                ? "The file needs to be a document"
                                                : "Release to drop file"
                                            : "Drag and drop your Sales Order, or click to select files."}
                                    </p>
                                </div>
                            )}
                        </Dropzone>
                        <div>
                            <br />

                            <strong>Chosen Files:</strong>
                            <ul>
                                {this.state.fileInfo.map((fileName, i) => (
                                    <li
                                        style={{
                                            listStyle: "none",
                                        }}
                                        key={fileName}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                width: "100%",
                                                alignContent: "space-between",
                                            }}
                                        >
                                            <p style={{ margin: "5px", width: "100%" }}>{fileName}</p>
                                            <button
                                                style={{
                                                    borderColor: "#a31702",
                                                    background: "#fff",
                                                    borderWidth: "2px",
                                                    borderRadius: "5px",
                                                    marginRight: "10px",
                                                    color: "#a31702",
                                                    fontWeight: "bold",
                                                }}
                                                onMouseOver={changeBackground}
                                                onMouseLeave={changeBackground2}
                                                key={fileName}
                                                onClick={this.onDelete.bind(this, i, "")}
                                            >
                                                {" "}
                                                Remove{" "}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {this.state.notEnoughFiles && (
                            <p
                                style={{
                                    color: "#a31702",
                                    margin: "0px 0px 0px 10px",
                                    fontSize: "14px",
                                }}
                            >
                                There should be at least one file uploaded.
                            </p>
                        )}
                        <div style={{ width: "100%", textAlign: "center" }}>
                            <Button
                                onClick={this.submitSalesOrder.bind(this)}
                                variant="contained"
                                style={{
                                    width: "60%",
                                    padding: "8px",
                                    borderRadius: "5px",
                                    borderColor: "#828282",
                                    fontWeight: "bold",
                                }}
                            >
                                {" "}
                                Submit
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SupplierResponseComponent);
