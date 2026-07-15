// lib/translations/en.ts
// English translation object — mirrors lib/translations/ru.ts exactly.
// Same keys, same nesting depth, natural English marketing copy.
// Do NOT add keys here that are not present in ru.ts, and vice versa.

export const en = {

  // --------------------------------------------------------------------------
  // Common — buttons, labels, states
  // --------------------------------------------------------------------------
  common: {
    calculate:         'Calculate',
    addToEstimate:     'Add to estimate',
    removeItem:        'Remove',
    edit:              'Edit',
    send:              'Submit request',
    call:              'Call us',
    writeUs:           'Message us',
    close:             'Close',
    back:              'Back',
    next:              'Next',
    yes:               'Yes',
    no:                'No',
    loading:           'Loading...',
    sending:           'Sending...',
    required:          'Required field',
    optional:          'Optional',
    currency:          '₽',
    from:              'from',
    perUnit:           'per item',
    total:             'Total',
    subtotal:          'Subtotal',
    withMarkup:        'Final estimate',
    selectPlaceholder: 'Select...',
    errorGeneric:      'Something went wrong. Please try again.',
    successGeneric:    'Done!',
  },

  // --------------------------------------------------------------------------
  // Validation messages
  // --------------------------------------------------------------------------
  validation: {
    nameRequired:     'Please enter your name',
    nameTooShort:     'Name must be at least 2 characters',
    phoneRequired:    'Please enter your phone number',
    phoneInvalid:     'Please enter a valid phone number',
    locationRequired: 'Please provide the venue or delivery address',
    commentTooLong:   'Comment must not exceed 1,000 characters',
  },

  // --------------------------------------------------------------------------
  // Navigation
  // --------------------------------------------------------------------------
  nav: {
    services:   'Services',
    portfolio:  'Portfolio',
    calculator: 'Calculator',
    contacts:   'Contact',
    admin:      'Admin panel',
    callButton: 'Call us',
    langSwitch: 'RU',
  },

  // --------------------------------------------------------------------------
  // Hero section
  // --------------------------------------------------------------------------
  hero: {
    // Legacy keys — preserved for any remaining references
    headline:    'Event decoration\nin 24 hours',
    subheadline: 'Floral décor, balloons, weddings, entrance zones and corporate events — full service in Moscow',
    cta:         'Calculate the cost',
    badge:       'Available 24/7 · On-site within 24 hours of payment',

    // New keys — required by components/site/hero-section.tsx
    ariaLabel: 'Hero — Si-Si, premium floral decoration in Moscow',
    eyebrow:   'Premium event decoration · Moscow',

    heading: {
      line1: 'Flowers & décor',
      line2: 'for moments',
      line3: 'worth remembering',
    },

    subheading:
      'Fresh florals, balloons, and textile installations — composed into ' +
      'a complete visual story for your event. Based in Moscow, ' +
      'we arrive within 24 hours of payment.',

    ctaPrimary:   'Get an estimate',
    ctaSecondary: 'Submit a request',

    trust: {
      speed:    'On-site within 24 hours',
      quality:  'Fresh flowers only',
      location: 'Moscow & surroundings',
    },

    card: {
      eyebrow: 'Indicative pricing',
      body: {
        before: 'With a base budget of',
        middle: 'for fresh florals and our full-service fee of',
        after:  'the estimated total comes to approximately',
      },
      disclaimer:
        'Approximate only. Final price depends on measurements, composition, ' +
        'materials, delivery, and urgency.',
    },

    imageAlt:   'Wedding floral decoration — fresh flowers, arches and hall styling by Si-Si',
    photoLabel: 'From our portfolio',
  },

  // --------------------------------------------------------------------------
  // Services section
  // --------------------------------------------------------------------------
  services: {
    sectionTitle:    'Our services',
    sectionSubtitle: 'Everything you need for a beautifully decorated event',
    items: {
      artificialFlowers: {
        title:       'Artificial flowers',
        description: 'Long-lasting compositions from premium artificial florals. Ideal for permanent installations and corporate spaces.',
      },
      freshFlowers: {
        title:       'Fresh flowers',
        description: 'Seasonal and exotic fresh blooms. We fill your event with fragrance and living colour.',
      },
      balloons: {
        title:       'Balloon decoration',
        description: 'Arches, garlands, photo zones, and large-scale installations. From subtle accents to dramatic statements.',
      },
      urgentBouquet: {
        title:       'Urgent bouquet from ₽15,000',
        description: 'Bespoke bouquets from fresh flowers. Same-day delivery available — just call us.',
      },
      eventDecor: {
        title:       'Event decoration',
        description: 'Weddings, corporate events, entrance zones, anniversaries — full turnkey service within 24 hours of payment.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // Advantages / trust section
  // --------------------------------------------------------------------------
  advantages: {
    sectionTitle:    'Why clients choose us',
    sectionSubtitle: 'We deliver results — every project, every time',
    items: {
      speed: {
        title:       '24 hours is our standard, not a promise',
        description: 'We are ready to fully decorate your venue within 24 hours of receiving payment.',
      },
      quality: {
        title:       'Premium materials only',
        description: 'Flowers from trusted suppliers, European-grade balloons, and hardware we never compromise on.',
      },
      team: {
        title:       'Experienced decoration team',
        description: 'Over 500 completed projects: weddings, corporate events, city-wide celebrations, and private parties.',
      },
      price: {
        title:       'Transparent pricing, no hidden fees',
        description: 'The calculator gives an indicative figure. The final cost is fixed in writing before any work begins.',
      },
      urgent: {
        title:       'We handle urgent orders',
        description: 'Need a bouquet today? Or a fully decorated hall by tomorrow morning? We take urgent orders and deliver.',
      },
      geography: {
        title:       'Moscow & the Moscow region',
        description: 'We travel anywhere in Moscow and the surrounding area. Confirm delivery cost when submitting your request.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // Calculator section
  // --------------------------------------------------------------------------
  calculator: {
    sectionTitle:    'Price calculator',
    sectionSubtitle: 'Choose one or more categories. All selections accumulate into a single estimate.',
    disclaimer:
      'Approximate cost only. The final price depends on measurements, ' +
      'composition, materials, delivery, urgency, and final approval.',
    addCategory:   'Add category',
    estimateTitle: 'Your estimate',
    emptyEstimate: 'Your estimate is empty — add at least one category to begin',
    totalLabel:    'Final estimate',
    markupNote:    'Full-service fee is included in the price.',
    sendEstimate:  'Submit request with this estimate',
    resetAll:      'Reset estimate',
    categories: {
      floral: {
        label:       'Floral decoration',
        description: 'Fresh, artificial, or mixed florals',
        fields: {
          eventType:  'Event type',
          flowerType: 'Flower type',
          scale:      'Decoration scale',
          density:    'Density / style',
        },
      },
      balloons: {
        label:       'Balloon decoration',
        description: 'Arches, garlands, panels, installations',
        fields: {
          eventType:        'Event type',
          scale:            'Scale',
          compositionLevel: 'Composition complexity',
          extraHelium:      'Add helium balloons',
        },
      },
      bouquet: {
        label:       'Urgent bouquet',
        description: 'Bespoke fresh-flower bouquet, from ₽15,000',
        fields: {
          occasion:      'Occasion',
          bouquetSize:   'Bouquet size',
          extraBalloons: 'Add balloons',
          urgency:       'Urgency',
        },
      },
      event: {
        label:       'Event decoration',
        description: 'Weddings, corporate events, entrance zones',
        fields: {
          eventType: 'Event type',
          zoneType:  'Zone type',
          scale:     'Scale',
          urgency:   'Urgency',
        },
      },
    },
  },

  // --------------------------------------------------------------------------
  // Lead form section
  // --------------------------------------------------------------------------
  leadForm: {
    sectionTitle:    'Submit a request',
    sectionSubtitle: 'Describe your project and we will get back to you within the hour',
    fields: {
      name:     'Your name',
      phone:    'Phone number',
      location: 'Venue or delivery address',
      comment:  'Wishes and notes',
    },
    placeholders: {
      name:     'How should we address you?',
      phone:    '+7 (___) ___-__-__',
      location: 'Address, venue name, or Moscow district',
      comment:  'Event date, details, special requests...',
    },
    submitButton:    'Submit request',
    successTitle:    'Request submitted!',
    successMessage:  'Our manager will be in touch shortly. Thank you!',
    errorMessage:    'Could not submit your request. Please call us directly.',
    estimateSummary: 'Your calculator estimate',
    noEstimate:      'No estimate calculated yet',
    spamProtection:  'By clicking Submit, you agree to the processing of your personal data.',
  },

  // --------------------------------------------------------------------------
  // Contacts section
  // --------------------------------------------------------------------------
  contacts: {
    sectionTitle:    'Contact us',
    sectionSubtitle: 'Reach us by any convenient method',
    phone:           'Phone',
    workingHours:    'Working hours',
    workingHoursVal: 'Daily, 9:00 AM – 10:00 PM',
    address:         'Location',
    addressVal:      'Moscow',
    callUs:          'Call',
    writeWhatsapp:   'WhatsApp',
    writeTelegram:   'Telegram',
    writeVk:         'VKontakte',
  },

  // --------------------------------------------------------------------------
  // Cookie banner
  // --------------------------------------------------------------------------
  cookie: {
    message:
      'We use cookies to ensure the site works correctly and to improve ' +
      'your experience. By continuing to use this site, you agree to our',
    policyLink:    'Privacy Policy',
    acceptButton:  'Accept',
    declineButton: 'Decline',
  },

  // --------------------------------------------------------------------------
  // Footer
  // --------------------------------------------------------------------------
  footer: {
    tagline:       'Premium floral event decoration in Moscow',
    privacyPolicy: 'Privacy Policy',
    personalData:  'Personal Data Processing',
    cookiePolicy:  'Cookie Policy',
    rights:        '© 2024 Si-Si. All rights reserved.',
    sections: {
      services: 'Services',
      company:  'Company',
      legal:    'Legal',
    },
  },

  // --------------------------------------------------------------------------
  // Privacy policy page
  // --------------------------------------------------------------------------
  privacy: {
    pageTitle:   'Privacy Policy',
    lastUpdated: 'Last updated',
    intro:
      'This policy describes how Si-Si collects, uses, and protects ' +
      'your personal data in accordance with applicable data protection law.',
  },

  // --------------------------------------------------------------------------
  // Admin panel — UI labels (not customer-facing copy)
  // --------------------------------------------------------------------------
  admin: {
    loginTitle:          'Admin panel login',
    loginSubtitle:       'Enter the administrator password',
    loginButton:         'Sign in',
    loginError:          'Incorrect password',
    logoutButton:        'Sign out',
    dashboardTitle:      'Overview',
    pricingTitle:        'Calculator pricing',
    contactsTitle:       'Contact details',
    portfolioTitle:      'Portfolio',
    saveButton:          'Save',
    savedMessage:        'Saved',
    helpTitle:           'Instructions',
    passwordLabel:       'Password',
    passwordPlaceholder: 'Enter password...',
    navDashboard:        'Home',
    navPricing:          'Pricing',
    navContacts:         'Contacts',
    navPortfolio:        'Portfolio',
  },

}
