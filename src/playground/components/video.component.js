import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Player } from '../../player/player';
import { ALL } from '../../player/constants/events';

const HtmlVideo = styled.video`
  flex: 1;

  width: 100%;
  height: auto;
`;

export class VideoPlayer extends React.PureComponent {
  componentDidUpdate(prevProps) {
    const { source } = this.props;

    if (prevProps.source !== source) {
      this.player.load(source);
    }
  }

  attachVideoRef = ref => {
    const { onPlayerEvent, source } = this.props;

    this.player = new Player(ref);
    this.player.addEventListener(ALL, onPlayerEvent);

    this.player.load(source);
  };

  render() {
    return <HtmlVideo innerRef={this.attachVideoRef} controls preload="metadata" />;
  }
}

VideoPlayer.propTypes = {
  onPlayerEvent: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired,
};
