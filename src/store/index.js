import 'rxjs'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { counterReducer } from "./reducer/gitReducer"; //reducers
import { gitEpic } from "./epic/gitEpic"; //epics

const rootEpic = combineEpics(
  // User account credentials
  gitEpic.User_Login,
  gitEpic.User_LoginServer,
  gitEpic.User_Logout,
  gitEpic.User_Register,
  gitEpic.User_ViewProfile,
  gitEpic.User_ViewPage,
  gitEpic.User_UpdateProfileStatus,
  gitEpic.User_CheckEmail_Dupe,
  gitEpic.SendEmail_OTP,
  gitEpic.UpdateForgotten_Pass,

  // Shop
  gitEpic.Shop_UpdateDetails,
  gitEpic.Shop_UpdateProfileImage,

  // Address
  gitEpic.Address_ViewAll,

  // // Order
  // gitEpic.Order_Add,
  gitEpic.Order_ViewAll,
  gitEpic.Order_CreateOrderShipment,
  gitEpic.Order_RequestOrderShipmentStatus,
  gitEpic.Order_UpdateUserDetails,
  gitEpic.Transaction_ViewStatus,
  gitEpic.Order_UpdateTrackingNumber,
  gitEpic.Order_CreateOrderShipment,
  gitEpic.Order_UpdateTrackingStatus,

  // Merchant
  gitEpic.Merchants_ViewProfile,
  gitEpic.Merchants_ViewAllOrder,
  gitEpic.User_UpdateMerchantProfile,

  // // Product
  gitEpic.Product_Add,
  gitEpic.Product_Update,
  gitEpic.Product_Delete,
  gitEpic.Product_ViewAll,
  gitEpic.Product_ViewDetail,
  gitEpic.Product_Endorse,
  gitEpic.Product_CheckDuplicateName,
  gitEpic.Product_CheckDuplicateSKU,

  // Product Variation
  gitEpic.ProductVariation_Add,
  gitEpic.ProductVariation_Update,
  gitEpic.ProductVariation_Delete,

  // Product Variation Details
  gitEpic.ProductVariationDetail_Add,
  gitEpic.ProductVariationDetail_Update,
  gitEpic.ProductVariationDetail_Delete,
  gitEpic.ProductVariationDetail_ViewAllByCategoryID,

  // Product Stock
  // gitEpic.ProductVariationStock_Update,
  gitEpic.ProductVariationStock_Add,
  gitEpic.ProductVariationStock_View,
  gitEpic.ProductVariationStock_ViewAll,
  gitEpic.ProductVariationStock_ViewWithVariationDetailsID,
  gitEpic.ProductVariationStock_UpdateDetails,
  gitEpic.ProductVariationStock_Delete,

  // Product Specification
  gitEpic.ProductSpecsDetail_Add,
  gitEpic.ProductSpecsDetail_Update,
  gitEpic.ProductSpecsDetail_Delete,

  // Product Media
  gitEpic.ProductMedia_Add,
  gitEpic.ProductMedia_Delete,

  // Product Category
  gitEpic.ProductCategory_Add,
  gitEpic.ProductCategory_Update,
  gitEpic.ProductCategory_Delete,
  gitEpic.ProductCategory_ViewAll,
  gitEpic.ProductCategory_ViewAllWithParent,

  // Product Review
  gitEpic.ProductReview_ViewByID,
  gitEpic.ProductReview_Add,

  //Promotion
  gitEpic.Promotion_ViewAll,
  gitEpic.Promotion_UpdateStatusInd,
  gitEpic.Promotion_ViewByPromotionID,
  gitEpic.Promotion_Add,
  gitEpic.Promotion_Update,
  gitEpic.Promotion_Delete,
  gitEpic.Product_ViewListing,

  // General
  gitEpic.Country_ViewAll,
  gitEpic.CourierService_ViewAll,
  gitEpic.General_ViewState,
  gitEpic.getAllPaymentMethod,

  // Shoplot
  gitEpic.Shoplot_ShopListing,
  gitEpic.Shoplot_ShopListingByID,
  gitEpic.Shoplot_AddShoplot,
  gitEpic.Shoplot_UpdateShoplot,
  gitEpic.Shoplot_DeleteShoplot,

  //Shoplot Coordinate
  gitEpic.Storage_AddShoplotCoordinate,
  gitEpic.Storage_UpdateShoplotCoordinate,

  // Block
  gitEpic.Shoplot_BlockListing,
  gitEpic.Storage_AddBlock,
  gitEpic.Storage_UpdateBlock,
  gitEpic.Storage_DeleteBlock,

  //Grid 
  gitEpic.Storage_GridStorageList,
  gitEpic.Storage_AddGrid,
  gitEpic.Storage_UpdateGrid,
  gitEpic.Storage_DeleteGrid,

);

const epicMiddleware = createEpicMiddleware();
const rootReducer = combineReducers({ counterReducer });
const middleware = [
  thunk,
  epicMiddleware
]
const initialState = {};
const store = createStore(rootReducer, initialState, applyMiddleware(...middleware))
epicMiddleware.run(rootEpic);
export default store
