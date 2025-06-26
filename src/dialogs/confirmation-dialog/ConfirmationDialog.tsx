import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import reducer from './store/index';
import withReducer from '../../store/withReducer';
import { closeConfirmationDialog } from '../../store/slices/confirmationSlice';

const ConfirmationDialog = () => {
    const dispatch = useDispatch();
    const confirmationDialog = useSelector((state: any) => state.confirmation.confirmationDialog);
    const data = confirmationDialog?.data;
    
    if (!data) {
        return null;
    }
  
    const { onAgree, dialogContent, titleContent, agreeText, disagreeText, onDisagree } = data;
  
    const handleCloseConfirmationDialog = () => {
        if (onDisagree) {
            onDisagree();
        }
        dispatch(closeConfirmationDialog());
    }
  
    const handleAgree = () => {
        onAgree();
        handleCloseConfirmationDialog();
    }
  
    return (
        <Dialog
            {...confirmationDialog.props}
            onClose={handleCloseConfirmationDialog}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                style: { maxWidth: '500px', margin: 'auto', borderRadius: "9px" },
            }}
        >
            <DialogTitle id="alert-dialog-title">{titleContent}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{dialogContent}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseConfirmationDialog} color="secondary">
                    {disagreeText}
                </Button>
                <Button onClick={handleAgree} color="primary" autoFocus>
                    {agreeText}
                </Button>
            </DialogActions>
        </Dialog>
    );
  }

  export default withReducer("confirmation", reducer)(ConfirmationDialog);
  