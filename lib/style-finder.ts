export type FinderLocale = "en" | "el";
export type FinderResult = { matches: { id: string; reason: string }[]; question: string | null };
export type FinderStyle = { id: string; name: { en: string }; guide?: { summary: { en: string; el: string } } };
export const finderCopy = {
 en: { title: "Your idea, a little clearer.", intro: "Describe the tattoo you imagine. Tell us about lines, shading and colour—not just the subject.", entry: "Not sure which style? Describe your idea", label: "Your tattoo idea", placeholder: "An olive branch with thin black lines, very little shading and no colour…", submit: "Find my style", busy: "Exploring your idea…", preview: "Keyword preview · not AI", ai: "AI suggestions", privacy: "AI mode sends your description to OpenAI. Leave out names, contact details and other personal information.", local: "This preview looks for visual keywords on your device. It may miss context or unfamiliar wording.", results: "Styles to explore", caveat: "Starting points, not a final verdict. Styles can overlap; discuss your references with your artist.", follow: "A little more detail", update: "Refine suggestions", explore: "Find artists", back: "Back to tattoo styles", empty: "Let’s narrow the visual direction first.", error: "We couldn’t complete that request. Please try again.", invalid: "Please describe your idea using 10–1,200 characters.", answerInvalid: "Please add a short answer (up to 300 characters).", question: "Would you prefer thin lines, bold outlines, lifelike shading, or a cartoon look?", reset: "Start again", example: "Try an example", sample: "An olive branch with thin black lines, very little shading and no colour.", checking: "Checking availability…" },
 el: { title: "Η ιδέα σου, λίγο πιο ξεκάθαρη.", intro: "Περίγραψε το τατουάζ που φαντάζεσαι. Μίλησε για γραμμές, σκιές και χρώμα—όχι μόνο για το θέμα.", entry: "Δεν ξέρεις το στιλ; Περίγραψε την ιδέα σου", label: "Η ιδέα σου για τατουάζ", placeholder: "Ένα κλαδί ελιάς με λεπτές μαύρες γραμμές, ελάχιστη σκίαση και χωρίς χρώμα…", submit: "Βρες το στιλ μου", busy: "Εξερευνούμε την ιδέα σου…", preview: "Προεπισκόπηση με λέξεις-κλειδιά · χωρίς AI", ai: "Προτάσεις AI", privacy: "Η λειτουργία AI στέλνει την περιγραφή σου στο OpenAI. Μην συμπεριλάβεις ονόματα, στοιχεία επικοινωνίας ή άλλα προσωπικά δεδομένα.", local: "Η προεπισκόπηση αναζητά οπτικές λέξεις-κλειδιά στη συσκευή σου. Μπορεί να μην καταλάβει το πλαίσιο ή άγνωστες εκφράσεις.", results: "Στιλ που αξίζει να δεις", caveat: "Αφετηρίες, όχι οριστική απάντηση. Τα στιλ συνδυάζονται· συζήτησε τις αναφορές σου με τον καλλιτέχνη.", follow: "Λίγη ακόμα λεπτομέρεια", update: "Βελτίωσε τις προτάσεις", explore: "Βρες καλλιτέχνες", back: "Πίσω στα στιλ τατουάζ", empty: "Ας βρούμε πρώτα την οπτική κατεύθυνση.", error: "Δεν ολοκληρώθηκε το αίτημα. Δοκίμασε ξανά.", invalid: "Περίγραψε την ιδέα σου με 10–1.200 χαρακτήρες.", answerInvalid: "Πρόσθεσε μια σύντομη απάντηση (έως 300 χαρακτήρες).", question: "Προτιμάς λεπτές γραμμές, έντονα περιγράμματα, φυσικές σκιές ή εμφάνιση cartoon;", reset: "Ξεκίνα ξανά", example: "Δοκίμασε ένα παράδειγμα", sample: "Ένα κλαδί ελιάς με λεπτές γραμμές, ελάχιστη σκίαση και χωρίς χρώμα.", checking: "Έλεγχος διαθεσιμότητας…" }
} as const;

