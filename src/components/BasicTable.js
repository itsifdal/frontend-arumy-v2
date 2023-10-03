// material
import { Table, TableRow, TableHead, TableBody, TableCell, TableContainer } from "@mui/material";
import PropTypes from "prop-types";

export default function BasicTable({ header, body }) {
  if (!header || !body) return false;
  return (
    <TableContainer sx={{ minWidth: 800 }}>
      <Table
        sx={{
          paddingX: "15px",
          paddingBottom: "15px",
          borderCollapse: "separate",
          borderSpacing: "0 15px",
        }}
      >
        <TableHead>
          <TableRow>
            {header.map((head, index) => (
              <TableCell key={index} sx={{ border: 0 }}>
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {body.map((items, index) => (
            <TableRow
              key={index}
              sx={{
                position: "relative",
              }}
            >
              {items &&
                items.map((item, id) => (
                  <TableCell
                    key={id}
                    align={id === items.length - 1 ? "right" : "left"}
                    component="td"
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      border: 0,
                      background: "#FFF",
                      ...(id === 0 && {
                        borderTopLeftRadius: "15px",
                        borderBottomLeftRadius: "15px",
                      }),
                      ...(id === items.length - 1 && {
                        borderTopRightRadius: "15px",
                        borderBottomRightRadius: "15px",
                        width: "1px",
                        whiteSpace: "nowrap",
                      }),
                    }}
                  >
                    {item}
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

BasicTable.propTypes = {
  header: PropTypes.array.isRequired,
  body: PropTypes.array.isRequired,
};
