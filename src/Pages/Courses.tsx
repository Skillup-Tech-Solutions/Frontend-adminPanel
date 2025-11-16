import {
  Box,
  IconButton,
  Modal,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseSchema } from "../assets/Validation/Schema";
import CustomInput from "../Custom/CustomInput";
import CustomButton from "../Custom/CustomButton";
import CustomFileUpload from "../Custom/CustomFileUpload";
import CourseCard from "../Custom/CourseCard";
import {
  coursesDeleteApi,
  coursesUpdateApi,
  useCoursesAddApi,
  useGetCoursesApi,
} from "../Hooks/courses";
import CustomSnackBar from "../Custom/CustomSnackBar";
import config from "../Config/Config";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  outline: "none",
  borderRadius: "5px",
  boxShadow: 24,
  padding: "10px 20px",
  "@media (max-width: 600px)": {
    width: "90vw",
    margin: "auto",
  },
};

const Courses = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const { data: courseGet } = useGetCoursesApi();
  const { mutate: courseAdd } = useCoursesAddApi();
  const { mutate: courseUpdate } = coursesUpdateApi();
  const { mutate: courseDelete } = coursesDeleteApi();
  useEffect(() => {
    if (courseGet) {
      setCourses(courseGet?.courses);
    }
  }, [courseGet]);

  const handleClose = () => {
    setOpen(false);
    setEditingCourse(null);
    reset({
      courseName: "",
      description: "",
      prize: "",
      duration: "",
      discount: "",
      thumbnail: "",
    });
  };

  const handleEdit = (id: any) => {
    const courseToEdit = courses.find((course) => course._id === id);
    if (courseToEdit) {
      setEditingCourse(courseToEdit);

      reset({
        courseName: courseToEdit.name || "",
        description: courseToEdit.description || "",
        prize: courseToEdit.price?.toString() || "",
        duration: courseToEdit.duration || "",
        discount: courseToEdit.discount?.toString() || "",
        thumbnail: courseToEdit.fileupload
          ? {
              filename: courseToEdit.fileupload,
              url: `/uploads/${courseToEdit.fileupload}`,
            }
          : "",
      });
      setOpen(true);
    }
  };

  const handleDeleteClick = (id: any) => {
    setCourseToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      courseDelete(courseToDelete, {
        onSuccess: () => {
          CustomSnackBar.successSnackbar("Deleted Successfully!");
          setDeleteModalOpen(false);
          setCourseToDelete(null);
        },
        onError: (error: any) => {
          CustomSnackBar.errorSnackbar("Failed to delete user!");
          setDeleteModalOpen(false);
          setCourseToDelete(null);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(CourseSchema),
  });
  const onsubmit = (data: any) => {
    setLoading(true)
    if (editingCourse) {
      const formData = new FormData();
      console.log(data, editingCourse);

      formData.append("name", data.courseName);
      formData.append("description", data.description);
      formData.append("discount", data.discount);
      formData.append("duration", data.duration);
      formData.append("price", data.prize);

      // Handle thumbnail - only append if it's a new file (File object)
      if (data.thumbnail && data.thumbnail instanceof File) {
        formData.append("fileupload", data.thumbnail);
      }
      courseUpdate(
        { id: editingCourse._id, formData: formData },
        {
          onSuccess: () => {
            CustomSnackBar.successSnackbar("Courses Added Successfully!");
            handleClose();
          },
          onError: (error) => {
            CustomSnackBar.errorSnackbar(
              error.message || "Error Adding Courses."
            );
          },
          onSettled: () => {
          setLoading(false);
        }
        }
      );
    } else {
      const formData = new FormData();

      formData.append("name", data.courseName);
      formData.append("description", data.description);
      formData.append("discount", data.discount);
      formData.append("duration", data.duration);
      formData.append("price", data.prize);
      formData.append("fileupload", data.thumbnail);
      courseAdd(formData, {
        onSuccess: () => {
          CustomSnackBar.successSnackbar("Courses Added Successfully!");
          handleClose();
        },
        onError: (error) => {
          CustomSnackBar.errorSnackbar(
            error.message || "Error Adding Courses."
          );
        },
        onSettled: () => {
          setLoading(false);
        }
      });
    }
  };
  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            "@media (max-width: 600px)": {
              flexDirection: "column",
              alignItems: "start",
            },
          }}
        >
          <TextField
            placeholder="Search courses..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: "200px",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "var(--white)",
                borderRadius: "4px",
                fontSize: "12px",
                fontFamily: "Regular_M",
                "& fieldset": {
                  borderColor: "var(--borderColor)",
                  borderWidth: "1px",
                },
                "&:hover fieldset": {
                  borderColor: "var(--borderColor)",
                  borderWidth: "1px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--borderColor)",
                  borderWidth: "1px",
                },
              },
              "& .MuiInputBase-input": {
                padding: "10px 8px",
                fontSize: "12px",
                fontFamily: "Regular_M",
              },
            }}
          />
          <CustomButton
            type="button"
            label="Add Courses"
            variant="contained"
            btnSx={{
              background: "var(--primary)",
              color: "var(--white)",
              width: "fit-content",
            }}
            onClick={() => setOpen(true)}
          />
        </Box>

        {/* Course Cards Grid */}
        <Box sx={{ marginTop: "24px" }}>
          <Grid container spacing={3}>
            {filteredCourses.map((course) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={course.id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexBasis: "30% !important",
                  "@media (max-width: 991px)": {
                    flexBasis: "48% !important",
                  },
                  "@media (max-width: 767px)": {
                    flexBasis: "100% !important",
                  },
                }}
              >
                <CourseCard
                  id={course._id}
                  thumbnail={`${config.BASE_URL_MAIN}/uploads/${course.fileupload}`}
                  courseName={course.name}
                  description={course.description}
                  prize={parseFloat(course.price) || 0}
                  duration={course.duration}
                  discount={parseFloat(course.discount) || 0}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </Grid>
            ))}
          </Grid>

          {filteredCourses.length === 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "var(--greyText)",
                  fontSize: "16px",
                  fontFamily: "Medium_M",
                }}
              >
                No courses found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "var(--greyText)",
                  fontSize: "12px",
                  fontFamily: "Regular_M",
                  textAlign: "center",
                }}
              >
                Try adjusting your search terms or add a new course
              </Typography>
            </Box>
          )}
        </Box>

        {/* Model  */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {/* Header  */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "8px",
                borderBottom: "0.4px solid var(--greyText)",
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ fontSize: "14px", fontFamily: "Medium_M" }}
              >
                {editingCourse ? "Edit Course" : "Add Courses"}
              </Typography>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={handleClose}
                sx={{
                  "& svg": {
                    fontSize: "18px",
                  },
                }}
              >
                <IoClose className="close-icon" />
              </IconButton>
            </Box>
            {/* Body */}
            <Box
              component={"form"}
              sx={{ marginTop: "12px", maxHeight: "50vh", overflowY: "auto" }}
              onSubmit={handleSubmit(onsubmit)}
            >
              <CustomInput
                name="courseName"
                placeholder="Enter Course Name"
                label="Course Name"
                type="text"
                bgmode="dark"
                required={false}
                register={register}
                errors={errors}
              />
              <CustomInput
                name="description"
                placeholder="Enter Description"
                label="Description"
                type="text"
                bgmode="dark"
                required={false}
                register={register}
                errors={errors}
              />
              <CustomInput
                name="prize"
                placeholder="Enter Prize"
                label="Prize"
                type="number"
                bgmode="dark"
                required={false}
                register={register}
                errors={errors}
              />
              <CustomInput
                name="duration"
                placeholder="Enter Duration"
                label="Duration"
                type="text"
                bgmode="dark"
                required={false}
                register={register}
                errors={errors}
              />
              <CustomInput
                name="discount"
                placeholder="Enter Discount"
                label="Discount"
                type="number"
                bgmode="dark"
                required={false}
                register={register}
                errors={errors}
              />
              <Controller
                name="thumbnail"
                control={control}
                render={({ field, fieldState }) => (
                  <CustomFileUpload
                    name={field.name}
                    label="Course Thumbnail"
                    value={field.value}
                    onChange={(file) => field.onChange(file)}
                    error={fieldState.error}
                  />
                )}
              />
            </Box>
            {/* Footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "12px",
                paddingBottom: "12px",
                gap: "20px",
              }}
            >
              <CustomButton
                type="button"
                variant="contained"
                label="cancel"
                btnSx={{ background: "transparent", color: "var(--title)" }}
                onClick={handleClose}
              />
              <CustomButton
                type="submit"
                variant="contained"
                label={editingCourse ? "Update Course" : "Add Course"}
                btnSx={{ background: "var(--primary)", color: "var(--white)" }}
                onClick={handleSubmit(onsubmit)}
                disabled={loading}
              />
            </Box>
          </Box>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          open={deleteModalOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
        >
          <Box sx={style}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "8px",
                borderBottom: "0.4px solid var(--greyText)",
              }}
            >
              <Typography
                id="delete-modal-title"
                variant="h6"
                component="h2"
                sx={{ fontSize: "14px", fontFamily: "Medium_M" }}
              >
                Delete Course
              </Typography>
              <IconButton
                edge="end"
                aria-label="close"
                onClick={handleDeleteCancel}
                sx={{
                  "& svg": {
                    fontSize: "18px",
                  },
                }}
              >
                <IoClose className="close-icon" />
              </IconButton>
            </Box>

            {/* Body */}
            <Box sx={{ marginTop: "20px", marginBottom: "20px" }}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "14px",
                  fontFamily: "Regular_M",
                  color: "var(--title)",
                  textAlign: "center",
                  lineHeight: "1.5",
                }}
              >
                Are you sure you want to delete this course?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "12px",
                  fontFamily: "Regular_M",
                  color: "var(--greyText)",
                  textAlign: "center",
                  marginTop: "8px",
                }}
              >
                This action cannot be undone.
              </Typography>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                paddingTop: "12px",
              }}
            >
              <CustomButton
                type="button"
                variant="outlined"
                label="Cancel"
                btnSx={{
                  background: "transparent",
                  color: "var(--greyText)",
                  borderColor: "var(--borderColor)",
                  "&:hover": {
                    backgroundColor: "var(--toogleHover)",
                  },
                }}
                onClick={handleDeleteCancel}
              />
              <CustomButton
                type="button"
                variant="contained"
                label="Delete"
                btnSx={{
                  background: "#f44336",
                  color: "var(--white)",
                  "&:hover": {
                    backgroundColor: "#d32f2f",
                  },
                }}
                onClick={handleDeleteConfirm}
              />
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};
export default Courses;
