  import {circumstances, talking} from './circumstances'
  import {characters} from './characters'

  const onSubmit = async (chatState, currentName, currentScenarioIndex, talk, user="friend") => {
    try {
      let name = currentName;
      console.log(currentName)
      let personality = characters[currentName]["personality"];
      if (talk) {
        var circumstance = talking["circumstances"][0]["description"]
        var init = talking["init"]
      } else {
        var circumstance = circumstances["circumstances"][currentScenarioIndex]["description"];
        var init = circumstances["init"]
      }
      console.log("ARE WE TALKING " + talk)


      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + process.env.AI_KEY,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {role: "system", content: `${circumstance} ${init} Your name (the assistant) is ${name}. Refer to the user as "${user}". You will display the following personality traits in your responses: ${personality}. Remember, never suggest solutions! `},
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
