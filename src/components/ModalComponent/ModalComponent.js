import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { isObjectUndefinedOrNull, isStringNullOrEmpty } from '../../tools/Helpers';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Draggable from 'react-draggable';
import Paper from '@mui/material/Paper';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#modal-component"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

/**
 *  @param {object} props 
 *  @param {bool} props.fullScreen 
*   @requires @param {function}  props.handleOnClose 
 *  @param {string} props.maxWidth "default: lg, value => sm | md | lg | xl "
 *  @param {bool} props.draggable
 *  
 */

export default function ModalComponent(props) {
  return (
    <Dialog
      fullScreen={props.fullScreen ? props.fullScreen : false}    //fullscreen modal
      maxWidth={isStringNullOrEmpty(props.maxWidth) ? "lg" : props.maxWidth}
      open={props.open}
      onClose={() => { typeof props.handleOnClose === "function" ? props.handleOnClose() : console.log("Dialog -> handleOnClose() required") }}
      PaperComponent={props.draggable === true ? PaperComponent : null}
      sx={{ zIndex: (props.fullScreen || props.maxWidth === "xl") ? 1301 : 1300 }}
      aria-labelledby="modal-component"
    >
      {
        props.fullScreen &&
        <AppBar sx={{ position: 'relative', bgcolor: (!isStringNullOrEmpty(props.fullScreenHeaderbgColor) ? props.fullScreenHeaderbgColor : "#252525") }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {props.title}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => { typeof props.handleOnClose === "function" ? props.handleOnClose() : console.log("Dialog -> handleOnClose() required") }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      }

      <DialogTitle id="modal-component" className="d-flex justify-content-between">
        {props.title}
        <IconButton sx={{ marginLeft: 'auto' }} onClick={() => { typeof props.handleOnClose === "function" ? props.handleOnClose() : console.log("Dialog -> handleOnClose() required") }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.children}
        </DialogContentText>
      </DialogContent>
      {
        !isObjectUndefinedOrNull(props.DialogActionsButton) &&
        <DialogActions>
          {props.DialogActionsButton}
        </DialogActions>
      }
    </Dialog>
  );
}
