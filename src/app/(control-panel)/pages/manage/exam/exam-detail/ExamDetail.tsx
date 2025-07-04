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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import useParams from "../../../../../../hooks/useParams";
import CircularLoading from "../../../../../../components/CircularLoading";
import QuestionItem from "../../question-bank/question-bank-detail/components/QuestionItem"; // should move to reuse component
import { openConfirmationDialog } from "../../../../../../store/slices/confirmationSlice";
import {
  deleteExam,
  getExambyId,
  getQuestionsByExam,
  selectExam,
} from "../../../../../../store/slices/examSlice";

const ExamDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const routeParams = useParams();
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const exam = useSelector(selectExam);

  useDeepCompareEffect(() => {
    if (hasFetched.current) return;

    const fetchData = async () => {
      hasFetched.current = true;
      setLoading(true);
      try {
        await Promise.all([
          dispatch(getQuestionsByExam(routeParams?.id as string)),
          dispatch(getExambyId({ id: routeParams?.id })),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, routeParams?.id]);

  const handleComposeQuestion = (e: any) => {
    e.stopPropagation();
    navigate(`/workspace/exam/${routeParams?.id}/edit?step=question`);
  };
  const handleUpdate = (e: any) => {
    e.stopPropagation();
    navigate(`/workspace/exam/${routeParams?.id}/edit?step=info`);
  };

  const openConfirmDialog = (id: any, e: any) => {
    e.stopPropagation();
    dispatch(
      openConfirmationDialog({
        data: {
          onAgree: () => {
            dispatch(deleteExam({ id }));
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
          Chi tiết đề thi
        </Typography>
      </div>
      <div className="grid grid-cols-6 gap-8">
        <div className="col-span-2 flex flex-col gap-y-4 bg-white rounded-md shadow-md px-6 py-4 h-fit">
          <Typography component={"h6"} fontSize={14} color="primary">
            {exam?.data?.name}
          </Typography>
          <Typography
            component={"p"}
            fontSize={14}
            className="truncate max-w-full"
          >
            Môn: {exam?.data?.subject?.name}
          </Typography>
          <Typography
            component={"p"}
            fontSize={14}
            className="flex items-center gap-x-2"
          >
            <HelpCenterIcon className="text-orange-500" fontSize={"small"} />{" "}
            {exam?.data?.noOfQuestions} câu hỏi
          </Typography>
          <Typography
            component={"p"}
            fontSize={12}
            className="flex items-center gap-x-2"
          >
            <AccessTimeIcon className="text-orange-500" fontSize={"small"} />{" "}
            {exam?.data?.durationMinutes || 0} phút
          </Typography>
          <Divider />
          <div className="flex items-center gap-x-2">
            <Tooltip title="Soạn câu hỏi">
              <IconButton onClick={(e) => handleComposeQuestion(e)}>
                <QuizIcon fontSize={"small"} color="warning" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <IconButton onClick={(e) => handleUpdate(e)}>
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
        <div className="col-span-4 flex flex-col gap-y-4 bg-white px-6 py-4 shadow rounded-md">
          {exam?.questions && exam?.questions?.length === 0 ? (
            <Typography>Không có câu hỏi nào trong đề thi</Typography>
          ) : (
            exam?.questions?.map((item: any, index: number) => (
              <QuestionItem data={item} key={index} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ExamDetail;
