import React, { useState } from 'react';
import UploadCSV from './components/UploadCSV';
import ToggleSwitch from './components/ToggleSwitch';
import './App.css';

const App = () => {
  const [measurementGroups, setMeasurementGroups] = useState([]);
  const [timeRanges, setTimeRanges] = useState([]);
  const [loadedPanels, setLoadedPanels] = useState({
    group1: false,
    group2: false,
    group3: false,
    group4: false,
    group5: false,
    group6: false,
    group7: false,
  });

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:5001/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    setMeasurementGroups((prev) => [...prev, data.measurementGroups]);
    setTimeRanges((prev) => [...prev, { from: data.minTimestamp, to: data.maxTimestamp }]);
  };

  const handleIframeLoad = (panelGroup) => {
    setLoadedPanels((prev) => ({ ...prev, [panelGroup]: true }));
  };

  const handleToggle = (groupKey) => {
    setLoadedPanels((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  return (
    <div className="App">
      <h1>Data Visualizer</h1>

      <div className="toggles-container">
        {['log scale', 'feature2', 'feature3', 'feature4'].map((groupKey) => (
        <div className="toggle-item" key={groupKey}>
        <ToggleSwitch
        key={groupKey}
        onToggle={() => handleToggle(groupKey)}  // Toggle function
        isOn={loadedPanels[groupKey]}  // Current toggle state
          />
          <small className="toggle-label">{groupKey}</small> {/* Label directly under the toggle */}
        </div>
            ))}
        </div>

      <UploadCSV handleFileUpload={handleFileUpload} />
      <div className="panels-container">
        {measurementGroups.length > 0 && (
          <>
            {['group1', 'group2', 'group3', 'group4', 'group5', 'group6', 'group7'].map((groupKey, panelIndex) => (
              <div key={groupKey} className="panel-group">
                {measurementGroups.map((group, index) => (
                  group[groupKey].length > 0 && (
                    <div key={`${groupKey}-${index}`} className="panel">
                      <iframe
                        src={`http://localhost:3000/d-solo/fdsshyafq8qv4e/new-dashboard?orgId=1&panelId=${panelIndex + 3}&from=${timeRanges[index].from}&to=${timeRanges[index].to}`}
                        width="600"
                        height="400"
                        frameBorder="0"
                        onLoad={() => handleIframeLoad(groupKey)}
                        style={{ display: loadedPanels[groupKey] ? 'block' : 'none' }}
                      >
                      </iframe>
                    </div>
                  )
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default App;

