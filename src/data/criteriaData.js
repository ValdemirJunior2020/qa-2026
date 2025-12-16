// src/data/criteriaData.js
// ✅ Default export so: import criteriaData from "../data/criteriaData" works everywhere

const criteriaData = [
  {
    id: "empathy-tone",
    title: "Empathy & Tone",
    short: "Acknowledge guest concern",
    whatGoodLooksLike: [
      "Acknowledge the guest’s emotions before troubleshooting",
      "Use calm, confident wording and keep control of the call",
      "Take ownership of next steps and set clear expectations",
    ],
    approvedPhrases: [
      "I understand how frustrating this is — I’m here to help.",
      "Let me review the details with you and we’ll get this resolved.",
      "Thank you for your patience — I’m checking that now.",
    ],
    commonMisses: [
      "Sounding rushed or dismissive",
      "Blaming the hotel or the guest",
      "Ignoring emotions and jumping straight to policies",
    ],
    examples: [
      "Guest: “I’m really upset.” → Agent: “I understand. Let’s take care of this together.”",
      "Agent confirms details, explains next steps, and recaps at the end.",
    ],
    quiz: [
      {
        q: "Which response best matches empathy & tone expectations?",
        options: [
          "That’s not my fault. You need to call the hotel.",
          "I understand how frustrating this is. I’m here to help and I’ll review the details with you now.",
          "Calm down. It happens.",
        ],
        answerIndex: 1,
      },
      {
        q: "What is the correct tone standard during a complaint?",
        options: [
          "Match the guest’s anger",
          "Stay calm, professional, empathetic, and in control",
          "Talk fast to end the call quickly",
        ],
        answerIndex: 1,
      },
    ],
  },

  {
    id: "greeting-brand",
    title: "Greeting & Brand Standard",
    short: "Answer professionally using Hotel Reservations branding",
    whatGoodLooksLike: [
      "Use the required greeting + your name",
      "Use correct brand: Hotel Reservations",
      "Confirm you can assist and transition smoothly into discovery",
    ],
    approvedPhrases: [
      "Thank you for calling Hotel Reservations. My name is ___, how may I assist you today?",
      "I’ll be happy to help — may I please have your itinerary number?",
    ],
    commonMisses: ["Incorrect brand name", "No greeting", "No agent name"],
    examples: ["Professional greeting with calm tone", "Brand standard used consistently"],
    quiz: [
      {
        q: "Which greeting matches HP 2026 expectations?",
        options: [
          "HotelPlanner support. What do you need?",
          "Thank you for calling Hotel Reservations. My name is ___, how may I assist you today?",
          "Reservations.",
        ],
        answerIndex: 1,
      },
      {
        q: "What brand name should the agent use?",
        options: ["Hotel Reservations", "HotelPlanner", "The hotel front desk"],
        answerIndex: 0,
      },
    ],
  },

  {
    id: "group-booking-flow",
    title: "Group Booking Flow",
    short: "Identify as group request (9+ rooms)",
    whatGoodLooksLike: [
      "Confirm it’s a group (9+ rooms) early",
      "First question: destination city + state",
      "Set expectations: rates sent by email, changes require a new request when applicable",
    ],
    approvedPhrases: [
      "What is the city and state of your destination?",
      "For group requests, what I’m able to do is provide the best group rates and send them via email.",
      "To qualify for group rates, we need 9 or more rooms — how many rooms are you requesting?",
    ],
    commonMisses: [
      "Treating group like a normal reservation",
      "Skipping destination city/state question",
      "Not setting expectations about email delivery/timeline",
    ],
    examples: [
      "Guest wants 12 rooms → agent confirms destination, dates, room count, then explains email quote process.",
    ],
    quiz: [
      {
        q: "What is the FIRST question an agent should ask for group requests?",
        options: [
          "What is your itinerary number?",
          "What is the city and state of your destination?",
          "Do you want a refund?",
        ],
        answerIndex: 1,
      },
      {
        q: "How many rooms qualify as a group request?",
        options: ["5+", "9+", "Any number"],
        answerIndex: 1,
      },
    ],
  },

  {
    id: "refunds-policy",
    title: "Refunds & Policy Compliance",
    short: "Explain refund policy and timeline clearly",
    whatGoodLooksLike: [
      "Check hotel cancellation policy first",
      "Avoid promising refunds when not approved",
      "Explain timelines clearly (ex: 2–10 business days when approved)",
    ],
    approvedPhrases: [
      "Let me review the hotel’s cancellation policy for your reservation.",
      "If approved, refunds typically take 2–10 business days to post depending on your bank.",
      "I can escalate this for review — I’ll explain the next steps clearly.",
    ],
    commonMisses: [
      "Promising a refund before policy review",
      "No timeline / vague expectation setting",
      "Not offering an alternative (rebook/help options)",
    ],
    examples: ["Agent reviews policy, explains options, escalates properly if needed."],
    quiz: [
      {
        q: "What should an agent do before promising a refund?",
        options: [
          "Guarantee it to calm the guest",
          "Check the hotel cancellation policy and reservation details",
          "Tell the guest to call the hotel",
        ],
        answerIndex: 1,
      },
    ],
  },

  {
    id: "verification-accuracy",
    title: "Verification & Reservation Accuracy",
    short: "Confirm itinerary number when applicable",
    whatGoodLooksLike: [
      "Confirm itinerary number (when applicable)",
      "Confirm guest name, hotel name, check-in/check-out dates",
      "Verify location and details match request",
    ],
    approvedPhrases: [
      "May I please have your itinerary number that starts with the letter H?",
      "Please confirm the guest name and the hotel name on the reservation.",
      "Let’s confirm your check-in and check-out dates to make sure everything is correct.",
    ],
    commonMisses: ["Skipping verification", "Wrong hotel/dates not caught", "No recap of confirmed info"],
    examples: ["Agent verifies itinerary + hotel + dates before taking action."],
    quiz: [
      {
        q: "Which set of details should be verified for a booking?",
        options: ["Only the guest name", "Itinerary, guest name, hotel name, dates", "Only the price"],
        answerIndex: 1,
      },
    ],
  },

  {
    id: "recap-next-steps",
    title: "Recap & Next Steps",
    short: "Summarize action taken",
    whatGoodLooksLike: [
      "Summarize what was done and what will happen next",
      "Confirm guest understands timelines and expectations",
      "Close professionally",
    ],
    approvedPhrases: [
      "Just to recap, today we…",
      "Your next step is… and you can expect…",
      "Is there anything else I can assist you with today?",
    ],
    commonMisses: ["No recap", "Unclear next steps", "Abrupt ending"],
    examples: ["Agent recaps: changes made, confirmation email timing, and closes politely."],
    quiz: [
      {
        q: "Why is a recap important?",
        options: ["It wastes time", "It confirms actions and sets clear expectations", "It’s only for supervisors"],
        answerIndex: 1,
      },
    ],
  },
];

export default criteriaData;
export { criteriaData };
