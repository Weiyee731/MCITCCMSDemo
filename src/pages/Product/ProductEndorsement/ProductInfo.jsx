import React, { Component } from 'react'
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import createHistory from 'history/createBrowserHistory'
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";
import "./ProductInfo.css";
import { isStringNullOrEmpty } from "../../../tools/Helpers";
import Logo from "../../../assets/logos/logo.png";
import CategoryHierachy from "../../../components/share/categoryHierachy";
import IconButton from '@material-ui/core/IconButton';
import { ArrowRoundedLeft8x13Svg, ArrowRoundedRight8x13Svg } from '../../../assets/svg';

import TableCell from '@mui/material/TableCell';
import TableComponents from "../../../components/TableComponents/TableComponents";



const history = createHistory()

function mapStateToProps(state) {
    return {
        productInfo: state.counterReducer["productsByID"],
        productMgmtResult: state.counterReducer["productMgmtResult"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallProductDetail: (prodData) => dispatch(GitAction.CallProductDetail(prodData)),
        CallEndorseProduct: (prodData) => dispatch(GitAction.CallEndorseProduct(prodData)),
        CallResetProductMgmtReturnVal: () => dispatch(GitAction.CallResetProductMgmtReturnVal()),
        CallAllProducts: (prodData) => dispatch(GitAction.CallAllProducts(prodData)),
    };
}

const INITIAL_STATE = {
    // user info
    userId: null,

    // product info
    ProductID: "",
    ProductMedias: [],
    ProductSpecifications: [],
    ProductVariation: [],

    // merchant info
    MerchantDetail: [],


    categoryListing: [],

    // form inputs

    // any
    isProductIntoBind: false,
    currentProductIndex: 0,
    currentImage: {},
}

class ProductEndorsementInfo extends Component {
    constructor(props) {
        super(props)
        this.state = INITIAL_STATE

        this.endorseProduct = this.endorseProduct.bind(this)
        this.handleImageCarousel = this.handleImageCarousel.bind(this)
    }

    componentDidMount() {
        let userId = JSON.parse(localStorage.getItem("loginUser"))[0].UserID
        if (!isStringNullOrEmpty(userId) && !isStringNullOrEmpty(this.props.ProductID)) {
            this.setState({
                ProductID: this.props.ProductID,
                userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
                ProductName: this.props.ProductName
            })
            this.props.CallProductDetail({
                productId: this.props.ProductID,
                userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
                ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
            })

        }
        else
            toast.error("Somthing goes wrong")
    }

    componentDidUpdate(prevProps) {
        if (typeof this.props.productInfo !== "undefined" && this.props.productInfo.length > 0 && typeof this.props.productInfo.ReturnVal === "undefined" && !this.state.isProductIntoBind)
            this.bindProductInfoToState()
        else if (!this.state.isProductIntoBind && typeof this.props.productInfo.ReturnVal !== "undefined")
            toast.error("Somthing goes wrong with the server or network connection")

        if (typeof this.props.productMgmtResult !== "undefined" && this.props.productMgmtResult.length > 0) {
            if (this.props.productMgmtResult[0].ReturnVal == 1) {
                this.props.CallResetProductMgmtReturnVal();

                //fetch the latest pending items for endorsement
                this.props.CallAllProducts({
                    type: 'Status',
                    typeValue: 'Pending',
                    userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
                    productPage: '999',
                    page: '1',
                    ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
                });

                // it will return to table 
                toast.success("This product endorsed successfully.", {
                    autoClose: 3000,
                    onClose: () => {
                        history.push("/viewProductEndorsement");
                        window.location.reload(false);
                        // this.props.backToList(false)
                    }
                })
            }
            else {
                toast.error("Something wents wrong during endorsing this product. Please contact developer.", { autoClose: 3000, })
            }
        }
    }

    bindProductInfoToState = () => {
        const ProductInfo = this.props.productInfo[0]

        let medias = [];
        let specifications = [];
        let variations = [];
        let merchantDetail = []

        if (ProductInfo.ProductImages !== null || ProductInfo.ProductImages != null)
            medias = JSON.parse(ProductInfo.ProductImages)

        if (ProductInfo.ProductSpecification !== null || ProductInfo.ProductSpecification != null)
            specifications = JSON.parse(ProductInfo.ProductSpecification)

        if (ProductInfo.ProductVariation !== null || ProductInfo.ProductVariation != null)
            variations = JSON.parse(ProductInfo.ProductVariation)

        if (ProductInfo.MerchantDetail !== null || ProductInfo.MerchantDetail != null)
            merchantDetail = JSON.parse(ProductInfo.MerchantDetail)

        this.setState({
            isProductIntoBind: true,
            ProductMedias: medias,
            ProductSpecifications: specifications,
            ProductVariation: variations,
            MerchantDetail: merchantDetail,
            currentImage: (medias.length > 0) ? medias[0] : { ProductMediaUrl: "", ProductMediaTitle: "", }
        })
    }

    endorseProduct = () => {
        if (typeof this.props.ProductID !== "undefined" && this.props.ProductID != null)
            this.props.CallEndorseProduct({
                ProductID: this.props.ProductID,
                UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
            })
    }

    handleImageCarousel = (index) => {
        const { ProductMedias, currentProductIndex } = this.state
        const totalMedias = ProductMedias.length

        if (ProductMedias.length > 0 && typeof index === "string") {
            let newIndex = Number(currentProductIndex)

            if (index === 'prev') {
                if ((newIndex - 1) < 0) {
                    newIndex = totalMedias - 1
                    this.setState({
                        currentImage: ProductMedias[newIndex],
                        currentProductIndex: newIndex
                    })
                }
                else {
                    newIndex = currentProductIndex - 1
                    this.setState({
                        currentImage: ProductMedias[newIndex],
                        currentProductIndex: newIndex
                    })
                }
            }
            else if (index === 'next') {
                if ((newIndex + 1) > totalMedias - 1) {
                    newIndex = totalMedias - 1
                    this.setState({
                        currentImage: ProductMedias[0],
                        currentProductIndex: 0
                    })

                }
                else {
                    newIndex = currentProductIndex + 1
                    this.setState({
                        currentImage: ProductMedias[newIndex],
                        currentProductIndex: newIndex
                    })
                }
            }
        }
        else if (ProductMedias.length > 0) {
            this.setState({ currentProductIndex: Number(index), currentImage: ProductMedias[index] })
        }
    }

    getTagList() {
        var tagList = "-";

        let ProductTag = this.props.productInfo.length > 0 && this.props.productInfo[0].ProductTag !== null ? JSON.parse(this.props.productInfo[0].ProductTag.replace(/\\/g, "")) : []
        ProductTag.map((tag) => {
            if (tagList == "") {
                tagList = tag.tag;
            }
            else {
                tagList = tagList + " , " + tag.tag;
            }
        })
        return tagList
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell align="left"> {data.ProductSpecification} </TableCell>
                <TableCell align="left">{data.ProductSpecificationValue}</TableCell>
            </>
        )
    }

    renderTableVariationRows = (data, index) => {
        return (
            <>
                <TableCell align="left"> {data.ProductVariation} </TableCell>
                <TableCell align="left">{data.ProductVariationValue}</TableCell>
                <TableCell align="left"> {data.ProductVariationSKU} </TableCell>
                <TableCell align="left">{data.ProductVariationPrice}</TableCell>
            </>
        )
    }

    render() {
        const { productInfo } = this.props
        const { ProductMedias, currentImage } = this.state

        const getCategoryHierachyListing = (listing, id) => {
            // category = listing
            this.setState({ categoryListing: listing })
        }

        const tableSpecHeadCells = [
            {
                id: "ProductSpecification",
                align: 'left',
                numeric: false,
                disablePadding: false,
                label: "Type",
            },
            {
                id: "ProductSpecificationValue",
                align: 'left',
                numeric: false,
                disablePadding: false,
                label: "Value",
            },
        ];

        const tableVariationHeadCells = [
            {
                id: "ProductVariation",
                align: 'left',
                numeric: false,
                disablePadding: false,
                label: "Variation Type",
            },
            {
                id: "ProductVariationValue",
                align: 'left',
                numeric: false,
                disablePadding: false,
                label: "Variation",
            },
            {
                id: "ProductVariationSKU",
                align: 'left',
                numeric: false,
                disablePadding: false,
                label: "Variation SKU",
            },
            {
                id: "ProductVariationPrice",
                align: 'left',
                numeric: false,
                disablePadding: false,
                label: "Variation Price",
            },
        ];
        return (
            <div>
                <div className="container-fluid my-2">
                    <div className="row">

                        <div className="row" style={{ display: "flex" }}>
                            <div className="col-6">
                                <Button onClick={() => <>
                                    {history.push("/viewProductEndorsement")}
                                    {window.location.reload(false)}
                                </>}>
                                    <ArrowRoundedLeft8x13Svg fontSize="inherit" />

                                    <Link style={{ paddingLeft: "10px", paddingRight: "10px", textDecoration: "none", color: "black" }} to={"/viewProduct"}>
                                        Back
                                    </Link>
                                </Button>
                            </div>
                            <div className="col-6" style={{ textAlign: "right" }}>
                                <Button variant="outlined" style={{
                                    float: "right",
                                    marginBottom: "16px",
                                    marginLeft: "16px",
                                    color: "#32d800 ",
                                    fontWeight: "bold"
                                }}
                                    onClick={() => this.endorseProduct()}>Endorse Product
                                </Button>
                            </div>
                        </div>
                        {
                            typeof this.props.productInfo !== "undefined" && productInfo.length > 0 ?
                                <div>
                                    <div className="row" style={{ backgroundColor: "white", padding: "10px" }}>
                                        <div className="col-4 m-0">
                                            <div className="product-medias">
                                                {
                                                    <img src={currentImage.ProductMediaUrl} alt={currentImage.ProductName} width="350px" height="300px" onError={(e) => { e.target.onerror = null; e.target.src = Logo; }} />
                                                }
                                                <div>
                                                    <IconButton aria-label="prev-image" style={{ position: 'absolute' }} className="product-carousel-button prev-btn" size="medium" variant="outlined" onClick={() => this.handleImageCarousel('prev')} >
                                                        <ArrowRoundedLeft8x13Svg fontSize="inherit" />
                                                    </IconButton>
                                                    <IconButton aria-label="next-image" style={{ position: 'absolute' }} className="product-carousel-button next-btn" size="medium" variant="outlined" onClick={() => this.handleImageCarousel('next')}  >
                                                        <ArrowRoundedRight8x13Svg fontSize="inherit" />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-1 m-0">
                                            <div className="product-medias-gallery" style={{ paddingTop: "12px" }}>
                                                {
                                                    ProductMedias.length > 0 && ProductMedias.map((el, idx) => {
                                                        return (
                                                            <div className="product-medias-gallery-image">
                                                                <img src={el.ProductMediaUrl} alt={el.ProductName} width="100%" height="80%" onError={(e) => { e.target.onerror = null; e.target.src = Logo; }} onClick={() => this.handleImageCarousel(idx)} />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div>
                                                <h3><b>{productInfo[0].ProductName}</b></h3>
                                                <hr />
                                                <div>
                                                    <CategoryHierachy productInfo={productInfo} getCategoryHierachyListing={getCategoryHierachyListing} />
                                                    <label style={{ color: "grey" }}>{this.state.categoryListing.length > 0 && this.state.categoryListing.map((data, index) => {
                                                        return (
                                                            index === 0 ?
                                                                <label >{"  " + data}</label> :
                                                                <label>{"  >  " + data}</label>
                                                        )
                                                    })}</label>
                                                </div>
                                                <br />
                                                <div><label><b> Brand :</b> {productInfo[0].Brand === null ? '-' : productInfo[0].Brand}</label></div>
                                                <div><label><b> Model :</b> {productInfo[0].Model === null ? '-' : productInfo[0].Model}</label></div>
                                                <div><label><b> Product Tags :</b> {this.getTagList()}</label></div>
                                                <div><label><b> Dimension :</b>
                                                    <span className="mr-1"> {productInfo[0].ProductDimensionHeight === null ? '-' : productInfo[0].ProductDimensionHeight} m (H) x </span>
                                                    <span className="mr-1"> {productInfo[0].ProductDimensionWidth === null ? '-' : productInfo[0].ProductDimensionWidth}m (W) x </span>
                                                    <span className="mr-1"> {productInfo[0].ProductDimensionDeep === null ? '-' : productInfo[0].ProductDimensionDeep}m (D) {"  "}</span>
                                                    <span className="ml-1">( {productInfo[0].ProductWeight === null ? '-' : productInfo[0].ProductWeight} KG )</span>
                                                </label>
                                                </div>
                                                <div><label><b> Merchant : </b>
                                                    {this.state.MerchantDetail.length > 0 && this.state.MerchantDetail[0] !== undefined ? this.state.MerchantDetail[0].ShopName + "(" + this.state.MerchantDetail[0].ShopCity + ")"
                                                        : "-"
                                                    }
                                                    {/* {productInfo[0].Model === null ? '-' : productInfo[0].Model} */}
                                                </label></div>
                                                <br />
                                                <div>
                                                    <div style={{ fontSize: '24pt', color: "slatgrey", fontWeight: "bold" }}>
                                                        RM {productInfo[0].ProductPrice === null ? "-" : productInfo[0].ProductPrice} {" "}
                                                    </div>
                                                </div>
                                                <div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Merchant Profile */}
                                    {/* <br></br>
                                    {
                                        this.state.MerchantDetail.length > 0 &&
                                        <div className='row' style={{ backgroundColor: "white", padding: "20px" }}>
                                            <div className="col-1">
                                                <div className="merchant-profile-image">
                                                    <img
                                                        src={""}
                                                        alt={this.state.MerchantDetail[0].ShopName}
                                                        width="100px" height="100%"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = Logo;
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <div>
                                                    <div className="merchant-name">{this.state.MerchantDetail[0].ShopName} ({this.state.MerchantDetail[0].ShopCity})</div>

                                                    <span className="merchant-joined-date" style={{ color: "grey" }}>
                                                        Last Joined: <i>{this.state.MerchantDetail[0].LastJoined === null ? "N/A" : this.state.MerchantDetail[0].LastJoined}</i>
                                                    </span>

                                                    <label className="mt-1 merchant-description">{this.state.MerchantDetail[0].ShopDescription}</label>
                                                </div>
                                            </div>
                                        </div>
                                    } */}

                                    <br />
                                    <div className='row' >
                                        <div className='col-6' style={{ backgroundColor: "white", padding: "20px" }}>
                                            {/* <h6>Product Specification</h6> */}
                                            <TableComponents
                                                // table settings 
                                                tableTopLeft={<h6 style={{ fontWeight: "bold" }}>Product Specification</h6>}
                                                tableOptions={{
                                                    dense: true,                // optional, default is false
                                                    tableOrderBy: 'asc',        // optional, default is asc
                                                    sortingIndex: "ProductName",        // require, it must the same as the desired table header
                                                    stickyTableHeader: false,    // optional, default is true
                                                }}
                                                paginationOptions={[5, 10, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                                                tableHeaders={tableSpecHeadCells}        //required
                                                tableRows={{
                                                    renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                                                    checkbox: false,                          // optional, by default is true
                                                }}
                                                Data={this.state.ProductSpecifications}
                                            />
                                        </div>

                                        <div className='col-6' style={{ backgroundColor: "white", padding: "20px" }}>
                                            <TableComponents
                                                // table settings 
                                                tableTopLeft={<h6 style={{ fontWeight: "bold" }}>Product Variation</h6>}
                                                tableOptions={{
                                                    dense: true,                // optional, default is false
                                                    tableOrderBy: 'asc',        // optional, default is asc
                                                    sortingIndex: "ProductVariationDetailID",        // require, it must the same as the desired table header
                                                    stickyTableHeader: false,    // optional, default is true
                                                }}
                                                paginationOptions={[5, 10, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                                                tableHeaders={tableVariationHeadCells}        //required
                                                tableRows={{
                                                    renderTableRows: this.renderTableVariationRows,   // required, it is a function, please refer to the example I have done in Table Components
                                                    checkbox: false,                          // optional, by default is true
                                                }}
                                                Data={this.state.ProductVariation}
                                            />
                                        </div>
                                    </div>
                                    <br />
                                    <div className='row' >
                                        <div className="row" style={{ backgroundColor: "white", padding: "20px" }}>
                                            <h6 style={{ fontWeight: "bold" }}>Product Description</h6>
                                            <div dangerouslySetInnerHTML={{ __html: productInfo[0].ProductDescription }}></div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div>
                                    <i>Something went wrong, please try again later</i>
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductEndorsementInfo);
