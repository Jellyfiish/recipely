import React from 'react';
import { Button } from 'react-native-elements';

const CustomButton = (props) => (
  <Button
    backgroundColor="#397af8"
    raised
    fontWeight='bold'
    {...props}
  />
);

export default CustomButton;
