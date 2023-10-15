  const onSubmit = async (userInput) => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Roleplay as a 7 year old crying on the playground, and explain the story to the user, another 7 year old. Add multiple choice options to the storyline that will ultimately culminate in the resolution of the situation. Only speak from the point of view of the 7 year old and prompt a response." },
            { role: "user", content: `How would you respond if I said: ${userInput}` } // Include the user's input here
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

  export default onSubmit;
