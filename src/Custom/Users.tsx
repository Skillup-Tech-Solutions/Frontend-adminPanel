import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";
import { useState, useEffect } from "react";
import { useGetUsers, userDeleteApi, userUpdateApi } from "../Hooks/user";
import CustomSnackBar from "./CustomSnackBar";

const Users = () => {
  const { data: getUsersResponse, isLoading, error } = useGetUsers();
  const { mutate: userStatusUpdate } = userUpdateApi();
  const { mutate: userDelete } = userDeleteApi();
  const [rows, setRows] = useState<any>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  console.log(searchText);
  
  useEffect(() => {
    if (getUsersResponse) {
      setRows(getUsersResponse);
    }
  }, [getUsersResponse]);

  const handleAction = (id: string) => {
    console.log("Action clicked for ID:", id);
    if (id) {
      setUserToDelete(id);
      setDeleteModalOpen(true);
    } else {
      CustomSnackBar.errorSnackbar("SomeThing Went Wrong!");
    }
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      userDelete(userToDelete, {
        onSuccess: () => {
          CustomSnackBar.successSnackbar("Deleted Successfully!");
          setDeleteModalOpen(false);
          setUserToDelete(null);
        },
        onError: (error: any) => {
          CustomSnackBar.errorSnackbar("Failed to delete user!");
          setDeleteModalOpen(false);
          setUserToDelete(null);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };
  const handleStatusToggle = (newRow: any) => {
    setRows((prevRows: any) =>
      prevRows.map((row: any) =>
        row._id === newRow._id || row.id === newRow.id
          ? { ...row, status: row.status === "Active" ? "InActive" : "Active" }
          : row
      )
    );
    userStatusUpdate(
      {
        id: newRow._id || "",
        status: newRow.status === "Active" ? "InActive" : "Active",
      },
      {
        onSuccess: () => {
          CustomSnackBar.successSnackbar("Status Updated Successfully!");
        },
        onError: (error: any) => {
          CustomSnackBar.errorSnackbar("SomeThing Went Wrong!");
        },
      }
    );
  };

  const columns: any = [
    {
      field: "sno",
      headerName: "S.No",
      width: 90,
      renderCell: (params: any) => {
        const rowIndex = rows.findIndex(
          (row: any) =>
            (row._id || row.id) === (params.row._id || params.row.id)
        );
        return rowIndex + 1;
      },
    },
    { field: "name", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "mobile", headerName: "Mobile Number", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: any) => (
        <Switch
          checked={params.row.status === "Active"}
          onChange={() => handleStatusToggle(params.row)}
          sx={{
            "& .MuiSwitch-thumb": {
              backgroundColor:
                params.row.status === "Active"
                  ? "var(--primary)"
                  : "var(--grey)",
            },
            "& .MuiSwitch-track": {
              backgroundColor:
                params.row.status === "Active"
                  ? "var(--primary) !important"
                  : "var(--grey) !important",
            },
          }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params: any) => (
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => handleAction(params.row._id || params.row.id)}
          sx={{
            "& svg": {
              color: "var(--red)",
              fontSize: "18px",
            },
          }}
        >
          <MdDeleteOutline />
        </IconButton>
      ),
    },
  ];
  if (error) {
    return (
      <div className="Submitted_form_table">
        <Box sx={{ padding: 2, textAlign: "center", color: "var(--red)" }}>
          Error loading users: {error.message || "Something went wrong"}
        </Box>
      </div>
    );
  }

  return (
    <>
      <div className="Submitted_form_table">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            justifyContent: "space-between",
            marginBottom: "15px",
            "@media (max-width:600px)": {
              flexDirection: "column",
              alignItems: "start",
            },
          }}
        >
          {/* <CustomInput
            name="search"
            placeholder="Search"
            label=""
            type="text"
            bgmode="dark"
            required={false}
            boxSx={{ marginBottom: "0px" }}
          /> */}
        </Box>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[10, 20]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          className="table_border"
          autoHeight
          getRowId={(row) => row._id || row.id}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            padding: "0",
            margin: "16px",
            maxWidth: "380px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            "@media (max-width: 600px)": {
              margin: "16px",
              maxWidth: "calc(100vw - 32px)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            padding: "32px 24px 16px",
            color: "var(--red)",
            fontWeight: "600",
            fontSize: "1.25rem",
            "@media (max-width: 600px)": {
              padding: "24px 20px 12px",
              fontSize: "1.1rem",
            },
          }}
        >
          Delete User
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "0 24px 24px",
            textAlign: "center",
            "@media (max-width: 600px)": {
              padding: "0 20px 20px",
            },
          }}
        >
          <Typography
            sx={{
              color: "#666",
              fontSize: "1rem",
              lineHeight: "1.5",
              "@media (max-width: 600px)": {
                fontSize: "0.9rem",
              },
            }}
          >
            Are you sure you want to delete this user?
          </Typography>
          <Typography
            sx={{
              color: "#999",
              fontSize: "0.875rem",
              marginTop: "8px",
              "@media (max-width: 600px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "0 24px 32px",
            gap: "12px",
            justifyContent: "center",
            "@media (max-width: 600px)": {
              padding: "0 20px 24px",
              flexDirection: "column",
              gap: "8px",
            },
          }}
        >
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              minWidth: "100px",
              height: "40px",
              borderRadius: "8px",
              color: "#666",
              borderColor: "#ddd",
              textTransform: "none",
              "&:hover": {
                borderColor: "#999",
                backgroundColor: "#f9f9f9",
              },
              "@media (max-width: 600px)": {
                width: "100%",
                height: "44px",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              minWidth: "100px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "var(--red)",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
              "@media (max-width: 600px)": {
                width: "100%",
                height: "44px",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Users;
