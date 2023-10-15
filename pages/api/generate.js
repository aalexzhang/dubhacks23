  import {circumstances} from './circumstances'
  import {characters} from './characters'

  const onSubmit = async (chatState, currentName, currentScenarioIndex) => {
    try {
      let name = currentName;
      console.log(currentName)
      let personality = characters[currentName]["personality"];
      let circumstance = circumstances["circumstances"][currentScenarioIndex]["description"];


      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {role: "system", content: `${circumstance} ${circumstances["init"]} Your name is ${name}. You are ${personality}.`},
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

  export default onSubmit;
