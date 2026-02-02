import { useReducer, useState } from "react";
import OpenAI from "openai";
import { addFood } from "../prompts";
import { dietHistory } from "../userState";
import FoodTable, { parseCsv } from "./FoodTable";
import ChatConversation from "./ChatConversation";

// const workingState = { ...state };

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

/* -----------------------------
   State + reducer
------------------------------ */

const initialState = {
  text: "",
  isSubmitting: false,
  error: null,
  data: dietHistory,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_TEXT":
      return { ...state, text: action.value };

    case "SET_DATA":
      return { ...state, data: action.value }

    case "SUBMIT_START":
      return { ...state, isSubmitting: true, error: null };

    case "SUBMIT_SUCCESS":
      return { ...state, isSubmitting: false, text: "" };

    case "SUBMIT_ERROR":
      return { ...state, isSubmitting: false, error: action.error };

    default:
      return state;
  }
}

/* -----------------------------
   Component
------------------------------ */

export default function PromptWindow() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [messages, setMessages] = useState([]);

  function handleChange(e) {
    dispatch({ type: "SET_TEXT", value: e.target.value });
  }

  async function onSubmit(text) {
    // Example: optimistic update
    setMessages(m => [...m, { role: "user", content: text }]);

    console.log('PROMPT: ' + addFood(text, messages, state.data));

    const response = await client.responses.create({
      // TODO upgrade model
      model: "gpt-5",
      input: addFood(text),
    });

    console.log("RESPONSE");
    console.log(response);

    const output = JSON.parse(response.output_text);
    setMessages(m => [...m, { role: "gpt", content: output.response }]);

    if (output.type === 'NEW_ENTRY') {
      dispatch({ type: "SET_DATA", value: output.food_history });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!state.text.trim()) return;

    dispatch({ type: "SUBMIT_START" });

    try {
      await onSubmit(state.text);
      dispatch({ type: "SUBMIT_SUCCESS" });
    } catch (err) {
      dispatch({
        type: "SUBMIT_ERROR",
        error: err.message || "Something went wrong",
      });
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row'
    }}>
      <div style={{
        width: '50%'
      }}>
        <FoodTable data={parseCsv(state.data)} />
      </div>
      <div style={{
        width: '100%'
      }}>
        <form onSubmit={handleSubmit}>
          <textarea
            type="text"
            value={state.text}
            onChange={handleChange}
            placeholder="Type here…"
            disabled={state.isSubmitting}
            style={{
              width: '100%',
              padding: 15,
              resize: 'none',
            }}
          />

          <ChatConversation
            messages={messages}
            thinking={state.isSubmitting}
          />

          <button type="submit" disabled={state.isSubmitting}>
            Submit
          </button>

          {state.error && <div className="error">{state.error}</div>}
        </form>
      </div>
    </div>
  );
}
