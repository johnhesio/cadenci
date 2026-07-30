const DIACRITICS_RE = /[̀-ͯ]/g;

function normalize(str) {
  return str.normalize("NFD").replace(DIACRITICS_RE, "").toLowerCase().trim();
}

export function matchService(text, services) {
  const norm = normalize(text);
  if (!norm) return null;

  let best = null;
  let bestScore = 0;

  for (const service of services) {
    const nameNorm = normalize(service.name);
    const categoryNorm = normalize(service.category);
    let score = 0;

    if (norm.includes(nameNorm) || nameNorm.includes(norm)) score += 3;
    if (norm.includes(categoryNorm)) score += 1;

    for (const word of nameNorm.split(/\s+/)) {
      if (word.length > 2 && norm.includes(word)) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      best = service;
    }
  }

  return bestScore > 0 ? best : null;
}
