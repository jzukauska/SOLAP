import React, { Component } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

class Settings extends Component {
  render() {
    return (
      <FontAwesomeIcon icon={faCog} />
    );
  }
}

export default Settings;
