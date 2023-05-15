
import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import Chart from 'chart.js/auto';
import Style from './style.css'


const App = () => {
  const [chartData, setChartData] = useState(null);
  const [wordCount, setWordCount] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://www.terriblytinytales.com/test.txt');
      const content = response.data;
      const words = content.split(/\s+/);

      const wordCountMap = {};
      words.forEach(word => {
        const cleanedWord = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        if (cleanedWord !== '') {
          wordCountMap[cleanedWord] = (wordCountMap[cleanedWord] || 0) + 1;
        }
      });

      const sortedWords = Object.keys(wordCountMap).sort((a, b) => wordCountMap[b] - wordCountMap[a]);
      const labels = sortedWords.slice(0, 20);
      const data = labels.map(word => wordCountMap[word]);

      const chartData = {
        labels,
        datasets: [
          {
            label: 'Word Frequency',
            data,
            backgroundColor: 'rgba(59, 121, 127 )',
          },
        ],
      };

      setChartData(chartData);
      setWordCount(wordCountMap);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleExport = () => {
    if (chartData) {
      const csvData = chartData.labels.map((word, index) => [word, chartData.datasets[0].data[index]]);
      const csvContent = "data:text/csv;charset=utf-8," + csvData.map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'histogram_data.csv');
    }
  };

  return (
    <div>
      <button className="submit-button" onClick={fetchData}>Submit</button>
      <br />
      {chartData && <Bar data={chartData} />}
      <br />
      {wordCount && (
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(wordCount).map(word => (
              <tr key={word}>
                <td>{word}</td>
                <td>{wordCount[word]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <br />
      {chartData && (
        <button className="export-button" onClick={handleExport} disabled={!chartData}>
          Export
        </button>
      )}
    </div>
  );
};

export default App;
