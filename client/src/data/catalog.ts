export type ProductSection = "store" | "finds";

export interface Product {
  id: number;
  name: string;
  section: ProductSection;
  imageUrl?: string;
  gallery?: string[];
  videoUrl?: string;
  purchaseUrl: string;
  alternatePurchaseUrl?: string;
  description?: string;
  position: number;
  active: boolean;
}

export const sectionLabels: Record<ProductSection, { eyebrow: string; title: string; description: string }> = {
  store: {
    eyebrow: "A loja oficial",
    title: "Nunca Vão",
    description: "Peças para quem carrega o Vasco no peito e a arquibancada na alma.",
  },
  finds: {
    eyebrow: "Curadoria da casa",
    title: "Achadinhos Shopee",
    description: "Produtos que encontramos e escolhemos porque têm a cara de quem vive a paixão cruzmaltina.",
  },
};

// Catálogo importado da pasta shopee enviada pelo proprietário.
// As descrições só são preenchidas quando havia uma observação explícita no arquivo original.
export const initialProducts: Product[] = [
  { id: 1, name: "Busto Vasco Da Gama", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/fZRFkTeTaULCXFOp.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/JNbBOwPbbXPfjREZ.mp4", purchaseUrl: "https://s.shopee.com.br/4LJ30KGnoL", position: 0, active: true },
  { id: 2, name: "Camisa Baby Look Fem", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/AgrUfyQwGyxYIHgT.webp", purchaseUrl: "https://s.shopee.com.br/5VV0Si7FLl", position: 1, active: true },
  { id: 3, name: "Camisa Mauro Galvão", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/OQglJKUCldPmXzaf.webp", purchaseUrl: "https://s.shopee.com.br/5LBaE3nBqd", position: 2, active: true },
  { id: 4, name: "Camisa Vasco 98", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/GjfSCgJgWETCtyfc.webp", purchaseUrl: "https://s.shopee.com.br/3LQVqbtPW9", position: 3, active: true },
  { id: 5, name: "Caneca Personalizada", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/SVqNnILYyNKeMvOC.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/xVRLgkxYIYBKmRmX.mp4", purchaseUrl: "https://s.shopee.com.br/1LfRVM2AMM", position: 4, active: true },
  { id: 6, name: "Chaveiro", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/DyHPLZIWbGxaCwJu.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/OqCBPysRPKFpanTw.mp4", purchaseUrl: "https://s.shopee.com.br/5VV0MfiKnN", position: 5, active: true },
  { id: 7, name: "Chinelo", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/TQqOMPMqpVpSpuGv.webp", purchaseUrl: "https://s.shopee.com.br/40gCevcoGX", description: "Preço anotado na curadoria: R$ 20.", position: 6, active: true },
  { id: 8, name: "Copo Térmico", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/AlkUUcNRShiAckkc.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/TxfgURDGVqAfZmwi.mp4", purchaseUrl: "https://s.shopee.com.br/5foQZD2RVq", position: 7, active: true },
  { id: 9, name: "Corrente Inox", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/atrSPItDrHwabIvY.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/TCRBYapQegtBZhcq.mp4", purchaseUrl: "https://s.shopee.com.br/40gCgQ9yQG", position: 8, active: true },
  { id: 10, name: "Emblema Adesivo Vasco", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/taSiSXspwAefBGIH.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/ZsnZivfoRChkPfsg.mp4", purchaseUrl: "https://s.shopee.com.br/2BEYTLXRQZ", position: 9, active: true },
  { id: 11, name: "Escudos Vasco", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/ZcMdOtITcZweEdHP.webp", purchaseUrl: "https://s.shopee.com.br/9V19Aiem2r", position: 10, active: true },
  { id: 12, name: "Faca Vasco", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/JkWfWQmnPWNwxygA.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/WIHckOlTsAgtOTnr.mp4", purchaseUrl: "https://s.shopee.com.br/50YjnsARlP", position: 11, active: true },
  { id: 13, name: "Garrafa Térmica", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/QmoUFUWPjaoRPyfZ.webp", purchaseUrl: "https://s.shopee.com.br/5LBaCsdDbS", position: 12, active: true },
  { id: 14, name: "Havaianas Vasco", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/JLAqMDiqeuTciMUY.webp", purchaseUrl: "https://s.shopee.com.br/6fgxlVMWX4", position: 13, active: true },
  { id: 15, name: "Kit 3 Quadros", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/UZvXFcDLhwvmlZTt.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/YWUQOYSXQSQNOxlF.mp4", purchaseUrl: "https://s.shopee.com.br/LmuIQp6o5", position: 14, active: true },
  { id: 16, name: "Kit Bottons Vasco", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/sMQgCLbIXcQAQNyg.webp", purchaseUrl: "https://s.shopee.com.br/5q7qpuAnPy", position: 15, active: true },
  { id: 17, name: "Kit Churrasco", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/hcMsbJwpAbLJGrNG.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/ibLXrIvUtXcHcvTH.mp4", purchaseUrl: "https://s.shopee.com.br/W6KR55Raf", position: 16, active: true },
  { id: 18, name: "Kit Churrasco 2", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/ecLpCPoVdENlMOMk.webp", purchaseUrl: "https://s.shopee.com.br/30nfQy2vwP", position: 17, active: true },
  { id: 19, name: "Kit Quadros Vasco", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/XoHZSjUSJwpVpJFQ.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/jsfRTRWVMpBhANaE.mp4", purchaseUrl: "https://s.shopee.com.br/AUtgO43X6A", alternatePurchaseUrl: "https://s.shopee.com.br/3g3MFdHW1y", description: "Link mais barato disponível na pasta enviada.", position: 18, active: true },
  { id: 20, name: "Maquete São Januário", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/jkJhhmhbWwRtNMUX.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/MZKtzvZUQKIlUniJ.mp4", purchaseUrl: "https://s.shopee.com.br/8fS2BgDgfJ", position: 19, active: true },
  { id: 21, name: "Painel De Led", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/WlDQXiTZABkNskGy.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/dIcalMgXVjaRTDIT.mp4", purchaseUrl: "https://s.shopee.com.br/2qUFCu8HA6", position: 20, active: true },
  { id: 22, name: "Quadro Personalizado", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/hxcJsQtImuNdyQli.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/jPJBCnSWCvckngmj.mp4", purchaseUrl: "https://s.shopee.com.br/3g3MGzeiBN", position: 21, active: true },
  { id: 23, name: "Quadro Vasco Alto Relevo", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/WIvtBYFOMFBRVWFC.webp", purchaseUrl: "https://s.shopee.com.br/30nfSXPLXd", position: 22, active: true },
  { id: 24, name: "Short Vasco", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/MLpAKEIpcqHBXzVn.webp", purchaseUrl: "https://s.shopee.com.br/AAGpw9Q104", position: 23, active: true },
  { id: 25, name: "Ônibus Vasco", section: "finds", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/EoHMLPPFOtCQmObv.webp", videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663919572969/VCcJgwfoswXQPvte.mp4", purchaseUrl: "https://s.shopee.com.br/8fS29rxKkZ", position: 24, active: true },
];
