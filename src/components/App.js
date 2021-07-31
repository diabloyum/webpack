import React, { Component } from 'react';


export default class App extends Component {
  state = {
    title: 'Webpack React Startup',
  };

  render() {
    return (
      <div>
<div id="leesBox"></div>
        <p>{this.state.title}</p>
        <p>
          <button onClick={this.btnClick}>点击我</button>
        </p>
      </div>
    );
  }

  btnClick = (e) => {
    alert(e.target.innerText);
  };
}
