import React from 'react';

export default props => {
  // Helper function which creates an array out of range prop
  const createOptions = () => {
    // If no range prop passed in, return an empty array (empty select)
    if (!props.range) return [];

    // Create an array out of range prop and use destructuring to store it in min & max variables
    const [min, max] = props.range.split(',');

    // Initialize an empty array to hold options
    let options = [];

    // Loop from min to max to create values for the options array
    for (let i = min; i <= max; i++) {
      // On each loop, add current value to options array
      options.push(i);
    }
    // Return options array
    return options;
  };

  return (
    <select {...props} value={props.value}>
      {/* Call createOptions helper function and map over returned array to create options  */}
      {createOptions().map(o => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
};
