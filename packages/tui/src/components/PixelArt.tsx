import { useEffect, useMemo, useRef, useState, type Ref, type RefObject } from 'react';
import styled from 'styled-components';

type Grid = (string | null)[][];
type Point = readonly [number, number];

export interface SpriteDef {
  rows: string[];
  palette: Record<string, string>;
}

export interface NightSceneColors {
  moon: string;
  moonLight: string;
  star: string;
  starBright: string;
  ridgeBack: string;
  ridgeFront: string;
  city: string;
  // Дополнительные оттенки необязательны: прежняя палитра совместима.
  moonShade?: string;
  moonMid?: string;
  moonHighlight?: string;
  ridgeEdge?: string;
  ridgeShade?: string;
  cityEdge?: string;
  window?: string;
}

export interface NightSceneProps {
  /** Размер логической пиксельной сетки, а не CSS-размер. */
  width?: number;
  height?: number;
  maxScale?: number;
  minScale?: number;
  seed?: number;
  colors?: Partial<NightSceneColors>;
  /** Заполнить родителя с обрезкой; нижний край сцены остаётся видимым. */
  fill?: boolean;
  /**
   * С fill: cover — заполнить с обрезкой (по умолчанию), contain — целиком, без обрезки,
   * stretch — всегда во всю ширину: в высоком блоке сцена не растягивается, а сверху
   * достраивается небо со звёздами. Если блок шире сцены — как contain.
   */
  fit?: 'cover' | 'contain' | 'stretch';
  /** С fill: к какому краю прижать сцену по горизонтали. */
  align?: 'left' | 'center' | 'right';
  /** Область без звёзд в долях сцены, до обрезки через fill. */
  noStars?: { x: number; y: number; w: number; h: number };
  /**
   * Элемент поверх сцены (например, цитата): под ним звёзды не рисуются.
   * Размер и положение отслеживаются; пока элемент измерен, noStars не используется.
   */
  avoid?: RefObject<HTMLElement | null>;
  className?: string;
  title?: string;
}

const defaultColors: Required<NightSceneColors> = {
  moon: '#b388ff',
  moonLight: '#d2b6ff',
  moonShade: '#8f6ae0',
  moonMid: '#c3a0ff',
  moonHighlight: '#efe3ff',
  star: '#6b5a8f',
  starBright: '#e2d4ff',
  ridgeBack: '#2a2142',
  ridgeFront: '#1a1529',
  ridgeEdge: '#6c55a8',
  ridgeShade: '#3b2d63',
  city: '#14111f',
  cityEdge: '#54457e',
  window: '#e8c35a',
};

function dimension(value: number | undefined, fallback: number) {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value!)) : fallback;
}

