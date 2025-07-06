import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { ArrowBack, Edit, Save, Cancel } from "@mui/icons-material";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import type { AppDispatch } from "../../../../../../store/store";
import {
  getSubjectById,
  selectSubject,
  updateSubject,
} from "../../../../../../store/slices/subjectSlice";
import CircularLoading from "../../../../../../components/CircularLoading";
import ChapterList from "./components/ChapterList";

const subjectSchema = yup.object().shape({
  name: yup.string().required("Tên môn học là bắt buộc"),
  description: yup.string().optional(),
  major: yup.string().optional(),
  //   status: yup.boolean().required(),
});

const SubjectDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();
  const subject = useSelector(selectSubject);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [localChapters, setLocalChapters] = useState(subject?.chapters || []);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, dirtyFields },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      major: "",
    },
    resolver: yupResolver(subjectSchema),
  });

  useEffect(() => {
    if (id) {
      dispatch(getSubjectById(id))
        .unwrap()
        .then((res) => {
          setLocalChapters(res?.chapters || []);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && !_.isEmpty(subject)) {
      reset({
        name: subject.name,
        description: subject.description,
        major: subject.major || "Công nghệ thông tin",
      });
      setLocalChapters(subject.chapters || []);
    }
  }, [id, subject, reset]);

  const handleBack = () => {
    navigate("/workspace/subject/list");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = (data: any) => {
    if (!id) return;

    const payload = {
      name: data.name,
      description: data.description,
      major: data.major,
      status: subject.status, // giữ nguyên trạng thái
      chapters: localChapters, // truyền luôn danh sách chương đã chỉnh sửa
    };

    dispatch(updateSubject({ id, form: payload }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
      });
  };

  const handleChaptersChange = (updatedChapters: any[]) => {
    setLocalChapters(updatedChapters);
  };

  if (loading) return <CircularLoading />;

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <div className="flex items-center mb-8">
        <IconButton onClick={handleBack} className="mr-4">
          <ArrowBack />
        </IconButton>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
          Chi tiết môn học
        </Typography>
        <div className="flex-grow" />
        {isEditing ? (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleEditToggle}
              sx={{ textTransform: "none" }}
              color="error"
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid || _.isEmpty(dirtyFields)}
              sx={{ textTransform: "none" }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-none"
            >
              Lưu thay đổi
            </Button>
          </Stack>
        ) : (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEditToggle}
            sx={{ textTransform: "none" }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-none"
          >
            Chỉnh sửa
          </Button>
        )}
      </div>

      {/* Thông tin môn học */}
      <Paper className="p-8 mb-8 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {isEditing ? (
              <div className="flex flex-col gap-y-6">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tên môn học"
                      fullWidth
                      variant="standard"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
                <Controller
                  name="major"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Chuyên ngành"
                      variant="standard"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Mô tả"
                      variant="standard"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  )}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-y-4">
                <Typography variant="h5" className="font-semibold mb-4">
                  {subject?.name}
                </Typography>
                <div className="flex items-center gap-x-2">
                  <Typography variant="subtitle1" className="text-gray-500">
                    Chuyên ngành:
                  </Typography>
                  <Chip
                    label={subject?.major || "Công nghệ thông tin"}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </div>
                <div>
                  <Typography variant="subtitle1" className="text-gray-500">
                    Mô tả:
                  </Typography>
                  <Typography variant="body1" className="whitespace-pre-line">
                    {subject?.description || "Không có mô tả"}
                  </Typography>
                </div>
                <div className="flex items-center gap-x-2">
                  <Typography variant="subtitle1" className="text-gray-500">
                    Trạng thái:
                  </Typography>
                  <Chip
                    label={subject?.status ? "Active" : "Inactive"}
                    color={subject?.status ? "success" : "error"}
                    size="small"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Paper>

      {/* Danh sách chương học */}
      <Paper className="p-8 rounded-xl shadow-lg">
        <Typography variant="h6" className="font-semibold mb-4">
          Danh sách chương học
        </Typography>
        <Divider className="mb-6" />
        {id && (
          <ChapterList
            subjectId={id}
            chapters={localChapters}
            onChaptersChange={handleChaptersChange}
          />
        )}
      </Paper>
    </Container>
  );
};

export default SubjectDetail;
