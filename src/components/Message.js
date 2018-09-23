import React from 'react';

export default props => {
  return <div className={props.messageStatus}>{props.msg}</div>;
};
