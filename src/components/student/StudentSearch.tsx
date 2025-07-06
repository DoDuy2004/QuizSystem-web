import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../store/store";
import { searchStudents } from "../../store/slices/studentSlice";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface StudentSearchProps {
  onSelectStudent: (student: any | null) => void;
  placeholder?: string;
  label?: string;
  disabledStudents?: string[];
  isOpen?: boolean;
}

const StudentSearch = ({
  onSelectStudent,
  placeholder = "Nhập tên hoặc mã sinh viên...",
  label = "Tìm kiếm sinh viên",
  disabledStudents = [],
  isOpen = false,
}: StudentSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const fetchStudents = useCallback(
    debounce(async (searchText: string) => {
      if (!searchText.trim()) {
        setOptions([]);
        return;
      }

      if (searchText.length >= 3) {
        try {
          setLoading(true);
          setError(null);

          const res = await dispatch(
            searchStudents({ key: searchText, limit: 10 })
          ).unwrap();

          //   console.log("Kết quả trả về:", res);
          setOptions(res.data);
        } catch (err) {
          console.error("Search error:", err);
          setError("Không thể tải dữ liệu. Vui lòng thử lại.");
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchStudents(inputValue);
    return () => {
      fetchStudents.cancel();
    };
  }, [inputValue, fetchStudents]);

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setOptions([]);
      setError(null);
    }
  }, [isOpen]);

  // Kiểm tra sinh viên đã có trong lớp
  const isOptionDisabled = (option: any) =>
    disabledStudents.includes(option.id);

  return (
    <Box sx={{ width: "100%", maxWidth: 500 }}>
      <Autocomplete
        freeSolo
        options={options}
        getOptionLabel={(option: any) =>
          typeof option === "string" ? option : `${option.fullName}`
        }
        inputValue={inputValue}
        onInputChange={(_, newValue) => {
          setInputValue(newValue);
        }}
        onChange={(_, newValue) => {
          if (
            newValue &&
            typeof newValue !== "string" &&
            isOptionDisabled(newValue)
          ) {
            return;
          }
          onSelectStudent(newValue as any);
          setInputValue("");
        }}
        loading={loading}
        filterOptions={(x) => x}
        getOptionDisabled={isOptionDisabled}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={!!error}
            helperText={error}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <SearchIcon sx={{ color: "action.active", mr: 1 }} />
              ),
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => {
          const isDisabled = isOptionDisabled(option);
          return (
            <li {...props} key={option.id}>
              <Tooltip
                title={isDisabled ? "Sinh viên đã có trong lớp" : ""}
                arrow
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: isDisabled ? 0.6 : 1,
                    pointerEvents: isDisabled ? "none" : "auto",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{option.fullName}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {option.email}
                    </div>
                  </div>
                  {isDisabled && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CheckCircleOutlineIcon
                        fontSize="small"
                        color="success"
                      />
                      <Typography variant="caption" color="success.main">
                        Đã có
                      </Typography>
                    </Box>
                  )}
                </div>
              </Tooltip>
            </li>
          );
        }}
        noOptionsText={
          inputValue.trim() === ""
            ? "Nhập tên hoặc mã sinh viên để tìm kiếm"
            : "Không tìm thấy kết quả"
        }
      />
    </Box>
  );
};

export default StudentSearch;
