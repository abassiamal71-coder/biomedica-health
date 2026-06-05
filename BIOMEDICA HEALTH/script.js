document.addEventListener('DOMContentLoaded', function () {
  const loader = document.getElementById('loader');
  const pageWrap = document.getElementById('pageWrap');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const appointmentForm = document.getElementById('appointmentForm');
  const bookingMessage = document.getElementById('bookingMessage');
  const doctorButtons = document.querySelectorAll('.book-doctor');
  const doctorSearch = document.getElementById('doctorSearch');
  const specialtyFilter = document.getElementById('specialtyFilter');
  const doctorCards = Array.from(document.querySelectorAll('.doctor-card'));
  const doctorSelect = document.getElementById('doctor');
  const appointmentSection = document.getElementById('appointment');
  const dateInput = document.getElementById('date');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const symptomInput = document.getElementById('symptomInput');
  const symptomResult = document.getElementById('symptomResult');
  const bmiBtn = document.getElementById('bmiBtn');
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const bmiResult = document.getElementById('bmiResult');

  setTimeout(() => {
    loader.style.display = 'none';
    pageWrap.style.opacity = '1';
  }, 1200);

  const savedDoctor = localStorage.getItem('selectedDoctor');
  if (savedDoctor && doctorSelect) {
    const optionExists = Array.from(doctorSelect.options).some(opt => opt.value === savedDoctor);
    if (optionExists) {
      doctorSelect.value = savedDoctor;
    }
  }

  initDoctorFilters();
  initFlatpickr();

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.textContent = 'Sombre';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.textContent = 'Clair';
    }
  });

  function filterDoctors() {
    const query = doctorSearch ? doctorSearch.value.trim().toLowerCase() : '';
    const specialty = specialtyFilter ? specialtyFilter.value : '';

    doctorCards.forEach(card => {
      const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const specialtyText = (card.dataset.specialty || '').toLowerCase();
      const matchesQuery = query === '' || name.includes(query) || specialtyText.includes(query);
      const matchesSpecialty = specialty === '' || specialtyText === specialty.toLowerCase();

      if (matchesQuery && matchesSpecialty) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  function initDoctorFilters() {
    if (doctorSearch) {
      doctorSearch.addEventListener('keyup', filterDoctors);
    }
    if (specialtyFilter) {
      specialtyFilter.addEventListener('change', filterDoctors);
    }
    filterDoctors();
  }

  function initFlatpickr() {
    if (window.flatpickr && dateInput) {
      flatpickr(dateInput, {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        altInput: true,
        altFormat: 'd F Y H:i',
        time_24hr: true,
        minDate: 'today',
        defaultHour: 9,
        minuteIncrement: 15,
        locale: {
          firstDayOfWeek: 1
        }
      });
    }
  }

  doctorButtons.forEach(button => {
    button.addEventListener('click', () => {
      const doctorName = button.getAttribute('data-doctor');
      localStorage.setItem('selectedDoctor', doctorName);
      if (doctorSelect) {
        doctorSelect.value = doctorName;
      }
      if (appointmentSection) {
        appointmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (dateInput) {
        dateInput.focus();
      }
    });
  });

  appointmentForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const date = document.getElementById('date').value;
    const doctor = document.getElementById('doctor').value;

    if (!name || !email || !date || !doctor) {
      bookingMessage.textContent = 'Veuillez remplir tous les champs pour confirmer votre rendez-vous.';
      bookingMessage.style.color = '#e74c3c';
      return;
    }

    const formattedDate = new Date(date).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });
    bookingMessage.textContent = `Merci ${name} ! Votre rendez-vous avec ${doctor} est confirmé pour le ${formattedDate}.`;
    bookingMessage.style.color = '#2ecc71';
    appointmentForm.reset();
  });

  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  analyzeBtn.addEventListener('click', function () {
    const symptomText = symptomInput.value.trim();
    if (!symptomText) {
      symptomResult.textContent = 'Veuillez saisir au moins un symptôme pour analyser.';
      return;
    }

    function normalize(text) {
      return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

        const normalizedSymptomText = normalize(symptomText);

    const categories = [
      {
        label: 'infection respiratoire',
        keys: ['fièvre', 'fievre', 'fever', 'toux', 'cough', 'grippe', 'rhume', 'mucus', 'gorge', 'nez qui coule', 'congestion', 'respiratoire'],
        advice: [
          'Reposez-vous, hydratez-vous et surveillez la température.',
          'Il peut s’agir d’une infection virale : prenez soin de vous et consultez si cela dure.',
          'Restez au chaud, buvez beaucoup d’eau et consultez un professionnel si les symptômes s’aggravent.',
          'Surveillez l’apparition de difficultés respiratoires et demandez un avis médical si besoin.'
        ]
      },
      {
        label: 'douleur ou inflammation',
        keys: ['douleur', 'douleur abdominale', 'pain', 'ache', 'courbature', 'inflammation', 'tension', 'brulure', 'fourmillement', 'raideur'],
        advice: [
          'Il peut s’agir d’une tension musculaire ou d’une inflammation locale.',
          'Surveillez le niveau de douleur et consultez si elle devient intense.',
          'Un repos ciblé et une application de froid/chaud peuvent aider, mais demandez l’avis d’un médecin si nécessaire.',
          'Ne forcez pas sur la zone douloureuse et adaptez vos gestes au besoin.'
        ]
      },
      {
        label: 'trouble digestif',
        keys: ['nausée', 'nausee', 'vomissement', 'vomit', 'maux de ventre', 'digestion', 'estomac', 'reflux', 'brulure d estomac', 'indigestion', 'ballonnement'],
        advice: [
          'Hydratez-vous et évitez les aliments lourds pour le moment.',
          'Il peut s’agir d’une irritation gastrique ou d’une indigestion.',
          'Consultez un professionnel si les symptômes persistent ou s’aggravent.',
          'Un petit repas léger peut aider à apaiser le système digestif.'
        ]
      },
      {
        label: 'céphalée',
        keys: ['mal de tête', 'mal de tete', 'céphalée', 'cephalee', 'migraine', 'headache', 'bourdonnement', 'vertige'],
        advice: [
          'Buvez de l’eau et reposez-vous dans un environnement calme.',
          'Si la douleur est vive ou accompagnée de vertiges, une consultation est recommandée.',
          'Surveillez l’évolution et évitez les écrans si cela aggrave le mal de tête.',
          'Un anti-douleur léger peut aider si l’inconfort est modéré.'
        ]
      },
      {
        label: 'fatigue',
        keys: ['fatigue', 'epuisement', 'epuisement', 'lassitude', 'tired', 'sommeil', 'somnolence'],
        advice: [
          'Prévoyez du repos et une bonne hydratation.',
          'Cela peut être lié au stress ou au manque de sommeil.',
          'Si la fatigue persiste, parlez-en à un professionnel de santé.',
          'Une pause régulière et une alimentation équilibrée peuvent améliorer votre énergie.'
        ]
      },
      {
        label: 'allergie',
        keys: ['allergie', 'eternuement', 'démangeaison', 'demangeaison', 'urticaire', 'nez qui coule', 'yeux qui piquent', 'conjonctivite', 'éternuement'],
        advice: [
          'Il peut s’agir d’une réaction allergique légère.',
          'Évitez les déclencheurs connus et consultez un spécialiste si nécessaire.',
          'Un antihistaminique ou un avis médical peut être utile selon la gravité.',
          'Rincez vos yeux ou votre nez si vous pensez qu’il s’agit d’un allergène.'
        ]
      }
    ];

    const matches = categories.filter(category =>
      category.keys.some(key => normalizedSymptomText.includes(normalize(key)))
    );

    let resultText;
    if (matches.length > 0) {
      resultText = matches.map(category => `Possible ${category.label}. ${getRandomItem(category.advice)}`).join(' ');
      if (matches.length > 1) {
        const additional = matches.slice(1).map(item => item.label).join(' et ');
        resultText += ` Vous mentionnez également des signes liés à ${additional}.`;
      }
      resultText += ' Si les symptômes persistent, consultez un spécialiste.';
    } else {
      const genericResponses = [
        'Votre description suggère un malaise général ; observez l’évolution dans les prochaines heures.',
        'Il est difficile de préciser une cause sans informations supplémentaires, mais surveillez les symptômes.',
        'Cela peut être un signe de fatigue ou de stress. Si cela persiste, consultez un professionnel de santé.',
        'Les symptômes sont variés : prenez du repos et demandez un avis médical si nécessaire.'
      ];
      resultText = `${getRandomItem(genericResponses)} Si cela persiste, consultez un professionnel de santé.`;
    }

    symptomResult.textContent = resultText;
  });

  bmiBtn.addEventListener('click', function () {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (!height || !weight) {
      bmiResult.textContent = 'Veuillez saisir des valeurs valides de taille et de poids.';
      return;
    }

    const heightMeters = height / 100;
    const bmi = weight / (heightMeters * heightMeters);
    const rounded = bmi.toFixed(1);
    let category = 'Normal';
    let advice = 'Très bien ! Continuez à adopter un mode de vie équilibré.';

    if (bmi < 18.5) {
      category = 'Insuffisance pondérale';
      advice = 'Votre IMC indique une insuffisance pondérale. Consultez un professionnel de santé pour un accompagnement nutritionnel.';
    } else if (bmi >= 25) {
      category = 'Surpoids';
      advice = 'Votre IMC indique un surpoids. De petits ajustements de mode de vie peuvent améliorer votre santé.';
    }

    bmiResult.innerHTML = `<strong>${rounded}</strong> — ${category}. ${advice}`;
  });

  const revealItems = document.querySelectorAll('section, .feature-card, .service-card, .testimonial-card, .doctor-card, .appointment-grid, .tool-panel, .footer');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(item => {
    observer.observe(item);
  });
});
