export const wedding = {
  bride: "Ιωάννα",
  groom: "Βασίλης",
  namesJoined: "Ιωάννα & Βασίλης",
  /** Europe/Athens — date only; time TBD */
  dateISO: "2027-09-11T00:00:00+03:00",
  dateDisplay: "11 Σεπτεμβρίου 2027",
  dateShort: "11 · 09 · 2027",
  welcomeScript: "Καλωσορίσατε στην ιστορία αγάπης μας",
  heroLine: "Με χαρά σας προσκαλούμε στον γάμο μας",
  families: {
    title: "Οι οικογένειές μας",
    groomSide: {
      title: "Οικογένεια Γαμπρού",
      members: [
        "Παναγιώτης & Ελένη Μουζοπούλου",
        "Γεώργιος & Μαρία Μηλιαράκη",
      ],
    },
    koumparoi: {
      title: "Οι κουμπάροι μας",
      members: ["Νίκη-Άννα Αλμπέρτη & Σωτήρης Πρωτόπαππας"],
    },
  },
  ceremony: {
    title: "Το Μυστήριο",
    subtitle: "Το μυστήριο του γάμου μας θα γίνει",
    place: "Άγιος Νικόλαος",
    city: "Πειραιάς",
    address: "Άγιος Νικόλαος, Πειραιάς",
    mapQuery: "Ιερός Ναός Αγίου Νικολάου Πειραιά",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%CE%99%CE%B5%CF%81%CF%8C%CF%82+%CE%9D%CE%B1%CF%8C%CF%82+%CE%91%CE%B3%CE%AF%CE%BF%CF%85+%CE%9D%CE%B9%CE%BA%CE%BF%CE%BB%CE%AC%CE%BF%CF%85+%CE%A0%CE%B5%CE%B9%CF%81%CE%B1%CE%B9%CE%AC",
    embedUrl:
      "https://maps.google.com/maps?q=%CE%99%CE%B5%CF%81%CF%8C%CF%82+%CE%9D%CE%B1%CF%8C%CF%82+%CE%91%CE%B3%CE%AF%CE%BF%CF%85+%CE%9D%CE%B9%CE%BA%CE%BF%CE%BB%CE%AC%CE%BF%CF%85+%CE%A0%CE%B5%CE%B9%CF%81%CE%B1%CE%B9%CE%AC&z=16&output=embed",
  },
  prep: {
    title: "Προετοιμασία",
    bride: {
      title: "Προετοιμασία νύφης",
      address: "Κεφαλληνίας 24, Πειραιάς",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=%CE%9A%CE%B5%CF%86%CE%B1%CE%BB%CE%BB%CE%B7%CE%BD%CE%AF%CE%B1%CF%82+24+%CE%A0%CE%B5%CE%B9%CF%81%CE%B1%CE%B9%CE%AC%CF%82",
      embedUrl:
        "https://maps.google.com/maps?q=%CE%9A%CE%B5%CF%86%CE%B1%CE%BB%CE%BB%CE%B7%CE%BD%CE%AF%CE%B1%CF%82+24+%CE%A0%CE%B5%CE%B9%CF%81%CE%B1%CE%B9%CE%AC%CF%82&z=16&output=embed",
    },
    groom: {
      title: "Προετοιμασία γαμπρού",
      address: "Μυκόνου 29, Πειραιάς",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=%CE%9C%CF%85%CE%BA%CF%8C%CE%BD%CE%BF%CF%85+29+%CE%A0%CE%B5%CE%B9%CF%81%CE%B1%CE%B9%CE%AC%CF%82",
      embedUrl:
        "https://maps.google.com/maps?q=%CE%9C%CF%85%CE%BA%CF%8C%CE%BD%CE%BF%CF%85+29+%CE%A0%CE%B5%CE%B9%CF%81%CE%B1%CE%B9%CE%AC%CF%82&z=16&output=embed",
    },
  },
  reception: {
    title: "Η Δεξίωση",
    subtitle: "Η δεξίωση θα πραγματοποιηθεί",
    place: "Κτήμα Terra Verde",
    city: "Ταύρος",
    address: "Πάρκο Ηρώων, Ταύρος",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%CE%9A%CF%84%CE%AE%CE%BC%CE%B1+Terra+Verde+%CE%A4%CE%B1%CF%8D%CF%81%CE%BF%CF%82",
    embedUrl:
      "https://maps.google.com/maps?q=%CE%9A%CF%84%CE%AE%CE%BC%CE%B1+Terra+Verde+%CE%A4%CE%B1%CF%8D%CF%81%CE%BF%CF%82&z=15&output=embed",
  },
  openCta: "Πατήστε τη σφραγίδα για να ανοίξετε",
  directions: "Οδηγίες",
  countdownLabels: {
    days: "ΗΜΕΡΕΣ",
    hours: "ΩΡΕΣ",
    minutes: "ΛΕΠΤΑ",
    seconds: "ΔΕΥΤΕΡΟΛΕΠΤΑ",
  },
} as const;

export type WeddingContent = typeof wedding;
