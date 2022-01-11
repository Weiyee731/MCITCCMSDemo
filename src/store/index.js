import { combineReducers, createStore, applyMiddleware } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { counterReducer } from "./reducer/gitReducer"; //reducers
import { GitEpic, gitEpic } from "./epic/gitEpic"; //epics

const rootEpic = combineEpics(
  gitEpic.User_Login,
  gitEpic.User_Logout,
  gitEpic.User_Register,
  gitEpic.User_ViewProfile,
  gitEpic.User_ViewPage,
  gitEpic.User_UpdateProfileStatus,

  // Shop
  gitEpic.Shop_UpdateDetails,
  gitEpic.Shop_UpdateProfileImage,

  // Address
  gitEpic.Address_ViewAll,

  // Order
  gitEpic.Order_Add,
  gitEpic.Order_ViewAll,
  gitEpic.Order_UpdateUserDetails,
  gitEpic.Transaction_ViewStatus,
  gitEpic.Order_UpdateTrackingNumber,

  // Merchant
  gitEpic.Merchants_ViewProfile,
  gitEpic.Merchants_ViewAllOrder,

  // Product
  gitEpic.Product_Add,
  gitEpic.Product_Update,
  gitEpic.Product_Delete,
  gitEpic.Product_ViewAll,
  gitEpic.Product_ViewDetail,
  gitEpic.Product_Endorse,
  gitEpic.Product_CheckDuplicate,

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
  gitEpic.ProductVariationStock_Update,

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

  // General
  gitEpic.Country_ViewAll,
  gitEpic.CourierService_ViewAll,
);

const rootReducer = combineReducers({ counterReducer });
const epicMiddleware = createEpicMiddleware(rootEpic);
const createStoreWithMiddleware = applyMiddleware(epicMiddleware)(createStore);
export default createStoreWithMiddleware(rootReducer);
