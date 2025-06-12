import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { FaUserCog } from "react-icons/fa";
import FeatureSectionItem from "../../../components/feature/FeatureSectionItem";

const features: any = [
  {
    badgeText: "Nhanh",
    highlightText: "Tự động",
    titleText: "tạo câu hỏi và đề thi trắc nghiệm",
    descriptions: [
      "Tạo đề nhanh với vài cú nhấp chuột. Bằng cách nhập file tài liệu định dạng WORD hoặc PDF, AI sẽ giúp bạn tạo đề chính xác 100% trong vài phút.",
      "Tối ưu trải nghiệm, tiết kiệm thời gian, công sức, đảm bảo tính khách quan và có thêm thời gian nghiên cứu, học tập.",
    ],
    image: "/assets/images/2.ac554112.png",
  },
  {
    badgeText: "Tối ưu",
    highlightText: "Thân thiện dễ sử dụng, cá nhân hóa",
    titleText: "việc học tập",
    descriptions: [
      "Giao diện EduQuiz được thiết kế trực quan, thân thiện giúp người dùng thực hiện thao tác nhanh chóng và sử dụng được tối đa các tính năng hữu ích trên nền tảng.",
      "Bằng cách cá nhân hoá, mỗi người dùng có trải nghiệm riêng và xây dựng lộ trình học tập phù hợp cho chính mình. Từ đó, kích thích tư duy độc lập, sáng tạo và đạt kết quả học tập tốt.",
    ],
    image: "/assets/images/3.fe52b780.png",
  },
  {
    badgeText: "Hiệu quả",
    highlightText: "Phòng thi ảo",
    titleText: "trực tuyến",
    descriptions: [
      "Nền tảng cho phép tổ chức các kỳ thi, kiểm tra một cách an toàn, bảo mật và hiệu quả. Người làm bài thi có thể tham gia thi từ bất kỳ đâu có kết nối internet, không cần phải di chuyển đến địa điểm thi cụ thể.",
      "EduQuiz sử dụng công nghệ tiên tiến để mô phỏng phòng thi truyền thống, đồng thời mang lại nhiều lợi ích vượt trội so với phương pháp thi cũ.",
    ],
    image: "/assets/images/4.e7ab48c9.png",
  },
  {
    badgeText: "Linh hoạt",
    highlightText: "Học tập",
    titleText: "mọi lúc mọi nơi",
    descriptions: [
      "Bất kể bạn đang ở đâu, chỉ cần có thiết bị kết nối internet, bạn đều có thể học tập.",
      "Bạn có thể học trên điện thoại thông minh, máy tính bảng, laptop hoặc máy tính để bàn.",
    ],
    image: "/assets/images/5.35007b45.png",
  },
];

const TabPanel = ({ icon, title, desc, isActive, index }: any) => {
  return (
    <div
      className={`flex items-center gap-x-3 py-6 px-3.5 w-1/4 rounded-sm`}
      style={{
        background: isActive
          ? "linear-gradient(90deg, #3e65fe, #d23cff)"
          : index % 2 ? "white" : "#f6f8ff",
        color: isActive ? "white" : "black",
      }}
    >
      <span className="bg-[#d1d5db] p-1.5 rounded-md">
        <FaUserCog className="text-black" />
      </span>
      <div>
        <Typography>{title || "Ôn thi"}</Typography>
        <Typography className="min-h-2">
          {desc || "Tổng ôn kiến thức nhanh, hiệu quả"}
        </Typography>
      </div>
    </div>
  );
};

const FeatureItem = ({ data, index }: any) => {
  const [currentTab, setCurrentTab] = useState(1);
  return (
    <div className={`px-64 py-24 flex flex-col gap-y-4 w-full ${!(index % 2) ? "bg-white" : "bg-[#f6f8ff]"}`}>
      <Button
        sx={{
          position: "relative",
          zIndex: 1,
          textTransform: "none",
          fontSize: "14px",
          width: "fit-content",
          padding: "6px 20px",
          borderRadius: "999px",
          backgroundImage: "linear-gradient(90deg, #3e65fe, #d23cff)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          "&::before": {
            content: "''",
            position: "absolute",
            inset: 0,
            borderRadius: "999px",
            padding: "2px",
            background: "linear-gradient(90deg, #3e65fe, #d23cff)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            zIndex: -1,
          },
        }}
      >
        {data?.badgeText || "Tối ưu"}
      </Button>
      <Typography sx={{ fontSize: 36 }} color="primary">
        {data?.title || "Chế độ thi"}
      </Typography>
      <Typography sx={{ fontSize: 18 }}>
        {data?.description ||
          "Với nhiều hình thức thi, EduQuiz mang lại cho bạn trải nghiệm thi như thi thật, đồng thời giúp bạn ôn bài tốt trước khi vào phòng thi."}
      </Typography>

      <div className="w-full mt-10 flex flex-col gap-y-8">
        <div className={`flex items-center rounded-xl overflow-hidden`}>
          <TabPanel isActive={currentTab === 0} index={index} />
          <TabPanel isActive={currentTab === 1} index={index} />
          <TabPanel isActive={currentTab === 2} index={index} />
          <TabPanel isActive={currentTab === 3} index={index} />
        </div>
        <div className="rounded-xl overflow-hidden">
          <FeatureSectionItem key={index} data={features[0]} index={index} margin={"mx-10"} />
        </div>
      </div>
    </div>
  );
};

export default FeatureItem;
