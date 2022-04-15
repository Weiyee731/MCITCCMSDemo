
const project = localStorage.getItem("project")
// const projectURL = localStorage.getItem("projectURL") 
const projectURL = "CMS.MCITC.my"
export const ServerConfiguration = {

    // https://cms.myemporia.my//eCommerceCMS/api/emporia/

    ServerUrl: "https://" + projectURL + "/eCommerceCMS/api/",
    // LoginUrl: "https:/" + projectURL + "/eCommerceCMS/api/",
    LoginUrl: "https://" + projectURL + "/eCommerceCMS/api/",
    LiveServerLoginUrl: "https:/eCommerceCMS/api/",
    LiveServerUrl: "http://localhost/TourismManagementAPI/TourismApi/api/TourismApi/",
    mediaUrl: "http://localhost/TourismManagementAPI/TourismApi/api/TourismApi/",
    filesUrl: "http://localhost/TourismManagementAPI/TourismApi/api/TourismApi/",

    // ServerUrl: "https://triviix.com/eCommerceCMS/api/",
    // LiveServerUrl: "http://localhost/TourismManagementAPI/TourismApi/api/TourismApi/",
    // mediaUrl: "http://localhost/TourismManagementAPI/TourismApi/api/TourismApi/",
    // filesUrl: "http://localhost/TourismManagementAPI/TourismApi/api/TourismApi/",
}