import React from 'react';

export default props => {
  const createOptions = () => {
    if (!props.range) return [];
    const [min, max] = props.range.split(',');
    let options = [];
    for (let i = min; i <= max; i++) {
      options = options.concat(i);
    }
    return options;
  };

  return (
    <select {...props} value={props.value}>
      {createOptions().map(o => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
};