function lcg(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// Шум зависит от координат: текстура не меняется при перерисовке React.
function noise(x: number, y: number, seed: number) {
  let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(seed, 144269);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

/** Чистая генерация сетки. Экспорт также позволяет получать SVG/PNG вне React. */
export function buildNightSceneGrid({
  width: requestedWidth = 288,
  height: requestedHeight = 100,
  seed = 7,
  colors: overrides,
  noStars,
}: Pick<NightSceneProps, 'width' | 'height' | 'seed' | 'colors' | 'noStars'> = {}): Grid {
  const width = dimension(requestedWidth, 288);
  const height = dimension(requestedHeight, 100);
  const c = { ...defaultColors, ...overrides };
  const grid: Grid = Array.from({ length: height }, () => Array(width).fill(null));
  const sx = width / 288;
  const sy = height / 100;
  const X = (x: number) => Math.round(x * sx);
  const Y = (y: number) => Math.round(y * sy);
  const put = (x: number, y: number, color: string | null) => {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < width && y < height) grid[y]![x] = color;
  };
  const rect = (x: number, y: number, w: number, h: number, color: string) => {
    for (let yy = Y(y); yy < Y(y + h); yy++) {
      for (let xx = X(x); xx < X(x + w); xx++) put(xx, yy, color);
    }
  };
  // Брезенхем: только целые пиксели, без сглаживания диагоналей.
  const line = (a: Point, b: Point, color: string, broken = false) => {
    let x = X(a[0]);
    let y = Y(a[1]);
    const x1 = X(b[0]);
    const y1 = Y(b[1]);
    const dx = Math.abs(x1 - x);
    const dy = -Math.abs(y1 - y);
    const stepX = x < x1 ? 1 : -1;
    const stepY = y < y1 ? 1 : -1;
    let error = dx + dy;
    while (true) {
      if (!broken || noise(x, y, seed + 41) > 0.22) put(x, y, color);
      if (x === x1 && y === y1) break;
      const e2 = 2 * error;
      if (e2 >= dy) { error += dy; x += stepX; }
      if (e2 <= dx) { error += dx; y += stepY; }
    }
  };
  const polygon = (points: readonly Point[], color: string) => {
    const p = points.map(([x, y]) => [X(x), Y(y)] as const);
    const low = Math.max(0, Math.min(...p.map((v) => v[1])));
    const high = Math.min(height - 1, Math.max(...p.map((v) => v[1])));
    for (let y = low; y <= high; y++) {
      const hits: number[] = [];
      for (let i = 0; i < p.length; i++) {
        const a = p[i]!;
        const b = p[(i + 1) % p.length]!;
        if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) {
          hits.push(a[0] + ((y - a[1]) * (b[0] - a[0])) / (b[1] - a[1]));
        }
      }
      hits.sort((a, b) => a - b);
      for (let i = 0; i + 1 < hits.length; i += 2) {
        for (let x = Math.max(0, Math.ceil(hits[i]!)); x <= Math.min(width - 1, Math.floor(hits[i + 1]!)); x++) {
          put(x, y, color);
        }
      }
    }
  };

  // Луна смещена влево от башни; её радиус одинаков по обеим осям.
  const cx = width * 0.35;
  const cy = height * 0.33;
  const r = Math.min(height * 0.30, width * 0.15);
  const bx = cx - r * 0.44;
  const by = cy - r * 0.14;
  const br = r * 0.94;
  const inMoon = (x: number, y: number) => (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r;

  const starPixel = (x: number, y: number, color: string) => {
    if (inMoon(x, y)) return;
    if (noStars && noStars.w > 0 && noStars.h > 0 &&
        x >= noStars.x * width && x < (noStars.x + noStars.w) * width &&
        y >= noStars.y * height && y < (noStars.y + noStars.h) * height) return;
    put(x, y, color);
  };
  const stars = lcg(seed);
  for (let i = 0; i < Math.round(width * height / 440); i++) {
    const x = Math.floor(stars() * width);
    const y = Math.floor(stars() * height * 0.78);
    starPixel(x, y, stars() > 0.90 ? c.starBright : c.star);
  }
  // Несколько характерных крестиков; noStars учитывается для каждого луча.
  for (const [x, y, size] of [[53, 8, 2], [37, 42, 2], [166, 27, 2], [181, 10, 1], [77, 54, 1], [143, 47, 1]]) {
    const xx = X(x!);
    const yy = Y(y!);
    const arm = Math.max(1, Math.round(size! * Math.min(sx, sy)));
    for (let d = -arm; d <= arm; d++) {
      starPixel(xx + d, yy, d === 0 ? c.starBright : c.star);
      starPixel(xx, yy + d, d === 0 ? c.starBright : c.star);
    }
  }

  // Кратеры нарисованы внутри маски серпа, а не поверх прозрачного выреза.
  const craters: readonly (readonly [number, number, number])[] = [
    [0.53, -0.46, 0.13], [0.73, -0.12, 0.10], [0.48, 0.35, 0.18],
    [0.12, 0.68, 0.10], [0.30, -0.72, 0.08], [0.65, 0.52, 0.07],
  ];
  for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(height - 1, Math.ceil(cy + r)); y++) {
    for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(width - 1, Math.ceil(cx + r)); x++) {
      if (!inMoon(x, y)) continue;
      const bite = Math.hypot(x + 0.5 - bx, y + 0.5 - by);
      if (bite < br) continue;
      const nx = (x + 0.5 - cx) / r;
      const ny = (y + 0.5 - cy) / r;
      const outer = Math.hypot(nx, ny);
      const fine = noise(x, y, seed + 13);
      const cluster = noise(Math.floor(x / 3), Math.floor(y / 3), seed + 17);
      const light = nx * 0.36 + ny * 0.10 + cluster * 0.38 + fine * 0.15;
      let color = light > 0.68 ? c.moonLight : light > 0.43 ? c.moonMid : c.moon;
      if (bite - br < r * 0.09) color = fine > 0.40 ? c.moonShade : c.moon;
      if (outer > 0.962) color = nx > 0.2 ? c.moonHighlight : c.moonLight;
      for (const [qx, qy, qr] of craters) {
        const distance = Math.hypot(nx - qx, ny - qy);
        if (distance < qr && fine > 0.18) color = c.moon;
        if (distance < qr * 0.65 && fine > 0.35) color = c.moonShade;
        if (distance > qr && distance < qr + 0.035 && ny > qy && fine > 0.28) color = c.moonLight;
      }
      put(x, y, color);
    }
  }

  // хребты
  const back: readonly Point[] = [
    [0, 91], [11, 87], [20, 85], [29, 78], [34, 81], [42, 72],
    [48, 69], [55, 62], [60, 66], [67, 74], [74, 77], [83, 79],
    [93, 85], [101, 83], [113, 88], [124, 84], [135, 86], [144, 79],
    [152, 80], [160, 76], [170, 82], [177, 80], [188, 86], [201, 82],
    [211, 75], [221, 68], [229, 73], [237, 80], [246, 83], [258, 86],
    [269, 90], [287, 93],
  ];
  polygon([...back, [288, 100], [0, 100]], c.ridgeBack);
  for (let i = 1; i < back.length; i++) line(back[i - 1]!, back[i]!, c.ridgeEdge, true);

  for (const face of [
    [[55, 63], [49, 72], [44, 77], [51, 75], [59, 83], [56, 75], [60, 72]],
    [[55, 63], [62, 68], [67, 76], [75, 81], [66, 78], [61, 73]],
    [[29, 79], [24, 85], [31, 82], [35, 87], [34, 82]],
    [[144, 80], [137, 87], [149, 85], [153, 82]],
    [[160, 77], [151, 86], [157, 87], [166, 82]],
    [[221, 69], [213, 77], [210, 83], [218, 79], [224, 87], [220, 77], [225, 75]],
    [[229, 74], [234, 82], [244, 86], [238, 81]],
  ] as const) polygon(face, c.ridgeShade);

  for (const [a, b] of [
    [[55, 64], [51, 70]], [[51, 70], [58, 77]], [[60, 68], [64, 72]],
    [[64, 72], [73, 77]], [[47, 73], [42, 79]], [[221, 70], [218, 75]],
    [[218, 75], [223, 81]], [[229, 76], [234, 82]],
  ] as const) line(a, b, c.ridgeEdge, true);

  const front: readonly Point[] = [
    [0, 96], [13, 94], [24, 95], [36, 90], [43, 92], [55, 87],
    [69, 91], [78, 90], [88, 94], [102, 90], [113, 92], [125, 89],
    [136, 93], [149, 90], [160, 93], [174, 89], [185, 91], [194, 89],
    [207, 94], [220, 91], [232, 94], [249, 90], [264, 94], [287, 96],
  ];
  polygon([...front, [288, 100], [0, 100]], c.ridgeFront);
  for (let i = 1; i < front.length; i++) line(front[i - 1]!, front[i]!, c.ridgeBack, true);

  // город
  const city = lcg(seed + 29);
  for (let x = 8; x < 280;) {
    const w = 2 + Math.floor(city() * 4);
    const cluster = x < 45 || (x > 151 && x < 196);
    const h = 2 + Math.floor(city() * (cluster ? 10 : 5));
    const top = 98 - h;
    rect(x, top, w, h + 2, c.city);
    line([x, top], [x + w - 1, top], c.cityEdge, true);
    line([x, top], [x, 99], c.cityEdge, true);
    if (h > 7 && city() > 0.4) line([x + 1, top - 2], [x + 1, top], c.cityEdge);
    for (let wy = top + 2; wy < 98; wy += 3) {
      for (let wx = x + 1; wx < x + w - 1; wx += 2) {
        if (city() > 0.52) put(X(wx), Y(wy), city() > 0.85 ? c.window : c.cityEdge);
      }
    }
    x += w + 1 + Math.floor(city() * 3);
  }

  // телебашня
  const tx = 181;
  line([tx, 39], [tx, 91], c.cityEdge);
  line([tx, 42], [tx, 46], c.moonLight);
  line([tx, 49], [tx, 66], c.moonShade);
  rect(tx - 1, 67, 3, 29, c.cityEdge);
  rect(tx, 68, 1, 27, c.moonShade);
  rect(tx - 2, 68, 5, 2, c.ridgeEdge);
  rect(tx - 1, 67, 3, 1, c.moon);
  rect(tx - 2, 71, 5, 1, c.moonMid);
  rect(tx - 1, 72, 3, 2, c.ridgeEdge);
  rect(tx - 1, 54, 3, 1, c.moon);
  put(X(tx), Y(38), c.starBright);

  return grid;
}

