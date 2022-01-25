import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { GitAction } from "../../../store/action/gitAction";

// Function Usage
import { Card, CardText, CardBody } from 'reactstrap'
import { Accordion } from 'react-bootstrap-accordion'
import { toast } from "react-toastify";
import 'react-bootstrap-accordion/dist/index.css'

// Share components
import Pagination from "../../../tools/Pagination";
import { url } from "../../../tools/Helpers";
import PageHeader from "../../../tools/breadcrumb/breadcrumb";
import LoadingPanel from "../../../tools/LoadingPanel";
import USER from "../../../assets/user.jpg";
import Logo from "../../../assets/logos/logo.png";
import ViewReviewDetails from '../ProductReview/viewReviewDetails'
import { ArrowRoundedLeft8x13Svg } from '../../../assets/svg';
import TableComponents from "../../../components/TableComponents/TableComponents";


// UI Purpose
import CancelIcon from '@mui/icons-material/HighlightOffTwoTone';
import CheckCircleIcon from '@mui/icons-material/CheckCircleTwoTone';
import ReplyIcon from '@mui/icons-material/Reply';
import IconButton from '@material-ui/core/IconButton';
import Rating from "@material-ui/lab/Rating";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from '@mui/material/Tooltip';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import GroupAddIcon from '@mui/icons-material/Add';
import Badge from '@mui/material/Badge';
import DraftsIcon from '@mui/icons-material/Drafts';
import TableCell from '@mui/material/TableCell';


