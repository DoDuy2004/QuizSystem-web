import {
  Avatar,
  AvatarGroup,
  Button,
  Divider,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { ReactTyped } from "react-typed";
import { useThemeMediaQuery } from "../../../../hooks";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";

const HeroSection = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <div className="flex md:flex-row flex-col gap-y-5 items-center justify-between py-5 text-center md:text-start xl:mx-64 mx-0 lg:mx-44">
      <div className="flex flex-col items-center md:items-start gap-y-5 md:w-[40%] w-full md:py-20">
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
          #1 Nền tảng thi trắc nghiệm online tốt nhất
        </Button>
        <Typography sx={{ fontSize: isMobile ? "20px" : "30px" }}>
          Có một cách đơn giản hơn để
        </Typography>
        <div
          style={{
            fontSize: isMobile ? "32px" : "48px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #3e65fe, #d23cff)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            display: "inline-block",
          }}
        >
          <ReactTyped
            strings={[
              "Học tập ôn thi",
              "tổ chức kỳ thi",
              "tự động tạo câu hỏi",
              "tạo nhanh đề thi",
            ]}
            typeSpeed={60}
            backSpeed={60}
            loop
          />
        </div>
        <Typography sx={{ fontSize: isMobile ? "20px" : "30px" }}>
          Trắc nghiệm online
        </Typography>
        <Divider
          className="w-32 md:mr-auto m-auto"
          sx={{
            border: "none",
            height: "2px",
            background: "linear-gradient(90deg, #3e65fe, #d23cff)",
            borderRadius: "2px",
          }}
        />
        <Typography className="md:px-0 px-8" sx={{ fontSize: "16px" }}>
          Tạo câu hỏi và đề thi nhanh với những giải pháp thông minh. EduQuiz
          tận dụng sức mạnh công nghệ để nâng cao trình độ học tập của bạn.
        </Typography>
        <div className="flex flex-col gap-y-2 md:items-start items-center">
          <div className="flex md:flex-row flex-col items-center gap-x-3 gap-y-3">
            <AvatarGroup>
              <Avatar
                sx={{
                  width: "32px",
                  height: "32px",
                  padding: "2px",
                  background: "linear-gradient(90deg, #3e65fe, #d23cff)",
                  borderRadius: "50%",
                  boxSizing: "border-box",
                  img: {
                    borderRadius: "50%",
                  },
                }}
                alt="Do Duy"
                src="/assets/images/avatars/mrs.fresh.jpg"
              />
              <Avatar
                sx={{
                  width: "32px",
                  height: "32px",
                  padding: "2px",
                  background: "linear-gradient(90deg, #3e65fe, #d23cff)",
                  borderRadius: "50%",
                  boxSizing: "border-box",
                  img: {
                    borderRadius: "50%",
                  },
                }}
                alt="Hoang Anh"
                src="/assets/images/avatars/mrs.fresh.jpg"
              />
              <Avatar
                sx={{
                  width: "32px",
                  height: "32px",
                  padding: "2px",
                  background: "linear-gradient(90deg, #3e65fe, #d23cff)",
                  borderRadius: "50%",
                  boxSizing: "border-box",
                  img: {
                    borderRadius: "50%",
                  },
                }}
                alt="Van Linh"
                src="/assets/images/avatars/mrs.fresh.jpg"
              />
              <Avatar
                sx={{
                  width: "32px",
                  height: "32px",
                  padding: "2px",
                  background: "linear-gradient(90deg, #3e65fe, #d23cff)",
                  borderRadius: "50%",
                  boxSizing: "border-box",
                  img: {
                    borderRadius: "50%",
                  },
                }}
                alt="Ba Kiet"
                src="/assets/images/avatars/mrs.fresh.jpg"
              />
              <Avatar
                sx={{
                  width: "32px",
                  height: "32px",
                  padding: "2px",
                  background: "linear-gradient(90deg, #3e65fe, #d23cff)",
                  borderRadius: "50%",
                  boxSizing: "border-box",
                  img: {
                    borderRadius: "50%",
                  },
                }}
                alt="Minh Khoi"
                src="/assets/images/avatars/mrs.fresh.jpg"
              />
            </AvatarGroup>
            <Typography
              sx={{
                fontWeight: "400",
                background: "linear-gradient(90deg, #3e65fe, #d23cff)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Hơn 20+ khách hàng đã yêu thích sử dụng
            </Typography>
          </div>
          <Stack spacing={1}>
            <Rating
              name="half-rating-read"
              defaultValue={5}
              precision={0.5}
              readOnly
            />
          </Stack>
        </div>
        <div className="flex items-center gap-x-4">
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              padding: "10px 16px",
              fontWeight: "bold",
              background: "linear-gradient(to right, #3b82f6, #a855f7)",
              borderRadius: "999px",
              textTransform: "none",
              color: "white",
            }}
          >
            Tạo đề thi ngay
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            sx={{
              fontWeight: "bold",
              padding: "10px 16px",
              borderRadius: "999px",
              textTransform: "none",
              color: "white",
            }}
          >
            Tìm kiếm đề thi
          </Button>
        </div>
      </div>
      <div className="md:w-[60%] md:px-0 px-4">
        <img
          src="/assets/images/1.9c828312.png"
          className="w-full h-full object-contain"
          alt=""
        />
      </div>
    </div>
  );
};

export default HeroSection;
