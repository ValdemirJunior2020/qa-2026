// src/data/quizData.js

// For now we start with full quiz only for "agent-readiness".
// Later we will add entries for each additional criterion.

const quizData = {
  "agent-readiness": [
    {
      id: "ar-q1",
      question: "According to HP expectations, how quickly should an agent normally answer an incoming call?",
      options: [
        "Within 2–3 rings (around 3–5 seconds), fully ready to help",
        "After 20–30 seconds so the guest has time to think",
        "Only after finishing any previous notes, even if the call rings for a long time",
        "Whenever the agent notices the call, there is no guideline"
      ],
      correctIndex: 0
    },
    {
      id: "ar-q2",
      question: "An agent clicks 'Available' but is still logging into systems when the call comes in. What is the correct HP behavior?",
      options: [
        "Answer anyway and tell the guest to wait in silence while tools load",
        "Let the call time out because the agent is not fully ready",
        "Agent should always log into tools and be fully prepared before going Available",
        "Ask the guest to call back later when the agent is ready"
      ],
      correctIndex: 2
    },
    {
      id: "ar-q3",
      question: "Which of the following best represents good 'Agent Readiness' at the start of a shift?",
      options: [
        "Arriving on time, systems opened, headset tested, ready to answer as soon as set to Available",
        "Arriving on time but opening systems only after the first call connects",
        "Arriving late but answering quickly to catch up",
        "Waiting to put on the headset until the guest says hello"
      ],
      correctIndex: 0
    },
    {
      id: "ar-q4",
      question: "What is the main risk if agents consistently take too long to answer calls?",
      options: [
        "More time for agents to relax between calls",
        "Higher chance of abandoned calls and poor customer experience",
        "Guests will talk slower when the agent finally answers",
        "No impact, as long as the agent apologizes"
      ],
      correctIndex: 1
    },
    {
      id: "ar-q5",
      question: "Which environment best matches HP’s expectation for answering calls?",
      options: [
        "Quiet workspace, no side conversations, no eating, and focus on the caller",
        "Background TV or conversations as long as the agent speaks loudly",
        "Eating during the call as long as the agent is polite",
        "Music playing loudly to keep the agent motivated"
      ],
      correctIndex: 0
    }
  ]

  // TODO: we will add quizzes for the other criteria after this step
};

export default quizData;
