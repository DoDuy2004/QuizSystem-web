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
import { searchExams } from "../../store/slices/examSlice";

interface ExamSearchProps {
  onSelectExam: (exam: any | null) => void;
  placeholder?: string;
  label?: string;
  disabledExams?: string[]; // Không cần sử dụng nữa, nhưng giữ để tương thích
  isOpen?: boolean;
}

const ExamSearch = ({
  onSelectExam,
  placeholder = "Nhập tên hoặc mã đề thi...",
  label = "Tìm kiếm đề thi",
  disabledExams = [], // Không sử dụng, chỉ giữ để tương thích
  isOpen = false,
}: ExamSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const fetchExams = useCallback(
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
            searchExams({ key: searchText, limit: 10 })
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
    fetchExams(inputValue);
    return () => {
      fetchExams.cancel();
    };
  }, [inputValue, fetchExams]);

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setOptions([]);
      setError(null);
    }
  }, [isOpen]);

  const isOptionDisabled = (option: any) => {
    // Kiểm tra nếu exam có roomExamId (đã được sử dụng)
    return !!option.roomExamId && option.roomExamId !== "";
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Autocomplete
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
            return; // Không cho chọn nếu đã bị disable
          }
          onSelectExam(newValue as any);
          setInputValue("");
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
              <Tooltip title={isDisabled ? "Đề thi đã được sử dụng" : ""} arrow>
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
                    <Typography variant="caption" color="text.secondary">
                      Mã: {option.examCode}
                    </Typography>
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
                        Đề thi đã được sử dụng
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
            ? "Nhập tên đề để tìm kiếm"
            : "Không tìm thấy kết quả"
        }
      />
    </Box>
  );
};

export default ExamSearch;
