import React from "react";
import { Button } from "@mui/material";
import PropTypes from "prop-types";

import Iconify from "../../components/Iconify";

BranchCreateButton.propTypes = {
  onClickCreate: PropTypes.func,
};

export default function BranchCreateButton({ onClickCreate }) {
  return (
    <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={onClickCreate}>
      Add new Branch
    </Button>
  );
}
