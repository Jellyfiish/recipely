import React from 'react';
import { Button } from 'react-native-elements';

const CustomButton = (props) => (
  <Button
    color='white'
    backgroundColor="#397af8"
    fontWeight='bold'
    raised
    {...props}
  />
);

export default CustomButton;
