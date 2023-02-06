import { toast } from "react-toastify";

import createHistory from 'history/createBrowserHistory'
const history = createHistory()
/**
 *   Documentation of this class methods
 *   @function setLogonUser => @param loginUser => @returns void
 *   @function isUserLogon =>  @returns bool
 *   @function updateLogonUser => @param key, @param value => @returns void
 *   @function resetLogonUser => void
 */

export const setLogonUser = (loginUser, sidebarItem, project, SLD, projectURL) => {
    if (typeof loginUser !== "undefined" && loginUser !== null) {
        try {
            localStorage.setItem("userToken", true);
            localStorage.setItem("loginUser", JSON.stringify(loginUser));
            localStorage.setItem("sidebarItem", JSON.stringify(sidebarItem));
            localStorage.setItem("project", project)
            localStorage.setItem("projectURL", projectURL)
            localStorage.setItem("projectDomain", project + "." + SLD)
            history.push("/")
            window.location.reload(false);
        }
        catch (e) {
            toast.error("Error: 1101: Unable to set login status. Please contact your software warehouse.")
        }
    }
    else {
        toast.error("Error: 1101.1: Unable to set login status. Passing parameter is empty or undefined.")
    }
}

export const setSidebaritems = () => {
    return localStorage.setItem("sidebarItem")
}

export const getSidebaritems = () => {
    return localStorage.getItem("sidebarItem")
}

export const isUserLogon = () => {
    // if want to bypass the auth, then uncomment this
    // return true
    return localStorage.getItem("loginUser") === null ? false : true

    // else we will go for normal operation with the function below
    // return (typeof localStorage.getItem("userToken") !== "undefined" && localStorage.getItem("userToken") !== null) ? true : false
}

export const resetLogonUser = () => {
    // let projectURL = localStorage.getItem("projectURL")
    let projectURL = ""
    if (JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID === 1)
        projectURL = "CMS.MCITC.my"
    else
        projectURL = localStorage.getItem("projectURL")

    localStorage.removeItem("userToken")
    localStorage.removeItem("loginUser")
    localStorage.removeItem("sidebarItem");
    localStorage.removeItem("DataSetDraft");
    localStorage.removeItem("promotionList");

    if (window.location.hostname === "localhost")
        window.location.href = "/" + projectURL + "/"
    else
        window.location.href = "/"
}

export const updateLogonUser = (key, value) => {
    localStorage.setItem(key, value);
}