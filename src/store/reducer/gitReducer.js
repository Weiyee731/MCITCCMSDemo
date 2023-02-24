import { GitAction } from "../action/gitAction";

const INITIAL_STATE = {
  loading: false,
  logonUser: [],
  currentUser: [],
  userProfile: [],
  registrationReturn: [],
  sidebars: [],
  check_Mail: [],
  otp_verification: [],
  new_password: [],

  // Shop
  shopUpdated: [],
  // Address
  allAddress: [],

  // Merchant
  merchant: [],
  merchantOrders: [],
  merchantUpdateProfile: [],

  // Product
  addResult: [],
  products: [],
  productsListing: [],
  productsByID: [],
  returnUpdateProduct: [],
  productMgmtResult: [],
  endorsedProduct: [],
  exists: [],
  SKUexists: [],
  addProductVariationResult: [],
  variationResult: [],
  variations: [],
  productSpecsDetail: [],
  SpecsDetail: [],
  deleteproductSpecsDetail: [],
  productMediaResult: [],
  categories: [],
  productCategories: [],

  // Order
  order: [],
  orderShipment: [],
  orderShipmentStatus: [],
  transactions: [],
  transactionStatus: [],
  trackingStatusAction: [],
  tracking: [],


  // Review
  reviews: [],
  reviewReturn: [],

  //General
  countries: [],
  logistic: [],
  states: [],
  paymentMethod: [],


  // Quotation
  quotations: [],
  quotationAction: [],

  // Promotion
  promotions: [],
  promotionByID: [],
  promoAction: [],
  addPromo: [],

  // Stock
  variationStock: [],
  variationAction: [],
  variationStockDetails: [],

  //Shoplot
  shoplot: [],
  shoplotByID: [],
  shoplotAction: [],
  coordinateAction: [],
  // Block
  block: [],
  blockAction: [],
  // grid
  grid: [],
  gridAction: [],

  POListing: [],
  POAction: [],
  ProductByStatus: [],
  SalesOrder: [],

  //dashboard
  maindashboard: [],
  merchantdashboard: []

};

