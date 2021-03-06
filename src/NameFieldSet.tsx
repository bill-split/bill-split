import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { connect } from 'react-redux';
import { reduxSetNames } from './redux';
import * as React from 'react';

interface INameFieldSetProps {
  names: any;
  reduxSetNames: (names: string[]) => void;
  history: any; // TODO fix this
}

export interface INameFieldSetState {
  names: string[];
}

export class NameFieldSet extends React.Component<INameFieldSetProps, INameFieldSetState> {
  public state = {
    names: this.props.names,
  };

  public render() {
    const names = this.state.names.map((value: string, index: number) => {
      let minusBtn = null;
      let autoFocus = false;
      const namesLength = this.state.names.length;
      if ((namesLength === 2 && index === 0) || (namesLength > 2 && index === namesLength - 1)) {
        autoFocus = true;
      }
      if (index > 1) {
        minusBtn = (
          <IconButton aria-label="Remove person" onClick={this.remove(index)}>
            <RemoveCircleIcon style={{ height: '24px', width: '24px' }} />
          </IconButton>
        );
      }
      return (
        <div key={index} style={{ marginTop: '8px' }}>
          <TextField
            type="text"
            autoFocus={autoFocus}
            label="Name"
            value={value}
            onChange={this.changeName(index)}
            onKeyPress={this.setNamesOnEnterButton}
          />
          {minusBtn}
        </div>
      );
    });

    return (
      <div>
        <Typography variant="h5" component="h2">
          Easily split a restaurant or bar bill.
        </Typography>
        <Typography component="p">Bill split is free, and it works offline.</Typography>
        <Card style={{ marginBottom: '16px', marginTop: '16px' }}>
          <CardContent>
            <Typography component="p">Who is splitting the bill?</Typography>
            <div className="inputs" style={{ marginBottom: '16px' }}>
              {names}
            </div>
            <Button id="addBtn" variant="contained" color="secondary" aria-label="Add person" onClick={this.add}>
              <PersonAddIcon style={{ marginRight: '8px' }} />
              Add person
            </Button>
          </CardContent>
        </Card>
        <Button
          id="splitBtn"
          style={{ float: 'right' }}
          variant="contained"
          color="primary"
          onClick={this.setNames}
          disabled={!this.isValid()}
        >
          Split bill
          <NavigateNextIcon style={{ marginLeft: '8px' }} />
        </Button>
      </div>
    );
  }

  private setNames = () => {
    const newNames = [...this.removeBlankNamesFromNameArray(this.state.names)];
    this.props.reduxSetNames(newNames);
    this.setState({ ...this.state, names: newNames });
    this.props.history.push('/Items');
  };

  private add = () => {
    this.setState({ names: [...this.state.names, ''] });
  };

  private remove = (index: number) => () => {
    const names = [...this.state.names];
    names.splice(index, 1);
    this.setState({ names });
  };

  private nameArrayContainsDuplicates = () => {
    const uniqueNameSet: Set<string> = new Set();
    for (let i = 0; i <= this.state.names.length; i++) {
      if (this.state.names[i] == null) {
        continue;
      }
      const lowerCaseName = this.state.names[i].toLowerCase();
      if (uniqueNameSet.has(lowerCaseName)) {
        return true;
      }
      uniqueNameSet.add(lowerCaseName);
    }
    return false;
  };

  private nameArrayContainsEmptyName = () => {
    const index = this.state.names.indexOf('');
    return index !== -1 && index <= 1;
  };

  private removeBlankNamesFromNameArray = (names: string[]) => {
    return names.filter(name => !this.isEmptyOrSpaces(name));
  };

  private setNamesOnEnterButton = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' && this.isValid()) {
      this.setNames();
    }
  };

  private isEmptyOrSpaces = (s: string) => {
    if (s === undefined) {
      return true;
    }
    return s === null || s.match(/^ *$/) !== null;
  };

  private isValid = () => {
    if (this.nameArrayContainsDuplicates()) {
      return false;
    }
    return !this.nameArrayContainsEmptyName();
  };

  private changeName = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNames: string[] = [...this.state.names];
    newNames[index] = event.target.value!;
    this.setState({ names: newNames });
  };
}

// AppContainer.js
const mapStateToProps = (state: { names: any }) => ({
  names: state.names,
});

const mapDispatchToProps = {
  reduxSetNames,
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameFieldSet);

export default AppContainer;
