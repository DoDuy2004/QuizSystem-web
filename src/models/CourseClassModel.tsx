import _ from "lodash";

function CourseClassModel(data?: any) {
  data = data || {};

  return _.defaults(data, {
    id: null,
    classCode: "",
    name: "",
    credit: 0,
    status: 0,
    teacherId: "",
    subjectId: "",
    description: "",
  });
}

export default CourseClassModel;
