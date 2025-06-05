import React, { useEffect, useState } from "react";
import { database } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Box } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view";

type Produto = {
  produto: string;
  lote: string;
  unidades: string;
  tipoUnidade: string;
  responsavel: string;
  dataAtual: string;
  dataVencimento: string;
};

const Products: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const produtosRef = ref(database, "produtos");

    const unsubscribe = onValue(produtosRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const lista = Object.entries(data).map(([id, item]) => ({
          id,
          ...(item as Produto),
        }));
        setProdutos(lista);
      } else {
        setProdutos([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-5">
      <Box>
        <SimpleTreeView>
          {produtos.map((item) => (
            <TreeItem
              className="p-2"
              key={item.produto + item.lote}
              itemId={item.lote}
              label={item.produto}
            >
              <strong>Produto: {item.produto}</strong> - Lote: {item.lote} -
              Quantidade: {item.unidades} {item.tipoUnidade} - Responsável:{" "}
              {item.responsavel} - Vencimento: {item.dataVencimento}
            </TreeItem>
          ))}
        </SimpleTreeView>
      </Box>
    </div>
  );
};

export default Products;
