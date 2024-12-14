import { render } from '@testing-library/react';
import React from 'react';
import SmsAndMailConfiguration from './sms-config';

// test(" snapshot test ",()=>
// {
//   const tree = renderer.create(<SmsAndMailConfiguration/>).toJSON();
//   console.log(tree);
//   expect(tree).toMatchSnapshot();
// })

it("shows all required input fields with empty values", () => {
  const { getByTestId } = render(
    <SmsAndMailConfiguration
    />
  );
  expect(getByTestId("input-smtpServer").value.length).toEqual(21)
});