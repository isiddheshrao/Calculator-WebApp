import React from 'react';
import './App.css';
import {Buttons} from './Components/Buttons';
import {Input} from './Components/Input';
import {ClearButton} from './Components/ClearButton';
import ChatMessage from './chatMessage';
import * as math from 'mathjs';


var HOST = window.location.origin.replace(/^http/, 'wss')
let rws = new WebSocket(HOST);

class App extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      username: "",
      input: "",
      messages1: [],
      messages: [],
      elements: [],
    };
  }
  componentDidMount() {
    rws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    rws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      console.log(JSON.parse(evt.data))
      const val = JSON.parse(evt.data)
      val.forEach(element => this.addMessage(element));
    }

    rws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({
        rws: new WebSocket(HOST)
      })
    }
  }

  addToInput = val => {
    this.setState({input: this.state.input + val});
  }

  addMessage = val => {
    console.log(this.state.elements);
    this.setState(
      {
        messages1: [val, ...this.state.messages],
        elements: [JSON.parse(val), ...this.state.elements]
      }
    );
  }

  handleEqual = messageString => {
    let message1 = this.state.input + ' = ' + math.evaluate(this.state.input)
    const data = { name: this.state.name, message: message1 }
    console.log("Handle Equal: ",JSON.stringify(data))
    rws.send(JSON.stringify(data))
    this.componentDidMount()
    this.setState(
      { 
        input: message1,
        messages:  [data, ...this.state.messages],
        messages1:  [data, ...this.state.messages1],
      }
    );  
  }

  render(){
    return(
      <div className="split">
        <div className = "right">
          <div className="calc-wrapper">
            <Input input={this.state.input}></Input>
            <div className="row">
              <Buttons handleClick={this.addToInput}>7</Buttons>
              <Buttons handleClick={this.addToInput}>8</Buttons>
              <Buttons handleClick={this.addToInput}>9</Buttons>
              <Buttons handleClick={this.addToInput}>/</Buttons>
            </div>
            <div className="row">
              <Buttons handleClick={this.addToInput}>4</Buttons>
              <Buttons handleClick={this.addToInput}>5</Buttons>
              <Buttons handleClick={this.addToInput}>6</Buttons>
              <Buttons handleClick={this.addToInput}>*</Buttons>
            </div>
            <div className="row">
              <Buttons handleClick={this.addToInput}>1</Buttons>
              <Buttons handleClick={this.addToInput}>2</Buttons>
              <Buttons handleClick={this.addToInput}>3</Buttons>
              <Buttons handleClick={this.addToInput}>+</Buttons>
            </div>
            <div className="row">
              <Buttons handleClick={this.addToInput}>.</Buttons>
              <Buttons handleClick={this.addToInput}>0</Buttons>
              <Buttons handleClick={() => this.handleEqual()}>=</Buttons>
              <Buttons handleClick={this.addToInput}>-</Buttons>
            </div>
            <div className="row">
              <ClearButton handleClear={() => this.setState({input: ""})}>Clear</ClearButton>
            </div>
          </div>
        </div>
        
        <div className = "left">
          <div>
          <h1> Welcome {this.state.name}</h1>
          <form action = "." 
                onSubmit={event => {
                event.preventDefault()
                this.setState({ name: '' })
                }}>
                <label htmlFor="name">
                  <input
                    type="text"
                    id={'name'}
                    placeholder={'Enter your name...'}
                    value={this.state.name}
                    onChange={event => this.setState({ name: event.target.value })
                  }
                  />
                </label>
          </form>
          </div>
            {console.log("Console Log: ", this.state.elements)}
            {this.state.elements.map((message, index) => 
              <ChatMessage
              key={index}
              message = {message.message}
              name = {message.name} />,
            )}
            {}
        </div>
      </div>
    )
  }
}

export default App;
