import { Typography } from "@mui/material";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

const QuestionItem = ({ data, index }: any) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-2">
        Câu {index}:
        <Typography
          fontSize={14}
          fontWeight={500}
          component="div"
          dangerouslySetInnerHTML={{ __html: data?.content || "" }}
        />
      </div>
      <div className="pl-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {data?.answers?.map((item: any, index: number) => {
            // Kiểm tra độ dài content để quyết định hiển thị
            const isShortContent = item.content?.length < 50; // Điều chỉnh số ký tự tùy nhu cầu

            return (
              <div
                key={index}
                className={`${isShortContent ? "sm:col-span-1" : "col-span-2"}`}
              >
                <Typography
                  className="flex items-center gap-x-2"
                  fontSize={13}
                  color={item.isCorrect ? "primary" : ""}
                >
                  <span>
                    {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                  </span>
                  {item.content}
                </Typography>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
