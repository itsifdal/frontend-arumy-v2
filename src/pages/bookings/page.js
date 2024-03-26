import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
// React Toasts
import { ToastContainer, toast } from "react-toastify";

// Toastify
import "react-toastify/dist/ReactToastify.css";

// material
import { Button, Container, Box, Stack } from "@mui/material";

// hooks
import useResponsive from "../../hooks/useResponsive";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import PageHeader from "../../components/PageHeader";
import ConfirmBooking from "../../components/modal/confirmBooking";
import { cleanQuery } from "../../utils/cleanQuery";
import { urlSearchParamsToQuery } from "../../utils/urlSearchParamsToQuery";
import BookingFilters from "../../components/filter/bookingFilters";
import { pageInfo } from "./utils";
import { useGetBookings } from "./query";
import { BookingFormModal } from "./formModal";
import { BookingData } from "./dataList";

// ----------------------------------------------------------------------
export default function Booking() {
  const [bookingId, setBookingId] = useState();
  const [user, setUser] = useState({});
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [stateModalCreate, setStateModalCreate] = useState("create");

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = urlSearchParamsToQuery(searchParams);
  const isDesktop = useResponsive("up", "lg");

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const [openUpdStatus, setOpenUpdStatus] = useState(false);

  // GET DATA BOOKING ALL
  const {
    data: bookings,
    refetch: bookingsRefetch,
    isLoading: isLoadingBookings,
  } = useGetBookings({
    queryParam: cleanQuery({
      ...queryParam,
      ...(user.role === "Guru" && { teacherId: user?.teacherId }),
    }),
  });

  const onSuccessMutateBooking = (response) => {
    setBookingId();
    bookingsRefetch();
    setOpenModalCreate(false);
    setOpenUpdStatus(false);
    toast.success(response.data.message, {
      position: "top-center",
      autoClose: 5000,
      theme: "colored",
    });
  };

  const onErrorMutateBooking = (error) => {
    if (error) {
      toast.error(error.response?.data?.message || "Booking Error", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };
  // END

  // Open Modal Update Confirm
  const handleOpenModalUpdateStatus = (e) => {
    setBookingId(e.target.getAttribute("data-id"));
    setOpenUpdStatus(true);
  };
  const handleCloseModalUpdateStatus = () => setOpenUpdStatus(false);

  const handleOpenModalCreate = (e) => {
    e.preventDefault();
    const type = e.target.getAttribute("data-type");
    if (type === "update") {
      setBookingId(e.target.getAttribute("data-id"));
      setStateModalCreate("update");
    } else {
      setStateModalCreate("create");
    }
    setOpenModalCreate(true);
  };

  // Cek loggedin user admin
  const isUserAdmin = user.role === "Admin" || user.role === "Super Admin";
  const isUserGuru = user.role === "Guru";

  const generateButtonAction = (book) => {
    if (isUserAdmin) {
      return (
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            color="success"
            size="small"
            data-type="update"
            data-id={book.id}
            onClick={handleOpenModalCreate}
          >
            Update
          </Button>
        </Stack>
      );
    }
    if (isUserGuru && (book.status === "pending" || book.status === "ijin")) {
      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          margin="normal"
          data-durasi={book.durasi}
          data-id={book.id}
          onClick={handleOpenModalUpdateStatus}
          {...(!isDesktop && {
            sx: {
              fontSize: "12px",
            },
          })}
        >
          Confirm
        </Button>
      );
    }
    return <></>;
  };

  //----
  return (
    <Page title="Booking">
      <PageHeader
        title="Bookings"
        rightContent={
          user && isUserAdmin ? (
            <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModalCreate}>
              Add New Booking
            </Button>
          ) : null
        }
      />
      <Box
        sx={{
          background: "#FFF",
          boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
          paddingY: isDesktop ? "20px" : "5px",
          zIndex: 2,
          position: "relative",
          borderTop: "1px solid #c3c3e1",
        }}
      >
        <Container maxWidth="xl">
          <BookingFilters pageInfo={pageInfo(bookings?.pagination)} />
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <ToastContainer pauseOnFocusLoss={false} />
        <BookingData
          bookings={bookings}
          queryParam={queryParam}
          isLoadingBookings={isLoadingBookings}
          setSearchParams={setSearchParams}
          buttonAction={generateButtonAction}
          isUserAdmin={isUserAdmin}
          isUserGuru={isUserGuru}
          user={user}
        />

        <BookingFormModal
          open={openModalCreate}
          onClose={() => setOpenModalCreate(false)}
          id={Number(bookingId)}
          stateModal={stateModalCreate}
          onSuccess={(response) => {
            onSuccessMutateBooking(response);
          }}
          onError={(error) => {
            onErrorMutateBooking(error);
          }}
          userId={user.id}
        />

        <ConfirmBooking
          open={openUpdStatus}
          onClose={handleCloseModalUpdateStatus}
          id={Number(bookingId)}
          callbackSuccess={(response) => {
            onSuccessMutateBooking(response);
          }}
          callbackError={(error) => {
            onErrorMutateBooking(error);
          }}
          userId={user.id}
        />
      </Container>
    </Page>
  );
}
