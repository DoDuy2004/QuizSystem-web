import { useRef, useState } from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useDeepCompareEffect } from "../../../../../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../../store/store";
import { useNavigate } from "react-router-dom";
import { Divider, IconButton, Tooltip, Typography } from "@mui/material";
// import React from 'react'
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import QuizIcon from "@mui/icons-material/Quiz";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import {
  deleteQuestionBank,
  getQuestionBankById,
  getQuestionsByQuestionBank,
  selectQuestionBank,
} from "../../../../../../store/slices/questionBankSlice";
import useParams from "../../../../../../hooks/useParams";
import CircularLoading from "../../../../../../components/CircularLoading";
import QuestionItem from "./components/QuestionItem";
import { openConfirmationDialog } from "../../../../../../store/slices/confirmationSlice";

const QuestionBankDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const routeParams = useParams();
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const questionBank = useSelector(selectQuestionBank);

  useDeepCompareEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    setLoading(true);
    const fetchData = async () => {
      setLoading(true);

      try {
        await Promise.all([
          dispatch(getQuestionsByQuestionBank({ id: routeParams?.id })),
          dispatch(getQuestionBankById({ id: routeParams?.id })),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, routeParams?.id]);

  const handleComposeQuestion = () => {
    // e.stopPropagation();
  };
  const handleUpdate = () => {
    // e.stopPropagation();
  };

  const openConfirmDialog = (id: any, e: any) => {
    e.stopPropagation();
    dispatch(
      openConfirmationDialog({
        data: {
          onAgree: () => {
            dispatch(deleteQuestionBank(id));
          },
          dialogContent: "Bạn có chắc muốn xóa ngân hàng câu hỏi này",
          titleContent: "Xóa ngân hàng câu hỏi",
          agreeText: "Xóa",
          disagreeText: "Hủy",
          onDisagree: () => {},
        },
      })
    );
  };

  if (loading) return <CircularLoading />;

  return (
    <>
      <div className="flex items-center gap-x-4">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackOutlinedIcon />
        </IconButton>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
          Chi tiết ngân hàng câu hỏi
        </Typography>
      </div>
      <div className="grid grid-cols-6 gap-8">
        <div className="col-span-2 flex flex-col gap-y-4 bg-white rounded-md shadow-md px-6 py-4 h-fit">
          <Typography component={"h6"} fontSize={14} color="primary">
            {questionBank?.data?.name}
          </Typography>
          <Typography
            component={"p"}
            fontSize={14}
            className="truncate max-w-full"
          >
            Môn: {questionBank?.data?.subject}
          </Typography>
          <Typography
            component={"p"}
            fontSize={14}
            className="flex items-center gap-x-2"
          >
            {questionBank?.data?.description}
          </Typography>
          <Typography
            component={"p"}
            fontSize={14}
            className="flex items-center gap-x-2"
          >
            <HelpCenterIcon className="text-orange-500" fontSize={"small"} />{" "}
            {questionBank?.data?.noOfQuestions} câu hỏi
          </Typography>
          <Divider />
          <div className="flex items-center gap-x-2">
            <Tooltip title="Soạn câu hỏi">
              <IconButton onClick={handleComposeQuestion}>
                <QuizIcon fontSize={"small"} color="warning" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <IconButton onClick={handleUpdate}>
                <EditNoteOutlinedIcon fontSize={"small"} color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton
                onClick={(e) => openConfirmDialog(routeParams?.id, e)}
              >
                <DeleteForeverOutlinedIcon
                  fontSize={"small"}
                  className="text-red-500"
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="col-span-4 flex flex-col gap-y-4 bg-white p-6 shadow rounded-md">
          {questionBank?.questions && questionBank?.questions?.length === 0 ? (
            <Typography>
              Không có câu hỏi nào trong ngân hàng câu hỏi
            </Typography>
          ) : (
            questionBank?.questions?.map((item: any, index: number) => (
              <QuestionItem data={item} key={index} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionBankDetail;
