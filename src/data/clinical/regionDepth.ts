import { L, type L3List, type MentorComplication } from "./types";

export type RegionDepth = {
  anatomy: L3List;
  pearls: L3List;
  complications: MentorComplication[];
};

const vo = (id: string): MentorComplication => ({
  id,
  name: L("חשד לחסימה וסקולרית", "اشتباه انسداد وعائي", "Suspected vascular occlusion"),
  urgency: "critical",
  signs: {
    he: ["כאב disproportionate", "הלבנה / livedo", "קפילרי רפיל ירוד", "שינוי ראייה"],
    ar: ["ألم غير متناسب", "شحوب / livedo", "إعادة امتلاء شعيري بطيئة", "تغير البصر"],
    en: ["Disproportionate pain", "Blanching / livedo", "Poor capillary refill", "Vision change"],
  },
  actions: {
    he: ["עצור הזרקה", "השאר במרפאה", "התחל hyaluronidase לפי ACE", "נטר ראייה — הפניה מיידית אם שינוי"],
    ar: ["أوقف الحقن", "أبقِ في العيادة", "ابدأ الهيالورونيداز وفق ACE", "راقب البصر — إحالة فورية إن تغيّر"],
    en: ["Stop injecting", "Keep the patient in clinic", "Start hyaluronidase per ACE", "Monitor vision — immediate referral if changed"],
  },
});

