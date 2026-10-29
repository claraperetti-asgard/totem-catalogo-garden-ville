import logoGardenVille from '../assets/garden-ville-web/logo-garden-ville.png'
import logoProtenge from '../assets/garden-ville-web/logo-protenge.jpg'
import mapaLocalizacao from '../assets/garden-ville-web/mapa-localizacao.jpg'
import video from '../assets/garden-ville-web/video-garden-ville.mp4'
import videoPoster from '../assets/garden-ville-web/video-poster.jpg'

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

export const empreendimento = {
  nome: 'Garden Ville Residence',
  logo: logoGardenVille,
  logoConstrutora: logoProtenge,
  video,
  videoPoster,
  mapaLocalizacao,
  endereco: 'Avenida Henrique Mansano, 1102',
  cidade: 'Jd. Alpes - Londrina/PR',
  site: 'gardenvillelondrina.com.br',
  mapsUrl: 'https://maps.app.goo.gl/YhAPFffeD467ZddY6',
  mapsEmbed:
    'https://www.google.com/maps?q=Avenida+Henrique+Mansano,+1102,+Londrina+-+PR&z=15&output=embed',
}
