import { Button, Typography } from "@mui/material";
import { useThemeMediaQuery } from "../../../hooks";
import EditIcon from "@mui/icons-material/Edit";

const FeatureSectionItem = ({ data, index }: any) => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <div className={`${index % 2 ? "bg-white" : "bg-[#f6f8ff]"}`}>
      <div
        className={`flex md:flex-row flex-col gap-y-5 gap-x-10 items-center lg:justify-between py-5 md:text-start xl:mx-64 mx-0 lg:mx-44 `}
      >
        {isMobile && (
          <div className="md:w-[65%] md:px-0 px-2">
            <img
              src={data?.image}
              className="lg:w-[90%] w-full h-auto object-contain"
              alt=""
            />
          </div>
        )}
        {index % 2 ? (
          <>
            {!isMobile && (
              <div className="md:w-[65%] md:px-0 px-2">
                <img
                  src={data?.image}
                  className="lg:w-[90%] mr-auto w-full h-auto object-contain"
                  alt=""
                />
              </div>
            )}
            <div className="flex flex-col items-start gap-y-5 md:w-[35%] w-full md:py-20 lg:px-0 px-6">
              <Button
                variant="contained"
                sx={{
                  padding: "6px 16px",
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #3b82f6, #a855f7)",
                  textTransform: "none",
                  color: "white",
                }}
              >
                {data?.badgeText}
              </Button>
              <Typography
                sx={{
                  //   padding: isMobile ? "0 16px" : 0,
                  fontWeight: "550",
                  background: "linear-gradient(90deg, #3e65fe, #d23cff)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  fontSize: isMobile ? "24px" : "30px",
                }}
              >
                {data?.highlightText}{" "}
                <span className="text-black">{data?.titleText}</span>
              </Typography>
              {data?.descriptions?.length > 0 &&
                data?.descriptions.map((description: any) => (
                  <Typography sx={{}}>{description}</Typography>
                ))}
              <Button
                variant="contained"
                sx={{
                  padding: "8px 16px",
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #3b82f6, #a855f7)",
                  borderRadius: "999px",
                  textTransform: "none",
                  color: "white",
                }}
              >
                Bắt đầu ngay
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-start gap-y-5 md:w-[35%] w-full md:py-20 lg:px-0 px-6">
              <Button
                variant="contained"
                sx={{
                  padding: "6px 16px",
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #3b82f6, #a855f7)",
                  textTransform: "none",
                  color: "white",
                }}
              >
                {data?.badgeText}
              </Button>
              <Typography
                sx={{
                  //   padding: isMobile ? "0 16px" : 0,
                  fontWeight: "550",
                  background: "linear-gradient(90deg, #3e65fe, #d23cff)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  fontSize: isMobile ? "24px" : "30px",
                }}
              >
                {data?.highlightText}{" "}
                <span className="text-black">{data?.titleText}</span>
              </Typography>
              {data?.descriptions?.length > 0 &&
                data?.descriptions.map((description: any) => (
                  <Typography sx={{}}>{description}</Typography>
                ))}
              <Button
                variant="contained"
                sx={{
                  padding: "8px 16px",
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #3b82f6, #a855f7)",
                  borderRadius: "999px",
                  textTransform: "none",
                  color: "white",
                }}
              >
                Bắt đầu ngay
              </Button>
            </div>
            {!isMobile && (
              <div className="md:w-[65%] md:px-0 px-2 relative">
                <img
                  src={data?.image}
                  className="lg:w-[90%] ml-auto w-full h-auto object-contain"
                  alt=""
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeatureSectionItem;
