import React from 'react';

export default props => (
  <input type="checkbox" {...props} defaultChecked={props.value} />
);
