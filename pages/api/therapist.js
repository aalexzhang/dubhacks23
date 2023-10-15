const therapist = async (chatState) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.AI_KEY,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {role: "system", content: `Act as a behavioral therapist analyzing this chat log. The user has been given a scenario by the assistant, and has been tasked with helping to solve it. Give some positive and constructive feedback on how the user could improve socially. Remember that the user is also a 7 year old. Use the 2nd person perspective. Answer in at most 3 sentences.`},
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
