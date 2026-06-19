import { localizedText } from '@shared/domain/localized-content';
import { BrandType } from '@domain/brand/entities/brand-type';

const L = localizedText;

export const DEMO_BRANDS = [
  {
    slug: 'nomad-kitchen',
    type: BrandType.RESTAURANT,
    name: L('Nomad Kitchen', 'Номад Kitchen'),
    description: L(
      'Modern Mongolian fusion dining in the heart of the city.',
      'Хотын төвд орчин үеийн Монгол fusion хоол.',
    ),
    phone: '+976 7711 2233',
    address: L('Peace Avenue 12', 'Энхтайваны өргөн чөлөө 12'),
    sortOrder: 0,
  },
  {
    slug: 'steppe-grill',
    type: BrandType.RESTAURANT,
    name: L('Steppe Grill', 'Талын Grill'),
    description: L(
      'Premium steakhouse with local ingredients.',
      'Орон нутгийн түүхий эдтэй премиум стейк хаус.',
    ),
    phone: '+976 7711 4455',
    address: L('Seoul Street 8', 'Сөүлийн гудамж 8'),
    sortOrder: 1,
  },
  {
    slug: 'skyline-events',
    type: BrandType.EVENT,
    name: L('Skyline Events', 'Skyline Арга хэмжээ'),
    description: L(
      'Rooftop venue for weddings and corporate events.',
      'Гэрлэлт, корпорат арга хэмжээний дээврийн танхим.',
    ),
    phone: '+976 7711 6677',
    address: L('Business Tower 25F', 'Бизнес цамхаг 25 давхар'),
    sortOrder: 2,
  },
  {
    slug: 'heritage-hall',
    type: BrandType.EVENT,
    name: L('Heritage Hall', 'Heritage Танхим'),
    description: L(
      'Traditional hall for cultural celebrations.',
      'Соёлын арга хэмжээний уламжлалт танхим.',
    ),
    phone: '+976 7711 8899',
    address: L('Culture District 3', 'Соёлын дүүрэг 3'),
    sortOrder: 3,
  },
] as const;

export const DEMO_HISTORY = [
  {
    year: 2014,
    title: L('Founded', 'Үүсгэн байгуулагдсан'),
    description: L(
      'Opened our first restaurant brand.',
      'Эхний ресторан брэндээ нээлээ.',
    ),
    sortOrder: 0,
  },
  {
    year: 2018,
    title: L('Expanded to events', 'Арга хэмжээнд өргөжсөн'),
    description: L(
      'Launched event venue operations.',
      'Арга хэмжээний танхимын үйл ажиллагаа эхлүүлэв.',
    ),
    sortOrder: 1,
  },
  {
    year: 2022,
    title: L('Four brands', 'Дөрвөн брэнд'),
    description: L(
      'Reached four active brands.',
      'Дөрвөн идэвхтэй брэндтэй боллоо.',
    ),
    sortOrder: 2,
  },
] as const;

export const DEMO_LEADERSHIP = [
  {
    name: 'Bold Ganbaatar',
    title: L('CEO', 'Гүйцэтгэх захирал'),
    quote: L('Quality is our promise.', 'Чанар бол бидний амлалт.'),
    sortOrder: 0,
  },
  {
    name: 'Saruul Erdene',
    title: L('COO', 'Үйл ажиллагааны захирал'),
    quote: L('Every guest matters.', 'Бүх зочин чухал.'),
    sortOrder: 1,
  },
] as const;

export const DEMO_TEAM = [
  {
    name: 'Tuya Bat',
    role: L('Head Chef', 'Тэргүүн тогооч'),
    sortOrder: 0,
  },
  {
    name: 'Munkh Orgil',
    role: L('Event Manager', 'Арга хэмжээний менежер'),
    sortOrder: 1,
  },
  {
    name: 'Nomin Purev',
    role: L('Marketing Lead', 'Маркетингийн ахлах'),
    sortOrder: 2,
  },
] as const;

export const DEMO_MENU_ITEMS = [
  {
    brandSlug: 'nomad-kitchen',
    category: L('Main', 'Үндсэн хоол'),
    name: L('Khorkhog Lamb', 'Хорхог хонь'),
    description: L(
      'Slow-cooked lamb with vegetables.',
      'Хонь мах, хүнсний ногоотой удаан шөлөнгөөр хийсэн.',
    ),
    price: 28000,
    sortOrder: 0,
  },
  {
    brandSlug: 'nomad-kitchen',
    category: L('Main', 'Үндсэн хоол'),
    name: L('Buuz Platter', 'Буузны таваг'),
    description: L('Steamed dumplings, 12 pieces.', 'Жигнэсэн бууз 12 ширхэг.'),
    price: 15000,
    sortOrder: 1,
  },
  {
    brandSlug: 'steppe-grill',
    category: L('Grill', 'Гриль'),
    name: L('Ribeye Steak', 'Ribeye стейк'),
    description: L('300g premium ribeye.', '300г премиум ribeye.'),
    price: 45000,
    sortOrder: 0,
  },
] as const;

export const DEMO_BRAND_EVENTS = [
  {
    brandSlug: 'skyline-events',
    title: L('Summer Wedding Showcase', 'Зуны гэрлэлтийн үзэсгэлэн'),
    description: L(
      'Open house for couples planning weddings.',
      'Гэрлэлт төлөвлөж буй хосуудад зориулсан нээлттэй өдөр.',
    ),
    eventDate: new Date('2026-07-15T18:00:00'),
    location: L('Skyline Rooftop', 'Skyline дээвэр'),
    sortOrder: 0,
  },
  {
    brandSlug: 'heritage-hall',
    title: L('Naadam Celebration', 'Наадамын баяр'),
    description: L('Traditional cultural evening.', 'Уламжлалт соёлын орой.'),
    eventDate: new Date('2026-07-11T17:00:00'),
    location: L('Heritage Hall Main', 'Heritage үндсэн танхим'),
    sortOrder: 0,
  },
] as const;
