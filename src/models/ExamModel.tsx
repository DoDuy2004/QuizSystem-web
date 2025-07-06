import _ from "lodash";

function ExamModel(data?: any) {
  data = data || {};

  return _.defaults(data, {
    id: null,
    examCode: "",
    name: "",
    startDate: null,
    durationMinutes: 0,
    noOfQuestions: 0,
    status: 0,
    roomExamId: "",
    subjectId: null,
  });
}

export default ExamModel;
