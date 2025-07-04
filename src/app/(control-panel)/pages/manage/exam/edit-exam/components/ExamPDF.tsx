import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "DejaVuSans",
  src: "/assets/fonts/DejaVuSans.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "DejaVuSans",
    fontSize: 12,
    lineHeight: 1.5,
  },
  examHeader: {
    textAlign: "center",
    marginBottom: 30,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  examInfo: {
    fontSize: 12,
    marginBottom: 3,
  },
  questionTable: {
    width: "100%",
    border: "1px solid #333",
    marginBottom: 15,
  },
  questionRow: {
    flexDirection: "row",
    borderBottom: "1px solid #333",
  },
  questionCell: {
    padding: 8,
    // flex: 1,
  },
  questionContent: {
    fontWeight: "bold",
  },
  optionsRow: {
    flexDirection: "row",
  },
  optionCell: {
    padding: "4px 8px",
    width: "50%",
    // borderRight: "1px solid #333",
    // borderBottom: "1px solid #333",
  },
  optionContent: {
    flexDirection: "row",
  },
  optionPrefix: {
    fontWeight: "bold",
    marginRight: 5,
  },
});

const ExamPDF = ({ questions, examInfo }: any) => {
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.examHeader}>
          <Text style={styles.examTitle}>{examInfo?.name.toUpperCase(0)}</Text>
          <Text style={styles.examTitle}>
            Môn: {examInfo?.subject?.name?.toUpperCase() || ""}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.examInfo}>
              Thời gian: {examInfo?.duration || 60} phút
            </Text>
            <Text style={styles.examInfo}>
              Số lượng: {examInfo?.noOfQuestions || 40} câu
            </Text>
          </View>
        </View>

        {/* Questions */}
        {questions?.map((q: any, index: number) => {
          const hasSecondRow = q?.answers?.length > 2;
          return (
            <View key={index} style={styles.questionTable}>
              {/* Question row */}
              <View style={styles.questionRow}>
                <View style={styles.questionCell}>
                  <Text style={styles.questionContent}>
                    <Text style={{ fontWeight: 700 }}>Câu {index + 1}.</Text>{" "}
                    {stripHtml(q.content)}
                  </Text>
                </View>
              </View>

              {/* Answers row */}
              <View
                style={{
                  ...styles.optionsRow,
                  borderBottom: !hasSecondRow ? "none" : "1px solid #333",
                }}
              >
                {q?.answers?.slice(0, 2).map((opt: any, i: number) => (
                  <View
                    key={`${index}-${i}`}
                    style={{
                      ...styles.optionCell,
                      borderRight: i === 1 ? "none" : "1px solid #333",
                    }}
                  >
                    <View style={styles.optionContent}>
                      <Text style={styles.optionPrefix}>
                        {String.fromCharCode(65 + i)}.
                      </Text>
                      <Text>{opt?.content || ""}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Second row of answers if more than 2 options */}
              {q?.answers?.length > 2 && (
                <View
                  style={{
                    ...styles.optionsRow,
                    borderBottom: hasSecondRow ? "none" : "1px solid #333",
                  }}
                >
                  {q?.answers?.slice(2, 4).map((opt: any, i: number) => (
                    <View
                      key={`${index}-${i + 2}`}
                      style={{
                        ...styles.optionCell,
                        borderRight: i === 1 ? "none" : "1px solid #333",
                      }}
                    >
                      <View style={styles.optionContent}>
                        <Text style={styles.optionPrefix}>
                          {String.fromCharCode(65 + i + 2)}.
                        </Text>
                        <Text>{opt?.content || ""}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

export default ExamPDF;
