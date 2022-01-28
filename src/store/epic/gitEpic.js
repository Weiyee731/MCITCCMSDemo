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
const loginUrl = ServerConfiguration.LoginUrl;
const LiveServerLoginUrl = ServerConfiguration.LiveServerLoginUrl;

const project = window.localStorage.getItem("project")
// const project = "myemporia"
// const project = window.location.pathname.split(".")[1]

export class GitEpic {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////


  User_Login = action$ =>
    action$.ofType(GitAction.Login).switchMap(async ({ payload }) => {
      console.log(loginUrl + payload.ProjectDomainName + "/" +
        "User_Login?username=" +
        payload.username +
        "&password=" +
        payload.password +
        "&ProjectDomainName=" +
        payload.ProjectDomainName)
      try {
        const response = await fetch(
          loginUrl + payload.ProjectDomainName + "/" +
          "User_Login?username=" +
          payload.username +
          "&password=" +
          payload.password +
          "&ProjectDomainName=" +
          payload.ProjectDomainName
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.LoginSuccess,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: User_Login. Please check on URL")
        return {
          type: GitAction.LoginSuccess,
          payload: [],
        };
      }
    });



  User_LoginServer = action$ =>
    action$.ofType(GitAction.LoginServer).switchMap(async ({ payload }) => {
      console.log(LiveServerLoginUrl + payload.ProjectDomainName + "/" +
        "User_Login?username=" +
        payload.username +
        "&password=" +
        payload.password +
        "&ProjectDomainName=" +
        payload.ProjectDomainName)
      try {
        const response = await fetch(
          LiveServerLoginUrl + payload.ProjectDomainName + "/" +
          "User_Login?username=" +
          payload.username +
          "&password=" +
          payload.password +
          "&ProjectDomainName=" +
          payload.ProjectDomainName
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.LoginServerSuccess,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: User_Login. Please check on URL")
        return {
          type: GitAction.LoginServerSuccess,
          payload: [],
        };
      }
    });

  // User_Login = action$ =>
  //   action$.ofType(GitAction.Login).switchMap(async ({ payload }) => {
  //     try {
  //       console.log("CHECK1")
  //       console.log(
  //         loginUrl + payload.ProjectDomainName + "/" +
  //         "User_Login?username=" +
  //         payload.username +
  //         "&password=" +
  //         payload.password +
  //         "&ProjectDomainName=" +
  //         payload.ProjectDomainName
  //       )
  //       const response = await fetch(
  //         loginUrl  + payload.ProjectDomainName + "/" +
  //         "User_Login?username=" +
  //         payload.username +
  //         "&password=" +
  //         payload.password +
  //         "&ProjectDomainName=" +
  //         payload.ProjectDomainName
  //       );
  //       console.log("json", response.json())
  //       console.log("json1", response)
  //       console.log("json2", await response.json())
  //       let json = await response.json();
  //       console.log("json")

  //       return {
  //         type: GitAction.LoginSuccess,
  //         payload: JSON.parse(json),
  //       };
  //     }
  //     catch (error) {
  //       toast.error("Error Code: User_Login. Please check on URL")
  //       return {
  //         type: GitAction.LoginSuccess,
  //         payload: [],
  //       };
  //     }
  //   });

  // User_LoginServer = action$ =>
  //   action$.ofType(GitAction.LoginServer).switchMap(async ({ payload }) => {

  //     try {
  //       console.log(LiveServerLoginUrl
  //         + payload.ProjectDomainName + "/" +
  //         "User_Login?username=" +
  //         payload.username +
  //         "&password=" +
  //         payload.password +
  //         "&ProjectDomainName=" +
  //         payload.ProjectDomainName)

  //       const response = await fetch(
  //         LiveServerLoginUrl
  //         + payload.ProjectDomainName + "/" +
  //         "User_Login?username=" +
  //         payload.username +
  //         "&password=" +
  //         payload.password +
  //         "&ProjectDomainName=" +
  //         payload.ProjectDomainName
  //       );

  //       console.log("json", response.json())
  //       console.log("json1", response)
  //       console.log("json2", await response.json())
  //       let json = await response.json();
  //       console.log("json", json)

  //       return {
  //         type: GitAction.LoginServerSuccess,
  //         payload: JSON.parse(json),
  //       };
  //     }
  //     catch (error) {
  //       toast.error("Error Code: User_Login. Please check on URL")
  //       return {
  //         type: GitAction.LoginServerSuccess,
  //         payload: [],
  //       };
  //     }
  //   });

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

  User_UpdateProfileStatus = (action$) =>
    action$.ofType(GitAction.UpdateUserStatus).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "User_UpdateProfileStatus?USERID=" + payload.USERID +
        "&USERSTATUS=" + payload.USERSTATUS
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "User_UpdateProfileStatus?USERID=" + payload.USERID +
          "&USERSTATUS=" + payload.USERSTATUS
        );
        let json = await response.json();
        json = JSON.parse(json);
        console.log("this. json", json)
        if (json.map((val) => val.ReturnVal === 1)) {
          toast.success("Updated Successful");
        }
        return {
          type: GitAction.UpdatedUserStatus,
          payload: json,
        };
      } catch (error) {
        alert('UpdateUserProfileStatus: ' + error);
        return {
          type: GitAction.UpdatedUserStatus,
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


  Shop_UpdateDetails = (action$) =>
    action$.ofType(GitAction.UpdateShopDetail).switchMap(async ({ payload }) => {

      console.log(
        url + project + "/" +
        "User_UpdateShopDetail?USERID=" + payload.USERID +
        "&SHOPNAME=" + payload.SHOPNAME +
        "&SHOPDESC=" + payload.SHOPDESC +
        "&SHOPPOSCODE=" + payload.SHOPPOSCODE +
        "&SHOPCITY=" + payload.SHOPCITY +
        "&SHOPSTATE=" + payload.SHOPSTATE +
        "&SHOPCOUNTRYID=" + payload.SHOPCOUNTRYID

      )
      try {
        const response = await fetch(
          url + project + "/" +
          "User_UpdateShopDetail?USERID=" + payload.USERID +
          "&SHOPNAME=" + payload.SHOPNAME +
          "&SHOPDESC=" + payload.SHOPDESC +
          "&SHOPPOSCODE=" + payload.SHOPPOSCODE +
          "&SHOPCITY=" + payload.SHOPCITY +
          "&SHOPSTATE=" + payload.SHOPSTATE +
          "&SHOPCOUNTRYID=" + payload.SHOPCOUNTRYID
        );
        let json = await response.json();
        console.log("json", json)
        json = JSON.parse(json);
        if (json.map((val) => val.ReturnVal === 1)) {
          toast.success("Upload Successful");
        }
        return {
          type: GitAction.UpdatedShopDetail,
          payload: json,
        };
      } catch (error) {
        alert('UpdatedShopDetail: ' + error);
        return {
          type: GitAction.UpdatedShopDetail,
          payload: [],
        };
      }
    });

  Shop_UpdateProfileImage = (action$) =>
    action$.ofType(GitAction.UpdateProfileImage).switchMap(async ({ payload }) => {
      console.log(url + project + "/" +
        "User_UserUpdatePhoto?USERID=" +
        payload.USERID +
        "&TYPE=" +
        payload.TYPE +
        "&USERPROFILEIMAGE=" +
        payload.USERPROFILEIMAGE)
      try {
        const response = await fetch(
          url + project + "/" +
          "User_UserUpdatePhoto?USERID=" +
          payload.USERID +
          "&TYPE=" +
          payload.TYPE +
          "&USERPROFILEIMAGE=" +
          payload.USERPROFILEIMAGE
        );
        let json = await response.json();
        console.log("json")
        json = JSON.parse(json);

        if (json.map((val) => val.ReturnVal === 1)) {
          toast.success("Upload Successful");
        }
        return {
          type: GitAction.UpdatedProfileImage,
          payload: json,
        };
      } catch (error) {
        alert('updateProfileImage: ' + error);
        return {
          type: GitAction.UpdatedProfileImage,
          payload: [],
        };
      }
    });

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

  Order_UpdateUserDetails = (action$) =>
    action$.ofType(GitAction.OrderUserDetailsUpdate).switchMap(async ({ payload }) => {
      console.log(url + project + "/" +
        "Order_UpdateOrderUserDetails?OrderID=" + payload.OrderID +
        "&FirstName=" + payload.FirstName +
        "&LastName=" + payload.LastName +
        "&UserContactNo=" + payload.UserContactNo +
        "&PickUpInd=" + payload.PickUpInd +
        "&UserEmailAddress=" + payload.UserEmailAddress +
        "&UserAddressLine1=" + payload.UserAddressLine1 +
        "&UserAddressLine2=" + payload.UserAddressLine2 +
        "&UserPoscode=" + payload.UserPoscode +
        "&UserState=" + payload.UserState +
        "&UserCity=" + payload.UserCity +
        "&CountryID=" + payload.CountryID)
      try {
        const response = await fetch(
          url + project + "/" +
          "Order_UpdateOrderUserDetails?OrderID=" + payload.OrderID +
          "&FirstName=" + payload.FirstName +
          "&LastName=" + payload.LastName +
          "&UserContactNo=" + payload.UserContactNo +
          "&PickUpInd=" + payload.PickUpInd +
          "&UserEmailAddress=" + payload.UserEmailAddress +
          "&UserAddressLine1=" + payload.UserAddressLine1 +
          "&UserAddressLine2=" + payload.UserAddressLine2 +
          "&UserPoscode=" + payload.UserPoscode +
          "&UserState=" + payload.UserState +
          "&UserCity=" + payload.UserCity +
          "&CountryID=" + payload.CountryID
        );
        let json = await response.json();
        json = JSON.parse(json);

        return {
          type: GitAction.OrderUserDetailsUpdated,
          payload: json,
        };
      }
      catch (error) {
        alert('OrderUserDetailsUpdate: ' + error);
        return {
          type: GitAction.OrderUserDetailsUpdated,
          payload: [],
        };
      }
    });

  Transaction_ViewStatus = (action$) =>
    action$.ofType(GitAction.GetTransactionStatus).switchMap(async () => {
      try {
        const response = await fetch(
          url + project + "/" +
          "Order_ViewOrderStatus"
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.GotTransactionStatus,
          payload: json,
        };
      } catch (error) {
        alert('getAllTransactionStatus: ' + error);
        return {
          type: GitAction.GotTransactionStatus,
          payload: []
        };
      }
    });

  Order_UpdateTrackingNumber = (action$) =>
    action$.ofType(GitAction.updateTrackingNumber).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(
          url + project + "/" +
          "Order_UpdateTrackingNumber?ORDERTRACKINGNUMBER=" + payload.ORDERTRACKINGNUMBER +
          "&LOGISTICID=" + payload.LOGISTICID +
          "&ORDERPRODUCTDETAILSID=" + payload.ORDERPRODUCTDETAILSID
        );
        let json = await response.json();
        json = JSON.parse(json);
        console.log("JSON", json)
        if (json[0].ReturnVal === 1)
          toast.success("Logistic Data is successfully Updated")
        return {
          type: GitAction.updatedTrackingNumber,
          payload: json,
        };
      } catch (error) {
        alert('getDeliverableList: ' + error);
        return {
          type: GitAction.updatedTrackingNumber,
          payload: [],
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

  Merchants_ViewAllOrder = (action$) =>
    action$.ofType(GitAction.GetMerchantOrders).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(
          url + project + "/" +
          "Order_ViewOrderByUserID?TRACKINGSTATUS=" +
          payload.trackingStatus +
          "&USERID=" +
          payload.UserID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.GotMerchantOrders,
          payload: json,
        };
      } catch (error) {
        alert('getAllMerchantOrders: ' + error);
        return {
          type: GitAction.GotMerchantOrders,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////  Products  ///////////////////////////////////////////////////

  Product_Add = (action$) =>
    action$.ofType(GitAction.AddProduct).switchMap(async ({ payload }) => {

      console.log("CHECK THIS IS PAYLOAD", payload)
      console.log("CHECK THIS IS PAYLOAD", payload.ProjectID)
      return fetch(
        url + project + "/Product_AddProductByPost"
        , {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            PRODUCTNAME: payload.name,
            PROJECTID: payload.ProjectID,
            MERCHANTID: payload.productSupplier,
            PRODUCTDESC: payload.description,
            PRODUCTCATEGORYID: payload.productCategory,
            PRODUCTHEIGHT: payload.height,
            PRODUCTWIDTH: payload.width,
            PRODUCTDEPTH: payload.depth,
            PRODUCTWEIGHT: payload.weight,
            PRODUCTSKU: payload.sku,
            PRODUCTBRAND: payload.brand,

            PRODUCTMODEL: payload.model,
            PRODUCTTAG: payload.tags,
            USERID: payload.UserID
          })
        }
      )
        .then(response => response.json())
        .then(json => {
          json = json;
          console.log("json", json)
          // if (json !== "fail") {
          //   json = json;
          //   // toast.success("Successfully update stock. Fetching the latest data..", { autoClose: 3000 })
          // } else {
          //   json = [];
          // }
          return {
            type: GitAction.AddedProduct,
            payload: json,
          };
        })
        .catch(error => alert('addProduct: ' + error));
    });


  Product_Update = (action$) =>
    action$.ofType(GitAction.UpdateProduct).switchMap(async ({ payload }) => {

      return fetch(
        url + project + "/Product_UpdateProductByPost"
        , {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            PRODUCTID: payload.ProductID,
            PRODUCTNAME: payload.name,
            PROJECTID: payload.ProjectID,
            MERCHANTID: payload.productSupplier,
            PRODUCTDESC: payload.description,
            PRODUCTCATEGORYID: payload.productCategory,
            PRODUCTHEIGHT: payload.height,
            PRODUCTWIDTH: payload.width,
            PRODUCTDEPTH: payload.depth,
            PRODUCTWEIGHT: payload.weight,
            PRODUCTSKU: payload.sku,
            PRODUCTBRAND: payload.brand,

            PRODUCTMODEL: payload.model,
            PRODUCTTAG: payload.tags,
            USERID: payload.UserID
          })
        }
      )
        .then(response => response.json())
        .then(json => {
          json = json;
          // if (json !== "fail") {
          //   json = json;
          //   // toast.success("Successfully update stock. Fetching the latest data..", { autoClose: 3000 })
          // } else {
          //   json = [];
          // }
          return {
            type: GitAction.UpdatedProduct,
            payload: json,
          };
        })
        .catch(error => alert('UpdateProduct: ' + error));
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

  Product_ViewListing = (action$) =>
    action$.ofType(GitAction.GetProductListing).switchMap(async ({ payload }) => {
      console.log(url + project + "/" +
        "Product_ItemListByType?Type=" + payload.type +
        "&TypeValue=" + payload.typeValue +
        "&USERID=" + payload.userId +
        "&PRODUCTPERPAGE=" + payload.productPage +
        "&PAGE=" + payload.page +
        "&ProjectID=" + payload.ProjectID)

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
        // console.log("json", json)
        return {
          type: GitAction.GotProductListing,
          payload: json,
        };
      } catch (error) {
        alert('getProductsListing: ' + error);
        return {
          type: GitAction.GotProductListing,
          payload: [],
        };
      }
    });

  Product_ViewDetail = (action$) =>
    action$.ofType(GitAction.GetProductDetail).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_ItemDetailByProductID?ProductID=" + payload.productId +
        "&USERID=" + payload.userId +
        "&ProjectID=" + payload.ProjectID
      )
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_ItemDetailByProductID?ProductID=" + payload.productId +
          "&USERID=" + payload.userId +
          "&ProjectID=" + payload.ProjectID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.GotProductDetail,
          payload: json,
        };
      } catch (error) {
        alert('getProductDetail: ' + error);
        return {
          type: GitAction.GotProductDetail,
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

  Product_CheckDuplicateName = (action$) =>
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


  Product_CheckDuplicateSKU = (action$) =>
    action$.ofType(GitAction.CheckProductSKU).switchMap(async ({ payload }) => {
      console.log(
        url + project + "/" +
        "Product_CheckDuplicationBySKU?PRODUCTSKU=" + payload.ProductSKU +
        "&USERID=" + payload.UserID +
        "&PROJECTID=" + payload.ProjectID
      )
      try {
        const resposne = await fetch(
          url + project + "/" +
          "Product_CheckDuplicationBySKU?PRODUCTSKU=" + payload.ProductSKU +
          "&USERID=" + payload.UserID +
          "&PROJECTID=" + payload.ProjectID
        );
        let json = await resposne.json();
        if (json !== "fail") {
          json = JSON.parse(json);
        } else {
          json = [];
        }
        return {
          type: GitAction.ProductCheckedSKU,
          payload: json,
        };
      } catch (error) {
        alert('checkProductSKU: ' + error);
        return {
          type: GitAction.ProductCheckedSKU,
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

  ProductVariationDetail_ViewAllByCategoryID = (action$) =>
    action$.ofType(GitAction.GetProductVariationByCategoryID).switchMap(async ({ payload }) => {

      console.log(url + project + "/" +
        "Product_ViewProductVariationByCategoryID?PRODUCTCATEGORYID=" + payload)
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_ViewProductVariationByCategoryID?PRODUCTCATEGORYID=" + payload
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.GotProductVariationByCategoryID,
          payload: json,
        };
      } catch (error) {
        alert('getAllProductVariationByCategoryID: ' + error);
        return {
          type: GitAction.GotProductVariationByCategoryID,
          payload: [],
        };
      }
    });


  ///////////////////////////////////////////////////  Product Stock  ///////////////////////////////////////////////////

  // ProductVariationStock_Update = (action$) =>
  //   action$.ofType(GitAction.UpdateProductVariationStock).switchMap(async ({ payload }) => {
  //     try {
  //       const response = await fetch(
  //         url + project + "/" +
  //         "Product_UpdateProductStockVariation?PRODUCTVARIATIONDETAILID=" + payload.ProductVariationDetailID +
  //         "&PRODUCTSTOCK=" + payload.stock
  //       );
  //       let json = await response.json();
  //       json = JSON.parse(json);
  //       if (json[0].ReturnVal === 1)
  //         toast.success("Variation stock updated successfully")

  //       try {
  //         const response = await fetch(
  //           url + project + "/" +
  //           "Product_ItemDetailByProductID?ProductID=" + payload.productId +
  //           "&USERID=" + payload.userId +
  //           "&ProjectID=" + payload.ProjectID
  //         );
  //         let json2 = await response.json();
  //         json2 = JSON.parse(json2);
  //         return {
  //           type: GitAction.UpdatedProductVariationStock,
  //           payloadProduct: json2,
  //           payload: json,
  //         };
  //       } catch (error) {
  //         alert('UpdatedProductVariationStock: ' + error);
  //         return {
  //           type: GitAction.UpdatedProductVariationStock,
  //           payload: [],
  //         };
  //       }

  //     } catch (error) {
  //       alert('updateProductVariationStock: ' + error);
  //       return {
  //         type: GitAction.UpdatedProductVariationStock,
  //         payload: [],
  //       };
  //     }
  //   });

  ProductVariationStock_Add = (action$) =>
    action$.ofType(GitAction.AddProductVariationStock).switchMap(async ({ payload }) => {
      console.log(url + project + "/" +
        "Product_AddProductVariationStock?COINTAINERID=" + payload.ContainerID +
        "&USERID=" + payload.UserID +
        "&PRODUCTVARIATIONDETAILID=" + payload.ProductVariationDetailsID +
        "&PRODUCTSTOCK=" + payload.ProductStock +
        "&PRODUCTVARIATIONCOST=" + payload.ProductVariationCost +
        "&GRIDSTORAGEID=" + payload.GridStorageID)
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_AddProductVariationStock?COINTAINERID=" + payload.ContainerID +
          "&USERID=" + payload.UserID +
          "&PRODUCTVARIATIONDETAILID=" + payload.ProductVariationDetailsID +
          "&PRODUCTSTOCK=" + payload.ProductStock +
          "&PRODUCTVARIATIONCOST=" + payload.ProductVariationCost +
          "&GRIDSTORAGEID=" + payload.GridStorageID
        );
        let json = await response.json();
        json = JSON.parse(json);
        if (json[0].ReturnVal === 1)
          toast.success("Variation stock added successfully")

        return {
          type: GitAction.AddedProductVariationStock,
          payload: json,
        };
      } catch (error) {
        alert('AddProductVariationStock: ' + error);
        return {
          type: GitAction.AddedProductVariationStock,
          payload: [],
        };
      }
    });

  ProductVariationStock_View = (action$) =>
    action$.ofType(GitAction.ViewProductVariationStock).switchMap(async ({ payload }) => {
      console.log(url + project + "/" +
        "Product_ItemListWithVariation?PROJECTID=" + payload.ProjectID +
        "&PRODUCTPERPAGE=" + payload.ProductPerPage +
        "&PAGE=" + payload.Page)
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_ItemListWithVariation?PROJECTID=" + payload.ProjectID +
          "&PRODUCTPERPAGE=" + payload.ProductPerPage +
          "&PAGE=" + payload.Page
        );
        let json = await response.json();
        console.log("json", json)
        json = JSON.parse(json);
        return {
          type: GitAction.ViewedProductVariationStock,
          payload: json,
        };
      } catch (error) {
        alert('ViewProductVariationStock: ' + error);
        return {
          type: GitAction.ViewedProductVariationStock,
          payload: [],
        };
      }
    });

  ProductVariationStock_ViewAll = (action$) =>
    action$.ofType(GitAction.ViewProductVariationStockWithID).switchMap(async ({ payload }) => {
      try {
        console.log(
          url + project + "/" +
          "Product_ItemListWithProductVariationStock?PROJECTID=" + payload.ProjectID +
          "&PRODUCTID=" + payload.ProductID +
          "&PRODUCTPERPAGE=" + payload.ProductPerPage +
          "&PAGE=" + payload.Page
        )
        const response = await fetch(
          url + project + "/" +
          "Product_ItemListWithProductVariationStock?PROJECTID=" + payload.ProjectID +
          "&PRODUCTID=" + payload.ProductID +
          "&PRODUCTPERPAGE=" + payload.ProductPerPage +
          "&PAGE=" + payload.Page
        );
        let json = await response.json();
        console.log("json", json)
        json = JSON.parse(json);
        return {
          type: GitAction.ViewedProductVariationStockWithID,
          payload: json,
        };
      } catch (error) {
        alert('ViewProductVariationStockWithID: ' + error);
        return {
          type: GitAction.ViewedProductVariationStockWithID,
          payload: [],
        };
      }
    });

  // List All added Variation Stock
  ProductVariationStock_ViewWithVariationDetailsID = (action$) =>
    action$.ofType(GitAction.ViewProductVariationStockWithVariationDetailsID).switchMap(async ({ payload }) => {
      try {
        console.log(
          url + project + "/" +
          "Product_ItemListWithProductVariationStockDetailList?PRODUCTVARIATIONDETAILID=" + payload.ProductVariationDetailID
        )
        const response = await fetch(
          url + project + "/" +
          "Product_ItemListWithProductVariationStockDetailList?PRODUCTVARIATIONDETAILID=" + payload.ProductVariationDetailID
        );
        let json = await response.json();
        console.log("json", json)
        json = JSON.parse(json);
        return {
          type: GitAction.ViewedProductVariationStockWithVariationDetailsID,
          payload: json,
        };
      } catch (error) {
        alert('ViewProductVariationStockWithVariationDetailsID: ' + error);
        return {
          type: GitAction.ViewedProductVariationStockWithVariationDetailsID,
          payload: [],
        };
      }
    });

  ProductVariationStock_UpdateDetails = (action$) =>
    action$.ofType(GitAction.UpdateProductVariationStockDetails).switchMap(async ({ payload }) => {
      try {
        console.log(
          url + project + "/" +
          "Product_UpdateProductVariationStock?PRODUCTVARIATIONSTOCKID=" + payload.ProductVariationStockID +
          "&USERID=" + payload.UserID +
          "&APPROVEDBY=" + payload.ApprovedBy +
          "&PRODUCTSTOCK=" + payload.ProductStock +
          "&PRODUCTVARIATIONCOST=" + payload.ProductVariationCost +
          "&GRIDSTORAGEID=" + payload.GridStorage
        )
        const response = await fetch(
          url + project + "/" +
          "Product_UpdateProductVariationStock?PRODUCTVARIATIONSTOCKID=" + payload.ProductVariationStockID +
          "&USERID=" + payload.UserID +
          "&APPROVEDBY=" + payload.ApprovedBy +
          "&PRODUCTSTOCK=" + payload.ProductStock +
          "&PRODUCTVARIATIONCOST=" + payload.ProductVariationCost +
          "&GRIDSTORAGEID=" + payload.GridStorage
        );
        let json = await response.json();
        console.log("json", json)
        json = JSON.parse(json);
        return {
          type: GitAction.UpdatedProductVariationStockDetails,
          payload: json,
        };
      } catch (error) {
        alert('UpdateProductVariationStockDetails: ' + error);
        return {
          type: GitAction.UpdatedProductVariationStockDetails,
          payload: [],
        };
      }
    });

  ProductVariationStock_Delete = (action$) =>
    action$.ofType(GitAction.DeleteProductVariationStock).switchMap(async ({ payload }) => {
      try {
        console.log(
          url + project + "/" +
          "Product_DeleteProductVariationStock?PRODUCTVARIATIONSTOCKID=" + payload.ProductVariationStockID +
          "&USERID=" + payload.UserID +
          "&APPROVEDBY=" + payload.ApprovedBy
        )
        const response = await fetch(
          url + project + "/" +
          "Product_DeleteProductVariationStock?PRODUCTVARIATIONSTOCKID=" + payload.ProductVariationStockID +
          "&USERID=" + payload.UserID +
          "&APPROVEDBY=" + payload.ApprovedBy
        );

        let json = await response.json();
        console.log("json", json)
        json = JSON.parse(json);
        return {
          type: GitAction.DeletedProductVariationStock,
          payload: json,
        };
      } catch (error) {
        alert('DeletedProductVariationStock: ' + error);
        return {
          type: GitAction.DeletedProductVariationStock,
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

        console.log("json", json)
        // json = JSON.parse(json);
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

        return {
          type: GitAction.GotProductCategory,
          payload: JSON.parse(json),
        };
      } catch (error) {
        alert('getAllCategories: ' + error);
        return {
          type: GitAction.GotProductCategory,
          payload: [],
        };
      }
    });


  ProductCategory_ViewAllWithParent = (action$) =>
    action$.ofType(GitAction.GetProductCategoryListing).switchMap(async (payload) => {
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_CategoryListing?ProjectID=" + payload.ProjectID
        );
        let json = await response.json();
        return {
          type: GitAction.GotProductCategoryListing,
          payload: JSON.parse(json),
        };
      } catch (error) {
        alert('getAllCategoriesListing123: ' + error);
        return {
          type: GitAction.GotProductCategoryListing,
          payload: [],
        };
      }
    });


  ///////////////////////////////////////////////////  Product Review ///////////////////////////////////////////////////

  ProductReview_ViewByID = (action$) =>
    action$.ofType(GitAction.GetProductReviewByProductID).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_ViewReviewByProductID?PRODUCTID=" +
          payload.ProductID +
          "&PARENTPRODUCTREVIEWID=" +
          payload.ParentProductReviewID
        );
        let json = await response.json();
        return {
          type: GitAction.GotProductReviewByProductID,
          payload: json,
        };
      } catch (error) {
        alert('viewProductReviewByProductID: ' + error);
        return {
          type: GitAction.GotProductReviewByProductID,
          payload: [],
        };
      }
    });

  ProductReview_Add = (action$) =>
    action$.ofType(GitAction.addProductReview).switchMap(async ({ payload }) => {
      console.log(url + project + "/" +
        "Product_AddReview?PARENTPRODUCTREVIEWID=" + payload.parentProductReviewID
        + "&PRODUCTID=" + payload.productID
        + "&USERID=" + payload.UserID
        + "&PRODUCTREVIEWRATING=" + payload.productReviewRating
        + "&PRODUCTREVIEWCOMMENT=" + payload.productReviewComment
        + "&REPLYPARENTID=" + payload.replyParentID)
      try {
        const response = await fetch(
          url + project + "/" +
          "Product_AddReview?PARENTPRODUCTREVIEWID=" + payload.parentProductReviewID
          + "&PRODUCTID=" + payload.productID
          + "&USERID=" + payload.UserID
          + "&PRODUCTREVIEWRATING=" + payload.productReviewRating
          + "&PRODUCTREVIEWCOMMENT=" + payload.productReviewComment
          + "&REPLYPARENTID=" + payload.replyParentID
        );
        let json = await response.json();
        json = JSON.parse(json);
        console.log("json add review", json)
        if (json[0].ReturnVal === 1) {
          toast.success("Sucessfully send a review");
        }
        try {

          console.log(url + project + "/" +
            "Product_ViewReviewByProductID?PRODUCTID=" + payload.productID +
            "&PARENTPRODUCTREVIEWID=0")
          const response_1 = await fetch(
            url + project + "/" +
            "Product_ViewReviewByProductID?PRODUCTID=" + payload.productID +
            "&PARENTPRODUCTREVIEWID=0"
          );
          let json_1 = await response_1.json();
          return {
            type: GitAction.addedProductReview,
            payload: json_1,
            payload2: json,
          };
        } catch (error) {
          alert('viewProductReviewByProductID: ' + error);
          return {
            type: GitAction.addedProductReview,
            payload: [],
          };
        }
      } catch (error) {
        alert('addProductReview: ' + error);
        return {
          type: GitAction.addedProductReview,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////  Promotion  ///////////////////////////////////////////////////

  Promotion_ViewAll = (action$) =>
    action$.ofType(GitAction.GetPromotion).switchMap(async () => {
      console.log(
        url + project + "/" +
        "Promo_ViewPromotion?ACTIVEIND")
      try {
        const response = await fetch(
          url + project + "/" +
          "Promo_ViewPromotion?ACTIVEIND"
        );
        let json = await response.json();
        json = JSON.parse(json);

        console.log("JSON", json)
        return {
          type: GitAction.GotPromotion,
          payload: json,
        };
      } catch (error) {
        alert('getAllPromotion: ' + error);
        return {
          type: GitAction.GotPromotion,
          payload: [],
        };
      }
    });

  Promotion_Add = (action$) =>
    action$.ofType(GitAction.AddPromotion).switchMap(async ({ payload }) => {
      console.log(url + project + "/" +
        "Promo_AddPromotion?PROMOTIONTITLE=" +
        payload.PromotionTitle +
        "&PROMOTIONDESC=" +
        payload.PromotionDesc +
        "&PROMOTIONSTARTDATE=" +
        payload.PromotionStartDate +
        "&PROMOTIONDISCOUNTPERCENTAGE=" +
        payload.DiscountPercentage +
        "&BANNERIMAGE=" +
        payload.BannerImage +
        "&SLIDEORDER=" +
        payload.SlideOrder +
        "&PROMOTIONENDDATE=" +
        payload.PromotionEndDate +
        "&PRODUCTID=" +
        payload.ProductID +
        "&ProjectID=" + payload.ProjectID)
      try {
        const response = await fetch(
          url + project + "/" +
          "Promo_AddPromotion?PROMOTIONTITLE=" + payload.PromotionTitle +
          "&PROMOTIONDESC=" + payload.PromotionDesc +
          "&PROMOTIONSTARTDATE=" + payload.PromotionStartDate +
          "&PROMOTIONDISCOUNTPERCENTAGE=" + payload.DiscountPercentage +
          "&BANNERIMAGE=" + payload.BannerImage +
          "&SLIDEORDER=" + payload.SlideOrder +
          "&PROMOTIONENDDATE=" + payload.PromotionEndDate +
          "&PRODUCTID=" + payload.ProductID +
          "&ProjectID=" + payload.ProjectID
        );

        let json = await response.json();
        json = JSON.parse(json);

        console.log("json", json)
        return {
          type: GitAction.AddedPromotion,
          payload: json,
        };
      } catch (error) {
        alert('AddPromotion: ' + error);
        return {
          type: GitAction.AddedPromotion,
          payload: []
        };
      }
    });

  Promotion_Update = (action$) =>
    action$.ofType(GitAction.UpdatePromotion).switchMap(async ({ payload }) => {
      console.log(url + project + "/" +
        "Promo_UpdatePromotion?PROMOTIONID=" + payload.PromotionID +
        "&PROMOTIONTITLE=" + payload.PromotionTitle +
        "&PROMOTIONDESC=" + payload.PromotionDesc +
        "&BANNERIMAGE=" + payload.BannerImage +
        "&SLIDEORDER=" + payload.SlideOrder +
        "&PROMOTIONSTARTDATE=" + payload.promoStart +
        "&PROMOTIONENDDATE=" + payload.promoEnd +
        "&PROMOTIONITEMID=" + payload.ProductID +
        "&PROMOTIONDISCOUNTPERCENTAGE=" + payload.DiscountPercentage)
      try {
        const response = await fetch(
          url + project + "/" +
          "Promo_UpdatePromotion?PROMOTIONID=" + payload.PromotionID +
          "&PROMOTIONTITLE=" + payload.PromotionTitle +
          "&PROMOTIONDESC=" + payload.PromotionDesc +
          "&BANNERIMAGE=" + payload.BannerImage +
          "&SLIDEORDER=" + payload.SlideOrder +
          "&PROMOTIONSTARTDATE=" + payload.promoStart +
          "&PROMOTIONENDDATE=" + payload.promoEnd +
          "&PROMOTIONITEMID=" + payload.ProductID +
          "&PROMOTIONDISCOUNTPERCENTAGE=" + payload.DiscountPercentage // {98,99,100}
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.UpdatedPromotion,
          payload: json,
        };
      } catch (error) {
        alert('UpdatePromotion: ' + error);
        return {
          type: GitAction.UpdatedPromotion,
          payload: []
        };
      }
    });

  Promotion_Delete = (action$) =>
    action$.ofType(GitAction.DeletePromotion).switchMap(async ({ payload }) => {
      console.log(url + project + "/" +
        "Promo_DeletePromotion?PROMOTIONID=" + payload.PromotionID)
      try {
        const response = await fetch(
          url + project + "/" +
          "Promo_DeletePromotion?PROMOTIONID=" + payload.PromotionID
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.DeletedPromotion,
          payload: json,
        };
      } catch (error) {
        alert('DeletePromotion: ' + error);
        return {
          type: GitAction.DeletedPromotion,
          payload: []
        };
      }
    });


  ///////////////////////////////////////////////////  General   ///////////////////////////////////////////////////

  CourierService_ViewAll = (action$) =>
    action$.ofType(GitAction.GetCourierService).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(
          url + project + "/" +
          "User_ViewCourierService"
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.GotCourierService,
          payload: json,
        };

      } catch (error) {
        alert('getAllCourierService: ' + error);
        return {
          type: GitAction.GotCourierService,
          payload: [],
        };
      }
    });

  Country_ViewAll = (action$) =>
    action$.ofType(GitAction.GetCountry).switchMap(async () => {
      try {
        const response = await fetch(
          url + project + "/" +
          "General_CountryList"
        );
        let json = await response.json();
        json = JSON.parse(json);
        return {
          type: GitAction.GotCountry,
          payload: json,
        };
      } catch (error) {
        alert('getCountry: ' + error);
        return {
          type: GitAction.GotCountry,
          payload: [],
        };
      }
    });

  Storage_GridStorageList = (action$) =>
    action$.ofType(GitAction.GetStorage).switchMap(async ({ payload }) => {
      console.log(url + project + "/" +
        "Storage_GridStorageList?PROJECTID=" + payload.ProjectID)
      try {
        const response = await fetch(
          url + project + "/" +
          "Storage_GridStorageList?PROJECTID=" + payload.ProjectID
        );
        let json = await response.json();
        json = JSON.parse(json);
        console.log("GetStorage", json)

        return {
          type: GitAction.GotStorage,
          payload: json,
        };
      } catch (error) {
        alert('GetStorage: ' + error);
        return {
          type: GitAction.GotStorage,
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