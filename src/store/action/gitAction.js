export class GitAction {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////

  static Login = "USER_LOGIN";
  static LoginSuccess = "USER_LOGIN_SUCCESS";
  static CallUserLogin(propsData) {
    return {
      type: GitAction.Login,
      payload: propsData
    };
  }

  static CheckMail_Dupe = "CHECKMAIL_DUPE";
  static CheckedMail_Dupe = "CHECKEDMAIL_DUPE";
  static CheckEmail_Duplication(propsData) {
    return {
      type: GitAction.CheckMail_Dupe,
      payload: propsData
    };
  }

  static Send_OTPVerification = "SEND_OTPVERIFICATION";
  static Sent_OTPVerification = "SENT_OTPVERIFICATION";
  static SendOTP_Email(propsData) {
    return {
      type: GitAction.Send_OTPVerification,
      payload: propsData
    };
  }

  static Update_ForgotPassword = "UPDATE_FORGOTPASSWORD";
  static Updated_ForgotPassword = "UPDATED_FORGOTPASSWORD";
  static Update_NewPassword(propsData) {
    return {
      type: GitAction.Update_ForgotPassword,
      payload: propsData
    };
  }

  static LoginServer = "USER_LOGINSERVER";
  static LoginServerSuccess = "USER_LOGINSERVER_SUCCESS";
  static CallUserLoginServer(propsData) {
    return {
      type: GitAction.LoginServer,
      payload: propsData
    };
  }

  static Logout = "USER_LOGOUT";
  static LoggedOutSuccess = "USER_LOGGED_OUT_SUCCESS";
  static CallUserLogout(propsData) {
    return {
      type: GitAction.Logout,
      payload: propsData
    };
  }

  static RegisterUser = "REGISTER_USER";
  static UserRegistered = "USER_REGISTERED";
  static ResetRegistrationReturn = "RESET-REGISTRATION_RETURN";
  static CallUserRegistration(propsData) {
    return {
      type: GitAction.RegisterUser,
      payload: propsData
    };
  }
  static CallResetUserRegistrationReturn() {
    return {
      type: GitAction.ResetRegistrationReturn,
    };
  }

  static GetUserProfile = "GET-USERSPROFILE";
  static GotUserProfile = "GOT-USERSPROFILE";
  static ResetUserProfile = "RESET-USER_PROFILE";
  static CallUserProfile(propsData) {
    return {
      type: GitAction.GetUserProfile,
      payload: propsData,
    };
  }
  static CallResetUserProfile() {
    return {
      type: GitAction.ResetUserProfile,
    };
  }

  static UpdateUserStatus = "UPDATE-USERPROFILE-STATUS";
  static UpdatedUserStatus = "UPDATED-USERPROFILE-STATUS";
  static CallUpdateUserStatus(propsData) {
    return {
      type: GitAction.UpdateUserStatus,
      payload: propsData,
    };
  }

  static ClearCurrentUser = "CLEAR-CURRENTUSER";
  static CallClearCurrentUser() {
    return {
      type: GitAction.ClearCurrentUser,
    };
  }


  ///////////////////////////////////////////////////  sidebar configuration  ///////////////////////////////////////////////////
  static FetchSidebar = "FETCH_SIDEBAR";
  static SidebarFetched = "SIDEBAR_FETCHED";
  static ResetSidebar = "RESET-SIDEBAR";
  static CallFetchSidebar(propsData) {
    return {
      type: GitAction.FetchSidebar,
      payload: propsData
    };
  }
  static CallResetSidebar() {
    return {
      type: GitAction.ResetSidebar,
    };
  }

  ///////////////////////////////////////////////////  Shop  ///////////////////////////////////////////////////

  static UpdateShopDetails = "UPDATE-SHOP-DETAIL";
  static UpdatedShopDetails = "UPDATED-SHOP-DETAIL";
  static CallUpdateShopDetails(prodData) {
    return {
      type: GitAction.UpdateShopDetails,
      payload: prodData,
    };
  }

  static ClearUpdateShop = "CLEAR-UPDATE-SHOP"
  static CallClearShopUpdate() {
    return {
      type: GitAction.ClearUpdateShop,
    };
  }

  ///////////////////////////////////////////////////  Address  ///////////////////////////////////////////////////

  static GetAllAddress = "GET-ALL-ADDRESS";
  static GotAllAddress = "GOT-ALL-ADDRESS";
  static CallAllUserAddress(propsData) {
    return {
      type: GitAction.GetAllAddress,
      payload: propsData
    };
  }

  ///////////////////////////////////////////////////  Order  ///////////////////////////////////////////////////

  static AddOrder = "ADD-ORDER";
  static AddedOrder = "ADDED-ORDER";
  static CallAddOrder(prodData) {
    return {
      type: GitAction.AddOrder,
      payload: prodData,
    };
  }

  static OrderCreateShipment = "ORDER-CREATE-SHIPMENT";
  static OrderedCreateShipment = "ORDER-CREATED-SHIPMENT";
  static CallAddOrderShipment(prodData) {
    return {
      type: GitAction.OrderCreateShipment,
      payload: prodData,
    };
  }

  static OrderRequestShipmentStatus = "ORDER-REQUEST-SHIPMENT-STATUS";
  static OrderRequestedShipmentStatus = "ORDER-REQUESTED-SHIPMENT-STATUS";
  static CallOrderRequestShipmentStatus(prodData) {
    return {
      type: GitAction.OrderRequestShipmentStatus,
      payload: prodData,
    };
  }


  static ClearOrder = "CLEAR-ORDER";
  static CallClearOrder() {
    return {
      type: GitAction.ClearOrder
    };
  }

  static OrderCreateShipment = "ORDER-CREATE-SHIPMENT";
  static OrderedCreateShipment = "ORDER-CREATED-SHIPMENT";
  static CallAddOrderShipment(prodData) {
    return {
      type: GitAction.OrderCreateShipment,
      payload: prodData,
    };
  }

  static OrderRequestShipmentStatus = "ORDER-REQUEST-SHIPMENT-STATUS";
  static OrderRequestedShipmentStatus = "ORDER-REQUESTED-SHIPMENT-STATUS";
  static CallOrderRequestShipmentStatus(prodData) {
    return {
      type: GitAction.OrderRequestShipmentStatus,
      payload: prodData,
    };
  }

  static OrderUserDetailsUpdate = "UPDATE-ORDER-USERDETAILS";
  static OrderUserDetailsUpdated = "UPDATED-ORDER-USERDETAILS";
  static CallUpdateOrderUserDetails(prodData) {
    return {
      type: GitAction.OrderUserDetailsUpdate,
      payload: prodData,
    };
  }

  static GetTransactions = "GET-TRANSACTION";
  static GotTransactions = "GOT-TRANSACTION";
  static CallGetTransaction(transactionData) {
    return {
      type: GitAction.GetTransactions,
      payload: transactionData,
    };
  }

  static GetTransactionStatus = "GET-TRANSACTIONSTATUS";
  static GotTransactionStatus = "GOT-TRANSACTIONSTATUS";
  static CallGetTransactionStatus() {
    return {
      type: GitAction.GetTransactionStatus,
    };
  }

  static OrderTrackingStatusUpdate = "UPDATE-TRACKING-STATUS";
  static OrderTrackingStatusUpdated = "UPDATED-TRACKING-STATUS";
  static CallUpdateOrderTrackingStatus(prodData) {
    return {
      type: GitAction.OrderTrackingStatusUpdate,
      payload: prodData,
    };
  }

  static resetTrackingStatus = "RESET-TRACKING-STATUS";
  static CallResetUpdateTrackingStatus() {
    return {
      type: GitAction.resetTrackingStatus,
    };
  }

  static updateTrackingNumber = "UPDATE-TRACKING-NUMBER";
  static updatedTrackingNumber = "UPDATED-TRACKING-NUMBER";
  static CallUpdateOrderTracking(prodData) {
    return {
      type: GitAction.updateTrackingNumber,
      payload: prodData,
    };
  }
  static resetTracking = "RESET-TRACKING-NUMBER";
  static CallResetOrderTracking(prodData) {
    return {
      type: GitAction.resetTracking,
      payload: prodData,
    };
  }

  static ResetOrderShipment = "RESET-ORDER-SHIPMENT";
  static CallResetOrderShipment() {
    return {
      type: GitAction.ResetOrderShipment,
    };
  }








  ///////////////////////////////////////////////////  Merchant  ///////////////////////////////////////////////////

  static GetMerchants = "GET-MERCHANTS";
  static GotMerchants = "GOT-MERCHANTS";
  static CallMerchants(propsData) {
    return {
      type: GitAction.GetMerchants,
      payload: propsData,
    };
  }

  static GetMerchantOrders = "GET-MERCHANTSORDERS";
  static GotMerchantOrders = "GOT-MERCHANTSORDERS";
  static CallGetMerchantsOrders(propsData) {
    return {
      type: GitAction.GetMerchantOrders,
      payload: propsData,
    };
  }

  static GetUpdateMerchantProfile = "GET-MERCHANTUPDATEPROFILE";
  static GotUpdateMerchantProfile = "GOT-MERCHANTUPDATEPROFILA";
  static CallGetUpdateMerchantProfile(propsData) {
    return {
      type: GitAction.GetUpdateMerchantProfile,
      payload: propsData,
    };
  }

  ///////////////////////////////////////////////////  Product  ///////////////////////////////////////////////////
  static AddProduct = "ADD-PRODUCT";
  static AddedProduct = "ADDED-PRODUCT";
  static ResetProductReturnVal = "RESET-PRODUCT-RETURN-VALUE";
  static CallAddProduct(prodData) {
    return {
      type: GitAction.AddProduct,
      payload: prodData,
    };
  }
  static CallResetProductReturnVal() {
    return {
      type: GitAction.ResetProductReturnVal,
    };
  }



  static UpdateProduct = "UPDATE-PRODUCT";
  static UpdatedProduct = "UPDATED-PRODUCT";
  static ResetUpdateProduct = "RESET-UPDATE-PRODUCT";

  static CallUpdateProduct(prodData) {
    return {
      type: GitAction.UpdateProduct,
      payload: prodData,
    };
  }
  static CallResetUpdateProduct() {
    return {
      type: GitAction.ResetUpdateProduct,
    };
  }

  static DeleteProduct = "DELETE-PRODUCT";
  static DeletedProduct = "DELETED-PRODUCT";
  static CallDeleteProduct(prodData) {
    return {
      type: GitAction.DeleteProduct,
      payload: prodData,
    };
  }

  static GetProduct = "GET-PRODUCT";
  static GotProduct = "GOT-PRODUCT";
  static ResetProductDetails = "RESET-PRODUCT-DETAILS-RETURN-VALUE";
  static CallAllProducts(propData) {
    return {
      type: GitAction.GetProduct,
      payload: propData
    };
  }
  static CallResetProductDetails() {
    return {
      type: GitAction.ResetProductDetails
    }
  }

  static GetProductListing = "GET-PRODUCTLISTING";
  static GotProductListing = "GOT-PRODUCTLISTING";
  static CallAllProductsListing(propData) {
    return {
      type: GitAction.GetProductListing,
      payload: propData
    };
  }

  static ResetProductManagementValue = "RESET-PRODUCT-MANAGEMENT-RETURN-VALUE";
  static CallResetProductMgmtReturnVal() {
    return {
      type: GitAction.ResetProductManagementValue
    }
  }

  static EndorseProduct = "ENDOSE-PRODUCT";
  static ProductEndorsed = "ENDOSED-PRODUCT";
  static ResetProductEndorse = "RESET-PRODUCT-ENDORSE";
  static CallEndorseProduct(prodData) {
    return {
      type: GitAction.EndorseProduct,
      payload: prodData,
    };
  }
  static CallResetEndorseProduct(prodData) {
    return {
      type: GitAction.ResetProductEndorse,
      payload: prodData,
    };
  }


  static CheckProduct = "CHECK-PRODUCT";
  static ProductChecked = "CHECKED-PRODUCT";
  static CallCheckProduct(prodData) {
    return {
      type: GitAction.CheckProduct,
      payload: prodData,
    };
  }

  static CheckProductSKU = "CHECK-PRODUCTSKU";
  static ProductCheckedSKU = "CHECKED-PRODUCTSKU";
  static CallCheckProductSKU(prodData) {
    return {
      type: GitAction.CheckProductSKU,
      payload: prodData,
    };
  }

  static GetProductDetail = "GET-PRODUCT-DETAIL";
  static GotProductDetail = "GOT-PRODUCT-DETAIL";
  static CallProductDetail(propData) {
    return {
      type: GitAction.GetProductDetail,
      payload: propData
    };
  }

  ///////////////////////////////////////////////////  Product Variation  ///////////////////////////////////////////////////

  static AddProductVariation = "ADD-PRODUCTVARIATION";
  static AddedProductVariation = "ADDED-PRODUCTVARIATION";
  static CallAddProductVariation(prodData) {
    return {
      type: GitAction.AddProductVariation,
      payload: prodData,
    };
  }

  static UpdateProductVariation = "UPDATE-PRODUCTVARIATION";
  static UpdatedProductVariation = "UPDATED-PRODUCTVARIATION";
  static CallUpdateProductVariation(prodData) {
    return {
      type: GitAction.UpdateProductVariation,
      payload: prodData,
    };
  }

  static DeleteProductVariation = "DELETE-PRODUCTVARIATION";
  static DeletedProductVariation = "DELETED-PRODUCTVARIATION";
  static CallDeleteProductVariation(prodData) {
    return {
      type: GitAction.DeleteProductVariation,
      payload: prodData,
    };
  }

  static GetProductVariationByCategoryID = "GET-PRODUCTVARIATIONBYCATEGORYID";
  static GotProductVariationByCategoryID = "GOT-PRODUCTVARIATIONBYCATEGORYID";
  static CallAllProductVariationByCategoryID(prodData) {
    return {
      type: GitAction.GetProductVariationByCategoryID,
      payload: prodData,
    };
  }

  ///////////////////////////////////////////////////  Product Variation Details ///////////////////////////////////////////////////

  static AddProductVariationDetail = "ADD-PRODUCTVARIATIONDETAIL";
  static AddedProductVariationDetail = "ADDED-PRODUCTVARIATIONDETAIL";
  static ResetProductVariationDetailResult = "RESET-PRODUCTVARIATIONDETAIL";
  static CallAddProductVariationDetail(prodData) {
    return {
      type: GitAction.AddProductVariationDetail,
      payload: prodData,
    };
  }
  static CallResetProductVariationDetailResult() {
    return {
      type: GitAction.ResetProductVariationDetailResult,
    };
  }

  static UpdateProductVariationDetail = "UPDATE-PRODUCTVARIATIONDETAIL";
  static UpdatedProductVariationDetail = "UPDATED-PRODUCTVARIATIONDETAIL";
  static ResetUpdateProductVariationDetailResult = "RESET-UPDATEPRODUCTVARIATIONDETAIL";
  static CallUpdateProductVariationDetail(prodData) {
    return {
      type: GitAction.UpdateProductVariationDetail,
      payload: prodData,
    };
  }
  static CallResetUpdateProductVariationDetail() {
    return {
      type: GitAction.ResetUpdateProductVariationDetailResult,
    };
  }

  static DeleteProductVariationDetail = "DELETE-PRODUCTVARIATIONDETAIL";
  static DeletedProductVariationDetail = "DELETED-PRODUCTVARIATIONDETAIL";
  static CallDeleteProductVariationDetail(prodData) {
    return {
      type: GitAction.DeleteProductVariationDetail,
      payload: prodData,
    };
  }

  ///////////////////////////////////////////////////  Product Stock  ///////////////////////////////////////////////////


  // static UpdateProductVariationStock = "UPDATE-PRODUCTVARIATIONSTOCK";
  // static UpdatedProductVariationStock = "UPDATED-PRODUCTVARIATIONSTOCK";
  // static CallUpdateProductVariationStock(prodData) {
  //   return {
  //     type: GitAction.UpdateProductVariationStock,
  //     payload: prodData,
  //   };
  // }

  static AddProductVariationStock = "ADD-PRODUCTVARIATIONSTOCK";
  static AddedProductVariationStock = "ADDED-PRODUCTVARIATIONSTOCK";
  static ResetProductVariationStock = "RESET-PRODUCTVARIATIONSTOCK";
  static CallAddProductVariationStock(prodData) {
    return {
      type: GitAction.AddProductVariationStock,
      payload: prodData,
    };
  }
  static CallResetProductVariationStock() {
    return {
      type: GitAction.ResetProductVariationStock,
    };
  }


  static ViewProductVariationStock = "VIEW-PRODUCTVARIATIONSTOCK";
  static ViewedProductVariationStock = "VIEWED-PRODUCTVARIATIONSTOCK";
  static CallViewProductVariationStock(prodData) {
    return {
      type: GitAction.ViewProductVariationStock,
      payload: prodData,
    };
  }

  static ViewProductVariationStockWithID = "VIEW-PRODUCTVARIATIONSTOCK-WITHID";
  static ViewedProductVariationStockWithID = "VIEWED-PRODUCTVARIATIONSTOCK-WITHID";
  static CallViewAllProductVariationStock(prodData) {
    return {
      type: GitAction.ViewProductVariationStockWithID,
      payload: prodData,
    };
  }

  static ViewProductVariationStockWithVariationDetailsID = "VIEW-PRODUCTVARIATIONSTOCK-WITHVARIATIONDETAILSID";
  static ViewedProductVariationStockWithVariationDetailsID = "VIEWED-PRODUCTVARIATIONSTOCK-WITHVARIATIONDETAILSID";
  static CallViewProductVariationStockDetails(prodData) {
    return {
      type: GitAction.ViewProductVariationStockWithVariationDetailsID,
      payload: prodData,
    };
  }

  static UpdateProductVariationStockDetails = "UPDATE-PRODUCTVARIATIONSTOCKDETAILS";
  static UpdatedProductVariationStockDetails = "UPDATED-PRODUCTVARIATIONSTOCKDETAILS";
  static CallUpdateProductVariationStockDetails(prodData) {
    return {
      type: GitAction.UpdateProductVariationStockDetails,
      payload: prodData,
    };
  }

  static DeleteProductVariationStock = "DELETE-PRODUCTVARIATIONSTOCK";
  static DeletedProductVariationStock = "DELETED-PRODUCTVARIATIONSTOCK";
  static CallDeleteProductVariationStock(prodData) {
    return {
      type: GitAction.DeleteProductVariationStock,
      payload: prodData,
    };
  }

  ///////////////////////////////////////////////////  Product Review  ///////////////////////////////////////////////////


  static addProductReview = "ADD-PRODUCTREVIEW";
  static addedProductReview = "ADDED-PRODUCTREVIEW";
  static CallAddProductReview(suppData) {
    return {
      type: GitAction.addProductReview,
      payload: suppData,
    };
  }

  ///////////////////////////////////////////////////  Product Specification  ///////////////////////////////////////////////////

  static AddProductSpecsDetail = "ADD-PRODUCT-SPECS-DETAILS";
  static AddedProductSpecsDetail = "ADDED-PRODUCT-SPECS-DETAILS";
  static ResetProductSpecsDetailResult = "RESET-PRODUCT-SPECS-DETAILS";
  static CallAddProductSpecsDetail(prodData) {
    return {
      type: GitAction.AddProductSpecsDetail,
      payload: prodData
    };
  }
  static CallResetProductSpecsDetailResults() {
    return {
      type: GitAction.ResetProductSpecsDetailResult,
    };
  }

  static UpdateProductSpecsDetail = "UPDATE-PRODUCT-SPECS-DETAILS";
  static UpdatedProductSpecsDetail = "UPDATED-PRODUCT-SPECS-DETAILS";
  static ResetUpdateProductSpecsDetailResult = "RESET-UPDATE-PRODUCT-SPECS-DETAILS";
  static CallUpdateProductSpecsDetail(prodData) {
    return {
      type: GitAction.UpdateProductSpecsDetail,
      payload: prodData
    };
  }
  static CallResetUpdateProductSpecsDetail() {
    return {
      type: GitAction.ResetUpdateProductSpecsDetailResult,
    };
  }

  static DeleteProductSpecsDetail = "DELETE-PRODUCT-SPECS-DETAILS";
  static DeletedProductSpecsDetail = "DELETED-PRODUCT-SPECS-DETAILS";

  static CallDeleteProductSpecsDetail(prodData) {
    return {
      type: GitAction.DeleteProductSpecsDetail,
      payload: prodData
    };
  }

  ///////////////////////////////////////////////////  Product Media  ///////////////////////////////////////////////////

  static AddProductMedia = "ADD-PRODUCTMEDIA";
  static ProductMediaAdded = "ADDED-PRODUCTMEDIA";
  static CallAddProductMedia(prodData) {
    return {
      type: GitAction.AddProductMedia,
      payload: prodData,
    };
  }

  static deleteProductMedia = "DELETE-PRODUCTMEDIA";
  static deletedProductMedia = "DELETED-PRODUCTMEDIA";
  static CallDeleteProductMedia(prodData) {
    return {
      type: GitAction.deleteProductMedia,
      payload: prodData,
    };
  }

  static ResetProductMediaReturnVal = "RESET-PRODUCT-MEDIA-RETURN-VALUE";
  static CallResetProductMediaResult() {
    return {
      type: GitAction.ResetProductMediaReturnVal,
    };
  }

  ///////////////////////////////////////////////////  Product Category  ///////////////////////////////////////////////////

  static AddProductCategory = "ADD-PRODUCTCATEGORY";
  static AddedProductCategory = "ADDED-PRODUCTCATEGORY";
  static CallAddProductCategory(prodData) {
    return {
      type: GitAction.AddProductCategory,
      payload: prodData,
    };
  }

  static UpdateProductCategory = "UPDATE-PRODUCTCATEGORY";
  static UpdatedProductCategory = "UPDATED-PRODUCTCATEGORY";
  static CallUpdateProductCategory(prodData) {
    return {
      type: GitAction.UpdateProductCategory,
      payload: prodData,
    };
  }

  static DeleteProductCategory = "DELETE-PRODUCTCATEGORY";
  static DeletedProductCategory = "DELETED-PRODUCTCATEGORY";
  static CallDeleteProductCategory(prodData) {
    return {
      type: GitAction.DeleteProductCategory,
      payload: prodData,
    };
  }

  static ResetProductCategoryAction = "RESET-PRODUCTCATEGORY-ACTION";
  static CallResetProductCategoryAction() {
    return {
      type: GitAction.ResetProductCategoryAction,
    };
  }

  static GetProductCategory = "GET-PRODUCTCATEGORY";
  static GotProductCategory = "GOT-PRODUCTCATEGORY";
  static CallAllProductCategory(prodData) {
    return {
      type: GitAction.GetProductCategory,
      payload: prodData,
    };
  }

  static GetProductCategoryListing = "GET-PRODUCTCATEGORYLISTING";
  static GotProductCategoryListing = "GOT-PRODUCTCATEGORYLISTING";
  static CallAllProductCategoryListing(prodData) {
    return {
      type: GitAction.GetProductCategoryListing,
      payload: prodData,
    };
  }


  static GetProductReviewByProductID = "GET-PRODUCTREVIEWBYPRODUCTID";
  static GotProductReviewByProductID = "GOT-PRODUCTREVIEWBYPRODUCTID";
  static CallProductReviewByProductID(suppData) {
    return {
      type: GitAction.GetProductReviewByProductID,
      payload: suppData,
    };
  }




  ///////////////////////////////////////////////////  Promotion  ///////////////////////////////////////////////////

  static GetPromotion = "GET-PROMOTION";
  static GotPromotion = "GOT-PROMOTION";
  static CallViewPromotion(promoData) {
    return {
      type: GitAction.GetPromotion,
      payload: promoData,
    };
  }


  static GetPromotionByID = "GET-PROMOTION-BYID";
  static GotPromotionByID = "GOT-PROMOTION-BYID";
  static CallViewPromotionByID(promoData) {
    return {
      type: GitAction.GetPromotionByID,
      payload: promoData,
    };
  }


  static AddPromotion = "ADD-PROMOTION";
  static AddedPromotion = "ADDED-PROMOTION";
  static ClearAddPromo = "CLEAR-ADD-PROMOTION";
  static CallAddPromotion(promoData) {
    return {
      type: GitAction.AddPromotion,
      payload: promoData,
    };
  }
  static CallClearPromotion() {
    return {
      type: GitAction.ClearAddPromo
    };
  }

  static UpdatePromotion = "UPDATE-PROMOTION";
  static UpdatedPromotion = "UPDATED-PROMOTION";
  static CallUpdatePromotion(promoData) {
    return {
      type: GitAction.UpdatePromotion,
      payload: promoData,
    };
  }

  static UpdatePromotionInd = "UPDATE-PROMOTION-IND";
  static UpdatedPromotionInd = "UPDATED-PROMOTION-IND";
  static CallUpdatePromotionStatus(promoData) {
    return {
      type: GitAction.UpdatePromotionInd,
      payload: promoData,
    };
  }


  static DeletePromotion = "DELETE-PROMOTION";
  static DeletedPromotion = "DELETED-PROMOTION";
  static CallDeletePromotion(promoData) {
    return {
      type: GitAction.DeletePromotion,
      payload: promoData,
    };
  }


  ///////////////////////////////////////////////////  General  ///////////////////////////////////////////////////

  static GetCourierService = "GET-COURIER-SERVICE";
  static GotCourierService = "GOT-COURIER-SERVICE";
  static CallCourierService() {
    return {
      type: GitAction.GetCourierService,
    };
  }

  static GetCountry = "GET-COUNTRY";
  static GotCountry = "GOT-COUNTRY";
  static CallCountry() {
    return {
      type: GitAction.GetCountry,
    };
  }

  static GetState = "GET-STATE";
  static GotState = "GOT-STATE";
  static CallState() {
    return {
      type: GitAction.GetState,
    };
  }

  static GetPaymentMethod = "GET-PAYMENTMETHOD";
  static GotPaymentMethod = "GOT-PAYMENTMETHOD";
  static CallPaymentMethod(prodData) {
    return {
      type: GitAction.GetPaymentMethod,
      payload: prodData,
    };
  }


  ///////////////////////////////////////////////////  Shoplot  ///////////////////////////////////////////////////
  static GetShopListing = "GET-SHOPLISTING";
  static GotShopListing = "GOT-SHOPLISTING";
  static CallShopList(prodData) {
    return {
      type: GitAction.GetShopListing,
      payload: prodData,
    };
  }

  static GetShopListingByID = "GET-SHOPLISTING-BYID";
  static GotShopListingByID = "GOT-SHOPLISTING-BYID";
  static CallShopListByID(prodData) {
    return {
      type: GitAction.GetShopListingByID,
      payload: prodData,
    };
  }

  static AddShoplot = "ADD-SHOPLISTING";
  static AddedShoplot = "ADDED-SHOPLISTING";
  static CallAddShopList(prodData) {
    return {
      type: GitAction.AddShoplot,
      payload: prodData,
    };
  }

  static UpdateShoplot = "UPDATE-SHOPLISTING";
  static UpdatedShoplot = "UPDATED-SHOPLISTING";
  static CallUpdateShopList(prodData) {
    return {
      type: GitAction.UpdateShoplot,
      payload: prodData,
    };
  }

  static DeleteShoplot = "DELETE-SHOPLISTING";
  static DeletedShoplot = "DELETED-SHOPLISTING";
  static CallDeleteShopList(prodData) {
    return {
      type: GitAction.DeleteShoplot,
      payload: prodData,
    };
  }

  static AddShoplotCoordinateListing = "ADD-SHOPLOTCOORDINATE";
  static AddedShoplotCoordinateListing = "ADDED-SHOPLOTCOORDINATE";
  static CallAddShoplotCoordinate(prodData) {
    return {
      type: GitAction.AddShoplotCoordinateListing,
      payload: prodData,
    };
  }

  static UpdateShoplotCoordinateListing = "UPDATE-SHOPLOTCOORDINATE";
  static UpdatedShoplotCoordinateListing = "UPDATED-SHOPLOTCOORDINATE";
  static CallUpdateShoplotCoordinate(prodData) {
    return {
      type: GitAction.UpdateShoplotCoordinateListing,
      payload: prodData,
    };
  }

  static ResetShopAction = "RESET-SHOPACTION";
  static CallResetShopAction() {
    return {
      type: GitAction.ResetShopAction,
    };
  }

  ///////////////////////////////////////////////////  Block  ///////////////////////////////////////////////////


  static GetBlockListing = "GET-BLOCKLISTING";
  static GotBlockListing = "GOT-BLOCKLISTING";
  static CallBlockList(prodData) {
    return {
      type: GitAction.GetBlockListing,
      payload: prodData,
    };
  }

  static AddBlockListing = "ADD-BLOCKLISTING";
  static AddedBlockListing = "ADDED-BLOCKLISTING";
  static CallAddBlockList(prodData) {
    return {
      type: GitAction.AddBlockListing,
      payload: prodData,
    };
  }

  static UpdateBlockListing = "UPDATE-BLOCKLISTING";
  static UpdatedBlockListing = "UPDATED-BLOCKLISTING";
  static CallUpdateBlockList(prodData) {
    return {
      type: GitAction.UpdateBlockListing,
      payload: prodData,
    };
  }

  static DeleteBlockListing = "DELETE-BLOCKLISTING";
  static DeletedBlockListing = "DELETED-BLOCKLISTING";
  static CallDeleteBlockList(prodData) {
    return {
      type: GitAction.DeleteBlockListing,
      payload: prodData,
    };
  }

  static ResetBlockAction = "RESET-BLOCKACTION";
  static CallResetBlockAction() {
    return {
      type: GitAction.ResetBlockAction,
    };
  }

  ///////////////////////////////////////////////////  Grid  ///////////////////////////////////////////////////

  static GetStorage = "GET-STORAGE";
  static GotStorage = "GOT-STORAGE";
  static CallGridList(prodData) {
    return {
      type: GitAction.GetStorage,
      payload: prodData,
    };
  }

  static AddGridListing = "ADD-GRIDLISTING";
  static AddedGridListing = "ADDED-GRIDLISTING";
  static CallAddGridList(prodData) {
    return {
      type: GitAction.AddGridListing,
      payload: prodData,
    };
  }

  static UpdateGridListing = "UPDATE-GRIDLISTING";
  static UpdatedGridListing = "UPDATED-GRIDLISTING";
  static CallUpdateGridList(prodData) {
    return {
      type: GitAction.UpdateGridListing,
      payload: prodData,
    };
  }

  static DeleteGridListing = "DELETE-GRIDLISTING";
  static DeletedGridListing = "DELETED-GRIDLISTING";
  static CallDeleteGridList(prodData) {
    return {
      type: GitAction.DeleteGridListing,
      payload: prodData,
    };
  }

  static ResetGridAction = "RESET-GRIDACTION";
  static CallResetGridAction() {
    return {
      type: GitAction.ResetGridAction,
    };
  }

  ///////////////////////////////////////////////////  Purchase Order  ///////////////////////////////////////////////////


  static UpdatePurchaseOrderStatus = "UPDATE-PURCHASEORDERSTATUS";
  static UpdatedPurchaseOrderStatus = "UPDATED-PURCHASEORDERSTATUS";

  static CallUpdatePurchaseOrderStatus(prodData) {
    return {
      type: GitAction.UpdatePurchaseOrderStatus,
      payload: prodData,
    };
  }


  static GetPurchaseOrders = "GET-PURCHASEORDERS";
  static GotPurchaseOrders = "GOT-PURCHASEORDERS";
  static CallGetPurchaseOrders(prodData) {
    return {
      type: GitAction.GetPurchaseOrders,
      payload: prodData,
    };
  }


  static DeletePurchaseOrder = "DELETE-PURCHASEORDER";
  static DeletedPurchaseOrder = "DELETED-PURCHASEORDER";
  static CallDeletePurchaseOrder(prodData) {
    return {
      type: GitAction.DeletePurchaseOrder,
      payload: prodData,
    };
  }

  ///////////////////////////////////////////////////  Quotation  ///////////////////////////////////////////////////

  static AddProductQuotation = "ADD-QUOTATION";
  static AddedProductQuotation = "ADDED-QUOTATION";
  static CallAddProductQuotation(prodData) {
    return {
      type: GitAction.AddProductQuotation,
      payload: prodData,
    };
  }

  static GetProductQuotation = "GET-QUOTATION";
  static GotProductQuotation = "GOT-QUOTATION";
  static CallViewProductQuotation(prodData) {
    return {
      type: GitAction.GetProductQuotation,
      payload: prodData,
    };
  }

  static DeleteQuotation = "DELETE-QUOTATION";
  static DeletedQuotation = "DELETED-QUOTATION";
  static CallDeleteQuotation(orderData) {
    return {
      type: GitAction.DeleteQuotation,
      payload: orderData,
    };
  }


  static GetProductByStatus = "GET-PRODUCT-BYSTATUS";
  static GotProductByStatus = "GOT-PRODUCT-BYSTATUS";
  static CallAllProductsByProductStatus(prodData) {
    return {
      type: GitAction.GetProductByStatus,
      payload: prodData,
    };
  }

  static SendSalesOrder = "SEND-SALESORDER";
  static SentSalesOrder = "SENT-SALESORDER";
  static CallSendSalesOrder(prodData) {
    return {
      type: GitAction.SendSalesOrder,
      payload: prodData,
    };
  }

  static ClearSalesOrder = "CLEAR-SALESORDER";
  static CallResetSalesOrder() {
    return {
      type: GitAction.ClearSalesOrder,
    };
  }

  static GetMainDashboard = "GET-MAINDASHBOARD";
  static GotMainDashboard = "GOT-MAINDASHBOARD";
  static CallMainDashboard(prodData) {
    return {
      type: GitAction.GetMainDashboard,
      payload: prodData,
    };
  }

  
  static GetMerchantDashboard = "GET-MERCHANTDASHBOARD";
  static GotMerchantDashboard = "GOT-MERCHANTDASHBOARD";
  static CallMerchantDashboard(prodData) {
    return {
      type: GitAction.GetMerchantDashboard,
      payload: prodData,
    };
  }


}

