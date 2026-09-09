import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Instagram, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { initialProducts, sectionLabels, type ProductSection, type Product } from "@/data/catalog";
import { generatedProducts } from "@/data/generated-products";

type MediaItem = { kind: "image" | "video"; url: string; label: string };

function mediaFor(product: Product): MediaItem[] {
  return [
    ...((product.gallery?.length ? product.gallery : product.imageUrl ? [product.imageUrl] : []).map((url, index) => ({ kind: "image" as const, url, label: index === 0 ? "Capa" : `Foto ${index + 1}` }))),
    ...(product.videoUrl ? [{ kind: "video" as const, url: product.videoUrl, label: "Vídeo" }] : []),
  ];
}

function ProductGallery({ product, onClose }: { product: Product; onClose: () => void }) {
  const media = mediaFor(product);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = media[activeIndex];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setActiveIndex((index) => (index + 1) % media.length);
      if (event.key === "ArrowLeft") setActiveIndex((index) => (index - 1 + media.length) % media.length);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [media.length, onClose]);

  return (
    <div className="gallery-backdrop" role="dialog" aria-modal="true" aria-label={`Galeria de ${product.name}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="gallery-dialog">
        <button className="gallery-close" onClick={onClose} aria-label="Fechar galeria"><X size={20} /></button>
        <div className="gallery-heading"><div><span className="product-kicker">{product.section === "store" ? "Nunca Vão" : "Achadinho"}</span><h2>{product.name}</h2></div><span className="gallery-count">{activeIndex + 1} / {media.length}</span></div>
        <div className="gallery-stage">
          {active?.kind === "video" ? <video src={active.url} controls autoPlay playsInline /> : active ? <img src={active.url} alt={`${product.name} — ${active.label}`} /> : <div className="product-placeholder"><ShoppingBag size={36} /></div>}
          {media.length > 1 && <><button className="gallery-arrow left" onClick={() => setActiveIndex((index) => (index - 1 + media.length) % media.length)} aria-label="Mídia anterior"><ArrowLeft size={20} /></button><button className="gallery-arrow right" onClick={() => setActiveIndex((index) => (index + 1) % media.length)} aria-label="Próxima mídia"><ArrowRight size={20} /></button></>}
        </div>
        {media.length > 1 && <div className="gallery-thumbs">{media.map((item, index) => <button key={item.url} className={`gallery-thumb ${index === activeIndex ? "active" : ""}`} onClick={() => setActiveIndex(index)}>{item.kind === "video" ? <video src={item.url} muted /> : <img src={item.url} alt="" />}<span>{item.label}</span></button>)}</div>}
        {product.description && <p className="gallery-description">{product.description}</p>}
        <a href={product.purchaseUrl} target="_blank" rel="noreferrer" className="buy-link gallery-buy">Comprar <ArrowUpRight size={16} /></a>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const clickMutation = trpc.catalog.click.useMutation();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const media = mediaFor(product);
  const openGallery = () => media.length > 0 && setGalleryOpen(true);
  return <>
    <article className={`product-card ${media.length > 0 ? "is-clickable" : ""}`} onClick={openGallery}>
      <div className="product-media">
        {product.videoUrl ? <video src={product.videoUrl} autoPlay muted loop playsInline aria-label={product.name} controls={false} /> : product.imageUrl ? <img src={product.imageUrl} alt={product.name} loading="lazy" /> : <div className="product-placeholder"><ShoppingBag size={30} /></div>}
        {media.length > 1 && <span className="media-badge">{media.length} mídias</span>}
      </div>
      <div className="product-copy"><span className="product-kicker">{product.section === "store" ? "Nunca Vão" : "Achadinho"}</span><h3>{product.name}</h3>{product.description && <p>{product.description}</p>}
        <div className="buy-actions">{media.length > 0 && <button className="details-link" onClick={(event) => { event.stopPropagation(); openGallery(); }}>Ver fotos e vídeo</button>}<a href={product.purchaseUrl} target="_blank" rel="noreferrer" className="buy-link" onClick={(event) => { event.stopPropagation(); clickMutation.mutate({ productId: product.id, referrer: document.referrer || undefined }); }}>Comprar <ArrowUpRight size={16} /></a>{product.alternatePurchaseUrl && <a href={product.alternatePurchaseUrl} target="_blank" rel="noreferrer" className="alternate-link" onClick={(event) => event.stopPropagation()}>Ver alternativa</a>}</div>
      </div>
    </article>
    {galleryOpen && <ProductGallery product={product} onClose={() => setGalleryOpen(false)} />}
  </>;
}

function Section({ section, products }: { section: ProductSection; products: Product[] }) {
  const content = sectionLabels[section];
  return <section className="catalog-section" id={section}><div className="section-heading"><div><span className="eyebrow">{content.eyebrow}</span><h2>{content.title}</h2></div><p>{content.description}</p></div>{products.length > 0 ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-catalog"><div className="empty-mark"><Sparkles size={22} /></div><div><h3>Em breve, novidades por aqui</h3><p>Estamos organizando a curadoria. Volte em breve para descobrir os próximos achadinhos.</p></div></div>}</section>;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const catalogQuery = trpc.catalog.list.useQuery();
  const visitMutation = trpc.catalog.visit.useMutation();
  const fallbackProducts = generatedProducts.length ? [...initialProducts.filter((product) => product.section === "store"), ...generatedProducts] : initialProducts;
  const products = (catalogQuery.data?.length ? catalogQuery.data : fallbackProducts) as Product[];
  const filtered = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const storeProducts = filtered.filter((product) => product.section === "store" && product.active);
  const findsProducts = filtered.filter((product) => product.section === "finds" && product.active);
  useEffect(() => { if (!visitMutation.data && !visitMutation.isPending) visitMutation.mutate({ path: window.location.pathname, referrer: document.referrer || undefined }); }, [visitMutation.data, visitMutation.isPending]);
  return <main className="site-shell"><header className="site-header"><a href="#top" className="brand" aria-label="Nunca Vão, início"><span className="brand-badge">NV</span><span>NUNCA VÃO</span></a><a className="instagram-link" href="https://instagram.com/nunca.vao" target="_blank" rel="noreferrer" aria-label="Instagram Nunca Vão"><Instagram size={19} /></a></header><section className="hero" id="top"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-content"><span className="hero-tag">Vasco até o fim</span><h1>Coisas que a gente encontra.<br /><em>Paixões que ficam.</em></h1><p>Uma seleção da loja Nunca Vão e dos achadinhos que fazem sentido para quem vive a paixão cruzmaltina.</p><div className="hero-actions"><a href="#store" className="primary-button">Ver a loja <ArrowUpRight size={17} /></a><a href="#finds" className="secondary-button">Ver achadinhos</a></div></div><div className="hero-stamp"><span>Desde</span><strong>1898</strong><span>até sempre</span></div></section><div className="content-wrap"><div className="catalog-toolbar"><div><span className="eyebrow">Escolha seu próximo achado</span><h2>Vitrine da bio</h2></div><label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto" aria-label="Buscar produto" /></label></div><Section section="store" products={storeProducts} /><Section section="finds" products={findsProducts} /></div><footer className="site-footer"><div className="footer-brand"><span className="brand-badge small">NV</span><strong>NUNCA VÃO</strong></div><p>Uma curadoria feita com paixão, memória e camisa pesada.</p><a href="https://instagram.com/nunca.vao" target="_blank" rel="noreferrer">@nunca.vao <ArrowUpRight size={15} /></a></footer></main>;
}
