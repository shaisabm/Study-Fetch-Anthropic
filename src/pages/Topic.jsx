import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Topic() {
  const [topic, setTopic] = useState('');
  const [name, setName] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/api/explain', { topic, name });
      setExplanation(response.data.explanation);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className='topicContainer position-absolute top-50 start-50 translate-middle'>
      <h1>Explain Like I'm 5</h1>
      <form onSubmit={handleSubmit}>
        <div className='inputs'>
        
          <input
            className='form-control'
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic"
            required
          />
          <input
            className='form-control'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div>
        <button className='btn btn-light' type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Get Explanation'}
        </button>
        </div>
      </form>
      <div className='viewContainer'>
    
        {explanation && (
          <div className='explanation card'>
            <h2 className='card-title'>Explanation</h2>
            <p className='card-body card-text'>{explanation}</p>
          </div>
        )}
        <Link className='btn btn-primary' to="/catalog">View Explanation Catalog</Link>
      </div>
    </div>
  );
}

export default Topic;