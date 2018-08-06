import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { Player } from '../player/player';
import { ALL } from '../player/constants/events';

const PlaygroundContainer = styled.div`
  display: flex;

  height: 500px;
`;

const Video = styled.video`
  flex: 1;

  width: 100%;
  height: auto;
`;

const InfoContainer = styled.div`
  flex: 1;

  padding: 20px;
`;

class Playground extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
    };
  }

  attachVideoRef = ref => {
    this.videoRef = ref;

    const player = new Player(ref);
    player.addEventListener(ALL, event => this.setState({ events: this.state.events.concat(event) }));

    // player.load('https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd');
    player.load('http://www.bok.net/dash/tears_of_steel/cleartext/stream.mpd');
  };

  render() {
    return (
      <PlaygroundContainer>
        <Video innerRef={this.attachVideoRef} controls preload="metadata" />
        <InfoContainer>
          {this.state.events.map(({ type, triggeredAt }) => <p key={`${type}-${triggeredAt}`}>{type}</p>)}
        </InfoContainer>
      </PlaygroundContainer>
    );
  }
}

ReactDOM.render(<Playground />, document.getElementById('root'));
