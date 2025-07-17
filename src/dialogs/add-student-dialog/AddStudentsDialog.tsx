import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { type TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  IconButton,
  Typography,
  Chip,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ListItemSecondaryAction,
  Snackbar,
} from "@mui/material";
import { useThemeMediaQuery } from "../../hooks";
import React, { useState } from "react";
import { useDispatch as useReduxDispatch } from "react-redux";
import { type AppDispatch } from "../../store/store";
import {
  closeAddStudentsToClassDialog,
  selectAddStudentsToClassDialog,
} from "../../store/slices/globalSlice";
import SearchIcon from "@mui/icons-material/Search";
import StudentSearch from "../../components/student/StudentSearch"; // Import component tìm kiếm
import { addStudentToClass, selectClass } from "../../store/slices/classSlice";

interface Student {
  id: string;
  name: string;
  code: string;
  email?: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddStudentsToClassDialog = () => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isTablet = useThemeMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const dispatch = useReduxDispatch<AppDispatch>();
  const addStudentsToClassDialog = useSelector(selectAddStudentsToClassDialog);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const courseClass = useSelector(selectClass);

  const handleClose = () => {
    dispatch(closeAddStudentsToClassDialog());
    setSelectedStudents([]); // Reset danh sách khi đóng dialog
  };

  const handleStudentSelect = (student: Student | null) => {
    if (!student) return;

    if (courseClass?.students?.some((s: Student) => s.id === student.id)) {
      setSnackbar({
        open: true,
        message: `${student.name} (${student.code}) đã có trong lớp học này`,
      });
      return;
    }

    // Kiểm tra nếu sinh viên đã được chọn
    if (!selectedStudents.some((s) => s.id === student.id)) {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== studentId));
  };

  const handleSubmit = () => {
    setLoading(true);
    // Xử lý khi submit danh sách sinh viên
    const payload = selectedStudents.map((student) => ({
      studentId: student.id,
      courseClassId: courseClass?.data?.id,
      grade: 0,
      note: "",
      status: "ACTIVE",
    }));
    dispatch(
      addStudentToClass({ form: payload, id: courseClass?.data?.id })
    ).then(() => {
      setLoading(false);
    });
    handleClose();
  };

  return (
    <>
      <Dialog
        open={addStudentsToClassDialog?.isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            margin: isMobile ? 0 : isTablet ? "1.5vh auto" : "2vh auto",
            width: isMobile ? "100vw" : isTablet ? "50%" : "40%",
            height: isMobile ? "100%" : "80%",
            maxWidth: isMobile ? "100vw" : isTablet ? "50%" : "40%",
            maxHeight: isMobile ? "100%" : "auto",
            borderRadius: isMobile ? 0 : 2,
            boxSizing: "border-box",
            overflow: "hidden",
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
          <Typography variant="h6">Thêm sinh viên vào lớp</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* Phần tìm kiếm sinh viên */}
          <Box sx={{ mb: 2 }}>
            <StudentSearch
              onSelectStudent={handleStudentSelect}
              placeholder="Nhập tên hoặc mã sinh viên..."
              disabledStudents={courseClass?.students.map((s: any) => s.id)}
              isOpen={addStudentsToClassDialog?.isOpen}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Phần hiển thị sinh viên đã chọn */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Sinh viên đã chọn ({selectedStudents.length})
          </Typography>

          {selectedStudents.length > 0 ? (
            <List dense sx={{ maxHeight: 300, overflow: "auto" }}>
              {selectedStudents.map((student: any) => (
                <ListItem key={student.id}>
                  <ListItemAvatar>
                    <Avatar>{student.fullName.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={student.fullName}
                    secondary={`${student.email}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => handleRemoveStudent(student.id)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 100,
                color: "text.secondary",
              }}
            >
              <SearchIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body2">
                Chưa có sinh viên nào được chọn
              </Typography>
            </Box>
          )}
        </DialogContent>

        {/* Footer với nút action */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ mr: 2, textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ textTransform: "none" }}
            disabled={selectedStudents.length === 0}
            loading={loading}
          >
            Thêm {selectedStudents.length} sinh viên
          </Button>
        </Box>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </>
  );
};

export default AddStudentsToClassDialog;
