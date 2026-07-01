"use client";

import { useEffect, useState } from "react";

interface AffiliateProduct {
  id: string;
  platform: string;
  affiliateUrl: string;
  title?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AfiliadosPage() {
  const [items, setItems] = useState<AffiliateProduct[]>([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const res = await fetch("/api/affiliate");
      if (!res.ok) throw new Error("Falha ao carregar produtos");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      console.error("Error loading products:", err);
    }
  }

  async function add() {
    if (!url.trim()) {
      setError("Por favor, insira uma URL válida");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/affiliate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateUrl: url }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Falha ao adicionar produto");
      }

      setUrl("");
      await load();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao adicionar produto";
      setError(errorMessage);
      console.error("Error adding product:", err);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    try {
      setError(null);
      const res = await fetch(`/api/affiliate/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Falha ao remover produto");
      }

      await load();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao remover produto";
      setError(errorMessage);
      console.error("Error removing product:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Meus Produtos Afiliados</h1>

      {error && (
        <div
          style={{
            padding: 10,
            marginBottom: 20,
            backgroundColor: "#fee",
            color: "#c33",
            borderRadius: 4,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="colar link afiliado"
          disabled={loading}
          style={{ flex: 1, padding: 8 }}
        />
        <button
          onClick={add}
          disabled={loading}
          style={{ padding: "8px 16px", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Adicionando..." : "Adicionar"}
        </button>
      </div>

      {items.length === 0 ? (
        <p style={{ color: "#666" }}>Nenhum produto adicionado ainda.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                padding: 12,
                marginBottom: 10,
                backgroundColor: "#f5f5f5",
                borderRadius: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{item.platform}</strong> — {item.affiliateUrl}
              </div>
              <button
                onClick={() => remove(item.id)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#ff4444",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
