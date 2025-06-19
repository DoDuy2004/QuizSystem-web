import { Typography } from "@mui/material";
import { useThemeMediaQuery } from "../../../../hooks";
import FeatureSectionItem from "../../../../components/feature/FeatureSectionItem";

const features = [
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

const FeaturesSection = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <div>
      <div className="bg-[#f6f8ff] py-10">
        <Typography
          sx={{
            padding: isMobile ? "0 16px" : 0,
            width: !isMobile ? "50%" : "100%",
            margin: "0 auto",
            fontWeight: "550",
            textAlign: "center",
            background: "linear-gradient(90deg, #3e65fe, #d23cff)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            fontSize: isMobile ? "24px" : "30px",
          }}
        >
          Nền tảng học tập linh hoạt và dễ sử dụng
        </Typography>
      </div>
      {features &&
        features.map((feature: any, index: any) => (
          <FeatureSectionItem key={index} data={feature} index={index} />
        ))}
    </div>
  );
};

export default FeaturesSection;
