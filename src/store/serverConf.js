const project = localStorage.getItem("project")
// const projectURL = "cms.myemporia.my" //Listra use this temporary as the localStorage unable to get it on my machine
const projectURL = localStorage.getItem("projectURL")
const loginProjectURL = window.location.hostname === "localhost" ? window.location.pathname.split("/")[1] : window.location.hostname.split(".")[1]
const URLtype = "/eCommerceCMS/"

export const ServerConfiguration = {
    ServerUrl: "https://" + projectURL + "/eCommerceCMS/api/",
    LoginUrl: "https://" + loginProjectURL + URLtype + "api/",
    DevServerUrl: "https://" + projectURL + URLtype + "api/",
    LiveServerLoginUrl: "https://cms.myemporia.my" + URLtype + "api/",
}
