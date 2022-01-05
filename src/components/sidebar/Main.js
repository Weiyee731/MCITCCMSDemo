import React from 'react';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import routes from './data/RouterConfiguration';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
const Main = ({
  collapsed,
  rtl,
  handleToggleSidebar,
  handleCollapsedChange,
  handleRtlChange,
  handleImageChange,
}) => {
  return (
    <main>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <MenuOutlinedIcon />
      </div>
      <PanelHeader />
      <div className="block ">
        <Switch>
          {
            routes.map((route, index) => {
              return (
                <Route key={index} path={route.path} exact={route.exact}>
                  {route.element}
                </Route>
              )
            })
          }
        </Switch>
      </div>
      <PanelFooter />
    </main>
  );
};

export default Main;