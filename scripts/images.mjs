// Bildliste mit Prompts für die Generierung (Gemini). Ein Stil für alle Bilder,
// damit die Website wie aus einem Guss wirkt.

const STYLE =
  "Editorial architectural photography for a high-end architecture studio monograph. " +
  "Shot on a medium-format camera, natural light, soft shadows, subtle film grain, " +
  "muted warm palette of stone, oak, concrete and dusk light, calm and minimal composition, " +
  "photorealistic, ultra detailed materials. No people, no text, no logos, no watermark, no signage.";

const WIDE = "16:9";
const PORTRAIT = "4:5";

export const IMAGES = [
  // Haus am See – Potsdam
  {
    name: "haus-am-see",
    aspect: WIDE,
    prompt:
      "A modern lakeside family house in Brandenburg, three staggered horizontal levels following a gentle slope down to a calm lake, board-formed exposed concrete walls, floor-to-ceiling glazing, a wraparound larch wood terrace, pine trees, blue hour with warm interior light reflecting in the still water. Subject centered in the frame.",
  },
  {
    name: "haus-am-see-2",
    aspect: PORTRAIT,
    prompt:
      "Close-up detail of a vertical larch wood facade meeting board-formed exposed concrete, a deep window reveal, late afternoon sun raking across the textures, sharp shadow lines.",
  },
  {
    name: "haus-am-see-3",
    aspect: WIDE,
    prompt:
      "Interior of a minimalist living room in a lakeside house, floor-to-ceiling window looking onto a calm lake and pine trees, polished concrete floor, oak built-in shelving, a single linen sofa, soft morning light.",
  },
  // Speicher an der Spree – Umbau
  {
    name: "speicher-spree",
    aspect: WIDE,
    prompt:
      "A converted 1906 red brick grain warehouse on the river Spree in Berlin, six storeys, arched windows, a new rooftop extension in blackened steel and glass, dusk sky, warm lights inside, reflections on the river. Subject centered in the frame.",
  },
  {
    name: "speicher-spree-2",
    aspect: PORTRAIT,
    prompt:
      "Inside a converted brick warehouse: a tall light well cut through six floors, an open blackened steel staircase, historic cast iron columns, oak parquet, daylight falling from above.",
  },
  {
    name: "speicher-spree-3",
    aspect: WIDE,
    prompt:
      "Open-plan office floor inside a historic brick warehouse, exposed brick walls, cast iron columns, long oak tables, black steel window frames, soft overcast daylight, calm and empty.",
  },
  // Bibliothek am Kanal – Kultur
  {
    name: "bibliothek-am-kanal",
    aspect: WIDE,
    prompt:
      "A contemporary neighbourhood library on a Berlin canal, facade of reclaimed bricks in varied tones, large ground floor glazing, a wide timber seating staircase opening to the water, evening with the reading hall glowing from within. Subject centered in the frame.",
  },
  {
    name: "bibliothek-am-kanal-2",
    aspect: PORTRAIT,
    prompt:
      "Tall reading hall of a library with an exposed timber-concrete composite ceiling structure, floor-to-ceiling oak bookshelves forming quiet niches, soft diffuse daylight from clerestory windows.",
  },
  {
    name: "bibliothek-am-kanal-3",
    aspect: WIDE,
    prompt:
      "A wide timber seating staircase inside a library descending towards a large window overlooking a canal, warm oak, concrete, late afternoon sunlight, calm and empty.",
  },
  // Wohnhof Pankow – Wohnen
  {
    name: "wohnhof-pankow",
    aspect: WIDE,
    prompt:
      "A cooperative housing courtyard in Berlin: four timber-frame residential buildings with light lime-plaster facades and open wooden access balconies surrounding a lush green garden with trees, golden evening light. Subject centered in the frame.",
  },
  {
    name: "wohnhof-pankow-2",
    aspect: PORTRAIT,
    prompt:
      "Open wooden access gallery (Laubengang) of a timber housing building, rhythm of wooden posts, plants in pots, soft evening light, view into a green courtyard.",
  },
  {
    name: "wohnhof-pankow-3",
    aspect: WIDE,
    prompt:
      "Bright apartment interior in a timber building, exposed cross-laminated timber ceiling, lime plaster walls, clay tile floor, large window to a green courtyard, minimal furniture, morning light.",
  },
  // Atelierhaus Uckermark – Kultur
  {
    name: "atelierhaus-uckermark",
    aspect: WIDE,
    prompt:
      "An artist's studio house in the open countryside of the Uckermark, walls of rammed earth with visible horizontal layers, a low guest house with a deep thatched reed roof, Douglas fir window frames, rolling fields at sunset. Subject centered in the frame.",
  },
  {
    name: "atelierhaus-uckermark-2",
    aspect: PORTRAIT,
    prompt:
      "Inside a sculptor's studio with a large north-facing skylight, rammed earth walls, a few plaster sculptures on wooden plinths, even soft light, concrete floor.",
  },
  {
    name: "atelierhaus-uckermark-3",
    aspect: WIDE,
    prompt:
      "Close-up of a long rammed earth wall with fine horizontal layers in ochre and sand tones, low golden evening sun raking across the surface, grasses in the foreground, abstract and calm.",
  },
  // Pavillon an der Havel – Arbeiten
  {
    name: "pavillon-havel",
    aspect: WIDE,
    prompt:
      "A small lakeside pavilion on the river Havel: a thin flat corten steel roof floating on four slender columns above a wooden jetty, fully glazed sliding walls, a café inside, misty morning over the water. Subject centered in the frame.",
  },
  {
    name: "pavillon-havel-2",
    aspect: PORTRAIT,
    prompt:
      "Detail of the edge of a thin corten steel roof cantilevering over water, slender steel column, glass sliding door, reflections on a calm river, soft morning mist.",
  },
  {
    name: "pavillon-havel-3",
    aspect: WIDE,
    prompt:
      "Interior of a lakeside café pavilion with oak floor and furniture, glass walls fully opened to a wooden jetty and calm river, underside of a corten steel roof, summer morning light.",
  },
].map((img) => ({ ...img, prompt: `${img.prompt} ${STYLE}` }));
