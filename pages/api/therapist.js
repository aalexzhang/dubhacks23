const therapist = async (chatState) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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",
        // "Authorization": "Bearer " + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {role: "system", content: `Act as a behavioral therapist analyzing the chat log. Explain in the terms of a 7 year old, how the user could improve their social skills. Use the 2nd person perspective. Answer in at most 3 sentences.`},
          ...chatState // Include the user's input here
        ],
        max_tokens: 100,
        temperature: 0.6,
      }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      throw data.error || new Error(`Request failed with status ${response.status}`);
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error for the caller to handle
  }
};

export default therapist;
