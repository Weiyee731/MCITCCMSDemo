/* eslint-disable no-unused-vars */
/* eslint-disable no-self-assign */
import { Observable } from "rxjs";
import { ActionsObservable } from "redux-observable";
import { GitAction } from "../action/gitAction";
import { toast } from "react-toastify";
import axios from "axios";
import { ServerConfiguration } from "../serverConf";


/**
 * ** IMPORTANT! Never do any file uploads or save data to the local storage here!! This Git EPIC is highly focus on call APIs to communicate to the server 
 * 
 * ** you can set your server url by switch the option as below 
 */
//           options          //
//   1. testing server url    //
//   2. live server url       // 
const url = ServerConfiguration.ServerUrl;
const project = window.localStorage.getItem("project")
// const project = window.location.pathname.split(".")[1]

export class GitEpic {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////

  User_Login = action$ =>
    action$.ofType(GitAction.Login).switchMap(async ({ payload }) => {
      console.log(
        url + payload.ProjectDomainName + "/" +
        "User_Login?username=" +
        payload.username +
        "&password=" +
        payload.password +
        "&ProjectDomainName=" +
        payload.ProjectDomainName
      )
      try {
        const response = await fetch(
          url + payload.ProjectDomainName + "/" +
          "User_Login?username=" +
          payload.username +
          "&password=" +
          payload.password +
          "&ProjectDomainName=" +
          payload.ProjectDomainName
        );

        let json = await response.json();
        json = JSON.parse(json)
        console.log("json", json)
        return {
          type: GitAction.LoginSuccess,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: User_Login")
        return {
          type: GitAction.LoginSuccess,
          payload: [],
        };
      }
    });

  User_Logout = action$ =>
    action$.ofType(GitAction.Logout).switchMap(async ({ payload }) => {
      console.log(url + project + "/" +
        "User_Logout?UserId=" + payload.UserId)
      try {
        const response = await fetch(
          url + project + "/" +
          "User_Logout?UserId=" + payload.UserId
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.LoggedOutSuccess,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: User_Logout")
        return {
          type: GitAction.LoggedOutSuccess,
          payload: [],
        };
      }
    });

  User_Register = action$ =>
    action$.ofType(GitAction.RegisterUser).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(
          url + project + "/" +
          "User_Register?" +
          "userFirstName=" + payload.userFirstName +
          "&userLastName=" + payload.userLastName +
          "&username=" + payload.username +
          "&userEmail=" + payload.userEmail +
          "&password=" + payload.password
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.UserRegistered,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: RegisterUser")
        return {
          type: GitAction.UserRegistered,
          payload: [],
        };
      }
    });

