import React, { Component } from 'react'

import {
  TextInput,
  findNodeHandle,
  NativeModules,
  Platform
} from 'react-native'

const mask = NativeModules.RNTextInputMask.mask
const unmask = NativeModules.RNTextInputMask.unmask
const setMask = NativeModules.RNTextInputMask.setMask
export { mask, unmask, setMask }

export default class TextInputMask extends Component {
  static defaultProps = {
    maskDefaultValue: true,
  }

  masked = false

  componentDidMount() {
    if (this.props.value && !this.props.mask) {
      return this.input && this.input.setNativeProps({ text: this.props.value })
    }

    if (this.props.maskDefaultValue && this.props.mask && this.props.value) {
      setMask(findNodeHandle(this.input), this.props.mask, this.props.value)
      return mask(this.props.mask, '' + this.props.value, text =>
        this.input && this.input.setNativeProps({ text }),
      )
    }

    if (this.props.mask && !this.masked) {
      this.masked = true
      return setMask(findNodeHandle(this.input), this.props.mask, this.props.value)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(Platform.OS === 'ios') {
      if (nextProps.mask && (this.props.value !== nextProps.value)) {
        setMask(findNodeHandle(this.input), nextProps.mask, nextProps.value)
      }
    } else {
      if (nextProps.mask && (this.props.value !== nextProps.value)) {
        mask(this.props.mask, '' + nextProps.value, text => this.input && this.input.setNativeProps({ text }))
      }

      if (this.props.mask !== nextProps.mask) {
        setMask(findNodeHandle(this.input), nextProps.mask, nextProps.value)
      }
    }
  }

  render() {
    return (<TextInput
      {...this.props}
      value={undefined}
      ref={ref => {
        this.input = ref
        if (typeof this.props.refInput === 'function') {
          this.props.refInput(ref)
        }
      }}
      multiline={this.props.mask && Platform.OS === 'ios' ? false : this.props.multiline}
      onChangeText={masked => {
        if (this.props.mask) {
          const _unmasked = unmask(this.props.mask, masked, unmasked => {
            this.props.onChangeText && this.props.onChangeText(masked, unmasked)
          })
        } else {
          this.props.onChangeText && this.props.onChangeText(masked)
        }
      }}
    />);
  }
}
