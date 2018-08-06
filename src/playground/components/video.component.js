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
  componentWillReceiveProps(nextProps) {
    if (nextProps.source !== this.props.source) {
      this.player.load(nextProps.source);
    }
  }

  attachVideoRef = ref => {
    const { onVideoCreation, source } = this.props;

    this.player = new Player(ref);
    this.player.addEventListener(ALL, onVideoCreation);

    this.player.load(source);
  };

  render() {
    return <HtmlVideo innerRef={this.attachVideoRef} controls preload="metadata" />;
  }
}

VideoPlayer.propTypes = {
  onVideoCreation: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired,
};
