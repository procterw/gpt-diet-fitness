import { userDietGoals } from "./userState";


export const addFood = (userPrompt, messageHistory, dietHistory) => {

  return `
    USER PROMPT: ${userPrompt}
    MESSAGE HISTORY: ${JSON.stringify(messageHistory)}

    The ISO date is ${(new Date()).toISOString()}. If the time is before 3:30AM, use the previous days date.

    SYSTEM NOTE:
    The user may either be:
    1) Logging food they just ate, or
    2) Asking a question or making a general statement.

    STEP 1 — CLASSIFICATION:
    Classify the USER PROMPT into exactly one of the following categories:
    - FOOD_ENTRY: The user is stating or implying that they ate something.
    - QUESTION: The user is asking a question.
    - OTHER: Anything else.

    If the classification is QUESTION or OTHER:
    - Disregard all food-logging instructions below.
    - Respond naturally and appropriately to the user prompt.
    - use this JSON format: { type: "GENERIC_RESPONSE", response: <the response to the user prompt> }

    Only continue with the instructions below if the classification is FOOD_ENTRY.

    HOWEVER, if the food is too vague to realistically log, you may ask them ONE TIME to clarify.

    ----------------------------------------------------------------

    TASK:
    You are given three sections: USER GOALS, DIET HISTORY, and NEW FOOD.

    Your task is to:
    - Estimate the nutritional values of the NEW FOOD
    - Update the DIET HISTORY CSV by either appending a new row or updating today’s existing row
    - Return the updated CSV and a short summary
    - IMPORTANT: return the FULL csv, not just the row that was updated

    ----------------------------------------------------------------

    DEFINITIONS:

    USER GOALS:
    A description of the user’s long-term dietary and body goals. These goals should guide tone and interpretation but should NOT cause you to distort nutritional estimates.

    DIET HISTORY:
    A CSV representing a daily food log.
    Columns are:
    Date, Weight_lb, Calories, Fat_g, Carbs_g, Protein_g, On_track, Notes

    DIET HISTORY rules:
    - Preserve column order exactly
    - Preserve all existing rows exactly, except for today’s row if it is updated
    - Do not reformat, reorder, or add columns
    - Use standard CSV formatting (commas only, no markdown, no extra whitespace)

    NEW FOOD:
    Contains ONLY the most recent user message describing food eaten.
    Do NOT infer additional foods from earlier conversation.
    Do NOT include prior foods unless explicitly mentioned again.

    ----------------------------------------------------------------

    ASSUMPTIONS AND ESTIMATION RULES:

    If portion sizes, preparation methods, or ingredients are not specified:
    - Assume a standard, common preparation (e.g., deli-style sandwich)
    - Use conservative, mid-range nutritional estimates
    - Do not bias estimates to support or oppose the user’s goals
    - Do not invent specialty ingredients, sauces, or oversized portions

    Protein estimates should reflect realistic mixed-food meals, not optimized fitness tracking.

    ----------------------------------------------------------------

    DATE HANDLING:

    - Use today’s date to determine placement.
    - If a row for today’s date already exists in the CSV:
      - Add the NEW FOOD’s calories and macros to that row.
    - If no row exists for today:
      - Append a new row using today’s date.
      - Leave Weight_lb blank unless a weight value is explicitly available elsewhere.

    ----------------------------------------------------------------

    ON_TRACK AND NOTES FIELDS:

    - Update On_track only if the new food meaningfully changes the day’s alignment with USER GOALS.
    - Notes may briefly describe the added food and its relevance to the day.
    - Use 🟢 for 'on track', 🟡 for 'warning', and ❌ for 'off track'
    - Do not rewrite or summarize the entire day unless necessary.

    ----------------------------------------------------------------

    USER GOALS: ${userDietGoals}

    DIET HISTORY: ${dietHistory}

    NEW FOOD: ${userPrompt}

    OUTPUT FORMAT (REQUIRED):

    Return a single valid JSON object in the following format:

    {
      "type": "NEW_ENTRY",
      "food_history": "<the full updated CSV as a single string>",
      "response": "<Tell the user you logged their entry, and provide 2–3 sentence summary of the nutritional value of the new food and how it affects alignment with the user’s goals>"
    }

    Do not include any additional text outside of the JSON object.
  `;

};
