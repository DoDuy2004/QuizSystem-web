import { Button, Typography } from "@mui/material";
import Carousel from "../../../../components/common/Carousel/Carousel";
import { useThemeMediaQuery } from "../../../../hooks";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SwitchAccountOutlinedIcon from "@mui/icons-material/SwitchAccountOutlined";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

const parties = [
  {
    partyType: "STUDENT",
    name: "Sinh viên",
    content:
      "Nền tảng trao đổi đề thi, tài liệu học tập. Thông qua việc tự tạo đề, sinh viên có thể tự học với bộ tài liệu phù hợp đồng thời chia sẻ cho nhóm học tập.",
  },
  {
    partyType: "TEACHER",
    name: "Giảng viên",
    content:
      "Thao tác tạo đề đơn giản, chính xác cùng phương pháp đánh giá hiệu quả, giúp giảng viên dễ dàng quản lý bài giảng và chất lượng giảng dạy.",
  },
  {
    partyType: "CENTER",
    name: "Trung tâm đào tạo",
    content:
      "Nền tảng hỗ trợ chi tiết về kỹ thuật giúp các doanh nghiệp nhanh chóng tổ chức và sắp xếp các nội dung đào tạo cho cán bộ công nhân viên.",
  },
];

const universities = [
  "/assets/images/ckc.png",
  "/assets/images/ckc.png",
  "/assets/images/ckc.png",
  "/assets/images/ckc.png",
  "/assets/images/ckc.png",
  "/assets/images/ckc.png",
  "/assets/images/ckc.png",
  "/assets/images/ckc.png",
  "/assets/images/ckc.png",
];

export const FeatureCard = ({ partyData }: any) => {
  return (
    <div className="flex flex-col gap-y-6 justify-start">
      <div className="flex items-center gap-x-2">
        <span className="w-9 h-9 flex justify-center items-center rounded-[50%] bg-gray-100 text-[#8c7ffc]">
          {partyData?.partyType === "STUDENT" ? (
            <PeopleAltOutlinedIcon sx={{ fontSize: "18px" }} />
          ) : partyData?.partyType === "TEACHER" ? (
            <SwitchAccountOutlinedIcon sx={{ fontSize: "18px" }} />
          ) : (
            <CottageOutlinedIcon sx={{ fontSize: "18px" }} />
          )}
        </span>
        <Typography sx={{ fontWeight: "600" }}>{partyData?.name}</Typography>
      </div>
      <Typography sx={{ fontSize: "14px", lineHeight: "1.6rem" }}>
        {partyData?.content}
      </Typography>
      <Button
        sx={{
          padding: 0,
          textTransform: "none",
          background: "linear-gradient(90deg, #3e65fe, #d23cff)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          fontWeight: "600",
          color: "transparent",
        }}
        variant="text"
        className="flex items-center w-fit gap-x-1.5"
      >
        Bắt đầu{" "}
        <ArrowForwardIosOutlinedIcon
          sx={{
            fontSize: "14px",
            color: "#d23cff",
          }}
        />
      </Button>
    </div>
  );
};

const TrustedSection = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <div className="flex flex-col items-center gap-y-16 xl:mx-64 mx-0 lg:mx-44">
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
        Được cộng đồng sinh viên, trường đại học và doanh nghiệp trên cả nước
        tin cậy
      </Typography>
      <div className="w-full lg:px-0 px-4">
        <Carousel
          data={universities}
          isAuto={true}
          noOfSlides={isMobile ? 3 : 10}
        />
      </div>
      <div className="flex lg:flex-row flex-col items-center justify-between lg:gap-x-52 gap-y-6 lg:px-0 px-6">
        {parties?.length > 0 &&
          parties?.map((party: any, index) => (
            <FeatureCard key={index} partyData={party} />
          ))}
      </div>
    </div>
  );
};

export default TrustedSection;
