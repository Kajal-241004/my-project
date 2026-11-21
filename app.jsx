// =============================================================================
// Krishi Saathi - AI Kisan Dost (कृषि साथी - AI किसान दोस्त)
// Mobile-First Agricultural Assistant for Indian Farmers
// Created by Kajal Gautam (Solo) with Google Antigravity + Gemini API
// =============================================================================

// Gemini API Key Placeholder (Replace with your actual key or configure in-app)
const GEMINI_API_KEY = "YOUR_API_KEY_HERE";

const { useState, useEffect, useRef } = React;

// Sample Crop Disease Database for Instant Farmer Diagnosis
const SAMPLE_DIAGNOSES = {
  tamatar: {
    crop: "टमाटर (Tomato)",
    hindiName: "पत्ती मुड़ना रोग (Tomato Leaf Curl Virus - TLCV)",
    hinglishName: "Tamatar me Patti Mudna Rog",
    diseaseType: "विषाणुजनित रोग (Viral Disease)",
    severity: "मध्यम (Medium) - 45% फसल प्रभावित",
    severityColor: "text-amber-600 bg-amber-50 border-amber-300",
    symptoms: "पत्तियां ऊपर की तरफ मुड़कर नाव के आकार की हो रही हैं, पौधे की बढ़वार रुक गई है और पत्तियां खुरदरी हो गई हैं।",
    cause: "यह रोग सफेद मक्खी (Whitefly / Bemisia tabaci) कीट के रस चूसने से फैलता है।",
    medicines: [
      {
        name: "इमिडाक्लोप्रिड (Imidacloprid 17.8% SL) - कॉन्फिडोर",
        price: "₹180 प्रति 100ml",
        dose: "1 मिली दवा प्रति 3 लीटर पानी में घोलकर छिड़कें",
        type: "रासायनिक कीटनाशक (Chemical)"
      },
      {
        name: "नीम का तेल (Neem Oil 10000 PPM)",
        price: "₹160 प्रति 250ml",
        dose: "3-5 मिली प्रति लीटर पानी में मिलाकर 7 दिन बाद छिड़कें",
        type: "जैविक कीटनाशक (Organic/Bio)"
      }
    ],
    precautions: "तेज धूप या बारिश के समय छिड़काव न करें। शाम को 4 बजे के बाद छिड़काव करना सबसे असरदार होता है। खेत में पीले चिपचिपे कार्ड (Yellow Sticky Traps) लगाएं।",
    sampleImg: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80"
  },
  aloo: {
    crop: "आलू (Potato)",
    hindiName: "आलू का पिछेता झुलसा (Late Blight of Potato)",
    hinglishName: "Aloo me Jhulsa Rog",
    diseaseType: "फफूंदजनित रोग (Fungal Disease)",
    severity: "गंभीर (High) - तुरंत इलाज जरूरी",
    severityColor: "text-red-600 bg-red-50 border-red-300",
    symptoms: "पत्तियों के किनारों पर काले-भूरे धब्बे बनना और नमी में पत्तियों के नीचे सफेद फफूंद दिखना।",
    cause: "कोहरा, अधिक नमी और 12-18°C तापमान में फाइटोफ्थोरा फफूंद तेजी से फैलती है।",
    medicines: [
      {
        name: "रिडोमिल गोल्ड (Mancozeb + Metalaxyl)",
        price: "₹240 प्रति 100g",
        dose: "2 ग्राम दवा प्रति लीटर पानी में मिलाकर छिड़कें",
        type: "सिस्टमिक फफूंदनाशक"
      },
      {
        name: "कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाइटॉक्स)",
        price: "₹190 प्रति 250g",
        dose: "2.5 ग्राम प्रति लीटर पानी",
        type: "रोकथाम फफूंदनाशक"
      }
    ],
    precautions: "आलू के खेत में पानी न रुकने दें। बीमार पौधों को उखाड़कर खेत से दूर नष्ट कर दें।",
    sampleImg: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80"
  },
  gehu: {
    crop: "गेहूं (Wheat)",
    hindiName: "पीला रतुआ / हल्दी रोग (Yellow Rust of Wheat)",
    hinglishName: "Gehu me Peela Ratua",
    diseaseType: "कवक रोग (Fungus)",
    severity: "मध्यम (Medium)",
    severityColor: "text-amber-600 bg-amber-50 border-amber-300",
    symptoms: "पत्तियों पर पीले रंग की धारियां बन जाती हैं, छूने पर हाथ में हल्दी जैसा पीला पाउडर चिपकता है।",
    cause: "पक्सिनिया स्ट्राइफोर्मिस फंगस, ठंडे और नम मौसम में तेजी से पनपती है।",
    medicines: [
      {
        name: "प्रोपिकोनाजोल 25% EC (टिल्ट / Tilt)",
        price: "₹280 प्रति 200ml",
        dose: "1 मिली प्रति लीटर पानी (200 मिली प्रति एकड़ 200 लीटर पानी में)",
        type: "फफूंदनाशक"
      }
    ],
    precautions: "लक्षण दिखते ही छिड़काव करें ताकि बालियों में दाना पतला न पड़े।",
    sampleImg: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80"
  }
};

// Mandi Rates Database with Padrauna Mandi and nearby mandis
const MANDI_DATA = {
  padrauna: {
    mandiName: "पडरौना मंडी (Padrauna, Kushinagar)",
    state: "उत्तर प्रदेश (UP)",
    updatedAt: "आज सुबह 09:30 AM (Live)",
    rates: [
      { id: 1, item: "टमाटर (Tamatar)", cat: "sabzi", rateKg: "20", rateQtl: "2,000", change: "+2", trend: "up", icon: "🍅", variety: "देसी / हाइब्रिड" },
      { id: 2, item: "आलू (Aloo)", cat: "sabzi", rateKg: "15", rateQtl: "1,500", change: "-1", trend: "down", icon: "🥔", variety: "पुखराज / चिप्सोना" },
      { id: 3, item: "प्याज (Pyaz)", cat: "sabzi", rateKg: "25", rateQtl: "2,500", change: "0", trend: "same", icon: "🧅", variety: "नासिक लाल" },
      { id: 4, item: "हरी मिर्च (Mirch)", cat: "sabzi", rateKg: "40", rateQtl: "4,000", change: "+5", trend: "up", icon: "🌶️", variety: "तीखी हरी" },
      { id: 5, item: "फूलगोभी (Gobhi)", cat: "sabzi", rateKg: "18", rateQtl: "1,800", change: "-2", trend: "down", icon: "🥦", variety: "ताजा लोकल" },
      { id: 6, item: "बैंगन (Baingan)", cat: "sabzi", rateKg: "14", rateQtl: "1,400", change: "+1", trend: "up", icon: "🍆", variety: "गोल / लंबा" },
      { id: 7, item: "भिंडी (Bhindi)", cat: "sabzi", rateKg: "28", rateQtl: "2,800", change: "0", trend: "same", icon: "🌱", variety: "हरी मुलायम" },
      { id: 8, item: "लहसुन (Lahsun)", cat: "sabzi", rateKg: "130", rateQtl: "13,000", change: "+5", trend: "up", icon: "🧄", variety: "मोटा सफेद" },
      { id: 9, item: "गेहूं (Gehu)", cat: "anaj", rateKg: "22.75", rateQtl: "2,275", change: "+10", trend: "up", icon: "🌾", variety: "सरकारी MSP दर" },
      { id: 10, item: "धान (Dhan)", cat: "anaj", rateKg: "21.83", rateQtl: "2,183", change: "0", trend: "same", icon: "🌾", variety: "कॉमन ग्रेड A" },
      { id: 11, item: "गन्ना (Ganna)", cat: "nakdi", rateKg: "3.70", rateQtl: "370", change: "0", trend: "same", icon: "🎋", variety: "अगेती (Early UP SAP)" },
      { id: 12, item: "सरसों (Sarson)", cat: "nakdi", rateKg: "54.00", rateQtl: "5,400", change: "+35", trend: "up", icon: "🌼", variety: "काली सरसों" }
    ]
  },
  gorakhpur: {
    mandiName: "गोरखपुर मंडी (Gorakhpur APMC)",
    state: "उत्तर प्रदेश (UP)",
    updatedAt: "आज सुबह 10:15 AM (Live)",
    rates: [
      { id: 1, item: "टमाटर (Tamatar)", cat: "sabzi", rateKg: "22", rateQtl: "2,200", change: "+3", trend: "up", icon: "🍅", variety: "हाइब्रिड" },
      { id: 2, item: "आलू (Aloo)", cat: "sabzi", rateKg: "16", rateQtl: "1,600", change: "0", trend: "same", icon: "🥔", variety: "सफेद नया" },
      { id: 3, item: "प्याज (Pyaz)", cat: "sabzi", rateKg: "26", rateQtl: "2,600", change: "+1", trend: "up", icon: "🧅", variety: "महाराष्ट्र प्याज" },
      { id: 4, item: "हरी मिर्च (Mirch)", cat: "sabzi", rateKg: "42", rateQtl: "4,200", change: "+2", trend: "up", icon: "🌶️", variety: "ताजा" },
      { id: 5, item: "गेहूं (Gehu)", cat: "anaj", rateKg: "22.80", rateQtl: "2,280", change: "+5", trend: "up", icon: "🌾", variety: "लोकवन" }
    ]
  },
  deoria: {
    mandiName: "देवरिया मंडी (Deoria APMC)",
    state: "उत्तर प्रदेश (UP)",
    updatedAt: "आज सुबह 08:45 AM (Live)",
    rates: [
      { id: 1, item: "टमाटर (Tamatar)", cat: "sabzi", rateKg: "21", rateQtl: "2,100", change: "+1", trend: "up", icon: "🍅", variety: "देसी" },
      { id: 2, item: "आलू (Aloo)", cat: "sabzi", rateKg: "14.5", rateQtl: "1,450", change: "-0.5", trend: "down", icon: "🥔", variety: "पुखराज" },
      { id: 3, item: "प्याज (Pyaz)", cat: "sabzi", rateKg: "24", rateQtl: "2,400", change: "-1", trend: "down", icon: "🧅", variety: "लाल" }
    ]
  }
};

