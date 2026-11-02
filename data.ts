export interface RiddleItem {
  id: number;
  letter: string;
  category: 'days' | 'colors' | 'travel';
  categoryEs: string;
  categoryHy: string;
  titleEs: string;
  titleHy: string;
  questionEs: string;
  questionHy: string;
  answerEs: string;
  answerHy: string;
  aliases: string[];
}

export interface SpeakingQuestion {
  id: number;
  questionEs: string;
  questionHy: string;
  suggestedStartEs: string;
  suggestedStartHy: string;
}

export const SPANISH_ALPHABET_27 = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

export const RIDDLES: RiddleItem[] = [
  // --- Parte 1. Los días de la semana (1-9) ---
  {
    id: 1,
    letter: 'A',
    category: 'days',
    categoryEs: 'Los días de la semana',
    categoryHy: 'Շաբաթվա օրեր',
    titleEs: '¿Qué día soy?',
    titleHy: 'Ո՞ր օրն եմ ես։',
    questionEs: 'Soy el primer día de la semana. Muchas personas vuelven al trabajo y los estudiantes vuelven al colegio. ¿Quién soy?',
    questionHy: 'Ես շաբաթվա առաջին օրն եմ։ Շատ մարդիկ վերադառնում են աշխատանքի, իսկ աշակերտները՝ դպրոց։ Ո՞ր օրն եմ ես։',
    answerEs: 'El lunes',
    answerHy: 'Երկուշաբթի',
    aliases: ['lunes', 'el lunes', 'երկուշաբթի']
  },
  {
    id: 2,
    letter: 'B',
    category: 'days',
    categoryEs: 'Los días de la semana',
    categoryHy: 'Շաբաթվա օրեր',
    titleEs: 'Adivina el día',
    titleHy: 'Գուշակիր օրը',
    questionEs: 'Estoy después del lunes y antes del miércoles. ¿Qué día soy?',
    questionHy: 'Ես երկուշաբթիից հետո եմ, բայց չորեքշաբթիից առաջ։ Ո՞ր օրն եմ ես։',
    answerEs: 'El martes',
    answerHy: 'Երեքշաբթի',
    aliases: ['martes', 'el martes', 'երեքշաբթի']
  },
  {
    id: 3,
    letter: 'C',
    category: 'days',
    categoryEs: 'Los días de la semana',
    categoryHy: 'Շաբաթվա օրեր',
    titleEs: 'El día del medio',
    titleHy: 'Միջին օրը',
    questionEs: 'Soy el tercer día de la semana. Mi nombre tiene nueve letras en español. ¿Quién soy?',
    questionHy: 'Ես շաբաթվա երրորդ օրն եմ։ Իսպաներեն իմ անունն ունի ինը տառ։ Ո՞ր օրն եմ ես։',
    answerEs: 'El miércoles',
    answerHy: 'Չորեքշաբթի',
    aliases: ['miercoles', 'miércoles', 'el miercoles', 'el miércoles', 'չորեքշաբթի']
  },
  {
    id: 4,
    letter: 'D',
    category: 'days',
    categoryEs: 'Los días de la semana',
    categoryHy: 'Շաբաթվա օրեր',
    titleEs: 'Un día misterioso',
    titleHy: 'Առեղծվածային օր',
    questionEs: 'Si ayer fue miércoles y mañana será viernes, ¿qué día es hoy?',
    questionHy: 'Եթե երեկ չորեքշաբթի էր, իսկ վաղը ուրբաթ է լինելու, ապա այսօր ի՞նչ օր է։',
    answerEs: 'El jueves',
    answerHy: 'Հինգշաբթի',
    aliases: ['jueves', 'el jueves', 'հինգշաբթի']
  },
  {
    id: 5,
    letter: 'E',
    category: 'days',
    categoryEs: 'Los días de la semana',
    categoryHy: 'Շաբաթվա օրեր',
    titleEs: 'Casi vacaciones',
    titleHy: 'Գրեթե հանգստյան օր է',
    questionEs: 'Llego después del jueves. Muchos estudiantes están contentos porque al día siguiente no tienen colegio. ¿Quién soy?',
    questionHy: 'Ես գալիս եմ հինգշաբթիից հետո։ Շատ աշակերտներ ուրախ են, որովհետև հաջորդ օրը դպրոց չունեն։ Ո՞ր օրն եմ ես։',
    answerEs: 'El viernes',
    answerHy: 'Ուրբաթ',
    aliases: ['viernes', 'el viernes', 'ուրբաթ']
  },
  {
    id: 6,
    letter: 'F',
    category: 'days',
    categoryEs: 'Los días de la semana',
    categoryHy: 'Շաբաթվա օրեր',
    titleEs: 'El partido de fútbol',
    titleHy: 'Ֆուտբոլային հանդիպումը',
    questionEs: 'No tienes colegio y hoy juegas un partido. Es el día que está entre el viernes y el domingo. ¿Qué día es?',
    questionHy: 'Դպրոց չունես, և այսօր ֆուտբոլային հանդիպում ես խաղում։ Այս օրը ուրբաթի և կիրակիի միջև է։ Ի՞նչ օր է։',
    answerEs: 'El sábado',
    answerHy: 'Շաբաթ',
    aliases: ['sabado', 'sábado', 'el sabado', 'el sábado', 'շաբաթ']
  },
  {
    id: 7,
    letter: 'G',
    category: 'days',
    categoryEs: 'Los días de la semana',
    categoryHy: 'Շաբաթվա օրեր',
    titleEs: 'El último día',
    titleHy: 'Վերջին օրը',
    questionEs: 'Soy el último día de la semana. Después de mí llega el lunes. ¿Quién soy?',
    questionHy: 'Ես շաբաթվա վերջին օրն եմ։ Ինձանից հետո գալիս է երկուշաբթին։ Ո՞ր օրն եմ ես։',
    answerEs: 'El domingo',
    answerHy: 'Կիրակի',
    aliases: ['domingo', 'el domingo', 'կիրակի']
  },
  {
    id: 8,
    letter: 'H',
    category: 'days',
    categoryEs: 'Los días de la semana',
    categoryHy: 'Շաբաթվա օրեր',
    titleEs: 'Piensa rápido',
    titleHy: 'Արագ մտածիր',
    questionEs: 'Si hoy es viernes, ¿qué día será dentro de tres días?',
    questionHy: 'Եթե այսօր ուրբաթ է, ապա երեք օր հետո ի՞նչ օր կլինի։',
    answerEs: 'El lunes',
    answerHy: 'Երկուշաբթի',
    aliases: ['lunes', 'el lunes', 'երկուշաբթի']
  },
  {
    id: 9,
    letter: 'I',
    category: 'days',
    categoryEs: 'Los días de la semana',
    categoryHy: 'Շաբաթվա օրեր',
    titleEs: 'Viaje sorpresa',
    titleHy: 'Անակնկալ ճանապարհորդություն',
    questionEs: 'Hoy es martes. Vas a viajar dentro de cuatro días. ¿Qué día viajarás?',
    questionHy: 'Այսօր երեքշաբթի է։ Չորս օրից ճանապարհորդելու ես։ Ո՞ր օրը կմեկնես։',
    answerEs: 'El sábado',
    answerHy: 'Շաբաթ',
    aliases: ['sabado', 'sábado', 'el sabado', 'el sábado', 'շաբաթ']
  },

  // --- Parte 2. Los colores (10-18) ---
  {
    id: 10,
    letter: 'J',
    category: 'colors',
    categoryEs: 'Los colores',
    categoryHy: 'Գույներ',
    titleEs: 'El color del cielo',
    titleHy: 'Երկնքի գույնը',
    questionEs: 'Soy el color del cielo cuando hace buen tiempo y no hay nubes. También soy el color del mar en muchos dibujos. ¿Qué color soy?',
    questionHy: 'Ես երկնքի գույնն եմ, երբ եղանակը լավ է և ամպեր չկան։ Շատ նկարներում ծովը նույնպես իմ գույնն ունի։ Ի՞նչ գույն եմ ես։',
    answerEs: 'Azul',
    answerHy: 'Կապույտ',
    aliases: ['azul', 'el azul', 'կապույտ', 'blue']
  },
  {
    id: 11,
    letter: 'K',
    category: 'colors',
    categoryEs: 'Los colores',
    categoryHy: 'Գույներ',
    titleEs: 'El color de la naturaleza',
    titleHy: 'Բնության գույնը',
    questionEs: 'Soy el color de la hierba, de muchas hojas y de los campos de fútbol. ¿Quién soy?',
    questionHy: 'Ես խոտի, շատ տերևների և ֆուտբոլային խաղադաշտերի գույնն եմ։ Ո՞ր գույնն եմ։',
    answerEs: 'Verde',
    answerHy: 'Կանաչ',
    aliases: ['verde', 'el verde', 'կանաչ']
  },
  {
    id: 12,
    letter: 'L',
    category: 'colors',
    categoryEs: 'Los colores',
    categoryHy: 'Գույներ',
    titleEs: 'El tomate misterioso',
    titleHy: 'Առեղծվածային լոլիկը',
    questionEs: 'Soy el color de muchos tomates maduros, de las fresas y de los corazones que dibujamos. ¿Qué color soy?',
    questionHy: 'Ես շատ հասած լոլիկների, ելակների և մեր նկարած սրտիկների գույնն եմ։ Ի՞նչ գույն եմ։',
    answerEs: 'Rojo',
    answerHy: 'Կարմիր',
    aliases: ['rojo', 'el rojo', 'roja', 'կարմիր']
  },
  {
    id: 13,
    letter: 'M',
    category: 'colors',
    categoryEs: 'Los colores',
    categoryHy: 'Գույներ',
    titleEs: 'El color del sol',
    titleHy: 'Արևի գույնը',
    questionEs: 'Soy el color de los plátanos maduros y del sol en los dibujos infantiles. ¿Qué color soy?',
    questionHy: 'Ես հասած բանանի և մանկական նկարներում արևի գույնն եմ։ Ի՞նչ գույն եմ։',
    answerEs: 'Amarillo',
    answerHy: 'Դեղին',
    aliases: ['amarillo', 'el amarillo', 'amarilla', 'դեղին']
  },
  {
    id: 14,
    letter: 'N',
    category: 'colors',
    categoryEs: 'Los colores',
    categoryHy: 'Գույներ',
    titleEs: 'El muñeco de nieve',
    titleHy: 'Ձնեմարդը',
    questionEs: 'Soy el color de la nieve, de la leche y de muchas nubes. ¿Quién soy?',
    questionHy: 'Ես ձյան, կաթի և շատ ամպերի գույնն եմ։ Ո՞ր գույնն եմ։',
    answerEs: 'Blanco',
    answerHy: 'Սպիտակ',
    aliases: ['blanco', 'el blanco', 'blanca', 'սպիտակ']
  },
  {
    id: 15,
    letter: 'Ñ',
    category: 'colors',
    categoryEs: 'Los colores',
    categoryHy: 'Գույներ',
    titleEs: 'El color de la noche',
    titleHy: 'Գիշերվա գույնը',
    questionEs: 'Soy un color muy oscuro. Muchas personas me eligen para sus zapatos elegantes. ¿Qué color soy?',
    questionHy: 'Ես շատ մուգ գույն եմ։ Շատ մարդիկ ինձ ընտրում են իրենց դասական կոշիկների համար։ Ի՞նչ գույն եմ։',
    answerEs: 'Negro',
    answerHy: 'Սև',
    aliases: ['negro', 'el negro', 'negra', 'սև']
  },
  {
    id: 16,
    letter: 'O',
    category: 'colors',
    categoryEs: 'Los colores',
    categoryHy: 'Գույներ',
    titleEs: 'La fruta y el color',
    titleHy: 'Միրգը և գույնը',
    questionEs: 'Soy un color y también el nombre de una fruta cítrica. Soy una mezcla de rojo y amarillo. ¿Quién soy?',
    questionHy: 'Ես և՛ գույն եմ, և՛ ցիտրուսային մրգի անուն։ Ստացվում եմ կարմիրի և դեղինի խառնուրդից։ Ի՞նչ գույն եմ։',
    answerEs: 'Naranja',
    answerHy: 'Նարնջագույն',
    aliases: ['naranja', 'el naranja', 'anaranjado', 'anaranjada', 'նարնջագույն']
  },
  {
    id: 17,
    letter: 'P',
    category: 'colors',
    categoryEs: 'Los colores',
    categoryHy: 'Գույներ',
    titleEs: 'El chocolate',
    titleHy: 'Շոկոլադը',
    questionEs: 'Soy el color del chocolate con leche, del café tostado y de la madera de muchos muebles. ¿Qué color soy?',
    questionHy: 'Ես կաթնային շոկոլադի, բոված սուրճի և շատ կահույքների փայտի գույնն եմ։ Ի՞նչ գույն եմ։',
    answerEs: 'Marrón',
    answerHy: 'Շագանակագույն',
    aliases: ['marron', 'marrón', 'el marron', 'el marrón', 'cafe', 'café', 'շագանակագույն']
  },
  {
    id: 18,
    letter: 'Q',
    category: 'colors',
    categoryEs: 'Los colores',
    categoryHy: 'Գույներ',
    titleEs: 'Mezcla de colores',
    titleHy: 'Գույների խառնուրդ',
    questionEs: 'Si mezclas pintura roja con pintura azul, ¿qué color puedes obtener?',
    questionHy: 'Եթե կարմիր և կապույտ ներկերը խառնես, ի՞նչ գույն կարող ես ստանալ։',
    answerEs: 'Morado / Violeta',
    answerHy: 'Մանուշակագույն',
    aliases: ['morado', 'violeta', 'el morado', 'la violeta', 'purpura', 'púrpura', 'մամուշակագույն', 'մանուշակագույն']
  },

  // --- Parte 3. Los viajes (19-27) ---
  {
    id: 19,
    letter: 'R',
    category: 'travel',
    categoryEs: 'Los viajes',
    categoryHy: 'Ճանապարհորդություններ',
    titleEs: 'El documento importante',
    titleHy: 'Կարևոր փաստաթուղթը',
    questionEs: 'Soy un documento que necesitas para viajar a muchos países. Tengo tu foto, tu nombre y tu nacionalidad. ¿Qué soy?',
    questionHy: 'Ես փաստաթուղթ եմ, որն անհրաժեշտ է շատ երկրներ ճանապարհորդելու համար։ Ունեմ քո լուսանկարը, անունը և քաղաքացիությունը։ Ի՞նչ եմ ես։',
    answerEs: 'El pasaporte',
    answerHy: 'Անձնագիր',
    aliases: ['pasaporte', 'el pasaporte', 'անձնագիր']
  },
  {
    id: 20,
    letter: 'S',
    category: 'travel',
    categoryEs: 'Los viajes',
    categoryHy: 'Ճանապարհորդություններ',
    titleEs: 'La compañera de viaje',
    titleHy: 'Ճանապարհորդության ուղեկիցը',
    questionEs: 'Tengo ruedas, pero no soy un coche. Guardas tu ropa dentro de mí y me llevas al aeropuerto. ¿Qué soy?',
    questionHy: 'Ես անիվներ ունեմ, բայց մեքենա չեմ։ Իմ մեջ պահում ես հագուստդ և ինձ տանում օդանավակայան։ Ի՞նչ եմ ես։',
    answerEs: 'La maleta',
    answerHy: 'Ճամպրուկ',
    aliases: ['maleta', 'la maleta', 'valija', 'equipaje', 'ճամպրուկ']
  },
  {
    id: 21,
    letter: 'T',
    category: 'travel',
    categoryEs: 'Los viajes',
    categoryHy: 'Ճանապարհորդություններ',
    titleEs: 'El gigante del cielo',
    titleHy: 'Երկնքի հսկան',
    questionEs: 'Tengo alas, pero no soy un pájaro. Puedo llevar a cientos de pasajeros de un país a otro. ¿Qué soy?',
    questionHy: 'Ես թևեր ունեմ, բայց թռչուն չեմ։ Կարող եմ հարյուրավոր ուղևորների տեղափոխել մի երկրից մյուսը։ Ի՞նչ եմ ես։',
    answerEs: 'El avión',
    answerHy: 'Ինքնաթիռ',
    aliases: ['avion', 'avión', 'el avion', 'el avión', 'aeroplano', 'ինքնաթիռ']
  },
  {
    id: 22,
    letter: 'U',
    category: 'travel',
    categoryEs: 'Los viajes',
    categoryHy: 'Ճանապարհորդություններ',
    titleEs: 'Una casa temporal',
    titleHy: 'Ժամանակավոր տուն',
    questionEs: 'Cuando viajas, puedes dormir en mis habitaciones. Tengo recepción y, muchas veces, desayuno incluido. ¿Qué soy?',
    questionHy: 'Երբ ճանապարհորդում ես, կարող ես քնել իմ սենյակներում։ Ես ունեմ ընդունարան, իսկ հաճախ նաև ներառված նախաճաշ։ Ի՞նչ եմ ես։',
    answerEs: 'El hotel',
    answerHy: 'Հյուրանոց',
    aliases: ['hotel', 'el hotel', 'hostal', 'հյուրանոց']
  },
  {
    id: 23,
    letter: 'V',
    category: 'travel',
    categoryEs: 'Los viajes',
    categoryHy: 'Ճանապարհորդություններ',
    titleEs: 'El camino secreto',
    titleHy: 'Գաղտնի ճանապարհը',
    questionEs: 'No soy una persona, pero puedo ayudarte a encontrar calles, ciudades y países. Puedo estar en papel o en tu móvil. ¿Qué soy?',
    questionHy: 'Ես մարդ չեմ, բայց կարող եմ օգնել գտնել փողոցներ, քաղաքներ և երկրներ։ Կարող եմ լինել թղթի վրա կամ հեռախոսիդ մեջ։ Ի՞նչ եմ ես։',
    answerEs: 'El mapa',
    answerHy: 'Քարտեզ',
    aliases: ['mapa', 'el mapa', 'քարտեզ', 'gps']
  },
  {
    id: 24,
    letter: 'W',
    category: 'travel',
    categoryEs: 'Los viajes',
    categoryHy: 'Ճանապարհորդություններ',
    titleEs: 'Un viaje sobre raíles',
    titleHy: 'Ճանապարհորդություն ռելսերով',
    questionEs: 'Tengo muchos vagones. No vuelo y no navego. Viajo sobre raíles y llevo pasajeros de una estación a otra. ¿Qué soy?',
    questionHy: 'Ես շատ վագոններ ունեմ։ Չեմ թռչում և չեմ լողում։ Շարժվում եմ ռելսերով և ուղևորներին տեղափոխում եմ մի կայարանից մյուսը։ Ի՞նչ եմ ես։',
    answerEs: 'El tren',
    answerHy: 'Գնացք',
    aliases: ['tren', 'el tren', 'ferrocarril', 'գնացք']
  },
  {
    id: 25,
    letter: 'X',
    category: 'travel',
    categoryEs: 'Los viajes',
    categoryHy: 'Ճանապարհորդություններ',
    titleEs: 'Antes de subir al avión',
    titleHy: 'Մինչև ինքնաթիռ նստելը',
    questionEs: 'En mí puedes ver tu nombre, tu número de vuelo y tu asiento. Me muestras antes de subir al avión. ¿Qué soy?',
    questionHy: 'Ինձ վրա կարող ես տեսնել քո անունը, թռիչքի համարը և նստատեղը։ Ինձ ցույց ես տալիս ինքնաթիռ նստելուց առաջ։ Ի՞նչ եմ ես։',
    answerEs: 'La tarjeta de embarque',
    answerHy: 'Նստեցման կտրոն',
    aliases: ['tarjeta de embarque', 'la tarjeta de embarque', 'billete', 'pase de abordar', 'boleto', 'նստեցման կտրոն']
  },
  {
    id: 26,
    letter: 'Y',
    category: 'travel',
    categoryEs: 'Los viajes',
    categoryHy: 'Ճանապարհորդություններ',
    titleEs: 'El lugar de los aviones',
    titleHy: 'Ինքնաթիռների վայրը',
    questionEs: 'Muchas personas llegan con maletas y pasaportes. Aquí despegan y aterrizan los aviones. ¿Qué lugar soy?',
    questionHy: 'Շատ մարդիկ այստեղ են գալիս ճամպրուկներով և անձնագրերով։ Այստեղ ինքնաթիռները թռչում և վայրէջք են կատարում։ Ի՞նչ վայր եմ ես։',
    answerEs: 'El aeropuerto',
    answerHy: 'Օդանավակայան',
    aliases: ['aeropuerto', 'el aeropuerto', 'օդանավակայան']
  },
  {
    id: 27,
    letter: 'Z',
    category: 'travel',
    categoryEs: 'Los viajes',
    categoryHy: 'Ճանապարհորդություններ',
    titleEs: 'La persona que conoce la ciudad',
    titleHy: 'Քաղաքը ճանաչող մարդը',
    questionEs: 'Acompaño a los turistas, les enseño lugares interesantes y les explico la historia de la ciudad. ¿Quién soy?',
    questionHy: 'Ես ուղեկցում եմ զբոսաշրջիկներին, ցույց տալիս հետաքրքիր վայրեր և պատմում քաղաքի պատմությունը։ Ո՞վ եմ ես։',
    answerEs: 'El guía turístico / La guía turística',
    answerHy: 'Զբոսավար',
    aliases: ['guia', 'guía', 'el guia', 'la guia', 'el guía', 'la guía', 'guia turistico', 'guía turístico', 'guía turística', 'զբոսավար']
  }
];

