// src/data/criteriaData.js

export const criteriaData = [
  {
    id: "empathy-tone",
    title: "Empathy & Tone",
    subtitle: "Acknowledge guest concern",
    good: [
      "Acknowledge the concern and emotion",
      "Stay calm, professional, and supportive",
      "Confirm you will review and help",
    ],
    approvedPhrases: [
      "“I understand how frustrating this is. I’m here to help and I’ll review this with you now.”",
    ],
    misses: ["Blaming the guest/hotel", "Sounding rushed", "Ignoring the emotion"],
    examples: ["Guest is upset about a charge → acknowledge + confirm next steps."],
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
    subtitle: "Answer professionally using Hotel Reservations branding",
    good: ["Correct brand name", "Agent name stated", "Warm opening question"],
    approvedPhrases: [
      "“Thank you for calling Hotel Reservations. My name is __, how may I assist you?”",
    ],
    misses: ["Wrong brand name", "No agent name", "No greeting"],
    examples: ["Proper greeting delivered in first 5 seconds."],
    quiz: [
      {
        q: "Which greeting is correct?",
        options: [
          "Thanks for calling, what do you want?",
          "Thank you for calling Hotel Reservations, my name is __, how may I assist you today?",
          "Hello hotel planner!",
        ],
        answerIndex: 1,
      },
      {
        q: "What must be included in the greeting?",
        options: ["Only hotel name", "Brand + agent name + offer to help", "Nothing"],
        answerIndex: 1,
      },
    ],
  },

  {
    id: "group-booking-flow",
    title: "Group Booking Flow",
    subtitle: "Identify group request (9+ rooms)",
    good: [
      "Confirm if 9+ rooms",
      "Ask destination city/state FIRST",
      "Collect dates + room count + contact info",
    ],
    approvedPhrases: [
      "“What is the city and state of your destination?”",
      "“How many rooms and what dates are you looking for?”",
    ],
    misses: ["Treating group like normal booking", "Skipping destination question"],
    examples: ["Guest wants 12 rooms → follow group flow."],
    quiz: [
      { q: "What qualifies as a group request?", options: ["3+", "5+", "9+"], answerIndex: 2 },
      {
        q: "First question for group requests?",
        options: [
          "What’s your itinerary number?",
          "What is the city and state of your destination?",
          "Can I have your credit card number?",
        ],
        answerIndex: 1,
      },
    ],
  },

  {
    id: "verification-accuracy",
    title: "Verification & Reservation Accuracy",
    subtitle: "Confirm itinerary + guest + hotel + dates when applicable",
    good: [
      "Ask for itinerary number when applicable",
      "Confirm guest name, hotel, check-in/out dates",
      "Verify location and dates are correct",
    ],
    approvedPhrases: [
      "“May I please confirm the itinerary number starting with H?”",
      "“Can you confirm the guest name, hotel name, and check-in/check-out dates?”",
    ],
    misses: ["Skipping verification", "Wrong dates repeated back", "Wrong hotel confirmed"],
    examples: ["Guest wants modification → verify all details first."],
    quiz: [
      {
        q: "What should you confirm when a guest has a reservation?",
        options: ["Only hotel", "Only dates", "Itinerary + guest + hotel + dates"],
        answerIndex: 2,
      },
      {
        q: "When should you ask for itinerary number?",
        options: ["Always", "When applicable / guest has a booking", "Never"],
        answerIndex: 1,
      },
    ],
  },

  {
    id: "refunds-policy",
    title: "Refunds & Policy Compliance",
    subtitle: "Explain policy + timeline clearly (no false promises)",
    good: [
      "Check policy and explain it clearly",
      "No fake confirmations of refunds",
      "Set correct refund timeline expectations",
    ],
    approvedPhrases: [
      "“Let me review the cancellation policy attached to your booking.”",
      "“If approved, refunds can take 2–10 business days to process.”",
    ],
    misses: ["Promising refund without policy", "Saying “you will get refunded”"],
    examples: ["Non-refundable booking → explain policy and next steps."],
    quiz: [
      {
        q: "What is the safe way to speak about refunds?",
        options: [
          "Guarantee a refund to calm the guest",
          "Explain policy and say refund depends on approval",
          "Tell them to call the hotel and hang up",
        ],
        answerIndex: 1,
      },
      {
        q: "Refund processing timeline (if approved) is typically:",
        options: ["Instant", "2–10 business days", "60 days always"],
        answerIndex: 1,
      },
    ],
  },

  {
    id: "recap-next-steps",
    title: "Recap & Next Steps",
    subtitle: "Summarize actions taken and what happens next",
    good: [
      "Recap what you did",
      "Confirm what the guest should expect next",
      "Offer anything else before ending",
    ],
    approvedPhrases: [
      "“Just to recap: we confirmed your details, reviewed policy, and the next step is __.”",
      "“Is there anything else I can assist you with today?”",
    ],
    misses: ["Ending without recap", "No expectations set", "Abrupt closing"],
    examples: ["After creating a ticket → recap + timeline + close politely."],
    quiz: [
      {
        q: "What is the purpose of a recap?",
        options: ["Waste time", "Clarify what was done and what’s next", "Avoid guest questions"],
        answerIndex: 1,
      },
      {
        q: "Best final question before ending the call?",
        options: [
          "Okay bye.",
          "Is there anything else I can help you with today?",
          "Don’t call back.",
        ],
        answerIndex: 1,
      },
    ],
  },
];

// ✅ Default export for your imports
export default criteriaData;
