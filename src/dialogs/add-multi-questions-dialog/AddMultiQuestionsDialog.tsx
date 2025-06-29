import React, { useEffect, useState } from "react";
import withReducer from "../../store/withReducer";
import reducer from "./store";
import type { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import GetAppIcon from "@mui/icons-material/GetApp";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useThemeMediaQuery } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/store";
import {
  closeAddMultiQuestionsDialog,
  selectAddMultiQuestionsDialog,
} from "../../store/slices/globalSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddMultiQuestionsDialog = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isTablet = useThemeMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const addMultiQuestionsDialog = useSelector(selectAddMultiQuestionsDialog);
  const dispatch = useDispatch<AppDispatch>();

  const handleClose = () => {
    dispatch(closeAddMultiQuestionsDialog());
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    setLoading(true);
    // Simulate download
    setTimeout(() => {
      setLoading(false);
      alert("File mẫu đang được tải xuống...");
    }, 1000);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      setLoading(true);
      // Simulate upload
      setTimeout(() => {
        setLoading(false);
        alert(`File ${selectedFile.name} đã được tải lên thành công!`);
        handleClose();
      }, 1500);
    }
  };

  useEffect(() => {
    if (!addMultiQuestionsDialog?.isOpen) {
      setSelectedFile(null);
    }
  }, [addMultiQuestionsDialog?.isOpen]);

  return (
    <Dialog
      open={addMultiQuestionsDialog?.isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{
        "& .MuiDialog-paper": {
          margin: isMobile ? 0 : isTablet ? "1.5vh auto" : "2vh auto",
          width: isMobile ? "100vw" : isTablet ? "50%" : "40%",
          height: "100%",
          maxWidth: isMobile ? "100vw" : isTablet ? "50%" : "40%",
          maxHeight: isMobile ? "100vh" : "auto",
          borderRadius: isMobile ? 0 : 2,
          boxSizing: "border-box",
          overflow: isMobile ? "hidden" : "hidden",
          padding: isMobile
            ? "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)"
            : 0,
        },
        "& .MuiDialog-container": {
          alignItems: isMobile ? "flex-start" : "center",
        },
      }}
    >
      <DialogTitle
        className="flex items-center justify-between bg-blue-50"
        sx={{ paddingY: 1.5 }}
      >
        <Typography className="font-bold text-gray-800">
          Thêm câu hỏi hàng loạt
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="space-y-4 p-6 mt-4">
        {/* Step 1: Download Template */}
        <Paper
          elevation={0}
          className="p-4 border border-gray-200 rounded-lg flex flex-col gap-y-2"
        >
          <Typography className="font-semibold text-blue-600 mb-2">
            Bước 1: Tải file mẫu
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-3">
            Tải xuống file Excel mẫu của chúng tôi để biết định dạng yêu cầu.
          </Typography>
          <Button
            variant="contained"
            startIcon={<GetAppIcon />}
            onClick={handleDownloadTemplate}
            sx={{ textTransform: "none" }}
            disabled={loading}
            size="small"
            className="bg-blue-600 hover:bg-blue-700 w-fit"
          >
            {loading ? <CircularProgress size={24} /> : "Tải file mẫu"}
          </Button>
        </Paper>

        {/* Step 2: Instructions */}
        <Paper elevation={0} className="p-4 border border-gray-200 rounded-lg">
          <Typography className="font-semibold text-blue-600 mb-2">
            Bước 2: Chuẩn bị file Excel
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-3">
            <strong>Định dạng file yêu cầu:</strong>
          </Typography>

          <List dense className="mb-3">
            <ListItem className="p-0">
              <ListItemIcon className="min-w-6">
                <DescriptionIcon fontSize="small" className="text-blue-500" />
              </ListItemIcon>
              <ListItemText primary="File phải có định dạng .xlsx" />
            </ListItem>
            <ListItem className="p-0">
              <ListItemIcon className="min-w-6">
                <DescriptionIcon fontSize="small" className="text-blue-500" />
              </ListItemIcon>
              <ListItemText primary="Các câu hỏi phải nằm trong cột đầu tiên (cột A)" />
            </ListItem>
            <ListItem className="p-0">
              <ListItemIcon className="min-w-6">
                <DescriptionIcon fontSize="small" className="text-blue-500" />
              </ListItemIcon>
              <ListItemText primary="Mỗi câu hỏi nằm trên một dòng riêng" />
            </ListItem>
            <ListItem className="p-0">
              <ListItemIcon className="min-w-6">
                <DescriptionIcon fontSize="small" className="text-blue-500" />
              </ListItemIcon>
              <ListItemText primary="Tối đa 100 câu hỏi mỗi lần tải lên" />
            </ListItem>
          </List>

          <Typography variant="body2" className="text-gray-600 pb-2">
            <strong>Ví dụ:</strong>
          </Typography>

          <Box className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Câu hỏi (cột A)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Đây là câu hỏi mẫu số 1?
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Câu hỏi mẫu số 2 có đúng không?
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Paper>

        {/* Step 3: Upload File */}
        <Paper
          elevation={0}
          className="p-4 border border-gray-200 rounded-lg flex flex-col gap-y-2"
        >
          <Typography className="font-semibold text-blue-600 mb-2">
            Bước 3: Tải file lên hệ thống
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-3">
            Chọn file Excel đã chuẩn bị để tải lên:
          </Typography>

          <Box className="flex items-center space-x-4 w-full">
            <input
              accept=".xlsx"
              style={{ display: "none" }}
              id="excel-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="excel-upload">
              <Button
                variant="outlined"
                sx={{ textTransform: "none" }}
                component="span"
                startIcon={<CloudUploadIcon />}
                className="border-blue-500 text-blue-600 hover:border-blue-700 hover:bg-blue-50"
              >
                Chọn file Excel
              </Button>
            </label>
            <Typography
              variant="body2"
              className={selectedFile ? "text-gray-800" : "text-gray-500"}
              sx={{
                maxWidth: "50%", // Hoặc giá trị phù hợp
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selectedFile ? selectedFile.name : "Chưa chọn file"}
            </Typography>
          </Box>
        </Paper>
      </DialogContent>

      <Divider />

      <Box className="flex justify-end p-2 gap-x-2 bg-gray-50">
        <Button
          variant="outlined"
          sx={{ textTransform: "none" }}
          onClick={handleClose}
          className="border-gray-400 text-gray-700 hover:border-gray-600"
        >
          Hủy bỏ
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ textTransform: "none" }}
          disabled={!selectedFile || loading}
          className="bg-green-600 hover:bg-green-700"
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {loading ? "Đang xử lý..." : "Xác nhận và tải lên"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default withReducer("questionBank", reducer)(AddMultiQuestionsDialog);
