import React from "react";
import { BrowserRouter as Router} from "react-router-dom";
import Layout from '../components/sidebar/Layout';
import './App.scss';
import './App_modified.css';

/**
 * "user manual": basname will affect the routing
 * For example 
 * if put basename_setting as "/ABC", then it will render the url as "/ABC/Page_a"
 */
const basename_setting = "/ecommerceCMSDev" 
const App = () => (
  <Router basename={basename_setting}>
    <Layout />
  </Router>
);
export default App;