function mapStateToProps(state) {
  return {
    productCategories: state.counterReducer["productCategories"],
    productInfo: state.counterReducer["productsByID"],
    reviews: state.counterReducer["reviews"],
    variationStock: state.counterReducer["variationStock"],
    reviewReturn: state.counterReducer["reviewReturn"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallProductDetail: (prodData) => dispatch(GitAction.CallProductDetail(prodData)),
    CallResetProductDetails: () => dispatch(GitAction.CallResetProductDetails()),

    CallAllProductCategoryListing: () => dispatch(GitAction.CallAllProductCategoryListing()),
    CallProductReviewByProductID: (propsData) => dispatch(GitAction.CallProductReviewByProductID(propsData)),
    CallAddProductReview: (propsData) => dispatch(GitAction.CallAddProductReview(propsData)),
    CallViewAllProductVariationStock: (propsData) => dispatch(GitAction.CallViewAllProductVariationStock(propsData)),
    // CallUpdateProductVariationStock: (propsData) => dispatch(GitAction.CallUpdateProductVariationStock(propsData)),
  };
}
const overallHeadCells = [
  {
    id: 'ProductName',
    align: 'left',
    disablePadding: false,
    label: 'Product Name',
  },
  {
    id: 'ProductStockAmount',
    align: 'center',
    disablePadding: false,
    label: 'Product Stock',
  },
  {
    id: 'FirstDate',
    align: 'center',
    disablePadding: false,
    label: 'First Stock Date',
  },
  {
    id: 'LastDate',
    align: 'center',
    disablePadding: false,
    label: 'Last Stock Date',
  },
]

class ViewProductGeneralInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      CategoryHierachyListing: [],
      CategoryHierachyID: [],
      categoryHierachy: 0,

      variationTypeList: [],
      variationTypeID: [],
      isVariationSet: false,

      productReview: [],
      isReviewSet: false,
      productRating: "",

      page: 1,
      variationPage: 1,
      rowsPerPage: 3,
      variationRowsPerPage: 5,
      setRating: 0,

      isStockEdit: false,
      selectedUpdateQuantity: [],
      selectedUpdateID: [],

      newArray: [],
      isWaitingUpdate: false,
      isViewReviewDetails: false,
      selectedReviews: [],
      selectedCommentReply: [],
      replyComment: "",
      isReplySubmit: false,
      productName: "",
      isCategorySet: false,

      isDatabaseSet: false,
      isOpenOverallDetails: [],

      breadcrumb: [
        // { title: "All Product", url: "" },
        // { title: "Main Category", url: "/shop/AllProductCategory/" },
      ]
    };
    this.DatabaseListing = []
    this.PagingListing = [{
      isOpenOverallDetails: [],
      Listing: []
    }]

    this.handleBack = this.handleBack.bind(this)
    this.getTagList = this.getTagList.bind(this)
    this.getCategoryListing = this.getCategoryListing.bind(this)
    this.getReviewList = this.getReviewList.bind(this)
    this.filterRating = this.filterRating.bind(this)
    this.ratingList = this.ratingList.bind(this)
    this.handleStockLevel = this.handleStockLevel.bind(this)
    this.submitStock = this.submitStock.bind(this)
    this.handleSetReview = this.handleSetReview.bind(this)
    this.handleReview = this.handleReview.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmitReview = this.handleSubmitReview.bind(this)

    this.props.CallViewAllProductVariationStock({
      ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
      ProductID: this.props.match.params.productId,
      ProductPerPage: 999,
      Page: 1
    })

    this.props.CallProductDetail({
      productId: this.props.match.params.productId,
      userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
      ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
    })
    this.props.CallAllProductCategoryListing({
      ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
    })
    this.props.CallProductReviewByProductID({
      ProductID: this.props.match.params.productId,
      ParentProductReviewID: 0
    })
  }

  handleBack() {
    this.props.CallResetProductDetails()
    this.props.backToList()
  }

  componentDidMount() {

    // if (JSON.parse(localStorage.getItem("loginUser"))[0].UserID !== undefined && this.props.match.params.productId !== undefined) {
    //   this.props.CallProductDetail({
    //     productId: this.props.match.params.productId,
    //     userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
    //     ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
    //   })
    //   this.props.CallAllProductCategoryListing()
    //   this.props.CallProductReviewByProductID({
    //     ProductID: this.props.match.params.productId,
    //     ParentProductReviewID: 0
    //   })

    // }
  }

  componentDidUpdate(prevProps) {

    if (this.props.variationStock !== null && this.props.variationStock.length > 0 && this.state.isDatabaseSet === false) {
      this.DatabaseListing = this.props.variationStock

      // this.props.variationStock.length > 0 && this.props.variationStock.map((data) => {
      //   this.state.isOpenOverallDetails.push(false)
      // })
      this.setState({ isDatabaseSet: true })
    }

    if (this.props.productCategories !== undefined && this.props.productInfo !== undefined &&
      this.props.productCategories.length > 0 && this.props.productInfo.length > 0 && this.state.categoryHierachy === 0) {
      this.getCategoryListing(this.props.productInfo[0], this.props.productCategories)
      this.getVariationList(this.props.productInfo[0])
    }
    if (this.props.productInfo !== undefined && this.props.productInfo.length > 0 && this.props.productInfo[0].ProductVariation !== null && this.state.newArray.length === 0) {
      this.setState({
        newArray: this.props.productInfo[0].ProductVariation !== null ? JSON.parse(this.props.productInfo[0].ProductVariation) : []
      })
    }

    if (this.props.reviews !== undefined && this.props.reviews.length > 0 && JSON.parse(this.props.reviews)[0].ReturnVal === undefined) {
      this.getReviewList(JSON.parse(this.props.reviews))
    }

    if (this.props.reviews !== prevProps.reviews) {
      this.setState({ isReviewSet: false })

      if (this.props.reviews.length > 0 && JSON.parse(this.props.reviews)[0].ReturnVal === undefined) {
        this.getReviewList(JSON.parse(this.props.reviews))
      }
    }

    // if (this.props.variationStock !== undefined && this.props.variationStock.length > 0) {
    //   if (JSON.parse(this.props.variationStock[0].ReturnVal !== 0) && this.state.isWaitingUpdate === true) {
    //     if (prevProps.productInfo !== this.props.productInfo)
    //       this.setState({
    //         newArray: this.props.productInfo[0].ProductVariation !== null ? JSON.parse(this.props.productInfo[0].ProductVariation) : [],
    //         isWaitingUpdate: false,
    //         isStockEdit: false
    //       })
    //   }
    // }

    if (this.props.reviewReturn !== undefined && this.props.reviewReturn.length > 0 && this.state.isReplySubmit === true) {
      this.props.CallProductReviewByProductID({
        ProductID: this.props.match.params.productId,
        ParentProductReviewID: 0
      })
      this.setState({
        isViewReviewDetails: false,
        selectedReviews: [],
        selectedCommentReply: [],
        replyComment: "",
        isReplySubmit: false
      })
    }
  }

  carryDataFromChild = (e) => {
    let checkFiltering = false

    if (this.PagingListing[0] !== null && this.PagingListing[0].Listing.length > 0) {
      checkFiltering = JSON.stringify(this.PagingListing[0].Listing) === JSON.stringify(e)

      if (checkFiltering === false) {
        this.PagingListing[0].isOpenOverallDetails = []
        this.PagingListing[0].Listing = e
        e.map((x) => {
          this.PagingListing[0].isOpenOverallDetails.push(false)
        })
      }
    }
    else {
      this.PagingListing[0].Listing = e
      e.map((x) => {
        this.PagingListing[0].isOpenOverallDetails.push(false)
      })
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
        tagList = tagList + "," + tag.tag;
      }
    })
    return tagList
  }

  getCategoryListing(productInfo, categoryInfo) {
    let tempCategoryHierachy = 0
    this.state.CategoryHierachyListing.splice(0, this.state.CategoryHierachyListing.length)

    // Check if category in Heirachy 1
    if (categoryInfo !== null && productInfo.ProductCategoryID !== null && this.state.categoryHierachy === 0) {
      categoryInfo.map((category) => {
        if (category.ProductCategoryID == productInfo.ProductCategoryID) {
          this.setState({ categoryHierachy: 1 })
          this.state.CategoryHierachyListing.push(category.ProductCategory)
          this.state.CategoryHierachyID.push(category.ProductCategoryID)
          tempCategoryHierachy = 1
        }
      })

      // Check if category in Heirachy 2
      if (tempCategoryHierachy === 0 && tempCategoryHierachy !== 1) {
        categoryInfo.map((categoryList) => {
          categoryList.HierarchyItem !== null && categoryList.HierarchyItem !== undefined &&
            JSON.parse(categoryList.HierarchyItem).map((category) => {
              if (category.ProductCategoryID == productInfo.ProductCategoryID) {
                this.setState({ categoryHierachy: 2 })
                this.state.CategoryHierachyListing.push(categoryList.ProductCategory, category.ProductCategory)
                this.state.CategoryHierachyID.push(categoryList.ProductCategoryID, category.ProductCategoryID)
                tempCategoryHierachy = 2
              }
            })
        })
      }

      // Check if category in Heirachy 3
      if (tempCategoryHierachy === 0 && tempCategoryHierachy !== 1 && tempCategoryHierachy !== 2) {
        categoryInfo.map((categoryListing) => {
          categoryListing.HierarchyItem !== null && categoryListing.HierarchyItem !== undefined &&
            JSON.parse(categoryListing.HierarchyItem).map((categoryList) => {
              categoryList.HierarchyItem !== null && categoryList.HierarchyItem !== undefined &&
                JSON.parse(categoryList.HierarchyItem).map((category) => {
                  if (category.ProductCategoryID == productInfo.ProductCategoryID) {
                    this.setState({ categoryHierachy: 3 })
                    this.state.CategoryHierachyListing.push(categoryListing.ProductCategory, categoryList.ProductCategory, category.ProductCategory)
                    this.state.CategoryHierachyID.push(categoryListing.ProductCategoryID, categoryList.ProductCategoryID, category.ProductCategoryID)
                    tempCategoryHierachy = 3
                  }
                })
            })
        })
      }

      // Check if category in Heirachy 4
      if (tempCategoryHierachy === 0 && tempCategoryHierachy !== 1 && tempCategoryHierachy !== 2 && tempCategoryHierachy !== 4) {
        categoryInfo.map((mainCategory) => {
          mainCategory.HierarchyItem !== null && mainCategory.HierarchyItem !== undefined &&
            JSON.parse(mainCategory.HierarchyItem).map((categoryListing) => {
              categoryListing.HierarchyItem !== null && categoryListing.HierarchyItem !== undefined &&
                JSON.parse(categoryListing.HierarchyItem).map((categoryList) => {
                  categoryList.HierarchyItem !== null && categoryList.HierarchyItem !== undefined &&
                    JSON.parse(categoryList.HierarchyItem).map((category) => {
                      if (category.ProductCategoryID == productInfo.ProductCategoryID) {
                        this.setState({ categoryHierachy: 4 })
                        this.state.CategoryHierachyListing.push(mainCategory.ProductCategory, categoryListing.ProductCategory, categoryList.ProductCategory, category.ProductCategory)
                        this.state.CategoryHierachyID.push(mainCategory.ProductCategoryID, categoryListing.ProductCategoryID, categoryList.ProductCategoryID, category.ProductCategoryID)
                        tempCategoryHierachy = 4
                      }
                    })
                })
            })
        })
      }
    }


    if (this.state.isCategorySet === false) {
      this.setState({ isCategorySet: true, })
      let breadcrumb = this.state.breadcrumb

      this.state.CategoryHierachyListing.length > 0 && this.state.CategoryHierachyListing.map((category, i) => {
        breadcrumb = [...breadcrumb, ...[
          { title: category, url: "" },
        ]]

      })

      this.setState({ breadcrumb: breadcrumb })

      // console.log("this.breadcrumb 2", breadcrumb)
      // console.log("this.breadcrumb 3", this.state.CategoryHierachyListing)
      // this.setState({
      //   breadcrumb: [...breadcrumb, ...[
      //     { title: [category[i]], url: "" },
      //   ]]
      // })
    }
  }

  getVariationList(productInfo) {
    let variationList = []
    let variationType = []
    let variationTypeID = []

    if (productInfo.ProductVariation !== null && this.state.isVariationSet === false) {
      variationList = JSON.parse(productInfo.ProductVariation).filter((ele, ind) => ind === JSON.parse(productInfo.ProductVariation).findIndex(elem => elem.ProductVariationID === ele.ProductVariationID))

      variationList.map((x) => {
        variationType.push(x.ProductVariation)
        variationTypeID.push(x.ProductVariationID)
      })

      this.setState({ variationTypeList: variationType, variationTypeListID: variationTypeID, isVariationSet: true })
    }
  }

  getReviewList(reviewsList) {

    let reviewData = []
    if (this.state.isReviewSet === false) {
      reviewsList.filter((x) => x.ParentProductReviewID === 0).map((x) => {
        reviewData.push(x)
      })

      this.setState({ productRating: reviewData[0].ProductAverageRating, productReview: reviewData, isReviewSet: true })
    }
  }

  handlePageChange = (page) => {
    this.setState(() => ({ page }));
  };

  handleVariationPageChange = (page) => {
    this.setState({ variationPage: page })
  };

  filterRating(value) {
    let ratingNum = 0
    ratingNum = this.state.productReview.filter((x) => x.ProductReviewRating === value)
    return ratingNum.length
  }

  handleStockLevel(data, index, quantity) {
    let tempVariationArray = this.state.newArray
    tempVariationArray.map((x, index) => {
      if (x.ProductVariationDetailID === data) {
        tempVariationArray[index]['ProductStockAmount'] = quantity.target.value
      }
    })

    let tempStockID = this.state.selectedUpdateID
    let tempStockQuantity = this.state.selectedUpdateQuantity

    if (tempStockID.length > 0) {
      let checkStockID = tempStockID.filter((x) => x === data)

      if (checkStockID.length > 0) {
        tempStockID.map((x, index) => {
          if (x === data) {
            tempStockQuantity[index] = quantity.target.value
          }
        })
      }
      else {
        tempStockID.push(data)
        tempStockQuantity.push(quantity.target.value)
      }
    } else {
      tempStockID.push(data)
      tempStockQuantity.push(quantity.target.value)
    }
    this.setState({ newArray: tempVariationArray, selectedUpdateQuantity: tempStockQuantity, selectedUpdateID: tempStockID })
  }

  submitStock(value) {

    switch (value) {
      case "reset":
        this.setState({
          isStockEdit: false,
          newArray: JSON.parse(this.props.productInfo[0].ProductVariation)
        })
        break;

      // case "submit":
      //   if (this.state.selectedUpdateID.length > 0) {
      //     this.props.CallUpdateProductVariationStock({
      //       ProductVariationDetailID: this.state.selectedUpdateID,
      //       stock: this.state.selectedUpdateQuantity,
      //       productId: this.props.match.params.productId,
      //       userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
      //       ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
      //     })
      //     this.setState({ isWaitingUpdate: true })
      //   } else {
      //     toast.error("There is no variation to update")
      //   }
      //   break;

      default:
        break;
    }
  }

  ratingList(filterProductReview) {
    return (

      filterProductReview.length > 0 ?
        filterProductReview
          .slice((this.state.page - 1) * this.state.rowsPerPage, (this.state.page - 1) * this.state.rowsPerPage + this.state.rowsPerPage)
          .map((reviews) => {
            return (
              <Card style={{ width: '100%' }} onClick={() => this.handleSetReview(reviews)}>
                <CardBody style={{ padding: "0.5rem" }} >
                  <CardText>
                    <div className="row">
                      <div className="col-1">
                        <div id="review_avatar" className="review__avatar">
                          <img width="80px" height="80px" src={reviews.avatar ? reviews.avatar : USER} alt={reviews.avatar} onError={(e) => (e.target.src = USER)} />
                        </div>
                      </div>
                      <div className="col-11">
                        <div id="review_content" className=" review__content" style={{ width: "100%", textAlign: "left" }}>
                          <div id="review_author" className=" review__author" style={{ fontSize: "12px", fontWeight: "bold" }}>{reviews.Name}</div>
                          <div id="review_reply_date" className=" review__date" style={{ fontSize: "10px" }}>{reviews.CreatedDate}</div>

                          <div id="review_rating" className=" review__rating">
                            <Rating style={{ fontSize: "1rem" }} value={reviews.ProductReviewRating} />
                          </div>
                          <div id="review_text" className=" review__text" style={{ display: "flex", width: "100%", justifyContent: "space-between", fontSize: "12px" }}>
                            <div id="review_comment">{reviews.ProductReviewComment}</div>
                            <div id="comment" className="comment-reply">

                              <p className="comment-btn" onClick={() => this.handleSetReview(reviews)} >
                                <ReplyIcon />{" "}
                                Reply
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardText>
                </CardBody>
              </Card>
            )
          })
        :
        <div><label>Currently there is no review with this rating</label></div>
    )
  }

  handleReview() {
    this.setState({
      isViewReviewDetails: false,
    })
  }

  handleSetReview(reviews) {
    this.setState({
      isViewReviewDetails: true,
      selectedReviews: reviews,
      productName: this.props.productInfo[0].ProductName
    })
  }

  handleReply(reviewItem) {

    this.setState({
      selectedCommentReply: reviewItem
    })
  }

  handleInputChange(e) {
    if (e.target.value === "")
      this.setState({ replyComment: e.target.value, replyError: true })
    else
      this.setState({ replyComment: e.target.value, replyError: false })
  }

  handleSubmitReview(review, parentID) {
    this.props.CallAddProductReview({
      parentProductReviewID: parentID,
      productID: review.ProductID,
      UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
      productReviewRating: 0,
      productReviewComment: this.state.replyComment,
      replyParentID: review.ProductReviewID
    })
    this.setState({ isReplySubmit: true })
  }

  renderTableRows = (data, index) => {
    return (
      <>
        {console.log("data", data)}
        <TableCell
          component="th"
          id={`enhanced-table-checkbox-${index}`}
          scope="row"
          padding="normal"
          style={{ width: "55%" }}
        >
          {data.ProductName} - ({data.ProductVariation})
        </TableCell>
        <TableCell align="center" style={{ width: "15%" }}>{data.ProductStockAmount}</TableCell>
        <TableCell align="center" style={{ width: "15%" }}>{data.FirstDate}</TableCell>
        <TableCell align="center" style={{ width: "15%" }}>{data.LastDate}</TableCell>
      </>
    )
  }

  renderTableCollapseRows = (data, index) => {
    return (
      <div className="container-fluid my-2">
        <div className="row" style={{ paddingLeft: "10px" }}>
          {
            data.ProductVariationStockDetail !== undefined &&
            <div className="row" style={{ backgroundColor: "#f5f5f5", paddingTop: "10px" }}>
              <div className="col-12 col-md-3" style={{ paddingBottom: "10px" }}>
                <label style={{ fontWeight: "bold" }}>Store</label>
              </div>
              <div className="col-12 col-md-3" style={{ paddingBottom: "10px" }}>
                <label style={{ fontWeight: "bold" }}>Stock Amount</label>
              </div>
            </div>
          }
          {
            data.ProductVariationStockDetail !== undefined && JSON.parse(data.ProductVariationStockDetail).map((details, index) => {
              return (
                <>
                  {
                    <Link className="nav-link" to={{ pathname: url.stockDetails(data.ProductVariationDetailID) }}>
                      <div className="row flex-1" style={{ backgroundColor: index % 2 === 1 ? "#f5f5f5" : "#fffff", padding: "15px" }}>
                        <div className="col-12 col-md-3">
                          <label>{details.Column1}</label>
                        </div>
                        <div className="col-12 col-md-3">
                          <label>{details.ProductStockAmount}</label>
                        </div>
                      </div>
                    </Link>
                  }
                </>
              )
            })
          }
        </div>
      </div>
    )
  }

  onTableRowClick = (event, row) => {

    let listing = this.PagingListing[0].Listing
    let selected = ""
    let OverallCollapseTable = this.PagingListing[0].isOpenOverallDetails

    listing.map((data, i) => {
      if (data.ProductVariationDetailID === row.ProductVariationDetailID)
        selected = i
    })

    OverallCollapseTable.map((data, index) => {
      if (index === selected) {
        OverallCollapseTable[index] = !OverallCollapseTable[index]
      } else
        OverallCollapseTable[index] = false
    })

    this.PagingListing[0].isOpenOverallDetails = OverallCollapseTable
    this.setState({ isOpenOverallDetails: OverallCollapseTable })
  }

  render() {
    const productInfoLabelStyle = {
      fontSize: "14px",
      fontWeight: "bold",
    }
    const rating = [5, 4, 3, 2, 1]


    return (
      this.props.productInfo.length > 0 ?
        <div style={{ width: "100%" }}>
          <div >
            <div style={{ margin: "1%" }}>
            </div>
            <div style={{ display: "flex", marginLeft: "1%" }}>
              <Button onClick={() => typeof this.props.backToList === "function" && this.handleBack()}>
                <ArrowRoundedLeft8x13Svg fontSize="inherit" />
                <Link style={{ paddingLeft: "10px", paddingRight: "10px", textDecoration: "none", color: "black" }} to={"/viewProduct"}>
                  Back
                </Link>
              </Button>
              <h3>{typeof this.props.productInfo !== "undefined" ? this.props.productInfo[0].ProductName : "Product Information"}</h3>
            </div>
            <div style={{ display: "flex", marginLeft: "2%", paddingTop: "10px" }}>
              <PageHeader header="Category" breadcrumb={this.state.breadcrumb} />
            </div>

            <div style={{ marginLeft: "2%", marginRight: "2%", marginBottom: "2%" }}>
              <Card style={{ width: '100%' }}>
                <CardBody>
                  <CardText>
                    <div className="row">
                      <div className="col-lg-10">
                        <h6 style={{ textAlign: "left" }} >Product Information</h6>
                      </div>
                      <div className="col-lg-2" style={{ textAlign: "right" }}>
                        <Button style={{ backgroundColor: "white" }}>
                          <Link className="nav-link" to={{
                            pathname: url.inventoryProductDetails(this.props.match.params.productId),
                            query: {
                              categoryDetails: this.state.CategoryHierachyListing,
                            }
                          }}>
                            View Details </Link></Button>
                      </div>
                    </div>

                    <div className="row">
                      {console.log("IMAGE", this.props)}
                      <div key="ProductImages" className=" col-lg-2 ">
                        <img
                          width="200"
                          height="150"
                          src={this.props.productInfo[0].ProductImages !== null ? JSON.parse(this.props.productInfo[0].ProductImages)[0].ProductMediaUrl : Logo}
                          onError={(e) => { e.target.onerror = null; e.target.src = Logo }}
                          alt=""
                        />
                      </div>
                      <div key="Brand" className="col-lg-10" style={{ textAlign: "left" }}>
                        <div className="row">
                          <div className="col-lg-2">
                            <label style={productInfoLabelStyle}>Product Brand :</label>
                          </div>
                          <div className="col-lg-10">
                            <label>{this.props.productInfo[0].Brand !== "" ? this.props.productInfo[0].Brand : "-"}</label>
                          </div>
                        </div>

                        <div key="Model" className="row">
                          <div className="col-lg-2">
                            <label style={productInfoLabelStyle}>Product Model :</label>
                          </div>
                          <div className="col-lg-10">
                            <label>{this.props.productInfo[0].Model !== "" ? this.props.productInfo[0].Model : "-"}</label>
                          </div>
                        </div>

                        <div key="Tags" className="row">
                          <div className="col-lg-2">
                            <label style={productInfoLabelStyle}>Product Tags :</label>
                          </div>
                          <div className="col-lg-10">
                            <label>{this.getTagList()}</label>
                          </div>
                        </div>

                        {/* <div key="Tags" className="row">
                          <div className="col-lg-2">
                            <label style={productInfoLabelStyle}>Product Category :</label>
                          </div>
                          <div className="col-lg-10">
                            {this.state.CategoryHierachyListing.length > 0 && this.state.CategoryHierachyListing.map((category, i) => {
                              return (<label>{"  >  " + category}</label>)
                            })}
                          </div>
                        </div> */}

                        <div key="Description" className="row">
                          <div className="col-lg-2">
                            <label style={productInfoLabelStyle}>Product Description :</label>
                          </div>
                          <div className="col-lg-10" >
                            <label style={{ textAlign: "justify" }}>{this.props.productInfo[0].ProductDescription !== null && this.props.productInfo[0].ProductDescription.replace(/<[^>]+>/g, ' ') !== " " ?
                              this.props.productInfo[0].ProductDescription.replace(/<[^>]+>/g, ' ').length > 300 ?
                                this.props.productInfo[0].ProductDescription.replace(/<[^>]+>/g, ' ').substring(0, 300) + " ... " :
                                this.props.productInfo[0].ProductDescription.replace(/<[^>]+>/g, ' ')
                              : "-"}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardText>
                </CardBody>
              </Card>
            </div>

            {/* ---------------------------------------------------------------- STOCK LISTING ----------------------------------------------------------------------- */}

            <div style={{ margin: "2%" }}>
              <div className="row">
                <div className="col-4">
                  <Card style={{ width: '100%', minHeight: "495px" }}>
                    <CardBody>
                      <CardText>
                        <TableComponents
                          tableTopRight={
                            <div className="d-flex">
                              <Tooltip title="Add Stock">
                                <IconButton size="small" sx={{ color: "#0074ea", marginRight: 1 }}>
                                  <Link className="nav-link" to={"/addStock"}>
                                    <GroupAddIcon />
                                  </Link>
                                </IconButton>
                              </Tooltip>
                            </div>
                          }
                          tableOptions={{
                            dense: true,
                            tableOrderBy: 'asc',
                            sortingIndex: "fat",
                            stickyTableHeader: false,
                            stickyTableHeight: 300,
                            elevation: 1
                          }}
                          paginationOptions={[10, 30, 40, { label: 'All', value: -1 }]}
                          tableHeaders={overallHeadCells}
                          tableRows={{
                            renderTableRows: this.renderTableRows,
                            checkbox: false,
                            checkboxColor: "primary",
                            onRowClickSelect: false,

                            isExpandable: true,
                            renderTableCollapseRows: this.renderTableCollapseRows,
                            isCollapseOpen: this.PagingListing[0].isOpenOverallDetails
                          }}
                          Data={this.DatabaseListing.length > 0 && this.DatabaseListing[0].ReturnVal === "0" ? [] : this.DatabaseListing}
                          onTableRowClick={this.onTableRowClick}
                          SelectionActionButtons={<Button onClick={() => alert('hi')}>SelectionActionButtons</Button>}
                          carryDataFromChild={this.carryDataFromChild}
                        />
                        {console.log("DatabaseListing", this.DatabaseListing)}
                      </CardText>
                    </CardBody>
                  </Card>
                </div>

                {/* ---------------------------------------------------------------- PRODUCT REVIEW ----------------------------------------------------------------------- */}
                <div className="col-8">
                  <Card style={{ width: '100%', minHeight: "495px" }}>
                    <CardBody>
                      <CardText>

                        <div className="row">
                          <div className="col-lg-9">
                            <h6 style={{ textAlign: "left" }} >Product Review</h6>
                          </div>
                          <div className="col-lg-3" style={{ textAlign: "right" }}>
                            {/* <Button variant="primary" >
                              <Link to={url.inventoryProductDetails(this.props.match.params.productId)} className="nav-link">
                                View All
                              </Link>
                            </Button> */}
                          </div>
                        </div>

                        <div style={{ minHeight: "332px" }}>
                          <div style={{ minHeight: "320px" }}>
                            {
                              this.state.productReview.length > 0 &&
                              <div className="row" style={{ textAlign: "left", paddingBottom: "15px" }}>
                                <div className="col-lg-12">
                                  <Button variant="outlinedPrimary" onClick={() => this.setState({ setRating: 0, page: 1 })}>All ({this.state.productReview.length})</Button>
                                  {rating.map((x) => {
                                    return (
                                      <Button variant="outlinedPrimary" onClick={() => this.setState({ setRating: x, page: 1 })}>{x} Star ({this.filterRating(x)})</Button>
                                    )
                                  })}
                                </div>
                              </div>
                            }

                            {this.state.productReview !== undefined && this.state.productReview.length > 0 ?
                              <div style={{ minHeight: "290px" }}>
                                {this.ratingList(this.state.setRating === 0 ? this.state.productReview : this.state.productReview.filter((x) => x.ProductReviewRating === this.state.setRating))}
                              </div>
                              :
                              <div>
                                <label>
                                  Temporarily there is no review for this product
                                </label>
                              </div>
                            }
                          </div>
                          <ViewReviewDetails
                            isOpen={this.state.isViewReviewDetails}
                            handleOpen={this.handleReview}
                            handleComment={this.handleReply}
                            handleAddReview={this.handleSubmitReview}
                            handleOnChange={this.handleInputChange}

                            state={this.state.selectedReviews}
                            data={this.state}
                          />
                          <div style={{ marginTop: "15px" }}>
                            <Pagination
                              current={this.state.page}

                              total={this.state.setRating === 0 ?
                                Math.ceil(this.state.productReview.length / this.state.rowsPerPage)
                                :
                                Math.ceil(this.filterRating(this.state.setRating) / this.state.rowsPerPage)
                              }
                              onPageChange={this.handlePageChange}
                            />
                          </div>
                        </div>
                      </CardText>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div >
        : <LoadingPanel />

    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewProductGeneralInfo);
