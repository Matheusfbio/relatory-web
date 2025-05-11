import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
// import SelectAllTransferList from "../components/SelectAllTransferList";
import BasicDateRangePicker from "../components/BasicDateRangePicker";

export default function Items() {
  return (
    <>
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            id="outlined-multiline-flexible"
            label="Nome do Item"
            placeholder="ex:bl morango"
            multiline
            maxRows={4}
          />
          <TextField
            id="outlined-textarea"
            label="Lote"
            placeholder="ex: 1326"
            multiline
          />
          {/* <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows={4}
          /> */}
        </div>
      </Box>
      {/* <SelectAllTransferList /> */}
      <BasicDateRangePicker />
    </>
  );
}
