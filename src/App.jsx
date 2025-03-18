import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('');
  const [task, setTask] = useState([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = "17d3e172ff11227a7d99b204ba9ae6155341077120605fbb3193c92abf5b9d75"

  const sendPrompt = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await axios.post('https://api.together.xyz/v1/completions',
      {
        prompt:prompt,
        api_key: API_KEY,
        max_tokens: 60,
        temperature: 0.7,
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo"
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },  
    });
    setResponse(result.data.choices[0].text);
    console.log(result.data.choices[0].text);

    const newTask = {
      id: Math.random().toString(),
      task: prompt,
      response: result.data.choices[0].text,
    }
    setTask(prevTasks => [...prevTasks, newTask]);
    setPrompt('');

    } catch (error) {
      setError("failed to fetch");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>AI Fitness Assistant</h1>
      <div className="input-section">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here"
          className="prompt-input"
        />
        <button 
          onClick={sendPrompt}
          disabled={loading || !prompt.trim()}
          className="send-button"
        >
          {loading ? "Sending..." : "Send Prompt"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {response && <div className="response">{response}</div>}

      <div className="task-list">
        {task.map((item) => (
          <div key={item.id} className="task-item">
            <h3>{item.task}</h3>
            <p>{item.response}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;