  User_ViewProfile = (action$) =>
    action$.ofType(GitAction.GetUserProfile).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "User_ProfileListByType?TYPE=" + payload.TYPE +
        "&TYPEVALUE=" + payload.TYPEVALUE +
        "&USERID=" + payload.USERID +
        "&UserRoleID=" + payload.USERROLEID +
        "&LISTPERPAGE=" + payload.LISTPERPAGE +
        "&PAGE=" + payload.PAGE +
        "&ProjectID=" + payload.ProjectID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "User_ProfileListByType?TYPE=" + payload.TYPE +
          "&TYPEVALUE=" + payload.TYPEVALUE +
          "&USERID=" + payload.USERID +
          "&UserRoleID=" + payload.USERROLEID +
          "&LISTPERPAGE=" + payload.LISTPERPAGE +
          "&PAGE=" + payload.PAGE +
          "&ProjectID=" + payload.ProjectID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.GotUserProfile,
          payload: json,
        };
      } catch (error) {
        alert('getUserProfile: ' + error);
        return {
          type: GitAction.GotUserProfile,
          payload: [],
        };
      }
    });

  // User_ProfileByID = action$ =>
  //   action$.ofType(GitAction.GetUserProfile).switchMap(async ({ payload }) => {
  //     // console.log(url + 
  //     //   double_click_and_paste_url_here
  //     // )
  //     try {
  //       const response = await fetch(url + project + "/" +
  //         "User_ProfileByID?USERID=" + payload.USERID
  //       );

  //       let json = await response.json();
  //       json = JSON.parse(json)
  //       return {
  //         type: GitAction.GotUserProfile,
  //         payload: json,
  //       };
  //     }
  //     catch (error) {
  //       toast.error("Error Code: GetUserProfile")
  //       return {
  //         type: GitAction.GotUserProfile,
  //         payload: [],
  //       };
  //     }
  //   });

  ///////////////////////////////////////////////////  Order  ///////////////////////////////////////////////////
  Order_Add = (action$) =>
    action$.ofType(GitAction.AddOrder).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Order_AddOrder?USERID=" + payload.UserID +
        "&USERADDRESSID=" + payload.UserAddressID +
        "&PROMOTIONID=0&PROMOTIONCODEID=0&PAYMENTMETHODID=" + payload.PaymentMethodID +
        "&USERPAYMENTMETHODID=" + payload.UserPaymentMethodID +
        "&ORDERTOTALAMOUNT=" + payload.OrderTotalAmount +
        "&ORDERPAIDAMOUNT=" + payload.OrderPaidAmount +
        "&PRODUCTID=" + payload.ProductID +
        "&PRODUCTQUANTITY=" + payload.ProductQuantity +
        "&PRODUCTVARIATIONDETAILID=" + payload.ProductVariationDetailID +
        "&TRACKINGSTATUSID=" + payload.TrackingStatusID +
        "&PickUpInd=" + payload.PickUpInd +
        "&ProjectID=" + payload.ProjectID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Order_AddOrder?USERID=" + payload.UserID +
          "&USERADDRESSID=" + payload.UserAddressID +
          "&PROMOTIONID=0&PROMOTIONCODEID=0&PAYMENTMETHODID=" + payload.PaymentMethodID +
          "&USERPAYMENTMETHODID=" + payload.UserPaymentMethodID +
          "&ORDERTOTALAMOUNT=" + payload.OrderTotalAmount +
          "&ORDERPAIDAMOUNT=" + payload.OrderPaidAmount +
          "&PRODUCTID=" + payload.ProductID +
          "&PRODUCTQUANTITY=" + payload.ProductQuantity +
          "&PRODUCTVARIATIONDETAILID=" + payload.ProductVariationDetailID +
          "&TRACKINGSTATUSID=" + payload.TrackingStatusID +
          "&PickUpInd=" + payload.PickUpInd +
          "&ProjectID=" + payload.ProjectID
        );
        let json = await response.json();
        json = JSON.parse(json);
        if (json[0].ReturnVal === 1) {
          toast.success("Order is successfully created ORDERID : " + json[0].OrderID);
        }
        try {
          const response_1 = await fetch(
            url +
            "Product_DeleteProductCart?USERCARTID=" +
            payload.UserCartID
          );
          let json_1 = await response_1.json();
          json_1 = json_1
          return {
            type: GitAction.AddedOrder,
            payload: json,
          };
        } catch (error) {
          alert('deleteProductCart: ' + error);
          return {
            type: GitAction.AddedOrder,
            payload: [],
          };
        }
      }
      catch (error) {
        alert('AddOrder: ' + error);
        return {
          type: GitAction.AddedOrder,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////  Order  ///////////////////////////////////////////////////

  Order_ViewAll = (action$) =>
    action$.ofType(GitAction.GetTransactions).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Order_ViewOrder?TRACKINGSTATUS=" + payload.TrackingStatus +
        "&ProjectID=" + payload.ProjectID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Order_ViewOrder?TRACKINGSTATUS=" + payload.TrackingStatus +
          "&ProjectID=" + payload.ProjectID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.GotTransactions,
          payload: json,
        };
      } catch (error) {
        alert('getAllTransactions: ' + error);
        return {
          type: GitAction.GotTransactions,
          payload: []
        };
      }
    });

  ///////////////////////////////////////////////////  Address  ///////////////////////////////////////////////////

  Address_ViewAll = (action$) =>
    action$.ofType(GitAction.GetAllAddress).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "User_ViewAllAddressBook?ProjectID=" + payload.ProjectID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "User_ViewAllAddressBook?ProjectID=" + payload.ProjectID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.GotAllAddress,
          payload: json,
        };
      } catch (error) {
        alert('Err code GotAllAddress: ' + error);
        return {
          type: GitAction.GotAllAddress,
          payload: [],
        };
      }
    });


  ///////////////////////////////////////////////////  Merchant  ///////////////////////////////////////////////////

  Merchants_ViewProfile = (action$) =>
    action$.ofType(GitAction.GetMerchants).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "User_ProfileListByType?TYPE=" + payload.type +
        "&TYPEVALUE=" + payload.typeValue +
        "&USERID=" + payload.USERID +
        "&UserRoleID=" + payload.userRoleID +
        "&LISTPERPAGE=" + payload.productPage +
        "&PAGE=" + payload.page +
        "&ProjectID=" + payload.ProjectID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "User_ProfileListByType?TYPE=" + payload.type +
          "&TYPEVALUE=" + payload.typeValue +
          "&USERID=" + payload.USERID +
          "&UserRoleID=" + payload.userRoleID +
          "&LISTPERPAGE=" + payload.productPage +
          "&PAGE=" + payload.page +
          "&ProjectID=" + payload.ProjectID
        );
        let json = await response.json();
        json = JSON.parse(json);
        if (json !== "fail") {
        } else {
          json = [];
        }
        return {
          type: GitAction.GotMerchants,
          payload: json,
        };
      } catch (error) {
        alert('getAllMerchants: ' + error);
        return {
          type: GitAction.GotMerchants,
          payload: [],
        };
      }
    });


  ///////////////////////////////////////////////////  Products  ///////////////////////////////////////////////////

  Product_Add = (action$) =>
    action$.ofType(GitAction.AddProduct).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_AddProduct?PRODUCTNAME=" + payload.name +
        "&PRODUCTDESC=" + payload.description +
        "&PRODUCTCATEGORYID=" + payload.productCategory +
        "&MERCHANTID=" + payload.productSupplier +
        "&PRODUCTHEIGHT=" + payload.height +
        "&PRODUCTWIDTH=" + payload.width +
        "&PRODUCTDEPTH=" + payload.depth +
        "&PRODUCTWEIGHT=" + payload.weight +
        "&PRODUCTSKU=" + payload.sku +
        "&PRODUCTBRAND=" + payload.brand +
        "&PRODUCTMODEL=" + payload.model +
        "&PRODUCTTAG=" + payload.tags +
        "&ProjectID=" + payload.ProjectID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_AddProduct?PRODUCTNAME=" + payload.name +
          "&PRODUCTDESC=" + payload.description +
          "&PRODUCTCATEGORYID=" + payload.productCategory +
          "&MERCHANTID=" + payload.productSupplier +
          "&PRODUCTHEIGHT=" + payload.height +
          "&PRODUCTWIDTH=" + payload.width +
          "&PRODUCTDEPTH=" + payload.depth +
          "&PRODUCTWEIGHT=" + payload.weight +
          "&PRODUCTSKU=" + payload.sku +
          "&PRODUCTBRAND=" + payload.brand +
          "&PRODUCTMODEL=" + payload.model +
          "&PRODUCTTAG=" + payload.tags +
          "&ProjectID=" + payload.ProjectID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.AddedProduct,
          payload: json,
        };
      } catch (error) {
        alert('addProduct: ' + error);
        return {
          type: GitAction.AddedProduct,
          payload: [],
        };
      }
    });

  Product_Update = (action$) =>
    action$.ofType(GitAction.UpdateProduct).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_UpdateProduct?PRODUCTID=" + payload.ProductID +
        "&name=" + payload.name +
        "&manufacturer=1" +
        "&description=" + payload.description +
        "&productCategory=" + payload.productCategory +
        "&productSupplier=" +
        payload.productSupplier + "&productShoplot=1&productGrid=1&height=" + payload.height +
        "&width=" + payload.width +
        "&depth=" + payload.depth +
        "&weight=" + payload.weight +
        "&sku=" + payload.sku +
        "&brand=" + payload.brand +
        "&model=" + payload.model +
        "&tags=" + payload.tags +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_UpdateProduct?PRODUCTID=" + payload.ProductID +
          "&name=" + payload.name +
          "&manufacturer=1" +
          "&description=" + payload.description +
          "&productCategory=" + payload.productCategory +
          "&productSupplier=" +
          payload.productSupplier + "&productShoplot=1&productGrid=1&height=" + payload.height +
          "&width=" + payload.width +
          "&depth=" + payload.depth +
          "&weight=" + payload.weight +
          "&sku=" + payload.sku +
          "&brand=" + payload.brand +
          "&model=" + payload.model +
          "&tags=" + payload.tags +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);

        return {
          type: GitAction.UpdatedProduct,
          payload: json,
        };
      } catch (error) {
        alert('updateProduct: ' + error);
        return {
          type: GitAction.UpdatedProduct,
          payload: [],
        };
      }
    });

  Product_Delete = (action$) =>
    action$.ofType(GitAction.DeleteProduct).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_DeleteProducts?ProductIDs=" + payload.ProductID +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_DeleteProducts?ProductIDs=" + payload.ProductID +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);
        console.log("json", json)
        return {
          type: GitAction.DeletedProduct,
          payload: json,
        };
      } catch (error) {
        alert('deleteProduct: ' + error);
        return {
          type: GitAction.DeletedProduct,
          payload: [],
        };
      }
    });

  Product_ViewAll = (action$) =>
    action$.ofType(GitAction.GetProduct).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_ItemListByType?Type=" + payload.type +
        "&TypeValue=" + payload.typeValue +
        "&USERID=" + payload.userId +
        "&PRODUCTPERPAGE=" + payload.productPage +
        "&PAGE=" + payload.page +
        "&ProjectID=" + payload.ProjectID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_ItemListByType?Type=" + payload.type +
          "&TypeValue=" + payload.typeValue +
          "&USERID=" + payload.userId +
          "&PRODUCTPERPAGE=" + payload.productPage +
          "&PAGE=" + payload.page +
          "&ProjectID=" + payload.ProjectID
        );
        let json = await response.json();
        json = JSON.parse(json);
        console.log("json", json)
        return {
          type: GitAction.GotProduct,
          payload: json,
        };
      } catch (error) {
        alert('getAllProducts: ' + error);
        return {
          type: GitAction.GotProduct,
          payload: [],
        };
      }
    });

  Product_Endorse = (action$) =>
    action$.ofType(GitAction.EndorseProduct).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_EndorseProducts?ProductIDs=" + payload.ProductID +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_EndorseProducts?ProductIDs=" + payload.ProductID +
          "&USERID=" + payload.UserID);
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.ProductEndorsed,
          payload: json,
        };
      } catch (error) {
        alert('endorseProduct: ' + error);
        return {
          type: GitAction.ProductEndorsed,
          payload: [],
        };
      }
    });

  Product_CheckDuplicate = (action$) =>
    action$.ofType(GitAction.CheckProduct).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_CheckDuplication?PRODUCTNAME=" + payload.ProductName +
        "&ProjectID=" + payload.ProjectID
      )
      try {
        const resposne = await fetch(
          url + project + "/" +
          "Product_CheckDuplication?PRODUCTNAME=" + payload.ProductName +
          "&ProjectID=" + payload.ProjectID
        );
        let json = await resposne.json();
        if (json !== "fail") {
          json = JSON.parse(json);
        } else {
          json = [];
        }
        return {
          type: GitAction.ProductChecked,
          payload: json,
        };
      } catch (error) {
        alert('checkProduct: ' + error);
        return {
          type: GitAction.ProductChecked,
          payload: [],
        };
      }
    });


  ///////////////////////////////////////////////////  Product Variation  ///////////////////////////////////////////////////
  ProductVariation_Add = (action$) =>
    action$.ofType(GitAction.AddProductVariation).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_AddProductVariation?PRODUCTVARIATION=" + payload.ProductVariation +
        "&PRODUCTCATEGORYID=" + payload.ProductCategoryID +
        "&CUSTOMIZABLE=" + payload.CustomizableIndicator +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_AddProductVariation?PRODUCTVARIATION=" + payload.ProductVariation +
          "&PRODUCTCATEGORYID=" + payload.ProductCategoryID +
          "&CUSTOMIZABLE=" + payload.CustomizableIndicator +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        if (json !== "fail") {
          json = JSON.parse(json);
        } else {
          json = [];
        }
        return {
          type: GitAction.AddedProductVariation,
          payload: json,
        };
      } catch (error) {
        alert('addProductVariation: ' + error);
        return {
          type: GitAction.AddedProductVariation,
          payload: [],
        };
      }
    });

  ProductVariation_Update = (action$) =>
    action$.ofType(GitAction.UpdateProductVariation).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_UpdateProductVariation?PRODUCTVARIATIONID=" + payload.ProductVariationID +
        "&PRODUCTVARIATION=" + payload.ProductVariation +
        "&PRODUCTCATEGORYID=" + payload.ProductCategoryID +
        "&CUSTOMIZABLE=" + payload.Customizable +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_UpdateProductVariation?PRODUCTVARIATIONID=" + payload.ProductVariationID +
          "&PRODUCTVARIATION=" + payload.ProductVariation +
          "&PRODUCTCATEGORYID=" + payload.ProductCategoryID +
          "&CUSTOMIZABLE=" + payload.Customizable +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.UpdatedProductVariation,
          payload: json,
        };
      } catch (error) {
        alert('updateProductVariation: ' + error);
        return {
          type: GitAction.UpdatedProductVariation,
          payload: [],
        };
      }
    });

  ProductVariation_Delete = (action$) =>
    action$.ofType(GitAction.DeleteProductVariation).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_DeleteProductVariation?PRODUCTVARIATIONID=" + payload.ProductVariationID +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_DeleteProductVariation?PRODUCTVARIATIONID=" + payload.ProductVariationID +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);
        if (json !== "fail") {
        } else {
          json = [];
        }
        return {
          type: GitAction.DeletedProductVariation,
          payload: json,
        };
      } catch (error) {
        alert('deleteProductVariation: ' + error);
        return {
          type: GitAction.DeletedProductVariation,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////  Product Variation Details  ///////////////////////////////////////////////////

  ProductVariationDetail_Add = (action$) =>
    action$.ofType(GitAction.AddProductVariationDetail).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_AddProductVariationDetail?PRODUCTVARIATIONID=" + payload.ProductVariation +
        "&PRODUCTID=" + payload.ProductID +
        "&CUSTOMIZABLE=" + payload.Customizable +
        "&VALUE=" + payload.Value +
        "&PRODUCTSTOCK=" + payload.stock +
        "&PRODUCTVARIATIONSKU=" + payload.sku +
        "&PRODUCTVARIATIONPRICE=" + payload.price +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_AddProductVariationDetail?PRODUCTVARIATIONID=" + payload.ProductVariation +
          "&PRODUCTID=" + payload.ProductID +
          "&CUSTOMIZABLE=" + payload.Customizable +
          "&VALUE=" + payload.Value +
          "&PRODUCTSTOCK=" + payload.stock +
          "&PRODUCTVARIATIONSKU=" + payload.sku +
          "&PRODUCTVARIATIONPRICE=" + payload.price +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);

        return {
          type: GitAction.AddedProductVariationDetail,
          payload: json,
        };
      } catch (error) {
        alert('addProductVariationDetail: ' + error);
        return {
          type: GitAction.AddedProductVariationDetail,
          payload: [],
        };
      }
    });

  ProductVariationDetail_Update = (action$) =>
    action$.ofType(GitAction.UpdateProductVariationDetail).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_UpdateProductVariationDetails?PRODUCTVARIATIONDETAILID=" + payload.ProductVariationDetailID +
        "&CUSTOMIZABLE=" + payload.Customizable +
        "&VALUE=" + payload.Value +
        "&PRODUCTSTOCK=" + payload.stock +
        "&PRODUCTVARIATIONSKU=" + payload.sku +
        "&PRODUCTVARIATIONPRICE=" + payload.price +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_UpdateProductVariationDetails?PRODUCTVARIATIONDETAILID=" + payload.ProductVariationDetailID +
          "&CUSTOMIZABLE=" + payload.Customizable +
          "&VALUE=" + payload.Value +
          "&PRODUCTSTOCK=" + payload.stock +
          "&PRODUCTVARIATIONSKU=" + payload.sku +
          "&PRODUCTVARIATIONPRICE=" + payload.price +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);

        return {
          type: GitAction.UpdatedProductVariationDetail,
          payload: json,
        };
      } catch (error) {
        alert('UpdateProductVariationDetail: ' + error);
        return {
          type: GitAction.UpdatedProductVariationDetail,
          payload: [],
        };
      }
    });

  ProductVariationDetail_Delete = (action$) =>
    action$.ofType(GitAction.DeleteProductVariationDetail).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_DeleteProductVariationDetails?PRODUCTVARIATIONDETAILID=" + payload.ProductVariationDetailID +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_DeleteProductVariationDetails?PRODUCTVARIATIONDETAILID=" + payload.ProductVariationDetailID +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.DeletedProductVariationDetail,
          payload: json,
        };
      } catch (error) {
        alert('deleteProductVariationDetail: ' + error);
        return {
          type: GitAction.DeletedProductVariationDetail,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////  Product Specification Details  ///////////////////////////////////////////////////

  ProductSpecsDetail_Add = (action$) =>
    action$.ofType(GitAction.AddProductSpecsDetail).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_AddProductSpecificationDetail?PRODUCTVARIATIONID=" + payload.ProductVariation +
        "&PRODUCTID=" + payload.ProductID +
        "&PRODUCTSPECIFICATIONVALUE=" + payload.value +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_AddProductSpecificationDetail?PRODUCTVARIATIONID=" + payload.ProductVariation +
          "&PRODUCTID=" + payload.ProductID +
          "&PRODUCTSPECIFICATIONVALUE=" + payload.value +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.AddedProductSpecsDetail,
          payload: json,
        };
      } catch (error) {
        alert('addProductSpecsDetail: ' + error);
        return {
          type: GitAction.AddedProductSpecsDetail,
          payload: [],
        };
      }
    });

  ProductSpecsDetail_Update = (action$) =>
    action$.ofType(GitAction.UpdateProductSpecsDetail).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_UpdateProductSpecificationDetail?PRODUCTVARIATIONID=" + payload.ProductVariation +
        "&PRODUCTID=" + payload.ProductID +
        "&PRODUCTSPECIFICATIONVALUE=" + payload.value +
        "&PRODUCTSPECIFICATIONDETAILID=" + payload.specificationDetailID +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_UpdateProductSpecificationDetail?PRODUCTVARIATIONID=" + payload.ProductVariation +
          "&PRODUCTID=" + payload.ProductID +
          "&PRODUCTSPECIFICATIONVALUE=" + payload.value +
          "&PRODUCTSPECIFICATIONDETAILID=" + payload.specificationDetailID +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.UpdatedProductSpecsDetail,
          payload: json,
        };
      } catch (error) {
        alert('UpdateProductSpecsDetail: ' + error);
        return {
          type: GitAction.UpdatedProductSpecsDetail,
          payload: [],
        };
      }
    });

  ProductSpecsDetail_Delete = (action$) =>
    action$.ofType(GitAction.DeleteProductSpecsDetail).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_DeleteProductSpecificationDetail?PRODUCTSPECIFICATIONDETAILID=" + payload.specificationDetailID +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_DeleteProductSpecificationDetail?PRODUCTSPECIFICATIONDETAILID=" + payload.specificationDetailID +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.DeletedProductSpecsDetail,
          payload: json,
        };
      } catch (error) {
        alert('DeleteProductSpecsDetail: ' + error);
        return {
          type: GitAction.DeletedProductSpecsDetail,
          payload: [],
        };
      }
    });


  ///////////////////////////////////////////////////  Product Media ///////////////////////////////////////////////////

  ProductMedia_Add = (action$) =>
    action$.ofType(GitAction.AddProductMedia).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_AddProductMedia?" +
        "PRODUCTID=" + payload.ProductID +
        "&PRODUCTVARIATIONDETAILID=" + payload.variationID +
        "&PRODUCTSLIDEORDER=" + payload.sliderOrder +
        "&TYPE=" + payload.mediaType +
        "&WIDTH=" + payload.imageWidth +
        "&HEIGHT=" + payload.imageHeight +
        "&IMAGENAME=" + payload.imageName +
        "&USERID=" + payload.UserID
      )
      try {
        const resposne = await fetch(
          url + project + "/" +
          "Product_AddProductMedia?" +
          "PRODUCTID=" + payload.ProductID +
          "&PRODUCTVARIATIONDETAILID=" + payload.variationID +
          "&PRODUCTSLIDEORDER=" + payload.sliderOrder +
          "&TYPE=" + payload.mediaType +
          "&WIDTH=" + payload.imageWidth +
          "&HEIGHT=" + payload.imageHeight +
          "&IMAGENAME=" + payload.imageName +
          "&USERID=" + payload.UserID
        );
        let json = await resposne.json();
        json = JSON.parse(json);
        return {
          type: GitAction.ProductMediaAdded,
          payload: json,
        };
      } catch (error) {
        alert('AddProductMedia: ' + error);
        return {
          type: GitAction.ProductMediaAdded,
          payload: [],
        };
      }
    });

  ProductMedia_Delete = (action$) =>
    action$.ofType(GitAction.deleteProductMedia).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_DeleteProductMedia?" +
        "PRODUCTMEDIAID=" + payload.imageID +
        "&USERID=" + payload.UserID
      )
      try {
        const resposne = await fetch(
          url + project + "/" +
          "Product_DeleteProductMedia?" +
          "PRODUCTMEDIAID=" + payload.imageID +
          "&USERID=" + payload.UserID
        );
        let json = await resposne.json();
        json = JSON.parse(json);

        return {
          type: GitAction.deletedProductMedia,
          payload: json,
        };
      } catch (error) {
        return {
          type: GitAction.deletedProductMedia,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////  Product Category ///////////////////////////////////////////////////

  ProductCategory_Add = (action$) =>
    action$.ofType(GitAction.AddProductCategory).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_AddProductCategory?PRODUCTCATEGORY=" + payload.ProductCategory +
        "&PRODUCTCATEGORYIMAGE=" + payload.ProductCategoryImage +
        "&HIERARCHYID=" + payload.HierarchyID +
        "&PARENTPRODUCTCATEGORYID=" + payload.ParentProductCategoryID +
        "&ProjectID=" + payload.ProjectID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_AddProductCategory?PRODUCTCATEGORY=" + payload.ProductCategory +
          "&PRODUCTCATEGORYIMAGE=" + payload.ProductCategoryImage +
          "&HIERARCHYID=" + payload.HierarchyID +
          "&PARENTPRODUCTCATEGORYID=" + payload.ParentProductCategoryID +
          "&ProjectID=" + payload.ProjectID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.AddedProductCategory,
          payload: json,
        };
      } catch (error) {
        alert('addProductCategory: ' + error);
        return {
          type: GitAction.AddedProductCategory,
          payload: [],
        };
      }
    });

  ProductCategory_Update = (action$) =>
    action$.ofType(GitAction.UpdateProductCategory).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_UpdateProductCategory?PRODUCTCATEGORYID=" + payload.ProductCategoryID +
        "&PRODUCTCATEGORY=" + payload.ProductCategory +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_UpdateProductCategory?PRODUCTCATEGORYID=" + payload.ProductCategoryID +
          "&PRODUCTCATEGORY=" + payload.ProductCategory +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.UpdatedProductCategory,
          payload: json,
        };
      } catch (error) {
        alert('updateProductCategory: ' + error);
        return {
          type: GitAction.UpdatedProductCategory,
          payload: [],
        };
      }
    });

  ProductCategory_Delete = (action$) =>
    action$.ofType(GitAction.DeleteProductCategory).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_DeleteProductCategory?PRODUCTCATEGORYID=" + payload.ProductCategoryID +
        "&USERID=" + payload.UserID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_DeleteProductCategory?PRODUCTCATEGORYID=" + payload.ProductCategoryID +
          "&USERID=" + payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.DeletedProductCategory,
          payload: json,
        };
      } catch (error) {
        alert('deleteProductCategory: ' + error);
        return {
          type: GitAction.DeletedProductCategory,
          payload: [],
        };
      }
    });

  ProductCategory_ViewAll = (action$) =>
    action$.ofType(GitAction.GetProductCategory).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_CategoryListByAll?ProjectID=" + payload.ProjectID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_CategoryListByAll?ProjectID=" + payload.ProjectID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.GotProductCategory,
          payload: json,
        };
      } catch (error) {
        alert('getAllCategories: ' + error);
        return {
          type: GitAction.GotProductCategory,
          payload: [],
        };
      }
    });
    


  ///////////////////////////////////////////////////  sidebar configurations ///////////////////////////////////////////////////
  User_ViewPage = action$ =>
    action$.ofType(GitAction.FetchSidebar).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "User_ViewPage?" +
        "ROLEGROUPID=" + payload.ROLEGROUPID +
        "&USERID=" + payload.USERID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "User_ViewPage?" +
          "ROLEGROUPID=" + payload.ROLEGROUPID +
          "&USERID=" + payload.USERID
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.SidebarFetched,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: FetchSidebar")
        return {
          type: GitAction.SidebarFetched,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////  sidebar configurations ///////////////////////////////////////////////////



  ///////////////////////////////////////////////////    product details   ///////////////////////////////////////////////////



}
export let gitEpic = new GitEpic();


