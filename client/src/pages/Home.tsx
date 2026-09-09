import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Instagram, Search, ShoppingBag, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { initialProducts, sectionLabels, type ProductSection, type Product } from "@/data/catalog";

function ProductCard({ product }: { product: Product }) {
  const clickMutation = trpc.catalog.click.useMutation();
  return (
    <article className="product-card">
      <div className="product-media">
        {product.videoUrl ? (
          <video src={product.videoUrl} autoPlay muted loop playsInline aria-label={product.name} controls={false} />
        ) : product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-placeholder"><ShoppingBag size={30} /></div>
        )}
      </div>
      <div className="product-copy">
        <span className="product-kicker">{product.section === "store" ? "Nunca Vão" : "Achadinho"}</span>
        <h3>{product.name}</h3>
        {product.description && <p>{product.description}</p>}
        <div className="buy-actions">
          <a href={product.purchaseUrl} target="_blank" rel="noreferrer" className="buy-link" onClick={() => clickMutation.mutate({ productId: product.id, referrer: document.referrer || undefined })}>
            Comprar <ArrowUpRight size={16} />
          </a>
          {product.alternatePurchaseUrl && <a href={product.alternatePurchaseUrl} target="_blank" rel="noreferrer" className="alternate-link">Ver alternativa</a>}
        </div>
      </div>
    </article>
  );
}

function Section({ section, products }: { section: ProductSection; products: Product[] }) {
  const content = sectionLabels[section];
  return (
    <section className="catalog-section" id={section}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">{content.eyebrow}</span>
          <h2>{content.title}</h2>
        </div>
        <p>{content.description}</p>
      </div>
      {products.length > 0 ? (
        <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      ) : (
        <div className="empty-catalog">
          <div className="empty-mark"><Sparkles size={22} /></div>
          <div>
            <h3>Em breve, novidades por aqui</h3>
            <p>Estamos organizando a curadoria. Volte em breve para descobrir os próximos achadinhos.</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const catalogQuery = trpc.catalog.list.useQuery();
  const visitMutation = trpc.catalog.visit.useMutation();
  const products = (catalogQuery.data?.length ? catalogQuery.data : initialProducts) as Product[];
  const filtered = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const storeProducts = filtered.filter((product) => product.section === "store" && product.active);
  const findsProducts = filtered.filter((product) => product.section === "finds" && product.active);

  useEffect(() => {
    if (!visitMutation.data && !visitMutation.isPending) {
      visitMutation.mutate({ path: window.location.pathname, referrer: document.referrer || undefined });
    }
  }, [visitMutation.data, visitMutation.isPending]);

  return (
    <main className="site-shell">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Nunca Vão, início">
          <span className="brand-badge">NV</span>
          <span>NUNCA VÃO</span>
        </a>
        <a className="instagram-link" href="https://instagram.com/nunca.vao" target="_blank" rel="noreferrer" aria-label="Instagram Nunca Vão"><Instagram size={19} /></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-content">
          <span className="hero-tag">Vasco até o fim</span>
          <h1>Coisas que a gente encontra.<br /><em>Paixões que ficam.</em></h1>
          <p>Uma seleção da loja Nunca Vão e dos achadinhos que fazem sentido para quem vive a paixão cruzmaltina.</p>
          <div className="hero-actions">
            <a href="#store" className="primary-button">Ver a loja <ArrowUpRight size={17} /></a>
            <a href="#finds" className="secondary-button">Ver achadinhos</a>
          </div>
        </div>
        <div className="hero-stamp"><span>Desde</span><strong>1898</strong><span>até sempre</span></div>
      </section>

      <div className="content-wrap">
        <div className="catalog-toolbar">
          <div><span className="eyebrow">Escolha seu próximo achado</span><h2>Vitrine da bio</h2></div>
          <label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto" aria-label="Buscar produto" /></label>
        </div>
        <Section section="store" products={storeProducts} />
        <Section section="finds" products={findsProducts} />
      </div>

      <footer className="site-footer">
        <div className="footer-brand"><span className="brand-badge small">NV</span><strong>NUNCA VÃO</strong></div>
        <p>Uma curadoria feita com paixão, memória e camisa pesada.</p>
        <a href="https://instagram.com/nunca.vao" target="_blank" rel="noreferrer">@nunca.vao <ArrowUpRight size={15} /></a>
      </footer>
    </main>
  );
}