const terms: Record<string, string[]> = {
 "fine-line": ["fine line", "thin lines", "thin black lines", "thin outlines", "delicate lines", "λεπτες γραμμες", "λεπτα περιγραμματα"],
 blackwork: ["blackwork", "solid black", "black shapes", "negative space", "συμπαγες μαυρο", "μαυρα σχηματα"],
 traditional: ["traditional", "old school", "bold outlines", "limited palette", "εντονα περιγραμματα"],
 "neo-traditional": ["neo traditional", "neotraditional", "ornate", "διακοσμητικες λεπτομερειες"],
 japanese: ["japanese", "irezumi", "ιαπωνικο", "ιαπωνικη"],
 realism: ["realism", "realistic", "lifelike", "photographic", "ρεαλιστικο", "ρεαλιστικη", "φωτογραφικο", "σαν φωτογραφια", "φυσικες σκιες"],
 geometric: ["geometric", "geometry", "symmetry", "triangles", "γεωμετρικο", "γεωμετρικα", "συμμετρια", "τριγωνα"],
 watercolor: ["watercolor", "watercolour", "colour washes", "paint splashes", "ακουαρελα", "νερομπογια"],
 lettering: ["lettering", "script", "calligraphy", "quote", "καλλιγραφια", "γραμματοσειρα", "φραση"],
 dotwork: ["dotwork", "stippling", "tiny dots", "κουκκιδες", "στιγματα"],
 tribal: ["tribal", "polynesian", "πολυνησιακο", "πολυνησιακη"],
 "new-school": ["new school", "cartoon", "exaggerated", "καρτουν", "υπερβολικα σχηματα"]
};
const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[’']/g, "").replace(/-/g, " ");

// Conservative fallback: subjects such as roses/dragons alone never imply a style.
// This is deliberately labelled keyword preview, not language-model intelligence.
export function previewStyles(description: string, locale: FinderLocale, styles: FinderStyle[]): FinderResult {
 const input = normalize(description).replace(/neo traditional/g, "neotraditional");
 const clauses = input.split(/[.!?;,\n]|\bbut\b|\bαλλα\b/u);
 const matches = styles.map(style => {
  const hits = (terms[style.id] ?? []).filter(term => clauses.some(clause => {
   const words = normalize(term).replace(/neo traditional/g, "neotraditional");
   const index = clause.indexOf(words);
   if (index < 0 || /[\p{L}]/u.test(clause[index - 1] ?? "") || /[\p{L}]/u.test(clause[index + words.length] ?? "")) return false;
   // Reject negated clauses instead of guessing which details the negation covers.
   return !/(?:\b(?:no|not|without|avoid|dont)\b|δεν|χωρις|οχι)/u.test(clause.slice(0, index));
  }));
  return { id: style.id, score: hits.length, reason: (locale === "el" ? "Οπτικές ενδείξεις: " : "Visual cues: ") + hits.join(", ") + ". " + (style.guide?.summary[locale] ?? style.name.en) };
 }).filter(m => m.score > 0).sort((a,b) => b.score-a.score).slice(0,3);
 return { matches: matches.map(({id,reason}) => ({id,reason})), question: matches.length ? null : finderCopy[locale].question };
}

export function validFinderResult(value: unknown, ids: string[]): value is FinderResult {
 if (!value || typeof value !== "object") return false;
 const v=value as FinderResult;
 return Array.isArray(v.matches) && v.matches.length <= 3 && new Set(v.matches.map(m=>m?.id)).size === v.matches.length &&
  v.matches.every(m=>m && ids.includes(m.id) && typeof m.reason === "string" && m.reason.trim().length > 0 && m.reason.length <= 600) &&
  (v.question === null || typeof v.question === "string" && v.question.trim().length > 0 && v.question.length <= 400) && (v.matches.length > 0 || v.question !== null);
}
