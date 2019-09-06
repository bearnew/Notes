## animation example
```js
import React, { Component } from 'react';
import { Animated, InteractionManager } from 'react-native';

export default (WrappedComponent) => {
  class BreatheHoc extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
        opacityValue: new Animated.Value(0)
      };
    
      this.opacityAnimated = Animated.timing(
        this.state.opacityValue,
        {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true
        }
      );
    }

    componentDidMount() {
      InteractionManager.runAfterInteractions(this.init.bind(this));
    }

    componentWillUnmount() {
      this.opacityAnimated.stop();
    }

    init() {
      Animated.loop(
        this.opacityAnimated,
        {
          iterations: -1
        }
      ).start();
    }
  
    render() {
      const opacity = this.state.opacityValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.2, 1, 0.2]
      });

      return (
        <Animated.View
          style={{
            opacity
          }}
        >
          <WrappedComponent
            {...this.props}
          />
        </Animated.View>
      );
    }
  }
  return BreatheHoc;
};

```