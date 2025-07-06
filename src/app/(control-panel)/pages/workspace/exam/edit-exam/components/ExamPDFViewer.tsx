import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import React, { useState } from "react";
import ExamPDF from "./ExamPDF";
import { useDeepCompareEffect } from "../../../../../../../hooks";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../../../../../store/store";
import {
  getExambyId,
  getQuestionsByExam,
  selectExam,
} from "../../../../../../../store/slices/examSlice";
import CircularLoading from "../../../../../../../components/CircularLoading";

const ExamPDFViewer = () => {
  const [loading, setLoading] = useState(false);
  const exam = useSelector(selectExam);
  const dispatch = useDispatch<AppDispatch>();
  const routeParams = useParams();
  useDeepCompareEffect(() => {
    const fetchData = async () => {
      if (!routeParams.id) {
        setLoading(false);
        return;
      }
      // setLoading(true);
      try {
        await Promise.all([
          dispatch(getQuestionsByExam(routeParams?.id as string)),
          dispatch(getExambyId({ id: routeParams.id })),
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, routeParams?.id]);

  if (loading) return <CircularLoading />;


  return (
    <>
      <PDFViewer width="100%" height="1000vh">
        <ExamPDF questions={exam?.questions} examInfo={exam?.data} />
      </PDFViewer>

      {/* Nút tải PDF */}
      <div style={{ marginTop: 20 }}>
        <PDFDownloadLink
          document={<ExamPDF questions={exam?.questions} />}
          fileName="de-thi.pdf"
        >
          {({ loading }: any) =>
            loading ? "Đang tạo PDF..." : "⬇️ Tải đề thi"
          }
        </PDFDownloadLink>
      </div>
    </>
  );
};

export default ExamPDFViewer;
