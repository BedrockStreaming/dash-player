import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const INPUT_NAME = 'source';

const HtmlForm = styled.form`
  width: 100%;
`;

export class Form extends React.PureComponent {
  handleSubmit = event => {
    event.preventDefault();

    const { source, onSubmit } = this.props;
    const data = new FormData(event.target);
    const inputValue = data.get(INPUT_NAME);

    if (inputValue !== source) {
      onSubmit(inputValue);
    }
  };

  render() {
    return (
      <HtmlForm onSubmit={this.handleSubmit}>
        <input name={INPUT_NAME} type="text" defaultValue={this.props.source} />
        <button>Load</button>
      </HtmlForm>
    );
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  source: PropTypes.string,
};