// "user manual": adding the api call backs here

// by get API
// User_ViewPage = action$ =>
//   action$.ofType(GitAction.FetchSidebar).switchMap(async ({ payload }) => {
//     // console.log(url +
//     //   double_click_and_paste_url_here
//     // )
//     try {
//       const response = await fetch(url +
//         "User_ViewPage?" +
//         "ROLEGROUPID=" + payload.ROLEGROUPID +
//         "&USERID=" + payload.USERID
//       );

//       let json = await response.json();
//       json = JSON.parse(json)
//       return {
//         type: GitAction.SidebarFetched,
//         payload: json,
//       };
//     }
//     catch (error) {
//       toast.error("Error Code: FetchSidebar")
//       return {
//         type: GitAction.SidebarFetched,
//         payload: [],
//       };
//     }
//   });

// by post API
// Inventory_UpdateStockDetailByPost = action$ =>
// action$.ofType(GitAction.UpdateStockDetailByPost).switchMap(async ({ payload }) => {

//   return fetch(
//     url + "Inventory_UpdateStockDetailByPost"
//     , {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         STOCKID: payload.StockID,
//         USERCODE: payload.UserCode,
//         TRACKINGNUMBER: payload.TrackingNumber,
//         PRODUCTWEIGHT: payload.ProductWeight,
//         PRODUCTHEIGHT: payload.ProductDimensionHeight,
//         PRODUCTWIDTH: payload.ProductDimensionWidth,
//         PRODUCTDEEP: payload.ProductDimensionDeep,
//         AREACODE: payload.AreaCode,
//         ITEM: payload.Item,
//         TRACKINGSTATUSID: payload.TRACKINGSTATUSID,
//         CONTAINERNAME: payload.ContainerName,

//         CONTAINERDATE: payload.ContainerDate,
//         REMARK: payload.Remark,
//         EXTRACHARGE: payload.AdditionalCharges
//       })
//     }
//   )
//     .then(response => response.json())
//     .then(json => {
//       if (json !== "fail") {
//         json = json;
//         toast.success("Successfully update stock. Fetching the latest data..", { autoClose: 3000 })
//       } else {
//         json = [];
//       }
//       return {
//         type: GitAction.UpdatedStockDetailByPost,
//         payload: json,
//       };
//     })
//     .catch(error => toast.error("Error code: 8003"));
// });