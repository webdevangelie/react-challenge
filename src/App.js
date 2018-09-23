import React from 'react';
import {
  Checkbox,
  Repeatable,
  Text,
  Textarea,
  Select,
  Message
} from './components';
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
      },
      isLoading: false,
      isUpdating: false,
      updateMessage: ''
    };
    /**
     * Bind 'this' keyword to respective methods.
     */
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.Input = this.Input.bind(this);
  }

  /**
   * Will run when component is mounted.
   * Checks to see if prop id is passed in. If id is passed in, will send a get request to mock api and load initial data.
   */
  componentDidMount = () => {
    // Check if id got passed in
    if (this.props.id) {
      // Use setState to show 'loading...' on screen
      // Pass in anonymous callback function as second parameter
      this.setState({ isLoading: true }, () => {
        // Send get request to mock api and use passed in id as parameter
        api.get(this.props.id).then(data => {
          // Use data that got sent back from request as initial data and set isLoading to false
          this.setState({ data, isLoading: false });
        });
      });
    }
  };

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
   * Input Update Handler. Returns results which is equal to the return value of mock POST method (same data that got passed in)
   * @param {boolean} publish Default value: false
   */
  async handleUpdate(publish = false) {
    // Extract 'data' property from state using object destructuring
    const { data } = this.state;

    // Update state. Set isUpdating to true and updateMessage to 'Updating...'
    this.setState({ isUpdating: true, updateMessage: 'Saving...' });

    try {
      // Call mock POST method and pass in a copy of data adding in publish property and value.
      // Use await to wait for the call to finish and store return value to variable results
      const results = await api.post({ ...data, publish });
      console.log('Content updated!');

      // Change updateMessage to 'Successful!'
      this.setState({ updateMessage: 'Saved!' });

      // Return a promise with results as resolve value
      return results;
    } catch (error) {
      // Change updateMessage to 'Unsuccessful!'
      this.setState({ updateMessage: 'Save failed. Please try again.' });
    }
  }

  /**
   * Input Method. Returns a jsx(component).
   * Used in render method as a component to wrap input elements(children)
   * Expecting child component and uses appropriate props depending on whether iterable or not
   * @param {component} children Child component which returns input element
   * @param {boolean} iterable Used to determine if input is repeatable and to know which props to use
   * @param {string} label String used as input label
   * @param {string} id String used as value of id prop to differentiate input fields
   */
  Input({ children, iterable, label, id }) {
    // Helper function which uses handleChange method declared above
    // @param {any} value Input value
    const handleChange = value => {
      // Call handleChange method declared above
      // Pass in object literal as argument which uses computed property name [id] and parameter value as value
      this.handleChange({ [id]: value });
    };

    // Grab the value of specific property from data object in state
    // Note this is different from the parameter named value declared above
    const value = this.state.data[id];

    // Create props variable, initialize to an empty object. Will later be asigned to an object containing props depending on whether input is iterable or not
    let props = {};

    // Check to see if iterable
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
      // If input is not iterable, use this object as props:
      props = {
        id, // {string} corresponding to the id property
        value, // {any} value can be anything, depending on input

        // Will be called when input loses focus
        onBlur: () =>
          // Call handleUpdate method passing in false as argument
          this.handleUpdate(false).then(() =>
            // Remove updateMessage after 3secs
            setTimeout(() => this.setState({ isUpdating: false }), 3000)
          ),
        // Will get called whenever input changes
        onChange: e => {
          // Check if input type is checkbox
          e.target.type === 'checkbox'
            ? // If it is, update state by caling handleChange helper function and pass in e.target.checked
              handleChange(e.target.checked)
            : // otherwise pass in e.target.value
              handleChange(e.target.value);
        }
      };
    }

    // Return jsx
    return (
      <div className="Form-Group">
        {/* Use label property as form label */}
        <div className="Form-Label">{label}</div>
        {/* Expects child component and uses appropriate props whether input is iterable or not*/}
        {children(props)}
      </div>
    );
  }

  render() {
    /** Extract Input from this component.
     * Used to create wrapper component for input element components(Text, Checkbox, Textarea, Repeatable)
     */
    const { Input } = this;

    // Extract properties from state and store to respective variables
    const { isLoading, isUpdating, updateMessage } = this.state;

    return (
      <div className="Form">
        {/* Show 'Loading...' if value of isLoading from state is true */}
        {isLoading && <Message msg="Loading..." />}
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
          {props => <Select {...props} range="2010,2020" />}
        </Input>
        <Input label="Rating" id="rating">
          {props => <Select {...props} range="1,5" />}
        </Input>
        {/* Use handleUpdate method for button handler. Passing in true as argument for publish will */}
        <button
          onClick={() =>
            this.handleUpdate(true).then(() =>
              // Remove updateMessage after 3secs
              setTimeout(() => this.setState({ isUpdating: false }), 3000)
            )
          }
        >
          {'Publish'}
        </button>
        {isUpdating && <Message msg={updateMessage} />}
      </div>
    );
  }
}

export default App;
