import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../store/store";
import SearchIcon from "@mui/icons-material/Search";
import { useDeepCompareEffect } from "../../../../../hooks";
// import { useRef } from "react";
import CircularLoading from "../../../../../components/CircularLoading";
import {
  Button,
  Chip,
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
import {
  getSubjects,
  selectSubjects,
} from "../../../../../store/slices/subjectSlice";
import { MoreVert } from "@mui/icons-material";
import { openAddSubjectDialog } from "../../../../../store/slices/globalSlice";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { debounce } from "lodash";

// const paginationModel = { page: 0, pageSize: 5 };

const SubjectList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const subjects = useSelector(selectSubjects);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(subjects.length / itemsPerPage);

  const currentSubjects = subjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  //   console.log({ subjects });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };
  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(null);
    event.stopPropagation();
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // Debounce 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        if (text.length >= 3 || text.length === 0) {
          setLoading(true);
          dispatch(getSubjects(text))
            .unwrap()
            .finally(() => setLoading(false));
        }
      }, 500),
    [dispatch]
  );

  useDeepCompareEffect(() => {
    setLoading(true);
    dispatch(getSubjects(""))
      .unwrap()
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    debouncedSearch(text);
  };

  if (loading) {
    return <CircularLoading delay={0} />;
  }

  return (
    <>
      <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
        Quản lý môn học
      </Typography>
      <div className=" bg-white rounded-md shadow-md">
        <div className="w-full border-b-1 md:px-6 px-4 py-4 border-gray-200 flex  md:flex-row flex-col md:items-center items-start gap-4 md:gap-0 justify-between">
          <div className="w-fit flex items-center gap-x-4 justify-start">
            <Typography className="w-1/2" fontSize={15}>
              <span className="text-blue-600 font-semibold">
                {subjects?.length}
              </span>{" "}
              Môn học
            </Typography>
            <TextField
              placeholder="Tìm kiếm..."
              variant="outlined"
              size="small"
              fullWidth
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
          <Button
            onClick={(e) => {
              navigate("/workspace/subject/new");
              handleClose(e);
              dispatch(openAddSubjectDialog());
            }}
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
                    borderTopLeftRadius: "8px",
                    paddingLeft: "32px", // Thêm padding left cho ô đầu tiên
                  }}
                >
                  Tên môn học
                </TableCell>
                <TableCell align="left">Chuyên ngành</TableCell>
                <TableCell align="left">Mô tả</TableCell>
                <TableCell align="left">Trạng thái</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    borderTopRightRadius: "8px",
                    paddingRight: "32px", // Thêm padding right cho ô cuối
                  }}
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentSubjects?.map((row: any) => (
                <TableRow
                  key={row.name}
                  onClick={() => {
                    navigate(`/workspace/subject/${row?.id}`);
                    // dispatch(openAddSubjectDialog());
                  }}
                  sx={{
                    "&:last-child td": {
                      borderBottom: "none", // Bỏ border bottom cho hàng cuối
                    },
                    "&:last-child td:first-of-type": {
                      borderBottomLeftRadius: "8px", // Bo góc trái dưới
                    },
                    "&:last-child td:last-child": {
                      borderBottomRightRadius: "8px", // Bo góc phải dưới
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ paddingLeft: "32px" }}
                  >
                    {row.name}
                  </TableCell>
                  <TableCell align="left">
                    {row.major || "Công nghệ thông tin"}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      maxWidth: "300px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.description}
                  </TableCell>
                  <TableCell align="left">
                    <Chip
                      label={row.status ? "Active" : "Inactive"}
                      size="small"
                      color={row.status ? "success" : "error"}
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
                        onClick={() => {
                          navigate(`/workspace/subject/${row?.id}`);
                        }}
                      >
                        <ListItemText
                          primaryTypographyProps={{ fontSize: "12px" }}
                        >
                          Cập nhập
                        </ListItemText>
                      </MenuItem>
                      {/* <Divider />
                      <MenuItem
                        sx={{ paddingY: 0 }}
                        // onClick={(e) => openConfirmDialog(e, data?.id)}
                      >
                        <ListItemText
                          primaryTypographyProps={{ fontSize: "12px" }}
                        >
                          Xóa
                        </ListItemText>
                      </MenuItem> */}
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

export default SubjectList;
