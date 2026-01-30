import { useReducer, useState } from "react";
import OpenAI from "openai";

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
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_TEXT":
      return { ...state, text: action.value };

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

    const response = await client.responses.create({
      model: "gpt-5-nano",
      input: "Write a one-sentence bedtime story about a unicorn."
    });

    console.log(response);
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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={state.text}
        onChange={handleChange}
        placeholder="Type here…"
        disabled={state.isSubmitting}
      />

      <button type="submit" disabled={state.isSubmitting}>
        Send
      </button>

      <pre>
        { JSON.stringify(messages, null, 2) }
      </pre>

      {state.error && <div className="error">{state.error}</div>}
    </form>
  );
}
