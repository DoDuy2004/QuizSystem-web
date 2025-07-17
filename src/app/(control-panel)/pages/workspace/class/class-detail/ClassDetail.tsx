import { Box, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import NewsBoard from "./tabs/NewsBoard";
import PeopleTab from "./tabs/PeopleTab";
import { useDeepCompareEffect } from "../../../../../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../../store/store";
import {
  getClassById,
  selectClass,
} from "../../../../../../store/slices/classSlice";
import CircularLoading from "../../../../../../components/CircularLoading";

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
      {value === index && <Box>{children}</Box>}
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

const ClassDetail = () => {
  const [value, setValue] = React.useState(0);
  // const routeParams = useParams();
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get("step") || "info";
  const dispatch = useDispatch<AppDispatch>();
  const routeParams = useParams();
  const courseClass = useSelector(selectClass);

  useEffect(() => {
    setValue(tabSteps.indexOf(stepParam as string));

    console.log(stepParam);
  }, [stepParam]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useDeepCompareEffect(() => {
    dispatch(getClassById(routeParams?.id))
      .unwrap()
      .then((res: any) => {
        setLoading(false);
      });
  }, [dispatch, routeParams?.id]);

  if (loading) return <CircularLoading />;

  return (
    <div className="flex flex-col gap-y-4">
      <Box
        sx={{ borderBottom: 1, borderColor: "divider" }}
        className="shadow-sm bg-white px-6 sticky top-0 z-50"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            "& .MuiTab-root": {
              px: 3,
            },
          }}
        >
          <Tab
            sx={{ textTransform: "none", fontSize: 14 }}
            label="Bảng tin"
            {...a11yProps(0)}
          />
          <Tab
            sx={{ textTransform: "none", fontSize: 14 }}
            label="Mọi người"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <div className="md:px-8 px-4 py-2 overflow-y-scroll scrollbar-hide">
        <CustomTabPanel value={value} index={0}>
          <NewsBoard data={courseClass?.data} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <PeopleTab />
        </CustomTabPanel>
      </div>
    </div>
  );
};

export default ClassDetail;