export const REGION_DEPTH: Record<string, RegionDepth> = {
  lips: {
    anatomy: {
      he: ["עורקי labial עליון/תחתון — מסלול משתנה", "vermilion, philtrum, commissure", "רירית מול עור: שכבות שונות"],
      ar: ["شرايين شفوية متغيرة المسار", "الحافة والفلتروم وزوايا الفم", "مخاطية مقابل جلد"],
      en: ["Variable superior/inferior labial arteries", "Vermilion, philtrum, commissure", "Mucosa vs skin — different planes"],
    },
    pearls: {
      he: ["יחס עליונה:תחתונה לפני נפח", "עצור מוקדם — השלם במעקב", "בדוק דיבור וחיוך לפני שחרור"],
      ar: ["قيّم النسبة قبل الحجم", "توقف مبكراً", "افحص الكلام والابتسامة"],
      en: ["Assess upper:lower ratio before volume", "Stop early — complete at review", "Check speech and smile before discharge"],
    },
    complications: [
      {
        id: "lips-edema",
        name: L("נפיחות / המטומה מוקדמת", "تورم / كدمة مبكرة", "Early edema / ecchymosis"),
        urgency: "moderate",
        signs: { he: ["נפיחות 24–72 שעות", "שטף דם מקומי"], ar: ["تورم 24–72 ساعة", "كدمة"], en: ["Swelling 24–72h", "Local bruising"] },
        actions: { he: ["הסבר צפוי", "קירור לפי פרוטוקול", "מעקב יום 7"], ar: ["تثقيف", "تبريد", "متابعة يوم 7"], en: ["Counsel expected course", "Cooling per protocol", "Day-7 review"] },
      },
      vo("lips-vo"),
      {
        id: "lips-sausage",
        name: L("גבול נקניקייה / מילוי יתר", "حد سجقي / إفراط", "Sausage border / overfill"),
        urgency: "moderate",
        signs: { he: ["גבול עבה", "אובדן philtrum", "דיבור מוזר"], ar: ["حد سميك", "فقدان الفلتروم"], en: ["Thick border", "Lost philtrum", "Altered speech"] },
        actions: { he: ["הימנע מהשלמה באותו יום", "שקול המסה ממוקדת אם HA"], ar: ["لا تُكمل في نفس اليوم", "فكّر بإذابة موضعية"], en: ["Do not top up same day", "Consider focal dissolution if HA"] },
      },
    ],
  },
  cheeks: {
    anatomy: {
      he: ["מדורי שומן שטחיים ועמוקים", "קשת זיגומטית כעוגן", "קרבה לאינפראורביטל / עורק הפנים"],
      ar: ["حجرات دهنية سطحية وعميقة", "القوس الوجني كمرتكز", "قرب تحت الحجاج / الشريان الوجهي"],
      en: ["Superficial and deep fat compartments", "Zygomatic arch as anchor", "Near infraorbital / facial artery"],
    },
    pearls: {
      he: ["תמוך midface לפני קפל נזולביאלי", "השווה בישיבה", "מדורג עדיף על מילוי יתר"],
      ar: ["ادعم منتصف الوجه قبل الطية", "وازن جلوساً", "التدرج أفضل من الإفراط"],
      en: ["Support midface before the fold", "Compare sitting", "Stage rather than overfill"],
    },
    complications: [
      vo("cheeks-vo"),
      {
        id: "cheeks-vision",
        name: L("איום על ראייה", "تهديد البصر", "Vision threat"),
        urgency: "critical",
        signs: { he: ["כאב אורביטלי", "טשטוש / אובדן ראייה", "הלבנה במצח/אף"], ar: ["ألم حجاجي", "تغيم / فقدان بصر"], en: ["Orbital pain", "Blur / vision loss", "Forehead/nasal blanching"] },
        actions: { he: ["חירום אופתלמולוגי מיידי", "פרוטוקול ACE במקביל"], ar: ["طوارئ عيون فورية", "بروتوكول ACE"], en: ["Immediate ophthalmology emergency", "Run ACE in parallel"] },
      },
    ],
  },
  jawline: {
    anatomy: {
      he: ["זווית גוניאלית, גוף הלסת, masseter", "פארותיד ועצב פנים סמוכים", "כלי דם צוואריים בקצה"],
      ar: ["الزاوية والجسم والماضغة", "الغدة النكفية والعصب الوجهي", "أوعية الرقبة عند الحافة"],
      en: ["Gonial angle, mandibular body, masseter", "Parotid and facial nerve nearby", "Cervical vessels at the edge"],
    },
    pearls: {
      he: ["קו ליניארי לאורך הגבול ואז בולוס בזווית", "הערך היפרטרופיה של masseter לפני מילוי", "תעד פרופיל צד"],
      ar: ["خط على الحافة ثم بلعة في الزاوية", "قيّم الماضغة قبل الملء", "وثّق الجانب"],
      en: ["Linear along the border then angle bolus", "Assess masseter bulk before fill", "Document lateral profile"],
    },
    complications: [
      vo("jaw-vo"),
      {
        id: "jaw-hematoma",
        name: L("המטומה מתרחבת", "ورم دموي متوسع", "Expanding hematoma"),
        urgency: "high",
        signs: { he: ["נפיחות מתקדמת", "כאב גובר", "אסימטריה חדשה"], ar: ["تورم مترقٍ", "ألم متزايد"], en: ["Progressive swelling", "Rising pain", "New asymmetry"] },
        actions: { he: ["לחץ / קירור", "השגחה", "הפניה אם מתרחב"], ar: ["ضغط / تبريد", "مراقبة"], en: ["Pressure / cooling", "Observe", "Refer if expanding"] },
      },
    ],
  },
  chin: {
    anatomy: {
      he: ["pogonion, mental foramen, mentalis", "pre-jowl sulcus", "הבחן שומן תת־סנטרי מול חוסר הטלה"],
      ar: ["الذقن والثقبة الذقنية والعضلة", "أمام الفك", "ميّز الدهن تحت الذقن عن نقص البروز"],
      en: ["Pogonion, mental foramen, mentalis", "Pre-jowl sulcus", "Distinguish submental fat from under-projection"],
    },
    pearls: {
      he: ["הערך פרופיל וסגר", "Kybella הוא פרוטוקול נפרד", "אל תמחק pre-jowl לגמרי"],
      ar: ["قيّم الجانب والإطباق", "Kybella بروتوكول منفصل", "لا تمحُ أمام الفك تماماً"],
      en: ["Assess profile and occlusion", "Kybella is a separate protocol", "Do not fully erase pre-jowl"],
    },
    complications: [
      vo("chin-vo"),
      {
        id: "chin-nerve",
        name: L("פגיעה בעצב מנטלי", "أذية العصب الذقني", "Mental nerve injury"),
        urgency: "high",
        signs: { he: ["נימול שפה/סנטר", "אסימטריה בתחושה"], ar: ["تنميل الشفة/الذقن"], en: ["Lip/chin numbness", "Sensory asymmetry"] },
        actions: { he: ["תעד", "מעקב", "הימנע מהשלמה באותו מישור"], ar: ["وثّق", "تابع"], en: ["Document", "Follow", "Do not top up in the same plane"] },
      },
    ],
  },
  nose: {
    anatomy: {
      he: ["עורקי dorsum / angular — מסלולים משתנים", "עור דק בגשר", "סחוס בקצה"],
      ar: ["شرايين الجسر والزاوي — مسارات متغيرة", "جلد رقيق", "غضروف في الذبابة"],
      en: ["Dorsal / angular arteries — variable paths", "Thin dorsal skin", "Tip cartilage"],
    },
    pearls: {
      he: ["הכשרה ייעודית או הימנע", "אליקוטות ≤0.05 מ״ל", "hyaluronidase פתוח על השולחן"],
      ar: ["تدريب خاص أو تجنّب", "دفعات ≤0.05 مل", "هيالورونيداز جاهز"],
      en: ["Dedicated training or do not treat", "Aliquots ≤0.05 ml", "Hyaluronidase open on the tray"],
    },
    complications: [
      vo("nose-vo"),
      {
        id: "nose-vision",
        name: L("איום על ראייה לאחר אף", "تهديد البصر بعد الأنف", "Vision threat after nose filler"),
        urgency: "critical",
        signs: { he: ["כאב חד", "שינוי ראייה", "הלבנה"], ar: ["ألم حاد", "تغير البصر", "شحوب"], en: ["Sharp pain", "Vision change", "Blanching"] },
        actions: { he: ["חירום עיניים מיידי", "ACE במקביל", "אל תשחרר מהמרפאה"], ar: ["طوارئ عيون", "ACE بالتوازي"], en: ["Immediate eye emergency", "ACE in parallel", "Do not discharge"] },
      },
    ],
  },
  temple: {
    anatomy: {
      he: ["שכבות מרובות; superficial temporal vessels", "חלל רקתי עמוק מול שטחי", "קרבה לאורביט"],
      ar: ["طبقات متعددة؛ أوعية صدغية سطحية", "تجويف عميق مقابل سطحي", "قرب الحجاج"],
      en: ["Multiple layers; superficial temporal vessels", "Deep vs superficial temporal hollow", "Proximity to orbit"],
    },
    pearls: {
      he: ["רק לאחר הכשרה ייעודית", "הזרקה איטית בשכבה שנלמדה", "השוואת מסגרת הפנים"],
      ar: ["بعد تدريب خاص فقط", "حقن بطيء في المستوى المتعلَّم", "وازن إطار الوجه"],
      en: ["Dedicated training only", "Slow injection in the taught plane", "Compare facial frame"],
    },
    complications: [vo("temple-vo")],
  },
  periocular: {
    anatomy: {
      he: ["orbicularis oculi", "tear trough / SOOF", "עור דק ומסלול לימפטי עדין"],
      ar: ["العضلة الدويرية", "تحت العين", "جلد رقيق ولمف دقيق"],
      en: ["Orbicularis oculi", "Tear trough / SOOF", "Thin skin and delicate lymphatics"],
    },
    pearls: {
      he: ["טוקסין לפי אנימציה, לא לפי מפה מועתקת", "מילוי trough — שמרנות קיצונית", "הימנע משכבה שטחית → Tyndall"],
      ar: ["التوكسين حسب الحركة", "فيلر تحت العين بتحفظ شديد", "تجنّب السطحي → تيندال"],
      en: ["Toxin by animation, not a copied map", "Trough filler — extreme conservatism", "Avoid superficial plane → Tyndall"],
    },
    complications: [
      {
        id: "peri-ptosis",
        name: L("פטיוזיס עפעף", "تدلي الجفن", "Eyelid ptosis"),
        urgency: "high",
        signs: { he: ["עפעף כבד", "אסימטריה", "שדה ראייה מוגבל"], ar: ["جفن ثقيل", "عدم تناظر"], en: ["Heavy lid", "Asymmetry", "Field restriction"] },
        actions: { he: ["תעד", "שקול אגוניסט α אם מתאים", "מעקב 2 שבועות"], ar: ["وثّق", "فكّر بمحفّز α", "متابعة أسبوعين"], en: ["Document", "Consider α-agonist if appropriate", "2-week review"] },
      },
      {
        id: "peri-tyndall",
        name: L("אפקט טינדל", "ظاهرة تيندال", "Tyndall effect"),
        urgency: "moderate",
        signs: { he: ["גוון כחלחל", "מילוי שטחי נראה"], ar: ["لون مزرق", "فيلر سطحي ظاهر"], en: ["Bluish hue", "Visible superficial filler"] },
        actions: { he: ["הסבר", "שקול המסה ממוקדת"], ar: ["شرح", "إذابة موضعية"], en: ["Counsel", "Consider focal dissolution"] },
      },
    ],
  },
  forehead: {
    anatomy: {
      he: ["frontalis — וקטור הרמה של הגבה", "כלי דם שטחיים", "שולי בטיחות מעל brow"],
      ar: ["الجبهية — رفع الحاجب", "أوعية سطحية", "هامش أمان فوق الحاجب"],
      en: ["Frontalis — brow elevator vector", "Superficial vessels", "Safety margin above the brow"],
    },
    pearls: {
      he: ["מפה במנוחה ובתנועה", "שמור arch", "גברים: מינון לפי שריר, לא העתקה"],
      ar: ["خطّط في الراحة والحركة", "حافظ على القوس", "حسب قوة العضلة"],
      en: ["Map at rest and in motion", "Preserve arch", "Dose to muscle, not a copied grid"],
    },
    complications: [
      {
        id: "fh-heaviness",
        name: L("כובד גבה / פטיוזיס", "ثقل الحاجب / تدلي", "Brow heaviness / ptosis"),
        urgency: "high",
        signs: { he: ["גבה יורדת", "עיניים עייפות", "אסימטריה"], ar: ["هبوط الحاجب", "عين متعبة"], en: ["Dropped brow", "Tired eye", "Asymmetry"] },
        actions: { he: ["הסבר משך טוקסין", "הימנע מתיקון אגרסיבי מוקדם"], ar: ["اشرح مدة التوكسين", "لا تصحّح بعدوانية مبكراً"], en: ["Counsel toxin duration", "Avoid early aggressive correction"] },
      },
    ],
  },
  glabella: {
    anatomy: {
      he: ["procerus + corrugator", "סופרא־טרוכלאר / סופרא־אורביטל", "סיכון וסקולרי קיצוני למילוי"],
      ar: ["النازلة والمغضنة", "أوعية فوق البكرة/الحجاج", "خطر وعائي شديد للفيلر"],
      en: ["Procerus + corrugator", "Supratrochlear / supraorbital", "Extreme vascular risk for filler"],
    },
    pearls: {
      he: ["טוקסין הוא ברירת המחדל", "אין מילוי שגרתי", "5–7 נקודות לפי דפוס שריר"],
      ar: ["التوكسين هو الأساس", "لا فيلر روتيني", "5–7 نقاط حسب العضلة"],
      en: ["Toxin is the default", "No routine filler", "5–7 points by muscle pattern"],
    },
    complications: [
      vo("glabella-vo"),
      {
        id: "glab-ptosis",
        name: L("פטיוזיס מטוקסין נמוך", "تدلي من توكسين منخفض", "Ptosis from low toxin"),
        urgency: "high",
        signs: { he: ["עפעף כבד תוך ימים"], ar: ["جفن ثقيل خلال أيام"], en: ["Heavy lid within days"] },
        actions: { he: ["תעד נקודות", "שקול α-agonist", "מעקב"], ar: ["وثّق النقاط", "محفّز α", "متابعة"], en: ["Document points", "Consider α-agonist", "Follow"] },
      },
    ],
  },
  neck: {
    anatomy: {
      he: ["platysma, עור דק", "BAP 5 נקודות צוואר", "קרבה למסלול בליעה"],
      ar: ["platysma وجلد رقيق", "BAP خمس نقاط", "قرب مسار البلع"],
      en: ["Platysma, thin skin", "Neck BAP 5 points", "Near swallowing pathway"],
    },
    pearls: {
      he: ["מפה רצועות לפני טוקסין", "אל תערבב volumizer באותו יום עם Profhilo", "Nefertiti — הכשרה"],
      ar: ["خطّط الأشرطة قبل التوكسين", "لا تخلط فوليومايزر مع Profhilo", "Nefertiti — تدريب"],
      en: ["Map bands before toxin", "Do not mix volumizer same day as Profhilo", "Nefertiti — trained only"],
    },
    complications: [
      {
        id: "neck-dysphagia",
        name: L("דיספגיה / חולשת צוואר", "عسر بلع / ضعف رقبة", "Dysphagia / neck weakness"),
        urgency: "high",
        signs: { he: ["קושי בבליעה", "ראש כבד"], ar: ["صعوبة بلع", "رأس ثقيل"], en: ["Swallowing difficulty", "Heavy head"] },
        actions: { he: ["הערכה דחופה", "הימנע מטוקסין נוסף", "הפניה אם נשימה/בליעה מחמירות"], ar: ["تقييم عاجل", "لا توكسين إضافي"], en: ["Urgent assessment", "No further toxin", "Refer if breathing/swallowing worsen"] },
      },
    ],
  },
  tmj: {
    anatomy: {
      he: ["masseter + temporalis", "מפרק TMJ, סגר דנטלי", "גבול בטוח אחורי־תחתון במססטר"],
      ar: ["الماضغة والصدغية", "المفصل والإطباق", "الحد الخلفي السفلي الآمن"],
      en: ["Masseter + temporalis", "TMJ joint, dental occlusion", "Safe posterior-inferior masseter zone"],
    },
    pearls: {
      he: ["זה טיפול בכאב — לא V-line בלבד", "דון night guard", "3–4 נקודות אחוריות־תחתונות"],
      ar: ["علاج ألم — ليس V-line فقط", "ناقش الحارس الليلي", "3–4 نقاط خلفية سفلية"],
      en: ["This is pain care — not V-line alone", "Discuss a night guard", "3–4 posterior-inferior points"],
    },
    complications: [
      {
        id: "tmj-bite",
        name: L("שינוי נשיכה / חולשת לעיסה", "تغير الإطباق / ضعف المضغ", "Bite change / chew weakness"),
        urgency: "moderate",
        signs: { he: ["קושי בלעיסה", "אסימטריה", "כאב חדש"], ar: ["صعوبة مضغ", "عدم تناظر"], en: ["Chewing difficulty", "Asymmetry", "New pain"] },
        actions: { he: ["הסבר משך", "הערכה דנטלית אם נמשך", "הימנע ממינון חוזר מוקדם"], ar: ["اشرح المدة", "تقييم سني"], en: ["Counsel duration", "Dental review if persists", "Avoid early re-dose"] },
      },
      {
        id: "tmj-dysphagia",
        name: L("דיספגיה מנקודה גבוהה/קדמית", "عسر بلع من نقطة مرتفعة/أمامية", "Dysphagia from high/anterior point"),
        urgency: "high",
        signs: { he: ["קושי בבליעה"], ar: ["صعوبة بلع"], en: ["Swallowing difficulty"] },
        actions: { he: ["הערכה", "תיעוד נקודות", "הפניה אם מחמיר"], ar: ["تقييم", "توثيق"], en: ["Assess", "Document points", "Refer if worsening"] },
      },
    ],
  },
  masseter: {
    anatomy: {
      he: ["מסת השריר, זווית הלסת", "ענפי עצב פנים", "גבול אחורי־תחתון בטוח"],
      ar: ["كتلة العضلة وزاوية الفك", "فروع العصب الوجهي", "الحد الخلفي السفلي الآمن"],
      en: ["Muscle bulk, mandibular angle", "Facial nerve branches", "Safe posterior-inferior border"],
    },
    pearls: {
      he: ["אל תחליש יתר — במיוחד לעיסה חזקה", "בדוק כוח נשיכה במעקב", "הבחן טיפולי (כאב) מול אסתטי (V-line)"],
      ar: ["لا تُضعف أكثر من اللازم", "افحص قوة العضّ", "ميّز العلاجي عن التجميلي"],
      en: ["Do not over-weaken — especially strong chewers", "Recheck bite strength", "Separate therapeutic vs V-line intent"],
    },
    complications: [
      {
        id: "mass-atrophy",
        name: L("אטרופיה יתר / חיוך אסימטרי", "ضمور مفرط / ابتسامة غير متناظرة", "Over-atrophy / asymmetric smile"),
        urgency: "moderate",
        signs: { he: ["שקיעה בלחי", "חיוך עקום", "חולשת לעיסה"], ar: ["هبوط الخد", "ابتسامة مائلة"], en: ["Cheek hollowing", "Crooked smile", "Chew weakness"] },
        actions: { he: ["המתן להתאוששות", "אל תוסיף באותו צד מוקדם"], ar: ["انتظر التعافي", "لا تُضف مبكراً"], en: ["Wait for recovery", "Do not add early on the same side"] },
      },
    ],
  },
  axilla: {
    anatomy: {
      he: ["בלוטות eccrine, Minor test", "שכבה תוך־עורית — לא שריר"],
      ar: ["الغدد العرقية، اختبار Minor", "داخل الأدمة — ليست عضلة"],
      en: ["Eccrine glands, Minor test", "Intradermal plane — not muscle"],
    },
    pearls: {
      he: ["Starch-iodine לפני grid", "1–1.5 ס״מ בין נקודות", "50 יח׳/צד ona-class טיפוסי — IFU מחייב"],
      ar: ["يود النشا قبل الشبكة", "1–1.5 سم بين النقاط", "50 و/جانب نموذجياً — النشرة ملزمة"],
      en: ["Starch-iodine before the grid", "1–1.5 cm spacing", "50 U/side ona-class typical — IFU governs"],
    },
    complications: [
      {
        id: "ax-weak",
        name: L("חולשת זרוע מעומק יתר", "ضعف ذراع من عمق زائد", "Arm weakness from too-deep injection"),
        urgency: "moderate",
        signs: { he: ["חולשה בהרמת זרוע"], ar: ["ضعف رفع الذراع"], en: ["Weakness lifting the arm"] },
        actions: { he: ["הסבר זמניות", "מעקב", "תעד עומק"], ar: ["اشرح أنه مؤقت", "متابعة"], en: ["Counsel transience", "Follow", "Document depth"] },
      },
    ],
  },
  migraine: {
    anatomy: {
      he: ["31 אתרי PREEMPT קבועים", "corrugator, procerus, frontalis, temporalis, occipitalis, paraspinal, trapezius", "לא מפת בוטוקס אסתטית"],
      ar: ["31 موقعاً ثابتاً", "عضلات الرأس والعنق المحددة", "ليست خريطة تجميل"],
      en: ["31 fixed PREEMPT sites", "Corrugator, procerus, frontalis, temporalis, occipitalis, paraspinal, trapezius", "Not an aesthetic botox map"],
    },
    pearls: {
      he: ["קריטריוני מיגרנה כרונית קודם", "155 יח׳ / 31 אתרים — עד 195 לפי תווית", "חזרה q12 weeks"],
      ar: ["معايير الشقيقة المزمنة أولاً", "155 و / 31 موقعاً", "كل 12 أسبوعاً"],
      en: ["Chronic migraine criteria first", "155 U / 31 sites — up to 195 per label", "Repeat q12 weeks"],
    },
    complications: [
      {
        id: "mig-neck",
        name: L("חולשת צוואר / דיספגיה", "ضعف رقبة / عسر بلع", "Neck weakness / dysphagia"),
        urgency: "high",
        signs: { he: ["ראש כבד", "קושי בבליעה"], ar: ["رأس ثقيل", "صعوبة بلع"], en: ["Heavy head", "Swallowing difficulty"] },
        actions: { he: ["הערכה", "אין תוספת צוואר באותו סשן", "הפניה אם מחמיר"], ar: ["تقييم", "لا إضافة رقبة"], en: ["Assess", "No extra neck toxin same session", "Refer if worsening"] },
      },
      {
        id: "mig-ptosis",
        name: L("פטיוזיס קדמי", "تدلي أمامي", "Anterior ptosis"),
        urgency: "moderate",
        signs: { he: ["עפעף כבד"], ar: ["جفن ثقيل"], en: ["Heavy lid"] },
        actions: { he: ["תעד אתרי PREEMPT", "מעקב"], ar: ["وثّق مواقع PREEMPT"], en: ["Document PREEMPT sites", "Follow"] },
      },
    ],
  },
};

export function getRegionDepth(regionId: string): RegionDepth | undefined {
  return REGION_DEPTH[regionId];
}
