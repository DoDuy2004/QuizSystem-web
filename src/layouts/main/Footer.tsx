import { Box, Button, Typography } from "@mui/material";
import { FaFacebookF } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import DoneIcon from "@mui/icons-material/Done";
import { useThemeMediaQuery } from "../../hooks";

const answers = [
  {
    isCorrect: false,
    content: "A. Common Type System (CTS)",
  },
  {
    isCorrect: false,
    content: "B. Just-In-Time Compiler (JIT)",
  },
  {
    isCorrect: true,
    content: "C. Garbage Collector (GC)",
  },
  // {
  //   isCorrect: false,
  //   content: "D. Common Language Specification (CLS)",
  // },
];

const Answer = (answer: any) => {
  return (
    <div className="flex items-center gap-x-2">
      <span
        className={`w-4.5 h-4.5 ${
          answer?.answer?.isCorrect
            ? "bg-green-400"
            : "bg-white border-1 border-gray-300"
        } flex items-center justify-center rounded-[50%]`}
      >
        {answer?.answer?.isCorrect && (
          <DoneIcon sx={{ fontSize: "16px", color: "white" }} />
        )}
      </span>
      <p className={`${answer?.answer?.isCorrect && "text-green-500"}`}>
        {answer?.answer?.content || "A. Common Type System (CTS)"}
      </p>
    </div>
  );
};

const QuestionCard = ({ question, answers }: any) => {
  return (
    <div className="flex flex-col gap-y-3 rounded-md bg-white p-4 w-full">
      <img src="/assets/images/cau_hoi_1.png" alt="" />
      <Typography sx={{ fontWeight: "bold" }}>Câu hỏi 1</Typography>
      <Typography component={"span"} sx={{ fontSize: "14px" }}>
        {question ||
          "Trong .NET, thành phần nào dọn dẹp bộ nhớ cho các đối tượng không còn được sử dụng?"}
      </Typography>
      <div className="flex flex-col gap-y-2">
        {answers?.length > 0 &&
          answers?.map((answer: any, index: number) => (
            <Answer key={index} answer={answer} />
          ))}
      </div>
    </div>
  );
};

const Footer = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <footer className="">
      <div className="flex lg:transform lg:-mt-40 lg:translate-x-0 lg:translate-y-1/2 xl:mx-64 lg:mx-44 m-0">
        <Box
          className="md:rounded-xl rounded-tl-xl rounded-tr-xl md:py-14 xl:px-20 lg:px-16 p-6"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: 3,
            height: "fit-content",
            width: "100%",
            backgroundImage:
              "linear-gradient(90.57deg, #d23cff, #3e65fe) !important;",
          }}
        >
          <div className="flex flex-col gap-y-12 py-5 md:w-1/2">
            <Typography
              className="md:text-start text-center"
              variant="h4"
              sx={{
                fontWeight: isMobile ? "550" : "bold",
                color: "white",
                fontSize: isMobile ? "1.875rem" : "2.125rem",
              }}
            >
              Tạo nhanh <span className="text-green-200">đề thi</span> trắc
              nghiệm với tính năng hoàn hảo
            </Typography>
            <Button
              variant="contained"
              color="success"
              className="md:w-fit w-full"
              sx={{ textTransform: "none" }}
            >
              Bắt đầu ngay
            </Button>
            <div className="flex md:flex-row flex-col md:items-center md:gap-x-5 gap-y-4 text-white">
              <div className="flex items-center gap-x-2">
                <span className="w-8 h-8 bg-[#0000004D] flex items-center justify-center rounded-[50%]">
                  <DoneIcon sx={{ fontSize: "20px" }} />
                </span>
                <Typography sx={{ fontWeight: "bold" }}>
                  Tạo đề thi nhanh
                </Typography>
              </div>
              <div className="flex items-center gap-x-2">
                <span className="w-8 h-8 bg-[#0000004D] flex items-center justify-center rounded-[50%]">
                  <DoneIcon sx={{ fontSize: "20px" }} />
                </span>
                <Typography sx={{ fontWeight: "bold" }}>
                  Tạo đề thi linh hoạt
                </Typography>
              </div>
            </div>
          </div>
          {!isMobile && (
            <div className="flex w-1/2 gap-x-6 transform xl:translate-x-14 lg:translate-x-10">
              <div className="w-1/2">
                <QuestionCard answers={answers} />
              </div>
              <div className="relative w-1/2">
                <div className="absolute w-full top-8">
                  <QuestionCard answers={answers} />
                </div>
              </div>
            </div>
          )}
        </Box>
      </div>
      <div className="flex flex-col bg-[#333333] px-5 xl:px-72 lg:px-40 xl:pt-80 lg:pt-72">
        <div className=" grid grid-cols-1 md:grid-cols-5">
          <div className="flex flex-col gap-y-2 pb-4 border-b-1 border-[#433753] md:col-span-2">
            <img
              className="w-48 h-auto py-4"
              src="/assets/images/logo_1.png"
              alt=""
            />
            <Typography className="text-white" sx={{ fontSize: "1.125rem" }}>
              Nền tảng thi trắc nghiệm online tốt nhất
            </Typography>
            <div className="flex items-center gap-x-4">
              <FaFacebookF className="text-white text-[1.2rem]" />
              <FaTiktok className="text-white text-[1.2rem]" />
              <FaYoutube className="text-white text-[1.2rem]" />
            </div>
          </div>
          <div className="flex md:flex-row flex-col pb-4 border-b-1 border-[#433753] md:col-span-3 justify-between">
            <div className="flex flex-col gap-y-2 py-4 md:gap-y-3">
              <Typography className="text-white" sx={{ fontSize: "1.125rem" }}>
                Sản phẩm dịch vụ
              </Typography>
              <Typography className="text-white">Ôn thi sinh viên</Typography>
              <Typography className="text-white">Tổ chức thi</Typography>
              <Typography className="text-white">
                Luyện thi THPT Quốc Gia
              </Typography>
            </div>
            <div className="flex flex-col gap-y-2 md:gap-y-3 py-4">
              <Typography className="text-white" sx={{ fontSize: "1.125rem" }}>
                Tài nguyên
              </Typography>
              <Typography className="text-white">Tin tức</Typography>
              <Typography className="text-white">Kinh nghiệm ôn thi</Typography>
              <Typography className="text-white">Công cụ học tập</Typography>
              <Typography className="text-white">Tổng hợp đề thi</Typography>
              <Typography className="text-white">
                Cẩm nang ôn thi THPTQG
              </Typography>
              <Typography className="text-white">
                Hoạt động cộng đồng
              </Typography>
            </div>
            <div className="flex flex-col gap-y-2 md:gap-y-3 py-4">
              <Typography className="text-white" sx={{ fontSize: "1.125rem" }}>
                Chính sách
              </Typography>
              <Typography className="text-white">Điều khoản sử dụng</Typography>
              <Typography className="text-white">Điều khoản bảo mật</Typography>
            </div>
          </div>
        </div>
        <div className="py-6">
          <Typography
            className="text-white font-semibold text-center"
            sx={{ fontSize: "16px" }}
          >
            &copy; {new Date().getFullYear()} Cao Thang Technical College
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
