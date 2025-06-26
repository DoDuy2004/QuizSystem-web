import _ from "lodash";

function QuestionBankModel(data?: any) {
  data = data || {};

  return _.defaults(data, {
    id: null,
    name: "",
    description: "",
    status: 0,
    teacherId: null,
    noOfQuestions: null,
    subject: "",
  });
}

export default QuestionBankModel;
