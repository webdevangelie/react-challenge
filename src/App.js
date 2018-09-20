import React from 'react';
import { Checkbox, Repeatable, Text, Textarea } from './components';
import api from './mockApi';

class App extends React.Component {
  constructor(props) {
    super(props);
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

    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.Input = this.Input.bind(this);
  }

  /**
   *
   */
  handleChange(delta) {
    this.setState(({ data }) => ({ data: { ...data, ...delta } }));
  }

  /**
   *
   */
  async handleUpdate(publish = false) {
    const { data } = this.state;
    const results = await api.post({ ...data, publish });
    console.log('Content updated!');
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
