export type Lang = 'en' | 'mr'

/** Short line in both languages — for people new to apps */
export type Bi = { en: string; mr: string }

export const strings = {
  en: {
    appName: 'SIR voter helper',
    appTag: 'Easy mode',
    navWork: 'SIR dashboard',
    navPdf: 'Source records',
    sidebarJumpLabel: 'Jump to section',
    jumpBooth: '1 · Voter numbers',
    jumpDeletion: '2 · List safety',
    jumpMobilization: '3 · Voter outreach',
    sidebarFoot:
      'Simple view: key numbers first, details below. Connect live data when ready.',
    langEn: 'English',
    langMr: 'मराठी',
    statTotal: 'Total voters (cover page)',
    statTotalHint: 'Male / female from extracted records',
    statDup: 'List needs checking',
    statDupHint: 'Same voter number twice in sample part',
    statYouth: 'Young voters 18–25',
    statYouthHint: 'Counted from extracted ages',
    statScenario: 'Practice alerts (example)',
    statScenarioHint: 'Example data — for training',
    boothTitle: 'Voter numbers by area',
    boothSubtitle:
      'See booth totals, age mix, and risk in one place.',
    deletionTitle: 'Stop wrong removals',
    deletionSubtitle:
      'See warning signals and prepare objection drafts safely.',
    mobilizationTitle: 'Meet voters after SIR',
    mobilizationSubtitle:
      'Find target voters and use ready outreach messages.',
    pdfTitle: 'Source record viewer',
    pdfSubtitle:
      'Open source file and check the extraction summary.',
    commonOpen: 'Open',
    commonBackTip: 'Use “All SIR tools” on the left to return to the main screen.',
  },
  mr: {
    appName: 'SIR मतदार मदत',
    appTag: 'सोपी आवृत्ती',
    navWork: 'SIR डॅशबोर्ड',
    navPdf: 'स्रोत नोंदी',
    sidebarJumpLabel: 'विभागात जा',
    jumpBooth: '१ · मतदार संख्या',
    jumpDeletion: '२ · यादी सुरक्षा',
    jumpMobilization: '३ · मतदार संपर्क',
    sidebarFoot:
      'सोपे दृश्य: आधी महत्वाचे आकडे, खाली तपशील. live डेटा नंतर जोडा.',
    langEn: 'English',
    langMr: 'मराठी',
    statTotal: 'एकूण मतदार (मथळा)',
    statTotalHint: 'पुरुष / स्त्री (निघालेल्या नोंदी)',
    statDup: 'यादी तपासा',
    statDupHint: 'एकच मतदार क्रमांक दोनदा',
    statYouth: 'तरुण १८–२५',
    statYouthHint: 'निघालेल्या वयावरून',
    statScenario: 'सराव सूचना (नमुना)',
    statScenarioHint: 'नमुना डेटा — शिकण्यासाठी',
    boothTitle: 'बूथानुसार मतदार',
    boothSubtitle:
      'एकाच ठिकाणी बूथ एकूण, वयोगट आणि जोखीम पहा.',
    deletionTitle: 'चुकीचे हटाव रोका',
    deletionSubtitle:
      'सूचना संकेत पहा आणि आपत्ती मसुदा सुरक्षितपणे तयार करा.',
    mobilizationTitle: 'SIR नंतर संपर्क',
    mobilizationSubtitle:
      'लक्ष्य मतदार शोधा आणि तयार संदेश वापरा.',
    pdfTitle: 'स्रोत नोंद दर्शक',
    pdfSubtitle:
      'स्रोत फाइल उघडा आणि extraction सारांश तपासा.',
    commonOpen: 'उघडा',
    commonBackTip:
      'मुख्य स्क्रीनवर परत यायला डावीकडे “सर्व SIR साधने” वापरा.',
  },
} as const

export type UiStrings = (typeof strings)[Lang]

export function pickLang(lang: Lang): UiStrings {
  return strings[lang]
}

/** Friendly dual-language note at the top of each merged section */
export const pageTips: Record<'booth' | 'deletion' | 'mobilization' | 'pdf', Bi> = {
  booth: {
    en: 'This section shows tables and charts from extracted source records. You do not need to understand every column — ask your data person if something is unclear.',
    mr: 'या विभागात निघालेल्या स्रोत नोंदींच्या सारण्या आणि आलेख आहेत. प्रत्येक स्तंभ समजणे भाग नाही — काही शंका असल्यास डेटा माणसाला विचारा.',
  },
  deletion: {
    en: 'This section helps watch lists and write a letter if someone was removed by mistake. The list of numbers comes from extracted records — it means “check these twice”, not “deleted voters”.',
    mr: 'या विभागात यादी पाहणे आणि चुकीने नाव काढले असल्यास पत्र तयार करणे. क्रमांक निघालेल्या नोंदीतून — “दोनदा तपासा” म्हणजे “हटवलेले मतदार” नाही.',
  },
  mobilization: {
    en: 'This section shows how many voters were found in extracted records, especially young ages, and gives short message ideas in Marathi and English. Online mood numbers are only examples.',
    mr: 'या विभागात निघालेल्या नोंदीत किती मतदार सापडले, विशेषतः तरुण, आणि मराठी/इंग्रजीत लहान संदेश. ऑनलाइन मूड फक्त नमुना आहे.',
  },
  pdf: {
    en: 'Here you open any ingested source file like a book. Scroll with mouse or finger. Download if needed.',
    mr: 'येथे इंजेस्ट केलेली स्रोत फाइल उघडा — पुस्तकासारखी. माउस किंवा बोटाने स्क्रोल करा. गरज असल्यास डाउनलोड करा.',
  },
}
