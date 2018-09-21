import React from 'react';
import { Checkbox, Repeatable, Text, Textarea } from './components';
import api from './mockApi';

class App extends React.Component {
  constructor(props) {
    super(props);
    /**
     * Initialize state.
     */
    this.state = {
      data: {
        title: '',
        rating: 0,
        year: null,
        description: '',
        upcoming: true,
        cast: []
      }
    };
    /**
     * Bind 'this' keyword to respective methods.
     */
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.Input = this.Input.bind(this);
  }

  /**
   * Input Change Handler. Doesn't return anything but uses setState to change data object in state
   * @param {object} delta Key:Value pair that will be used to change data object.
   * Used in Input method
   */
  handleChange(delta) {
    /** Use setState to modify state, specifically data object
     * Extract data from state using object destructuring
     * Modify data with a copy of the data object from previous state including the changes (delta) as new value
     */
    this.setState(({ data }) => ({ data: { ...data, ...delta } }));
  }

  /**
   * Input Update Handler. Returns result which is equal to the return value of mock POST method (same data that got passed in)
   * @param {boolean} publish Default value: false
   */
  async handleUpdate(publish = false) {
    // Extract data from state using object destructuring
    const { data } = this.state;
    // Call mock POST method and pass in a copy of data adding in publish property and value. Use await to wait for the call to finish and store return value to variable result
    const results = await api.post({ ...data, publish });
    console.log('Content updated!');
    // Return a promise with results as resolve value
    return results;
  }

  /**
   *
   */
  Input({ children, iterable, label, id }) {
    const handleChange = value => {
      this.handleChange({ [id]: value });
    };
    const value = this.state.data[id];
    let props = {};

    if (iterable) {
      props = {
        id,
        value,
        onCreate: item =>
          handleChange([
            ...value,
            {
              ...item,
              id: Math.floor(Math.random() * 100000)
            }
          ]),
        onUpdate: item =>
          handleChange(
            value.map(prev => {
              if (item.id === prev.id) {
                return item;
              }
              return prev;
            })
          ),
        onDelete: id => handleChange(value.filter(prev => prev.id !== id))
      };
    } else {
      props = {
        id,
        value,
        onBlur: () => this.handleUpdate(false),
        onChange: e => handleChange(e.target.value)
      };
    }
    return (
      <div className="Form-Group">
        <div className="Form-Label">{label}</div>
        {children(props)}
      </div>
    );
  }

  render() {
    const { Input } = this;
    return (
      <div className="Form">
        <Input label="Title" id="title">
          {props => <Text {...props} />}
        </Input>
        <Input label="Upcoming" id="upcoming">
          {props => <Checkbox {...props} />}
        </Input>
        <Input label="Description" id="description">
          {props => <Textarea {...props} />}
        </Input>
        <Input label="Cast" iterable id="cast">
          {props => <Repeatable {...props} />}
        </Input>
        <button onClick={() => this.handleUpdate(true)}>{'Publish'}</button>
      </div>
    );
  }
}

export default App;
