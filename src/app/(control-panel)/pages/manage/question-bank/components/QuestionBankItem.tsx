import { Divider, IconButton, Tooltip, Typography } from "@mui/material";
// import React from 'react'
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import QuizIcon from "@mui/icons-material/Quiz";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../../../../store/store";
import { openConfirmationDialog } from "../../../../../../store/slices/confirmationSlice";
import { deleteQuestionBank } from "../../../../../../store/slices/questionBankSlice";

const QuestionBankItem = ({ data }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const handleQuestionBankDetail = () => {
    navigate(`/workspace/question-bank/${data?.id}`);
  };

  const handleComposeQuestion = (e: any) => {
    e.stopPropagation();
    navigate(`/workspace/question-bank/${data?.id}/edit?step=question`);
  };
  const handleUpdate = (e: any) => {
    e.stopPropagation();
    navigate(`/workspace/question-bank/${data?.id}/edit?step=info`);
  };

  const openConfirmDialog = (id: any, e: any) => {
    e.stopPropagation();
    dispatch(
      openConfirmationDialog({
        data: {
          onAgree: () => {
            dispatch(deleteQuestionBank({ id }));
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

  return (
    <div
      className="col-span-1 shadow-sm p-4 flex flex-col gap-y-4  hover:cursor-pointer hover:shadow-lg hover:-translate-y-1 transition duration-200 ease-in-out"
      onClick={handleQuestionBankDetail}
    >
      <Typography
        component={"h6"}
        fontSize={14}
        color="primary"
        className="truncate max-w-ful"
      >
        {data?.name}
      </Typography>

      <Tooltip title={data?.subject}>
        <Typography
          component={"p"}
          fontSize={12}
          className="truncate max-w-full"
        >
          {data?.description}
        </Typography>
      </Tooltip>
      {/* <Typography
        component={"p"}
        fontSize={12}
        className="flex items-center gap-x-2"
      >
        <HelpCenterIcon className="text-orange-500" fontSize={"small"} />{" "}
        {data?.noOfQuestions} câu hỏi
      </Typography> */}
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

        {/* <Tooltip title="Xóa">
          <IconButton onClick={(e) => openConfirmDialog(data?.id, e)}>
            <DeleteForeverOutlinedIcon
              fontSize={"small"}
              className="text-red-500"
            />
          </IconButton>
        </Tooltip> */}
      </div>
    </div>
  );
};

export default QuestionBankItem;