// Соседние пиксели объединяются в полосы, затем в один path на цвет.
// Даже подробная сцена создаёт лишь несколько SVG-элементов.
function pixelPaths(grid: Grid) {
  const paths = new Map<string, string[]>();
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const fill = row[x];
      if (!fill) { x++; continue; }
      let w = 1;
      while (x + w < row.length && row[x + w] === fill) w++;
      const commands = paths.get(fill) ?? [];
      commands.push(`M${x} ${y}h${w}v1h-${w}z`);
      paths.set(fill, commands);
      x += w;
    }
  });
  return Array.from(paths, ([fill, commands]) => ({ fill, d: commands.join('') }));
}

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
  image-rendering: pixelated;
  shape-rendering: crispEdges;
`;

const ALIGN_X = { left: 'xMin', center: 'xMid', right: 'xMax' } as const;

function Pixels({ grid, maxScale, minScale, fill, fit = 'cover', align = 'center', svgRef, className, title }: {
  grid: Grid;
  maxScale?: number;
  minScale?: number;
  fill?: boolean;
  fit?: 'cover' | 'contain';
  svgRef?: Ref<SVGSVGElement>;
  align?: 'left' | 'center' | 'right';
  className?: string;
  title?: string;
}) {
  const w = Math.max(0, ...grid.map((row) => row.length));
  const h = grid.length;
  const paths = useMemo(() => pixelPaths(grid), [grid]);
  if (!w || !h) return null;
  return (
    <Svg
      ref={svgRef}
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio={
        fill ? `${ALIGN_X[align]}YMax ${fit === 'contain' ? 'meet' : 'slice'}` : 'xMidYMid meet'
      }
      style={{
        ...(fill ? { height: '100%' } : { aspectRatio: `${w} / ${h}` }),
        ...(maxScale && maxScale > 0 ? { maxWidth: w * maxScale } : {}),
        ...(minScale && minScale > 0 ? { minWidth: w * minScale } : {}),
      }}
      role={title ? 'img' : 'presentation'}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {paths.map((path) => <path key={path.fill} fill={path.fill} d={path.d} />)}
    </Svg>
  );
}

export function PixelSprite({ sprite, maxScale, minScale, title, className }: {
  sprite: SpriteDef;
  maxScale?: number;
  minScale?: number;
  title?: string;
  className?: string;
}) {
  const grid = useMemo(() => sprite.rows.map((row) =>
    [...row].map((ch) => ch === '.' ? null : (sprite.palette[ch] ?? null)),
  ), [sprite]);
  return <Pixels grid={grid} maxScale={maxScale} minScale={minScale} title={title} className={className} />;
}

/** предел достраиваемого неба (строк пикселей) — дальше не растёт, верх неба срезается */
const MAX_EXTRA_SKY = 600;

type Region = { x: number; y: number; w: number; h: number };

/**
 * Полоса неба шириной width и высотой rows: только звёзды, фон прозрачный.
 * clear — область без звёзд в пикселях полосы.
 */
function buildSkyGrid(width: number, rows: number, seed: number, star: string, starBright: string, clear: Region | null): Grid {
  const grid: Grid = Array.from({ length: rows }, () => Array(width).fill(null));
  const rand = lcg(seed + 101);
  for (let i = 0; i < Math.round((width * rows) / 440); i++) {
    const x = Math.floor(rand() * width);
    const y = Math.floor(rand() * rows);
    const color = rand() > 0.9 ? starBright : star;
    if (clear && x >= clear.x && x < clear.x + clear.w && y >= clear.y && y < clear.y + clear.h) continue;
    grid[y]![x] = color;
  }
  return grid;
}

export function NightScene({
  width = 288,
  height = 100,
  seed = 7,
  colors,
  noStars,
  avoid,
  maxScale,
  minScale,
  fill,
  fit,
  align,
  className,
  title = 'Пиксельная ночь: сиреневая луна, горы и город с телебашней',
}: NightSceneProps) {
  const stretch = fill && fit === 'stretch';
  const svgRef = useRef<SVGSVGElement>(null);
  /** размер svg и прямоугольник avoid относительно него, в CSS-пикселях; null — не измерено */
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [hole, setHole] = useState<Region | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const el = avoid?.current ?? null;
    if (!svg || (!stretch && !el)) return;
    const measure = () => {
      const s = svg.getBoundingClientRect();
      setBox(s.width > 0 && s.height > 0 ? { w: s.width, h: s.height } : null);
      const r = el?.getBoundingClientRect();
      // элемент скрыт или не лежит поверх сцены — дырка не нужна
      const over = r && r.width > 0 && r.height > 0 &&
        r.right > s.left && r.left < s.right && r.bottom > s.top && r.top < s.bottom;
      setHole(over ? { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height } : null);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [stretch, avoid]);

  // сколько строк неба достроить сверху, чтобы сетка совпала с пропорциями блока;
  // шаг 2 — чтобы не пересобирать сцену на каждый пиксель ресайза
  const extra = stretch && box
    ? Math.min(MAX_EXTRA_SKY, Math.max(0, Math.round((width * (box.h / box.w) - height) / 2) * 2))
    : 0;
  const total = height + extra;
  // достроили — заполняем блок (срез максимум на строку пикселей от округления);
  // блок шире сцены — показываем целиком, прижав к align
  const pixelsFit = !stretch
    ? (fit === 'stretch' ? 'cover' : fit)
    : extra > 0 ? 'cover' : 'contain';

  // прямоугольник avoid → доли сетки: повторяем, как preserveAspectRatio кладёт сцену в svg
  let avoidRegion: Region | null = null;
  if (avoid && box && hole) {
    const cover = fill && pixelsFit !== 'contain';
    const scale = cover ? Math.max(box.w / width, box.h / total) : Math.min(box.w / width, box.h / total);
    const freeX = box.w - width * scale;
    const offX = !fill || align === 'center' || !align ? freeX / 2 : align === 'right' ? freeX : 0;
    const offY = fill ? box.h - total * scale : (box.h - total * scale) / 2;
    const pad = 2; // пикселя сетки вокруг элемента
    const x0 = Math.max(0, Math.floor((hole.x - offX) / scale) - pad);
    const y0 = Math.max(0, Math.floor((hole.y - offY) / scale) - pad);
    const x1 = Math.min(width, Math.ceil((hole.x + hole.w - offX) / scale) + pad);
    const y1 = Math.min(total, Math.ceil((hole.y + hole.h - offY) / scale) + pad);
    if (x1 > x0 && y1 > y0) avoidRegion = { x: x0 / width, y: y0 / total, w: (x1 - x0) / width, h: (y1 - y0) / total };
  }
  const clearArea = avoid && box ? avoidRegion : noStars;

  const c = { ...defaultColors, ...colors };
  const clearX = clearArea?.x ?? 0;
  const clearY = clearArea?.y ?? 0;
  const clearW = clearArea?.w ?? 0;
  const clearH = clearArea?.h ?? 0;
  const grid = useMemo(() => {
    // noStars задан в долях всей сетки (с достроенным небом): переводим в пиксели
    // и делим между полосой неба сверху и исходной сценой снизу
    const clear: Region | null = clearW > 0 && clearH > 0
      ? { x: Math.floor(clearX * width), y: Math.floor(clearY * total), w: Math.ceil(clearW * width), h: Math.ceil(clearH * total) }
      : null;
    const sceneTop = clear ? Math.max(clear.y, extra) : 0;
    const sceneBottom = clear ? Math.min(clear.y + clear.h, total) : 0;
    const sceneClear = clear && sceneBottom > sceneTop
      ? { x: clearX, y: (sceneTop - extra) / height, w: clearW, h: (sceneBottom - sceneTop) / height }
      : { x: 0, y: 0, w: 0, h: 0 };

    const scene = buildNightSceneGrid({
      width, height, seed,
      colors: {
        moon: c.moon, moonLight: c.moonLight, moonShade: c.moonShade,
        moonMid: c.moonMid, moonHighlight: c.moonHighlight,
        star: c.star, starBright: c.starBright,
        ridgeBack: c.ridgeBack, ridgeFront: c.ridgeFront,
        ridgeEdge: c.ridgeEdge, ridgeShade: c.ridgeShade,
        city: c.city, cityEdge: c.cityEdge, window: c.window,
      },
      noStars: sceneClear,
    });
    if (extra === 0) return scene;
    return [...buildSkyGrid(width, extra, seed, c.star, c.starBright, clear), ...scene];
  }, [
    width, height, extra, total, seed, clearX, clearY, clearW, clearH,
    c.moon, c.moonLight, c.moonShade, c.moonMid, c.moonHighlight,
    c.star, c.starBright, c.ridgeBack, c.ridgeFront, c.ridgeEdge,
    c.ridgeShade, c.city, c.cityEdge, c.window,
  ]);
  return <Pixels grid={grid} maxScale={maxScale} minScale={minScale} fill={fill} fit={pixelsFit} align={align} svgRef={svgRef} title={title} className={className} />;
}


