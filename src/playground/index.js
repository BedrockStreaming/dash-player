import React from 'react';
import ReactDOM from 'react-dom';

import { Player } from '../player/player';

class Playground extends React.PureComponent {
  attachVideoRef = ref => {
    this.videoRef = ref;

    const player = new Player(ref);
    player.load('https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd');
  };

  render() {
    return (
      <div>
        <video ref={this.attachVideoRef} />
      </div>
    );
  }
}

ReactDOM.render(<Playground />, document.getElementById('root'));
