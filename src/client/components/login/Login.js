import React from 'react';
import { withRouter } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import './login.scss';

const FIELD_IDS = {
  USER_NAME: 'username',
  PASSWORD: 'password',
}

const myHeaders = new Headers({
  'Content-Type': 'application/json'
});

class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
    }
  }

  handleChange = field => (event) => {
    this.setState({ [field]: event.target.value });
  }

  onUserNameChange = (event) => {
    this.setState({ username: event.target.value });
  }

  onPassWordChange = (event) => {
    this.setState({ password: event.target.value });
  }

  redirectToUserNotes = (response) => {
    if (response.data) {
      const { history } = this.props;
      history.push('/notes');
    } else {
      this.setState({ error: 'User/Password is incorrect!' })
    }
  }

  handleSubmit = (event) => {
    const { username, password } = this.state;
    event.preventDefault();

    fetch('/api/login', { method: 'POST', headers: myHeaders, body: JSON.stringify({ username, password }) })
      .then(res => res.json())
      .then(this.redirectToUserNotes);
  }

  render() {
    const { username, password, error } = this.state;
    return (<div className="loginContainer">
      <Card>
        <CardContent>
          <form onSubmit={this.handleSubmit}>
            <div className="fieldsWrapper">
              {error && <div className="errorStyle">{error}</div>}
              <TextField
                name="username"
                label="User"
                placeholder="user@example.com"
                value={username}
                required
                onChange={this.handleChange(FIELD_IDS.USER_NAME)}
                variant="outlined"
                margin="normal"
              />
              <TextField
                name="password"
                label="Password"
                placeholder="1234"
                value={password}
                type="password"
                required
                onChange={this.handleChange(FIELD_IDS.PASSWORD)}
                variant="outlined"
                margin="normal"
              />
              <Button
                type="submit"
                color="primary"
                variant="contained"
                margin="normal"
              >
                Login
          </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
  }
}

export default withRouter(Login);