export const SPEAKING_QUESTIONS: SpeakingQuestion[] = [
  {
    id: 1,
    questionEs: '¿Cuál es tu día favorito de la semana?',
    questionHy: 'Շաբաթվա ո՞ր օրն է քո ամենասիրելին։',
    suggestedStartEs: 'Mi día favorito de la semana es...',
    suggestedStartHy: 'Իմ ամենասիրելի օրն է...'
  },
  {
    id: 2,
    questionEs: '¿Qué haces normalmente los domingos?',
    questionHy: 'Ի՞նչ ես սովորաբար անում կիրակի օրերին։',
    suggestedStartEs: 'Los domingos normalmente...',
    suggestedStartHy: 'Կիրակի օրերին ես սովորաբար...'
  },
  {
    id: 3,
    questionEs: '¿De qué color es tu camiseta favorita?',
    questionHy: 'Ի՞նչ գույնի է քո ամենասիրելի մարզաշապիկը։',
    suggestedStartEs: 'Mi camiseta favorita es de color...',
    suggestedStartHy: 'Իմ ամենասիրելի մարզաշապիկը ... գույնի է։'
  },
  {
    id: 4,
    questionEs: '¿Qué colores tiene la bandera de España?',
    questionHy: 'Ի՞նչ գույներ ունի Իսպանիայի դրոշը։',
    suggestedStartEs: 'La bandera de España tiene rojo y...',
    suggestedStartHy: 'Իսպանիայի դրոշն ունի կարմիր և...'
  },
  {
    id: 5,
    questionEs: '¿A qué país te gustaría viajar?',
    questionHy: 'Ո՞ր երկիր կցանկանայիր ճանապարհորդել։',
    suggestedStartEs: 'Me gustaría viajar a...',
    suggestedStartHy: 'Ես կցանկանայի ճանապարհորդել...'
  },
  {
    id: 6,
    questionEs: '¿Prefieres viajar en avión o en tren?',
    questionHy: 'Նախընտրո՞ւմ ես ճանապարհորդել ինքնաթիռով, թե գնացքով։',
    suggestedStartEs: 'Prefiero viajar en... porque...',
    suggestedStartHy: 'Ես նախընտրում եմ ճանապարհորդել ... որովհետև...'
  },
  {
    id: 7,
    questionEs: '¿Qué llevarías en tu maleta para un viaje de una semana?',
    questionHy: 'Ի՞նչ կվերցնեիր ճամպրուկիդ մեջ մեկշաբաթյա ճանապարհորդության համար։',
    suggestedStartEs: 'En mi maleta llevaría ropa, pasaporte y...',
    suggestedStartHy: 'Իմ ճամպրուկում ես կվերցնեի հագուստ, անձնագիր և...'
  }
];

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:()\-–—_]/g, '')
    .replace(/\s+/g, ' ');
}

export function checkAnswerMatch(userAnswer: string, item: RiddleItem): boolean {
  const normUser = normalizeText(userAnswer);
  if (!normUser) return false;

  const targetNorms = [
    normalizeText(item.answerEs),
    normalizeText(item.answerHy),
    ...item.aliases.map(a => normalizeText(a))
  ];

  // Exact or alias match
  if (targetNorms.includes(normUser)) return true;

  // Stripping leading Spanish articles (el, la, los, las, un, una)
  const stripArticle = (s: string) => s.replace(/^(el|la|los|las|un|una)\s+/, '');
  const userStripped = stripArticle(normUser);

  for (const t of targetNorms) {
    if (userStripped === stripArticle(t)) return true;
  }

  return false;
}