export function counterReducer(state = INITIAL_STATE, action) {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////
  switch (action.type) {
    case GitAction.Login:
      return Object.assign({}, state, { loading: true });
    case GitAction.LoginSuccess:
      return Object.assign({}, state, {
        loading: false,
        logonUser: action.payload
      });

    case GitAction.CheckMail_Dupe:
      return Object.assign({}, state, { loading: true });
    case GitAction.CheckedMail_Dupe:
      return Object.assign({}, state, {
        loading: false,
        check_Mail: action.payload
      });

    case GitAction.Send_OTPVerification:
      return Object.assign({}, state, { loading: true });
    case GitAction.Sent_OTPVerification:
      return Object.assign({}, state, {
        loading: false,
        otp_verification: action.payload
      });

    case GitAction.Update_ForgotPassword:
      return Object.assign({}, state, { loading: true });
    case GitAction.Updated_ForgotPassword:
      return Object.assign({}, state, {
        loading: false,
        new_password: action.payload
      });

    case GitAction.LoginServer:
      return Object.assign({}, state, { loading: true });
    case GitAction.LoginServerSuccess:
      return Object.assign({}, state, {
        loading: false,
        logonUser: action.payload
      });

    case GitAction.Logout:
      return Object.assign({}, state, { loading: true });
    case GitAction.UserLoggedOut:
      return Object.assign({}, state, {
        loading: false,
        logonUser: action.payload
      });

    case GitAction.RegisterUser:
      return Object.assign({}, state, { loading: true });
    case GitAction.UserRegistered:
      return Object.assign({}, state, {
        loading: false,
        registrationReturn: action.payload
      });
    case GitAction.ResetRegistrationReturn:
      return Object.assign({}, state, { registrationReturn: [] });

    case GitAction.GetUserProfile:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotUserProfile:
      return Object.assign({}, state, {
        loading: false,
        userProfile: action.payload
      });
    case GitAction.ResetUserProfile:
      return Object.assign({}, state, { currentUser: [] });

    case GitAction.UpdateUserStatus:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedUserStatus:
      return Object.assign({}, state, {
        loading: false,
        currentUser: action.payload,
      });

    case GitAction.ClearCurrentUser:
      return Object.assign({}, state, { loading: true, currentUser: [] });
    ///////////////////////////////////////////////////  sidebar configuration ///////////////////////////////////////////////////

    case GitAction.FetchSidebar:
      return Object.assign({}, state, { loading: true });
    case GitAction.SidebarFetched:
      return Object.assign({}, state, {
        loading: false,
        sidebars: action.payload
      });
    case GitAction.ResetSidebar:
      return Object.assign({}, state, { sidebars: [] });

    ///////////////////////////////////////////////////  Shop  ///////////////////////////////////////////////////

    case GitAction.UpdateShopDetails:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedShopDetails:
      return Object.assign({}, state, {
        loading: false,
        shopUpdated: action.payload,
      });
    case GitAction.ClearUpdateShop:
      return Object.assign({}, state, { loading: true, shopUpdated: [] });


    ///////////////////////////////////////////////////  Address  ///////////////////////////////////////////////////

    case GitAction.GetAllAddress:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotAllAddress:
      return Object.assign({}, state, {
        loading: false,
        allAddress: action.payload,
      });

    ///////////////////////////////////////////////////  Order  ///////////////////////////////////////////////////

    case GitAction.AddOrder:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedOrder:
      return Object.assign({}, state, {
        loading: false,
        order: action.payload,
      });

    case GitAction.OrderCreateShipment:
      return Object.assign({}, state, { loading: true });
    case GitAction.OrderedCreateShipment:
      return Object.assign({}, state, {
        loading: false,
        orderShipment: action.payload,
      });

    case GitAction.OrderRequestShipmentStatus:
      return Object.assign({}, state, { loading: true });
    case GitAction.OrderRequestedShipmentStatus:
      return Object.assign({}, state, {
        loading: false,
        orderShipmentStatus: action.payload,
      });

    case GitAction.ResetOrderShipment:
      return Object.assign({}, state, { orderShipment: [], });

    case GitAction.ClearOrder:
      return Object.assign({}, state, { order: [], });

    case GitAction.OrderUserDetailsUpdate:
      return Object.assign({}, state, { loading: true });
    case GitAction.OrderUserDetailsUpdated:
      return Object.assign({}, state, {
        loading: false,
        order: action.payload,
      });

    case GitAction.GetTransactions:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotTransactions:
      return Object.assign({}, state, {
        loading: false,
        transactions: action.payload,
      });

    case GitAction.GetTransactionStatus:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotTransactionStatus:
      return Object.assign({}, state, {
        loading: false,
        transactionStatus: action.payload,
      });

    case GitAction.OrderTrackingStatusUpdate:
      return Object.assign({}, state, { loading: true });
    case GitAction.OrderTrackingStatusUpdated:
      return Object.assign({}, state, {
        loading: false,
        trackingStatusAction: action.payload,
      });


    case GitAction.resetTrackingStatus:
      return Object.assign({}, state, { trackingStatusAction: [] });

    case GitAction.updateTrackingNumber:
      return Object.assign({}, state, { loading: true });
    case GitAction.updatedTrackingNumber:
      return Object.assign({}, state, {
        loading: false,
        tracking: action.payload,
      });

    case GitAction.resetTracking:
      return Object.assign({}, state, { tracking: [] });



    ///////////////////////////////////////////////////  Merchant  ///////////////////////////////////////////////////

    case GitAction.GetMerchants:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotMerchants:
      return Object.assign({}, state, {
        loading: false,
        merchant: action.payload,
      });

    case GitAction.GetMerchantOrders:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotMerchantOrders:
      return Object.assign({}, state, {
        loading: false,
        merchantOrders: action.payload,
      });

    case GitAction.GetUpdateMerchantProfile:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotUpdateMerchantProfile:

      return Object.assign({}, state, {
        loading: false,
        merchantUpdateProfile: action.payload,
      });


    ///////////////////////////////////////////////////  Product  ///////////////////////////////////////////////////

    case GitAction.AddProduct:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedProduct:
      return Object.assign({}, state, {
        loading: false,
        addResult: action.payload,
      });

    case GitAction.ResetProductReturnVal:
      return Object.assign({}, state, {
        loading: false,
        addResult: [],
      });

    case GitAction.UpdateProduct:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedProduct:
      return Object.assign({}, state, {
        returnUpdateProduct: action.payload,
        loading: false
      });
    case GitAction.ResetUpdateProduct:
      return Object.assign({}, state, { returnUpdateProduct: [] });

    case GitAction.DeleteProduct:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedProduct:
      return Object.assign({}, state, {
        loading: false,
        productMgmtResult: action.payload,
      });

    case GitAction.GetProduct:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotProduct:
      return Object.assign({}, state, {
        loading: false,
        products: action.payload,
      });
    case GitAction.ResetProductDetails:
      return Object.assign({}, state, { productsByID: [] });
    case GitAction.ResetProductManagementValue:
      return Object.assign({}, state, { productMgmtResult: [] });


    case GitAction.GetProductListing:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotProductListing:
      return Object.assign({}, state, {
        loading: false,
        productsListing: action.payload,
      });

    case GitAction.EndorseProduct:
      return Object.assign({}, state, { loading: true });
    case GitAction.ProductEndorsed:
      return Object.assign({}, state, {
        loading: false,
        endorsedProduct: action.payload,
      });
    case GitAction.ResetProductEndorse:
      return Object.assign({}, state, { endorsedProduct: [] });

    case GitAction.CheckProduct:
      return Object.assign({}, state, { loading: true });
    case GitAction.ProductChecked:
      return Object.assign({}, state, {
        loading: false,
        exists: action.payload,
      });

    case GitAction.CheckProductSKU:
      return Object.assign({}, state, { loading: true });
    case GitAction.ProductCheckedSKU:
      return Object.assign({}, state, {
        loading: false,
        SKUexists: action.payload,
      });

    case GitAction.GetProductDetail:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotProductDetail:
      return Object.assign({}, state, {
        loading: false,
        productsByID: action.payload,
      });

    ///////////////////////////////////////////////////  Product Variation  ///////////////////////////////////////////////////

    case GitAction.AddProductVariation:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedProductVariation:
      return Object.assign({}, state, {
        loading: false,
      });

    case GitAction.UpdateProductVariation:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedProductVariation:
      return Object.assign({}, state, {
        loading: false,
      });

    case GitAction.DeleteProductVariation:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedProductVariation:
      return Object.assign({}, state, {
        loading: false,
      });

    case GitAction.GetProductVariationByCategoryID:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotProductVariationByCategoryID:
      return Object.assign({}, state, {
        loading: false,
        variations: action.payload,
      });

    ///////////////////////////////////////////////////  Product Variation Details  ///////////////////////////////////////////////////

    case GitAction.AddProductVariationDetail:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedProductVariationDetail:
      return Object.assign({}, state, {
        loading: false,
        addProductVariationResult: action.payload,
      });
    case GitAction.ResetProductVariationDetailResult:
      return Object.assign({}, state, {
        loading: false,
        addProductVariationResult: []
      });

    case GitAction.UpdateProductVariationDetail:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedProductVariationDetail:
      return Object.assign({}, state, {
        loading: false,
        variationResult: action.payload,
      });
    case GitAction.ResetUpdateProductVariationDetailResult:
      return Object.assign({}, state, {
        loading: false,
        variationResult: []
      });

    case GitAction.DeleteProductVariationDetail:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedProductVariationDetail:
      return Object.assign({}, state, {
        loading: false,
        variationResult: action.payload,
      });

    ///////////////////////////////////////////////////  Product Stock  ///////////////////////////////////////////////////

    // case GitAction.UpdateProductVariationStock:
    //   return Object.assign({}, state, { loading: true });
    // case GitAction.UpdatedProductVariationStock:
    //   return Object.assign({}, state, {
    //     loading: false,
    //     variationStock: action.payload,
    //     productsByID: action.payloadProduct
    //   });

    case GitAction.AddProductVariationStock:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedProductVariationStock:
      return Object.assign({}, state, {
        loading: false,
        variationAction: action.payload,
      });

    case GitAction.ResetProductVariationStock:
      return Object.assign({}, state, { variationAction: [] });

    case GitAction.ViewProductVariationStock:
      return Object.assign({}, state, { loading: true });
    case GitAction.ViewedProductVariationStock:
      return Object.assign({}, state, {
        loading: false,
        variationStock: action.payload,
      });

    case GitAction.ViewProductVariationStockWithID:
      return Object.assign({}, state, { loading: true });
    case GitAction.ViewedProductVariationStockWithID:
      return Object.assign({}, state, {
        loading: false,
        variationStock: action.payload,
      });

    case GitAction.ViewProductVariationStockWithVariationDetailsID:
      return Object.assign({}, state, { loading: true });
    case GitAction.ViewedProductVariationStockWithVariationDetailsID:
      return Object.assign({}, state, {
        loading: false,
        variationStockDetails: action.payload,
      });

    case GitAction.UpdateProductVariationStockDetails:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedProductVariationStockDetails:
      return Object.assign({}, state, {
        loading: false,
        variationAction: action.payload,
      });

    case GitAction.DeleteProductVariationStock:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedProductVariationStock:
      return Object.assign({}, state, {
        loading: false,
        variationAction: action.payload,
      });

    ///////////////////////////////////////////////////  Product Specification  ///////////////////////////////////////////////////

    case GitAction.AddProductSpecsDetail:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedProductSpecsDetail:
      return Object.assign({}, state, {
        loading: false,
        productSpecsDetail: action.payload,
      });
    case GitAction.ResetProductSpecsDetailResult:
      return Object.assign({}, state, {
        loading: false,
        productSpecsDetail: [],
      });

    case GitAction.UpdateProductSpecsDetail:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedProductSpecsDetail:
      return Object.assign({}, state, {
        loading: false,
        SpecsDetail: action.payload,
      });
    case GitAction.ResetUpdateProductSpecsDetailResult:
      return Object.assign({}, state, {
        loading: false,
        SpecsDetail: [],
      });

    case GitAction.DeleteProductSpecsDetail:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedProductSpecsDetail:
      return Object.assign({}, state, {
        loading: false,
        deleteproductSpecsDetail: action.payload,
      });


    ///////////////////////////////////////////////////  Product Media  ///////////////////////////////////////////////////

    case GitAction.AddProductMedia:
      return Object.assign({}, state, { loading: true });
    case GitAction.ProductMediaAdded:
      return Object.assign({}, state, {
        loading: false,
        productMediaResult: action.payload,
      });

    case GitAction.deleteProductMedia:
      return Object.assign({}, state, { loading: true });
    case GitAction.deletedProductMedia:
      return Object.assign({}, state, {
        loading: false,
        productMediaResult: action.payload,
      });


    case GitAction.ResetProductMediaReturnVal:
      return Object.assign({}, state, {
        loading: false,
        productMediaResult: []
      });

    ///////////////////////////////////////////////////  Product Category  ///////////////////////////////////////////////////

    case GitAction.AddProductCategory:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedProductCategory:
      return Object.assign({}, state, {
        loading: false,
        categories: action.payload,
      });

    case GitAction.UpdateProductCategory:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedProductCategory:
      return Object.assign({}, state, {
        loading: false,
        categories: action.payload,
      });

    case GitAction.DeleteProductCategory:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedProductCategory:
      return Object.assign({}, state, {
        loading: false,
        categories: action.payload,
      });

    case GitAction.GetProductCategory:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotProductCategory:
      return Object.assign({}, state, {
        loading: false,
        categories: action.payload,
      });


    case GitAction.ResetProductCategoryAction:
      return Object.assign({}, state, {
        loading: false,
        categories: []
      });

    case GitAction.GetProductCategoryListing:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotProductCategoryListing:
      return Object.assign({}, state, {
        loading: false,
        productCategories: action.payload,
      });


    ///////////////////////////////////////////////////  Product Review  ///////////////////////////////////////////////////

    case GitAction.GetProductReviewByProductID:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotProductReviewByProductID:
      return Object.assign({}, state, {
        loading: false,
        reviews: action.payload,
      });


    case GitAction.addProductReview:
      return Object.assign({}, state, { loading: true });
    case GitAction.addedProductReview:
      return Object.assign({}, state, {
        loading: false,
        reviews: action.payload,
        reviewReturn: action.payload2
      });

    ///////////////////////////////////////////////////  Quotation  ///////////////////////////////////////////////////

    case GitAction.AddProductQuotation:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedProductQuotation:
      return Object.assign({}, state, {
        loading: false,
        quotationAction: action.payload,
      });

    case GitAction.GetProductQuotation:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotProductQuotation:
      return Object.assign({}, state, {
        loading: false,
        quotations: action.payload,
      });

    case GitAction.DeleteQuotation:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedQuotation:
      return Object.assign({}, state, {
        loading: false,
        quotationAction: action.payload,
      });
    ///////////////////////////////////////////////////  Promotion  ///////////////////////////////////////////////////

    case GitAction.GetPromotion:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotPromotion:
      return Object.assign({}, state, {
        loading: false,
        promotions: action.payload,
      });

    case GitAction.GetPromotionByID:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotPromotionByID:
      return Object.assign({}, state, {
        loading: false,
        promotionByID: action.payload,
      });

    case GitAction.AddPromotion:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedPromotion:
      return Object.assign({}, state, {
        loading: false,
        promoAction: action.payload,
      });


    case GitAction.UpdatePromotionInd:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedPromotionInd:
      return Object.assign({}, state, {
        loading: false,
        promoAction: action.payload,
      });


    // case GitAction.ClearAddPromo:
    //   return Object.assign({}, state, { promoAction: [], });

    case GitAction.UpdatePromotion:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedPromotion:
      return Object.assign({}, state, {
        loading: false,
        promoAction: action.payload,
      });

    case GitAction.DeletePromotion:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedPromotion:
      return Object.assign({}, state, {
        loading: false,
        promoAction: action.payload,
      });

    // case GitAction.UpdatePromotion:
    //   return Object.assign({}, state, { loading: true });
    // case GitAction.UpdatedPromotion:
    //   var newPromoObj = Object.assign({}, state);
    //   newPromoObj.loading = false;
    //   return newPromoObj;

    // case GitAction.DeletePromotion:
    //   return Object.assign({}, state, { loading: true });
    // case GitAction.DeletedPromotion:
    //   var newPromoObj = Object.assign({}, state);
    //   newPromoObj.loading = false;
    //   return newPromoObj;


    ///////////////////////////////////////////////////  General  ///////////////////////////////////////////////////

    case GitAction.GetCountry:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotCountry:
      return Object.assign({}, state, {
        loading: false,
        countries: action.payload,
      });

    case GitAction.GetCourierService:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotCourierService:
      return Object.assign({}, state, {
        loading: false,
        logistic: action.payload,
      });

    case GitAction.GetState:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotState:
      return Object.assign({}, state, {
        loading: false,
        states: action.payload,
      });

    case GitAction.GetPaymentMethod:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotPaymentMethod:
      return Object.assign({}, state, {
        loading: false,
        paymentMethod: action.payload,
      });

    ///////////////////////////////////////////////////  Shoplot  ///////////////////////////////////////////////////


    case GitAction.GetShopListing:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotShopListing:
      return Object.assign({}, state, {
        loading: false,
        shoplot: action.payload,
      });

    case GitAction.GetShopListingByID:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotShopListingByID:
      return Object.assign({}, state, {
        loading: false,
        shoplotByID: action.payload,
      });

    case GitAction.AddShoplot:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedShoplot:
      return Object.assign({}, state, {
        loading: false,
        shoplotAction: action.payload,
      });

    case GitAction.UpdateShoplot:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedShoplot:
      return Object.assign({}, state, {
        loading: false,
        shoplotAction: action.payload,
      });

    case GitAction.DeleteShoplot:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedShoplot:
      return Object.assign({}, state, {
        loading: false,
        shoplotAction: action.payload,
      });

    case GitAction.AddShoplotCoordinateListing:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedShoplotCoordinateListing:
      return Object.assign({}, state, {
        loading: false,
        coordinateAction: action.payload,
      });

    case GitAction.UpdateShoplotCoordinateListing:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedShoplotCoordinateListing:
      return Object.assign({}, state, {
        loading: false,
        coordinateAction: action.payload,
      });


    case GitAction.ResetShopAction:
      return Object.assign({}, state, {
        loading: true,
        shoplotAction: [],
      });

    ///////////////////////////////////////////////////  Block  ///////////////////////////////////////////////////


    case GitAction.GetBlockListing:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotBlockListing:
      return Object.assign({}, state, {
        loading: false,
        block: action.payload,
      });

    case GitAction.AddBlockListing:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedBlockListing:
      return Object.assign({}, state, {
        loading: false,
        blockAction: action.payload,
      });

    case GitAction.UpdateBlockListing:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedBlockListing:
      return Object.assign({}, state, {
        loading: false,
        blockAction: action.payload,
      });

    case GitAction.DeleteBlockListing:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedBlockListing:
      return Object.assign({}, state, {
        loading: false,
        blockAction: action.payload,
      });

    case GitAction.ResetBlockAction:
      return Object.assign({}, state, {
        loading: true,
        blockAction: [],
      });

    ///////////////////////////////////////////////////  Grid  ///////////////////////////////////////////////////

    case GitAction.GetStorage:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotStorage:
      return Object.assign({}, state, {
        loading: false,
        grid: action.payload,
      });


    case GitAction.AddGridListing:
      return Object.assign({}, state, { loading: true });
    case GitAction.AddedGridListing:
      return Object.assign({}, state, {
        loading: false,
        gridAction: action.payload,
      });

    case GitAction.UpdateGridListing:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedGridListing:
      return Object.assign({}, state, {
        loading: false,
        gridAction: action.payload,
      });

    case GitAction.DeleteGridListing:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedGridListing:
      return Object.assign({}, state, {
        loading: false,
        gridAction: action.payload,
      });

    case GitAction.ResetGridAction:
      return Object.assign({}, state, {
        loading: true,
        gridAction: [],
      });

    ///////////////////////////////////////////////////  Purchase Order  ///////////////////////////////////////////////////


    case GitAction.UpdatePurchaseOrderStatus:
      return Object.assign({}, state, { loading: true });
    case GitAction.UpdatedPurchaseOrderStatus:
      return Object.assign({}, state, {
        loading: false,
        POAction: action.payload,
      });

    case GitAction.GetPurchaseOrders:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotPurchaseOrders:
      return Object.assign({}, state, {
        loading: false,
        POListing: action.payload,
      });

    case GitAction.DeletePurchaseOrder:
      return Object.assign({}, state, { loading: true });
    case GitAction.DeletedPurchaseOrder:
      return Object.assign({}, state, {
        loading: false,
        POAction: action.payload,
      });

    case GitAction.GetProductByStatus:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotProductByStatus:
      return Object.assign({}, state, {
        loading: false,
        ProductByStatus: action.payload,
      });

    case GitAction.SendSalesOrder:
      return Object.assign({}, state, { loading: true });
    case GitAction.SentSalesOrder:
      return Object.assign({}, state, {
        loading: false,
        SalesOrder: action.payload,
      });

    case GitAction.ClearSalesOrder:
      return Object.assign({}, state, { loading: true });
    case GitAction.ClearedSalesOrder:
      return Object.assign({}, state, {
        loading: false,
        SalesOrder: action.payload,
      });

    case GitAction.GetMainDashboard:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotMainDashboard:
      return Object.assign({}, state, {
        loading: false,
        maindashboard: action.payload,
      });

    case GitAction.GetMerchantDashboard:
      return Object.assign({}, state, { loading: true });
    case GitAction.GotMerchantDashboard:
      return Object.assign({}, state, {
        loading: false,
        merchantdashboard: action.payload,
      });

    /////////////////////////////////////////////////// Default ///////////////////////////////////////////////////
    default:
      return state;
  }
}