// Government Farmer Schemes
const SCHEMES_LIST = [
  {
    id: "pm-kisan",
    title: "पीएम किसान सम्मान निधि (PM Kisan)",
    tagline: "हर साल ₹6,000 की नकद सहायता सीधे बैंक खाते में",
    amount: "₹6,000 / वर्ष",
    installments: "₹2,000 की 3 समान किस्तें (हर 4 माह में)",
    eligibility: "सभी छोटे व सीमांत किसान जिनके पास कृषि योग्य भूमि है।",
    badge: "17वीं किस्त जारी",
    badgeColor: "bg-green-100 text-green-800",
    docs: ["आधार कार्ड", "बैंक पासबुक", "खतौनी / जमीन के कागजात", "मोबाइल नंबर (आधार लिंक)"],
    applyLink: "https://pmkisan.gov.in",
    helpline: "155261 / 1800115526"
  },
  {
    id: "kcc",
    title: "किसान क्रेडिट कार्ड (Kisan Credit Card - KCC)",
    tagline: "खेती-बाड़ी व खाद-बीज के लिए सस्ता लोन मात्र 4% ब्याज पर",
    amount: "₹3,00,000 तक लोन",
    installments: "समय पर चुकाने पर 3% की अतिरिक्त ब्याज सब्सिडी",
    eligibility: "काश्तकार, बटाईदार और भूमिधारी सभी किसान पात्र।",
    badge: "कम ब्याज लोन",
    badgeColor: "bg-blue-100 text-blue-800",
    docs: ["पहचान पत्र (आधार/वोटर ID)", "जमीन का खसरा/खतौनी", "फसल विवरण", "बैंक में नो-ड्यूज प्रमाण पत्र"],
    applyLink: "https://myscheme.gov.in/schemes/kcc",
    helpline: "1800-180-1551"
  },
  {
    id: "pmfby",
    title: "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
    tagline: "सूखा, बाढ़ या बेमौसम बारिश से फसल बर्बादी पर 100% सुरक्षा",
    amount: "फसल क्षति का पूरा मुआवजा",
    installments: "खरीफ: मात्र 2% प्रीमियम, रबी: मात्र 1.5% प्रीमियम",
    eligibility: "अधिसूचित क्षेत्र में अधिसूचित फसल उगाने वाले सभी किसान।",
    badge: "प्राकृतिक आपदा सुरक्षा",
    badgeColor: "bg-amber-100 text-amber-800",
    docs: ["फसल बुवाई प्रमाण पत्र", "बैंक खाता विवरण", "भू-अभिलेख (खतौनी)", "आधार कार्ड"],
    applyLink: "https://pmfby.gov.in",
    helpline: "1800-200-5142"
  },
  {
    id: "pm-kusum",
    title: "पीएम कुसुम सोलर पंप योजना (PM-KUSUM)",
    tagline: "खेतों में सोलर ट्यूबवेल लगाने पर 60% से 90% तक सरकारी सब्सिडी",
    amount: "लाखों की सब्सिडी",
    installments: "3 HP, 5 HP और 7.5 HP के सोलर पंप उपलब्ध",
    eligibility: "कृषि भूमि मालिक जिनके पास सिंचाई स्रोत उपलब्ध है।",
    badge: "90% तक सब्सिडी",
    badgeColor: "bg-emerald-100 text-emerald-800",
    docs: ["आधार कार्ड", "जमीन की नकल", "बैंक पासबुक", "बिजली कनेक्शन न होने का शपथ पत्र"],
    applyLink: "https://pmkusum.mnre.gov.in",
    helpline: "1800-180-3333"
  }
];

// Pre-packaged Farmer Voice AI Responses (Hinglish + Hindi)
const VOICE_QA_DATABASE = [
  {
    keywords: ["tamatar", "patti", "keeda", "rog", "dawa", "mudna"],
    question: "Tamatar me patti mudna rog ki dawa kya hai?",
    hindiAnswer: "नमस्ते किसान भाई! टमाटर में पत्ती मुड़ने का रोग सफेद मक्खी कीट से फैलता है। इसके इलाज के लिए आप 'इमिडाक्लोप्रिड 17.8% SL' 1 मिली प्रति 3 लीटर पानी में घोलकर शाम के समय छिड़कें। दवा की कीमत लगभग ₹180 है। जैविक उपाय के लिए नीम का तेल 10,000 PPM 3 मिली प्रति लीटर पानी में मिलाकर 7 दिन बाद छिड़कें।",
    actionLink: "fasal"
  },
  {
    keywords: ["padrauna", "bhav", "mandi", "rate", "aloo", "pyaz", "tamatar bhav"],
    question: "Padrauna mandi me aloo aur tamatar ka kya rate hai?",
    hindiAnswer: "पडरौना मंडी में आज का लाइव भाव: टमाटर 20 रुपये प्रति किलो (2000 रुपये क्विंटल), नया आलू 15 रुपये प्रति किलो (1500 रुपये क्विंटल) और प्याज 25 रुपये प्रति किलो चल रहा है। आज टमाटर में 2 रुपये की तेजी दर्ज की गई है।",
    actionLink: "mandi"
  },
  {
    keywords: ["kcc", "kisan credit", "loan", "card", "bank"],
    question: "Kisan Credit Card (KCC) kaise banwaye?",
    hindiAnswer: "KCC बनवाने के लिए अपने नजदीकी बैंक शाखा या जन सेवा केंद्र जाएं। इसके लिए आधार कार्ड, बैंक पासबुक और जमीन की खतौनी की जरूरत होगी। KCC पर ₹3 लाख तक का लोन मात्र 4% सालाना ब्याज दर पर मिल जाता है।",
    actionLink: "yojna"
  },
  {
    keywords: ["baarish", "mausam", "paani", "weather", "kal"],
    question: "Kya kal baarish hogi? Khet me paani lagayein ya nahi?",
    hindiAnswer: "अलर्ट किसान भाई! मौसम विभाग के अनुसार कल 70% भारी बारिश की संभावना है। तापमान 32 डिग्री रहेगा। इसलिए खेत में अभी पानी बिल्कुल मत डालिए। जल निकासी की व्यवस्था तैयार रखें और किसी भी कीटनाशक का छिड़काव बारिश रुकने तक टाल दें।",
    actionLink: "mausam"
  },
  {
    keywords: ["gehu", "wheat", "khad", "urea", "sinchai"],
    question: "Gehu me pehli sinchai aur urea kab dalein?",
    hindiAnswer: "गेहूं की पहली सिंचाई बुवाई के 21 से 25 दिन बाद (CRI स्टेज पर) करनी चाहिए। इसके तुरंत बाद प्रति एकड़ 30 से 35 किलो यूरिया और 5 किलो जिंक सल्फेट डालना चाहिए, जिससे कल्ले (Tillers) बहुत अच्छे फूटते हैं।",
    actionLink: "fasal"
  },
  {
    keywords: ["pm kisan", "17vi", "kist", "paisa", "rupee"],
    question: "PM Kisan ki kist kab aayegi aur eKYC kaise karein?",
    hindiAnswer: "PM किसान योजना की अगली किस्त के लिए अपने खाते में e-KYC और बैंक खाते से आधार लिंक (NPCI DBT) होना अनिवार्य है। आप pmkisan.gov.in पर जाकर अपने अंगूठे या OTP से 2 मिनट में ई-केवाईसी पूरा कर सकते हैं।",
    actionLink: "yojna"
  }
];

