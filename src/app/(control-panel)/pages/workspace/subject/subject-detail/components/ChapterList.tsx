import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { Add, Edit, Check, Close } from "@mui/icons-material";

interface Chapter {
  id: string;
  name: string;
  isEditing?: boolean;
  editingName?: string;
}

interface ChapterListProps {
  subjectId: string;
  chapters: Chapter[];
  onChaptersChange: (updatedChapters: Chapter[]) => void;
}

const ChapterList: React.FC<ChapterListProps> = ({
  subjectId,
  chapters,
  onChaptersChange,
}) => {
  const [newChapterName, setNewChapterName] = useState("");

  const bgColor = newChapterName.trim()
    ? "linear-gradient(135deg, #3b82f6, #6366f1)"
    : "gray";

  const handleEditToggle = (id: string, enable: boolean) => {
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === id
        ? {
            ...chapter,
            isEditing: enable,
            editingName: chapter.name,
          }
        : chapter
    );
    onChaptersChange(updatedChapters);
  };

  const handleSaveChapter = (id: string) => {
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === id
        ? {
            ...chapter,
            name: chapter.editingName || "",
            isEditing: false,
            editingName: undefined,
          }
        : chapter
    );
    onChaptersChange(updatedChapters);
    // TODO: Gọi API cập nhật chương
  };

  const handleCancelEdit = (id: string) => {
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === id
        ? { ...chapter, isEditing: false, editingName: undefined }
        : chapter
    );
    onChaptersChange(updatedChapters);
  };

  const handleChapterNameChange = (id: string, newName: string) => {
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === id ? { ...chapter, editingName: newName } : chapter
    );
    onChaptersChange(updatedChapters);
  };

  const handleAddChapter = () => {
    if (newChapterName.trim()) {
      const newChapter: Chapter = {
        id: Date.now().toString(),
        name: newChapterName,
        isEditing: false,
      };
      onChaptersChange([...chapters, newChapter]);
      setNewChapterName("");
      // TODO: Gọi API thêm chương
    }
  };

  return (
    <>
      <Box sx={{ mt: 2 }}>
        {chapters.map((chapter, index) => (
          <Box
            key={chapter.id}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 1,
              backgroundColor: chapter.isEditing ? "grey.50" : "transparent",
              border: chapter.isEditing ? "1px dashed #ddd" : "none",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {chapter.isEditing ? (
              <>
                <TextField
                  value={chapter.editingName || ""}
                  onChange={(e) =>
                    handleChapterNameChange(chapter.id, e.target.value)
                  }
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                    },
                  }}
                />
                <IconButton
                  onClick={() => handleSaveChapter(chapter.id)}
                  color="primary"
                >
                  <Check />
                </IconButton>
                <IconButton
                  onClick={() => handleCancelEdit(chapter.id)}
                  color="error"
                >
                  <Close />
                </IconButton>
              </>
            ) : (
              <>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    flexGrow: 1,
                  }}
                >
                  {chapter.name}
                </Typography>
                <IconButton
                  onClick={() => handleEditToggle(chapter.id, true)}
                  color="primary"
                >
                  <Edit fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <TextField
          value={newChapterName}
          onChange={(e) => setNewChapterName(e.target.value)}
          placeholder="Nhập tên chương mới"
          fullWidth
          size="small"
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddChapter}
          disabled={!newChapterName.trim()}
          sx={{
            whiteSpace: "nowrap",
            textTransform: "none",
            background: { bgColor },
            "&:hover": {
              boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
            },
          }}
        >
          Thêm chương
        </Button>
      </Box>
    </>
  );
};

export default ChapterList;
