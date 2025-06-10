import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function Carousel({ data, isAuto, isDots, noOfSlides }: any) {
  console.log({ data })
  
  var settings = {
    dots: isDots || false,
    infinite: true,
    speed: 1000,
    slidesToShow: noOfSlides || 1,
    slidesToScroll: 1,
    autoplay: isAuto,
    autoplaySpeed: isAuto ? 1500 : 0,
  };
  return (
    <Slider {...settings}>
      {data?.length > 0 && data?.map((item: any) => (
          <img className="lg:w-24 h-auto w-20" src={item} alt="" />
      ))}
    </Slider>
  );
}