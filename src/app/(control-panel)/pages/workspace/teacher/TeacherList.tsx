import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../store/store";
import { useDeepCompareEffect } from "../../../../../hooks";
import { useRef } from "react";
import CircularLoading from "../../../../../components/CircularLoading";
import {
  Button,
  Chip,
  Divider,
  IconButton,
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
  Typography,
} from "@mui/material";
import SearchInput from "../../../../../components/SearchInput";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
// import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { MoreVert } from "@mui/icons-material";
import {
  openAddTeacherDialog,
  openAddTeachersDialog,
} from "../../../../../store/slices/globalSlice";
import {
  deleteUser,
  getTeachers,
  selectTeachers,
} from "../../../../../store/slices/teacherSlice";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { openConfirmationDialog } from "../../../../../store/slices/confirmationSlice";

const paginationModel = { page: 0, pageSize: 5 };

const TeacherList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const teachers = useSelector(selectTeachers);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(teachers.length / itemsPerPage);

  const currentTeachers = teachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };
  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(null);
    event.stopPropagation();
  };

  useDeepCompareEffect(() => {
    setLoading(true);
    dispatch(getTeachers())
      .unwrap()
      .finally(() => {
        setLoading(false);
      });

    // return () => {
    //   dispatch(resetSubjectState());
    // };
  }, [dispatch]);

  const openConfirmDialog = (e: any, id: any) => {
    e.stopPropagation();
    handleClose(e);
    dispatch(
      openConfirmationDialog({
        data: {
          onAgree: () => {
            dispatch(deleteUser(id));
          },
          dialogContent: "Bạn có chắc muốn xóa giảng viên này",
          titleContent: "Xóa giảng viên",
          agreeText: "Xác nhận",
          disagreeText: "Hủy",
          onDisagree: () => {},
        },
      })
    );
  };

  if (loading) {
    return <CircularLoading delay={0} />;
  }

  return (
    <>
      <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
        Quản lý giảng viên
      </Typography>
      <div className=" bg-white rounded-md shadow-md">
        <div className="w-full border-b-1 px-6 py-4 border-gray-200 flex items-center justify-between">
          <div className="w-fit flex items-center gap-x-4 justify-start">
            <Typography className="w-1/2" fontSize={15}>
              <span className="text-blue-600 font-semibold">
                {teachers?.length}
              </span>{" "}
              giảng viên
            </Typography>
            <SearchInput />
            <IconButton>
              <FilterAltOutlinedIcon />
            </IconButton>
          </div>
          <div className="flex items-center gap-x-4">
            <Button
              onClick={() => dispatch(openAddTeachersDialog())}
              sx={{
                marginLeft: "auto",
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
              onClick={() => dispatch(openAddTeacherDialog())}
              sx={{
                marginLeft: "auto",
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
                padding: "16px 24px", // Tăng padding cho các cell
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
            aria-label="subject table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    paddingLeft: "32px", // Thêm padding left cho ô đầu tiên
                  }}
                >
                  Họ tên
                </TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Khoa</TableCell>
                <TableCell align="left">Trạng thái</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    paddingRight: "32px", // Thêm padding right cho ô cuối
                  }}
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTeachers?.map((row: any) => (
                <TableRow
                  key={row?.fullName}
                  onClick={() => {
                    dispatch(openAddTeacherDialog());
                    navigate(`/workspace/teacher/${row.id}/edit`);
                  }}
                  sx={{
                    "&:last-child td": {
                      borderBottom: "none", // Bỏ border bottom cho hàng cuối
                    },
                    // "&:last-child td:first-of-type": {
                    //   borderBottomLeftRadius: "8px", // Bo góc trái dưới
                    // },
                    // "&:last-child td:last-child": {
                    //   borderBottomRightRadius: "8px", // Bo góc phải dưới
                    // },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ paddingLeft: "32px" }}
                  >
                    {row?.fullName}
                  </TableCell>
                  <TableCell align="left">{row?.email || ""}</TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      maxWidth: "300px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row?.facutly}
                  </TableCell>
                  <TableCell align="left">
                    <Chip
                      label={row?.status === "ACTIVE" ? "Active" : "Inactive"}
                      size="small"
                      color={row?.status === "ACTIVE" ? "success" : "error"}
                      sx={{
                        fontWeight: 500,
                        borderRadius: "4px",
                      }}
                    />
                  </TableCell>
                  <TableCell align="left" sx={{ paddingRight: "32px" }}>
                    <IconButton size="small" onClick={handleClick}>
                      <MoreVert fontSize="small" />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      slotProps={{
                        list: {
                          "aria-labelledby": "basic-button",
                        },
                      }}
                      PaperProps={{
                        sx: {
                          px: 1,
                          boxShadow: 1,
                        },
                      }}
                    >
                      <MenuItem
                        sx={{ paddingY: 0 }}
                        // onClick={(e) => handleUpdate(e)}
                      >
                        <ListItemText
                          primaryTypographyProps={{ fontSize: "12px" }}
                        >
                          Cập nhập
                        </ListItemText>
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        sx={{ paddingY: 0 }}
                        onClick={(e) => openConfirmDialog(e, row?.id)}
                      >
                        <ListItemText
                          primaryTypographyProps={{ fontSize: "12px" }}
                        >
                          Xóa
                        </ListItemText>
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack spacing={2} sx={{ my: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
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

export default TeacherList;
