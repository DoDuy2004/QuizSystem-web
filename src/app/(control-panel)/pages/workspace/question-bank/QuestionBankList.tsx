import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuestionBanks,
  resetQuestionBankState,
  selectQuestionBanks,
} from "../../../../../store/slices/questionBankSlice";
// import withReducer from "../../../../../store/withReducer";
import { type AppDispatch } from "../../../../../store/store";
import { useDeepCompareEffect } from "../../../../../hooks";
// import FullscreenLoader from "../../../../../components/FullscreenLoader";
import { useRef } from "react";
// import reducer from "./store";
import CircularLoading from "../../../../../components/CircularLoading";
import { Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import QuestionBankItem from "./components/QuestionBankItem";
import SearchInput from "../../../../../components/SearchInput";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const QuestionBankList = () => {
  const questionBanks = useSelector(selectQuestionBanks);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  //   console.log({ questionBanks });

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        if (text.length >= 3 || text.length === 0) {
          setLoading(true);
          dispatch(getQuestionBanks(text))
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
    if (hasFetched.current) return;

    setLoading(true);
    hasFetched.current = true;

    dispatch(getQuestionBanks(searchText)).finally(() => {
      setLoading(false);
    });

    return () => {
      dispatch(resetQuestionBankState());
    };
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    debouncedSearch(text);
  };

  if (loading || (!questionBanks?.length && !hasFetched.current)) {
    return <CircularLoading delay={0} />;
  }

  return (
    <>
      <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
        Ngân hàng câu hỏi
      </Typography>
      <div className=" bg-white rounded-md shadow-md">
        <div className="w-full border-b-1 px-6 py-4 border-gray-200 flex items-center justify-between">
          <div className="w-fit flex items-center gap-x-4 justify-start">
            <Typography className="w-1/2" fontSize={15}>
              <span className="text-blue-600 font-semibold">
                {questionBanks?.length}
              </span>{" "}
              Ngân hàng
            </Typography>
            <TextField
              placeholder="Tìm kiếm ngân hàng câu hỏi..."
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
            onClick={() => navigate("/workspace/question-bank/new")}
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
        <div className="grid xl:grid-cols-5 sm:grid-cols-4 gap-8 p-6 grid-cols-1 lg:gap-4">
          {questionBanks &&
            questionBanks?.length > 0 &&
            questionBanks?.map((item: any, index: number) => {
              return <QuestionBankItem data={item} key={index} />;
            })}
        </div>
      </div>
    </>
  );
};

export default QuestionBankList;
