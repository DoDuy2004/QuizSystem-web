import React, { useEffect, useState } from "react";
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
  LinearProgress,
} from "@mui/material";
import { useThemeMediaQuery } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/store";
import {
  closeAddTeachersDialog,
  selectAddTeachersDialog,
} from "../../store/slices/globalSlice";
import { showMessage } from "../../components/FuseMessage/fuseMessageSlice";
import { errorAnchor, successAnchor } from "../../constants/confirm";
import {
  addListStudents,
  importStudents,
} from "../../store/slices/studentSlice";
import {
  addListTeachers,
  importTeachers,
} from "../../store/slices/teacherSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddMultiTeachersDialog = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isTablet = useThemeMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const addTeachersDialog = useSelector(selectAddTeachersDialog);
  const dispatch = useDispatch<AppDispatch>();

  const handleClose = () => {
    dispatch(closeAddTeachersDialog());
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    setLoading(true);

    try {
      const link = document.createElement("a");
      link.href = `/assets/templates/import_student_account_list.xlsx`;
      link.download = "mau_nhap_lieu.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile && !loading) {
      setLoading(true);
      try {
        const response = await dispatch(
          importTeachers({
            file: selectedFile,
          })
        ).unwrap();

        console.log({ response });

        const validTeachers = response?.filter((item: any) => item.isValid);
        if (validTeachers.length > 0) {
          dispatch(addListTeachers({ form: validTeachers }));
          //         .then(() => {
          //             setImportStatus("succeeded");
          //   });
        }

        // Hiển thị thông báo thành công
        dispatch(
          showMessage({
            message: `Import thành công ${validTeachers.length} giảng viên viên`,
            ...successAnchor,
          })
        );

        const invalidTeachers = response?.filter(
          (item: any) => !item.isValid || item.errorMessages.length > 0
        );
        if (invalidTeachers.length > 0) {
          const errorMessage =
            `Có ${invalidTeachers.length} giảng viên không hợp lệ:\n` +
            invalidTeachers
              .map(
                (item: any) =>
                  `Dòng ${item.rowIndex}: ${item.fullName} - Lỗi: ${
                    item.errorMessages.join(", ") || "Dữ liệu không hợp lệ"
                  }`
              )
              .join("\n");
          dispatch(
            showMessage({
              message: errorMessage,
              ...errorAnchor,
            })
          );
        }

        handleClose();
      } catch (error: any) {
        // Xử lý lỗi chung (nếu API thất bại)
        dispatch(
          showMessage({ message: "Import sinh viên thất bại", ...errorAnchor })
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!addTeachersDialog?.isOpen) {
      setSelectedFile(null);
    }
  }, [addTeachersDialog?.isOpen]);

  if (loading) return <CircularProgress />;

  return (
    <Dialog
      open={addTeachersDialog?.isOpen}
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
          Thêm giảng viên hàng loạt
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
              <ListItemText primary="Mỗi giảng viên nằm trên một dòng riêng" />
            </ListItem>
            <ListItem className="p-0">
              <ListItemIcon className="min-w-6">
                <DescriptionIcon fontSize="small" className="text-blue-500" />
              </ListItemIcon>
              <ListItemText primary="Tối đa 1000 giảng viên mỗi lần tải lên" />
            </ListItem>
          </List>

          {/* <Typography variant="body2" className="text-gray-600 pb-2">
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
          </Box> */}
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
              id="excel-upload-teacher"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="excel-upload-teacher">
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

export default AddMultiTeachersDialog;
