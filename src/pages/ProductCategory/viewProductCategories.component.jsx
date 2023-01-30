import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import "../../app/App.scss";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import { isArrayNotEmpty } from "../../tools/Helpers";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Paper, Typography, TableRow, Box, TableHead, TextField, TableSortLabel, TableContainer, Tooltip, TableCell, TableBody, Table, IconButton, Collapse, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LoadingPanel from "../../tools/LoadingPanel";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import SearchBar from "../../components/SearchBar/SearchBar"

export const ProductCategory = (props) => {
  const { categories, productCategories } = useSelector(state => ({
    productCategories: state.counterReducer.productCategories,
    categories: state.counterReducer.categories
  }));

  const dispatch = useDispatch()
  const [isHierachySet, setHierachy] = useState(false)
  const [categoryListingDetails, setListingDetails] = useState([])
  const [searchKeywords, setsearchKeywords] = useState("")

  useEffect(() => {
    dispatch(GitAction.CallAllProductCategoryListing())
  }, [])

  useEffect(() => {
    let listing = []
    if (isArrayNotEmpty(productCategories) && isHierachySet === false) {
      let mainListing = {
        HierarchyID: "",
        ProductCategory: "",
        Tag: "",
        ProductCategoryID: "",
        isOpen: false,
        isEdit: false,
        SubDetails: []
      }
      productCategories.map((main, index) => {
        mainListing = {
          HierarchyID: main.HierarchyID,
          ProductCategory: main.ProductCategory,
          ProductCategoryID: main.ProductCategoryID,
          Tag: main.Tag,
          isOpen: false,
          isEdit: false,
          SubDetails: []
        }
        main.HierarchyItem !== undefined && main.HierarchyItem != "[]" && JSON.parse(main.HierarchyItem).map((details, detailsIndex) => {
          let detailsList = {
            HierarchyID: details.HierarchyID,
            ProductCategoryID: details.ProductCategoryID,
            ProductCategory: details.ProductCategory,
            Tag: details.Tag,
            isOpen: false,
            isEdit: false,
            SubDetails: []
          }
          details.HierarchyItem !== undefined && details.HierarchyItem != "[]" && JSON.parse(details.HierarchyItem).map((subdetails) => {
            let subDetailsList = {
              HierarchyID: subdetails.HierarchyID,
              ProductCategoryID: subdetails.ProductCategoryID,
              ProductCategory: subdetails.ProductCategory,
              Tag: subdetails.Tag,
              isOpen: false,
              isEdit: false,
            }
            detailsList.SubDetails.push(subDetailsList)
          })
          mainListing.SubDetails.push(detailsList)
        })
        listing.push(mainListing)
      })
      setListingDetails(listing)
      setHierachy(true)
    }

  }, [productCategories])

  useEffect(() => {
    dispatch(GitAction.CallAllProductCategoryListing())
    setHierachy(false)
  }, [categories])

  const headerLayout = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell width="5%" />
          <TableCell width="15%">Action</TableCell>
          <TableCell width="40%" align="left">Product Category</TableCell>
          <TableCell width="30%" align="left">Tag</TableCell>
        </TableRow>
      </TableHead>
    )
  }

  const clickCollapseOpen = (data, mainIndex, subindex, subdetailIndex) => {
    let listingData = [...categoryListingDetails]
    if (data.HierarchyID === 1) {
      listingData[mainIndex].isOpen = !listingData[mainIndex].isOpen
    }

    if (data.HierarchyID === 2) {
      listingData[mainIndex].SubDetails[subindex].isOpen = !listingData[mainIndex].SubDetails[subindex].isOpen
    }
    setListingDetails(listingData)
  }

  const checkCollapseOpen = (data, mainIndex, subindex, subdetailIndex) => {
    let listingData = [...categoryListingDetails]
    let isOpen = false
    if (isArrayNotEmpty(listingData)) {
      if (data.HierarchyID === 1) {
        if (listingData[mainIndex] !== undefined)
          isOpen = listingData[mainIndex].isOpen
      }

      if (data.HierarchyID === 2) {
        if (listingData[mainIndex].SubDetails[subindex] !== undefined)
          isOpen = listingData[mainIndex].SubDetails[subindex].isOpen
      }
    }
    return isOpen
  }

  const submitData = (type, HierarchyID, parentCategoryID, categoryID, Category) => {
    if (categoryID === "") {
      let propsData = {
        ProductCategoryImage: "NULL",
        ProductCategory: Category,
        HierarchyID: HierarchyID,
        ParentProductCategoryID: parentCategoryID,
        ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
        UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
      }
      dispatch(GitAction.CallAddProductCategory(propsData))
      toast.success("Successfully added product category")
    } else {

      if (type === "delete") {
        let propsData = {
          ProductCategoryID: categoryID,
          UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
        }
        dispatch(GitAction.CallDeleteProductCategory(propsData))
        toast.success("Successfully deleted product category")
      }
      else {
        let propsData = {
          ProductCategoryID: categoryID,
          ProductCategory: Category,
          UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
        }
        dispatch(GitAction.CallUpdateProductCategory(propsData))
        toast.success("Successfully updated product category")
      }
    }
  }

  const clickIsEdit = (data, type, mainIndex, subindex, subdetailIndex) => {
    let listingData = [...categoryListingDetails]

    if (data.HierarchyID === 1) {
      let listing = listingData[mainIndex]

      if (type === "cancel") {
        if (listingData[mainIndex].ProductCategoryID === "") {
          listingData.splice(mainIndex, 1)
        } else {
          listingData[mainIndex] = productCategories[mainIndex]
        }
        // listingData = listingData.filter((x) => x.ProductCategoryID !== "")
        listing.isEdit = !listing.isEdit
      }

      if (type === "done") {
        if (listing.ProductCategory !== "") {
          submitData(type, listing.HierarchyID, 0, listing.ProductCategoryID, listing.ProductCategory)
          listing.isEdit = !listing.isEdit
        } else {
          toast.warning("Product Category is required")
        }
      }

      if (type === "delete") {
        submitData(type, listing.HierarchyID, 0, listing.ProductCategoryID, listing.ProductCategory)
        listing.isEdit = !listing.isEdit
      }

      if (type === "edit")
        listing.isEdit = !listing.isEdit
    }

    if (data.HierarchyID === 2) {
      let listing = listingData[mainIndex].SubDetails[subindex]

      if (type === "cancel") {
        // if(listingData[mainIndex].SubDetails[subindex].ProductCategoryID === "") {
        //   listingData[mainIndex].SubDetails.splice(subindex, 1)
        // } else {
        //   listingData[mainIndex].SubDetails = productCategories[mainIndex].SubDetails
        // }
        let filterHierachy = listingData[mainIndex].SubDetails.filter((x) => x.ProductCategoryID !== "")
        listingData[mainIndex].SubDetails = filterHierachy
        listing.isEdit = !listing.isEdit
      }

      if (type === "done") {
        if (listing.ProductCategory !== "") {
          submitData(type, listing.HierarchyID, listingData[mainIndex].ProductCategoryID, listing.ProductCategoryID, listing.ProductCategory)
          listing.isEdit = !listing.isEdit
        } else {
          toast.warning("Product Category is required")
        }
      }

      if (type === "delete") {
        submitData(type, listing.HierarchyID, listingData[mainIndex].ProductCategoryID, listing.ProductCategoryID, listing.ProductCategory)
        listing.isEdit = !listing.isEdit
      }

      if (type === "edit")
        listing.isEdit = !listing.isEdit
    }

    if (data.HierarchyID === 3) {
      let listing = listingData[mainIndex].SubDetails[subindex].SubDetails[subdetailIndex]

      if (type === "cancel") {
        let filterHierachy = listingData[mainIndex].SubDetails[subindex].SubDetails.filter((x) => x.ProductCategoryID !== "")
        listingData[mainIndex].SubDetails[subindex].SubDetails = filterHierachy
        listing.isEdit = !listing.isEdit
      }

      if (type === "done") {
        if (listing.ProductCategory !== "") {
          submitData(type, listing.HierarchyID, listingData[mainIndex].SubDetails[subindex].ProductCategoryID, listing.ProductCategoryID, listing.ProductCategory)
          listing.isEdit = !listing.isEdit
        } else {
          toast.warning("Product Category is required")
        }
      }

      if (type === "delete") {
        submitData(type, listing.HierarchyID, listingData[mainIndex].SubDetails[subindex].ProductCategoryID, listing.ProductCategoryID, listing.ProductCategory)
        listing.isEdit = !listing.isEdit
      }

      if (type === "edit")
        listing.isEdit = !listing.isEdit
    }
    setListingDetails(listingData)
  }

  const checkEdit = (data, mainIndex, subindex, subdetailIndex) => {
    let listingData = [...categoryListingDetails]
    let isEdit = false

    if (isArrayNotEmpty(listingData)) {
      if (data.HierarchyID === 1) {
        if (listingData[mainIndex] !== undefined)
          isEdit = listingData[mainIndex].isEdit
      }

      if (data.HierarchyID === 2) {
        if (listingData[mainIndex].SubDetails[subindex] !== undefined)
          isEdit = listingData[mainIndex].SubDetails[subindex].isEdit
      }

      if (data.HierarchyID === 3) {

        if (listingData[mainIndex].SubDetails[subindex].SubDetails[subdetailIndex] !== undefined)
          isEdit = listingData[mainIndex].SubDetails[subindex].SubDetails[subdetailIndex].isEdit
      }
    }
    return isEdit
  }

  const handleChanges = (type, value, data, mainIndex, subindex, subdetailIndex) => {
    let listingData = [...categoryListingDetails]
    switch (type) {
      case "Category":
        if (data.HierarchyID === 1)
          listingData[mainIndex].ProductCategory = value

        if (data.HierarchyID === 2)
          listingData[mainIndex].SubDetails[subindex].ProductCategory = value

        if (data.HierarchyID === 3)
          listingData[mainIndex].SubDetails[subindex].SubDetails[subdetailIndex].ProductCategory = value

        break;

      case "Tag":
        if (data.HierarchyID === 1)
          listingData[mainIndex].Tag = value


        if (data.HierarchyID === 2)
          listingData[mainIndex].SubDetails[subindex].Tag = value


        if (data.HierarchyID === 3)
          listingData[mainIndex].SubDetails[subindex].SubDetails[subdetailIndex].Tag = value
        break;

      default:
        break;
    }
    setListingDetails(listingData)
  }

  const handleNewCategory = (hierachy, index, subIndex,) => {
    let listingData = [...categoryListingDetails]

    let mainListing = {
      HierarchyID: "",
      ProductCategory: "",
      Tag: "",
      ProductCategoryID: "",
      isOpen: false,
      isEdit: true,
      SubDetails: []
    }

    switch (hierachy) {
      case 1:
        mainListing.HierarchyID = 1
        listingData = [...listingData, mainListing]
        break;

      case 2:
        mainListing.HierarchyID = 2
        listingData[index].SubDetails.push(mainListing)
        break;

      case 3:
        mainListing.HierarchyID = 3
        listingData[index].SubDetails[subIndex].SubDetails.push(mainListing)
        break;

      default:
        break;
    }
    console.log(listingData)
    setListingDetails(listingData)
  }

  const CollapseLayout = (data, index, subindex, subdetailIndex) => {
    return (
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          {
            data.HierarchyID < 3 &&
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => clickCollapseOpen(data, index, subindex, subdetailIndex)}
            >
              {checkCollapseOpen(data, index, subindex, subdetailIndex) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          }

        </TableCell>
        <TableCell component="th" scope="row">
          {
            checkEdit(data, index, subindex, subdetailIndex) ?
              <>
                <IconButton onClick={() => clickIsEdit(data, "done", index, subindex, subdetailIndex)}><DoneIcon /></IconButton>
                <IconButton onClick={() => clickIsEdit(data, "cancel", index, subindex, subdetailIndex)}><CloseIcon /></IconButton>
                {
                  data.ProductCategoryID !== "" &&
                  <IconButton onClick={() => clickIsEdit(data, "delete", index, subindex, subdetailIndex)}><DeleteIcon /></IconButton>
                }
              </>
              :
              <IconButton onClick={() => clickIsEdit(data, "edit", index, subindex, subdetailIndex)}><EditIcon /></IconButton>
          }
        </TableCell>
        <TableCell align="left">
          {
            checkEdit(data, index, subindex, subdetailIndex) ?
              <>
                <TextField
                  fullWidth
                  hiddenLabel
                  id="filled-hidden-label-small"
                  variant="filled"
                  placeholder="Product Category"
                  onChange={(e) => {
                    handleChanges("Category", e.target.value, data, index, subindex, subdetailIndex)
                  }}
                  value={data.ProductCategory}
                  size="small"
                />
                {data.ProductCategory === "" && <Typography style={{ color: "red" }}>Product Category is required</Typography>}
              </>
              :
              <Typography>{data.ProductCategory}</Typography>
          }
        </TableCell>
        <TableCell align="left">
          {
            checkEdit(data, index, subindex, subdetailIndex) ?
              <>
                <TextField
                  fullWidth
                  hiddenLabel
                  id="filled-hidden-label-small"
                  value={data.Tag}
                  variant="filled"
                  placeholder="Tag"
                  onChange={(e) => {
                    handleChanges("Tag", e.target.value, data, index, subindex, subdetailIndex)
                  }}
                  size="small"
                />
                {data.Tag === "" && <Typography style={{ color: "grey", opacity: 0.6 }}>Optional</Typography>}
              </>
              :
              <Typography>{data.Tag}</Typography>
          }
        </TableCell>
      </TableRow >
    )
  }

  const baseColor = "#c4c4c4"
  const highlightColor = "#ffffff"

  // const searchSpace = (value) => {
  //   let transactionList = []
  //   if (JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1)
  //     this.props.alltransactions.filter((x) => x.TrackingStatus === this.state.currentlyChosen).map((y) => {
  //       transactionList.push(y)
  //     })

  //   if (JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16) {
  //     this.props.alltransactions !== null && this.props.alltransactions.map((list) => {
  //       list.OrderProductDetail !== null && JSON.parse(list.OrderProductDetail).filter((y) => parseInt(y.MerchantID) === parseInt(JSON.parse(localStorage.getItem("loginUser"))[0].UserID) && list.TrackingStatus === this.state.currentlyChosen).map((data) => {
  //         transactionList.push(list)
  //       })
  //     })
  //   }

  //   // var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  //   this.setState({ searchKeywords: value })
  //   this.state.filteredProduct.splice(0, this.state.filteredProduct.length)

  //   transactionList.length > 0 && transactionList.filter((searchedItem) =>
  //     searchedItem.OrderName !== null && searchedItem.OrderName.toLowerCase().includes(
  //       value.toLowerCase()
  //     )
  //   ).map((filteredItem) => {
  //     this.state.filteredProduct.push(filteredItem);
  //   })

  //   transactionList.length > 0 && transactionList.map((list) => {
  //     list.OrderProductDetail !== null && JSON.parse(list.OrderProductDetail).filter(x => x.TrackingNumber !== null
  //       && x.TrackingNumber.toLowerCase().includes(value.toLowerCase())).map(filteredItem => {
  //         this.state.filteredProduct.push(list);
  //       });
  //   })

  //   let removeDeplicate = this.state.filteredProduct.filter((ele, ind) => ind === this.state.filteredProduct.findIndex(elem => elem.OrderID === ele.OrderID))
  //   this.setState({ isFiltered: true, filteredProduct: removeDeplicate, isSearch: true })
  // }

  return (
    <div style={{ width: "100%" }}>
      <h3>Product Category List</h3>
      <TableContainer component={Paper} style={{ overflow: "hidden" }}>
        <div className="row" style={{ padding: "10px" }}>
          <div className="col-4">
            <Typography variant="h6" gutterBottom component="div">
              Product Category
            </Typography>
          </div>
          <div className="col-7" style={{ textAlign: "right" }}>
            {/* <SearchBar
              id=""
              placeholder="Search By Category Name"
              onChange={(e) => this.searchSpace(e.target.value)}
              className="searchbar-input mb-auto"
              tooltipText="Search with current data"
              value={setsearchKeywords()}
            /> */}
          </div>
          <div className="col-1" style={{ textAlign: "center" }}>
            <IconButton>
              <AddIcon onClick={() => handleNewCategory(1, 0, 0,)} />
            </IconButton>
          </div>
        </div>
        {
          isHierachySet === true ?
            <Table aria-label="collapsible table">
              {headerLayout()}

              <TableBody>
                {categoryListingDetails.length > 0 && categoryListingDetails.map((data, index) => {
                  return (
                    <>
                      {CollapseLayout(data, index, 0, 0)}
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={checkCollapseOpen(data, index, 0, 0)} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <div className="row">
                                <div className="col">
                                  <Typography variant="h6" gutterBottom component="div">
                                    Sub Category
                                  </Typography>
                                </div>
                                <div className="col" style={{ textAlign: "right" }}>
                                  <IconButton>
                                    <AddIcon onClick={() => handleNewCategory(2, index, 0)} />
                                  </IconButton>
                                </div>
                              </div>
                              {
                                typeof data.SubDetails !== 'undefined' && data.SubDetails.length > 0 ?
                                  <Table size="small" aria-label="purchases">
                                    {headerLayout()}
                                    <TableBody>
                                      {
                                        data.SubDetails.length > 0 && data.SubDetails.map((details, detailIndex) => {
                                          return (
                                            <>
                                              {CollapseLayout(details, index, detailIndex, 0)}
                                              <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                  <Collapse in={checkCollapseOpen(details, index, detailIndex, 0)} timeout="auto" unmountOnExit>
                                                    {

                                                      <Box sx={{ margin: 1 }}>
                                                        <div className="row" >
                                                          <div className="col">
                                                            <Typography variant="h6" gutterBottom component="div">
                                                              Sub Category
                                                            </Typography>
                                                          </div>
                                                          <div className="col" style={{ textAlign: "right" }}>
                                                            <IconButton>
                                                              <AddIcon onClick={() => handleNewCategory(3, index, detailIndex)} />
                                                            </IconButton>
                                                          </div>
                                                        </div>
                                                        {
                                                          details.SubDetails.length > 0 ?
                                                            <Table size="small" aria-label="purchases">
                                                              {headerLayout()}

                                                              <TableBody>
                                                                {
                                                                  details.SubDetails.length > 0 && details.SubDetails.map((subdetails, subdetailIndex) => {
                                                                    return (
                                                                      <>
                                                                        {CollapseLayout(subdetails, index, detailIndex, subdetailIndex)}
                                                                        <TableRow>
                                                                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                                            <Collapse in={checkCollapseOpen(subdetails, index, detailIndex, 0)} timeout="auto" unmountOnExit>
                                                                              <Box sx={{ margin: 1 }}>
                                                                                <Typography variant="h6" gutterBottom component="div">
                                                                                  Sub Category3
                                                                                </Typography>
                                                                                <Table size="small" aria-label="purchases">
                                                                                  {headerLayout()}
                                                                                  <TableBody>
                                                                                    {CollapseLayout(subdetails, index, detailIndex, subdetailIndex)}
                                                                                  </TableBody>
                                                                                </Table>
                                                                              </Box>
                                                                            </Collapse>
                                                                          </TableCell>
                                                                        </TableRow>
                                                                      </>
                                                                    )
                                                                  })
                                                                }
                                                              </TableBody>
                                                            </Table>
                                                            :
                                                            <Typography>There is no subcategory in this hierachy</Typography>
                                                        }
                                                      </Box>
                                                    }
                                                  </Collapse>
                                                </TableCell>
                                              </TableRow>
                                            </>
                                          )
                                        })
                                      }
                                    </TableBody>
                                  </Table>
                                  :
                                  <Typography>There is no subcategory in this hierachy</Typography>
                              }
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  )
                }
                )}
              </TableBody>
            </Table>
            :
            // <LoadingPanel />
            <div>
              <Skeleton height={40} baseColor={baseColor} highlightColor={highlightColor} count={categoryListingDetails.length} style={{ width: '100%' }} />
            </div>
        }
      </TableContainer>
    </div>
  );
}

