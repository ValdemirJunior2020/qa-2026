// src/data/quizData.js
/**
 * Quiz bank keyed by criterionId (must match criteriaData IDs exactly).
 * If a criterionId is missing or has an empty array, the app shows “Quiz coming soon”.
 */

const quizData = {
  greeting: [
    {
      id: "greeting-1",
      question: "Which greeting best matches HP 2026 expectations?",
      options: [
        "Hi. Yeah, what’s going on?",
        "Thank you for calling Hotel Reservations. My name is [Name], how may I assist you?",
        "HotelPlanner reservations, what do you want?",
      ],
      correctIndex: 1,
    },
    {
      id: "greeting-2",
      question: "What is required in the opening?",
      options: [
        "Only the agent name",
        "Branding + agent name + offer of help",
        "Only asking for itinerary number immediately",
      ],
      correctIndex: 1,
    },
  ],

  verification: [
    {
      id: "verification-1",
      question: "What should the agent verify when the guest has a reservation?",
      options: [
        "Only the guest name",
        "Itinerary number, guest name, hotel/property, and check-in/check-out dates",
        "Only the hotel name",
      ],
      correctIndex: 1,
    },
    {
      id: "verification-2",
      question: "Why do we repeat details back to the guest?",
      options: [
        "To fill time on the call",
        "To prevent errors and confirm accuracy before taking action",
        "Because it is optional and doesn’t matter",
      ],
      correctIndex: 1,
    },
  ],

  empathy: [
    {
      id: "empathy-1",
      question: "Which response best matches empathy & tone expectations?",
      options: [
        "That’s not my fault. You need to call the hotel.",
        "I understand how frustrating this is. I’m here to help and I’ll review the details with you now.",
        "Calm down. It happens.",
      ],
      correctIndex: 1,
    },
    {
      id: "empathy-2",
      question: "What is the correct tone standard during a complaint?",
      options: [
        "Match the guest’s anger",
        "Stay calm, professional, empathetic, and in control",
        "Talk fast to end the call quickly",
      ],
      correctIndex: 1,
    },
  ],

  refunds: [
    {
      id: "refunds-1",
      question: "What is the correct refund approach?",
      options: [
        "Promise the refund will be processed today",
        "Explain policy, verify details, and set expectations without guaranteeing the outcome",
        "Tell the guest to dispute with the bank immediately",
      ],
      correctIndex: 1,
    },
    {
      id: "refunds-2",
      question: "Which statement is compliant?",
      options: [
        "I guarantee you’ll get a refund.",
        "I can submit the request and follow policy. I can’t guarantee approval, but I will guide you through next steps.",
        "The hotel has to refund you no matter what.",
      ],
      correctIndex: 1,
    },
  ],

  "group-flow": [
    {
      id: "group-flow-1",
      question: "What qualifies as a group request?",
      options: ["5+ rooms", "9+ rooms", "Any number if it’s business travel"],
      correctIndex: 1,
    },
    {
      id: "group-flow-2",
      question:
        "If the guest wants to change dates after submitting a group request, what is the correct guidance?",
      options: [
        "We can edit the dates on the same request",
        "Dates cannot be changed; a new request must be created using a different email",
        "Tell them to call the hotel directly and we’re done",
      ],
      correctIndex: 1,
    },
  ],

  recap: [
    {
      id: "recap-1",
      question: "What is required in a strong recap?",
      options: [
        "Just say ‘okay you’re all set’ and end the call",
        "Summarize action taken + next steps + expectations/timeline",
        "Only repeat the hotel name",
      ],
      correctIndex: 1,
    },
    {
      id: "recap-2",
      question: "What should the agent ask before ending the call?",
      options: [
        "Nothing — just end the call",
        "Is there anything else I can assist you with today?",
        "Ask for the guest’s credit card number again",
      ],
      correctIndex: 1,
    },
  ],
};

export default quizData;
