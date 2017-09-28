import * as React from "react";

import { SizeName } from "../theme";
import BevButton from "./BevButton";

export interface FacebookLoginButtonProps {
  text: string;
  size: SizeName;
  onPress: () => void;
  showActivityIndicator?: boolean;
  marginTop?: number;
}

const FacebookButton: React.StatelessComponent<
  FacebookLoginButtonProps
> = props => {
  return (
    <BevButton
      onPress={props.onPress}
      text={props.text}
      shortText={props.text}
      iconType={"facebook"}
      fontSize={props.size}
      showSpinner={props.showActivityIndicator}
      type="facebook"
    />
  );
};

export default FacebookButton;
