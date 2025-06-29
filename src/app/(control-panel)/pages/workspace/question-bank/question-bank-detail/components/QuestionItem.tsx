import { Typography } from "@mui/material";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import React from "react";

const QuestionItem = ({ data }: any) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-2">
        <EditNoteOutlinedIcon color="warning" />
        <Typography
          fontSize={14}
          fontWeight={500}
          component="div"
          dangerouslySetInnerHTML={{ __html: data?.content || "" }}
        />
      </div>
      <div className="pl-8 flex flex-col gap-y-1.5">
        {data?.answers &&
          data?.answers?.map((item: any, index: number) => {
            return (
              <Typography
                className="flex items-center gap-x-2"
                fontSize={13}
                key={index}
                color={item.isCorrect ? "primary" : ""}
              >
                <span>
                  {index === 0
                    ? "A"
                    : index === 1
                    ? "B"
                    : index === 2
                    ? "C"
                    : "D"}
                </span>
                {item.content}
              </Typography>
            );
          })}
      </div>
    </div>
  );
};

export default QuestionItem;
