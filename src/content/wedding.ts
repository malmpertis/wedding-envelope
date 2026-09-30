export const wedding = {
  bride: "Ιωάννα",
  groom: "Βασίλης",
  namesJoined: "Βασίλης & Ιωάννα",
  /** Europe/Athens — add time when known, e.g. 2027-09-11T17:00:00+03:00 */
  dateISO: "2027-09-11T00:00:00+03:00",
  dateDisplay: "11 Σεπτεμβρίου 2027",
  dateShort: "11 · 09 · 2027",
  welcomeScript: "Welcome to our love story",
  heroLine:
    "Ενώνουμε τις ζωές μας και θα θέλαμε να είστε μαζί μας σ’ αυτή τη μοναδική στιγμή.",
  /**
   * Google Sheet via Apps Script (see scripts/google-sheets-apps-script.js).
   * 1) Paste the script into your Sheet → Deploy as Web app (Anyone)
   * 2) Put the Web app URL in `endpoint`
   * 3) Use the SAME string for `secret` here and SHARED_SECRET in the script
   * 4) Share the Sheet with your cousin
   */
  forms: {
    endpoint:
      "https://script.google.com/macros/s/AKfycby9N0sNt_mgHQhwS8iwaNsuNmPm-iQCavC-YGt0RXks2tWEFYx-k8TBJZAqrC8pPW6r/exec",
    secret: "wedding-bi-2027-change-me",
  },
  families: {
    title: "Οι οικογένειές μας",
    footnote:
      "Με αγάπη και χαρά στέκονται δίπλα μας σε αυτή τη σημαντική στιγμή της ζωής μας.",
    groomSide: {
      members: [
        "Παναγιώτης & Ελένη Μουζοπούλου",
        "Γεώργιος & Μαρία Μηλιαράκη",
      ],
    },
    koumparoi: {
      title: "Οι κουμπάροι μας",
      members: ["Νίκη-Άννα Αλμπέρτη & Σωτήρης Πρωτόπαππας"],
      footnote:
        "Οι άνθρωποι που μας στηρίζουν και θα σταθούν δίπλα μας και σε αυτό το ξεκίνημα.",
    },
  },
  ceremony: {
    title: "Το Μυστήριο",
    subtitle: "Θα γίνει στον Ιερό Ναό",
    place: "Αγίου Νικολάου",
    detail: "Πειραιάς",
    photo: {
      webp: "/venues/church.webp",
      jpg: "/venues/church.jpg",
      width: 720,
      height: 895,
    },
    mapsUrl: "https://maps.app.goo.gl/yUstqHDrHYF8Kt7T8",
    mapImage: "/maps/ceremony.jpg",
  },
  prep: {
    title: "Προετοιμασία",
    bride: {
      title: "Προετοιμασία νύφης",
      blurb: "Οι πιο όμορφες στιγμές ξεκινούν λίγο πριν το μυστήριο.",
      address: "Κεφαλληνίας 24, Πειραιάς",
      mapsUrl: "https://maps.app.goo.gl/qcsvz2kCuPGWzaNZ9",
      mapImage: "/maps/prep-bride.jpg",
    },
    groom: {
      title: "Προετοιμασία γαμπρού",
      blurb: "Με χαμόγελα, φίλους και πολλή αγάπη.",
      address: "Μυκόνου 29, Πειραιάς",
      mapsUrl: "https://maps.app.goo.gl/9nA65HWS4h9iPTqJ8",
      mapImage: "/maps/prep-groom.jpg",
    },
  },
  reception: {
    title: "Η Δεξίωσή μας",
    subtitle:
      "Μετά το μυστήριο, σας περιμένουμε να συνεχίσουμε τη γιορτή μας στο κτήμα",
    place: "Terra Verde",
    detail: "Πάρκο Ηρώων, Ταύρος",
    photo: {
      webp: "/venues/reception.webp",
      jpg: "/venues/reception.jpg",
      width: 1600,
      height: 683,
    },
    mapsUrl: "https://maps.app.goo.gl/ZRT1ocaDycsFT9467",
    mapImage: "/maps/reception.jpg",
  },
  rsvp: {
    title: "Επιβεβαίωση Παρουσίας",
    intro:
      "Θα χαρούμε πολύ να γνωρίζουμε αν θα μπορέσετε να είστε μαζί μας σε αυτή τη σημαντική ημέρα.",
    deadlineNote: "",
    submit: "Επιβεβαίωση Παρουσίας",
    attendanceOptions: [
      { value: "yes", label: "Ναι, με χαρά" },
      { value: "no", label: "Δυστυχώς όχι" },
      { value: "church-only", label: "Όχι, μόνο στην εκκλησία" },
    ],
  },
  wishes: {
    title: "Ευχές",
    intro:
      "Πείτε μας κάτι όμορφο για να το κρατήσουμε για πάντα μαζί μας. Οι λέξεις σας είναι το πιο πολύτιμο δώρο.",
    submit: "Στείλτε την ευχή σας",
  },
  openCta: "Πατήστε για άνοιγμα",
  mapLabel: "Χάρτης",
  closeEnvelope: "Κλείσιμο",
  backToEnvelope: "Πίσω",
  countdownLabels: {
    days: "ΗΜΕΡΕΣ",
    hours: "ΩΡΕΣ",
    minutes: "ΛΕΠΤΑ",
    seconds: "ΔΕΥΤΕΡΟΛΕΠΤΑ",
  },
  /**
   * Ambient music via a hidden YouTube player (audio only).
   * Swap youtubeVideoId for any royalty-free / CC track you prefer.
   */
  music: {
    youtubeVideoId: "yOFgvhYRcY8",
    volume: 35,
    creditUrl: "https://www.youtube.com/watch?v=yOFgvhYRcY8",
    creditLabel: "Μουσική: Romantic Day — Alex-Productions",
  },
  maker: {
    line: "Created with love ♥ by Michael Almpertis",
    instagramUrl: "https://www.instagram.com/michael_almpertis/",
    instagramLabel: "Instagram",
  },
} as const;

export type WeddingContent = typeof wedding;