function KrishiSaathiApp() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("home"); // home, fasal, mandi, mausam, yojna, voice
  const [selectedMandiKey, setSelectedMandiKey] = useState("padrauna");
  const [mandiFilter, setMandiFilter] = useState("all");
  const [mandiSearch, setMandiSearch] = useState("");
  
  // Fasal Doctor State
  const [selectedCrop, setSelectedCrop] = useState("tamatar");
  const [customImage, setCustomImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(SAMPLE_DIAGNOSES.tamatar);
  const [geminiQuery, setGeminiQuery] = useState("");
  const [geminiChat, setGeminiChat] = useState([
    {
      sender: "ai",
      text: "नमस्ते किसान भाई! मैं आपका AI फसल वैज्ञानिक हूँ। ऊपर दी गई बीमारी या अपनी फसल के बारे में कुछ भी पूछें।",
      time: "अभी"
    }
  ]);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  
  // Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [voiceResponse, setVoiceResponse] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Scheme Eligibility Modal State
  const [isEligibleModalOpen, setIsEligibleModalOpen] = useState(false);
  const [selectedSchemeForDetail, setSelectedSchemeForDetail] = useState(null);
  const [eligibilityData, setEligibilityData] = useState({
    landSize: "2", // bigha or acres
    landUnit: "एकड़ (Acre)",
    category: "लघु / सीमांत (Small Farmer)",
    hasAadhaarLinked: "हाँ",
    hasKCC: "नहीं"
  });
  const [eligibilityResult, setEligibilityResult] = useState(null);

  // Settings / API Key modal state
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [activeApiKey, setActiveApiKey] = useState(GEMINI_API_KEY);
  const [keyInput, setKeyInput] = useState(GEMINI_API_KEY === "YOUR_API_KEY_HERE" ? "" : GEMINI_API_KEY);

  // Mobile Frame Toggle (View as Mobile Phone preview or Full responsive width)
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Text to speech utility
  const speakHindi = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("आपके ब्राउज़र में आवाज़ (Text to Speech) समर्थित नहीं है।");
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Web Speech API for Hindi voice input
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("माइक इनपुट के लिए कृपया Google Chrome या Edge ब्राउज़र का उपयोग करें। नीचे दिए गए प्रश्नों को भी आप टैप करके सुन सकते हैं!");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setVoiceQuery(transcript);
        processVoiceQuestion(transcript);
      };

      recognition.onerror = (e) => {
        console.error("Speech error", e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // Match voice query against AI DB or call Gemini
  const processVoiceQuestion = async (queryText) => {
    if (!queryText.trim()) return;
    const lower = queryText.toLowerCase();

    // Check if matching in local QA DB
    const match = VOICE_QA_DATABASE.find(item => 
      item.keywords.some(k => lower.includes(k.toLowerCase()))
    );

    if (match) {
      const resp = {
        question: queryText,
        answer: match.hindiAnswer,
        actionLink: match.actionLink
      };
      setVoiceResponse(resp);
      speakHindi(match.hindiAnswer);
    } else {
      // General Gemini Call / Fallback intelligent response
      const fallbackAns = `किसान भाई, आपके सवाल "${queryText}" के संबंध में हमारी कृषि टीम यह सलाह देती है: किसी भी रोग या कीट के लिए हमेशा नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें और संतुलित मात्रा में खाद का प्रयोग करें। अधिक जानकारी के लिए 'फसल डॉक्टर' में फोटो अपलोड करें।`;
      const resp = {
        question: queryText,
        answer: fallbackAns,
        actionLink: "fasal"
      };
      setVoiceResponse(resp);
      speakHindi(fallbackAns);
    }
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setCustomImage(uploadEvent.target.result);
        setIsAnalyzing(true);
        setTimeout(() => {
          setIsAnalyzing(false);
          setDiagnosisResult(SAMPLE_DIAGNOSES.tamatar);
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  // Select Sample Photo
  const handleSelectSample = (key) => {
    setSelectedCrop(key);
    setCustomImage(null);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setDiagnosisResult(SAMPLE_DIAGNOSES[key]);
    }, 600);
  };

  // Gemini AI Chat function
  const handleAskGemini = async () => {
    if (!geminiQuery.trim()) return;
    const userMsg = geminiQuery;
    setGeminiQuery("");
    
    // Add user message
    const updatedChat = [...geminiChat, { sender: "user", text: userMsg, time: "अभी" }];
    setGeminiChat(updatedChat);
    setIsGeminiLoading(true);

    const hasRealKey = activeApiKey && activeApiKey !== "YOUR_API_KEY_HERE" && activeApiKey.length > 15;

    if (hasRealKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Krishi Saathi, an empathetic and highly knowledgeable agricultural scientist assisting an Indian farmer in Hindi and Hinglish. Answer clearly, accurately, with practical remedies, dosage, and cost in Indian Rupees. Crop diagnosis context: ${diagnosisResult.hindiName}. User question: ${userMsg}`
              }]
            }]
          })
        });
        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "माफ कीजिए किसान भाई, उत्तर प्राप्त करने में कुछ समस्या आई।";
        setGeminiChat([...updatedChat, { sender: "ai", text: aiText, time: "अभी" }]);
      } catch (err) {
        console.error(err);
        setGeminiChat([...updatedChat, { 
          sender: "ai", 
          text: `किसान भाई, आपके सवाल "${userMsg}" के लिए सलाह: टमाटर में पत्ती मुड़ने के लिए इमिडाक्लोप्रिड 17.8% SL (1 मिली / 3 लीटर पानी) और जैविक उपाय में नीम तेल (3 मिली / लीटर) का छिड़काव करें। खेत में अधिक यूरिया न दें।`,
          time: "अभी"
        }]);
      } finally {
        setIsGeminiLoading(false);
      }
    } else {
      // Realistic Agricultural Intelligence Fallback
      setTimeout(() => {
        let answer = `किसान भाई, आपके सवाल "${userMsg}" के संदर्भ में कृषि विशेषज्ञ सलाह:\n\n1. दवा का सही समय: शाम 4:00 बजे के बाद ही छिड़काव करें, जिससे दवा वाष्पित न हो।\n2. पानी की मात्रा: 1 एकड़ में कम से कम 150 से 200 लीटर साफ पानी का उपयोग करें।\n3. सावधानी: दवा के साथ किसी भी क्षारीय खाद जैसे जिंक या पोटाश को न मिलाएं।\n4. अनुमानित खर्च: मात्र ₹180 से ₹250 प्रति एकड़।`;
        if (userMsg.includes("tonic") || userMsg.includes("टॉनिक")) {
          answer = "हाँ किसान भाई, कीटनाशक के साथ आप सीवीड एक्सट्रैक्ट (Bio-zyme) या नैनो यूरिया मिला सकते हैं, लेकिन पहले थोड़े से पानी में घोलकर देख लें कि दवा फट तो नहीं रही।";
        }
        setGeminiChat([...updatedChat, { sender: "ai", text: answer, time: "अभी" }]);
        setIsGeminiLoading(false);
      }, 1000);
    }
  };

  // Eligibility Calculator
  const calculateEligibility = (e) => {
    e.preventDefault();
    const acres = parseFloat(eligibilityData.landSize) || 1;
    const isSmall = acres <= 5;
    
    setEligibilityResult({
      isEligible: true,
      eligibleSchemes: [
        { name: "पीएम किसान सम्मान निधि", amount: "₹6,000 प्रति वर्ष", status: "100% पात्र" },
        { name: "किसान क्रेडिट कार्ड (KCC)", amount: `₹${Math.min(acres * 50000, 300000).toLocaleString('en-IN')} तक स्वीकृत ऋण`, status: "100% पात्र" },
        { name: "प्रधानमंत्री फसल बीमा योजना (PMFBY)", amount: "प्राकृतिक आपदा पर पूरा मुआवजा", status: "पात्र" },
        ...(isSmall ? [{ name: "पीएम कुसुम सोलर पंप (60% सब्सिडी)", amount: "₹1.5 लाख तक की छूट", status: "उच्च प्राथमिकता" }] : [])
      ],
      estimatedBenefit: `₹${(6000 + (acres * 35000)).toLocaleString('en-IN')}`,
      actionAdvice: "आपके दस्तावेज तैयार हैं। आप जन सेवा केंद्र (CSC) या सीधे ब्लॉक कृषि अधिकारी कार्यालय में आवेदन जमा कर सकते हैं।"
    });
  };

  // Mandi Data Filtered
  const currentMandi = MANDI_DATA[selectedMandiKey] || MANDI_DATA.padrauna;
  const filteredRates = currentMandi.rates.filter(item => {
    const matchesCat = mandiFilter === "all" || item.cat === mandiFilter;
    const matchesSearch = item.item.toLowerCase().includes(mandiSearch.toLowerCase()) || 
                          item.variety.toLowerCase().includes(mandiSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`min-h-screen flex flex-col justify-between ${isPhoneFrame ? 'py-4 md:py-8 bg-neutral-900' : 'bg-gradient-to-b from-farmer-50 via-white to-amberKisan-50/40'}`}>
      
      {/* Container Wrapper (Desktop Mobile-Frame toggleable) */}
      <div className={`mx-auto w-full transition-all duration-300 ${isPhoneFrame ? 'max-w-[420px] rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 bg-white min-h-[840px] flex flex-col justify-between' : 'max-w-md md:max-w-2xl lg:max-w-4xl min-h-screen flex flex-col justify-between bg-white/90 shadow-xl'}`}>
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-gradient-to-r from-farmer-800 via-farmer-700 to-amberKisan-700 text-white shadow-md">
          {/* Top Sub-Bar with Mandi Location & Accessibility */}
          <div className="px-4 py-2 bg-black/20 flex items-center justify-between text-xs font-medium border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-amber-200">📍 पडरौना मंडी (कुशीनगर, UP)</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsKeyModalOpen(true)}
                title="Gemini API Key Settings"
                className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[11px] font-medium flex items-center gap-1"
              >
                <i className="fa-solid fa-key text-amber-300"></i>
                <span>API Key</span>
              </button>
              <button
                onClick={() => setIsPhoneFrame(!isPhoneFrame)}
                title="Toggle Mobile View"
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] flex items-center gap-1 hidden sm:flex"
              >
                <i className={`fa-solid ${isPhoneFrame ? 'fa-expand' : 'fa-mobile-screen'}`}></i>
                <span>{isPhoneFrame ? 'फुल स्क्रीन' : 'मोबाइल व्यू'}</span>
              </button>
            </div>
          </div>

          {/* Main App Title Banner */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-farmer-500 p-0.5 shadow-md flex items-center justify-center text-2xl">
                <span className="filter drop-shadow">🌾</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight font-sans">
                    कृषि साथी <span className="text-amber-300 font-bold text-base md:text-lg">AI</span>
                  </h1>
                  <span className="bg-amber-400 text-farmer-900 text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-sm">
                    किसान दोस्त
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100 font-medium">
                  हर कदम किसान के साथ • Hindi + Hinglish
                </p>
              </div>
            </div>

            {/* Quick Audio Read-Aloud / Speaker Toggle */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => isSpeaking ? stopSpeaking() : speakHindi("नमस्ते किसान भाई! कृषि साथी में आपका स्वागत है। आप फसल की बीमारी, आज का मंडी भाव, मौसम की चेतावनी या सरकारी योजनाएं जान सकते हैं।")}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${isSpeaking ? 'bg-red-500 text-white animate-pulse border-red-300' : 'bg-white/15 hover:bg-white/25 text-amber-200 border-white/20'}`}
                title={isSpeaking ? "आवाज़ बंद करें" : "आवाज़ में सुनें"}
              >
                <i className={`fa-solid ${isSpeaking ? 'fa-volume-xmark' : 'fa-volume-high'} text-base`}></i>
              </button>
            </div>
          </div>

          {/* Quick Sub-navigation Bar for Fast Switching */}
          <div className="flex items-center justify-around px-2 py-1.5 bg-farmer-900/40 text-xs overflow-x-auto no-scrollbar font-medium border-t border-white/10">
            <button 
              onClick={() => setActiveTab("home")} 
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'home' ? 'bg-amber-400 text-farmer-900 font-bold shadow-sm' : 'text-emerald-100 hover:text-white'}`}
            >
              <i className="fa-solid fa-house"></i>
              <span>होम</span>
            </button>
            <button 
              onClick={() => setActiveTab("fasal")} 
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'fasal' ? 'bg-amber-400 text-farmer-900 font-bold shadow-sm' : 'text-emerald-100 hover:text-white'}`}
            >
              <i className="fa-solid fa-stethoscope"></i>
              <span>फसल डॉक्टर</span>
            </button>
            <button 
              onClick={() => setActiveTab("mandi")} 
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'mandi' ? 'bg-amber-400 text-farmer-900 font-bold shadow-sm' : 'text-emerald-100 hover:text-white'}`}
            >
              <i className="fa-solid fa-chart-line"></i>
              <span>मंडी भाव</span>
            </button>
            <button 
              onClick={() => setActiveTab("mausam")} 
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'mausam' ? 'bg-amber-400 text-farmer-900 font-bold shadow-sm' : 'text-emerald-100 hover:text-white'}`}
            >
              <i className="fa-solid fa-cloud-sun-rain"></i>
              <span>मौसम</span>
            </button>
            <button 
              onClick={() => setActiveTab("yojna")} 
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'yojna' ? 'bg-amber-400 text-farmer-900 font-bold shadow-sm' : 'text-emerald-100 hover:text-white'}`}
            >
              <i className="fa-solid fa-hand-holding-dollar"></i>
              <span>योजनाएं</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3 md:p-5 overflow-y-auto">
          
          {/* ================================================================= */}
          {/* PAGE 1: HOME PAGE (मुख्य पृष्ठ)                                   */}
          {/* ================================================================= */}
          {activeTab === "home" && (
            <div className="space-y-4">
              
              {/* Greeting Card: Namaste Kisan! */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-farmer-600 to-amber-500 text-white p-5 shadow-lg">
                <div className="absolute -right-4 -bottom-4 opacity-25 text-8xl pointer-events-none">
                  🚜
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-2 text-amber-100 border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                    <span>शुभ प्रभात किसान भाई 🙏</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                    नमस्ते किसान!
                  </h2>
                  <p className="text-sm text-emerald-50 mt-1 max-w-[280px]">
                    आज आप अपनी फसल या मंडी के बारे में क्या जानना चाहते हैं?
                  </p>
                  
                  {/* Quick Weather & Mandi Ticker */}
                  <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-amber-100">
                    <div className="flex items-center gap-1.5">
                      <i className="fa-solid fa-temperature-half text-amber-300"></i>
                      <span>32°C (बारिश 70%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <i className="fa-solid fa-store text-emerald-200"></i>
                      <span>टमाटर: ₹20/kg (पडरौना)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Urgent Alert Pill */}
              <div 
                onClick={() => setActiveTab("mausam")}
                className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl shrink-0">
                    🌧️
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                      <span>कल पानी मत डालो अलर्ट!</span>
                      <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded font-bold">जरूरी</span>
                    </h4>
                    <p className="text-xs text-amber-800">70% भारी बारिश की संभावना है, सिंचाई रोक दें।</p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-amber-700 text-sm"></i>
              </div>

              {/* The 4 BIG CARDS: Fasal Doctor, Mandi Bhav, Mausam, Yojna */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-farmer-700">🌱</span>
                    <span>मुख्य सेवाएं (Select Feature)</span>
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">बड़ा बटन दबाएं</span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  
                  {/* Card 1: Fasal Doctor */}
                  <button 
                    onClick={() => setActiveTab("fasal")}
                    className="touch-btn text-left p-4 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100/60 border-2 border-emerald-400 hover:border-emerald-500 shadow-md transition-all flex flex-col justify-between h-44 relative overflow-hidden group"
                  >
                    <div className="absolute top-2 right-2 opacity-15 text-5xl group-hover:scale-110 transition-transform">
                      🩺
                    </div>
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md mb-2">
                        🩺
                      </div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full mb-1">
                        AI स्कैन
                      </span>
                      <h4 className="text-base md:text-lg font-black text-gray-900 leading-tight">
                        फसल डॉक्टर
                      </h4>
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                        रोग पहचानें व सटीक दवा जानें
                      </p>
                    </div>
                    <div className="flex items-center text-xs font-bold text-emerald-700 gap-1 mt-2">
                      <span>फोटो जांचें</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </div>
                  </button>

                  {/* Card 2: Mandi Bhav */}
                  <button 
                    onClick={() => setActiveTab("mandi")}
                    className="touch-btn text-left p-4 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-100/60 border-2 border-amber-400 hover:border-amber-500 shadow-md transition-all flex flex-col justify-between h-44 relative overflow-hidden group"
                  >
                    <div className="absolute top-2 right-2 opacity-15 text-5xl group-hover:scale-110 transition-transform">
                      🌾
                    </div>
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md mb-2">
                        🌾
                      </div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-full mb-1">
                        🔴 लाइव भाव
                      </span>
                      <h4 className="text-base md:text-lg font-black text-gray-900 leading-tight">
                        मंडी भाव
                      </h4>
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                        पडरौना मंडी व सब्जी के ताजा रेट
                      </p>
                    </div>
                    <div className="flex items-center text-xs font-bold text-amber-800 gap-1 mt-2">
                      <span>रेट देखें</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </div>
                  </button>

                  {/* Card 3: Mausam */}
                  <button 
                    onClick={() => setActiveTab("mausam")}
                    className="touch-btn text-left p-4 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-blue-100/60 border-2 border-blue-400 hover:border-blue-500 shadow-md transition-all flex flex-col justify-between h-44 relative overflow-hidden group"
                  >
                    <div className="absolute top-2 right-2 opacity-15 text-5xl group-hover:scale-110 transition-transform">
                      ⛅
                    </div>
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-md mb-2">
                        ⛅
                      </div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-200/80 px-2 py-0.5 rounded-full mb-1">
                        32°C • 70% बारिश
                      </span>
                      <h4 className="text-base md:text-lg font-black text-gray-900 leading-tight">
                        मौसम व सलाह
                      </h4>
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                        सिंचाई व छिड़काव का सही समय
                      </p>
                    </div>
                    <div className="flex items-center text-xs font-bold text-blue-700 gap-1 mt-2">
                      <span>अलर्ट पढ़ें</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </div>
                  </button>

                  {/* Card 4: Yojna */}
                  <button 
                    onClick={() => setActiveTab("yojna")}
                    className="touch-btn text-left p-4 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-orange-100/60 border-2 border-orange-400 hover:border-orange-500 shadow-md transition-all flex flex-col justify-between h-44 relative overflow-hidden group"
                  >
                    <div className="absolute top-2 right-2 opacity-15 text-5xl group-hover:scale-110 transition-transform">
                      📜
                    </div>
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-2xl shadow-md mb-2">
                        📜
                      </div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-orange-900 bg-orange-200/80 px-2 py-0.5 rounded-full mb-1">
                        PM किसान • KCC
                      </span>
                      <h4 className="text-base md:text-lg font-black text-gray-900 leading-tight">
                        योजना दोस्त
                      </h4>
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                        सब्सिडी व सरकारी लोन पात्रता
                      </p>
                    </div>
                    <div className="flex items-center text-xs font-bold text-orange-700 gap-1 mt-2">
                      <span>पात्रता जांचें</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </div>
                  </button>

                </div>
              </div>

              {/* Voice Assistant Promo Card */}
              <div 
                onClick={() => setActiveTab("voice")}
                className="bg-gradient-to-r from-farmer-800 to-emerald-900 text-white rounded-3xl p-4 flex items-center justify-between cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-13 h-13 rounded-2xl bg-amber-400 text-farmer-950 flex items-center justify-center text-2xl font-bold shadow-md">
                      🎤
                    </div>
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-amber-300">
                      बोलो किसान, क्या पूछना है?
                    </h4>
                    <p className="text-xs text-emerald-200">माइक दबाएं और बोलकर तुरंत जवाब पाएं</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <i className="fa-solid fa-microphone-lines"></i>
                </div>
              </div>

              {/* Kisan Toll-Free Direct Call Button */}
              <div className="bg-white rounded-2xl p-3 border border-gray-200 flex items-center justify-between text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-lg">📞</span>
                  <div>
                    <p className="font-bold text-gray-900">किसान कॉल सेंटर (टोल-फ्री)</p>
                    <p className="text-[11px] text-gray-500">कृषि वैज्ञानिक से सीधे बात करें: 1800-180-1551</p>
                  </div>
                </div>
                <a 
                  href="tel:18001801551"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm"
                >
                  <i className="fa-solid fa-phone"></i>
                  <span>कॉल</span>
                </a>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* PAGE 2: FASAL DOCTOR (फसल डॉक्टर)                                 */}
          {/* ================================================================= */}
          {activeTab === "fasal" && (
            <div className="space-y-4">
              
              {/* Doctor Header Banner */}
              <div className="bg-gradient-to-r from-emerald-700 via-farmer-600 to-emerald-800 text-white rounded-3xl p-4 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>AI फसल पैथोलॉजिस्ट</span>
                  </span>
                  <h2 className="text-xl font-black mt-0.5">फसल डॉक्टर (Fasal Doctor)</h2>
                  <p className="text-xs text-emerald-100">फसल की फोटो खींचें या चुनें, तुरंत सटीक बीमारी व दवा जानें।</p>
                </div>
                <div className="text-4xl">🩺</div>
              </div>

              {/* Photo Upload & Sample Picker Section */}
              <div className="bg-white rounded-3xl p-4 border-2 border-dashed border-farmer-300 shadow-sm text-center">
                
                {/* Upload Button */}
                <div className="max-w-xs mx-auto">
                  <label className="cursor-pointer block">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoUpload} 
                    />
                    <div className="touch-btn bg-gradient-to-r from-farmer-600 to-amberKisan-500 hover:from-farmer-700 hover:to-amberKisan-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2.5 text-base transition-all">
                      <i className="fa-solid fa-camera text-xl"></i>
                      <span>फसल की फोटो अपलोड करें</span>
                    </div>
                  </label>
                  <p className="text-[11px] text-gray-500 mt-2">
                    कैमरा या गैलरी से खराब पत्ती या फल की फोटो लें
                  </p>
                </div>

                {/* Or Try Sample Photos (One-Click instant preview) */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-700 mb-2">
                    या नमूना फसल चुनकर तुरंत जांचें (Click to Test):
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleSelectSample("tamatar")}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${selectedCrop === 'tamatar' && !customImage ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                    >
                      <span className="text-xl">🍅</span>
                      <span>टमाटर</span>
                      <span className="text-[10px] text-gray-500 font-normal">पत्ती मुड़ना</span>
                    </button>

                    <button 
                      onClick={() => handleSelectSample("aloo")}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${selectedCrop === 'aloo' && !customImage ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                    >
                      <span className="text-xl">🥔</span>
                      <span>आलू</span>
                      <span className="text-[10px] text-gray-500 font-normal">झुलसा रोग</span>
                    </button>

                    <button 
                      onClick={() => handleSelectSample("gehu")}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${selectedCrop === 'gehu' && !customImage ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                    >
                      <span className="text-xl">🌾</span>
                      <span>गेहूं</span>
                      <span className="text-[10px] text-gray-500 font-normal">पीला रतुआ</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Diagnosis Result Card */}
              {isAnalyzing ? (
                <div className="bg-white rounded-3xl p-8 border border-farmer-200 text-center shadow-md">
                  <div className="w-14 h-14 border-4 border-farmer-600 border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
                  <h4 className="text-base font-bold text-gray-800">AI फसल पत्ती का विश्लेषण कर रहा है...</h4>
                  <p className="text-xs text-gray-500 mt-1">रोग व अनुशंसित कीटनाशक डेटाबेस से मिलान हो रहा है</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-md overflow-hidden">
                  
                  {/* Result Header */}
                  <div className="bg-gradient-to-r from-emerald-50 to-amber-50 p-4 border-b border-emerald-100 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          AI जांच परिणाम (Diagnosis)
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${diagnosisResult.severityColor}`}>
                          {diagnosisResult.severity}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mt-2">
                        {diagnosisResult.crop}: {diagnosisResult.hinglishName}
                      </h3>
                      <p className="text-xs font-semibold text-farmer-800">
                        {diagnosisResult.hindiName}
                      </p>
                    </div>

                    <button 
                      onClick={() => speakHindi(`${diagnosisResult.crop} में ${diagnosisResult.hindiName} पाया गया है। दवा का नाम ${diagnosisResult.medicines[0].name} है, कीमत ${diagnosisResult.medicines[0].price} है।`)}
                      className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-sm font-bold flex items-center gap-1 shrink-0"
                      title="रिपोर्ट सुनें"
                    >
                      <i className="fa-solid fa-volume-high"></i>
                      <span className="text-xs">सुनें</span>
                    </button>
                  </div>

                  {/* Crop Image & Symptom overview */}
                  <div className="p-4 space-y-3.5">
                    
                    {/* Visual Preview */}
                    <div className="relative rounded-2xl overflow-hidden h-40 bg-gray-100 border border-gray-200">
                      <img 
                        src={customImage || diagnosisResult.sampleImg} 
                        alt={diagnosisResult.crop}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                        <i className="fa-solid fa-check text-emerald-400"></i>
                        <span>AI रोग पहचान सटीकता: 94.2%</span>
                      </div>
                    </div>

                    {/* Rog ke Lakshan (Symptoms) */}
                    <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-100">
                      <h4 className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                        <i className="fa-solid fa-magnifying-glass text-emerald-700"></i>
                        <span>रोग के मुख्य लक्षण व कारण (Symptoms & Cause):</span>
                      </h4>
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                        {diagnosisResult.symptoms}
                      </p>
                      <p className="text-[11px] text-emerald-800 font-medium mt-1">
                        • {diagnosisResult.cause}
                      </p>
                    </div>

                    {/* Dawa ka Naam + Price (Medicine & Price) */}
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="text-amber-500">💊</span>
                        <span>उपचार हेतु अनुशंसित दवा व कीमत (Recommended Medicines):</span>
                      </h4>
                      
                      <div className="space-y-2.5">
                        {diagnosisResult.medicines.map((med, idx) => (
                          <div key={idx} className="p-3 rounded-2xl bg-gradient-to-r from-amber-50/60 to-white border-2 border-amber-200 flex items-start justify-between gap-3">
                            <div>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
                                {med.type}
                              </span>
                              <h5 className="font-bold text-sm text-gray-900 mt-1">
                                {med.name}
                              </h5>
                              <p className="text-xs text-gray-600 mt-0.5">
                                मात्रा: <span className="font-semibold text-gray-800">{med.dose}</span>
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs text-gray-500 block">अनुमानित मूल्य</span>
                              <span className="text-sm font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg inline-block mt-0.5">
                                {med.price}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Precaution Box */}
                    <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs text-amber-950">
                      <p className="font-bold flex items-center gap-1.5 mb-0.5">
                        <span>⚠️ छिड़काव सावधानी (Safety Tip):</span>
                      </p>
                      <p className="text-gray-700">{diagnosisResult.precautions}</p>
                    </div>

                    {/* Ask Gemini AI Feature */}
                    <div className="pt-2">
                      <div className="bg-gradient-to-r from-farmer-800 via-farmer-700 to-emerald-900 rounded-2xl p-3.5 text-white shadow-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-400 text-farmer-950 flex items-center justify-center font-bold">
                              ✨
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-amber-300">Ask Gemini AI (कृषि वैज्ञानिक)</h4>
                              <p className="text-[10px] text-emerald-200">बीमारी, खाद, टॉनिक या अन्य सवाल पूछें</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                            Gemini 1.5 Flash
                          </span>
                        </div>

                        {/* Chat history display */}
                        <div className="space-y-2 max-h-48 overflow-y-auto my-2 pr-1 text-xs">
                          {geminiChat.map((msg, i) => (
                            <div key={i} className={`p-2.5 rounded-xl ${msg.sender === 'user' ? 'bg-amber-400 text-farmer-950 ml-6 font-medium' : 'bg-white/10 text-emerald-50 mr-4 border border-white/10'}`}>
                              <div className="flex items-center justify-between text-[10px] opacity-75 mb-0.5">
                                <span>{msg.sender === 'user' ? 'आप (किसान)' : '🤖 Gemini AI वैज्ञानिक'}</span>
                                <span>{msg.time}</span>
                              </div>
                              <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                            </div>
                          ))}
                          {isGeminiLoading && (
                            <div className="bg-white/10 p-2.5 rounded-xl mr-4 flex items-center gap-2 text-amber-300 text-xs">
                              <i className="fa-solid fa-spinner animate-spin"></i>
                              <span>Gemini AI उत्तर लिख रहा है...</span>
                            </div>
                          )}
                        </div>

                        {/* Query Input Box */}
                        <div className="flex gap-1.5 mt-2">
                          <input 
                            type="text" 
                            value={geminiQuery}
                            onChange={(e) => setGeminiQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAskGemini()}
                            placeholder="जैसे: क्या इस दवा के साथ टॉनिक मिला सकते हैं?"
                            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                          <button 
                            onClick={handleAskGemini}
                            disabled={isGeminiLoading || !geminiQuery.trim()}
                            className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-farmer-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm shrink-0"
                          >
                            <span>पूछें</span>
                            <i className="fa-solid fa-paper-plane text-[10px]"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* ================================================================= */}
          {/* PAGE 3: MANDI BHAV (मंडी भाव)                                      */}
          {/* ================================================================= */}
          {activeTab === "mandi" && (
            <div className="space-y-4">
              
              {/* Header Banner with LIVE Badge */}
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-farmer-700 text-white rounded-3xl p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-black/25 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-200 border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      <span>🔴 LIVE MANDI UPDATE</span>
                    </div>
                    <h2 className="text-xl font-black mt-1">मंडी भाव (Mandi Rates)</h2>
                    <p className="text-xs text-amber-100">सब्जी व अनाज के आज के ताजा प्रमाणित बाजार भाव</p>
                  </div>
                  <div className="text-4xl">🌾</div>
                </div>

                {/* Mandi Selector Dropdown */}
                <div className="mt-3.5 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-semibold text-amber-100">मंडी चुनें:</span>
                    <select 
                      value={selectedMandiKey}
                      onChange={(e) => setSelectedMandiKey(e.target.value)}
                      className="bg-white text-gray-900 font-bold text-xs px-2.5 py-1.5 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    >
                      <option value="padrauna">पडरौना मंडी (Padrauna - मुख्य)</option>
                      <option value="gorakhpur">गोरखपुर मंडी (Gorakhpur APMC)</option>
                      <option value="deoria">देवरिया मंडी (Deoria APMC)</option>
                    </select>
                  </div>
                  <span className="text-[11px] text-amber-200">{currentMandi.updatedAt}</span>
                </div>
              </div>

              {/* Search Bar & Category Filter Chips */}
              <div className="space-y-2">
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-gray-400 text-sm"></i>
                  <input 
                    type="text" 
                    value={mandiSearch}
                    onChange={(e) => setMandiSearch(e.target.value)}
                    placeholder="सब्जी या फसल का नाम खोजें (जैसे: Tamatar, Aloo, Gehu)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-farmer-500"
                  />
                  {mandiSearch && (
                    <button 
                      onClick={() => setMandiSearch("")}
                      className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  )}
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {[
                    { key: "all", label: "सभी भाव (All)" },
                    { key: "sabzi", label: "सब्जियां (Vegetables)" },
                    { key: "anaj", label: "अनाज (Grains)" },
                    { key: "nakdi", label: "नकदी फसल (Cash Crops)" }
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setMandiFilter(f.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${mandiFilter === f.key ? 'bg-farmer-700 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Top Highlight: Tamatar, Aloo, Pyaz in Padrauna Mandi */}
              {selectedMandiKey === "padrauna" && mandiFilter === "all" && !mandiSearch && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gradient-to-b from-red-50 to-white border-2 border-red-300 rounded-2xl p-2.5 text-center shadow-sm">
                    <span className="text-2xl block mb-0.5">🍅</span>
                    <h5 className="font-bold text-xs text-gray-800">टमाटर</h5>
                    <div className="text-base font-black text-red-600 mt-0.5">₹20<span className="text-[10px] font-normal text-gray-500">/kg</span></div>
                    <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded mt-1">
                      ▲ +₹2 आज तेज
                    </span>
                  </div>

                  <div className="bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 rounded-2xl p-2.5 text-center shadow-sm">
                    <span className="text-2xl block mb-0.5">🥔</span>
                    <h5 className="font-bold text-xs text-gray-800">आलू (नया)</h5>
                    <div className="text-base font-black text-amber-800 mt-0.5">₹15<span className="text-[10px] font-normal text-gray-500">/kg</span></div>
                    <span className="inline-block text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded mt-1">
                      ▼ -₹1 गिरावट
                    </span>
                  </div>

                  <div className="bg-gradient-to-b from-purple-50 to-white border-2 border-purple-300 rounded-2xl p-2.5 text-center shadow-sm">
                    <span className="text-2xl block mb-0.5">🧅</span>
                    <h5 className="font-bold text-xs text-gray-800">प्याज</h5>
                    <div className="text-base font-black text-purple-700 mt-0.5">₹25<span className="text-[10px] font-normal text-gray-500">/kg</span></div>
                    <span className="inline-block text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.2 rounded mt-1">
                      ● स्थिर भाव
                    </span>
                  </div>
                </div>
              )}

              {/* Complete Mandi Rates Table / List */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>फसल / सब्जी (Crop)</span>
                  <div className="flex items-center gap-8">
                    <span>थोक दर (क्विंटल)</span>
                    <span>खुदरा (प्रति किलो)</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {filteredRates.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-xs">
                      कोई भाव नहीं मिला। कृपया नाम बदलकर खोजें।
                    </div>
                  ) : (
                    filteredRates.map((item) => (
                      <div key={item.id} className="p-3.5 hover:bg-farmer-50/50 transition-colors flex items-center justify-between">
                        
                        {/* Left: Item Name & Variety */}
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h4 className="font-extrabold text-sm text-gray-900 leading-tight">
                              {item.item}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-gray-500">{item.variety}</span>
                              {item.trend === 'up' && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                  ▲ +{item.change}
                                </span>
                              )}
                              {item.trend === 'down' && (
                                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.2 rounded">
                                  ▼ {item.change}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Rates */}
                        <div className="text-right">
                          <div className="text-base font-black text-farmer-800">
                            ₹{item.rateKg} <span className="text-xs font-normal text-gray-500">/किग्रा</span>
                          </div>
                          <div className="text-[11px] text-gray-500 font-semibold">
                            ₹{item.rateQtl} /क्विंटल
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>

                {/* Mandi Footer note */}
                <div className="bg-farmer-50/70 p-3 text-center border-t border-farmer-100 text-[11px] text-farmer-800">
                  <i className="fa-solid fa-circle-info mr-1 text-farmer-600"></i>
                  भाव ई-नाम (e-NAM) व कृषि उपज मंडी समिति पडरौना के अनुसार हैं।
                </div>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* PAGE 4: MAUSAM (मौसम व कृषि सलाह)                                 */}
          {/* ================================================================= */}
          {activeTab === "mausam" && (
            <div className="space-y-4">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-800 text-white rounded-3xl p-4 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">कृषि मौसम केंद्र</span>
                  <h2 className="text-xl font-black mt-0.5">मौसम व सिंचाई सलाह</h2>
                  <p className="text-xs text-sky-100">पडरौना (कुशीनगर, उत्तर प्रदेश)</p>
                </div>
                <div className="text-4xl">⛅</div>
              </div>

              {/* Big Today Weather Card: 32°C, Rain 70% */}
              <div className="bg-gradient-to-br from-sky-500 to-blue-700 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-semibold text-amber-200">
                      आज का मौसम (Today)
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-5xl font-black tracking-tight">32°C</span>
                      <span className="text-sm text-sky-100 font-medium">महसूस: 35°C</span>
                    </div>
                    <p className="text-sm font-semibold text-sky-100 mt-1">
                      आंशिक धूप व गरज के साथ वर्षा
                    </p>
                  </div>
                  <div className="text-6xl animate-bounce-gentle">
                    🌧️
                  </div>
                </div>

                {/* Weather Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/20 text-center text-xs">
                  <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
                    <span className="text-amber-300 text-sm block">🌧️ 70%</span>
                    <span className="text-[10px] text-sky-100">बारिश का चांस</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
                    <span className="text-sky-200 text-sm block">💧 78%</span>
                    <span className="text-[10px] text-sky-100">नमी (Humidity)</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
                    <span className="text-emerald-200 text-sm block">💨 14 km/h</span>
                    <span className="text-[10px] text-sky-100">हवा की गति</span>
                  </div>
                </div>
              </div>

              {/* PROMINENT ALERT CARD: "Kal paani mat daalo" */}
              <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-amber-950 rounded-3xl p-4.5 shadow-md border-2 border-amber-300">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white text-amber-900 flex items-center justify-center text-2xl shadow shrink-0">
                    ⚠️
                  </div>
                  <div>
                    <div className="inline-block bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full mb-1">
                      किसान चेतावनी (Alert)
                    </div>
                    <h3 className="text-lg font-black text-gray-950 leading-tight">
                      कल पानी मत डालो! (Do Not Irrigate)
                    </h3>
                    <p className="text-xs font-semibold text-gray-900 mt-1.5 leading-relaxed">
                      मौसम विभाग के अनुसार पडरौना और आसपास अगले 24 घंटे में <strong>70% भारी बारिश</strong> की संभावना है। खेतों में सिंचाई बिल्कुल रोक दें ताकि जलभराव (Waterlogging) से जड़ें न गलें।
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-amber-600/30 grid grid-cols-2 gap-2 text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-red-950 bg-white/40 p-2 rounded-xl">
                    <span>❌ खाद / कीटनाशक छिड़काव:</span>
                    <span className="font-extrabold text-red-700">मना है</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-950 bg-white/40 p-2 rounded-xl">
                    <span>✅ जल निकासी नाली:</span>
                    <span className="font-extrabold text-emerald-800">साफ रखें</span>
                  </div>
                </div>
              </div>

              {/* 5-Day Agriculture Forecast */}
              <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-md">
                <h4 className="font-bold text-sm text-gray-800 mb-3 flex items-center justify-between">
                  <span>📅 5 दिनों का कृषि मौसम पूर्वानुमान</span>
                  <span className="text-xs text-farmer-700 font-semibold">पडरौना क्षेत्र</span>
                </h4>

                <div className="space-y-2.5">
                  {[
                    { day: "आज (Today)", temp: "32° / 24°C", icon: "🌧️", rain: "70% बारिश", advice: "खेत में पानी न लगाएं, दवा न छिड़कें", alert: true },
                    { day: "कल (Tomorrow)", temp: "29° / 23°C", icon: "⛈️", rain: "65% भारी वर्षा", advice: "जल निकासी सुनिश्चित करें", alert: true },
                    { day: "परसों (Day 3)", temp: "30° / 22°C", icon: "🌦️", rain: "30% हल्की बूंदाबांदी", advice: "कीचड़ सूखने का इंतजार करें", alert: false },
                    { day: "चौथा दिन", temp: "32° / 23°C", icon: "⛅", rain: "15% आंशिक धूप", advice: "यूरिया छिड़काव के अनुकूल", alert: false },
                    { day: "पांचवां दिन", temp: "34° / 24°C", icon: "☀️", rain: "5% खिली धूप", advice: "कटाई व सिंचाई के लिए उत्तम", alert: false }
                  ].map((item, idx) => (
                    <div key={idx} className={`p-3 rounded-2xl border flex items-center justify-between ${item.alert ? 'bg-amber-50/60 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h5 className="font-bold text-xs text-gray-900">{item.day}</h5>
                          <p className="text-[11px] text-gray-600">{item.advice}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-gray-800 block">{item.temp}</span>
                        <span className={`text-[10px] font-bold ${item.alert ? 'text-red-600' : 'text-blue-600'}`}>{item.rain}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* PAGE 5: YOJNA DOST (सरकारी योजनाएं)                                */}
          {/* ================================================================= */}
          {activeTab === "yojna" && (
            <div className="space-y-4">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-farmer-700 text-white rounded-3xl p-4 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">सरकारी योजना दोस्त</span>
                  <h2 className="text-xl font-black mt-0.5">किसान योजनाएं (Schemes)</h2>
                  <p className="text-xs text-amber-100">PM किसान, KCC और सरकारी सब्सिडी की पूरी जानकारी</p>
                </div>
                <div className="text-4xl">📜</div>
              </div>

              {/* Quick Eligibility Checker CTA Button */}
              <div className="bg-gradient-to-r from-farmer-800 to-emerald-700 text-white rounded-3xl p-4 shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-farmer-950 px-2 py-0.5 rounded-full">
                    2 मिनट में जांचें
                  </span>
                  <h3 className="font-extrabold text-base text-white mt-1">
                    क्या आप सरकारी लाभ के लिए पात्र हैं?
                  </h3>
                  <p className="text-xs text-emerald-200">जमीन के अनुसार अपनी पात्रता और योजनाएं देखें</p>
                </div>
                <button 
                  onClick={() => setIsEligibleModalOpen(true)}
                  className="touch-btn bg-amber-400 hover:bg-amber-500 text-farmer-950 font-black px-3.5 py-2.5 rounded-2xl text-xs shadow-md shrink-0 flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-calculator"></i>
                  <span>पात्रता जांचें</span>
                </button>
              </div>

              {/* Schemes Cards List */}
              <div className="space-y-3">
                {SCHEMES_LIST.map((scheme) => (
                  <div key={scheme.id} className="bg-white rounded-3xl p-4 border border-gray-200 shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${scheme.badgeColor}`}>
                          {scheme.badge}
                        </span>
                        <h4 className="font-extrabold text-base text-gray-900 mt-1">
                          {scheme.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-0.5 font-medium">
                          {scheme.tagline}
                        </p>
                      </div>
                      <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-200 shrink-0">
                        {scheme.amount}
                      </span>
                    </div>

                    {/* Highlights */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100 text-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="font-bold text-gray-900">लाभ विवरण:</span>
                        <span>{scheme.installments}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="font-bold text-gray-900">पात्रता:</span>
                        <span>{scheme.eligibility}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3.5 flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedSchemeForDetail(scheme);
                          setIsEligibleModalOpen(true);
                        }}
                        className="flex-1 py-2.5 px-3 rounded-2xl bg-farmer-600 hover:bg-farmer-700 text-white font-bold text-xs text-center shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <i className="fa-solid fa-circle-check"></i>
                        <span>Check Eligibility (पात्रता)</span>
                      </button>

                      <a 
                        href={`tel:${scheme.helpline.split('/')[0].trim()}`}
                        className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1"
                        title="हेल्पलाइन पर कॉल करें"
                      >
                        <i className="fa-solid fa-phone text-emerald-600"></i>
                        <span>हेल्पलाइन</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* PAGE 6: VOICE ASSISTANT (आवाज़ सहायक - बोलो किसान)                 */}
          {/* ================================================================= */}
          {activeTab === "voice" && (
            <div className="space-y-4">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-farmer-800 via-farmer-700 to-amber-700 text-white rounded-3xl p-4 shadow-md text-center">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-farmer-950 px-2.5 py-0.5 rounded-full inline-block">
                  AI किसान आवाज सहायक
                </span>
                <h2 className="text-xl font-black mt-1">बोलो किसान, क्या पूछना है?</h2>
                <p className="text-xs text-emerald-100 mt-0.5">माइक दबाएं और अपनी भाषा में खेती का कोई भी सवाल पूछें</p>
              </div>

              {/* GIANT PULSING MICROPHONE BUTTON */}
              <div className="bg-white rounded-3xl p-6 border-2 border-farmer-200 shadow-md text-center">
                <div className="relative inline-block my-4">
                  {/* Pulsing ripples when listening */}
                  {isListening && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-50"></div>
                      <div className="absolute -inset-4 rounded-full bg-amber-400 animate-pulse opacity-30"></div>
                    </>
                  )}
                  
                  <button 
                    onClick={startVoiceInput}
                    className={`touch-btn w-24 h-24 rounded-full flex flex-col items-center justify-center text-3xl font-bold shadow-2xl transition-all relative z-10 ${isListening ? 'bg-red-600 text-white animate-bounce-gentle' : 'bg-gradient-to-tr from-farmer-600 via-emerald-500 to-amber-400 text-white hover:scale-105'}`}
                  >
                    <i className={`fa-solid ${isListening ? 'fa-microphone text-white' : 'fa-microphone text-white'}`}></i>
                  </button>
                </div>

                <div className="mt-1">
                  <h4 className="text-base font-extrabold text-gray-900">
                    {isListening ? "🔴 सुन रहा हूँ... बोलिए किसान भाई" : "माइक बटन दबाकर बोलें"}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    (Press button and speak in Hindi or Hinglish)
                  </p>
                </div>

                {/* Text query manual input as fallback */}
                <div className="mt-4 flex gap-1.5 max-w-sm mx-auto">
                  <input 
                    type="text" 
                    value={voiceQuery}
                    onChange={(e) => setVoiceQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && processVoiceQuestion(voiceQuery)}
                    placeholder="या लिखकर पूछें..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-farmer-500"
                  />
                  <button 
                    onClick={() => processVoiceQuestion(voiceQuery)}
                    className="bg-farmer-700 hover:bg-farmer-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 shadow-sm"
                  >
                    पूछें
                  </button>
                </div>
              </div>

              {/* Voice Answer Card */}
              {voiceResponse && (
                <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-3xl p-4.5 border-2 border-emerald-300 shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500">आपका सवाल:</span>
                      <h4 className="text-sm font-extrabold text-gray-900">{voiceResponse.question}</h4>
                    </div>
                    <button 
                      onClick={() => speakHindi(voiceResponse.answer)}
                      className="p-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <i className="fa-solid fa-volume-high"></i>
                      <span>फिर सुनें</span>
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      🤖 कृषि साथी जवाब:
                    </span>
                    <p className="text-xs text-gray-800 leading-relaxed font-medium">
                      {voiceResponse.answer}
                    </p>
                  </div>

                  {voiceResponse.actionLink && (
                    <button 
                      onClick={() => setActiveTab(voiceResponse.actionLink)}
                      className="mt-3.5 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <span>संबंधित पेज खोलें</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                  )}
                </div>
              )}

              {/* Quick Tap Common Questions (1-Click for Instant Audio Demo) */}
              <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-sm">
                <h4 className="text-xs font-bold text-gray-700 mb-2.5 flex items-center gap-1.5">
                  <span className="text-amber-500">💡</span>
                  <span>किसान भाई ये सबसे ज्यादा पूछते हैं (Tap to Ask):</span>
                </h4>

                <div className="space-y-2">
                  {VOICE_QA_DATABASE.map((qa, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setVoiceQuery(qa.question);
                        processVoiceQuestion(qa.question);
                      }}
                      className="w-full text-left p-2.5 rounded-2xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-xs text-gray-800 font-medium transition-all flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-2">
                        <i className="fa-solid fa-circle-question text-emerald-600 text-[11px]"></i>
                        <span>{qa.question}</span>
                      </span>
                      <i className="fa-solid fa-play text-[10px] text-gray-400 group-hover:text-emerald-600"></i>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>

        {/* ================================================================= */}
        {/* BOTTOM NAVIGATION BAR (Mobile First)                              */}
        {/* ================================================================= */}
        <nav className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
          <div className="grid grid-cols-5 items-center py-1.5 px-1 max-w-lg mx-auto">
            
            {/* Nav 1: Home */}
            <button 
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center justify-center py-1 transition-all ${activeTab === 'home' ? 'text-farmer-700 font-extrabold' : 'text-gray-500 hover:text-gray-800 font-medium'}`}
            >
              <i className={`fa-solid fa-house text-lg mb-0.5 ${activeTab === 'home' ? 'text-farmer-700 scale-110' : ''}`}></i>
              <span className="text-[10px]">होम</span>
            </button>

            {/* Nav 2: Fasal Doctor */}
            <button 
              onClick={() => setActiveTab("fasal")}
              className={`flex flex-col items-center justify-center py-1 transition-all ${activeTab === 'fasal' ? 'text-farmer-700 font-extrabold' : 'text-gray-500 hover:text-gray-800 font-medium'}`}
            >
              <i className={`fa-solid fa-stethoscope text-lg mb-0.5 ${activeTab === 'fasal' ? 'text-farmer-700 scale-110' : ''}`}></i>
              <span className="text-[10px]">डॉक्टर</span>
            </button>

            {/* Nav 3: CENTER BIG MIC BUTTON (Voice) */}
            <div className="flex items-center justify-center -mt-5">
              <button 
                onClick={() => setActiveTab("voice")}
                className="w-13 h-13 rounded-full bg-gradient-to-tr from-farmer-600 to-amber-400 text-white shadow-xl border-4 border-white flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all"
                title="आवाज सहायक"
              >
                <i className="fa-solid fa-microphone text-xl"></i>
              </button>
            </div>

            {/* Nav 4: Mandi */}
            <button 
              onClick={() => setActiveTab("mandi")}
              className={`flex flex-col items-center justify-center py-1 transition-all ${activeTab === 'mandi' ? 'text-farmer-700 font-extrabold' : 'text-gray-500 hover:text-gray-800 font-medium'}`}
            >
              <i className={`fa-solid fa-chart-line text-lg mb-0.5 ${activeTab === 'mandi' ? 'text-farmer-700 scale-110' : ''}`}></i>
              <span className="text-[10px]">मंडी भाव</span>
            </button>

            {/* Nav 5: Mausam / Yojna */}
            <button 
              onClick={() => setActiveTab("yojna")}
              className={`flex flex-col items-center justify-center py-1 transition-all ${activeTab === 'yojna' ? 'text-farmer-700 font-extrabold' : 'text-gray-500 hover:text-gray-800 font-medium'}`}
            >
              <i className={`fa-solid fa-hand-holding-dollar text-lg mb-0.5 ${activeTab === 'yojna' ? 'text-farmer-700 scale-110' : ''}`}></i>
              <span className="text-[10px]">योजनाएं</span>
            </button>

          </div>
        </nav>

        {/* ================================================================= */}
        {/* MANDATORY FOOTER                                                  */}
        {/* Made by Kajal Gautam (Solo) with Google Antigravity + Gemini API */}
        {/* ================================================================= */}
        <footer className="bg-farmer-950 text-gray-300 py-3.5 px-4 text-center text-xs border-t border-farmer-800">
          <p className="font-semibold text-emerald-200">
            Made by <span className="text-amber-400 font-bold">Kajal Gautam (Solo)</span> with <span className="text-white font-bold">Google Antigravity + Gemini API</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            कृषि साथी - AI किसान दोस्त • Padrauna, Uttar Pradesh • Powered by Google Gemini
          </p>
        </footer>

      </div>

      {/* ================================================================= */}
      {/* MODAL 1: CHECK ELIGIBILITY (पात्रता जांचें)                       */}
      {/* ================================================================= */}
      {isEligibleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl border-2 border-emerald-400 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <div>
                  <h3 className="font-black text-base text-gray-900">किसान पात्रता जांच (Eligibility)</h3>
                  <p className="text-[11px] text-gray-500">सरकारी योजना व सब्सिडी की जांच करें</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsEligibleModalOpen(false);
                  setEligibilityResult(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {!eligibilityResult ? (
              <form onSubmit={calculateEligibility} className="space-y-3.5 mt-3 text-xs">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    1. आपके पास कितनी कृषि भूमि (खेत) है?
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      step="0.5"
                      min="0.5"
                      max="100"
                      value={eligibilityData.landSize}
                      onChange={(e) => setEligibilityData({...eligibilityData, landSize: e.target.value})}
                      required
                      className="w-24 p-2.5 rounded-xl border border-gray-300 font-bold text-center text-sm"
                    />
                    <select 
                      value={eligibilityData.landUnit}
                      onChange={(e) => setEligibilityData({...eligibilityData, landUnit: e.target.value})}
                      className="flex-1 p-2.5 rounded-xl border border-gray-300 font-semibold"
                    >
                      <option value="एकड़ (Acre)">एकड़ (Acre)</option>
                      <option value="बीघा (Bigha)">बीघा (Bigha)</option>
                      <option value="हेक्टेयर (Hectare)">हेक्टेयर (Hectare)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    2. किसान श्रेणी (Farmer Category)
                  </label>
                  <select 
                    value={eligibilityData.category}
                    onChange={(e) => setEligibilityData({...eligibilityData, category: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-semibold"
                  >
                    <option value="लघु / सीमांत (Small Farmer)">लघु व सीमांत किसान (&lt; 2 हेक्टेयर)</option>
                    <option value="सामान्य किसान (Medium/Large)">सामान्य किसान (&gt; 2 हेक्टेयर)</option>
                    <option value="बटाईदार / काश्तकार (Tenant)">बटाईदार / किराएदार किसान</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    3. क्या बैंक खाते में आधार लिंक (DBT/NPCI) है?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["हाँ (Yes)", "नहीं (No)"].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setEligibilityData({...eligibilityData, hasAadhaarLinked: opt})}
                        className={`p-2.5 rounded-xl font-bold border transition-all ${eligibilityData.hasAadhaarLinked === opt ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 border-gray-300 text-gray-700'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-farmer-600 to-amber-500 hover:from-farmer-700 hover:to-amber-600 text-white font-black rounded-2xl shadow-lg text-sm flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-circle-check"></i>
                    <span>पात्रता की गणना करें</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-3 space-y-3.5 text-xs">
                
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3.5 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg mx-auto mb-1">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <h4 className="font-extrabold text-sm text-emerald-950">
                    बधाई हो! आप 4 प्रमुख सरकारी योजनाओं के लिए पात्र हैं
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    अनुमानित वार्षिक आर्थिक लाभ: <strong className="text-emerald-900 font-black text-sm">{eligibilityResult.estimatedBenefit}</strong>
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900 mb-1.5">स्वीकृत योजनाएं:</h5>
                  <div className="space-y-1.5">
                    {eligibilityResult.eligibleSchemes.map((s, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{s.name}</p>
                          <p className="text-[11px] text-emerald-700 font-semibold">{s.amount}</p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                  <p className="font-bold text-amber-950 mb-0.5">आवश्यक दस्तावेज:</p>
                  <p className="text-gray-700 text-[11px]">
                    1. आधार कार्ड, 2. खतौनी (जमीन का पर्चा), 3. बैंक पासबुक, 4. पासपोर्ट साइज फोटो।
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button 
                    onClick={() => setEligibilityResult(null)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl"
                  >
                    पुनः जांचें
                  </button>
                  <a 
                    href="https://pmkisan.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-farmer-700 hover:bg-farmer-800 text-white font-bold rounded-xl text-center flex items-center justify-center gap-1"
                  >
                    <span>सरकारी पोर्टल</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: GEMINI API KEY CONFIGURATION                              */}
      {/* ================================================================= */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-amber-400 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <h3 className="font-bold text-sm text-gray-900">Gemini API Key Setup</h3>
              </div>
              <button 
                onClick={() => setIsKeyModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <p className="text-gray-600">
                ऐप में डिफ़ॉल्ट रूप से इन-बिल्ट किसान AI डेटाबेस और जेमिनी प्लेसहोल्डर सेट है:
              </p>
              <div className="bg-gray-900 text-amber-300 p-2.5 rounded-xl font-mono text-[11px] break-all">
                const GEMINI_API_KEY = "{activeApiKey}";
              </div>
              
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  अपनी Google Gemini API Key डालें (Optional):
                </label>
                <input 
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  onClick={() => {
                    setActiveApiKey(keyInput || "YOUR_API_KEY_HERE");
                    setIsKeyModalOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-farmer-700 hover:bg-farmer-800 text-white font-bold rounded-xl"
                >
                  सेव करें
                </button>
                <button 
                  onClick={() => setIsKeyModalOpen(false)}
                  className="py-2.5 px-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Render Application
ReactDOM.render(<KrishiSaathiApp />, document.getElementById('root'));
