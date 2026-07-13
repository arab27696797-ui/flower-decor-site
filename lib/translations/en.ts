// lib/translations/en.ts
// English translation object — exact structural mirror of lib/translations/ru.ts.
// Same keys, same nesting depth, same object shape. Only string values differ.

import type { Translations } from './ru'

export const en: Translations = {

  // --------------------------------------------------------------------------
  // Common — buttons, labels, states
  // --------------------------------------------------------------------------
  common: {
    calculate:        'Calculate',
    addToEstimate:    'Add to estimate',
    removeItem:       'Remove',
    edit:             'Edit',
    send:             'Submit request',
    call:             'Call us',
    writeUs:          'Message us',
    close:            'Close',
    back:             'Back',
    next:             'Next',
    yes:              'Yes',
    no:               'No',
    loading:          'Loading…',
    sending:          'Sending…',
    required:         'Required field',
    optional:         'Optional',
    currency:         '₽',
    from:             'from',
    perUnit:          'per item',
    total:            'Total',
    subtotal:         'Subtotal',
    withMarkup:       'Estimated total',
    selectPlaceholder:'Select…',
    errorGeneric:     'Something went wrong. Please try again.',
    successGeneric:   'Done!',
  },

  // --------------------------------------------------------------------------
  // Validation messages
  // --------------------------------------------------------------------------
  validation: {
    nameRequired:    'Please enter your name',
    nameTooShort:    'Name must be at least 2 characters',
    phoneRequired:   'Please enter your phone number',
    phoneInvalid:    'Please enter a valid phone number',
    locationRequired:'Please specify the venue or delivery address',
    commentTooLong:  'Comment must not exceed 1,000 characters',
  },

  // --------------------------------------------------------------------------
  // Navigation
  // --------------------------------------------------------------------------
  nav: {
    services:   'Services',
    portfolio:  'Portfolio',
    calculator: 'Calculator',
    contacts:   'Contacts',
    admin:      'Admin panel',
    callButton: 'Call us',
    langSwitch: 'RU',
  },

  // --------------------------------------------------------------------------
  // Hero section
  // --------------------------------------------------------------------------
  hero: {
    headline:    'Full event decoration\nwithin 24 hours',
    subheadline: 'Floral décor, balloon installations, weddings, entrance zones and corporate events — turnkey in Moscow',
    cta:         'Get an estimate',
    ctaSecondary:'View our work',
    badge:       'Available 24/7 · Setup from 24 hours after payment',
  },

  // --------------------------------------------------------------------------
  // Services section
  // --------------------------------------------------------------------------
  services: {
    sectionTitle:   'Our services',
    sectionSubtitle:'Everything you need for a flawless celebration',
    items: {
      artificialFlowers: {
        title:       'Artificial flower décor',
        description: 'Long-lasting compositions using premium artificial flowers. Perfect for permanent installations and corporate spaces.',
      },
      freshFlowers: {
        title:       'Fresh flower décor',
        description: 'Seasonal and exotic fresh flowers. We bring living colour and fragrance to your event.',
      },
      balloons: {
        title:       'Balloon decoration',
        description: 'Arches, garlands, photo zones and large-scale installations. From simple accents to showstopping compositions.',
      },
      urgentBouquet: {
        title:       'Urgent bouquet from ₽15,000',
        description: 'Signature bouquets of fresh flowers. Same-day delivery available — just call us.',
      },
      eventDecor: {
        title:       'Event decoration',
        description: 'Weddings, corporate events, entrance zones, anniversaries — complete turnkey decoration within 24 hours of payment.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // Advantages / trust section
  // --------------------------------------------------------------------------
  advantages: {
    sectionTitle:   'Why clients choose us',
    sectionSubtitle:'We deliver results — on every project, every time',
    items: {
      speed: {
        title:       '24 hours — our standard, not a promise',
        description: 'We are ready to fully decorate your venue within 24 hours of receiving payment.',
      },
      quality: {
        title:       'Premium materials only',
        description: 'Flowers from trusted suppliers, European-grade balloons, and hardware with no compromises.',
      },
      team: {
        title:       'Experienced decoration team',
        description: 'Over 500 completed projects: weddings, corporate events, city-wide events, and private celebrations.',
      },
      price: {
        title:       'Transparent pricing, no hidden fees',
        description: 'The calculator gives you a ballpark figure. The final price is fixed in a contract before work begins.',
      },
      urgent: {
        title:       'We handle urgent orders',
        description: 'Need a bouquet today? A decorated hall by tomorrow morning? We take rush orders and deliver on time.',
      },
      geography: {
        title:       'Moscow and the Moscow Region',
        description: 'We travel anywhere in Moscow and the surrounding area. Ask about delivery costs when submitting your request.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // Calculator section
  // --------------------------------------------------------------------------
  calculator: {
    sectionTitle:    'Price calculator',
    sectionSubtitle: 'Select one or more categories. All choices accumulate into a single estimate.',
    disclaimer:      'Approximate cost only. The final price depends on measurements, composition, materials, delivery, urgency, and approval.',
    addCategory:     'Add category',
    estimateTitle:   'Your estimate',
    emptyEstimate:   'Your estimate is empty — add at least one category to get started',
    totalLabel:      'Estimated total',
    markupNote:      'Full-service fee is included in the total.',
    sendEstimate:    'Submit this estimate as a request',
    resetAll:        'Reset estimate',
    categories: {
      floral: {
        label:       'Floral decoration',
        description: 'Fresh, artificial, or mixed flowers',
        fields: {
          eventType:   'Event type',
          flowerType:  'Flower type',
          scale:       'Decoration scale',
          density:     'Style / density',
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
        label:       'Urgent bouquet from ₽15,000',
        description: 'Signature fresh flower bouquets',
        fields: {
          occasion:    'Occasion',
          bouquetSize: 'Bouquet size',
          addBalloons: 'Add balloons to bouquet',
          urgency:     'Urgency',
        },
      },
      event: {
        label:       'Event decoration',
        description: 'Weddings, corporate events, entrance zones',
        fields: {
          eventType:  'Event type',
          zoneType:   'Zone type',
          scale:      'Scale',
          urgency:    'Urgency',
        },
      },
    },
  },

  // --------------------------------------------------------------------------
  // Lead form section
  // --------------------------------------------------------------------------
  leadForm: {
    sectionTitle:    'Send a request',
    sectionSubtitle: 'We will get back to you within 30 minutes during business hours.',
    fields: {
      name:     { label: 'Your name',              placeholder: 'e.g. Anna' },
      phone:    { label: 'Phone number',            placeholder: '+7 (___) ___-__-__' },
      location: { label: 'Venue / delivery address',placeholder: 'Address, district, or venue name' },
      comment:  { label: 'Wishes / notes',          placeholder: 'Event date, special requests, questions…' },
    },
    estimateSummaryTitle: 'Your estimate (from calculator)',
    estimateEmpty:        'No estimate added — you can build one in the calculator above.',
    submitButton:         'Submit request',
    submittingButton:     'Sending…',
    successTitle:         'Request received!',
    successMessage:       'We have received your request and will be in touch shortly. Expect a call or message from us.',
    errorTitle:           'Submission error',
    errorMessage:         'We could not send your request. Please call us directly or try again.',
    privacyNote:          'By clicking "Submit request" you consent to the processing of your personal data in accordance with our',
    privacyLink:          'Privacy Policy',
  },

  // --------------------------------------------------------------------------
  // Contacts section
  // --------------------------------------------------------------------------
  contacts: {
    sectionTitle:    'Contact us',
    sectionSubtitle: 'Reach us through any channel that suits you',
    phone:           'Phone',
    whatsapp:        'WhatsApp',
    telegram:        'Telegram',
    instagram:       'Instagram',
    workingHours:    'Working hours',
    workingHoursValue:'Daily, 9:00 AM — 10:00 PM',
    address:         'Location',
    addressValue:    'Moscow and the Moscow Region',
    callNow:         'Call now',
    writeWhatsapp:   'Write on WhatsApp',
    writeTelegram:   'Write on Telegram',
  },

  // --------------------------------------------------------------------------
  // Cookie banner
  // --------------------------------------------------------------------------
  cookie: {
    message:
      'We use cookies to ensure the site works correctly, analyse traffic, and improve your experience. ' +
      'By continuing to use the site you agree to our use of cookies.',
    accept:    'Accept',
    decline:   'Decline',
    learnMore: 'Learn more',
    policyLink:'/privacy-policy',
  },

  // --------------------------------------------------------------------------
  // Footer
  // --------------------------------------------------------------------------
  footer: {
    tagline: 'Creating the atmosphere of your celebration',
    nav: {
      services:   'Services',
      portfolio:  'Portfolio',
      calculator: 'Calculator',
      contacts:   'Contacts',
    },
    legal: {
      privacy:     'Privacy Policy',
      personalData:'Personal Data Processing',
      cookies:     'Cookie Policy',
    },
    copyright:  '© {year} Floral Decor. All rights reserved.',
    disclaimer: 'This site does not accept payments. All payments are made after terms have been agreed.',
  },

  // --------------------------------------------------------------------------
  // Privacy policy page (placeholder — awaiting legal review)
  // --------------------------------------------------------------------------
  privacyPolicy: {
    pageTitle:   'Privacy Policy',
    lastUpdated: 'Last updated: {date}',
    intro:
      'This Privacy Policy describes how we collect, use, and protect the personal data of our website ' +
      'users in accordance with applicable data protection legislation.',
    sections: {
      dataCollected: {
        title: 'What data we collect',
        body:
          'When you submit a request form we collect: your name, phone number, venue address or delivery location, ' +
          'and any information you provide in the comments field.',
      },
      dataPurpose: {
        title: 'Purpose of data processing',
        body:
          'The data collected is used solely to contact you regarding your submitted request and to agree on ' +
          'the details of the services provided. We do not share your data with third parties.',
      },
      cookies: {
        title: 'Use of cookies',
        body:
          'Our site uses technical cookies to ensure basic functionality, as well as analytical cookies to ' +
          'understand how users interact with the site. You may disable cookies in your browser settings.',
      },
      dataRetention: {
        title: 'Data retention',
        body:
          'Request data is stored in a secure database and deleted upon your request or upon expiry of the ' +
          'retention period established by applicable law.',
      },
      rights: {
        title: 'Your rights',
        body:
          'You have the right to request access to, correction of, or deletion of your personal data. ' +
          'To do so, please contact us using the details provided on the site.',
      },
      contact: {
        title: 'Data controller contact',
        body:
          'For questions regarding the processing of personal data, please contact us by phone or through the enquiry form.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // Portfolio section
  // --------------------------------------------------------------------------
  portfolio: {
    sectionTitle:   'Our work',
    sectionSubtitle:'Real projects — from intimate bouquets to grand wedding halls',
    loadMore:       'Load more',
    noItems:        'Portfolio is being updated. Please check back soon.',
    categories: {
      all:       'All work',
      floral:    'Floral décor',
      balloons:  'Balloon décor',
      wedding:   'Weddings',
      corporate: 'Corporate events',
      bouquet:   'Bouquets',
    },
  },

  // --------------------------------------------------------------------------
  // 404 / not found page
  // --------------------------------------------------------------------------
  notFound: {
    title:       'Page not found',
    description: 'The page may have been moved or removed.',
    backHome:    'Back to home',
  },

}
