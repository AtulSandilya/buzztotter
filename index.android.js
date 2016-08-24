import { AppRegistry, StyleSheet, Text, TouchableHighlight, View, ViewPagerAndroid } from 'react-native';
import React, { Component, PropTypes } from 'react';

const styles = StyleSheet.create({
  bevColorPrimary: {
    // Tealish Green
    backgroundColor: "#8ED0BA",
  },

  bevColorSecondary: {
    // Brown
    backgroundColor: "#8B5E3C",
  },

  bevColorActiveSecondary: {
    // Light Brown
    backgroundColor: "#AC9774",
  },

  whiteText: {
    color: "#ffffff",
  }
});

class Branding extends Component {
  static propTypes = {
    title: React.PropTypes.string,
  }

  static defaultProps = {
    title: "Bevegram"
  }

  render() {
    return(
      <View style={[{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }, styles.bevColorPrimary]}>
        <Text>{this.props.title}</Text>
      </View>
    );
  }
}

class MainNavigationButton extends Component {

  static propTypes = {
    label: React.PropTypes.string,
    isActive: React.PropTypes.bool,
    position: React.PropTypes.number,
    updateMenuPosition: React.PropTypes.func,
  }

  static defaultProps = {
    label: "Button",
    isActive: false,
    position: 0,
  }

  handlePress() {
    // Send the clicked button position to the parent
    this.props.updateMenuPosition(this.props.position);
  }

  render() {
    return(
      <TouchableHighlight
        onPress={this.handlePress.bind(this)}
        style={{flex: 1}}
      >
        <View style={[{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }, this.props.isActive ? styles.bevColorActiveSecondary : styles.bevColorSecondary]}>
          <Text
            style={styles.whiteText}
          >
          {this.props.label}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

class Contacts extends Component {
  render() {
    return(
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>
          You Have No Contacts Yet!
        </Text>
      </View>
    );
  }
}

class Drinks extends Component {
  render() {
    return(
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>
          No one has bought you a drink yet :(
        </Text>
      </View>
    );
  }
}

class BevegramLocations extends Component {
  render() {
    return(
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>
          Coming Soon!
        </Text>
      </View>
    );
  }
}

class Deals extends Component {
  render() {
    return(
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>
          There are no deals yet!
        </Text>
      </View>
    );
  }
}

class MainNavButtons extends Component {
  static propTypes = {
    activeButtonPos: React.PropTypes.number,
    updateMenuPosition: React.PropTypes.func,
  }

  static defaultProps = {
    activeButtonPos: 0,
  }

  render() {
    let activeArray = [false, false, false, false];
    activeArray[this.props.activeButtonPos] = true;
    return(
      <View style={[{
        flex: 1,
        flexDirection: 'row'
      }, styles.bevColorSecondary]}>
        <MainNavigationButton
          label="Contacts"
          isActive={activeArray[0]}
          position={0}
          updateMenuPosition={this.props.updateMenuPosition}
        />
        <MainNavigationButton
          label="Bevegrams"
          isActive={activeArray[1]}
          position={1}
          updateMenuPosition={this.props.updateMenuPosition}
        />
        <MainNavigationButton
          label="Map"
          isActive={activeArray[2]}
          position={2}
          updateMenuPosition={this.props.updateMenuPosition}
        />
        <MainNavigationButton
          label="Deals"
          isActive={activeArray[3]}
          position={3}
          updateMenuPosition={this.props.updateMenuPosition}
        />
      </View>
    );
  }
}

class MainUi extends Component {
  constructor(props){
    super(props);
    this.state = {
      menuPosition: 0,
    }
  }

  updateMenuPosition(newPosition){
    this.setState({
      menuPosition: newPosition,
    });
  }

  render() {
    return(
      <View style={{
        flex: 1,
      }}>
        <View style={{flex: 1}}>
          <Branding />
        </View>
        <View style={{flex: 8}}>
          <MainViewPager
            updateMenuPosition={this.updateMenuPosition.bind(this)}
            currentMenuPosition={this.state.menuPosition}
          />
        </View>
        <View style={{flex: 1}}>
          <MainNavButtons
            activeButtonPos={this.state.menuPosition}
            updateMenuPosition={this.updateMenuPosition.bind(this)}
          />
        </View>
      </View>
    );
  }
}

class MainViewPager extends Component {
  static propTypes = {
    updateMenuPosition: React.PropTypes.func,
    currentMenuPosition: React.PropTypes.number,
  }

  static defaultProps = {
    currentMenuPosition: 3,
  }

  onPageSelected(event){
    this.props.updateMenuPosition(event.nativeEvent.position);
  }

  componentWillReceiveProps(nextProps){
    this.viewPager.setPageWithoutAnimation(nextProps.currentMenuPosition);
  }

  render() {
    return(
      <ViewPagerAndroid
        style={{flex: 1}}
        initialPage={0}
        onPageSelected={this.onPageSelected.bind(this)}
        ref={viewPager => {this.viewPager = viewPager; }}
      >
        <View style={{flex: 1}}>
          <Contacts />
        </View>
        <View style={{flex: 1}}>
          <Drinks />
        </View>
        <View style={{flex: 1}}>
          <BevegramLocations />
        </View>
        <View style={{flex: 1}}>
          <Deals />
        </View>
      </ViewPagerAndroid>
    );
  }
}

class Bevegram extends Component {
  render() {
    return (
      <MainUi />
    );
  }
}

AppRegistry.registerComponent('Bevegram', () => Bevegram);
