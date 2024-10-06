import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ExplanationLogs() {
  const [explanations, setExplanations] = useState([]);
  const [sortedExplanations, setSortedExplanations] = useState([]);
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    fetchExplanations();
  }, []);

  const fetchExplanations = async () => {
    try {
      const response = await axios.get('/api/explanations');
      setExplanations(response.data);
      setSortedExplanations(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSort = () => {
    if (!isSorted) {
      const sorted = [...explanations].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setSortedExplanations(sorted);
      setIsSorted(true);
    } else {
      setSortedExplanations(explanations);
      setIsSorted(false);
    }
  };

  return (
    <div className='explanationCatalogContainer'>
      <h1>Explanation Catalog</h1>
      <button className='btn btn-primary' onClick={handleSort}>
        {isSorted ? 'Unsort' : 'Sort by Name'}
      </button>
      <table>
        <thead>
          <tr>
            <th>Topic</th>
            <th>Explanation</th>
            <th>Submitter</th>
          </tr>
        </thead>
        <tbody>
          
          {sortedExplanations.map((item, index) => (
            <>
              <tr className='eachCard' key={item._id}>
                <td className='border topic-text'>{item.topic}</td>
                <td className='border explanationText '>{item.explanation}</td>
                <td className='border'>{item.name}</td>
              </tr>
              
              {sortedExplanations.length !== index+1 && (<hr></hr>)
              }
          </>
          ))}
        </tbody>
        
      </table>
      <Link className='btn btn-primary mt-3' to="/">Back to Topic Input</Link>
    </div>
  );
}

export default ExplanationLogs;