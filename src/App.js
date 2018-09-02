import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

    state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: ''
    };

  async componentDidMount()
  {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager,players,balance});

  }

  render() {
    console.log(this.state.manager);
    return (
      <div>
        <h2>Welcome to Lottery App</h2>
        <p>This account is maintained by {this.state.manager}.
        There are currently {this.state.players.length}, competing to win {web3.utils.fromWei(this.state.balance,'ether')} ethers!
        </p>
        < hr />
        <form onSubmit = {this.EnterPlayer}>
          <h4>Want to try yout luck?</h4>
          <div>
            <label>Enter the amount of ether to enter</label>
            <input
            value = {this.state.value}
            onChange = {event=>this.setState({value:event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>
        < hr />
        <h1>{this.state.message}</h1>
        < hr/>
      <h1>Time to pick winner</h1>
      <button
        onClick = {this.pickWinner}
      >Pick winner
      </button>
      </div>
      
    );
  }
   EnterPlayer = async (event) =>
  {
    event.preventDefault();
    const acounts = await web3.eth.getAccounts();
    this.setState({message: 'Waiting on transaction success...'});
    await lottery.methods.enter().send({
      from: acounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
    });
    this.setState({message: 'You have been entered!'});
  };

  pickWinner = async (event) =>
  {
    event.preventDefault();
    const acounts = await web3.eth.getAccounts();
    this.setState({message: 'Waiting on transaction success...'});
    await lottery.methods.pickWinner().send({
      from: acounts[0]
    });
    this.setState({message: 'Winner has been selected!'});
  }
}

export default App;
