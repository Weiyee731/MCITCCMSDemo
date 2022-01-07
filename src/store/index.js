import { combineReducers, createStore, applyMiddleware } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { counterReducer } from "./reducer/gitReducer"; //reducers
import { gitEpic } from "./epic/gitEpic"; //epics

const rootEpic = combineEpics(
  gitEpic.User_Login,
  gitEpic.User_Logout,
  gitEpic.User_Register,
  gitEpic.User_ViewProfile,
  gitEpic.User_ViewPage,

  // Address
  gitEpic.Address_ViewAll,

  // Order
  gitEpic.Order_Add,
  gitEpic.Order_ViewAll,

  // Merchant
  gitEpic.Merchants_ViewProfile,

  // Product
  gitEpic.Product_Add,
  gitEpic.Product_Update,
  gitEpic.Product_Delete,
  gitEpic.Product_ViewAll,
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
);

const rootReducer = combineReducers({ counterReducer });
const epicMiddleware = createEpicMiddleware(rootEpic);
const createStoreWithMiddleware = applyMiddleware(epicMiddleware)(createStore);
export default createStoreWithMiddleware(rootReducer);
