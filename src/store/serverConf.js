
const project = localStorage.getItem("project")
const projectURL = localStorage.getItem("projectURL")
export const ServerConfiguration = {


    ServerUrl: "https://" + projectURL + "/eCommerceCMS/api/",
    LoginUrl: "https:/" + window.location.pathname + "/eCommerceCMS/api/",
    LiveServerLoginUrl: "https:/eCommerceCMS/api/",
    LiveServerUrl: "http://localhost/TourismManagementAPI/TourismApi/api/TourismApi/",
    mediaUrl: "http://localhost/TourismManagementAPI/TourismApi/api/TourismApi/",
    filesUrl: "http://localhost/TourismManagementAPI/TourismApi/api/TourismApi/",

    // ServerUrl: "https://triviix.com/eCommerceCMS/api/",
    // LiveServerUrl: "http://localhost/TourismManagementAPI/TourismApi/api/TourismApi/",
    // mediaUrl: "http://localhost/TourismManagementAPI/TourismApi/api/TourismApi/",
    // filesUrl: "http://localhost/TourismManagementAPI/TourismApi/api/TourismApi/",
}