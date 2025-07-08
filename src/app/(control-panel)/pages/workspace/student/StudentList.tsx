import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../store/store";
import { useDeepCompareEffect } from "../../../../../hooks";
import SearchIcon from "@mui/icons-material/Search";
// import { useRef } from "react";
import CircularLoading from "../../../../../components/CircularLoading";
import {
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchInput from "../../../../../components/SearchInput";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
// import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { MoreVert } from "@mui/icons-material";
import {
  getStudents,
  selectStudents,
} from "../../../../../store/slices/studentSlice";
import {
  openAddStudentDialog,
  openAddStudentsDialog,
} from "../../../../../store/slices/globalSlice";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { openConfirmationDialog } from "../../../../../store/slices/confirmationSlice";
import { deleteUser } from "../../../../../store/slices/teacherSlice";
import { debounce } from "lodash";

// const paginationModel = { page: 0, pageSize: 5 };

const StudentList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const students = useSelector(selectStudents);
  const [searchText, setSearchText] = useState("");

  const [menuState, setMenuState] = useState<{
    anchorEl: null | HTMLElement;
    studentId: string | null;
  }>({ anchorEl: null, studentId: null });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const currentStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        if (text.length >= 3 || text.length === 0) {
          setLoading(true);
          dispatch(getStudents(text))
            .unwrap()
            .finally(() => setLoading(false));
        }
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useDeepCompareEffect(() => {
    setLoading(true);
    dispatch(getStudents(searchText))
      .unwrap()
      .finally(() => setLoading(false));
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    debouncedSearch(text);
  };

  useDeepCompareEffect(() => {
    setLoading(true);
    dispatch(getStudents())
      .unwrap()
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    studentId: string
  ) => {
    event.stopPropagation();
    setMenuState({ anchorEl: event.currentTarget, studentId });
  };

  const handleClose = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.stopPropagation?.();
    setMenuState({ anchorEl: null, studentId: null });
  };

  const openConfirmDialog = (e: any, id: any) => {
    e.stopPropagation();
    handleClose(e);
    dispatch(
      openConfirmationDialog({
        data: {
          onAgree: () => {
            dispatch(deleteUser(id));
          },
          dialogContent: "Bạn có chắc muốn xóa sinh viên này",
          titleContent: "Xóa sinh viên",
          agreeText: "Xác nhận",
          disagreeText: "Hủy",
          onDisagree: () => {},
        },
      })
    );
  };

  if (loading) return <CircularLoading delay={0} />;

  return (
    <>
      <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
        Quản lý sinh viên
      </Typography>
      <div className="bg-white rounded-md shadow-md">
        <div className="w-full border-b-1 px-6 py-4 border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <Typography className="w-1/2" fontSize={15}>
              <span className="text-blue-600 font-semibold">
                {students?.length}
              </span>{" "}
              sinh viên
            </Typography>
            <TextField
              placeholder="Nhập tên hoặc email hoặc khoa"
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "0.8rem", 
                  opacity: 0.6, 
                },
              }}
              value={searchText}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton>
              <FilterAltOutlinedIcon />
            </IconButton>
          </div>
          <div className="flex items-center gap-x-4">
            <Button
              onClick={() => dispatch(openAddStudentsDialog())}
              sx={{
                padding: "6px 10px",
                background: "linear-gradient(to right, #3b82f6, #a855f7)",
                borderRadius: "4px",
                textTransform: "none",
                color: "white",
                fontSize: "14px",
              }}
            >
              Thêm hàng loạt
            </Button>
            <Button
              onClick={() => dispatch(openAddStudentDialog())}
              sx={{
                padding: "6px 10px",
                background: "linear-gradient(to right, #3b82f6, #a855f7)",
                borderRadius: "4px",
                textTransform: "none",
                color: "white",
                fontSize: "14px",
              }}
            >
              Thêm mới
            </Button>
          </div>
        </div>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "8px",
            boxShadow: "none",
            border: "1px solid #e0e0e0",
          }}
        >
          <Table
            sx={{
              minWidth: 650,
              "& .MuiTableCell-root": {
                padding: "16px 24px",
                fontSize: "0.875rem",
                borderColor: "#f0f0f0",
              },
              "& .MuiTableHead-root .MuiTableCell-root": {
                fontWeight: 600,
                backgroundColor: "#f9fafb",
                color: "#374151",
              },
              "& .MuiTableRow-root:hover": {
                backgroundColor: "#f9fafb",
              },
            }}
            size="medium"
            aria-label="student table"
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ paddingLeft: "32px" }}>Họ tên</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Khoa</TableCell>
                <TableCell align="left">Trạng thái</TableCell>
                <TableCell align="left" sx={{ paddingRight: "32px" }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentStudents.map((row: any) => (
                <TableRow
                  key={row.id}
                  onClick={() => {
                    dispatch(openAddStudentDialog());
                    navigate(`/workspace/student/${row.id}/edit`);
                  }}
                  sx={{
                    "&:last-child td": { borderBottom: "none" },
                  }}
                >
                  <TableCell sx={{ paddingLeft: "32px" }}>
                    {row.fullName}
                  </TableCell>
                  <TableCell>{row.email || ""}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "300px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.facutly}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status === "ACTIVE" ? "ACTIVE" : "DELETED"}
                      size="small"
                      color={row.status === "ACTIVE" ? "success" : "error"}
                      sx={{ fontWeight: 500, borderRadius: "4px" }}
                    />
                  </TableCell>
                  <TableCell sx={{ paddingRight: "32px" }}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleClick(e, row.id)}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Menu chung, dùng menuState */}
        <Menu
          id="basic-menu"
          anchorEl={menuState.anchorEl}
          open={Boolean(menuState.anchorEl)}
          onClose={() => handleClose()}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          PaperProps={{ sx: { px: 1, boxShadow: 1 } }}
        >
          <MenuItem
            sx={{ paddingY: 0 }}
            onClick={(e: any) => {
              handleClose(e);
              navigate(`/workspace/student/${menuState.studentId}/edit`);
              dispatch(openAddStudentDialog());
            }}
          >
            <ListItemText primaryTypographyProps={{ fontSize: "12px" }}>
              Cập nhật
            </ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            sx={{ paddingY: 0 }}
            onClick={(e) => openConfirmDialog(e, menuState.studentId)}
          >
            <ListItemText primaryTypographyProps={{ fontSize: "12px" }}>
              Xóa
            </ListItemText>
          </MenuItem>
        </Menu>

        <Stack spacing={2} sx={{ my: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </Stack>
      </div>
    </>
  );
};

export default StudentList;
