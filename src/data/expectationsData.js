// src/data/expectationsData.js
/**
 * Expectations content per criterionId (must match criteriaData IDs exactly).
 */

const expectationsData = {
  greeting: {
    title: "Greeting & Brand Standard",
    sections: [
      {
        heading: "What ‘Good’ looks like",
        bullets: [
          "Answer promptly and greet professionally.",
          "Use approved branding: “Hotel Reservations”.",
          "State your name clearly.",
          "Ask an open-ended question and maintain call control from the start.",
        ],
      },
      {
        heading: "Required elements",
        bullets: ["Branding + greeting", "Agent name", "Offer of help"],
      },
    ],
    approvedPhrases: [
      "Thank you for calling Hotel Reservations. My name is [Name], how may I assist you?",
      "Thank you for calling Hotel Reservations. This is [Name]. How can I help?",
    ],
    commonMisses: [
      "Skipping branding or agent name",
      "Sounding unsure or unprofessional at the start",
      "Using slang or informal greeting",
    ],
    sources: ["Training Guide Dec 2025", "HP Voice QA Form 1.1"],
  },

  verification: {
    title: "Verification & Reservation Accuracy",
    sections: [
      {
        heading: "What ‘Good’ looks like",
        bullets: [
          "Confirm itinerary number when applicable.",
          "Confirm guest name, property name, and check-in/check-out dates.",
          "Repeat back key details before taking action to prevent errors.",
        ],
      },
      {
        heading: "Accuracy standard",
        bullets: [
          "No assumptions — verify with the guest before changing/canceling/refund steps.",
          "If itinerary is not available, use approved alternate verification steps.",
        ],
      },
    ],
    approvedPhrases: [
      "May I please have the itinerary number starting with the letter H?",
      "To make sure I’m helping you correctly, can you confirm the guest name and the hotel name?",
      "Just to confirm, your check-in is [date] and check-out is [date], correct?",
    ],
    commonMisses: [
      "Proceeding without verifying dates/property/guest",
      "Not repeating details back before action",
    ],
    sources: ["Training Guide Dec 2025", "HP Voice QA Form 1.1"],
  },

  empathy: {
    title: "Empathy & Tone",
    sections: [
      {
        heading: "What ‘Good’ looks like",
        bullets: [
          "Acknowledge the guest’s situation with empathy (especially frustration, loss, urgency).",
          "Stay calm, confident, and professional — even if the guest is upset.",
          "Take ownership of the next step (what you will check, submit, confirm, or explain).",
          "Avoid interrupting; allow the guest to explain.",
        ],
      },
      {
        heading: "Minimum expectation",
        bullets: [
          "At least one empathy statement + one ownership statement.",
          "Tone remains respectful and controlled throughout the call.",
        ],
      },
    ],
    approvedPhrases: [
      "I’m sorry you’re going through that — I’m here to help.",
      "I understand how frustrating this is. Let me review the details with you now.",
      "Thank you for your patience — I’ll walk you through the next steps.",
    ],
    commonMisses: [
      "Robotic / no empathy statement",
      "Sounding defensive or blaming policy/hotel",
      "Talking over the guest",
    ],
    sources: ["Training Guide Dec 2025", "HP Voice QA Form 1.1"],
  },

  refunds: {
    title: "Refunds & Policy Compliance",
    sections: [
      {
        heading: "What ‘Good’ looks like",
        bullets: [
          "Verify reservation details before discussing outcomes.",
          "Explain cancellation/refund policy clearly.",
          "Never guarantee a refund or promise immediate outcomes.",
          "Set accurate expectations (approval + processing timeline).",
          "Offer appropriate alternatives when allowed (rebooking options, escalation path).",
        ],
      },
      {
        heading: "Compliance standard",
        bullets: [
          "No promises or guarantees.",
          "Follow required escalation/hotel-contact steps when applicable and document the action.",
        ],
      },
    ],
    approvedPhrases: [
      "Let me review the cancellation policy associated with your reservation.",
      "What I can do is submit the request and follow the policy. I cannot guarantee approval, but I will guide you through the next steps.",
      "If approved, refund processing may take a few business days depending on the payment method.",
    ],
    commonMisses: [
      "Promising a refund",
      "Skipping policy explanation",
      "No timeline expectations",
      "Not following required process steps (when applicable)",
    ],
    sources: ["Training Guide Dec 2025", "HP Voice QA Form 1.1"],
  },

  "group-flow": {
    title: "Group Booking Flow",
    sections: [
      {
        heading: "What ‘Good’ looks like",
        bullets: [
          "Identify this as a group request (9+ rooms).",
          "Ask the first required question: destination city and state.",
          "Collect required details (dates, room count, contact email, any needs).",
          "If asked if you are the hotel: clearly explain you are not at the hotel and you provide group rates sent via email.",
          "Set correct expectation: dates cannot be changed after submission; a new request must be created using a different email.",
        ],
      },
      {
        heading: "Policy standard",
        bullets: [
          "9+ rooms qualifies as group.",
          "Dates cannot be changed after submission; new request requires a different email.",
        ],
      },
    ],
    approvedPhrases: [
      "What is the city and state of your destination?",
      "I am not at the hotel, but what I’m able to do for you is provide the best group rates for the hotels in this city, and these group rates will be sent to you via email.",
      "May I please get your name, the hotel or city you’re interested in, and the check-in and check-out dates?",
    ],
    commonMisses: [
      "Not asking city/state first",
      "Treating group flow like a regular itinerary case",
      "Saying dates can be edited after submission",
      "Not setting expectation that rates are sent via email",
    ],
    sources: ["Training Guide Dec 2025", "HP Voice QA Form 1.1"],
  },

  recap: {
    title: "Recap & Next Steps",
    sections: [
      {
        heading: "What ‘Good’ looks like",
        bullets: [
          "Summarize what was done (or what will be done).",
          "Explain the next step clearly and set correct expectations/timeline.",
          "Confirm understanding and offer further help before closing.",
        ],
      },
    ],
    approvedPhrases: [
      "To recap, today we [action]. The next step is [next step].",
      "You will receive [email/confirmation] within [timeframe].",
      "Is there anything else I can assist you with today?",
    ],
    commonMisses: [
      "No recap — ending abruptly",
      "No timeline/expectations for next steps",
      "Not offering further assistance",
    ],
    sources: ["Training Guide Dec 2025", "HP Voice QA Form 1.1"],
  },
};

export default expectationsData;
