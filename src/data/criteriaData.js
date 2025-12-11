// src/data/criteriaData.js

const criteriaData = [
  {
    id: "agent-readiness",
    title: "Agent Readiness",
    points: 2,
    shortDescription: "Agent is ready and available to receive the call.",
    expectations: [
      "Answers within 3–5 seconds of the call arriving.",
      "Headset and systems are ready (no fumbling or long delays).",
      "No background noise or side conversations when the call starts."
    ],
    trainingSections: [
      "1.1. Introduction to HotelPlanner",
      "1.13. Soft Skills"
    ]
  },
  {
    id: "correct-introduction",
    title: "Correct Introduction",
    points: 4,
    shortDescription:
      'Uses the correct greeting: "Thank you for calling Hotel Reservations, my name is ____, how may I assist you?"',
    expectations: [
      "Opens every call with the official HP introduction.",
      "Uses the same name/alias consistently on every call.",
      "Tone is warm, confident, and professional."
    ],
    trainingSections: [
      "1.1. Introduction to HotelPlanner",
      "1.13. Soft Skills",
      "1.15. Voice Quality Assurance Form"
    ]
  },
  {
    id: "acknowledge-request",
    title: "Acknowledgment of Guest Request",
    points: 4,
    shortDescription:
      "Shows understanding of why the guest is calling before taking any action.",
    expectations: [
      "Restates the reason for the call in clear, simple language.",
      "Uses short phrases like “I understand” or “Absolutely, I can help with that.”",
      "Does not jump into tools or actions before confirming the main request."
    ],
    trainingSections: [
      "1.13. Soft Skills"
    ]
  },
  {
    id: "verification",
    title: "Verification Process",
    points: 10,
    shortDescription:
      "Confirms name, itinerary, hotel, and dates before any changes or actions.",
    expectations: [
      "Confirms guest first and last name.",
      "Confirms itinerary number.",
      "Confirms hotel name.",
      "Confirms check-in and check-out dates.",
      "Does not skip verification even if the caller is in a hurry."
    ],
    trainingSections: [
      "1.2. Documenting Notes and Drop Down Selections",
      "1.3. Cancellation of Reservation",
      "1.4. Modification of Reservation",
      "1.7. Charges and Disputes"
    ]
  },
  {
    id: "hold-expectations",
    title: "Call Efficiency & Expectations",
    points: 10,
    shortDescription:
      "Sets clear expectations when placing the caller on hold or working in the background.",
    expectations: [
      "Explains why the caller is being placed on hold.",
      "Gives a realistic time estimate for the hold.",
      "Provides updates if hold time is longer than expected.",
      "Follows HP processes: calling the hotel, using Slack, and escalating when needed."
    ],
    trainingSections: [
      "1.6. Voice Escalation Matrix",
      "1.7. Charges and Disputes",
      "1.18. Call Back Policy",
      "1.19. Refund Tool"
    ]
  },
  {
    id: "documentation",
    title: "Documentation (Notes)",
    points: 25,
    shortDescription:
      "Takes clear, complete notes in systems (FIT, Zendesk, and internal tools).",
    expectations: [
      "Notes explain the reason for the call and the actions taken.",
      "Tickets are created when required (refund review, dispute, escalation).",
      "Information is clear enough that another agent or leader can understand the full story later."
    ],
    trainingSections: [
      "1.2. Documenting Notes and Drop Down Selections",
      "3.1. Zen Desk Training",
      "3.2. Refunds on Cancellations – Tickets",
      "3.3. Modification of Reservation – Tickets"
    ]
  },
  {
    id: "recap",
    title: "Recap & Expectations",
    points: 15,
    shortDescription:
      "Recaps the call and sets correct expectations before ending the interaction.",
    expectations: [
      "Summarizes the guest’s request and what was done during the call.",
      "Explains next steps and realistic timelines (for example, “within 24–48 hours”).",
      "Thanks the guest for calling.",
      "Allows the guest to disconnect first when possible."
    ],
    trainingSections: [
      "1.13. Soft Skills",
      "1.18. Call Back Policy",
      "1.16. Refund Protection"
    ]
  },
  {
    id: "telephone-technique",
    title: "Telephone Technique",
    points: 15,
    shortDescription:
      "Uses professional voice, tone, pace, and language throughout the call.",
    expectations: [
      "Uses the guest’s name correctly and respectfully.",
      "Speaks clearly at a calm, understandable pace.",
      "Avoids slang, jargon, or internal language with customers.",
      "Does not interrupt or talk over the guest.",
      "Does not provide any misinformation."
    ],
    trainingSections: [
      "1.11. Phonetic Alphabet",
      "1.12. US State Abbreviations",
      "1.13. Soft Skills"
    ]
  },
  {
    id: "ownership-solutions",
    title: "Explore Solutions & Ownership",
    points: 15,
    shortDescription:
      "Takes ownership of the issue and explores all appropriate solutions within HP policies.",
    expectations: [
      "Uses phrases that show ownership like “Let me take care of this for you.”",
      "Explores appropriate alternatives when the first option is not available.",
      "Follows HP processes for escalation, refund review, relocation, or VIP when needed.",
      "Avoids placing responsibility back on the guest when HP can assist."
    ],
    trainingSections: [
      "1.6. Voice Escalation Matrix",
      "1.16. Refund Protection",
      "3.5. Ticket Escalation Matrix",
      "3.7. Relocation Requests and VIP"
    ]
  }
];

export default criteriaData;
