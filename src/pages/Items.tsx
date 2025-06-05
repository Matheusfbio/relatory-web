import React, { useReducer } from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale/pt-BR";
import { database } from "../../firebaseConfig";

import { ref, push } from "firebase/database";

// Estado inicial
const initialState = {
  produto: "",
  lote: "",
  unidades: "",
  tipoUnidade: "UN",
  responsavel: "",
  dataAtual: new Date(Date.now() - new Date().getTimezoneOffset() * 60000),
  dataVencimento: "",
  errors: {
    produto: "",
    lote: "",
    unidades: "",
    responsavel: "",
    dataVencimento: "",
  },
  loading: false,
};

// Ações
type Action =
  | { type: "SET_FIELD"; field: string; payload: string | number | Date }
  | { type: "SET_ERRORS"; payload: Partial<typeof initialState.errors> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" };

// Reducer
function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.payload };
    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, ...action.payload } };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "RESET":
      return {
        ...initialState,
        dataAtual: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        ),
      };
    default:
      return state;
  }
}

const ItemForm: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const errors: Partial<typeof state.errors> = {};
    if (!state.produto.trim()) errors.produto = "Nome do produto é obrigatório";
    if (!state.lote.trim()) errors.lote = "Lote é obrigatório";
    if (!state.unidades.trim()) errors.unidades = "Quantidade é obrigatória";
    if (!state.responsavel.trim())
      errors.responsavel = "Responsável é obrigatório";
    if (
      !state.dataVencimento ||
      isNaN(new Date(state.dataVencimento).getTime())
    ) {
      errors.dataVencimento = "Data de vencimento é obrigatória";
    }

    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", payload: errors });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const produtosRef = ref(database, "produtos");

      await push(produtosRef, {
        produto: state.produto,
        lote: state.lote,
        unidades: state.unidades,
        tipoUnidade: state.tipoUnidade,
        responsavel: state.responsavel,
        dataAtual: state.dataAtual.toISOString().split("T")[0],
        dataVencimento: new Date(state.dataVencimento)
          .toISOString()
          .split("T")[0],
      });

      dispatch({ type: "RESET" });
    } catch (error) {
      console.error("Erro ao salvar no Firebase Realtime Database:", error);
    }

    dispatch({ type: "SET_LOADING", payload: false });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 500,
          mx: "1%",
          mt: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Nome do produto"
          variant="outlined"
          value={state.produto}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "produto",
              payload: e.target.value,
            })
          }
          error={!!state.errors.produto}
          helperText={state.errors.produto}
          required
        />

        <TextField
          label="Lote"
          variant="outlined"
          value={state.lote}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "lote",
              payload: e.target.value,
            })
          }
          error={!!state.errors.lote}
          helperText={state.errors.lote}
          required
        />

        <TextField
          label="Quantidade"
          type="number"
          variant="outlined"
          value={state.unidades}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "unidades",
              payload: e.target.value,
            })
          }
          error={!!state.errors.unidades}
          helperText={state.errors.unidades}
          required
        />

        <FormControl fullWidth>
          <InputLabel id="tipo-unidade-label">Tipo de Unidade</InputLabel>
          <Select
            labelId="tipo-unidade-label"
            value={state.tipoUnidade}
            label="Tipo de Unidade"
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "tipoUnidade",
                payload: e.target.value,
              })
            }
          >
            <MenuItem value="UN">UN</MenuItem>
            <MenuItem value="KG">KG</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Responsável"
          variant="outlined"
          value={state.responsavel}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "responsavel",
              payload: e.target.value,
            })
          }
          error={!!state.errors.responsavel}
          helperText={state.errors.responsavel}
          required
        />

        <DatePicker
          label="Data atual"
          enableAccessibleFieldDOMStructure={false}
          value={state.dataAtual}
          onChange={(newValue) =>
            dispatch({
              type: "SET_FIELD",
              field: "dataAtual",
              payload: newValue
                ? newValue instanceof Date
                  ? newValue
                  : typeof newValue === "object" && "toDate" in newValue
                    ? (
                        newValue as unknown as Date & { toDate: () => Date }
                      ).toDate()
                    : new Date(newValue)
                : new Date(),
            })
          }
          slots={{
            textField: (params) => <TextField {...params} fullWidth required />,
          }}
        />

        <DatePicker
          enableAccessibleFieldDOMStructure={false}
          label="Data de vencimento"
          value={state.dataVencimento ? new Date(state.dataVencimento) : null}
          onChange={(newValue) =>
            dispatch({
              type: "SET_FIELD",
              field: "dataVencimento",
              payload: newValue
                ? newValue instanceof Date
                  ? newValue
                  : typeof newValue === "object" && "toDate" in newValue
                    ? (
                        newValue as unknown as Date & { toDate: () => Date }
                      ).toDate()
                    : new Date(newValue)
                : new Date(),
            })
          }
          slots={{
            textField: (params) => (
              <TextField
                {...params}
                fullWidth
                required
                error={!!state.errors.dataVencimento}
                helperText={state.errors.dataVencimento}
              />
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={state.loading}
          startIcon={state.loading ? <CircularProgress size={20} /> : null}
        >
          {state.loading ? "Enviando..." : "Salvar"}
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default ItemForm;
