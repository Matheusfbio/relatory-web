import React, { useEffect, useState } from "react";
import { database } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";

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
    <div>
      <h2>Lista de Produtos</h2>
      <ul>
        {produtos.map((item) => (
          <li key={item.produto + item.lote}>
            <strong>{item.produto}</strong> - Lote: {item.lote} - Quantidade:{" "}
            {item.unidades} {item.tipoUnidade} - Responsável: {item.responsavel}{" "}
            - Vencimento: {item.dataVencimento}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
