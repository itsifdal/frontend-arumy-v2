import * as React from "react";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PropTypes from "prop-types";

function Row({ row, header }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell padding="none">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell padding="none" component="th" scope="row" sx={{ fontSize: "12px" }}>
          {row[0]}
        </TableCell>
        <TableCell padding="none" align="right" sx={{ fontSize: "12px" }}>
          {row[3]}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="purchases">
              <TableBody>
                {[1, 2, 4, 5, 6].map((key) => (
                  <TableRow key={key}>
                    <TableCell scope="row" sx={{ fontSize: "12px", fontWeight: "bold" }}>
                      {header[key]}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>{row[key]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
Row.propTypes = {
  row: PropTypes.object,
  header: PropTypes.object,
};

export default function CollapsibleTable({ header, body }) {
  return (
    <TableContainer sx={{ marginBottom: "15px", backgroundColor: "white", borderRadius: "4px" }}>
      <Table size="small" aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell padding="none" />
            <TableCell padding="none">{header[0]}</TableCell>
            <TableCell padding="none" align="center" sx={{ fontSize: "12px", fontWeight: "bold" }}>
              {header[3]}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {body.map((item) => (
            <Row key={item.id} row={item} header={header} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
CollapsibleTable.propTypes = {
  header: PropTypes.array,
  body: PropTypes.array,
};
