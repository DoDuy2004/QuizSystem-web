import { Typography } from "@mui/material";
import React from "react";
import FeatureItem from "./components/FeatureItem";

const Feature = () => {
  return (
    <div className="flex flex-col gap-y-12 md:mb-0 mb-10">
      <div
        className="bg-no-repeat w-full h-auto text-white flex flex-col items-center gap-y-6 pt-16"
        style={{ backgroundImage: `url(/assets/images/feature.46a53978.svg)` }}
      >
        <div className="w-fit px-5 py-2.5 border-1 border-white rounded-full text-xl">
          Tối ưu cho trắc nghiệm
        </div>
        <Typography
          className="leading-tight w-1/3 text-center"
          sx={{ fontSize: "36px", fontWeight: 600 }}
        >
          Đa dạng tính năng thân thiện và dễ sử dụng
        </Typography>
        <Typography
          className="leading-tight w-[40%] text-center"
          sx={{ fontSize: "18px" }}
        >
          Khám phá bộ tính năng vượt trội của EduQuiz giúp bạn quản lý, học tập
          và thi trắc nghiệm hiệu quả hơn
        </Typography>

        <div className="lg:mx-64 shadow mt-24 rounded-2xl">
          <img src="/assets/images/banner.af04f3d0.png" alt="" />
        </div>
      </div>

      <div className="">
        <Typography className="text-center" sx={{ fontSize: 32 }}>
          Toàn bộ giải pháp từ EduQuiz
        </Typography>
        <div className="">
          <FeatureItem index={0} />
          <FeatureItem index={1} />
          <FeatureItem index={2} />
          <FeatureItem index={3} />
        </div>
      </div>
    </div>
  );
};

export default Feature;
