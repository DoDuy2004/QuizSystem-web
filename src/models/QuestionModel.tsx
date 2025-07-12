import _ from "lodash";

function QuestionModel(data?: any) {
  // Tạo bản sao để tránh lỗi "object is not extensible"
  data = _.cloneDeep(data || {});

  return _.defaults(data, {
    id: null,
    topic: "",
    type: "",
    content: "",
    status: 0,
    difficulty: "",
    image: "",
    createdBy: null,
    chapterId: null,
    questionBankId: null,
    answers: [
      {
        id: null,
        content: "",
        isCorrect: false,
      },
    ],
  });
}

export default QuestionModel;
