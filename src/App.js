import React from 'react';
import { Checkbox, Repeatable, Text, Textarea, Select } from './components';
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
        year: '',
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
    // Call mock POST method and pass in a copy of data adding in publish property and value. Use await to wait for the call to finish and store return value to variable results
    const results = await api.post({ ...data, publish });
    console.log('Content updated!');
    // Return a promise with results as resolve value
    return results;
  }

  /**
   * Input Method. Returns a jsx(component) with div.Form-group div.Form-label. Expecting child components and uses appropriate props depending on whether iterable or not
   * Extracts variables from props to build props that will be passed in to child components
   * @param {component} children Child component which returns input element
   * @param {boolean} iterable Property added to component to determine which props to use
   * @param {string} label String used as form label
   * @param {string} id String used as value of id prop to differentiate different Input Components
   * Used in render method as a component to wrap input elements(children)
   */
  Input({ children, iterable, label, id }) {
    // Helper function which uses handleChange method declared above
    // @param {any} value   Can be different types depending on input element
    const handleChange = value => {
      // Call handleChange method declared above
      // Pass in object literal as argument which uses computed property name [id] and parameter value as value
      this.handleChange({ [id]: value });
    };

    // Grab the value of specific property from data object in state. Can be anything
    // Note this is different from the parameter named value declared above
    const value = this.state.data[id];

    // Create props variable, initialized to an empty object. Will later be asigned to an object containing props depending on whether iterable
    let props = {};

    // Check to see if iterable property exists
    if (iterable) {
      // If it is, use this object as props:
      props = {
        id, // {string} corresponding to the id property
        value, // {array} array of objects (@see example of iterable, Repeatable component)

        // Method which adds another object to value array
        // @param {object} item Object to be added to value array
        onCreate: item =>
          // Using handleChange helper function above,
          handleChange([
            // Create a new array literal and copy in current value in state
            ...value,

            // Create new object literal and add it to value array,
            {
              // Copy in passed in item
              ...item,
              // Add another property id and assign to random number between 0 - 100000. Note this is not the same id as the string id property. This is an id for each object in value array
              id: Math.floor(Math.random() * 100000)
            }
          ]),

        // Method which updates an item in value array
        // @param {object} item   Object containing {name, id} of specific element in value array
        onUpdate: item =>
          // Using handleChange helper function,
          handleChange(
            // Loop over all the objects in value array,
            // 'prev' refers to each object inside value array
            value.map(prev => {
              // Check to see if id of passed in item is equal to current object it is iterating over
              if (item.id === prev.id) {
                // If it is, return item as modified object
                return item;
              }
              // For all instances return unmodified object
              return prev;
            })
          ),

        // Method which deletes an object element inside value array
        // @param {number} id  Refers to random number generated when element was created
        // Using handleChange helper function, use filter to return all objects in value array except the one where id passed in matches the id of the current object.
        // 'prev' refers to each object inside value array
        onDelete: id => handleChange(value.filter(prev => prev.id !== id))
      };
    } else {
      // If iterable does not exist/no iterable property, use this object as props:
      props = {
        id, // {string} corresponding to the id property
        value, // {any} value can be anything

        // Call handleUpdate method passing in false as argument when input loses focus
        onBlur: () => this.handleUpdate(false),
        // Call handleChange helper function passing in e.taget.value as argument when input changes
        onChange: e => {
          e.target.type === 'checkbox'
            ? handleChange(e.target.checked)
            : handleChange(e.target.value);
        }
      };
    }

    // Return jsx
    return (
      <div className="Form-Group">
        {/* Use label property as form label */}
        <div className="Form-Label">{label}</div>
        {/* Expects child component which uses appropriate props whether iterable or not iterable */}
        {children(props)}
      </div>
    );
  }

  render() {
    /** Extract Input from this component.
     * Use Input to create wrapper component for input element components(Text, Checkbox, Textarea, Repeatable)
     */
    const { Input } = this;
    return (
      <div className="Form">
        <Input label="Title" id="title">
          {props => <Text type="text" {...props} />}
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
        <Input label="Year" id="year">
          {props => <Select {...props} />}
        </Input>
        <Input label="Rating" id="rating">
          {props => <Text type="number" {...props} />}
        </Input>
        {/* Use handleUpdate method for button handler. Passing in true as argument for publish */}
        <button onClick={() => this.handleUpdate(true)}>{'Publish'}</button>
      </div>
    );
  }
}

export default App;
