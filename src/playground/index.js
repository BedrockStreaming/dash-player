import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { VideoPlayer } from './components/video.component';

const DEFAULT_SOURCE = 'http://www.bok.net/dash/tears_of_steel/cleartext/stream.mpd';
// const DEFAULT_SOURCE = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';

const PlaygroundContainer = styled.div`
  display: flex;

  height: 500px;
`;

const InfoContainer = styled.div`
  flex: 1;

  padding: 20px;
`;

class Playground extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      source: '',
      events: [],
    };
  }

  setInputRef = ref => {
    this.inputRef = ref;
  };

  updateSource = () => {
    this.setState({ events: [], source: this.inputRef.value });
  };

  handleVideoCreation = event => {
    this.setState({ events: this.state.events.concat(event) });
  };

  render() {
    return (
      <PlaygroundContainer>
        <InfoContainer>
          <h2>Source</h2>
          <input ref={this.setInputRef} type="text" defaultValue={DEFAULT_SOURCE} />
          <button onClick={this.updateSource}>Load</button>
          <h2>Events</h2>
          {this.state.events.map(({ type, triggeredAt }) => <p key={`${type}-${triggeredAt}`}>{type}</p>)}
        </InfoContainer>
        {this.state.source && <VideoPlayer source={this.state.source} onVideoCreation={this.handleVideoCreation} />}
      </PlaygroundContainer>
    );
  }
}

ReactDOM.render(<Playground />, document.getElementById('root'));
