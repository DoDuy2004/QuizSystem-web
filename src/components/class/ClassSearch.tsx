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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../store/store";
import { searchClasses } from "../../store/slices/classSlice";

interface ClassSearchProps {
  onSelectClass: (courseClass: any | null) => void;
  placeholder?: string;
  label?: string;
  disabledClasses?: string[]; // danh sách id lớp không được chọn
  isOpen?: boolean;
  fullWidth: boolean;
}

const ClassSearch = ({
  onSelectClass,
  placeholder = "Nhập tên lớp ...",
  label = "Lớp tham gia kỳ thi",
  disabledClasses = [],
  isOpen = false,
  fullWidth = true,
}: ClassSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const fetchClasses = useCallback(
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
            searchClasses({ key: searchText, limit: 10 })
          ).unwrap();

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
    fetchClasses(inputValue);
    return () => {
      fetchClasses.cancel();
    };
  }, [inputValue, fetchClasses]);

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setOptions([]);
      setError(null);
    }
  }, [isOpen]);

  const isOptionDisabled = (option: any) => disabledClasses.includes(option.id);

  return (
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        fullWidth={fullWidth}
        freeSolo
        options={options}
        getOptionLabel={(option: any) =>
          typeof option === "string" ? option : `${option.name}`
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
          onSelectClass(newValue as any);
          setInputValue(""); // reset input khi chọn xong
        }}
        loading={loading}
        filterOptions={(x) => x}
        getOptionDisabled={isOptionDisabled}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              <>
                {label} <span className="text-red-500">*</span>
              </>
            }
            placeholder={placeholder}
            error={!!error}
            helperText={error}
            InputProps={{
              ...params.InputProps,
              //   startAdornment: (
              //     <SearchIcon sx={{ color: "action.active", mr: 1 }} />
              //   ),
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
                title={isDisabled ? "Lớp học này đã bị vô hiệu hóa" : ""}
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
                    <div style={{ fontWeight: 500 }}>{option.name}</div>
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
                        Đã chọn
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
            ? "Nhập tên lớp học để tìm kiếm"
            : "Không tìm thấy kết quả"
        }
      />
    </Box>
  );
};

export default ClassSearch;
