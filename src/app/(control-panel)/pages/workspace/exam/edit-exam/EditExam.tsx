import { Box, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import QuestionBankForm from "./tabs/ExamForm";
import { selectQuestionBank } from "../../../../../../store/slices/questionBankSlice";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ComposeQuestion from "./tabs/ComposeQuestion";
import { selectExam } from "../../../../../../store/slices/examSlice";
import ExamForm from "./tabs/ExamForm";
import ExamPDFViewer from "./components/ExamPDFViewer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box className="h-full">{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const tabSteps = ["info", "question"];

const CreateExam = () => {
  const [value, setValue] = React.useState(0);
  const exam = useSelector(selectExam);
  const routeParams = useParams();
  const [isQuestionTabEnabled, setIsQuestionTabEnabled] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get("step") || "info";

  useEffect(() => {
    if (routeParams.id) {
      setIsQuestionTabEnabled(true);
    } else {
      setIsQuestionTabEnabled(false);
    }
  }, [routeParams.id]);

  useEffect(() => {
    // console.log({ searchParams });
    setValue(tabSteps.indexOf(stepParam as string));

    console.log(stepParam);
  }, [stepParam]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="flex items-center gap-x-4">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackOutlinedIcon />
        </IconButton>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>Đề thi</Typography>
      </div>
      <div className="flex flex-col gap-y-4">
        <Box
          sx={{ borderBottom: 1, borderColor: "divider" }}
          className="shadow-sm bg-white"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              sx={{ textTransform: "none", fontSize: 14 }}
              label="Thông tin cơ bản"
              {...a11yProps(0)}
            />
            <Tab
              sx={{ textTransform: "none", fontSize: 14 }}
              label="Soạn câu hỏi"
              {...a11yProps(1)}
              disabled={!isQuestionTabEnabled}
            />
            <Tab
              sx={{ textTransform: "none", fontSize: 14 }}
              label="Xem trước đề thi"
              {...a11yProps(2)}
              disabled={!isQuestionTabEnabled}
            />
          </Tabs>
        </Box>
        <div className="h-full">
          <CustomTabPanel value={value} index={0}>
            <ExamForm
              setIsQuestionTabEnabled={setIsQuestionTabEnabled}
              setTabValue={setValue}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <ComposeQuestion />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <ExamPDFViewer />
          </CustomTabPanel>
        </div>
      </div>
    </>
  );
};

export default CreateExam;
