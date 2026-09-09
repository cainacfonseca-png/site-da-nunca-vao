import { useState } from "react";
import { ArrowLeft, BarChart3, ExternalLink, LogOut, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import type { ProductSection } from "@/data/catalog";

const emptyForm = { name: "", section: "store" as ProductSection, purchaseUrl: "", description: "", imageUrl: "", videoUrl: "" };

export default function Admin() {
  const auth = useAuth({ redirectOnUnauthenticated: true });
  const products = trpc.admin.products.useQuery(undefined, { enabled: Boolean(auth.user?.role === "admin") });
  const analytics = trpc.admin.analytics.useQuery(undefined, { enabled: Boolean(auth.user?.role === "admin") });
  const utils = trpc.useUtils();
  const create = trpc.admin.createProduct.useMutation({ onSuccess: () => { setForm(emptyForm); products.refetch(); } });
  const remove = trpc.admin.deleteProduct.useMutation({ onSuccess: () => { products.refetch(); analytics.refetch(); } });
  const [form, setForm] = useState(emptyForm);

  if (auth.loading) return <div className="admin-loading">Abrindo o painel…</div>;
  if (!auth.user) return null;
  if (auth.user.role !== "admin") return <div className="admin-loading">Esta área é reservada para a dona da vitrine.</div>;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    create.mutate({ ...form, position: products.data?.length ?? 0, active: true, description: form.description || undefined, imageUrl: form.imageUrl || undefined, videoUrl: form.videoUrl || undefined });
  }

  return (
    <main className="admin-shell">
      <header className="admin-header"><div><span className="eyebrow">Nunca Vão · bastidores</span><h1>Painel da vitrine</h1></div><div className="admin-actions"><a href="/" className="admin-icon"><ArrowLeft size={17} /></a><button onClick={() => auth.logout()} className="admin-icon"><LogOut size={17} /></button></div></header>
      <section className="admin-stats"><div><span>Visitas</span><strong>{analytics.data?.visits ?? 0}</strong></div><div><span>Produtos</span><strong>{products.data?.length ?? 0}</strong></div><div><span>Cliques rastreados</span><strong>{analytics.data?.clicks.reduce((sum, item) => sum + item.clicks, 0) ?? 0}</strong></div></section>
      <section className="admin-grid">
        <form className="admin-card" onSubmit={submit}><div className="admin-card-heading"><div><span className="eyebrow">Catálogo</span><h2>Adicionar produto</h2></div><Plus size={20} /></div><label>Nome<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Seção<select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value as ProductSection })}><option value="store">Nunca Vão</option><option value="finds">Achadinhos Shopee</option></select></label><label>Link de compra<input required type="url" placeholder="https://…" value={form.purchaseUrl} onChange={(e) => setForm({ ...form, purchaseUrl: e.target.value })} /></label><label>Descrição curta<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><label>URL da imagem<input type="url" placeholder="https://…" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label><label>URL do vídeo <span className="field-hint">opcional</span><input type="url" placeholder="https://…" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} /></label><button className="admin-submit" disabled={create.isPending}>{create.isPending ? "Salvando…" : "Salvar produto"}</button></form>
        <section className="admin-card"><div className="admin-card-heading"><div><span className="eyebrow">Gerenciamento</span><h2>Produtos cadastrados</h2></div><BarChart3 size={20} /></div>{products.data?.length ? <div className="admin-product-list">{products.data.map((product) => <div className="admin-product-row" key={product.id}><div><strong>{product.name}</strong><span>{product.section === "store" ? "Nunca Vão" : "Achadinho"}</span></div><div className="row-actions"><a href={product.purchaseUrl} target="_blank" rel="noreferrer"><ExternalLink size={15} /></a><button onClick={() => remove.mutate({ id: product.id })} aria-label={`Excluir ${product.name}`}><Trash2 size={15} /></button></div></div>)}</div> : <p className="admin-empty">Nenhum produto cadastrado ainda. O próximo passo será importar a sua pasta `shopee/`.</p>}</section>
      </section>
    </main>
  );
}
