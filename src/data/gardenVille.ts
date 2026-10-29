import logoGardenVille from '../assets/garden-ville-web/logo-garden-ville-branco.png'
import logoProtenge from '../assets/garden-ville-web/logo-protenge-branco.png'
import mapaLocalizacao from '../assets/garden-ville-web/mapa-localizacao.jpg'
import video from '../assets/garden-ville-web/video-garden-ville.mp4'
import videoPoster from '../assets/garden-ville-web/video-poster.jpg'
import videoDescanso from '../assets/garden-ville-web/video-descanso.mp4'
import videoDescansoPoster from '../assets/garden-ville-web/video-descanso-poster.jpg'

/**
 * Páginas da revista (p01 = capa, p42 = contracapa). Cada lâmina dupla do
 * Catalogo_Garden_Ville.pptx foi cortada ao meio, uma imagem por página.
 */
const files = import.meta.glob<string>('../assets/garden-ville-web/revista/*.jpg', {
  eager: true,
  import: 'default',
})

export const revista: string[] = Object.keys(files)
  .sort()
  .map((path) => files[path])

/** Proporção largura/altura de uma página da revista. */
export const PAGE_RATIO = 1400 / 1422

/** Menu da revista em tela cheia: onde cada seção começa (índice da página, p01 = 0). */
export const secoesRevista = [
  { nome: 'Apresentação', pagina: 1 },
  { nome: 'Portaria', pagina: 3 },
  { nome: 'Garden Club', pagina: 5 },
  { nome: 'Piscinas', pagina: 11 },
  { nome: 'Garden Festas', pagina: 15 },
  { nome: 'Espaço Gourmet', pagina: 17 },
  { nome: 'Academia', pagina: 19 },
  { nome: 'Garden Place', pagina: 21 },
  { nome: 'Garden Kids', pagina: 23 },
  { nome: 'Garden Sports', pagina: 25 },
  { nome: 'Garden Grill', pagina: 29 },
  { nome: 'Beach Tennis', pagina: 31 },
  { nome: 'Implantação', pagina: 35 },
  { nome: 'Localização', pagina: 37 },
  { nome: 'Protenge', pagina: 39 },
]

export const empreendimento = {
  nome: 'Garden Ville Residence',
  logo: logoGardenVille,
  logoConstrutora: logoProtenge,
  video,
  videoPoster,
  /** Vídeo vertical da tela de descanso. */
  videoDescanso,
  videoDescansoPoster,
  mapaLocalizacao,
  endereco: 'Avenida Henrique Mansano, 1102',
  cidade: 'Jd. Alpes - Londrina/PR',
  site: 'gardenvillelondrina.com.br',
  mapsUrl: 'https://maps.app.goo.gl/YhAPFffeD467ZddY6',
  mapsEmbed: (zoom: number) =>
    `https://www.google.com/maps?q=Avenida+Henrique+Mansano,+1102,+Londrina+-+PR&z=${zoom}&output=embed`,
}
